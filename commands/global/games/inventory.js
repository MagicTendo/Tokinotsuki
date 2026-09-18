const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js")
const { sendError } = require("../../../tools/error-catcher.js");
const { getValue } = require("../../../tools/database.js");
const { fishes, fishTable, ores, oreTable, birds, birdTable, artefacts, artefactTable, items, itemTable, fakeItems, uniqueItemEmojis } = require("../../../tools/items-table.js");
const { capitalize, simplify } = require("../../../tools/modules.js");

module.exports = {
	category: "Jeux",
	data: new SlashCommandBuilder()
		.setName("inventory")
		.setDescription("Affiche le contenu de ton inventaire.")
		.setIntegrationTypes([0])
		.setContexts([0])
		.addSubcommand(subcommand => subcommand
			.setName("artefacts")
			.setDescription("Permet de consulter son inventaire d'artéfacts ou d'une autre personne !")
			.addUserOption(option => option
				.setName("user")
				.setDescription("Pour afficher l'inventaire d'un autre utilisateur.")
				.setRequired(false)))

		.addSubcommand(subcommand => subcommand
			.setName("birds")
			.setDescription("Permet de consulter son inventaire de photos d'oiseaux ou d'une autre personne !")
			.addUserOption(option => option
				.setName("user")
				.setDescription("Pour afficher l'inventaire d'un autre utilisateur.")
				.setRequired(false)))

		.addSubcommand(subcommand => subcommand
			.setName("fishes")
			.setDescription("Permet de consulter son inventaire de poissons ou d'une autre personne !")
			.addUserOption(option => option
				.setName("user")
				.setDescription("Pour afficher l'inventaire d'un autre utilisateur.")
				.setRequired(false)))

		.addSubcommand(subcommand => subcommand
			.setName("items")
			.setDescription("Permet de consulter son inventaire d'objets ou d'une autre personne !")
			.addUserOption(option => option
				.setName("user")
				.setDescription("Pour afficher l'inventaire d'un autre utilisateur.")
				.setRequired(false)))

		.addSubcommand(subcommand => subcommand
			.setName("ores")
			.setDescription("Permet de consulter son inventaire de minerais ou d'une autre personne !")
			.addUserOption(option => option
				.setName("user")
				.setDescription("Pour afficher l'inventaire d'un autre utilisateur.")
				.setRequired(false))),
	async execute(interaction, client) {
		try {
			const user = interaction.options?.getUser("user") ?? client.users.cache.get(interaction.customId?.split("_")[2]) ?? interaction.user;

			if (user.bot)
				return await interaction.reply({ content: "❌ L'utilisateur ne peut pas être un bot !", flags: [MessageFlags.Ephemeral] });

			await interaction.deferReply();

			const inventoryType = interaction.options?.getSubcommand() ?? "items";
			const inventoryTypeName = inventoryType === "artefacts" ? "d'artéfacts" : inventoryType === "birds" ? "de photos d'oiseaux" : inventoryType === "fishes" ? "de poissons" : inventoryType === "items" ? "d'objets" : "de minerais";
			const itemList = inventoryType === "artefacts" ? artefacts : inventoryType === "birds" ? birds : inventoryType === "fishes" ? fishes : inventoryType === "items" ? items : ores;
			const inventoryTable = inventoryType === "artefacts" ? artefactTable : inventoryType === "birds" ? birdTable : inventoryType === "fishes" ? fishTable : inventoryType === "items" ? itemTable : oreTable;

			const inventoryEmbed = new EmbedBuilder()
				.setColor([255, 85, 0])
				.setTitle(`Inventaire ${inventoryTypeName} de ${user.globalName}`)
				.setTimestamp()
				.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

			for (let i = 0; i < itemList.length; i++) {
				const item = itemList[i];

				if (fakeItems.includes(item))
					continue;

				const itemCount = await getValue(user.id, "users", item, true);
				const itemKey = Object.keys(inventoryTable).find(key => inventoryTable[key]["name"] === item);
				const itemEmoji = itemCount === undefined && inventoryType !== "items" ? inventoryTable[itemKey]["shadow"] : inventoryTable[itemKey]["emoji"];
				const itemName = itemCount === undefined && inventoryType !== "items" ? "???" : capitalize(itemKey.split("|")[2] ?? itemKey) ?? itemKey;

				inventoryEmbed.addFields({ name: `${itemEmoji} ${itemName}`, value: await simplify(interaction.user.id, itemCount ?? 0), inline: true });
			}

			if (inventoryType === "items") {
				const uniqueItemList = ["fishing-rod", "pickaxe", "brush", "camera", "inosayo", "oseitena", "bank"];
				const userUniqueItems = [];

				for (let i = 0; i < uniqueItemList.length; i++) {
					const uniqueItem = uniqueItemList[i];
					const userUniqueItem = await getValue(user.id, "users", uniqueItem);

					if (userUniqueItem > 0)
						userUniqueItems.push(uniqueItemEmojis[userUniqueItem > 1 ? `${uniqueItem}-upgrade` : uniqueItem]);
				}

				if (userUniqueItems.length > 0)
					inventoryEmbed.setDescription(`🎒 **__Liste des objets__**\n> ${userUniqueItems.join(" ")}\n\n** **`);
			}

			await interaction.editReply({ embeds: [inventoryEmbed] });
		} catch (error) {
			await sendError(interaction, client, error);
		}
	}
};