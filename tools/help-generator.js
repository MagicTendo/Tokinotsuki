const { writeFileSync } = require("fs");
const { capitalize } = require("./modules.js");

const commandByCategory = { "count": 0, "Informations": [], "Fun": [], "Jeux": [], "Modération": [], "Utilitaire": [], "Apprentissage": [], "Social": [], "Inutile": [], "Serveur": [] };
let commandInformations = [];
let topGGCommandList = [];
let commandsCount = 0;

function generateHelp(client, commands, ids) {
    for (let i = 0; i < commands.length; i++) {
        const commandName = commands[i].name;
        const commandDescription = commands[i].description;

        if (commandName === "backup-code" || (commandName !== "dev-news" && (commandName.startsWith("dev") || commandName.startsWith("setup") || commandDescription === undefined))) continue;

        const command = client.commands.get(commandName);
        const commandOptions = commands[i].options;

        if (commandOptions.some(subcommandData => "type" in subcommandData) || commandOptions.length === 0) {
            commandInformations.push({ name: `</${commandName}:${ids[i]}>`, description: commands[i].description });
            topGGCommandList.push({ name: commandName, description: commands[i].description });
        }

        if (commandOptions.length !== 0) {
            for (let j = 0; j < commandOptions.length; j++) {
                if (commandOptions[j].type === undefined) {
                    commandInformations.push({ name: `</${commandName} ${commandOptions[j].name}:${ids[i]}>`, description: commandOptions[j].description });
                    topGGCommandList.push({ name: `${commandName} ${commandOptions[j].name}`, description: commandOptions[j].description });
                }
            }
        }

        const commandsCategory = capitalize(command.category);

        for (let i = 0; i < commandInformations.length; i++) {
            commandByCategory[commandsCategory].push(commandInformations[i]);
            commandsCount += 1;
        }

        commandInformations = [];
        commandByCategory["count"] = commandsCount;

        writeFileSync("./_configs/top-gg-command-list.json", JSON.stringify(topGGCommandList, null, 4));
        writeFileSync("./json/help.json", JSON.stringify(commandByCategory, null, 4));
    }
}

module.exports = { generateHelp };