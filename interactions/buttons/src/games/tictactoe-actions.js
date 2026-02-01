const { EmbedBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { sendError } = require("../../../../tools/error-catcher.js");
const { tictactoeFlags } = require("../../../../tools/flags.js");
const { updateValue } = require("../../../../tools/database.js");
const { getCurrencySymbol } = require("../../../../tools/modules.js");

module.exports = {
    async execute(interaction, client) {
        try {
            async function checkBoard(lock = false) {
                if (!lock) {
                    const winningCombinations = [[[0, 0], [0, 1], [0, 2]], [[1, 0], [1, 1], [1, 2]], [[2, 0], [2, 1], [2, 2]], [[0, 0], [1, 0], [2, 0]], [[0, 1], [1, 1], [2, 1]], [[0, 2], [1, 2], [2, 2]], [[0, 0], [1, 1], [2, 2]], [[0, 2], [1, 1], [2, 0]]];

                    for (let i = 0; i < winningCombinations.length; i++) {
                        const [first, second, third] = winningCombinations[i];

                        if (tictactoeButtons[first[0]].components[first[1]].data.emoji.name === "🍙" && tictactoeButtons[second[0]].components[second[1]].data.emoji.name === "🍙" && tictactoeButtons[third[0]].components[third[1]].data.emoji.name === "🍙")
                            return tictactoeFlags.userWin;
                        if (tictactoeButtons[first[0]].components[first[1]].data.emoji.name === "⌚" && tictactoeButtons[second[0]].components[second[1]].data.emoji.name === "⌚" && tictactoeButtons[third[0]].components[third[1]].data.emoji.name === "⌚")
                            return tictactoeFlags.tokiWin;
                    }
                }

                let lockedCase = 0;

                for (let i = 0; i < 3; i++) {
                    const column = i;

                    for (let j = 0; j < 3; j++) {
                        const row = j;
                        const block = tictactoeButtons[row].components[column].data;

                        lock ? block.disabled = true : block.disabled ? lockedCase++ : "";
                    }
                }

                if (lockedCase === 9)
                    return tictactoeFlags.tie;

                return tictactoeFlags.continue;
            }

            async function endGame(flag) {
                let message;

                if (flag !== tictactoeFlags.tie)
                    await checkBoard(true);
                if (flag === tictactoeFlags.tokiWin)
                    message = "J'ai gagnée !";
                if (flag === tictactoeFlags.tie)
                    message = "C'est une égalité !";
                if (flag === tictactoeFlags.userWin) {
                    const reward = Math.floor(Math.random() * 25) + 25;

                    await updateValue(interaction.user.id, "users", "toki-coin", reward);

                    message = `Tu as gagné ! Tu remportes ${reward} ${getCurrencySymbol("toki-coin")} !`;
                }

                tictactoeEmbed.setDescription(`### ${message}`);

                await interaction.update({ embeds: [tictactoeEmbed], components: tictactoeButtons });
            }

            const buttonContent = interaction.customId.split("_");
            const column = buttonContent[1];
            const row = Number(buttonContent[2]);
            const randomColumn = Math.floor(Math.random() * 3);
            const randomStartRow = Math.floor(Math.random() * 3);
            const tictactoeEmbed = new EmbedBuilder(interaction.message.embeds[0].data);
            const tictactoeButtons = [new ActionRowBuilder().addComponents(interaction.message.components[0].components), new ActionRowBuilder().addComponents(interaction.message.components[1].components), new ActionRowBuilder().addComponents(interaction.message.components[2].components)];
            const userMove = tictactoeButtons[row].components[column].data;
            let gameFlag;

            userMove.emoji.name = "🍙";
            userMove.style = ButtonStyle.Primary;
            userMove.disabled = true;

            gameFlag = await checkBoard();

            if (gameFlag === tictactoeFlags.userWin)
                return await endGame(tictactoeFlags.userWin);

            for (let i = 0; i < 9; i++) {
                const randomRow = Math.floor(((randomStartRow + i) % 9) / 3);
                const tokiMove = tictactoeButtons[randomRow].components[(randomColumn + i) % 3].data;

                if (tokiMove.disabled !== true) {
                    tokiMove.emoji.name = "⌚";
                    tokiMove.style = ButtonStyle.Danger;
                    tokiMove.disabled = true;

                    break;
                }
            }

            gameFlag = await checkBoard();

            if (gameFlag === tictactoeFlags.tokiWin || gameFlag === tictactoeFlags.tie)
                return await endGame(gameFlag);
            if (gameFlag === tictactoeFlags.continue)
                await interaction.update({ embeds: [tictactoeEmbed], components: tictactoeButtons });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};