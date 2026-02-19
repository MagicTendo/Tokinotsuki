const { ActivityType } = require("discord.js");
const { readFileSync } = require("fs");

const scpJSON = readFileSync("./json/scp.json", "utf-8");
const scpList = JSON.parse(scpJSON);
const numberOfSCPs = Object.keys(scpList).length;
const commandsJSON = readFileSync("./json/help.json", "utf-8");
const commandList = JSON.parse(commandsJSON);
const numberOfCommands = commandList["count"];

function getRandomStatus(client) {
    const randomYear = Math.floor((Math.random() * 3_000) + 1);
    const randomYearCake = Math.floor((Math.random() * (new Date(Date.now() - +new Date("February 1, 2021")).getUTCFullYear() - 1_970)) + 1);
    const juckGameNames = ["A", "B", "C", "9"];
    const randomJuckName = juckGameNames[Math.floor((Math.random() * juckGameNames.length))];

    const status = {
        playing: [
            `être sur ${client.guilds.cache.size} serveurs !`,
            `être avec ${client.users.cache.size} utilisateurs !`,
            `être dans ${client.channels.cache.size} salons !`,

            "être en v4, enfin ! :D",
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

            "détruire SCP-682",
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

            "voyager dans le temps",
            `visiter l'an ${randomYear}`,

            "manger des chocapiks !",
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
            "chanter padoru padoru~",
            "écrire un roman",
            "speedrun des jeux rétro",
            "manger (miam)",
            `manger le Year Cake ${randomYearCake}`,
            "boire de l'eau, car l'eau c'est bon !",
            "aimer la couleur #ff5500",
            "regarder le code 995-OWO-500",
            "chasser de l'Artois 🤠",
            "surveiller la banque Foyllori",
            "être baka",
            "être taida",
            "être un bot 100% Baka2Win :D",
            "i use discord btw",

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
            "D.F.O.A.E Survival",
            `Juck ${randomJuckName}`,

            "avoir l'impression d'être fixé par toi qui lis ça...",
            "NEVER GONNA GIVE YOU UP ! Cheh, ça t'apprendras à vouloir me regarder !",

            "dire que je joue à quelque chose",
            "jouer à jouer à jouer à jouer à jouer à jouer à jouer à jouer à jouer à jouer à un truc",
            "rien...",

            "Tea Time ! 🍵(OwO ) ",
            "Taida Time ! (UwU )"
        ],

        listening: [
            "3 Shots of Tokinotsuki Bum",
            "The Glorious Tokinotsuki of Destiny",
            "The Glorious IDK of Destiny",
            "The Glorious Medley of Toki Toki Douga & YouTube !!",
            "THE POWER OF TOKINOTSUKI",
            "時の月協奏会 ～Concert of Tokinotsuki～",
            "時の月喜劇会 ～Comedy of Tokinotsuki～",
            "New Toki's Dreams!",
            "Toki:SAIKYO",
            "TokinoruTsukiru Vibing 9",

            "Fly Octo Fly",
            "Karakuri Spirits",
            "Corridors of Time",
            "Hexagonest",
            "Bones to Pick",
            "Padoru Padoru",
            "LEMON MELON COOKIE",

            "les conseils donnés sur SnackOverflow",
            "vos retours et suggestions",
            "des YTPMVs",

            "l'accent anglais catastrophique de BakaTaida"
        ],

        watching: [
            "un épisode de Blocklab'",
            "un épisode des Expériences Débiles",
            "un épisode de Yōkai Hanto",
            "un épisode de YTPMV Origins",
            "un épisode de Baka Theory",
            "un tour de magie de MagicTendo",
            "les bugs et secrets de Super Mario Maker 2",
            "le magnifique poster de la MagicTendo Team",
            "si Cirno est encore dans le carton",
            "MagiruTendoru Vibing",
            "BakaruTaidaru Vibing 2",

            "BakaTaida se faire défoncer en Bridge sur Hypixel",
            "BakaTaida écrire du code",

            "mon système d'économie se faire encore détruire...",
            "un article sur la 9ème radio secrète",

            "toi qui me regarde"
        ],

        streaming: [
            "Super Toki Odyssey",
            "Super Toki Maker",
            "Bee Swarm Simulator",
            "Putt Party",

            "avec Miyunira",
            "en 9K",

            "sur Twitch",
            "en live"
        ],

        custom: {
            0: "📙 Minuit, lecture nocturne !",
            1: "💤 1h, va se couche- ah bah non, toujours pas...",
            2: "💬 2h, discute avec Yuyunori",
            3: "❗ 3h, tu es encore là toi ? O.O",
            4: "🤍 4h, rassure Tcceisa",
            5: "🔵 5h, essaye de trouver des archives sur O",
            6: "📸 6h, tente de photographier des bururus sauvages",
            7: "🎼 7h, écoute la dernière musique de Miyunira",
            8: "☀️ 8h, bonne matinée ! :D",
            9: "✨ 9h, la meilleure heure de la journée !",
            10: "🍵 10h, petit thé !",
            11: "🕰️ 11h, essayons de créer une petite horloge !",
            12: "🍞 12h, tient, c'est l'heure d'aller manger !",
            13: "🌳 13h, promenade avec Ekayasena dans Tenerina",
            14: "🫧 14h, fait des bulles",
            15: "🍙 15h, apprentissage du japonais !",
            16: "🍪 16h, mange un cookie avec Miyunira",
            17: "🎮 17h, joue au prochain jeu de BakaTaida",
            18: "📄 18h, aide Cerusuna à finaliser ses derniers documents",
            19: "🌇 19h, bonne fin de journée ! :D",
            20: "✏️ 20h, c'est partie pour le dessin du soir !",
            21: "🎴 21h, petite partie de cartes avec Kerusuna",
            22: "🌙 22h, bonne nuit ! :D",
            23: "🎶 23h, le concert de Miyunira a commencé !"
        }
    };

    const statusAmount = status.playing.length + status.listening.length + status.watching.length + status.streaming.length + Object.keys(status.custom).length + 2;

    status.playing.push(`avoir ${statusAmount} statuts !`);
    status.playing.push(`être fière d'avoir ${statusAmount - 84} status en plus en une mise à jour !`);

    const statusTypes = Object.keys(status);
    const randomStatusType = statusTypes[Math.floor(Math.random() * statusTypes.length)];
    let activityPrefix = "";
    let activityIndex;

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

    randomStatusType === "custom" ? activityIndex = (new Date().getUTCHours() + 1) % 24 : activityIndex = Math.floor(Math.random() * status[randomStatusType].length);

    const finalActivity = activityPrefix + status[randomStatusType][activityIndex];

    return { type: randomStatusType === "streaming" ? ActivityType.Streaming : ActivityType.Custom, activity: finalActivity, amount: statusAmount };
}

module.exports = { getRandomStatus };