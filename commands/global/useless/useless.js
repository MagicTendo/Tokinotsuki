const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const { getValue, hasValue } = require("../../../tools/database.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Inutile",
    data: new SlashCommandBuilder()
        .setName("useless")
        .setDescription("Un groupe de commandes, bien inutiles !")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addSubcommand(subcommand => subcommand
            .setName("cat")
            .setDescription("Pour avoir un chat d'une hauteur personalisée !")
            .addIntegerOption(option => option
                .setName("height")
                .setDescription("La hauteur du chat.")
                .setMinValue(3)
                .setMaxValue(15)
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("everyone")
            .setDescription("Pour... envoyer un @everyone sans permissions ?!"))

        .addSubcommand(subcommand => subcommand
            .setName("juck")
            .setDescription("Affiche Juck en émojis."))

        .addSubcommand(subcommand => subcommand
            .setName("kyuju")
            .setDescription("Affiche un kyuju en émojis."))

        .addSubcommand(subcommand => subcommand
            .setName("owo")
            .setDescription("Affiche un gros OwO en émojis."))

        .addSubcommand(subcommand => subcommand
            .setName("uwu")
            .setDescription("Affiche un gros UwU en émojis."))

        .addSubcommand(subcommand => subcommand
            .setName("no-you")
            .setDescription("Envoie un émoji \"no you\" aléatoire."))

        .addSubcommand(subcommand => subcommand
            .setName("pop")
            .setDescription("Simule du papier bulle !"))

        .addSubcommand(subcommand => subcommand
            .setName("time")
            .setDescription("Permet de connaître l'heure exacte."))

        .addSubcommand(subcommand => subcommand
            .setName("tokinomp4")
            .setDescription("Affiche en lecteur MP4 créé avec un embed.")),
    async execute(interaction, client) {
        try {
            async function generateKaomoji(kaomoji) {
                const emojis = ["⬜", "⬛", "🟫", "🟪", "🟦", "🟩", "🟨", "🟧", "🟥", "🔲", "🔳", "⚪", "⚫", "🟤", "🟣", "🔵", "🟢", "🟡", "🟠", "🔴", "🔘", "🤍", "🩶", "🖤", "🤎", "💜", "🩵", "💙", "💚", "💛", "🧡", "🩷", "❤️", "🔷", "🔶", "☑️", "⏹️", "⏺️", "❎", "✅", "⭕", "⭐", "🌕", "🌑", "☀️", "🌀", "🌫️", "🚪", "🌇", "🌆", "🌅", "🌄", "🌃", "🌁", "🌉", "🏙️", "🛣️", "🏞️", "🛤️", "🌌", "🧊", "🍪", "🍞", "📉", "📈", "📊", "📅", "🏧", "📆", "🗓️", "📁", "🗃️", "🧮", "💾", "💽", "🩻", "🎹", "🎛️", "🎼", "🎞️", "🖼️", "🎑", "🎇", "🎆", "🫠"];
                const finalKaomoji = [];
                const selectedEmojis = [...emojis].sort(() => 0.5 - Math.random()).slice(0, 2);

                for (let i = 0; i < kaomoji.length; i++) {
                    if (kaomoji[i] === "0") {
                        finalKaomoji.push(selectedEmojis[0]);
                    } else if (kaomoji[i] === "1") {
                        finalKaomoji.push(selectedEmojis[1]);
                    } else {
                        finalKaomoji.push("\n");
                    }
                }

                return await interaction.reply({ content: finalKaomoji.join("") });
            }

            switch (interaction.options.getSubcommand()) {
                case "cat":
                    const catHeight = interaction.options.getInteger("height");

                    const catTop = "A____A\n|・ㅅ・|\n|っ　っ|\n";
                    const catMiddle = "|　　　|\n".repeat(catHeight - 2);
                    const catBottom = "U ￣￣ U";
                    const finalCat = catTop + catMiddle + catBottom;

                    await interaction.reply({ content: finalCat });
                    break;

                case "owo":
                    const owo = "01110000000001110\n10001000000010001\n10001000000010001\n10001010101010001\n01110001010001110";

                    await generateKaomoji(owo);
                    break;

                case "uwu":
                    const uwu = "10001000000010001\n10001000000010001\n10001000000010001\n10001010101010001\n01110001010001110";

                    await generateKaomoji(uwu);
                    break;

                case "juck":
                    const juck = "⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬛\n⬛⬜⬛⬛⬜⬜⬜⬜⬜⬜⬜⬜⬛\n⬛⬜⬛⬛⬜⬜⬜⬜⬜⬜⬜⬜⬛\n⬛⬜⬛⬛⬜⬜⬜⬜⬛⬛⬛⬜⬛\n⬛⬜⬛⬛⬜⬜⬜⬜⬜⬜⬜⬜⬛\n⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬛\n⬛⬜⬛⬛⬛⬛⬛⬛⬛⬛⬛⬜⬛\n⬛⬜⬛⬛⬛⬛⬛⬛⬛⬛⬛⬜⬛\n⬛⬜⬛⬛⬛⬛⬛⬛⬛⬛⬜⬜⬛\n⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬛\n⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛";

                    await interaction.reply({ content: juck });
                    break;

                case "kyuju":
                    const kyuju = "<:Empty:1392835565723975873>🟫🟫🟫🟫🟫🟫<:Empty:1392835565723975873>\n<:Empty:1392835565723975873>🟫🟧🟧🟧🟧🟫🟫\n🟫🟫🟧🟧🟧🟧🟧🟫\n🟫🟧🟧🟫⬜🟫🟧🟫\n🟫🟧🟧🟫⬜🟫🟧🟫\n🟫🟧🟧⬜⬜🟧🟧🟫\n🟫🟫🟧🟨🟨🟧🟫🟫\n🟫🟫🟨🟨🟨🟨🟫🟫\n🟫⬜🟨🟨🟨🟨⬜🟫\n🟫🟫🟧🟧🟨🟨🟫🟫\n<:Empty:1392835565723975873>🟫🟧🟧🟧🟧🟫<:Empty:1392835565723975873>\n<:Empty:1392835565723975873>🟫🟧🟫🟫🟧🟫<:Empty:1392835565723975873>\n<:Empty:1392835565723975873>🟫🟫🟫🟫🟫🟫<:Empty:1392835565723975873>";

                    await interaction.reply({ content: kyuju });
                    break;

                case "everyone":
                    await interaction.channel.sendTyping();

                    setTimeout(async function () {
                        await interaction.reply({ content: "Salut @everyοne ! :D" });
                        await interaction.channel.sendTyping();

                        setTimeout(async () => {
                            await interaction.followUp({ content: "*Mais... pourquoi ça ne marche pas ? D:*" });
                        }, 2_000);
                    }, 1_000);
                    break;

                case "tokinomp4":
                    const tokiMP4Embed = new EmbedBuilder()
                        .setColor([255, 85, 0])
                        .setDescription("⬛⬛⬛🟧🟧🟧⬛⬛⬛\n⬛⬛🟧🟧🟧🟧🟧⬛⬛\n⬛🟧🟧🟧🟧🟧🟧🟧⬛\n⬛🟧🟧🟧🟧🟨🟨🟧🟧\n🟧🟧🟨🟧🟨🟫🟨🟫🟧\n🟧🟧🟨🟧🟨🟫🟨🟫🟧\n🟧🟧🟧🟨🟨🟨🟨🟨🟧\n🟧🟧🟧🟧🟨🟨🟨🟧🟧\n🟧🟧⬜⬜⬜⬜⬜🟧🟧\n\n> **時の月 － タイム**\n➖➖➖➖➖➖――――\n2:14                                   3:09\n⇆       ◁        ❚❚        ▷        ↻")
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                    await interaction.reply({ embeds: [tokiMP4Embed] });
                    break;

                case "time":
                    const time = new Date().toLocaleTimeString("fr-FR", { timeZone: "Europe/Paris" });
                    const timeArray = time.split(":");

                    await interaction.reply({ content: `🕰️ Il est ${timeArray[0]} heures, ${timeArray[1]} minutes et ${timeArray[2]} secondes !`, flags: [MessageFlags.Ephemeral] });
                    break;

                case "no-you":
                    if (Object.keys(interaction.authorizingIntegrationOwners)[0] === "1")
                        return await interaction.reply({ content: "❌ Je dois être sur le serveur afin d'effectuer cette commande !", flags: [MessageFlags.Ephemeral] });

                    if (await hasValue(interaction.guild.id, "guilds",  "anti-say")) {
                        const antisayRole = await getValue(interaction.guild.id, "guilds", "anti-say-role");

                        if (!interaction.member.roles.cache.some(role => role.id === antisayRole))
                            return await interaction.reply({ content: "❌ Cette fonctionalité est désactivée sur ce serveur !", flags: [MessageFlags.Ephemeral] });
                    }

                    const noYouEmojis = ["<:AnimeNoYou:1376673365447807127>", "<:AshidoNoYou:1376673370309001317>", "<:BakugouNoYou:1376673371953303683>", "<:BlobNoYou:1376673373366648902>", "<:CardNoYou:1376673378496155688>", "<:CatNoYou:1376673380283191356>", "<:CirnoNoYou:1376673382044794962>", "<:EmideeNoYou:1376673387207856200>", "<:EmojiNoYou:1376673388541771856>", "<:HaruNoYou:1376673395340607560>", "<:HatCatNoYou:1376673397265793086>", "<:KaguyaNoYou:1376673399471996950>", "<:KirishimaNoYou:1376673402831765614>", "<:KorufuyukiNoYou:1376673406858166292>", "<:LeafeonNoYou:1376673408510591068>", "<:LouiseNoYou:1376673411857649685>", "<:NatsukiNoYou:1376673413703274597>", "<:OdeDuClimatNoYou:1376673415645237309>", "<:PandaNoYou:1376673420871340183>", "<:PepeNoYou:1376673422997848084>", "<:PinkBlobNoYou:1376673424964980737>", "<:PinkNoYou:1376673427561119895>", "<:PurpleNoYou:1376673431793172663>", "<:RedNoYou:1376673434607550585>", "<:RedPandaNoYou:1376673437891825774>", "<:UmbreonNoYou:1376673441154990090>", "<:UnoNoYou:1376673444934058035>", "<a:YugiNoYou:1376673446871961620>", "<:GuraNoYou:1376673795024355438>", "<:SansNoYou:1376674635520802866>", "<:JackNoYou:1376678225387978813>"];
                    const randomEmojiIndex = Math.floor(Math.random() * noYouEmojis.length);

                    await interaction.reply({ content: noYouEmojis[randomEmojiIndex] });
                    break;

                case "pop":
                    const pop = "||POP||";
                    const width = Math.floor(Math.random() * 6) + 9;
                    const height = Math.floor(width / 2.5);
                    const bubbleWrapRow = `${`${pop} `.repeat(width)}\n`;
                    let bubbleWrap = bubbleWrapRow.repeat(height);

                    if (width === 9) {
                        const randomIndex = Math.floor(Math.random() * (width * height));
                        let i = 0;

                        bubbleWrap = bubbleWrap.replace(/\|\|POP\|\|/g, (match) => {
                            i++;
                            return i === randomIndex ? "||[POP](<https://tokinotsuki.rf.gd/pop>)||" : match;
                        });
                    }

                    await interaction.reply({ content: bubbleWrap, flags: [MessageFlags.Ephemeral] });
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};