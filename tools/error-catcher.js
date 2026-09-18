const { EmbedBuilder, MessageFlags } = require("discord.js");

async function sendError(interaction, client, error) {
    try {
        console.error(`\n\n\x1b[1m\x1b[31m======================================== \x1b[4m${interaction.commandName ?? "???"}.js\x1b[0m\x1b[1m\x1b[31m ========================================`);
        console.error(error?.stack ?? error);
        console.error(`\n- ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}`);
        console.error(`=====================================================================================${"=".repeat(String(interaction.commandName ?? "???").length)}\x1b[0m\n\n`);

        interaction.replied ? await interaction.channel.send({ content: `❌ Une erreur est survenue avec \`/${interaction.commandName ?? "???"}\` et a été signalée à mon développeur D:` }) : await interaction?.reply({ content: `Une erreur est survenue avec \`/${interaction.commandName ?? "???"}\` et a été signalée à mon développeur D:`, flags: [MessageFlags.Ephemeral] });

        await client.channels.fetch(process.env.LOG_CHANNEL_ID).then(async channel => {
            const logEmbed = new EmbedBuilder()
                .setColor([120, 16, 16])
                .setTitle(`Erreur ${interaction.commandName ?? "???"}.js`)
                .setDescription(`\`\`\`fix\n${error?.stack ?? error}\n\`\`\``)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

            await channel.send({ embeds: [logEmbed] });
        });
    } catch {
        console.error(`\x1b[1m\x1b[31mUnable to get or to send the error of ${interaction.commandName ?? "???"}.js...\x1b[0m\n`);
    }
}

async function sendDatabaseError(error, type = "null") {
    console.error(`\n\n\x1b[1m\x1b[31m======================================== \x1b[4mDatabase ${type}\x1b[0m\x1b[1m\x1b[31m ========================================`);
    console.error(error?.stack ?? error);
    console.error(`\n- ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}`);
    console.error(`===========================================================================================${"=".repeat(type.length)}\x1b[0m\n\n`);
}

async function sendCriticalError(error) {
    console.error(`\n\n\x1b[1m\x1b[31m======================================== \x1b[4mCritical error\x1b[0m\x1b[1m\x1b[31m ========================================`);
    console.error(`\x1b[31m${error?.stack ?? error}`);
    console.error(`\n- ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}`);
    console.error(`================================================================================================\x1b[0m\n\n`);
}

async function sendLog(client, title, log = null, status = "ok") {
    await client.channels.fetch(process.env.LOG_CHANNEL_ID).then(async channel => {
        const logEmbed = new EmbedBuilder()
            .setColor(status === "ok" ? [14, 207, 0] : [120, 16, 16])
            .setTitle(title)
            .setDescription(log)
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

        await channel.send({ embeds: [logEmbed] });
    });
}

module.exports = { sendError, sendDatabaseError, sendCriticalError, sendLog };