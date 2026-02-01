const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js")
const { sendError } = require("../../../tools/error-catcher.js");
const { completeQuest } = require("../../../tools/modules.js");

module.exports = {
	category: "Fun",
	data: new SlashCommandBuilder()
		.setName("love")
		.setDescription("Calcule le pourcentage d'amour entre deux utilisateurs !")
		.setIntegrationTypes([0, 1])
		.setContexts([0, 1, 2])
		.addUserOption(option => option
			.setName("first-user")
			.setDescription("Le premier utilisateur.")
			.setRequired(true))
		.addUserOption(option => option
			.setName("second-user")
			.setDescription("Et le deuxième utilisateur.")
			.setRequired(true)),
	async execute(interaction, client) {
		try {
			const firstUser = interaction.options.getUser("first-user") ?? client.users.cache.get(interaction.targetId);
			const secondUser = interaction.options.getUser("second-user") ?? interaction.user;
			const firstMember = interaction.options.getMember("first-user") ?? client.guilds.cache.get(interaction.guild?.id)?.members.cache.get(interaction.targetId);
			const secondMember = interaction.options.getMember("second-user") ?? interaction.member;

			if (firstUser === secondUser)
				return await interaction.reply({ content: "💔 Je ne peux pas calculer l'amour propre, désolé D:", flags: MessageFlags.Ephemeral });

			const firstUserID = firstUser.id;
			const secondUserID = secondUser.id;
			const firstUserName = firstMember?.nickname ?? firstMember?.nick ?? firstUser.nickname ?? firstUser.globalName ?? firstUser.username;
			const secondUserName = secondMember?.nickname ?? secondMember?.nick ?? secondUser.nickname ?? secondUser.globalName ?? secondUser.username;

			const firstLove = firstUserID % 100;
			const secondLove = secondUserID % 100;
			let love = firstLove * secondLove % 100 + 1;

			if (love >= 100) {
				love = 100;

				await completeQuest(interaction.user.id, "love");
			}

			const loveEmbed = new EmbedBuilder()
				.setColor([255, 0, 208])
				.setDescription(`${firstUserName}    >    **${love}% d'amour**    <    ${secondUserName}`)
				.setTimestamp()
				.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

			await interaction.reply({ embeds: [loveEmbed] });
		} catch (error) {
			await sendError(interaction, client, error);
		}
	}
};