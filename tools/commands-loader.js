const { Collection, REST, Routes } = require("discord.js")
const { readdirSync } = require("fs");
const { generateHelp } = require("./help-generator.js");
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

function deployCommands(client) {
    console.time("\n\x1b[1;97m\x1b[3m🕰️  Time to launch ");
    console.log("\x1b[0m");

    const commandType = readdirSync("./commands").filter(file => !file.includes("."));
    client.commands = new Collection();

    for (const type of commandType) {
        const commands = [];
        const commandCategory = readdirSync(`./commands/${type}`).filter(folder => !folder.includes("."));

        for (const category of commandCategory) {
            const commandFiles = readdirSync(`./commands/${type}/${category}`).filter(file => file.endsWith(".js"));

            for (const file of commandFiles) {
                const command = require(`../commands/${type}/${category}/${file}`);
                client.commands.set(command.data.name, command);
                commands.push(command.data);

                console.log(`\x1b[35mLoading ${type}/${category}/${command.data.name} !\x1b[0m`);
                console.log(`${commands.length} commands loaded !`);
            }
        }

        console.log(`\n\x1b[34m➔  ${commands.length} ${type} commands loaded, currently updating... ⌚\n`);

        slashCommandLoad(client, commands, type);
    }
}

async function slashCommandLoad(client, commands, commandType) {
    try {
        let commandsData;

        if (commandType === "global") {
            commandsData = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        } else if (commandType === "guild") {
            commandsData = await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_COMMANDS_ID), { body: commands });
        } else {
            console.error(`\x1b[31m❌ ERROR : Unknow command type ! Command type : ${commandType}\x1b[0m`);
        }

        console.log(`\x1b[32m➔  Commands of type ${commandType} are now loaded and sent ✅\x1b[0m`);

        if (process.env.TESTING_MODE === "true")
            generateHelp(client, commands, commandsData.map(command => command.id));
    } catch (error) {
        console.error(error);
    }

    return client.commands;
};

module.exports = { deployCommands };