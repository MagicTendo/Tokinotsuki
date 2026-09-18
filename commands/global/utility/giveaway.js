const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType, MessageFlags } = require("discord.js");
const ms = require("ms");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Utilitaire",
    data: new SlashCommandBuilder()
        .setName("giveaway")
        .setDescription("Permet de créer simplement un giveaway !")
        .setIntegrationTypes([0])
        .setContexts([0])
        .addSubcommand(subcommand => subcommand
            .setName("setup")
            .setDescription("Pour mettre en place un giveaway sur le serveur !")
            .addStringOption(option => option
                .setName("prize")
                .setDescription("La récompense à donner.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("duration")
                .setDescription("La durée du giveaway (5d -> 5 jours, 3m -> minutes, etc.).")
                .setRequired(true))
            .addIntegerOption(option => option
                .setName("winner-number")
                .setDescription("Le nombre de gagnants.")
                .setMinValue(1)
                .setMaxValue(15)
                .setRequired(false))
            .addChannelOption(option => option
                .setName("channel")
                .setDescription("Le salon dans lequel envoyé le giveaway.")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(false))),
    async execute(interaction, client) {
        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild))
                return await interaction.reply({ content: "❌ Tu n'as pas la permisssion de gérer le serveur !", flags: [MessageFlags.Ephemeral] });

            const giveawayPrize = interaction.options.getString("prize");
            const giveawayDurationRaw = interaction.options.getString("duration");
            const giveawayWinnerNumber = interaction.options.getInteger("winner-number") ?? 1;
            const giveawayChannel = interaction.options.getChannel("channel") ?? interaction.channel;
            const giveawayDuration = giveawayDurationRaw.trim().replace(/ {2,}/g, " ").split(" ");
            let giveawayDurationMilliseconds = 0;
            let registered = [];

            for (let i = 0; i < giveawayDuration.length; i++) {
                giveawayDurationMilliseconds += ms(giveawayDuration[i]);
            }

            if (typeof giveawayDurationMilliseconds === "undefined" || isNaN(giveawayDurationMilliseconds))
                return await interaction.reply({ content: "❌ La valeur de temps n'est pas correcte ! Cela doit être un nombre avec une lettre. Les unités disponibles sont `ms`, `s`, `m`, `h` et `d`, et s'utilisent avec un nombre, `9h` pour 9 heures, `3m 14s` pour 3 minutes et 14 secondes, etc.", flags: [MessageFlags.Ephemeral] });
            if (giveawayDurationMilliseconds < 60_000)
                return await interaction.reply({ content: "❌ La valeur doit être strictement positive, non nulle et être supérieur à une minute !", flags: [MessageFlags.Ephemeral] });
            if (giveawayDurationMilliseconds > 604_800_000)
                return await interaction.reply({ content: "❌ Le giveaway ne peut pas durer plus d'une semaine !", flags: [MessageFlags.Ephemeral] });

            const currentDate = Date.now();
            const giveawayTimestamp = Math.round((currentDate + giveawayDurationMilliseconds) / 1_000)

            const giveawayEmbed = new EmbedBuilder()
                .setColor([255, 85, 0])
                .setDescription(`## Giveaway !\nClique pour tenter de gagner : **${giveawayPrize}** !\n** **\n> ⌚ **Temps restant** : <t:${giveawayTimestamp}:R>\n> 📝 **Inscrits** : 0\n> 🏅 **Nombre de gagnants** : ${giveawayWinnerNumber}`)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

            const giveawayMessage = await giveawayChannel.send({ embeds: [giveawayEmbed], withResponse: true });

            async function updateEmbed(winners = false) {
                const newGiveawayEmbed = new EmbedBuilder(giveawayMessage.embeds[0].data)
                    .setDescription(`## Giveaway !\nClique pour tenter de gagner : **${giveawayPrize}** !\n** **\n> ⌚ **Temps restant** : ${winners ? "terminé !" : `<t:${giveawayTimestamp}:R>`}\n> 📝 **Inscrits** : ${registered.length}\n> 🏅 **Nombre de gagnants** : ${giveawayWinnerNumber}\n${winners ? `> 🏆 **Gagnant(s)** : ${winners}` : ""}`);

                await giveawayMessage.edit({ embeds: [newGiveawayEmbed] });
            }

            await giveawayMessage.react("🎉");
            await interaction.reply({ content: `✅ Le giveaway a bien été envoyé dans <#${giveawayChannel.id}> !`, flags: [MessageFlags.Ephemeral] });

            const reactionCollector = giveawayMessage.createReactionCollector({ filter: (reaction, user) => reaction.emoji.name === "🎉" && !user.bot, time: giveawayDurationMilliseconds, dispose: true });

            reactionCollector.on("collect", async (reaction, user) => {
                registered.push(user.id);

                await updateEmbed();
            });

            reactionCollector.on("remove", async (reaction, user) => {
                const registeredIndex = registered.indexOf(user.id);

                if (registeredIndex > -1) {
                    registered.splice(registeredIndex, 1);

                    await updateEmbed();
                }
            });

            reactionCollector.on("end", async (collected, reason) => {
                if (reason !== "messageDelete") {
                    let winners = [];

                    for (let i = 0; i < giveawayWinnerNumber; i++) {
                        if (registered.length === 0)
                            break;

                        const winnerIndex = Math.floor(Math.random() * registered.length);
                        const winnerID = registered[winnerIndex];

                        winners.push(`<@${winnerID}>`);
                    }

                    const winnerString = winners.join(", ").replace(/(, )(?!.*, )/, " et ") || "personne...";

                    if (winners.length === 0) {
                        await giveawayMessage.reply({ content: "Il n'y a aucun gagnant car personne n'a participé..." });
                    } else {
                        await giveawayMessage.reply({ content: `## ✨ Félicitations ${winnerString} ! ${winners.length > 1 ? "Vous avez" : "Tu as"} gagné **${giveawayPrize}** ! ✨` });
                    }

                    await updateEmbed(winnerString);
                }
            });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};