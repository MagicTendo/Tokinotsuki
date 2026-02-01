const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const ms = require("ms");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Utilitaire",
    data: new SlashCommandBuilder()
        .setName("timer")
        .setDescription("Pour lancer un chronomètre, tout simplement !")
        .setIntegrationTypes([0])
        .setContexts([0, 1, 2])
        .addStringOption(option => option
            .setName("duration")
            .setDescription("La durée du chronomètre (8h -> 8 heures, 3m -> 3 minutes, etc.).")
            .setRequired(true))
        .addStringOption(option => option
            .setName("reason")
            .setDescription("La raison du chronomètre.")
            .setRequired(false)),
    async execute(interaction, client) {
        try {
            const timerDurationRaw = interaction.options.getString("duration");
            const timerReason = interaction.options.getString("reason");
            const timerDuration = timerDurationRaw.trim().replace(/ {2,}/g, " ").split(" ");
            let timerDurationMilliseconds = 0;

            for (let i = 0; i < timerDuration.length; i++) {
                timerDurationMilliseconds += ms(timerDuration[i]);
            }

            if (typeof timerDurationMilliseconds === "undefined" || isNaN(timerDurationMilliseconds))
                return await interaction.reply({ content: "❌ La valeur de temps n'est pas correcte ! Cela doit être un nombre avec une lettre. Les unités disponibles sont `ms`, `s`, `m` et `h`, et s'utilisent avec un nombre, `9h` pour 9 heures, `3m 14s` pour 3 minutes et 14 secondes, etc.", flags: MessageFlags.Ephemeral });
            if (timerDurationMilliseconds < 1_000)
                return await interaction.reply({ content: "❌ La valeur doit être strictement positive, non nulle et être supérieur à une seconde !", flags: MessageFlags.Ephemeral });
            if (timerDurationMilliseconds > 86_400_000)
                return await interaction.reply({ content: "❌ Le maximum du chronomètre est de 24 heures !", flags: MessageFlags.Ephemeral });

            const currentDate = Date.now();
            const timerTimestamp = Math.round((currentDate + timerDurationMilliseconds) / 1_000)

            const timerEmbed = new EmbedBuilder()
                .setColor([255, 85, 0])
                .setTitle(timerReason ?? "Chronomètre")
                .setDescription(`## > <t:${timerTimestamp}:R>`)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

            await interaction.reply({ embeds: [timerEmbed] });

            setTimeout(async () => {
                await client.users.send(interaction.user.id, timerReason ? `Le chronomètre pour **\`${timerReason}\`** est terminé !` : "Le chronomètre est terminé !");

                const timerEndEmbed = new EmbedBuilder()
                    .setColor([14, 207, 0])
                    .setTitle(timerReason ?? "Chronomètre")
                    .setDescription(`## > Terminé !`)
                    .setTimestamp()
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                await interaction.editReply({ embeds: [timerEndEmbed] });
            }, timerDurationMilliseconds);
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};