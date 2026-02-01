const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Informations",
    data: new SlashCommandBuilder()
        .setName("patch-notes")
        .setDescription("Pour consulter toutes mes notes de patch.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addStringOption(option => option
            .setName("version")
            .setDescription("Choisis la version.")
            .addChoices(
                { name: "v4.0.0", value: "4.0.0" },
                { name: "v3.0.0", value: "3.0.0" },
                { name: "v2.0.0", value: "2.0.0" },
                { name: "v1.2.0", value: "1.2.0" },
                { name: "v1.1.4", value: "1.1.4" },
                { name: "v1.1.3", value: "1.1.3" },
                { name: "v1.1.2", value: "1.1.2" },
                { name: "v1.1.1", value: "1.1.1" },
                { name: "v1.1.0", value: "1.1.0" })
            .setRequired(true)),
    async execute(interaction, client) {
        try {
            const version = interaction.options.getString("version");
            let patchNotesContent;

            switch (version) {
                case "4.0.0":
                    patchNotesContent = "➜ Mise à jour totale du bot, toutes les commandes et fonctionnalités ont étaient améliorées (nouvelles sous-commandes, optimisations, bugs réglés, etc.) !\n➜ Plus de 100 nouvelles fonctionalités ! Comme entres autres `/anime`, `/game arkeology`, `/encode-text`, `/qr-code`, `/prize`, `/grab` ou encore `/weather`.\n➜ Ajout de nouveaux objets (poissons, minerais, artefacts, etc.) et de plus de jeux (snap bird, arkeology, etc.).\n➜ Lore et noms modifiés (Watozan est devenu Toki Coin, etc.).\n➜ Implémentation de commandes permettant d'ajouter des règles AutoMod.\n➜ Nouvelles actions sociales avec `beg`, `happy-birthday`, `hypnotise`, `no-you`, `photo`, `shrug` et `spin`.\n➜ Nouveau système d'apprentissage avec les commandes `/learn` permettant d'apprendre un peu de géographie, de mathématiques et de japonais.\n➜ Nouveau système de radio permettant d'avoir de la musique dans un salon vocal avec `/radio`.\n➜ Ajout de fonctionalités spécialement pour le serveur Yunayunori, comme un système d'expérience, de notifications de nouvelles publications sur les réseaux sociaux ou même une avant première de certaines fonctionalités.\n➜ J'ai également pris en compte toutes les suggestions qui ont étaient faîtes dans le passé (ombres pour les objets non obtenus, canne à pêche avec appâts, etc.).\n➜ Refonte totale de l'identité visuelle (images, photo de profile, émojis, etc.).\n➜ Les images et les émojis sont maintenant locales, ils devraient maintenant être tout le temps présent et plus rapide à charger.\n➜ Après 4 ans de \"La nouvelle documentation arrive très bientôt !\", elle est enfin là pour de vrai !\n➜ Création d'une petite API publique pour obtenir des statistiques sur le bot en dehors de Discord.\n➜ Un meilleur temps de réponse et de nombreuses optimisations dans tout les sens.\n➜ Deux fois plus de status, ne chageons pas les bonnes traditions !\n➜ Nouveaux statuts et easter eggs bien évidemment !\n➜ Le code du projet est enfin en open source !\n➜ Et pleins d'autres petits détails dans tout les sens !";
                    break;

                case "3.0.0":
                    patchNotesContent = "➜ Rip le préfix `>` car maintenant c'est en slash command donc `/` :c.\n➜ Ajout du `/nqn`, `/stats`, `/text-generation`, `/top bug`, `/quests`, `/social taida`, `/mod timeout`, `/calculate button-mode`, `/cooldowns` et `/toggle say | rob`.\n➜ Possibilité de garder les minerais avec l'inventaire à minerais et de les vendre avec le Sayetsuri Shop.\n➜ Ajout de nouveaux objets dans les shops avec par exemple les Stonkozans et les Stonkookies !\n➜ Mise en place d'un système de banque pour pas ce faire voler.\n➜ Ajout d'un système de badge visible dans `/info user` !\n➜ Nouvelles images dans `/tokinotsuki` UwU.\n➜ Nouvelles activités dans `/vocal`.\n➜ Ajout de nouveaux SCP !\n➜ Refontes de certains embeds :3.\n➜ Ajout de nouveaux statuts ( OwO).\n➜ Le bot envoi les erreurs en disant de quelle commande sa viens dans un salon de log, sa sera beaucoup plus simple pour régler les bugs ;3.\n➜ Pleins de petites modifications comme le `/love` qui vas afficher le même pourcentage d'amour entre deux utilisateurs, nouveaux designs des jeux dans le Retro Pixel Center et bien d'autres !\n\n*Merci à CoolMan pour m'avoir aidé pour la mise à jour x)*";
                    break;

                case "2.0.0":
                    patchNotesContent = "➜ Ajout de nouveaux mini jeux comme `>tictactoe`, `>snake` ou encore de `>pikpik {infos}` et de `>fight` qui sont achetable dans le `>retro pixel center` !\n➜ Ajout de deux nouveaux shops ! Le `>cookieshop` et le `>fightshop` !\n➜ Ajout de commandes pour la catégorie modération et social.\n➜ Ajout de `>uwu`, `>wat`, `>choice [Choix 1, choix 2]`, `>mixnames [@Utilisateur]`, `>wikihow`, `>sell all`, `>yt {Message}`, `>poker {Message}` et `>chess {Message}`.\n➜ Ajout de `>pay [@Utilisateur, Montant]` pour donner des Watozans aux autres mais aussi ajout de `>rob [@Utilisateur]` pour voler de l'argent à quelqu'un et de `>money` pour voir son nombre de Watozans !\n➜ Pleins de nouveaux statuts !\n➜ Le pixel art des poissons est un plagiat de Minecraft, oui j’avoue ._. mais plus maintenant UwU.\n➜ Quelques modifications mineures et bugs réglés.\n➜ Ajout d'un easter egg, plus compliqué que celui de la version 1.1.1 si vous voulez arriver au bout (◔◡◔).\n\nNote: pour le `>fish` il ne faut plus une canne à pêche mais faut acheter le jeu sur le `>retro pixel center` et il est au même prix que la canne à pêche et si vous avez déjà une canne à pêche vous aurez quand même le jeu !";
                    break;

                case "1.2.0":
                    patchNotesContent = "➜ Nouveaux articles dans `>kerusunashop` :D.\n➜ Petite modification avec `>fish`, quand vous pêcher un poisson, vous avez deux réactions, une pour garder le poisson et l'autre pour directement le vendre.\n➜ Quand un nombre de Watozans et généré aléatoirement, le bot choisis maintenant un nombre minimum à un nombre maximum et plus de 0 au nombre maximum (du coup plus de 0 ou 1 Watozan pour les malchanceux xD) et `>daily` peut donner jusqu'à 750 Watozans maintenant !\n➜ Vous pouvez maintenant consulter l'inventaire des autres avec `>inventory` @Utilisateur. \n➜ Petite modification sur certains embeds !";
                    break;

                case "1.1.4":
                    patchNotesContent = "➜ Ajout de `>vote` qui donne des Watozans si vous votez pour le bot sur Top.gg.\n➜ Ajout de la nouvelle fonctionnalité de bouton sur `>botinfo`.";
                    break;

                case "1.1.3":
                    patchNotesContent = "➜ Ajout de `>uselesswebsites` qui montre des sites inutiles x).\n➜ Petite modification sur `>gtn` (le bot répond avec le \"nouveau\" système de réponse de Discord).\n➜ Ajout de `>mp` (commande uniquement disponible pour le développeur).";
                    break;

                case "1.1.2":
                    patchNotesContent = "➜ `>userinfo` marche si on mentionne quelqu'un.\n➜ `>cookie` et `>chifoumi` remarche !\n➜ Nouvelle URL du site du bot (http://tokinotsuki.rf.gd/), l'ancienne URL redirige vers la nouvelle :p.\n➜ Suppression de tous les `message.delete()` qui permettent d'effacer la commande entrer par l'utilisateur.";
                    break;

                case "1.1.1":
                    patchNotesContent = "➜ Ajout de la commande `>fautereport` car je ne sais pas écrire :p.\n➜ Plus de cooldowns pour `>bugreport`, `>suggestion` et `>fautereport` pour les bêta testeurs !\n➜ Réglage de quelques bugs mineurs.\n➜ Ajout d'un easter egg 0w0.";
                    break;

                case "1.1.0":
                    patchNotesContent = "➜ Ajout de 6 images pour la commande `/tokinotsuki`.\n➜ Ajout de la commande `/scpinfo`, `/scplist`, `/scp` et `/scpsearch` avec 65 SCP enregistraient.\n➜ Suppression de l'ancienne commande `/scp` :p.";
                    break;
            }

            const versionEmbed = new EmbedBuilder()
                .setColor([255, 85, 0])
                .setTitle(`Notes de patch de la version ${version}`)
                .setDescription(patchNotesContent)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

            await interaction.reply({ embeds: [versionEmbed], flags: MessageFlags.Ephemeral });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};