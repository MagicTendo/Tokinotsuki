const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, OverwriteType, PermissionsBitField, MessageFlags } = require("discord.js");
const { readFileSync, writeFileSync } = require("fs");
const { sendError } = require("../../../tools/error-catcher.js");
const { updateMemberCounts } = require("../../../tools/modules.js");
const { levelMessages } = require("../../../tools/xp-levels.js");

module.exports = {
    category: "Serveur",
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Pour mettre en place des systèmes.")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addSubcommand(subcommand => subcommand
            .setName("baka-button")
            .setDescription("Pour créer un bouton inutile qui compte le nombre de clique."))

        .addSubcommand(subcommand => subcommand
            .setName("level-message")
            .setDescription("Liste les rôles de niveaux avec leur avantages."))

        .addSubcommand(subcommand => subcommand
            .setName("update-member-counts")
            .setDescription("Pour mettre à jour les compteurs de membres."))

        .addSubcommand(subcommand => subcommand
            .setName("year-cake")
            .setDescription("Pour mettre en place le système de Year Cake.")
            .addIntegerOption(option => option
                .setName("year")
                .setDescription("Entre l'année du Year Cake à créer.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("year-cake-emoji")
                .setDescription("L'émoji du Year Cake.")
                .setRequired(true))
            .addRoleOption(option => option
                .setName("year-cake-role")
                .setDescription("Le rôle du Year Cake.")
                .setRequired(true))),
    async execute(interaction, client) {
        try {
            if (interaction.user.id !== "610493430325313549")
                return await interaction.reply({ content: "❌ Cette commande n'est pas pour toi !", flags: [MessageFlags.Ephemeral] });

            switch (interaction.options.getSubcommand()) {
                case "baka-button":
                    const bakaButton = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setEmoji({ name: "🍞" })
                            .setStyle(ButtonStyle.Primary)
                            .setCustomId("baka-button_1_0"));

                    const bakaEmbed = new EmbedBuilder()
                        .setColor([255, 85, 0])
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                    await interaction.channel.send({ embeds: [bakaEmbed], components: [bakaButton] });

                    await interaction.reply({ content: "✅ Le bouton a bien été envoyé !", flags: [MessageFlags.Ephemeral] });
                    break;

                case "level-message":
                    const levelEmbed = new EmbedBuilder()
                        .setColor([255, 85, 0])
                    	.setDescription("## 🌟 Explications du système des niveaux\n** **\n~~-----------------------------------------------------~~\n\nUn système de niveaux est présent sur le serveur afin de le rendre plus ludique ! Pour chaque message envoyé, un certains nombre de points d'expérience est attribué en fonction de sa longueur. Il y a 150 niveaux actuellement, demandant un nombre exponentiel de points d'expérience, et certains paliers donne un rôle avec des avantages ! Ce système est encore en test et peut encore changer.\n\n~~-----------------------------------------------------~~\n\n")
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                    for (let i = 0; i < Object.keys(levelMessages).length; i++) {
                        levelEmbed.addFields({ name: "‎", value: `**<@&${Object.keys(levelMessages)[i]}>**\n${levelMessages[Object.keys(levelMessages)[i]]}`, inline: true });
                    }

                    await interaction.channel.send({ embeds: [levelEmbed] });

                    await interaction.reply({ content: "✅ Message envoyé !", flags: [MessageFlags.Ephemeral] });
                    break;

                case "update-member-counts":
                    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
                    await updateMemberCounts(client);
                    await interaction.editReply({ content: "✅ Les compteurs ont bien étaient mis à jour !" });
                    break;

                case "year-cake":
                    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

                    const yearCakeYear = interaction.options.getInteger("year");
                    const yearCakeEmoji = interaction.options.getString("year-cake-emoji");
                    const yearCakeRole = interaction.options.getRole("year-cake-role");
                    const currentYearCake = readFileSync("./json/current-year-cake.json", "utf8");
                    const currentYearCakeData = JSON.parse(currentYearCake);
                    const lastYearCakeChannel = yearCakeYear > 1 ? await client.channels.fetch(currentYearCakeData["current-year-cake-channel-id"]) : null;
                    const yearCakeChannelPermissions = [{
                        id: interaction.guild.id,
                        type: OverwriteType.Role,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                        disallow: [PermissionsBitField.Flags.SendMessages]
                    }, {
                        id: yearCakeRole.id,
                        type: OverwriteType.Role,
                        allow: [PermissionsBitField.Flags.ViewChannel]
                    }];

                    lastYearCakeChannel.permissionOverwrites.edit(interaction.guild.id, {
                        ViewChannel: false
                    });

                    const yearCakeChannel = await interaction.guild.channels.create({
                        name: `🎂﹥${yearCakeYear}${yearCakeYear % 10 === 1 ? "st" : yearCakeYear % 10 === 2 ? "nd" : yearCakeYear % 10 === 3 ? "rd" : "th"}-year-cake`,
                        type: ChannelType.GuildText,
                        parent: "891089085718999070",
                        permissionOverwrites: yearCakeChannelPermissions
                    });

                    const yearCakeMessage = await yearCakeChannel.send({ content: yearCakeEmoji });

                    await yearCakeMessage.react("🍰");

                    const currentYearCakeJSON = {
                        "current-year-cake-channel-id": yearCakeChannel.id,
                        "current-year-cake-message-id": yearCakeMessage.id,
                        "current-year-cake-role-id": yearCakeRole.id
                    };

                    writeFileSync("./json/current-year-cake.json", JSON.stringify(currentYearCakeJSON, null, 4), async error => {
                        if (error !== null)
                            await sendError(interaction, client, error);
                    });

                    await interaction.editReply({ content: `✅ Salon créé à <#${yearCakeChannel.id}> !` });
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};