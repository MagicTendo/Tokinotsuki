const { readFileSync } = require("fs");

module.exports = {
    name: "messageReactionAdd",
    async execute(reaction, user) {
        if (reaction.emoji.name === "🍰" && reaction.message.guildId === process.env.GUILD_COMMANDS_ID && !user.bot) {
            const currentYearCake = readFileSync("./json/current-year-cake.json", "utf8");
            const currentYearCakeData = JSON.parse(currentYearCake);

            if (reaction.message.id === currentYearCakeData["current-year-cake-message-id"])
                await reaction.message.guild.members.cache.get(user.id).roles.add(currentYearCakeData["current-year-cake-role-id"]);
        }
    }
};