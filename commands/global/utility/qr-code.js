const { SlashCommandBuilder, AttachmentBuilder, MessageFlags } = require("discord.js");
const { encodeQR } = require("qr");
const { toDataURL } = require("qrcode");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Utilitaire",
    data: new SlashCommandBuilder()
        .setName("qr-code")
        .setDescription("Permet de créer un QR code en image ou en texte.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addSubcommand(subcommand => subcommand
            .setName("image")
            .setDescription("Crée un QR code en image avec des couleurs personalisables.")
            .addStringOption(option => option
                .setName("message")
                .setDescription("Le message à mettre dans le QR code.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("background-color")
                .setDescription("La couleur de fond."))
            .addStringOption(option => option
                .setName("color")
                .setDescription("La couleur du QR code.")))

        .addSubcommand(subcommand => subcommand
            .setName("text")
            .setDescription("Crée un QR en format texte, mais le message ne pourra pas être long.")
            .addStringOption(option => option
                .setName("mode")
                .setDescription(":3")
                .addChoices(
                    { name: "🔲 Carré", value: "square" },
                    { name: "📄 Alongé", value: "stretched" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("message")
                .setDescription("Le message à mettre dans le QR code.")
                .setRequired(true))),
    async execute(interaction, client) {
        try {
            const qrCodeMessage = interaction.options.getString("message");

            switch (interaction.options.getSubcommand()) {
                case "text":
                    const qrCodeType = interaction.options.getString("mode");
                    const qrCodeRaw = encodeQR(qrCodeMessage, "raw");
                    let qrCodeCharacters = qrCodeType === "square" ? ["⚫", "⚪"] : ["▒", "█"];
                    let qrCode = [];

                    for (let i = 0; i < qrCodeRaw.length; i++) {
                        const row = qrCodeRaw[i];

                        for (let j = 0; j < row.length; j++) {
                            const pixel = row[j];

                            if (pixel) {
                                qrCode.push(qrCodeCharacters[0]);
                            } else {
                                qrCode.push(qrCodeCharacters[1]);
                            }
                        }

                        qrCode.push("\n");
                    }

                    qrCode = `\`\`\`\n${qrCode.join("")}\n\`\`\``

                    if (qrCode.length > 2_000)
                        return await interaction.reply({ content: `❌ Le QR Code dépasse la limite de caractères de Discord de ${qrCode.length - 2_000} characters !`, flags: MessageFlags.Ephemeral });

                    await interaction.reply({ content: qrCode, flags: MessageFlags.Ephemeral });
                    break;

                case "image":
                    const hexadecimalRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
                    var qrCodeBackgroundColor = interaction.options.getString("background-color");
                    var qrCodeColor = interaction.options.getString("color");

                    if (!hexadecimalRegex.test(qrCodeBackgroundColor))
                        qrCodeBackgroundColor = "#313131";
                    if (!hexadecimalRegex.test(qrCodeColor))
                        qrCodeColor = "#ff5500";

                    const qrCodeOptions = {
                        type: "image/png",
                        scale: 10,
                        color: {
                            light: qrCodeBackgroundColor,
                            dark: qrCodeColor
                        }
                    };

                    toDataURL(qrCodeMessage, qrCodeOptions, async function (error, url) {
                        if (error)
                            return await interaction.reply({ content: "❌ Le message du QR Code est trop long !", flags: MessageFlags.Ephemeral });

                        const qrCode = new AttachmentBuilder(await new Buffer.from(url.split(",")[1], "base64"), { name: "qr-code.png" });

                        await interaction.reply({ files: [qrCode], flags: MessageFlags.Ephemeral });
                    });
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};