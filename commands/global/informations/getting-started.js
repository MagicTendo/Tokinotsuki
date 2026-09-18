const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Informations",
    data: new SlashCommandBuilder()
        .setName("getting-started")
        .setDescription("Je suis un peu complexe à comprendre au début, alors voici un guide expliquant ce qu'il y a savoir !")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2]),
    async execute(interaction, client) {
        try {
            const gettingStartedIntroductionEmbed = new EmbedBuilder()
                .setColor([255, 85, 0])
                .setTitle("👋 Guide de démarrage - Introduction")
                .setDescription("Salut ! Je vais t'expliquer dans ce guide tout ce que tu as besoin de savoir pour me comprendre au mieux ! Je suis un **bot Discord polyvalent totalement gratuit**, ayant pour but de proposer **le plus de fonctionnalités possible**. Cela permet d'éviter de passer des heures à chercher des bots, d'autant plus si certaines options importantes sont payantes. J'ai plus de **200 commandes**, regroupées par catégories : \"**Informations**\", \"**Fun**\", \"**Jeux**\", \"**Modération**\", \"**Utilitaire**\", \"**Apprentissage**\", \"**Social**\", \"**Musique**\", \"**Inutile**\" et \"**Serveur**\". Elles sont consultables avec la commande **`/help`**, mais également sur ma documentation officielle avec **[ce lien](https://tokinotsuki.rf.gd/commands)**. La dernière catégorie est **uniquement** pour le [serveur communautaire](https://discord.gg/DYQutQvbSu) de mon développeur. En effet, je propose davantage de fonctionnalités dessus (système d'expérience, alertes, statistiques, etc.), et le but est que cela soit également disponible **pour tous à l'avenir** !\n\nLe but de ce guide n'est pas d'expliquer toutes mes commandes, car cela le rendrait beaucoup trop long. Je vais uniquement me concentrer sur **mes fonctionnalités majeures**, pouvant paraître compliquées au premier abord. Mais si tu rencontres des difficultés sur des éléments non mentionnés dans ce guide, **n'hésite pas** à en parler à mon développeur via son **[serveur Discord](https://discord.gg/DYQutQvbSu)** !")
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

            const gettingStartedEconomyEmbed = new EmbedBuilder()
                .setColor([255, 85, 0])
                .setTitle("💴 Guide de démarrage - Système économique")
                .setDescription("L'une de mes particularités notables est mon **système économique interserveur** ! Je vais tout expliquer, en parlant de **chaque monnaie**, comment les obtenir, et ce qu'elles permettent de faire.\n\n### 🪙 Toki Coins\nLa monnaie **principale** est le **Toki Coin**, obtenable de diverses manières :\n\n- Récompense quotidienne (`/daily`)\n- Récompense hebdomadaire (`/weekly`)\n- Avec des jeux (`/game gtn`, `/game tictactoe`, `/game rock-paper-scissors`, etc.)\n- En faisant des quêtes (`/quests list`)\n- En me votant sur Top.gg (`/vote`)\n- Etc.\n\nCette monnaie est utilisable pour **acheter diverses choses** dans les magasins (`/shop`), comme, entre autres, des **provisions** servant pour `/game adventure` et des **objets débloquant de nouveaux jeux** (`/game fish`, `/game pikpik`, `/game arkeology` et `/game snap-bird`). Il est également possible d'acheter un **compte bancaire**, qui est le compte Foyllori. Cela permet de protéger son argent contre la commande `/rob` qui permet de **voler** les utilisateurs. Les ressources obtenues avec les jeux `/game fish`, `/game pikpik`, `/game arkeology` et `/game snap-bird` sont **vendables à tout moment** dans le magasin correspondant contre généralement des Toki Coins.\n\n### 🍪 Cookies\nIl existe une deuxième monnaie, le **Cookie**. Il est obtenable uniquement si quelqu'un te donne un cookie avec la commande **`/social cookie`**, et dans certains jeux comme **`/game jackpot`** par exemple. Cette monnaie sert à deux choses : à **changer d'équipe**, et à acheter des **paquets de carte** (ces deux éléments ont leur partie dédiée plus bas).\n\n### 🍄 Questshrooms\nEnfin, la dernière monnaie est le **Questshroom**, obtenable uniquement en accomplissant une quête de **`/quests list`**. Elle sert à acheter des **améliorations** pour les jeux `/game fish`, `/game pikpik`, `/game arkeology`, `/game snap-bird` et pour `/game fight`. En parlant de quêtes, il ne faut pas faire la confusion avec **`/task`**, qui donne une **tâche à faire** avec une récompense une fois réalisée.")
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

            const gettingStartedTeamsEmbed = new EmbedBuilder()
                .setColor([255, 85, 0])
                .setTitle("🛡️ Guide de démarrage - Équipes")
                .setDescription("Avec suffisamment de Toki Coins, il est possible de **rejoindre** l'une des quatre équipes : **Graniti**, **Pimentes**, **Mentis** et **Champiture** ! Rejoindre une équipe te donnera un **pin's** de l'équipe correspondante, et fera gagner **un point d'équipe**. Le but est donc de faire gagner **le plus de points** à son équipe pour qu'elle soit **première du classement** (`/top`) ! Voici toutes les manières de faire gagner des points à ton équipe :\n\n- En gagnant une partie de `/game rock-paper-scissors` (1 point).\n- En trouvant le bon nombre sur `/game gtn` (de 1 à 10 points selon la difficulté).\n- En trouvant la latence exacte avec `/game guess-my-ping` (3 points).\n- En complétant une quête de `/quests list` (5 points).\n- En me votant sur Top.gg avec `/vote` (5 points).\n- En gagnant une partie de `/game congelo` (autant de points que le score final).\n\n\nSi ton équipe est première, alors tu auras accès à **plein d'avantages** ! Voici la liste complète :\n\n- Ajout d'un bonus supplémentaire de 100 jours sur \`/daily\` et \`/weekly\`.\n- Un personnage bonus dans le \`/game fight\`.\n- Gains de \`/game roulette\` triplés, mais avec la possibilité de perdre le double de sa mise.\n- Temps d'attente de \`/game jackpot\`, \`/social cookie\` et \`/rob\` divisé par deux.\n- Badge d'équipe doré sur le \`/info user\`.")
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

            const gettingStartedCardsEmbed = new EmbedBuilder()
                .setColor([255, 85, 0])
                .setTitle("🎴 Guide de démarrage - Cartes à collectionner")
                .setDescription("Tu adores collectionner ? Alors cette section est pour toi ! Tu peux avoir une **collection de cartes** en rapport avec l'univers de Yunayunori, qui est le mien ! Tu peux voir ta collection avec **`/cards collection`**, mais tu n'en as sûrement aucune pour l'instant, il faut donc alors **en acheter** dans le magasin à mon nom (`/shop`) ! Une fois un paquet acheté, tu peux l'ouvrir avec **`/cards drop`**, et cliquer sur \"**Suivant**\" pour voir tes cartes une par une. Une fois toutes les cartes regardées, elles seront dans **ta collection** !\n\nEt pour l'instant, c'est tout... Plus de fonctionnalités sont **à venir** sur cette partie !")
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

            await interaction.reply({ embeds: [gettingStartedIntroductionEmbed, gettingStartedEconomyEmbed, gettingStartedTeamsEmbed, gettingStartedCardsEmbed], flags: [MessageFlags.Ephemeral] })
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};