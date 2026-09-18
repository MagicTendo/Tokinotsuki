const { Client, GatewayIntentBits, Partials } = require("discord.js");
const dotenv = require("dotenv").config({ path: ".env", quiet: true });
const { readdirSync } = require("fs");
const process = require("node:process");
const { deployCommands } = require("./tools/commands-loader.js");
const { sendCriticalError } = require("./tools/error-catcher.js");

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.DirectMessages
	],
	partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});

const eventFiles = readdirSync("./events").filter(file => file.endsWith(".js"));

console.log(`\n\x1b[93m➔  Starting in ${process.env.CLIENT_ID === "791437575642152982" ? "production" : "local"} mode ! ✨\x1b[0m`);

setTimeout(async () => {
	for (const file of eventFiles) {
		const event = require(`./events/${file}`);

		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args, client));
		} else {
			client.on(event.name, (...args) => event.execute(...args, client));
		}
	}

	deployCommands(client);

	process.on("uncaughtException", async error => {
		await sendCriticalError(error);
	});

	client.login(process.env.TOKEN);
}, 2_000);