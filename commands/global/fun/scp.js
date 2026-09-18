const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const scpList = require("../../../json/scp.json");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Fun",
    data: new SlashCommandBuilder()
        .setName("scp")
        .setDescription("Tout ce qui concerne les SCP.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addSubcommand(subcommand => subcommand
            .setName("english")
            .setDescription("Affiche un rapport SCP en anglais, marche avec tous, mais est plus lent et pas forcément pertinent.")
            .addStringOption(option => option
                .setName("scp-id")
                .setDescription("Le nom du SCP, comme par exemple SCP-888, SCP-2999-A ou SCP-020-JP.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("french")
            .setDescription("Affiche un rapport SCP en français mieux rédigé et rapidemment, mais en quantité limité.")
            .addStringOption(option => option
                .setName("scp-id")
                .setDescription("Le nom du SCP, comme par exemple SCP-888, SCP-2999-A ou SCP-020-JP.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("french-list")
            .setDescription("Liste tous les rapports SCP disponible avec /scp french.")),
    async execute(interaction, client) {
        try {
            let scpID = interaction.options.getString("scp-id")?.toUpperCase().trim();

            await interaction.deferReply();

            switch (interaction.options.getSubcommand()) {
                case "english":
                    if (scpID === "SCP-001")
                        return await interaction.editReply({ content: "❌ Impossible de récupérer SCP-001 à cause de ses diverses versions !", flags: [MessageFlags.Ephemeral] });
                    if (typeof scpID === "undefined")
                        scpID = `SCP-${String(Math.floor(Math.random() * 998) + 2).padStart(3, "0")}`;

                    await fetch("https://scp-data.tedivm.com/data/scp/items/index.json").then(function (response) {
                        return response.json();
                    }).then(async function (data) {
                        if (scpID in data) {
                            const scpContentFile = data[scpID].content_file;

                            await fetch(`https://scp-data.tedivm.com/data/scp/items/${scpContentFile}`).then(function (response) {
                                return response.json();
                            }).then(async function (data) {
                                const scpImages = data[scpID].images;
                                const scpImage = scpImages.length > 0 ? scpImages[0].replace("small", "Fullsize") : null;
                                const scpImageProxy = scpImage !== null ? `https://images.weserv.nl/?url=${encodeURIComponent(scpImage.replace(/^https?:\/\//, ""))}` : null;
                                const scpLink = data[scpID].url;
                                const content = data[scpID].raw_source.replace(/--(.*?)--/g, "~~*$1*~~").replace(/\^\^(.*?)\^\^/g, "^($1)").replace(/\[\[\[(.*?)(\|.*?)?\]\]\]/g, (match) => {
                                    const splittedMatch = match.split("|");
                                    const url = `https://scp-wiki.wikidot.com/${splittedMatch[0]}`;
                                    return `[${splittedMatch[1]}](${url})`.replace("[[[", "").replace("]]]", "");
                                }).replace(/\[undefined\]\((.*?)\.com\/(.*?)\)/g, (match) => {
                                    return `[${match.split(".com/")[1].slice(0, -1)}](${match.split("(")[1].slice(0, -1)})`;
                                });

                                const scpClass = content?.split("**Object Class:**")[1]?.split("\n")[0] ?? content?.split("**Object Class**:")[1]?.split("\n")[0] ?? content?.split("containment=")[1]?.split("\n")[0] ?? content?.split("container-class=")[1]?.split("\n")[0] ?? "Unknown";
                                const cleanScpClass = scpClass.charAt(0).toUpperCase() + scpClass.slice(1);
                                const scpClassImage = scpClass.toLowerCase().trim().split(/[, ]+/).pop();
                                const splitStartContent = content?.split(/\*\*Description:\*\*/i)[1] ?? content?.split(/\*\*Description\*\*:/i)[1];
                                const splitContent = splitStartContent.replace(/@@/g, "**").split("\n\n\n\n**")[0].split("[[footnoteblock]]")[0].split("[[collapsible show=\"Episode Log\" hide=\"Close Log\"]]")[0];
                                let cleanContent = splitContent?.replace(/\[\[footnote\]\](.*?)\[\[\/footnote\]\]/g, "").replace(/\[\(\(bibcite [^\s]+\)\)\]/g, "").replace(/\n.{1}\n/g, "\n\n").replace(/\n\n\n/g, "\n").replace(/(?<!:)\/\//g, "*").replace(/\n\[\[tabview\]\]/g, "").replace(/\n\n\[\[tab (.*?)\]\]/g, "").replace(/\n\n\[\[include ([\s\S]*?)\]\]/g, "").replace(/\n\n\[\[div (.*?)\]\]/g, "").replace(/\n\[\[image (.*?)\]\]/g, "").replace(/\[\[=\]\]([\s\S]*?)\[\[\/=\]\]/g, "").replace(/\[\[<\]\]([\s\S]*?)\[\[\/<\]\]/g, "").replace(/\n\n\[!(.*?)\]/g, "").replace(/\n\[\[\/div\]\]\n/g, "").replace(/\n\nImage of (.*?)\./g, "").replace(/# \s/g, "").replace(/# /g, "- ").replace(/,,/g, "").replace(/# /g, "").replace(/\s_\s/g, "").replace(/~~\*\*~~--/g, "").replace(/(sic)/g, "").replace(/(?:\s(?![\n\r\v])){2,}/g, " ").trim();

                                if (typeof cleanContent === "undefined")
                                    return await interaction.editReply({ content: `❌ Impossible de formatter correctement ${scpID}...`, flags: [MessageFlags.Ephemeral] });

                                while (cleanContent.length > 2000) {
                                    const parts = cleanContent.split("\n");
                                    parts.pop();

                                    cleanContent = parts.join("\n");
                                }

                                switch (scpID) {
                                    case "SCP-1471":
                                        cleanContent = cleanContent.split("[[collapsible show=")[0];
                                        break;
                                    case "SCP-3349":
                                        cleanContent = `${cleanContent.split("tolerance.")[0]}tolerance.`;
                                        break;
                                }

                                const scpEmbed = new EmbedBuilder()
                                    .setColor([255, 85, 0])
                                    .setTitle(scpID)
                                    .setURL(scpLink)
                                    .setDescription(`**Object Class :** ${cleanScpClass}\n\n**Description :** ${cleanContent}`)
                                    .setThumbnail(`attachment://${scpClassImage}.png`)
                                    .setImage(scpImageProxy)
                                    .setTimestamp()
                                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                                await interaction.editReply({ embeds: [scpEmbed], files: [`./assets/images/scp/classes/${scpClassImage}.png`] });
                            });
                        } else {
                            await interaction.editReply({ content: `❌ Impossible de trouver l'article concernant ${scpID.toUpperCase()} !`, flags: [MessageFlags.Ephemeral] });
                        }
                    });
                    break;

                case "french":
                    scpID = scpID?.toLowerCase();

                    if (typeof scpID === "undefined")
                        scpID = Object.keys(scpList)[Math.floor(Math.random() * Object.keys(scpList).length)];

                    if (scpID === "scp-404-jp") {
                        const scpEmbed = new EmbedBuilder()
                            .setDescription(scpList["scp-404-jp"]["description"]);

                        await interaction.editReply({ embeds: [scpEmbed] }).then(message => {
                            setTimeout(async () => {
                                const scp404 = new EmbedBuilder()
                                    .setColor([189, 215, 217])
                                    .setTitle("SCP-404-JP")
                                    .setURL("http://fondationscp.wikidot.com/scp-404-jp")
                                    .setDescription("Classe: Sûr\n\nSCP-404-JP est un rapport enregistré dans la base de données de la Fondation. Le texte de SCP-404-JP se modifie de façon à ce que les lecteurs soient convaincus que le document n'existe pas, et détruit toute information de SCP-404-JP lui-même, de tout autre support ou encore de la mémoire biologique humaine.\n\nLa façon dont SCP-404-JP a obtenu ses propriétés est inconnue, et comment la Fondation a découvert les dites propriétés est aussi inexpliqué.")
                                    .setThumbnail("attachment://scp-404-jp.png")
                                    .setTimestamp()
                                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                                await message?.edit({ embeds: [scp404], files: ["./assets/images/scp/scp-404-jp.png"] });
                            }, 5_000);
                        })
                    } else {
                        const scp = scpList[scpID];

                        if (scp) {
                            const scpEmbed = new EmbedBuilder()
                                .setColor(scp["color"])
                                .setTitle(scp["title"])
                                .setURL(scp["url"])
                                .setImage(scp["image"])
                                .setTimestamp()
                                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                            if (scp["description"] !== "")
                                scpEmbed.setDescription(scp["description"]);

                            await interaction.editReply({ embeds: [scpEmbed], files: [`./assets/images/scp/${scpID.toLowerCase()}.png`] });
                        } else {
                            return await interaction.editReply({ content: `❌ Impossible de trouver l'article concernant ${scpID.toUpperCase()} !`, flags: [MessageFlags.Ephemeral] });
                        }
                    }
                    break;

                case "french-list":
                    const scpListButtons = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setEmoji({ name: "⚪" })
                            .setLabel("SCP")
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId(`scp_classic_${interaction.user.id}`),
                        new ButtonBuilder()
                            .setEmoji({ name: "🇫🇷" })
                            .setLabel("SCP-FR")
                            .setStyle(ButtonStyle.Primary)
                            .setCustomId(`scp_fr_${interaction.user.id}`),
                        new ButtonBuilder()
                            .setEmoji({ name: "🇪🇸" })
                            .setLabel("SCP-ES")
                            .setStyle(ButtonStyle.Danger)
                            .setCustomId(`scp_es_${interaction.user.id}`),
                        new ButtonBuilder()
                            .setEmoji({ name: "🇯🇵" })
                            .setLabel("SCP-JP")
                            .setStyle(ButtonStyle.Danger)
                            .setCustomId(`scp_jp_${interaction.user.id}`),
                        new ButtonBuilder()
                            .setEmoji({ name: "🎭" })
                            .setLabel("SCP-J")
                            .setStyle(ButtonStyle.Success)
                            .setCustomId(`scp_j_${interaction.user.id}`));

                    const scpListEmbed = new EmbedBuilder()
                        .setColor([0, 0, 0])
                        .setTitle(`Liste des ${Object.keys(scpList).length} SCP enregistrés`)
                        .setDescription("Pour faciliter la lecture, les SCP sont rangés par catégories.\n\n- ⚪ SCP, les plus classiques et connus.\n- 🇫🇷 SCP-FR, d'origines françaises.\n- 🇪🇸 SCP-ES, d'origines hispaniques.\n- 🇯🇵 SCP-JP, d'origines japonaises.\n- 🎭 SCP-J, ayant un côté humoristique.")
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                    await interaction.editReply({ embeds: [scpListEmbed], components: [scpListButtons], flags: [MessageFlags.Ephemeral] })
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};