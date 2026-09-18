const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { readFileSync, writeFileSync } = require("fs");
const { sendError } = require("../../../tools/error-catcher.js");
const { updateValue } = require("../../../tools/database.js");
const { simplify } = require("../../../tools/modules.js");

module.exports = {
    category: "Jeux",
    data: new SlashCommandBuilder()
        .setName("claim-code")
        .setDescription("Pour obtenir des récompenses avec un code.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addStringOption(option => option
            .setName("code")
            .setDescription("Entre le code, le format doit être 000-AAA-000.")
            .setRequired(true)),
    async execute(interaction, client) {
        try {
            const code = interaction.options.getString("code").toUpperCase();
            const userID = interaction.user.id;
            const codeList = readFileSync("./json/codes.json", "utf8");
            const codes = JSON.parse(codeList);

            if (Object.keys(codes).includes(code)) {
                const codeOwner = codes[code]["owner"];
                const codeExpiration = codes[code]["expiration"];

                if ((codeOwner === "0" || codeOwner === userID) && !codes[code]["used"]?.includes(userID)) {
                    if (codeExpiration === 0 || Date.now() <= codeExpiration) {
                        const prizes = Object.keys(codes[code]);
                        let prizelist = "";

                        for (let i = 0; i < prizes.length; i++) {
                            const prizeName = prizes[i];

                            if (prizeName === "owner")
                                break;

                            const prizeAmount = codes[code][prizes[i]];

                            await updateValue(userID, "users", prizeName, prizeAmount);

                            prizelist += `${await simplify(userID, prizeAmount)} ${prizeName === "toki-coin" ? "Toki Coin" : `${prizeName}(s)`}, `;
                        }

                        prizelist = prizelist.slice(0, -2).replace(/,([^,]*)$/, " et$1");

                        if (codeOwner === 0)
                            codes[code]["used"].push(userID);
                        else
                            delete codes[code];

                        await interaction.reply({ content: `Tu as gagné ${prizelist} !` });
                    } else {
                        delete codes[code];

                        await interaction.reply({ content: "❌ Ce code a expiré ! Il est maintenant supprimé de la base de données !", flags: [MessageFlags.Ephemeral] });
                    }

                    writeFileSync("./json/codes.json", JSON.stringify(codes, null, 4));
                } else {
                    await interaction.reply({ content: "❌ Tu ne peux pas ou plus utiliser ce code !", flags: [MessageFlags.Ephemeral] });
                }
            } else {
                await interaction.reply({ content: `❌ Le code \`${code}\` est invalide ! Vérifies qu'il soit bien correcte ou qu'il ne soit pas expiré !`, flags: [MessageFlags.Ephemeral] });
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};