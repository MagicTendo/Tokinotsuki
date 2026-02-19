const { deleteKey } = require("../tools/database.js");
const { updateMemberCounts } = require("../tools/modules.js");

module.exports = {
    name: "guildMemberRemove",
    async execute(member, client) {
        const userID = member.id;

        if (member.user.username.startsWith("deleted_user_") && member.user.username === null && member.user.avatar === null && member.user.accentColor === null)
            await deleteKey(userID, "users");

        if (member.guild.id === process.env.GUILD_COMMANDS_ID) {
            await member.guild.channels.cache.find(channel => channel.id === "882258016160858122").send({ content: `> ➜ **${member.user.username}** a quitté le serveur...` });
            await updateMemberCounts(client);
        } else if (member.guild?.id === "827879505884348456") {
            await member.guild.channels.cache.find(channel => channel.id === "827879506588467205").send({ content: `> ➜ **${member.user.username}** a quitté le serveur...` });
        } else if (member.guild?.id === "810144287508791316") {
            await member.guild.channels.cache.find(channel => channel.id === "924286286536265828").send({ content: `> ➜ **${member.user.username}** a quitté le serveur...` });
        } else if (member.guild?.id === "1330243005440856217") {
            await member.guild.channels.cache.find(channel => channel.id === "1370173135940354138").send({ content: `> ➜ **${member.user.username}** a quitté le serveur...` });
        }
    }
};