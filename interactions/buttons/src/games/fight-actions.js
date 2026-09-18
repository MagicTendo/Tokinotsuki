const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { resetCooldown } = require("../../../../tools/cooldown.js");
const { updateValue } = require("../../../../tools/database.js");
const { sendError } = require("../../../../tools/error-catcher.js");
const { getCurrencySymbol, simplify } = require("../../../../tools/modules.js");

module.exports = {
    async execute(interaction, client) {
        try {
            const buttonContent = interaction.customId.split("_");
            const userID = interaction.user.id;
            const attackDuration = 1_500;
            const fightAction = buttonContent[1];
            const fighterName = buttonContent[2];
            const fighterDefense = Number(buttonContent[4]);
            const fighterAttack = Number(buttonContent[5]);
            let fighterHealth = Number(buttonContent[3]);
            let enemyName = buttonContent[6];
            let enemyHealth = Number(buttonContent[7]);
            let enemyDefense = Number(buttonContent[8]);
            let enemyAttack = Number(buttonContent[9]);
            let enemyBonus = Number(buttonContent[10]);
            let round = Number(buttonContent[11] ?? 1);
            let automaticLoopID = Number(buttonContent[12] ?? 0);
            let isPlayerTurn = true;
            let isGameFinished = false;

            async function endFight(hasWon) {
                automaticLoopID = 0;
                isGameFinished = true;

                if (hasWon) {
                    const randomPrize = Math.max((Math.floor(Math.random() * 2_500) + (1_000 * enemyBonus)) - (100 * round), 250);

                    await updateValue(interaction.user.id, "users", "toki-coin", randomPrize);

                    const fightWinEmbed = new EmbedBuilder(interaction.message.embeds[0].data)
                        .setTitle(`${fighterName} a gagné !`)
                        .setDescription(`\`\`\`fix\n> Tu as survécu ${round} tours. Tu remportes ${await simplify(interaction.user.id, randomPrize)} ${getCurrencySymbol("toki-coin")} !\n\`\`\``)
                        .spliceFields(0, 2);

                    await interaction.editReply({ embeds: [fightWinEmbed], components: [] });
                } else {
                    const fightDefeatEmbed = new EmbedBuilder(interaction.message.embeds[0].data)
                        .setTitle(`${fighterName} a perdu...`)
                        .setDescription(`\`\`\`fix\n> Tu as survécu ${round - 1} tours.\n\`\`\``)
                        .spliceFields(0, 2);

                    await interaction.editReply({ embeds: [fightDefeatEmbed], components: [] });
                }
            }

            async function attack() {
                if (!isGameFinished) {
                    let damage;
                    let attackerName;
                    let opponentName;

                    if (isPlayerTurn) {
                        damage = Math.max(0, Math.floor(Math.random() * fighterAttack) + 3 - enemyDefense);
                        attackerName = fighterName;
                        opponentName = enemyName;
                        isPlayerTurn = false;

                        enemyHealth -= damage;
                    } else {
                        damage = Math.max(0, Math.floor(Math.random() * enemyAttack) + 3 - fighterDefense);
                        attackerName = enemyName;
                        opponentName = fighterName;
                        isPlayerTurn = true;
                        round++;

                        fighterHealth -= damage;
                    }

                    await updateDescription(`${attackerName} fait **${damage}** dégâts à ${opponentName} !`);
                    await updateFightMessage();
                }
            }

            async function updateDescription(message) {
                if (!isGameFinished) {
                    const fightAttackedEmbed = new EmbedBuilder(interaction.message.embeds[0].data)
                        .setDescription(`> *${message}*`);

                    interaction.replied ? await interaction.editReply({ embeds: [fightAttackedEmbed] }) : await interaction.update({ embeds: [fightAttackedEmbed] });
                }
            }

            async function updateFightMessage() {
                if (!isGameFinished) {
                    if (fighterHealth <= 0 || round > 30) {
                        await endFight(false);
                    } else if (enemyHealth <= 0) {
                        await endFight(true);
                    } else {
                        const fightData = `${fighterName}_${fighterHealth}_${fighterDefense}_${fighterAttack}_${enemyName}_${enemyHealth}_${enemyDefense}_${enemyAttack}_${enemyBonus}_${round}_${automaticLoopID}`;
                        let fightButtons;

                        if (!automaticLoopID) {
                            fightButtons = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setEmoji({ name: "⚔️" })
                                    .setLabel("Attaquer")
                                    .setStyle(ButtonStyle.Success)
                                    .setDisabled(!isPlayerTurn)
                                    .setCustomId(`fight_attack_${fightData}_${userID}`),
                                new ButtonBuilder()
                                    .setEmoji({ name: "💗" })
                                    .setLabel("Soigner")
                                    .setStyle(ButtonStyle.Danger)
                                    .setDisabled(!isPlayerTurn)
                                    .setCustomId(`fight_heal_${fightData}_${userID}`),
                                new ButtonBuilder()
                                    .setEmoji({ name: "🚪" })
                                    .setLabel("Fuir")
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(!isPlayerTurn)
                                    .setCustomId(`fight_flee_${fightData}_${userID}`),
                                new ButtonBuilder()
                                    .setEmoji({ name: "⚙️" })
                                    .setLabel("Mode automatique")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setDisabled(!isPlayerTurn)
                                    .setCustomId(`fight_automatic_${fightData}_${userID}`));
                        } else {
                            fightButtons = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setEmoji({ name: "🚫" })
                                    .setLabel("Arrêter le mode automatique")
                                    .setStyle(ButtonStyle.Danger)
                                    .setDisabled(!isPlayerTurn)
                                    .setCustomId(`fight_stop-automatic_${fightData}_${userID}`));
                        }

                        const newFightEmbed = new EmbedBuilder(interaction.message.embeds[0].data)
                            .setTitle(`${fighterName}　🆚　${enemyName} #${round}`)
                            .setFields(
                                { name: fighterName, value: `${fighterHealth} ❤️ ${fighterDefense} 🛡️ ${fighterAttack} 👊`, inline: true },
                                { name: enemyName, value: `${enemyHealth} ❤️ ${enemyDefense} 🛡️ ${enemyAttack} 👊`, inline: true });

                        interaction.replied ? await interaction.editReply({ embeds: [newFightEmbed], components: [fightButtons] }) : await interaction.update({ embeds: [newFightEmbed], components: [fightButtons] });
                    }
                }
            }

            if (!isGameFinished) {
                switch (fightAction) {
                    case "start":
                        const enemies = {
                            "🔽 Sani Ruyu": { "health": 25, "defense": 1, "attack": 5, "bonus": 1 },
                            "🔺 Sani Miya": { "health": 30, "defense": 3, "attack": 10, "bonus": 3 },
                            "🟦 Bururu Tsuru": { "health": 40, "defense": 5, "attack": 10, "bonus": 5 },
                            "🧊 Bururu Norisi": { "health": 40, "defense": 8, "attack": 5, "bonus": 5 },
                            "🔥 Bururu Miya": { "health": 40, "defense": 5, "attack": 15, "bonus": 5 },
                            "🔷 Bururu Rono": { "health": 50, "defense": 8, "attack": 15, "bonus": 5 },
                            "🔹 Bururu Foi": { "health": 30, "defense": 0, "attack": 10, "bonus": 5 }
                        };

                        enemyName = Object.keys(enemies)[Math.floor(Math.random() * Object.keys(enemies).length)];

                        const enemy = enemies[enemyName];

                        enemyHealth = enemy["health"];
                        enemyAttack = enemy["attack"];
                        enemyDefense = enemy["defense"];
                        enemyBonus = enemy["bonus"];

                        await updateFightMessage();
                        break;

                    case "attack":
                        await attack();

                        setTimeout(async () => {
                            await attack();
                        }, attackDuration);
                        break;

                    case "heal":
                        isPlayerTurn = false;

                        const heal = Math.max(0, Math.floor(Math.random() * Math.ceil(fighterDefense / 4 + 3)));

                        fighterHealth += heal;

                        await updateDescription(`${fighterName} se soigne, et gagne **${heal}** ❤️ !`);
                        await updateFightMessage();

                        setTimeout(async () => {
                            await attack();
                        }, attackDuration);
                        break;

                    case "flee":
                        isPlayerTurn = false;

                        const fleeRandomChance = Math.floor(Math.random() * 3);

                        await updateDescription(`${fighterName} tente de fuir !`);
                        await updateFightMessage();

                        setTimeout(async () => {
                            if (fleeRandomChance === 0) {
                                await resetCooldown(userID, "fight");

                                const fightFleeEmbed = new EmbedBuilder(interaction.message.embeds[0].data)
                                    .setTitle(`${fighterName} a pris la fuite...`)
                                    .setDescription(`\`\`\`fix\n> Tu as survécu ${round} tours.\n\`\`\``)
                                    .spliceFields(0, 2);

                                await interaction.editReply({ embeds: [fightFleeEmbed], components: [] });
                            } else {
                                await attack();
                            }
                        }, attackDuration);
                        break;

                    case "automatic":
                        automaticLoopID = 1;
                        isPlayerTurn = false;

                        await updateDescription(`🔄️ Mode automatique activé !`);
                        await updateFightMessage();

                        automaticLoopID = setInterval(async () => {
                            await attack();
                        }, attackDuration / 2);
                        break;

                    case "stop-automatic":
                        clearInterval(automaticLoopID);

                        automaticLoopID = 0;

                        await updateDescription(`🔄️ Mode automatique déactivé !`);
                        await updateFightMessage();
                        break;
                }
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};