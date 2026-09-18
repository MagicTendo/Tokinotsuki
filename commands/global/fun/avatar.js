const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { Jimp, BlendMode } = require("jimp");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Fun",
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Donne l'avatar d'un utilisateur avec un effet ou pas !")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addUserOption(option => option
            .setName("user")
            .setDescription("L'utilisateur à qui appliquer l'effet.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("effect")
            .setDescription("Choisis un effet.")
            .addChoices(
                { name: "🚫 Aucun", value: "none" },
                { name: "🔲 Noir et blancs", value: "grayscale" },
                { name: "🙃 Inversion", value: "inverted" },
                { name: "🟤 Sépia", value: "sepia" },
                { name: "🍳 Deepfry", value: "deepfry" },
                { name: "👾 Pixeliser", value: "pixelate" },
                { name: "🪞 Miroir", value: "mirror" },
                { name: "📈 Stonks", value: "stonks" },
                { name: "📉 Not Stonks", value: "not-stonks" },
                { name: "📊 Confused Stonks", value: "confused-stonks" },
                { name: "🎥 Absolute Cinema", value: "absolute-cinema" },
                { name: "🛑 Stop", value: "stop" },
                { name: "🐀 Rat", value: "rat" },
                { name: "📜 Wanted", value: "wanted" },
                { name: "🫳 Pet Pet", value: "pet" })
            .setRequired(true)),
    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const user = interaction.options.getUser("user");
            const effect = interaction.options.getString("effect");
            const avatar = user.displayAvatarURL({ extension: "png", size: 4_096, forceStatic: true });
            let avatarFile = []

            const avatarEmbed = new EmbedBuilder()
                .setColor([255, 85, 0])
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

            if (effect === "none") {
                avatarEmbed.setImage(avatar);
            } else {
                const jimpAvatar = await Jimp.read(avatar);
                let needsArrayBuffer = false;
                let extension = "png";
                let processedAvatar;

                switch (effect) {
                    case "grayscale":
                        processedAvatar = jimpAvatar.greyscale();
                        break;

                    case "inverted":
                        processedAvatar = jimpAvatar.invert();
                        break;

                    case "sepia":
                        processedAvatar = jimpAvatar.sepia();
                        break;

                    case "deepfry":
                        const noise = await Jimp.read("./assets/images/avatars/noise.png");

                        processedAvatar = jimpAvatar.resize({ "w": 500, "h": 500 }).color([{ apply: "saturate", params: [100] }]).contrast(1).brightness(0.8).posterize(5).blur(1).composite(noise, 0, 0, { "mode": BlendMode.OVERLAY, "opacitySource": 0.5, "opacityDest": 1 });
                        break;

                    case "pixelate":
                        processedAvatar = jimpAvatar.pixelate(30);
                        break;

                    case "mirror":
                        processedAvatar = jimpAvatar.flip({ "horizontal": true });
                        break;

                    case "stonks":
                        const stonks = await Jimp.read("./assets/images/avatars/stonks.png");

                        processedAvatar = stonks.blit({ "src": jimpAvatar.resize({ "w": 400, "h": 400 }).circle(), "x": 150, "y": 60 });
                        break;

                    case "not-stonks":
                        const notStonks = await Jimp.read("./assets/images/avatars/not-stonks.png");

                        processedAvatar = notStonks.blit({ "src": jimpAvatar.resize({ "w": 350, "h": 350 }).circle(), "x": 110, "y": 25 });
                        break;

                    case "confused-stonks":
                        const confusedStonks = await Jimp.read("./assets/images/avatars/confused-stonks.png");

                        processedAvatar = confusedStonks.blit({ "src": jimpAvatar.resize({ "w": 375, "h": 375 }).circle(), "x": 120, "y": 10 });
                        break;

                    case "stop":
                        const stop = await Jimp.read("./assets/images/avatars/stop.png");

                        processedAvatar = stop.blit({ "src": jimpAvatar.resize({ "w": 325, "h": 325 }).flip({ "horizontal": true }).circle(), "x": 700, "y": 65 });
                        break;

                    case "absolute-cinema":
                        const absoluteCinema = await Jimp.read("./assets/images/avatars/absolute-cinema.png");

                        processedAvatar = absoluteCinema.blit({ "src": jimpAvatar.resize({ "w": 415, "h": 415 }).greyscale().circle(), "x": 525, "y": 100 });
                        break;

                    case "rat":
                        const rat = await Jimp.read("./assets/images/avatars/rat.png");

                        processedAvatar = rat.blit({ "src": jimpAvatar.resize({ "w": 250, "h": 250 }).flip({ "horizontal": true }).circle(), "x": 130, "y": 250 });
                        break;

                    case "wanted":
                        processedAvatar = await fetch(`https://api.popcat.xyz/v2/wanted?image=${avatar}`);
                        needsArrayBuffer = true;
                        break;

                    case "pet":
                        processedAvatar = await fetch(`https://api.popcat.xyz/v2/pet?image=${avatar}`);
                        needsArrayBuffer = true;
                        extension = "gif";
                        break;
                }

                const avatarBuffer = needsArrayBuffer ? await processedAvatar.arrayBuffer() : await processedAvatar.getBuffer("image/png");

                avatarFile.push(new AttachmentBuilder(needsArrayBuffer ? new Buffer.from(avatarBuffer) : avatarBuffer, { name: `${effect}.${extension}` }));
                avatarEmbed.setImage(`attachment://${effect}.${extension}`)
            }

            await interaction.editReply({ embeds: [avatarEmbed], files: avatarFile });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};