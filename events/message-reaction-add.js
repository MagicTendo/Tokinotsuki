const { readFileSync } = require("fs");

module.exports = {
    name: "messageReactionAdd",
    async execute(reaction, user) {
        if (user.bot)
            return;

        if (reaction.message.guildId === process.env.GUILD_COMMANDS_ID) {
            if (reaction.emoji.name === "🍰") {
                const currentYearCake = readFileSync("./json/current-year-cake.json", "utf8");
                const currentYearCakeData = JSON.parse(currentYearCake);

                if (reaction.message.id === currentYearCakeData["current-year-cake-message-id"])
                    await reaction.message.guild.members.cache.get(user.id).roles.add(currentYearCakeData["current-year-cake-role-id"]);
            } else if (reaction.message.id === "781127143303151627" && reaction.emoji.name === "<:YuyunoriZoom:780166374022578176>") {
                await reaction.message.guild.members.cache.get(user.id).roles.add("1473260298642391164");
            }
        }
    }
};