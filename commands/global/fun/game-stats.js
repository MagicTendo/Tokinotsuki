const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, MessageFlags } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Fun",
    data: new SlashCommandBuilder()
        .setName("game-stats")
        .setDescription("Pour obtenir des informations à propos de jeux vidéo.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addSubcommand(subcommand => subcommand
            .setName("minecraft-player")
            .setDescription("Permet d'obtenir des statistiques sur un joueur Minecraft.")
            .addStringOption(option => option
                .setName("player-name-or-uuid")
                .setDescription("Le pseudonyme ou l'UUID du joueur.")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("minecraft-server")
            .setDescription("Permet d'obtenir des informations sur un serveur Minecraft.")
            .addStringOption(option => option
                .setName("ip")
                .setDescription("L'IP du serveur.")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("osu")
            .setDescription("Permet de voir le profile d'un joueur osu! sur l'un des quatres modes.")
            .addStringOption(option => option
                .setName("username")
                .setDescription("Nom de l'utilisateur")
                .setRequired(true))
            .addStringOption(option => option
                .setName("game-mode")
                .setDescription("Choisis le mode de jeu.")
                .addChoices(
                    { name: "⭕ osu!", value: "osu" },
                    { name: "🥁 osu!taiko", value: "taiko" },
                    { name: "🍏 osu!catch", value: "fruits" },
                    { name: "🎹 osu!mania", value: "mania" })
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("speedrun")
            .setDescription("Donne le classement any% d'un jeu.")
            .addStringOption(option => option
                .setName("game-name")
                .setDescription("Le nom du jeu.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("category")
                .setDescription("La catégorie de speedrun. La valeur de base est any% ou le classement de base.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("super-mario-maker-1")
            .setDescription("Donne un niveau aléatoire. La fonction de recherche est désactivé car il n'y a pas les identifiants."))

        .addSubcommand(subcommand => subcommand
            .setName("super-mario-maker-2")
            .setDescription("Pour voir un niveau ou un profile sur Super Mario Maker 2.")
            .addStringOption(option => option
                .setName("id")
                .setDescription("Met l'ID d'un niveau ou d'un créateur.")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("yunayunori")
            .setDescription("Permet de consulter le classement des jeux Yunayunori !")
            .addStringOption(option => option
                .setName("game")
                .setDescription("Le jeu à voir le classement.")
                .addChoices(
                    { name: "🌋 Shūtānopikuseru", value: "shutanopikuseru" },
                    { name: "🫠「何とも最悪のゲーム、とても出鱈目と本当に悪いと大いに憤ろしいと中々異様と甚だ難しいと非常に煩わしいと余程おもんねーなど、誰も遊ぶな…」", value: "worst-game" },
                    { name: "🥊 ROPUGE BATORU", value: "ropuge-batoru" })
                .setRequired(true))),
    async execute(interaction, client) {
        try {
            switch (interaction.options.getSubcommand()) {
                case "minecraft-player":
                    const minecraftUser = interaction.options.getString("player-name-or-uuid");
                    let cleanUsername;
                    let cleanUIID;

                    const nameToUUIDResponse = await fetch(`https://api.mojang.com/users/profiles/minecraft/${minecraftUser}`);
                    const nameToUUIDData = await nameToUUIDResponse.json();

                    cleanUIID = nameToUUIDData["error"] === undefined ? nameToUUIDData["id"] : minecraftUser;

                    const UUIDToNameResponse = await fetch(`https://api.ashcon.app/mojang/v2/user/${cleanUIID}`);
                    const UUIDToNameData = await UUIDToNameResponse.json();

                    cleanUsername = UUIDToNameData["username"];

                    if (UUIDToNameData["errorMessage"] || cleanUIID === undefined)
                        return await interaction.reply({ content: "❌ Ce joueur n'est pas sur Minecraft !", flags: MessageFlags.Ephemeral });

                    const playerHeadResponse = await fetch(`https://crafatar.com/avatars/${cleanUIID}?scale=10&overlay`);
                    const playerBodyResponse = await fetch(`https://crafatar.com/renders/body/${cleanUIID}?scale=10&overlay`);
                    const playerHeadBuffer = await playerHeadResponse.arrayBuffer();
                    const playerBodyBuffer = await playerBodyResponse.arrayBuffer();
                    const playerHead = new AttachmentBuilder(new Buffer.from(playerHeadBuffer), { name: "player-head.png" });
                    const playerBody = new AttachmentBuilder(new Buffer.from(playerBodyBuffer), { name: "player-body.png" });
                    const playerSkin = `https://crafatar.com/skins/${cleanUIID}`;
                    const playerCape = `https://crafatar.com/capes/${cleanUIID}`;

                    const minecraftPlayerEmbed = new EmbedBuilder()
                        .setColor([255, 85, 0])
                        .setTitle(`Profile de ${cleanUsername}`)
                        .setURL(`https://namemc.com/profile/${cleanUsername}`)
                        .setDescription(`🆔 **UUID** : ${cleanUIID}\n🖌️ **Skin** : [Lien](${playerSkin})\n🚩 **Cape** : [Lien](${playerCape})`)
                        .setThumbnail("attachment://player-head.png")
                        .setImage("attachment://player-body.png")
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                    await interaction.reply({ embeds: [minecraftPlayerEmbed], files: [playerHead, playerBody] });
                    break;

                case "minecraft-server":
                    const minecraftServerIP = interaction.options.getString("ip");

                    await fetch(`https://mcapi.us/server/status?ip=${minecraftServerIP}`).then(function (response) {
                        return response.json();
                    }).then(async function (data) {
                        const serverStatus = data["status"];

                        if (serverStatus === "error")
                            return await interaction.reply({ content: `❌ L'addresse IP \`${minecraftServerIP}\` ne semble pas être associée à un serveur Minecraft !`, flags: MessageFlags.Ephemeral });

                        const serverName = data["server"]["name"];
                        const serverIsOnline = data["online"] ? "en ligne" : "hors ligne";
                        const serverDescription = data["motd"] ?? data["motd_json"];
                        const serverMaximumPlayers = data["players"]["max"];
                        const serverConnectedPlayers = data["players"]["now"];
                        const serverLastUpdate = data["last_updated"];
                        const serverLastUpdateTimestamp = `<t:${serverLastUpdate}:R>`;
                        const serverRawProfilePicture = data["favicon"];
                        const serverProfilePictureResponse = serverRawProfilePicture ? await fetch(serverRawProfilePicture) : null;
                        const serverProfilePictureBuffer = serverRawProfilePicture ? await serverProfilePictureResponse.arrayBuffer() : null;
                        const serverProfilePicture = serverRawProfilePicture ? [new AttachmentBuilder(new Buffer.from(serverProfilePictureBuffer), { name: "server-icon.png" })] : [];

                        const minecraftServerEmbed = new EmbedBuilder()
                            .setColor([255, 85, 0])
                            .setTitle(`Serveur Minecraft de ${serverName}`)
                            .setDescription(`🌐 **IP** : ${minecraftServerIP}\n🛜 **Statut** : ${serverIsOnline}\n✏️ **Description** : ${serverDescription}\n👥 **Capacité maximum** : ${serverMaximumPlayers} joueurs\n🟢 **En ligne** : ${serverConnectedPlayers} joueurs\n✨ **Dernière mise à jour** : ${serverLastUpdateTimestamp}`)
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                        if (serverProfilePictureBuffer)
                            minecraftServerEmbed.setThumbnail("attachment://server-icon.png");

                        await interaction.reply({ embeds: [minecraftServerEmbed], files: serverProfilePicture });
                    });
                    break;

                case "osu":
                    const osuUsername = interaction.options.getString("username");
                    const osuGameMode = interaction.options.getString("game-mode");

                    const tokenResponse = await fetch("https://osu.ppy.sh/oauth/token", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            client_id: process.env.OSU_CLIENT_ID,
                            client_secret: process.env.OSU_CLIENT_KEY,
                            grant_type: "client_credentials",
                            scope: "public"
                        })
                    });

                    const token = await tokenResponse.json();

                    const profileResponse = await fetch(`https://osu.ppy.sh/api/v2/users/${osuUsername}/${osuGameMode}`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token.access_token}`
                        }
                    });

                    const userData = await profileResponse.json();

                    if (userData["error"] === null)
                        return await interaction.reply({ content: "❌ Cet utilisateur n'est pas sur osu!", flags: MessageFlags.Ephemeral });

                    const userID = userData["id"];
                    const userName = userData["username"];
                    const userIsSupporter = userData["is_supporter"] ? `niveau ${userData["support_level"]}` : "non";
                    const userTitle = userData["title"] ? userData["title"] : "*aucun*";
                    const userCountryCode = userData["country_code"];
                    const userTeamName = userData["team"]?.["name"] ?? "*aucune*";
                    const userDefaultGameMode = userData["playmode"];
                    const userGlobalRank = userData["statistics"]["global_rank"] ?? " -";
                    const userCountryRank = userData["statistics"]["country_rank"] ?? " -";
                    const userPP = userData["statistics"]["pp"];
                    const userPlayTimeSeconds = userData["statistics"]["play_time"];
                    const userPlayTime = moment.duration(userPlayTimeSeconds, "seconds").format("d[j] H[h] m[m] s[s]");
                    const userFollowers = userData["follower_count"];
                    const userCreationDate = userData["join_date"];
                    const userCreationDateTimestamp = Math.floor(new Date(userCreationDate).valueOf() / 1_000);
                    const userIsOnline = userData["is_online"] ? "en ligne" : "hors ligne";
                    const userLevel = userData["statistics"]["level"]["current"];
                    const userLevelProgress = userData["statistics"]["level"]["progress"];
                    const userSSH = userData["statistics"]["grade_counts"]["ssh"];
                    const userSS = userData["statistics"]["grade_counts"]["ss"];
                    const userSH = userData["statistics"]["grade_counts"]["sh"];
                    const userS = userData["statistics"]["grade_counts"]["s"];
                    const userA = userData["statistics"]["grade_counts"]["a"];
                    const userRankedScore = userData["statistics"]["ranked_score"];
                    const userHitAccuracy = userData["statistics"]["hit_accuracy"];
                    const userPlayCount = userData["statistics"]["play_count"];
                    const userTotalScore = userData["statistics"]["total_score"];
                    const userTotalHits = userData["statistics"]["total_hits"];
                    const userMaximumCombo = userData["statistics"]["maximum_combo"];
                    const userReplays = userData["statistics"]["replays_watched_by_others"];
                    const userKudosu = userData["kudosu"]["total"];
                    const userAvatar = userData["avatar_url"];
                    const userBanner = userData["cover_url"];

                    const osuGameModeNames = {
                        "osu": "osu!",
                        "taiko": "osu!taiko",
                        "fruits": "osu!catch",
                        "mania": "osu!mania"
                    }

                    const osuEmbed = new EmbedBuilder()
                        .setColor([255, 85, 0])
                        .setTitle(`${osuGameMode === userDefaultGameMode ? "⭐ " : ""}Profile ${osuGameModeNames[osuGameMode]} de ${userName}`)
                        .setURL(`https://osu.ppy.sh/users/${userID}`)
                        .setDescription(`💕 **Est supporter** : ${userIsSupporter}\n🏷️ **Titre** : ${userTitle}\n🚩 **Pays** : :flag_${userCountryCode.toLowerCase()}:\n🧑‍🤝‍🧑 **Équipe** : ${userTeamName}\n🕹️ **Mode de jeu par défaut** : ${osuGameModeNames[userDefaultGameMode]}\n🌎 **Rang mondial** : #${userGlobalRank}\n🏙️ **Rang pays** : #${userCountryRank}\n🌱 **pp** : ${userPP}\n⌚ **Temps de jeu** : ${userPlayTime}\n👥 **Abonnés** : ${userFollowers}\n🕰️ **Date de création** : <t:${userCreationDateTimestamp}>\n🛜 **Activité** : ${userIsOnline}\n🆙 **Niveau** : ${userLevel} (${userLevelProgress}%)\n✨ **Rang SS+** : ${userSSH}\n⭐ **Rang SS** : ${userSS}\n🌟 **Rang S+** : ${userSH}\n🎉 **Rang S** : ${userS}\n🎊 **Rang A** : ${userA}\n📊 **Score classé** : ${userRankedScore}\n🎯 **Précision** : ${userHitAccuracy}%\n🎮 **Nombre de parties** : ${userPlayCount}\n🏆 **Score total** : ${userTotalScore}\n🖱️ **Nombre de clics** : ${userTotalHits}\n🎈 **Combo maximum** : ${userMaximumCombo}\n📺 **Replays regardés par les autres** : ${userReplays}\n🤝 **Nombre de kudosu reçu** : ${userKudosu}`)
                        .setThumbnail(userAvatar)
                        .setImage(userBanner)
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                    await interaction.reply({ embeds: [osuEmbed] });
                    break;

                case "super-mario-maker-1":
                    await fetch("https://smmdb.net/api/getstats").then(function (response) {
                        return response.json();
                    }).then(async function (data) {
                        const numberLevels = data["courses"];
                        const randomLevel = Math.floor(Math.random() * (numberLevels - 1));

                        await fetch(`https://smmdb.net/api/getcourses?start=${randomLevel}&limit=1`).then(function (response) {
                            return response.json();
                        }).then(async function (data) {
                            const levelTitle = data[0]["title"];
                            const levelMaker = data[0]["maker"];
                            const levelDescription = data[0]["description"] ?? "*aucune*";
                            const levelUploadedTimestamp = data[0]["uploaded"];
                            const levelDifficulty = data[0]["difficulty"];
                            const levelDifficultyName = levelDifficulty === 0 ? "facile" : levelDifficulty === 1 ? "normal" : levelDifficulty === 2 ? "expert" : "super expert";
                            const levelGameStyle = data[0]["gameStyle"];
                            const levelGameStyleName = levelGameStyle === 0 ? "Super Mario Bros." : levelGameStyle === 1 ? "Super Mario Bros. 3" : levelGameStyle === 2 ? "Super Mario World" : "New Super Mario Bros. U";
                            const levelTheme = data[0]["courseTheme"];
                            const levelSubworldTheme = data[0]["courseThemeSub"];
                            const levelThemeName = levelTheme === 0 ? "plein air" : levelTheme === 1 ? "souterrain" : levelTheme === 2 ? "château" : levelTheme === 3 ? "fort. volante" : levelTheme === 4 ? "aquatique" : "manoir hanté";
                            const levelSubworldThemeName = levelSubworldTheme === 0 ? "plein air" : levelSubworldTheme === 1 ? "souterrain" : levelSubworldTheme === 2 ? "château" : levelSubworldTheme === 3 ? "fort. volante" : levelSubworldTheme === 4 ? "aquatique" : "manoir hanté";
                            const levelStars = data[0]["stars"] ?? "???";
                            const levelTime = data[0]["time"];
                            const levelWidth = data[0]["width"];
                            const levelSubworldWidth = data[0]["widthSub"];
                            const levelAutoScroll = data[0]["autoScroll"];
                            const levelSubworldAutoScroll = data[0]["autoScrollSub"];
                            const levelAutoScrollName = levelAutoScroll === 0 ? "désactivé" : levelAutoScroll === 1 ? "lent" : levelAutoScroll === 2 ? "normal" : "rapide";
                            const levelSubworldAutoScrollName = levelSubworldAutoScroll === 0 ? "désactivé" : levelSubworldAutoScroll === 1 ? "lent" : levelSubworldAutoScroll === 2 ? "normal" : "rapide";
                            const levelID = data[0]["id"];
                            const levelThumbnail = `https://smmdb.net/courseassets/images/${levelID}`;
                            const levelBanner = `https://smmdb.net/courseassets/images/${levelID}_full`;

                            const oldMarioMakerEmbed = new EmbedBuilder()
                                .setColor([255, 85, 0])
                                .setTitle(`**${levelTitle}** créé par **${levelMaker}**`)
                                .setDescription(`✏️ **Description**\n> ${levelDescription}\n\n🕰️ **Date de publication** : <t:${levelUploadedTimestamp}>\n💥 **Difficulté** : ${levelDifficultyName}\n👾 **Style de jeu** : ${levelGameStyleName}\n⛰️ **Thème principal** : ${levelThemeName}\n🗻 **Thème secondaire** : ${levelSubworldThemeName}\n⭐ **Nombre d'étoiles** : ${levelStars}\n⏱️ **Temps** : ${levelTime}s\n🌏 **Taille du monde principale** : ${levelWidth} blocs\n🌎 **Taille du monde secondaire** : ${levelSubworldWidth} blocs\n🐢 **Défilement automatique principal** : ${levelAutoScrollName}\n🐇 **Défilement automatique secondaire** : ${levelSubworldAutoScrollName}`)
                                .setThumbnail(levelThumbnail)
                                .setImage(levelBanner)
                                .setTimestamp()
                                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                            await interaction.reply({ embeds: [oldMarioMakerEmbed] });
                        });
                    });
                    break;

                case "super-mario-maker-2":
                    await interaction.deferReply();

                    const marioMakerID = interaction.options.getString("id");
                    let title;
                    let description;
                    let levelFiles = [];
                    let dataType;

                    const makerResponse = await fetch(`https://tgrcode.com/mm2/user_info/${marioMakerID}`, { method: "GET" });

                    if (makerResponse["status"] === 500)
                        return await interaction.editReply({ content: "L'identifiant simple incorrecte !" });
                    if (makerResponse["status"] === 429)
                        return await interaction.editReply({ content: "Il y a trop de requêtes, merci d'attendre un peu !" });

                    const makerData = await makerResponse?.json();
                    const dataError = makerData?.["error"];

                    if (dataError === "Code corresponds to a level" || makerResponse["status"] === 400) {
                        const levelResponse = await fetch(`https://tgrcode.com/mm2/level_info/${marioMakerID}`, { method: "GET" });
                        const levelData = await levelResponse?.json();
                        const dataError = levelData["error"];

                        if (dataError === "No course with that ID")
                            return await interaction.editReply({ content: "L'identifiant semble incorrecte !" });

                        const tags = {
                            "None": "*aucun*",
                            "Standard": "Classique",
                            "Puzzle solving": "Énigme",
                            "Autoscroll": "Défilement auto",
                            "Auto mario": "Automatique",
                            "Short and sweet": "Court mais bon",
                            "Multiplayer versus": "Affrontement",
                            "Themed": "Thématique",
                            "Music": "Musique",
                            "Technical": "Technique",
                            "Boss battle": "Combat de boss",
                            "Single player": "Joueur solo"
                        };

                        const levelName = levelData["name"];
                        const levelMaker = levelData["uploader"]["name"];
                        const levelMakerID = levelData["uploader"]["code"].match(/.{1,3}/g).join("-");
                        const levelDescription = levelData["description"] ?? "Aucune description...";
                        const levelID = levelData["course_id"].match(/.{1,3}/g).join("-");
                        const levelUploadedTimestamp = levelData["uploaded"];
                        const levelDifficulty = levelData["difficulty"];
                        const levelDifficultyName = levelDifficulty === 0 ? "facile" : levelDifficulty === 1 ? "normal" : levelDifficulty === 2 ? "expert" : "super expert";
                        const levelGameStyle = levelData["game_style_name"];
                        const levelGameStyleName = levelGameStyle === "SMB1" ? "Super Mario Bros." : levelGameStyle === "SMB3" ? "Super Mario Bros. 3" : levelGameStyle === "SMW" ? "Super Mario World" : levelGameStyle === "NSMBU" ? "New Super Mario Bros. U" : "Super Mario 3D World";
                        const levelTheme = levelData["theme_name"];
                        const levelThemeName = levelTheme === "Overworld" ? "plein air" : levelTheme === "Underground" ? "souterrain" : levelTheme === "Underwater" ? "aquatique" : levelTheme === "Desert" ? "désert" : levelTheme === "Snow" ? "neige" : levelTheme === "Sky" ? "ciel" : levelTheme === "Forest" ? "forêt" : levelTheme === "Ghost house" ? "manoir hanté" : levelTheme === "Airship" ? "fort. volante" : "château";
                        const levelTags = levelData["tags_name"];
                        const levelTranslatedTags = [...new Set(levelTags.map(tag => `\`${tags[tag]}\``))].join(" ");
                        const levelClearCondition = levelData["clear_condition_name"] ?? "*aucune*";
                        const levelLikes = levelData["likes"];
                        const levelBoos = levelData["boos"];
                        const levelComments = levelData["num_comments"];
                        const levelPlays = levelData["plays"];
                        const levelAttempts = levelData["attempts"];
                        const levelClears = levelData["clears"];
                        const levelClearRate = levelData["clear_rate_pretty"];
                        const levelWorldReccordName = levelData["record_holder"]?.["name"];
                        const levelWorldReccordID = levelData["record_holder"]?.["code"].match(/.{1,3}/g).join("-");
                        const levelWorldReccord = levelData["world_record_pretty"];
                        const levelFirstClearName = levelData["first_completer"]?.["name"];
                        const levelFirstClearID = levelData["first_completer"]?.["code"].match(/.{1,3}/g).join("-");
                        const levelVersusMatches = levelData["versus_matches"];
                        const levelCoopMatches = levelData["coop_matches"];
                        const levelThumbnailResponse = await fetch(`https://tgrcode.com/mm2/level_thumbnail/${levelID}`);
                        const levelBannerResponse = await fetch(`https://tgrcode.com/mm2/level_entire_thumbnail/${levelID}`);
                        const levelThumbnailBuffer = await levelThumbnailResponse.arrayBuffer();
                        const levelBannerBuffer = await levelBannerResponse.arrayBuffer();
                        const levelThumbnail = new AttachmentBuilder(new Buffer.from(levelThumbnailBuffer), { name: "level-thumbnail.png" });
                        const levelBanner = new AttachmentBuilder(new Buffer.from(levelBannerBuffer), { name: "level-banner.png" });

                        title = `**${levelName}** créé par **${levelMaker}** **(${levelMakerID})**`;
                        description = `✏️ **Description**\n> ${levelDescription}\n\n🆔 **Code du niveau** : ${levelID}\n🕰️ **Date de publication** : <t:${levelUploadedTimestamp}>\n💥 **Difficulté** : ${levelDifficultyName}\n👾 **Style de jeu** : ${levelGameStyleName}\n⛰️ **Thème du niveau** : ${levelThemeName}\n🏷️ **Tags** : ${levelTranslatedTags}\n📋 **Condition pour finir le niveau** : ${levelClearCondition}\n❤️ **Likes** : ${levelLikes}\n💔 **Dislikes** : ${levelBoos}\n💬 **Commentaires** : ${levelComments}\n🎮 **Nombre de parties** : ${levelPlays}\n🔁 **Nombre d'essais totales** : ${levelAttempts}\n🏁 **Nombre de parties réussites** : ${levelClears} (${levelClearRate})\n🏃 **Détenteur du reccord** : ${levelWorldReccordName} (${levelWorldReccordID})\n⏱️ **Temps reccord** : ${levelWorldReccord}\n🥇 **Première complétion par** : ${levelFirstClearName} (${levelFirstClearID})\n🆚 **Parties en versus** : ${levelVersusMatches}\n🤝 **Parties en coopération** : ${levelCoopMatches}`;
                        levelFiles = [levelThumbnail, levelBanner];
                        dataType = "level";
                    } else {
                        const makerName = makerData["name"];
                        const makerID = makerData["code"].match(/.{1,3}/g).join("-");
                        const makerRegion = makerData["region_name"];
                        const makerRegionTranslated = makerRegion === "Asia" ? "Asie" : makerRegion === "Americas" ? "les Amériques" : makerRegion === "Other" ? "autre" : "Europe";
                        const makerCountry = makerData["country"];
                        const makerNintendoEmployee = makerData["is_nintendo_employee"] ? "oui" : "non";
                        const makerCommentsEnabled = makerData["comments_enabled"] ? "activé" : "désactivé";
                        const makerTagsEnabled = makerData["tags_enabled"] ? "activé" : "désactivé";
                        const makerLastActivityTimestamp = makerData["last_active"];
                        const makerLastLevelTimestamp = makerData["last_uploaded_level"];
                        const makerUploadedLevels = makerData["uploaded_levels"];
                        const makerLikes = makerData["likes"];
                        const makerPoints = makerData["maker_points"];
                        const makerCoursePlayed = makerData["courses_played"];
                        const makerCourseCleared = makerData["courses_cleared"];
                        const makerCourseAttempted = makerData["courses_attempted"];
                        const makerCourseDeaths = makerData["courses_deaths"];
                        const makerWorldReccords = makerData["world_records"];
                        const makerFirstClears = makerData["first_clears"];
                        const makerEasyHighscore = makerData["easy_highscore"];
                        const makerNormalHighscore = makerData["normal_highscore"];
                        const makerExpertHighscore = makerData["expert_highscore"];
                        const makerSuperExpertHighscore = makerData["super_expert_highscore"];
                        const makerVersusRank = makerData["versus_rank_name"];
                        const makerVersusRating = makerData["versus_rating"];
                        const makerVersusPlays = makerData["versus_plays"];
                        const makerVersusWon = makerData["versus_won"];
                        const makerVersusWinStreak = makerData["versus_win_streak"];
                        const makerVersusLost = makerData["versus_lost"];
                        const makerVersusLoseStreak = makerData["versus_lose_streak"];
                        const makerVersusDisconnected = makerData["versus_disconnected"];
                        const makerVersusKills = makerData["versus_kills"];
                        const makerVersusKilled = makerData["versus_killed_by_others"];
                        const makerCoopPlays = makerData["coop_plays"];
                        const makerCoopClears = makerData["coop_clears"];
                        const makerSuperWorldID = makerData["super_world_id"];

                        const superWorldResponse = makerSuperWorldID !== "" ? await fetch(`https://tgrcode.com/mm2/super_world/${makerSuperWorldID}`, { method: "GET" }) : null;
                        const superWorldData = superWorldResponse !== null ? await superWorldResponse.json() : null;

                        const planetNames = {
                            "Earth": "terre",
                            "Moon": "lune",
                            "Sand": "sableuse",
                            "Green": "verte",
                            "Ice": "glacée",
                            "Ringed": "annelée",
                            "Red": "rouge",
                            "Spiral": "spirale"
                        };

                        const makerSuperWorldWorlds = superWorldData?.["worlds"];
                        const makerSuperWorldLevels = superWorldData?.["levels"];
                        const makerSuperWorldCreationTimestamp = superWorldData?.["created"];
                        const makerSuperWorldPlanetType = planetNames[superWorldData?.["planet_type_name"]];

                        title = `Profil de **${makerName}** (**${makerID}**)`;
                        description = `🌏 **Région** : ${makerRegionTranslated}\n🚩 **Pays** : :flag_${makerCountry.toLowerCase()}:\n🧑‍💼 **Employé de Nintendo** : ${makerNintendoEmployee}\n💬 **Commentaires** : ${makerCommentsEnabled}\n🏷️ **Tags** : ${makerTagsEnabled}\n🕰️ **Dernière activité** : <t:${makerLastActivityTimestamp}>\n⌚ **Date du dernier niveau** : <t:${makerLastLevelTimestamp}>\n🧩 **Niveaux publiés** : ${makerUploadedLevels}\n❤️ **Likes** : ${makerLikes}\n🏅 **Points maker** : ${makerPoints}\n🎮 **Niveaux joués** : ${makerCoursePlayed}\n🏁 **Niveau finis** : ${makerCourseCleared}\n🔁 **Nombre totals de tentatives** : ${makerCourseAttempted}\n☠️ **Nombre totals de morts** : ${makerCourseDeaths}\n⏱️ **Reccords du monde** : ${makerWorldReccords}\n🥇 **Première complétions** : ${makerFirstClears}\n👍 **Score en facile sur le mode infini** : ${makerEasyHighscore}\n💡 **Score en moyen sur le mode infini** : ${makerNormalHighscore}\n💢 **Score en expert sur le mode infini** : ${makerExpertHighscore}\n⛈️ **Score en super expert sur le mode infini** : ${makerSuperExpertHighscore}\n🆚 **Rang en versus** : ${makerVersusRank} (${makerVersusRating})\n🕹️ **Parties en versus** : ${makerVersusPlays}\n🏆 **Victoires en versus** : ${makerVersusWon} (série de ${makerVersusWinStreak})\n🤕 **Défaites en versus** : ${makerVersusLost} (série de ${makerVersusLoseStreak})\n📴 **Déconnection en versus** : ${makerVersusDisconnected}\n🫥 **Personne éliminées** : ${makerVersusKills}\n💀 **Nombre de fois éliminés par les autres** : ${makerVersusKilled}\n🤝 **Parties en mode coopération** : ${makerCoopPlays}\n🪙 **Victoires en coopération** : ${makerCoopClears}\n🪐 **A un Super Monde** : ${makerSuperWorldID !== "" ? "Oui" : "Non"}${makerSuperWorldID !== "" ? `\n🌐 **Mondes dans le Super Monde** : ${makerSuperWorldWorlds}\n🚀 **Niveaux dans le Super Monde** : ${makerSuperWorldLevels}\n🌌 **Type de planète du Super Monde** : ${makerSuperWorldPlanetType}\n🕒 **Date de création du Super Monde** : <t:${makerSuperWorldCreationTimestamp}>` : ""}`;
                        dataType = "maker";
                    }

                    const marioMakerEmbed = new EmbedBuilder()
                        .setColor([255, 85, 0])
                        .setTitle(title)
                        .setURL(dataType === "level" ? `https://smm2.wizul.us/smm2/level/${marioMakerID}` : `https://smm2.wizul.us/smm2/maker/${marioMakerID}`)
                        .setDescription(description)
                        .setThumbnail(dataType === "level" ? "attachment://level-thumbnail.png" : makerData["mii_image"])
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                    if (dataType === "level")
                        marioMakerEmbed.setImage("attachment://level-banner.png");

                    await interaction.editReply({ embeds: [marioMakerEmbed], files: levelFiles });
                    break;

                case "speedrun":
                    await interaction.deferReply();

                    const speedrunGame = interaction.options.getString("game-name").replaceAll(" ", "_").toLowerCase();
                    const speedrunCategory = interaction.options?.getString("category");

                    await fetch(`https://www.speedrun.com/api/v1/games/${speedrunGame}/categories`).then(function (response) {
                        return response.json();
                    }).then(async function (categoriesData) {
                        if (categoriesData?.["status"] === 404)
                            return await interaction.editReply({ content: "❌ Ce jeu n'existe pas sur Speedrun.com ! Réessaye en mettant uniquement les initiales du nom du jeu.", flags: MessageFlags.Ephemeral });

                        const gameID = categoriesData["data"][0]["links"][1]["uri"].slice(-8);
                        const gameLink = categoriesData["data"][0]["weblink"];

                        const gameInformationResponse = await fetch(`https://www.speedrun.com/api/v1/games/${gameID}`);
                        const gameInformationJSON = await gameInformationResponse.json();
                        const categories = [];
                        let categoryID;
                        let categoryName;

                        const gameName = gameInformationJSON["data"]["names"]["international"];
                        const gameLogo = `${gameInformationJSON["data"]["assets"]["logo"]["uri"].split("?")[0].replace(".png", "")}.png`;
                        const gameBackground = `${gameInformationJSON["data"]["assets"]["background"]["uri"].split("?")[0].replace(".png", "")}.png`;

                        for (let i = 0; i < Object.keys(categoriesData["data"]).length; i++) {
                            if (categoriesData["data"][i]["type"] === "per-game") {
                                const category = categoriesData["data"][i]["name"];

                                categories.push(category);

                                if (categoryID === undefined || category === speedrunCategory) {
                                    categoryID = categoriesData["data"][i]["id"];
                                    categoryName = categoriesData["data"][i]["name"];
                                }
                            }
                        }

                        const formattedCategories = categories.map(category => `\`${category}\``).join(" ");
                        const leaderboardResponse = await fetch(`https://www.speedrun.com/api/v1/leaderboards/${gameID}/category/${categoryID}?embed=players&top=15`);
                        const leaderboardJSON = await leaderboardResponse.json();
                        const totalRuns = Object.keys(leaderboardJSON["data"]["runs"]).length;
                        const leaderboard = {};

                        for (let i = 0; i < Math.min(totalRuns, 15); i++) {
                            const runTime = leaderboardJSON["data"]["runs"][i]["run"]["times"]["primary_t"];
                            const runPlayer = leaderboardJSON["data"]["players"]["data"][i]["rel"] !== "guest" ? leaderboardJSON["data"]["players"]["data"][i]["names"]["international"] : "N/A";
                            const runCountry = leaderboardJSON["data"]["players"]["data"][i]["location"]?.["country"]["code"] ?? "";

                            leaderboard[`**${i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}** ${runCountry === "gb/eng" ? ":england:" : runCountry !== "" ? `:flag_${runCountry}:` : ""} ${runPlayer}`] = `\`${moment.duration(runTime, "seconds").format("d[j] H[h] m[m] s[s] SSS[ms]")}\``;
                        }

                        const speedrunEmbed = new EmbedBuilder()
                            .setColor([255, 85, 0])
                            .setTitle(`Classement du jeu ${gameName} en ${categoryName}`)
                            .setURL(gameLink)
                            .setDescription(`🏷️ **Catégories** : ${formattedCategories} \n\n${Object.entries(leaderboard).map(player => player.join(" | ")).join("\n")} `)
                            .setThumbnail(gameLogo)
                            .setImage(gameBackground)
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                        await interaction.editReply({ embeds: [speedrunEmbed] });
                    });
                    break;

                case "yunayunori":
                    const game = interaction.options.getString("game");

                    await fetch("https://magictendo.github.io/api/yunayunori.json").then(function (response) {
                        return response.json();
                    }).then(async function (data) {
                        const gameRGB = data[game]["colors"]["rgb"];
                        const gameName = data[game]["name"];
                        const gameLink = data[game]["link"];
                        const gameVersion = data[game]["version"];
                        const gameDate = data[game]["date"];
                        const gameReadableDate = new Date(gameDate).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
                        const gameTags = data[game]["tags"];
                        const gameFormattedTags = gameTags.map(tag => `\`${tag}\``).join(" ");
                        const gameIsFinished = data[game]["finished"];
                        const gameLeaderboard = data[game]["leaderboard"];
                        const gameLogo = data[game]["logo"];
                        let leaderboard = "";

                        if (gameIsFinished) {
                            for (let i = 0; i < gameLeaderboard.length; i++) {
                                leaderboard += `**${i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}** [${gameLeaderboard[i]["username"]}](${gameLeaderboard[i]["proof"]}) | \`${gameLeaderboard[i]["points"] ?? gameLeaderboard[i]["date"]}${game !== "worst-game" ? " points" : ""}\`\n`;
                            }
                        } else {
                            leaderboard = "> *Personne n'a finit le jeu ou publié son score pour le moment...*";
                        }

                        const yunayunoriEmbed = new EmbedBuilder()
                            .setColor(gameRGB)
                            .setTitle(`Classement du jeu ${gameName}`)
                            .setURL(gameLink)
                            .setDescription(`💾 **Version** : v${gameVersion} \n📅 **Date de sortie** : ${gameReadableDate}\n🏷️ **Tags** : ${gameFormattedTags}\n\n${leaderboard} `)
                            .setImage(gameLogo)
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                        await interaction.reply({ embeds: [yunayunoriEmbed] });
                    });
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};