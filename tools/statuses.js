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
        "être en version 4, enfin ! :D",
        "être sur la shard 9 ! Nan en vrai aucune idée...",
        "répondre aux commandes !",
        "dormi- ah bah non du coup...",
        "être outrée du nombre de bug que BakaTaida doit corriger sur moi",
        "être en ligne et à essayer de ne pas crash",
        "ne pas aimer les CAPTCHAs AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH",
        "être sur Discord",
        "faire une omelette d'easter eggs (oui)",
        "01000010 01000001 01001011 01000001 00100000 00100001",
        "calculer 0,1 + 0,2 (c'est compliqué)",
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
        "tenter de trouver un Miyakitsu",
        "tenter de trouver du Tekakitsu",
        "tenter de trouver un ticket du temps",
        "tenter de trouver un Sanikitsu",

        "attendre qu'un bot ait plus de statuts que moi !",
        "essayer de ne pas se faire taper dessus par Discord à cause du nombre de statuts",
        "trouver des idées de statuts...",
        "écrire des statuts",
        "avoir beaucoup trop de statuts",
        "se bagarrer contre Discord pour avoir le retour du vrai \"Joue à\" !",

        "étudier l'histoire d'Arukota avec Yuyunori",
        "discuter avec Kerusuna",
        "se plaindre que son rāmen est froid",
        "cartographier Yunayunori",
        "essayer de comprendre les lois de la physique dans la forêt Iyiya",
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
        "un article sur la 9ème radio secrète",

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
        "tous les mercredis et samedis soirs"
    ],

    "time": {
        "00": "📙 Minuit, lecture nocturne !",
        "01": "💤 1h, va se couche- ah bah non, toujours pas...",
        "02": "💬 2h, discute avec Yuyunori",
        "03": "❗ 3h, tu es encore là toi ? O.O",
        "04": "🤍 4h, rassure Tcceisa",
        "05": "🔵 5h, essaye de trouver des archives sur O",
        "06": "📸 6h, tente de photographier des bururus sauvages",
        "07": "🎼 7h, écoute la dernière musique de Miyunira",
        "08": "☀️ 8h, bonne matinée ! :D",
        "09": "✨ 9h, la meilleure heure de la journée !",
        "10": "🍵 10h, petit thé !",
        "11": "🕰️ 11h, essayons de créer une petite horloge !",
        "12": "🍞 12h, tient, c'est l'heure d'aller manger !",
        "13": "🌳 13h, promenade avec Ekayasena dans Tenerina",
        "14": "🫧 14h, fait des bulles",
        "15": "🍙 15h, apprentissage du japonais !",
        "16": "🍪 16h, mange un cookie avec Miyunira",
        "17": "🎮 17h, joue au prochain jeu de BakaTaida",
        "18": "📄 18h, aide Cerusuna à finaliser ses derniers documents",
        "19": "🌇 19h, bonne fin de journée ! :D",
        "20": "✏️ 20h, c'est partie pour le dessin du soir !",
        "21": "🎴 21h, petite partie de cartes avec Kerusuna",
        "22": "🌙 22h, bonne nuit ! :D",
        "23": "🎶 23h, le concert de Miyunira a commencé !"
    }
};

const seasonnalStatuses = {
    "halloween": [
        "manger des bonbons",
        "Fancy Island",
        "trouver l'entrée des Backrooms",
        "te faire peur, bouh !",
        "se déguiser en Enderman",
        "raconter des histoires d'horreur"
    ],

    "christmas": [
        "faire des cadeaux",
        "chanter padoru padoru~",
        "décorer Otsorayo",
        "fabriquer une maison en pain d'épices",
        "faire une bataille de boule de neige",
        "faire une Bjimmy de neige"
    ]
};

const statusAmount = statuses["playing"].length + statuses["listening"].length + statuses["watching"].length + statuses["streaming"].length + Object.keys(statuses["time"]).length + seasonnalStatuses["halloween"].length + seasonnalStatuses["christmas"].length;
const statusTypes = Object.keys(statuses);

function getRandomStatus(client) {
    const currentMonth = new Date().toLocaleDateString("fr-FR", { month: "numeric", timeZone: "Europe/Paris" });
    const season = currentMonth === "10" ? "halloween" : currentMonth === "12" ? "christmas" : null;
    const randomStatusType = statusTypes[Math.floor(Math.random() * statusTypes.length)];
    const finalActivityIndex = randomStatusType === "time" ? new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", timeZone: "Europe/Paris" }).replace(" h", "") : Math.floor(Math.random() * statuses[randomStatusType].length);
    let activityPrefix = "";

    const variableData = {
        "[STATUS_AMOUNT]": statusAmount,
        "[GUILD_AMOUNT]": client.guilds.cache.size,
        "[USER_AMOUNT]": client.users.cache.size,
        "[CHANNEL_AMOUNT]": client.channels.cache.size,
        "[YEAR_CAKE]": Math.floor((Math.random() * (new Date(Date.now() - +new Date("February 1, 2021")).getUTCFullYear() - 1_970)) + 1)
    };

    if (season !== null) {
        statuses["seasonnal"] = seasonnalStatuses[season];

        statusTypes.push("seasonnal");
    }

    switch (randomStatusType) {
        case "playing":
            activityPrefix = "Joue à ";
            break;

        case "listening":
            activityPrefix = "Écoute ";
            break;

        case "watching":
            activityPrefix = "Regarde ";
            break;

        case "streaming":
            activityPrefix = "Stream ";
            break;
    }

    let finalActivity = activityPrefix + statuses[randomStatusType][finalActivityIndex];

    for (let i = 0; i < Object.keys(variableData).length; i++) {
        const variableKey = Object.keys(variableData)[i];

        finalActivity = finalActivity.replaceAll(variableKey, variableData[variableKey]);
    }

    return { type: randomStatusType === "streaming" ? ActivityType.Streaming : ActivityType.time, activity: finalActivity, amount: statusAmount };
}

module.exports = { getRandomStatus };