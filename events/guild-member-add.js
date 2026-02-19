const { PermissionsBitField } = require("discord.js");
const { hasValue } = require("../tools/database.js");
const { updateMemberCounts } = require("../tools/modules.js");

module.exports = {
    name: "guildMemberAdd",
    async execute(member, client) {
        if (member.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers) && await hasValue(member.guild.id, "guilds", "anti-bot") && member.user.bot)
            await member.ban({ reason: "Anti-bot activé." });

        if (member.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers) && await hasValue(member.guild.id, "guilds", "anti-raid")) {
            await client.users.send(member.id, `Tu ne peux pas rejoindre le serveur ${member.guild.name} pour l'instant, une mesure anti-raid a été mise en place !`);
            await member.kick({ reason: "Anti-raid activé." });
        } else {
            if (member.guild.id === process.env.GUILD_COMMANDS_ID) {
                const welcomeKoruSticker = await member.guild.stickers.fetch("1008095948938936352");

                await member.roles.add("805878889725165578");
                await member.guild.channels.cache.find(channel => channel.id === "882258016160858122").send({ content: `> ➜ **${member.user.username}** a rejoint le serveur Yunayunori, bienvenue~~♪ ! :D\n** **`, stickers: [welcomeKoruSticker] });
                await updateMemberCounts(client);
            } else if (member.guild.id === "827879505884348456") {
                const welcomeTokiSticker = await member.guild.stickers.fetch("987038979901759559");
                await member.guild.channels.cache.find(channel => channel.id === "827879506588467205").send({ content: `> ➜ **${member.user.username}** a rejoint le serveur TokinoSupport, bienvenue~~♪ ! :D\n** **`, stickers: [welcomeTokiSticker] });
            } else if (member.guild.id === "810144287508791316") {
                const welcomeSeychellesSticker = await member.guild.stickers.fetch("1007356480535658567");
                await member.guild.channels.cache.find(channel => channel.id === "924286286536265828").send({ content: `> ➜ **${member.user.username}** a rejoint le serveur Yunranotesuto, bienvenue~~♪ ! :D\nC'est le serveur officiel de tests de Tokinotsuki jusqu'à la v3, bravo de l'avoir trouvé !\n*🇸🇨 Note : ce serveur approuve à 999,99% le drapeau des Seychelles 🇸🇨*\n** **`, stickers: [welcomeSeychellesSticker] });
            } else if (member.guild.id === "1330243005440856217") {
                await member.guild.channels.cache.find(channel => channel.id === "1370173135940354138").send({ content: `> ➜ **${member.user.username}** a rejoint Time Rebuild Project, bienvenue~~♪ ! :D\nC'est le serveur officiel de tests de Tokinotsuki pour la v4, félicitations de l'avoir trouvé !` });
            }
        }
    }
};