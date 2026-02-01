const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const { sendError } = require("../../../tools/error-catcher.js");
const { isLink } = require("../../../tools/modules.js");

module.exports = {
    category: "Utilitaire",
    data: new SlashCommandBuilder()
        .setName("whois")
        .setDescription("Permet d'obtenir des informations sur un site web.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addStringOption(option => option
            .setName("link")
            .setDescription("Le lien du site.")
            .setRequired(true)),
    async execute(interaction, client) {
        try {
            let link = interaction.options.getString("link");
            const startDate = Date.now();

            if (!(await isLink(link)))
                return await interaction.reply({ content: "❌ Tu n'as pas mis un vrai lien !", flags: MessageFlags.Ephemeral });
            if (!link.startsWith("http"))
                link = `https://${link}`;

            await interaction.deferReply();

            await fetch(link)?.then(async data => {
                const websiteStatus = data["status"];
                const websiteURL = data["url"];
                const websiteRedirection = data["redirected"] === true ? "oui" : "non";
                const websiteLatency = Math.max(0, Date.now() - startDate);
                const websiteWebServer = data.headers.get("server");
                const websiteContentType = data.headers.get("content-type");
                const websiteLastModified = data.headers.get("last-modified") ?? "*???*";

                const websiteImageResponse = await fetch(`https://api.popcat.xyz/v2/screenshot?url=${link}`);
                const websiteImageBuffer = await websiteImageResponse.arrayBuffer();
                const websiteImage = new AttachmentBuilder(new Buffer.from(websiteImageBuffer), { name: "website.png" });

                const whoisEmbed = new EmbedBuilder()
                    .setColor([255, 85, 0])
                    .setTitle(websiteURL)
                    .setURL(websiteURL)
                    .setDescription(`🌐 **Statut** : ${websiteStatus}\n🏓 **Latence** : ≈ ${websiteLatency}ms\n🗄️ **Serveur web** : ${websiteWebServer}\n📄 **Type de contenu** : ${websiteContentType}\n✏️ **Dernière modification** : ${websiteLastModified}\n↪️ **Est une redirection** : ${websiteRedirection}`)
                    .setImage("attachment://website.png")
                    .setTimestamp()
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                await interaction.editReply({ embeds: [whoisEmbed], files: [websiteImage] });
            }).catch(async error => {
                return await interaction.editReply({ content: "Le site ne semble pas exister ou fonctionner !" });
            });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};