const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Fun",
    data: new SlashCommandBuilder()
        .setName("nostalgia")
        .setDescription("Pour découvrir ou redécouvrir d'anciennes commandes et fonctionalités !")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addStringOption(option => option
            .setName("command")
            .setDescription("Choisis une commande.")
            .addChoices(
                { name: "💾 Info bot (Cirno)", value: "info-bot" },
                { name: "🎴 CBShop", value: "cb-shop" },
                { name: "👾 ArcadeShop", value: "arcade-shop" },
                { name: "🧊 Cirno Shop", value: "cirno-shop" },
                { name: "📘 Cirno Mag'", value: "cirno-mag" },
                { name: "🐟 Fish", value: "fish" },
                { name: "💎 Mining Simulator", value: "mining-simulator" },
                { name: "🥛 Choccy", value: "choccy" },
                { name: "📝 Edited message", value: "edit" },
                { name: "🕓 Taimugemu", value: "taimugemu" },
                { name: "💻 Hack", value: "hack" })
            .setRequired(true)),
    async execute(interaction, client) {
        try {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });

            const commandType = interaction.options.getString("command");

            switch (commandType) {
                case "fish":

                    const nostalgiaFishButton = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setLabel("🎣")
                            .setStyle(ButtonStyle.Primary)
                            .setCustomId(`old-fish_no-catch_${interaction.user.id}`));

                    let nostalgiaFishEmbed = new EmbedBuilder()
                        .setColor([84, 150, 255])
                        .setTitle("Clique sur 🎣 quand le poisson est sous le flotteur !")
                        .setDescription("<:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:TokinotsukiOldSprite:1392835480692850698><:Fence:1392835534614958222>\n<:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:Float:1392835544588877905><:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:GrassBlock:1392835505334390875><:GrassBlock:1392835505334390875>\n<:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:DirtBlock:1392835518118629449><:DirtBlock:1392835518118629449>\n<:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:DirtBlock:1392835518118629449><:DirtBlock:1392835518118629449>")
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                    await interaction.followUp({ embeds: [nostalgiaFishEmbed], components: [nostalgiaFishButton] });

                    setTimeout(async () => {
                        nostalgiaFishEmbed = nostalgiaFishEmbed
                            .setDescription("<:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:TokinotsukiOldSprite:1392835480692850698><:Fence:1392835534614958222>\n<:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:Float:1392835544588877905><:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:GrassBlock:1392835505334390875><:GrassBlock:1392835505334390875>\n<:FishFlip:1392838139797831680><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:DirtBlock:1392835518118629449><:DirtBlock:1392835518118629449>\n<:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:DirtBlock:1392835518118629449><:DirtBlock:1392835518118629449>");

                        await interaction.editReply({ embeds: [nostalgiaFishEmbed] });
                    }, 1_000);

                    setTimeout(async () => {
                        nostalgiaFishEmbed = nostalgiaFishEmbed
                            .setDescription("<:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:TokinotsukiOldSprite:1392835480692850698><:Fence:1392835534614958222>\n<:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:Float:1392835544588877905><:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:GrassBlock:1392835505334390875><:GrassBlock:1392835505334390875>\n<:Empty:1392835565723975873><:FishFlip:1392838139797831680><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:DirtBlock:1392835518118629449><:DirtBlock:1392835518118629449>\n<:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:DirtBlock:1392835518118629449><:DirtBlock:1392835518118629449>");

                        await interaction.editReply({ embeds: [nostalgiaFishEmbed] });
                    }, 2_000);

                    setTimeout(async () => {
                        nostalgiaFishEmbed = nostalgiaFishEmbed
                            .setDescription("<:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:TokinotsukiOldSprite:1392835480692850698><:Fence:1392835534614958222>\n<:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:Float:1392835544588877905><:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:GrassBlock:1392835505334390875><:GrassBlock:1392835505334390875>\n<:Empty:1392835565723975873><:Empty:1392835565723975873><:FishFlip:1392838139797831680><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:DirtBlock:1392835518118629449><:DirtBlock:1392835518118629449>\n<:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:DirtBlock:1392835518118629449><:DirtBlock:1392835518118629449>");

                        await interaction.editReply({ embeds: [nostalgiaFishEmbed] });
                    }, 3_000);

                    setTimeout(async () => {
                        const nostalgiaFishCatchButton = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setLabel("🎣")
                                .setStyle(ButtonStyle.Danger)
                                .setCustomId(`old-fish_catch_${interaction.user.id}`));

                        nostalgiaFishEmbed = nostalgiaFishEmbed
                            .setColor([176, 9, 9])
                            .setDescription("<:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:TokinotsukiOldSprite:1392835480692850698><:Fence:1392835534614958222>\n<:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:Float:1392835544588877905><:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:GrassBlock:1392835505334390875><:GrassBlock:1392835505334390875>\n<:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:FishFlip:1392838139797831680><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:DirtBlock:1392835518118629449><:DirtBlock:1392835518118629449>\n<:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:DirtBlock:1392835518118629449><:DirtBlock:1392835518118629449>");

                        await interaction.editReply({ embeds: [nostalgiaFishEmbed], components: [nostalgiaFishCatchButton] });
                    }, 4_000);

                    setTimeout(async () => {
                        nostalgiaFishEmbed = nostalgiaFishEmbed
                            .setDescription("<:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:TokinotsukiOldSprite:1392835480692850698><:Fence:1392835534614958222>\n<:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:Float:1392835544588877905><:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:GrassBlock:1392835505334390875><:GrassBlock:1392835505334390875>\n<:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:FishFlip:1392838139797831680><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:DirtBlock:1392835518118629449><:DirtBlock:1392835518118629449>\n<:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:DirtBlock:1392835518118629449><:DirtBlock:1392835518118629449>");

                        await interaction.editReply({ embeds: [nostalgiaFishEmbed] });
                    }, 5_000);

                    const lastTimeout = setTimeout(async () => {
                        const lastMessage = await interaction.fetchReply();

                        if (lastMessage.components.length === 0)
                            return clearTimeout(lastTimeout);

                        nostalgiaFishEmbed = nostalgiaFishEmbed
                            .setColor([84, 150, 255])
                            .setTitle(". . .")
                            .setDescription("<:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:TokinotsukiOldSprite:1392835480692850698><:Fence:1392835534614958222>\n<:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:Float:1392835544588877905><:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:Waves:1392835555032567921><:GrassBlock:1392835505334390875><:GrassBlock:1392835505334390875>\n<:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:DirtBlock:1392835518118629449><:DirtBlock:1392835518118629449>\n<:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:Empty:1392835565723975873><:DirtBlock:1392835518118629449><:DirtBlock:1392835518118629449>");

                        await interaction.editReply({ embeds: [nostalgiaFishEmbed], components: [] });
                    }, 6_000);
                    break;

                case "taimugemu":
                    function shuffle(array) {
                        for (let i = array.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));

                            [array[i], array[j]] = [array[j], array[i]];
                        }

                        return array;
                    }

                    const realHours = new Date().getHours().toLocaleString();
                    const realMinutes = new Date().getMinutes().toLocaleString();
                    const fakeFirstHours = new Date().getHours() + 1;
                    const fakeFirstMinutes = (new Date().getHours() * 2) % 60;
                    const fakeSecondHours = Math.abs(new Date().getHours() - new Date().getSeconds());
                    const fakeSecondMinutes = (new Date().getMinutes() + new Date().getMilliseconds()) % 60;
                    const fakeThirdHours = Math.round(new Date().getHours() / new Date().getDay());
                    const fakeThirdMinutes = (new Date().getMinutes() * new Date().getMilliseconds()) % 60;
                    const fakeFourthMinutes = (new Date().getSeconds() * 120) % 60;
                    const letters = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮"];
                    const shuffledLetters = shuffle(letters);
                    const times = [`${realMinutes}H${realHours}`, `${realHours}H${fakeFourthMinutes}`, `${realHours}H${fakeFirstMinutes}`, `${fakeSecondHours}H${realMinutes}`, `${fakeFirstHours}H${realMinutes}`, `${realHours}H${fakeSecondMinutes}`, `${fakeSecondHours}H${fakeSecondMinutes}`, `${fakeThirdHours}H${fakeThirdMinutes}`, `${realHours}H${realMinutes}`];
                    const shuffledTimes = shuffle(times);

                    const taimugemuEmbed = new EmbedBuilder()
                        .setColor([255, 85, 0])
                        .setTitle("__Quelle heure est-il ?__")
                        .setDescription("*Flemme de faire marcher la commande...*")
                        .addFields(
                            { name: `${shuffledLetters[0]} ${shuffledTimes[0]}`, value: "‎", inline: true },
                            { name: `${shuffledLetters[1]} ${shuffledTimes[1]}`, value: "‎", inline: true },
                            { name: `${shuffledLetters[2]} ${shuffledTimes[2]}`, value: "‎", inline: true },
                            { name: `${shuffledLetters[3]} ${shuffledTimes[3]}`, value: "‎", inline: true },
                            { name: `${shuffledLetters[4]} ${shuffledTimes[4]}`, value: "‎", inline: true },
                            { name: `${shuffledLetters[5]} ${shuffledTimes[5]}`, value: "‎", inline: true },
                            { name: `${shuffledLetters[6]} ${shuffledTimes[6]}`, value: "‎", inline: true },
                            { name: `${shuffledLetters[7]} ${shuffledTimes[7]}`, value: "‎", inline: true },
                            { name: `${shuffledLetters[8]} ${shuffledTimes[8]}`, value: "‎", inline: true })
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                    await interaction.editReply({ embeds: [taimugemuEmbed] });
                    break;

                case "edit":
                    await interaction.editReply({ content: "** **" });

                    setTimeout(async () => {
                        await interaction.editReply({ content: "J'ai  ‫! ce message ‫" });
                    }, 1);
                    break;

                case "choccy":
                    const getSeconds = new Date().getSeconds();
                    let choccyName;

                    getSeconds % 2 === 0 ? choccyName = "choccy" : choccyName = "choccy-pixel-art";

                    const choccyEmbed = new EmbedBuilder()
                        .setColor([0, 152, 217])
                        .setImage(`attachment://${choccyName}.png`)
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                    await interaction.editReply({ embeds: [choccyEmbed], files: [`./assets/images/archives/${choccyName}.png`] });
                    break;

                case "cb-shop":
                    const cbshopEmbed = new EmbedBuilder()
                        .setColor([0, 152, 217])
                        .setTitle("Shop")
                        .setDescription("Description des articles: \n \n-1 carte_combat => 1000<:CardCoin:1392840466160029888> \n \n-5 cartes_objets => 10,000<:CardCoin:1392840466160029888> \n \n \nPour acheter un produit (ce qui n'est pas encore possible lol), faite >buy [le nom du produit].")
                        .setThumbnail("attachment://cirno.png")
                        .setImage("attachment://card-shop.png")
                        .setTimestamp()
                        .setFooter({ text: "Bot Cirno par MagicTendo", iconURL: "attachment://cirno.png" });

                    await interaction.editReply({ embeds: [cbshopEmbed], files: ["./assets/images/archives/cirno.png", "./assets/images/archives/card-shop.png"] });
                    break;

                case "arcade-shop":
                    const arcadeshopEmbed = new EmbedBuilder()
                        .setColor([0, 152, 217])
                        .setTitle("Arcade shop")
                        .setDescription("Description des articles: \n \n-1 ticket classique => 10 <:ArcadeCoin:1392840548355805369> \n \n-1 ticket d'argent => 30 <:ArcadeCoin:1392840548355805369> \n \n-1 ticket d'émeraude => 50 <:ArcadeCoin:1392840548355805369> \n \n-1 ticket Cirno => 99 <:ArcadeCoin:1392840548355805369>")
                        .setThumbnail("attachment://cirno-pixel-art.png")
                        .setImage("attachment://arcade-shop.png")
                        .setTimestamp()
                        .setFooter({ text: "Bot Cirno par MagicTendo", iconURL: "attachment://cirno.png" });

                    await interaction.editReply({ embeds: [arcadeshopEmbed], files: ["./assets/images/archives/cirno.png", "./assets/images/archives/arcade-shop.png"] });
                    break;

                case "cirno-shop":
                    var cirnoShopEmbed = new EmbedBuilder()
                        .setColor([0, 152, 217])
                        .setTitle("Bienvenue dans le Cirno shop !")
                        .setDescription("Consultez la documentation en cliquant sur le message en bleu pour voir la description des articles.")
                        .setThumbnail("attachment://cirno-shop.png")
                        .addFields(
                            { name: "<:CirnoBadge:1392840823678439545> Badge Cirno (1 de disponible)", value: "=> 1<:CirnoCoin:1392840627347259594>", inline: true },
                            { name: "<:CirnoCandy:1392843151974072383> Bonbons Cirno (50 de disponibles)", value: "=> 5<:CirnoCoin:1392840627347259594>", inline: true },
                            { name: "<:CirnoMag:1392841110912765994> Cirno mag' (1 de disponible)", value: "=> 15<:CirnoCoin:1392840627347259594>", inline: true },
                            { name: "<:Box:1392841215820562484> Carton (10 de disponibles)", value: "=> 50<:CirnoCoin:1392840627347259594>", inline: true },
                            { name: "<:Windows9:1392841299337547858> Windows ⑨ (1 de disponible)", value: "=> 99<:CirnoCoin:1392840627347259594>", inline: true },
                            { name: "<:CirnoPlush:1392841382078578779> Peluche Cirno (1 de disponible)", value: "=> 250<:CirnoCoin:1392840627347259594>", inline: true },
                            { name: "<:CirnoEX:1392841427410747412> CirnoEX (1 de disponible)", value: "=> 500<:CirnoCoin:1392840627347259594>", inline: true },
                            { name: "<:TouhoumonCirnoEdition:1392841472260308994> Touhoumon Cirno édition (1 de disponible)", value: "=> 99 999<:CirnoCoin:1392840627347259594>", inline: true },
                            { name: "<:CirnoCreditCard:1392841577365377064> Ma carte bancaire (1 de disponible)", value: "=> 999 999 999<:CirnoCoin:1392840627347259594>", inline: true })
                        .setTimestamp()
                        .setFooter({ text: "Bot Cirno par MagicTendo", iconURL: "attachment://cirno.png" });

                    await interaction.editReply({ embeds: [cirnoShopEmbed], files: ["./assets/images/archives/cirno-shop.png", "./assets/images/archives/cirno.png"] });
                    break;

                    case "cirno-mag":
                    await interaction.editReply({ files: ["./assets/images/archives/cirno-mag-1.png", "./assets/images/archives/cirno-mag-2.png", "./assets/images/archives/cirno-mag-3.png", "./assets/images/archives/cirno-mag-4.png", "./assets/images/archives/cirno-mag-5.png", "./assets/images/archives/cirno-mag-6.png", "./assets/images/archives/cirno-mag-7.png", "./assets/images/archives/cirno-mag-8.png", "./assets/images/archives/cirno-mag-9.png"] });
                    break;

                case "mining-simulator":
                    const miningSimulatorEmbed = new EmbedBuilder()
                        .setColor([0, 152, 217])
                        .setTitle("Mining simulator")
                        .setDescription("<:Sky:1392835751426654289><:Sky:1392835751426654289><:Sky:1392835751426654289><:Sky:1392835751426654289><:Sky:1392835751426654289><:Sky:1392835751426654289><:Cloud:1392835779750789171><:Sky:1392835751426654289><:Sun:1392835796595249203>\n<:Sky:1392835751426654289><:Sky:1392835751426654289><:Sky:1392835751426654289><:Sky:1392835751426654289><:Sky:1392835751426654289><:Sky:1392835751426654289><:Sky:1392835751426654289><:Sky:1392835751426654289><:Sky:1392835751426654289>\n<:Sky:1392835751426654289><:Cirno:1392835863431479441><:Sky:1392835751426654289><:Grass:1392835915675734118><:Flower:1392835876266049576><:Sky:1392835751426654289><:Sky:1392835751426654289><:Grass:1392835915675734118><:Sky:1392835751426654289>\n<:GrassMining:1392836196681646130><:GrassMining:1392836196681646130><:GrassMining:1392836196681646130><:GrassMining:1392836196681646130><:GrassMining:1392836196681646130><:GrassMining:1392836196681646130><:GrassMining:1392836196681646130><:GrassMining:1392836196681646130><:GrassMining:1392836196681646130>\n<:DirtMining:1392836157884207298><:DirtMining:1392836157884207298><:DirtMining:1392836157884207298><:DirtMining:1392836157884207298><:DirtMining:1392836157884207298><:DirtMining:1392836157884207298><:DirtMining:1392836157884207298><:DirtMining:1392836157884207298><:DirtMining:1392836157884207298>\n<:DirtMining:1392836157884207298><:DirtMining:1392836157884207298><:DirtMining:1392836157884207298><:StoneMining:1392836250699825182><:StoneMining:1392836250699825182><:DirtMining:1392836157884207298><:DirtMining:1392836157884207298><:DirtMining:1392836157884207298><:DirtMining:1392836157884207298>\n<:StoneMining:1392836250699825182><:StoneMining:1392836250699825182><:StoneMining:1392836250699825182><:StoneMining:1392836250699825182><:StoneMining:1392836250699825182><:StoneMining:1392836250699825182><:StoneMining:1392836250699825182><:StoneMining:1392836250699825182><:StoneMining:1392836250699825182>")
                        .setThumbnail("attachment://mining-simulator.png")
                        .setTimestamp()
                        .setFooter({ text: "Bot Cirno par MagicTendo", iconURL: "attachment://cirno.png" });

                    await interaction.editReply({ embeds: [miningSimulatorEmbed], files: ["./assets/images/archives/mining-simulator.png", "./assets/images/archives/cirno.png"] });
                    break;

                case "info-bot":
                    const infoCirnoEmbed = new EmbedBuilder()
                        .setColor([0, 152, 217])
                        .setTitle("Informations sur le bot:")
                        .addFields(
                            { name: "__Date création:__", value: "12/05/2020.", inline: true },
                            { name: "__Version:__", value: "1.0.0.", inline: true },
                            { name: "__Serveurs:__", value: "10 serveurs.", inline: true },
                            { name: "__Utilisateurs:__", value: "8.", inline: true },
                            { name: "__Mémoire utilisée:__", value: "34.4 Mo.", inline: true },
                            { name: "__Nombre patchnotes:__", value: "0.", inline: true },
                            { name: "__Nombre lignes code:__", value: "2863.", inline: true },
                            { name: "__Développeur:__", value: "MagicTendo.", inline: true },
                            { name: "__Aides pour le code:__", value: "Hasuko et Yurisensei.", inline: true },
                            { name: "__Aide pour la doc':__", value: "Ninjdai.", inline: true },
                            { name: "__Bugs hunter:__", value: "Ninjdai.", inline: true },
                            { name: "__Créateur de Cirno:__", value: "ZUN.", inline: true },
                            { name: "__Langage:__", value: "Java Script.", inline: true },
                            { name: "__Documentation:__", value: 'https://documentationCirno.fr', inline: true },
                            { name: "__Librairie:__", value: "Discord.js.", inline: true },
                            { name: "__Serveur support:__", value: "https://discord.io/Cirno-official", inline: true },
                            { name: "__Fandom:__", value: "https://frama.link/Cirnobot", inline: true },
                            { name: "__Code source:__", value: "[Insére lien Github]", inline: true })
                        .setThumbnail("attachment://cirno.png")
                        .setTimestamp()
                        .setFooter({ text: "Bot incroyable par MagicTendo", iconURL: "attachment://cirno.png" });

                    await interaction.editReply({ embeds: [infoCirnoEmbed], files: [ "./assets/images/archives/cirno.png"] });
                    break;

                case "hack":
                    await interaction.editReply({ content: "<a:Loading:1400419944847376438> Connexion à la base de données... (User: BakaTaida, Password: ||#BakaTendo5+4=9||)" });

                    setTimeout(async () => {
                        await interaction.editReply({ content: "<a:Loading:1400419944847376438> Décryptage des données..." });

                        setTimeout(async () => {
                            await interaction.editReply({ content: "<a:Loading:1400419944847376438> Hack du bot en cours..." });

                            setTimeout(async () => {
                                await interaction.editReply({ content: "Action interrompue, code erreur : `403`" });
                            }, 7_000);
                        }, 10_000);
                    }, 2_000);
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};