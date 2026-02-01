const { EmbedBuilder } = require("discord.js");
const { sendError } = require("../../../../tools/error-catcher.js");
const { updateValue } = require("../../../../tools/database.js");
const { getCurrencySymbol, simplify } = require("../../../../tools/modules.js");

module.exports = {
    async execute(interaction, client) {
        try {
            const buttonContent = interaction.customId.split("_");
            const ennemies = {
                "🔽 Sani Ruyu": { "health": 25, "defense": 0, "attack": 5, "bonus": 1 },
                "🔺 Sani Miya": { "health": 30, "defense": 0, "attack": 10, "bonus": 3 },
                "🟦 Bururu Tsuru": { "health": 40, "defense": 5, "attack": 10, "bonus": 5 },
                "🧊 Bururu Norisi": { "health": 40, "defense": 10, "attack": 5, "bonus": 5 },
                "🔥 Bururu Miya": { "health": 40, "defense": 5, "attack": 15, "bonus": 5 },
                "🔷 Bururu Rono": { "health": 50, "defense": 10, "attack": 15, "bonus": 5 },
                "🔹 Bururu Foi": { "health": 30, "defense": 15, "attack": 10, "bonus": 5 }
            };
            const ennemy = Object.keys(ennemies)[Math.floor(Math.random() * Object.keys(ennemies).length)];
            const ennemyDefense = ennemies[ennemy]["defense"];
            const ennemyAttack = ennemies[ennemy]["attack"];
            const ennemyBonus = ennemies[ennemy]["bonus"];
            let ennemyHealth = ennemies[ennemy]["health"];
            let characterName = "";
            let characterHealth = 0;
            let characterDefense = 0;
            let characterAttack = 0;

            switch (buttonContent[1]) {
                case "suyasomin":
                    characterName = "💫 Suyasomin";
                    characterHealth = 50;
                    characterDefense = 10;
                    characterAttack = 10;
                    break;

                case "inosayo":
                    characterName = "🔥 Inosayo";
                    characterHealth = 75;
                    characterDefense = 40;
                    characterAttack = 15;
                    break;

                case "oseitena":
                    characterName = "🌌 Oseitena";
                    characterHealth = 100;
                    characterDefense = 20;
                    characterAttack = 25;
                    break;

                case "mijilse":
                    characterName = "🎴 Mijilse";
                    characterHealth = 50;
                    characterDefense = 15;
                    characterAttack = 20;
                    break;
            }

            const fightEmbed = new EmbedBuilder()
                .setColor([83, 0, 87])
                .setDescription(`## ${characterName}　🆚　${ennemy}`)
                .setFields(
                    { name: characterName, value: `${characterHealth} ❤️ ${characterDefense} 🛡️ ${characterAttack} 👊`, inline: true },
                    { name: ennemy, value: `${ennemyHealth} ❤️ ${ennemyDefense} 🛡️ ${ennemyAttack} 👊`, inline: true })
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

            await interaction.update({ embeds: [fightEmbed], components: [] });

            let hasWon;

            setTimeout(async () => {
                let round = 1;

                const attackLoop = setInterval(async () => {
                    const realRound = Math.ceil(round / 2);
                    let damage
                    let attacker;
                    let opponent;

                    if (characterHealth <= 0 || realRound >= 26) {
                        hasWon = false;
                        clearInterval(attackLoop);
                        return await endFight(round);
                    }
                    if (ennemyHealth <= 0) {
                        hasWon = true;
                        clearInterval(attackLoop);
                        return await endFight(round);
                    }

                    if (round % 2 === 0) {
                        damage = Math.max(0, Math.floor(Math.random() * ennemyAttack) - characterDefense);
                        characterHealth -= damage;
                        attacker = ennemy;
                        opponent = characterName;
                    } else {
                        damage = Math.max(0, Math.floor(Math.random() * characterAttack) - ennemyDefense);
                        ennemyHealth -= damage;
                        attacker = characterName;
                        opponent = ennemy;
                    }

                    characterHealth = Math.max(0, characterHealth);
                    ennemyHealth = Math.max(0, ennemyHealth);

                    const fightEmbed = new EmbedBuilder()
                        .setColor([83, 0, 87])
                        .setTitle(`${characterName}　🆚　${ennemy} (#${realRound})`)
                        .setDescription(`> ${attacker} fait **${damage}** dégâts à ${opponent} !`)
                        .setFields(
                            { name: characterName, value: `${characterHealth} ❤️ ${characterDefense} 🛡️ ${characterAttack} 👊`, inline: true },
                            { name: ennemy, value: `${ennemyHealth} ❤️ ${ennemyDefense} 🛡️ ${ennemyAttack} 👊`, inline: true })
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                    await interaction.editReply({ embeds: [fightEmbed], components: [] });

                    round++;
                }, 1_500);
            }, 3_000);

            async function endFight(totalRound) {
                if (hasWon) {
                    const randomPrize = Math.max((Math.floor(Math.random() * 2_500) + (1_000 * ennemyBonus)) - (100 * totalRound), 250);

                    await updateValue(interaction.user.id, "users", "toki-coin", randomPrize);

                    const fightEmbed = new EmbedBuilder()
                        .setColor([83, 0, 87])
                        .setDescription(`## ${characterName} a gagné !\n\nTu remportes ${await simplify(interaction.user.id, randomPrize)} ${getCurrencySymbol("toki-coin")} !`)
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                    await interaction.editReply({ embeds: [fightEmbed], components: [] });
                } else {
                    const fightEmbed = new EmbedBuilder()
                        .setColor([83, 0, 87])
                        .setDescription(`## ${characterName} a perdu...`)
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                    await interaction.editReply({ embeds: [fightEmbed], components: [] });
                }
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};