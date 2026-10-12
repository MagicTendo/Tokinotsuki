const { ActivityType } = require("discord.js");
const { readFileSync } = require("fs");

const scpJSON = readFileSync("./json/scp.json", "utf-8");
const scpList = JSON.parse(scpJSON);
const numberOfSCPs = Object.keys(scpList).length;
const commandsJSON = readFileSync("./json/help.json", "utf-8");
const commandList = JSON.parse(commandsJSON);
const numberOfCommands = commandList["count"];

const statuses = {
    "playing": [
        "être sur la shard 9 ! Nan en vrai aucune idée...",
        "répondre aux commandes !",
        "être outrée du nombre de bugs que BakaTaida doit corriger sur moi",
        "être en ligne et à essayer de ne pas crash",
        "ne pas aimer les CAPTCHAs AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH",
        "être sur Discord",
        "faire une omelette d'easter eggs (oui)",
        "01000010 01000001 01001011 01000001 00100000 00100001",
        "essayer d'avoir l'erreur 418 !",

        "avoir [STATUS_AMOUNT] statuts !",
        "être sur [GUILD_AMOUNT] serveurs !",
        "être avec [USER_AMOUNT] utilisateurs !",
        "être dans [CHANNEL_AMOUNT] salons !",
        "manger le Year Cake [YEAR_CAKE]",
        `avoir ${numberOfCommands} commandes`,
        `avoir ${numberOfSCPs} rapports SCP`,

        "Fish",
        "PikPik",
        "Arkeology",
        "Snap Bird",
        "Fight",
        "Card Battle",
        "Congelo",
        "Guess the number",
        "Guess my Ping",
        "une partie de chifumi",
        "une partie de blackjack",
        "une partie de démineur",
        "faire toutes les quêtes",
        "obtenir tous les badges",
        "tenter de trouver un miyakitsu",
        "tenter de trouver du tekakitsu",
        "tenter de trouver un ticket du temps",
        "tenter de trouver un sanikitsu",

        "attendre qu'un bot ait plus de statuts que moi !",
        "essayer de ne pas se faire taper dessus par Discord à cause du nombre de statuts",
        "trouver des idées de statuts...",
        "écrire des statuts",
        "avoir beaucoup trop de statuts",
        "se bagarrer contre Discord pour avoir le retour du vrai \"Joue à\" !",

        "étudier l'histoire d'Arukota avec Yuyunori",
        "se plaindre que son rāmen est froid",
        "cartographier Yunayunori",
        "convaincre que le Miyakitsu n'est pas une Tempura",
        "convaincre que JavaScript > all",

        "leak le lore de Leo.le.pik",
        "leak le lore d'Hip Fandom",
        "manger des chocapiks !",
        "manger la pizza du roi Shun",
        "découvrir le patrimoine culturel de l'Artois avec Hip Fandom",
        "créer une gare avec Austcraft",
        "une partie d'échec contre Théotime",
        "explo avec Hasu",
        "poursuivre les poulets de Ninjdai_ !",
        "embêter le chat de BakaTaida ! (Il est un peu sauvage mais tkt)",
        "motiver BakaTaida",

        "se protéger du WAAAA-VIRUS",
        "être amie avec April !",

        "🥂-#teamBAKA",
        "🦊-#teamFOX",
        "🧊-#teamICESPIRIT",

        "lire un livre",
        "dessiner",
        "faire du pixel art",
        "faire un peu de musique",
        "écrire un roman",
        "speedrun des jeux rétro",
        "manger (miam)",
        "boire de l'eau, car l'eau c'est bon !",
        "aimer la couleur #ff5500",
        "chasser de l'Artois 🤠",
        "surveiller la banque Foyllori",
        "être baka",
        "être taida",
        "être un bot 100% Baka2Win :D",
        "i use discord btw",
        "détruire SCP-682",

        "Shūtānopikuseru",
        "Only One Dimension",
        "Archotalan Project",
        "Archotalan Faito",
        "Watozan Clicker",
        "Méga Morpion",
        "Periodicle",
        "Ketsunodai",
        "「何とも最悪のゲーム、とても出鱈目と本当に悪いと大いに憤ろしいと中々異様と甚だ難しいと非常に煩わしいと余程おもんねーなど、誰も遊ぶな…」",
        "Hyaku Onaji",
        "ROPUGE BATORU",
        "Tcceisa's Adventure",

        "Juck Aventure",
        "Juck B",
        "Fiboshy's Story",
        "Suika Marble",
        "Shutanopiku",
        "Dream Den",

        "avoir l'impression d'être fixé par toi qui lis ça...",

        "dire que je joue à quelque chose",
        "jouer à jouer à jouer à jouer à jouer à jouer à jouer à jouer à jouer à jouer à un truc",
        "rien...",

        "Tea Time ! 🍵(OwO ) ",
        "Taida Time ! (UwU )"
    ],

    "listening": [
        "3 Shots of Tokinotsuki Bum",
        "The Glorious Tokinotsuki of Destiny",
        "The Glorious IDK of Destiny",
        "The Glorious Medley of Toki Toki Douga & YouTube !!",
        "The Tokinotsuki Element",
        "THE POWER OF TOKINOTSUKI",
        "時の月協奏会 ～Concert of Tokinotsuki～",
        "時の月喜劇会 ～Comedy of Tokinotsuki～",
        "時の月永劫舞曲 ～Infinity of Tokinotsuki～",
        "New Toki's Dreams!",
        "Toki:SAIKYO",
        "Re:Toki",
        "S9",
        "TokinoruTsukiru Vibing 9",

        "Never Gonna Give You Up",
        "Never Gonna Stop",
        "Triple Baka",
        "LEMON MELON COOKIE",
        "Looping the Rooms",
        "Fly Octo Fly",
        "Bones to Pick",
        "Corridors of Time",
        "Hexagonest",
        "Karakuri Spirits",

        "les conseils donnés sur SnackOverflow",
        "vos retours et suggestions",
        "des YTPMVs",
        "des 音MADs",

        "l'accent anglais catastrophique de BakaTaida"
    ],

    "watching": [
        "un épisode de Blocklab'",
        "un épisode des Expériences Débiles",
        "un épisode de Baka Theory",
        "un tour de magie de MagicTendo",
        "les bugs et secrets de Super Mario Maker 2",
        "le magnifique poster de la MagicTendo Team",
        "si Cirno est encore dans le carton",
        "MagiruTendoru Vibing",
        "BakaruTaidaru Vibing 2",

        "BakaTaida se faire défoncer en Bridge sur Hypixel",
        "BakaTaida écrire du code",

        "le code 995-OWO-500",
        "mon système d'économie se faire encore détruire...",

        "toi, qui me regarde"
    ],

    "streaming": [
        "Super Toki Odyssey",
        "Super Toki Maker",
        "Bee Swarm Simulator",
        "Putt Party",
        "Super Cat Planet",
        "Super Mascot World",

        "en train de coder",
        "en train de dessiner",
        "en train de créer une musique",
        "en train de créer un modèle 3D",

        "sur Twitch",
        "en live",
        "en 9K",
        "avec Miyunira",
        "tous les samedis soirs"
    ],

    "time": {
        "00": "📙 Minuit, lecture nocturne !",
        "01": "💤 1h, va se couche- ah bah non, toujours pas... Je suis un bot !",
        "02": "💬 2h, discute avec Yuyunori",
        "03": "❗ 3h, tu es encore là toi ? O.O",
        "04": "🤍 4h, rassure Tcceisa",
        "05": "🔵 5h, essaye de trouver des archives sur O",
        "06": "📸 6h, tente de photographier des bururus tsurus",
        "07": "🎼 7h, écoute la dernière musique de Miyunira",
        "08": "☀️ 8h, bonne matinée ! :D",
        "09": "✨ 9h, la meilleure heure de la journée !",
        "10": "🍵 10h, petit thé !",
        "11": "🕰️ 11h, essayons de créer un petit cadran solaire !",
        "12": "🍞 12h, tient, c'est l'heure d'aller manger !",
        "13": "🌳 13h, promenade avec Yatccuria dans Tenerina",
        "14": "🫧 14h, fait des bulles !",
        "15": "📖 15h, apprentissage des divers dialectes de Yunayunori !",
        "16": "🍪 16h, mange un cookie avec Miyunira",
        "17": "💬 17h, discute avec des yunaris",
        "18": "🏖️ 18h, se prélasse à Otsorayo ! ",
        "19": "🌇 19h, bonne fin de journée ! :D",
        "20": "✏️ 20h, c'est partie pour le dessin du soir !",
        "21": "🎴 21h, petite partie de cartes avec Miyunira",
        "22": "🌙 22h, bonne nuit ! :D",
        "23": "🎶 23h, aide Miyunira pour une musique"
    }
};

const seasonnalStatuses = {
    "halloween": [
        "manger des bonbons",
        "Fancy Island",
        "trouver la sortie des Backrooms",
        "te faire peur, bouh !",
        "se déguiser en Enderman",
        "raconter des histoires d'horreur"
    ],

    "christmas": [
        "faire des cadeaux",
        "chanter padoru padoru~",
        "décorer Otsorayo",
        "faire une bataille de boule de neige",
        "faire une Bjimmy de neige"
    ]
};

const allStatuses = Object.assign({}, statuses, seasonnalStatuses);
const statusAmount = statuses["playing"].length + statuses["listening"].length + statuses["watching"].length + statuses["streaming"].length + Object.keys(statuses["time"]).length + seasonnalStatuses["halloween"].length + seasonnalStatuses["christmas"].length;

function getRandomStatus(client) {
    const currentMonth = new Date().toLocaleDateString("fr-FR", { month: "numeric", timeZone: "Europe/Paris" });
    const season = currentMonth === "10" ? "halloween" : currentMonth === "12" ? "christmas" : null;
    const statusTypes = Object.keys(statuses);

    if (season)
        statusTypes.push(season);

    const randomStatusType = statusTypes[Math.floor(Math.random() * statusTypes.length)];
    const finalActivityIndex = randomStatusType === "time" ? new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", timeZone: "Europe/Paris" }).replace(" h", "") : Math.floor(Math.random() * allStatuses[randomStatusType].length);
    let activityPrefix = "";
    let activityType;

    const variableData = {
        "[STATUS_AMOUNT]": statusAmount,
        "[GUILD_AMOUNT]": client.guilds.cache.size,
        "[USER_AMOUNT]": client.users.cache.size,
        "[CHANNEL_AMOUNT]": client.channels.cache.size,
        "[YEAR_CAKE]": Math.floor((Math.random() * (new Date(Date.now() - +new Date("February 1, 2021")).getUTCFullYear() - 1_970)) + 1)
    };

    switch (randomStatusType) {
        case "listening":
            activityPrefix = "Écoute";
            activityType = ActivityType.Listening;
            break;

        case "watching":
            activityPrefix = "Regarde";
            activityType = ActivityType.Watching;
            break;

        case "streaming":
            activityPrefix = "Stream";
            activityType = ActivityType.Streaming;
            break;

        case "time":
            activityType = ActivityType.Custom;
            break;

        default:
            activityPrefix = "Joue à";
            activityType = ActivityType.Playing;
            break;
    }

    let finalActivity = `${activityPrefix} ${allStatuses[randomStatusType][finalActivityIndex]}`;

    for (let i = 0; i < Object.keys(variableData).length; i++) {
        const variableKey = Object.keys(variableData)[i];

        finalActivity = finalActivity.replaceAll(variableKey, variableData[variableKey]);
    }

    return { type: activityType, activity: finalActivity };
}

module.exports = { getRandomStatus };