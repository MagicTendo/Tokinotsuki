const { EmbedBuilder, PermissionsBitField, ChannelType, MessageFlags } = require("discord.js");
const { readFileSync } = require("fs");
const { getValue, hasValue, updateValue } = require("../tools/database.js");
const { isLink } = require("../tools/modules.js");
const { levelsXP, specialLevels, rolesLevel } = require("../tools/xp-levels.js");

module.exports = {
    name: "messageCreate",
    async execute(message, client) {
        if (message.author.bot) return;

        const userID = message.author.id;

        if (message.channel.type === ChannelType.DM) {
            if (message.content.toLowerCase().includes("code")) {
                const codesJSON = readFileSync("./json/codes.json", "utf-8");
                const codeList = JSON.parse(codesJSON);

                if (userID in codeList) {
                    if (codeList[userID][0] in codeList) {
                        await message.reply(`Oh, salut ${message.author.globalName}, ça fait longtemps ! :D\nMerci d'avoir joué avec moi dans la version précédante ! Pour te remercier, voici ton code pour avoir finit ${userCodes[userID][1]} dans le classement ${userCodes[userID][2]} !\n> # \`${userCodes[userID][0]}\``);
                    } else {
                        await message.reply("Tu as déjà récupéré ton code ! :D");
                    }
                } else {
                    await message.reply("Salut ! Désolé, mais non, tu n'es malheureusement pas éligible pour avoir un code D:");
                }
            } else if (message.content.toLowerCase().includes("cirno")) {
                await fetch("https://img.paulzzh.com/touhou/random?type=json&tag=cirno").then(function (response) {
                    return response.json();
                }).then(async function (data) {
                    const cirnoImage = await data["jpegurl"];

                    await message.reply(cirnoImage);
                });
            } else if (message.content.toLowerCase().includes("🍪")) {
                await message.reply("🍪");
            }
        } else if (message.channel.id === await getValue(message.guild.id, "guilds", "counting")) {
            const lastNumber = await message.channel.messages.fetch({ limit: 2 });

            if (Number(message.content) - 1 !== Number(lastNumber.last().content) && !(lastNumber.size === 1 && (Number(message.content) === 0 || Number(message.content) === 1)))
                await message.delete();
        } else if (message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages) && await isLink(message.content.replaceAll(" ", "")) && await hasValue(message.guild.id, "guilds", "anti-link")) {
            const antilinkRole = await getValue(message.guild.id, "guilds", "anti-link-role");

            if (antilinkRole !== 0 && message.member.roles.cache.some(role => role.id === antilinkRole))
                return;

            await message.delete();
            await client.users.send(message.author.id, "J'ai supprimé ton message car les liens ne sont pas autorisés ici !");
        } else if (message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages) && await hasValue(message.guild.id, "guilds", "anti-scam")) {
            const flagWords = ["18", "@everyone", "@here", "crypto", "free", "http", "join", "nitro", "nsfw", "nude", "telegram"];
            let flags = 0;

            for (let i = 0; i < flagWords.length; i++) {
                if (message.content.includes(flagWords[i]))
                    flags += 1;
            }

            if (flags >= 3 || (message.attachments.size >= 1 && (message.content.includes("@everyone") || message.content.includes("@here"))))
                await message.delete();
        } else if ((message.mentions.has(client.user) && !message.mentions.everyone && !message.mentions.repliedUser) || message.content === ">help") {
            await message.reply("Oh, salut ! :D\nJe fonctionne essentiellement avec les commandes slashs, à quelques exceptions près. Pour en savoir plus, regarde mes commandes avec le `/help`, ou consulte ma documentation sur [Tokinotsuki.rf.gd](https://tokinotsuki.rf.gd) !");
        }

        if (message.guild.id === process.env.GUILD_COMMANDS_ID) {
            const maximum = 150;
            const minimum = 2;
            const rawBonus = message.content.length / 4;
            const rawMinimum = message.content.length / 1.25 + 0.8;
            const rawXP = Math.max(Math.random() * message.content.length + rawBonus, rawMinimum);
            const xp = Math.floor(Math.min(Math.max(rawXP, minimum), maximum));

            await updateValue(userID, "users", "xp", xp);

            const currentXP = await getValue(userID, "users", "xp");
            const currentLevel = await getValue(userID, "users", "level");

            if (currentXP >= levelsXP[currentLevel]) {
                const newLevel = currentLevel + 1;
                const username = client.guilds.cache.get(message.guildId).members.cache.get(message.author.id)?.nickname ?? message.author.globalName ?? message.author.username;

                await updateValue(userID, "users", "level", newLevel);

                const userProfilePicture = message.author.displayAvatarURL({ extension: "png", size: 4_096, dynamic: true });
                let levelUpEmbed = new EmbedBuilder()
                    .setColor([255, 85, 0])
                    .setTitle(`${username} a gagné un niveau !`)
                    .setThumbnail(userProfilePicture)
                    .setTimestamp()
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                if (specialLevels.includes(newLevel)) {
                    const levelUpRoleID = rolesLevel[newLevel];

                    await client.guilds.cache.get(message.guildId).members.cache.get(message.author.id).roles.add(levelUpRoleID);

                    levelUpEmbed = new EmbedBuilder(levelUpEmbed.data)
                        .setDescription(`Félicitations <@${userID}> ! Tu es maintenant niveau **${newLevel}**, et tu as obtenu le rôle <@&${levelUpRoleID}> !`);
                } else {
                    levelUpEmbed = new EmbedBuilder(levelUpEmbed.data)
                        .setDescription(`Bravo <@${userID}>, tu es maintenant niveau **${newLevel}** !`);
                }

                await client.channels.fetch(process.env.XP_CHANNEL_ID).then(async channel => {
                    await channel.send({ content: `<@${userID}>` }).then(async message => message.delete());
                    await channel.send({ embeds: [levelUpEmbed] });
                });
            }

            const randomCookieChance = Math.floor(Math.random() * 100);

            if (randomCookieChance === 0) {
                await message.react("🍪");

                const cookieCollector = message.createReactionCollector({ filter: (reaction, user) => reaction.emoji.name === "🍪" && !user.bot, limit: 1, time: 60_000 });

                cookieCollector.on("collect", async (reaction, user) => {
                    const userID = user.id;

                    await updateValue(userID, "users", "cookie", 1);

                    await message.channel.send({ content: `<@${userID}> as obtenu 1 ${getCurrencySymbol("cookie")} !`, flags: MessageFlags.Ephemeral });

                    await cookieCollector?.stop();
                });

                cookieCollector.on("end", async (collected, reason) => {
                    if (reason !== "messageDelete")
                        await message.reactions.removeAll();
                });
            }
        }
    }
};