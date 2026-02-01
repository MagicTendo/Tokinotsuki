const { EmbedBuilder } = require("discord.js");
const { sendError } = require("../../../../tools/error-catcher.js");

module.exports = {
    async execute(interaction, client) {
        try {
            const buttonContent = interaction.customId.split("_");
            let newSCPList = new EmbedBuilder()
                .setTitle(interaction.message.embeds[0].data.title)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

            switch (buttonContent[1]) {
                case "classic":
                    newSCPList = newSCPList
                        .setColor([255, 255, 255])
                        .setDescription("**SCP-007** - Planète abdominale\n**SCP-008** - Peste zombie\n**SCP-009** - Glace rouge\n**SCP-048** - Le Numéro SCP maudit\n**SCP-049** - Le Docteur de peste\n**SCP-052** - Train voyageant dans le temps\n**SCP-079** - Vieille IA\n**SCP-096** - \"L'Homme timide\"\n**SCP-099** - Le Portrait\n**SCP-115** - Camion-benne miniature\n**SCP-151** - La Peinture\n**SCP-173** - La Statue - **L'original**\n**SCP-198** - Tasse de Joe\n**SCP-207** - Bouteilles de Cola\n**SCP-217** - Le Virus mécanique\n**SCP-229** - Lianes câbles\n**SCP-242** - Piscine auto-\"nettoyante \"\n**SCP-261** - Distributeur pan-dimensionnel\n**SCP-283** - Une pierre qui tombe de travers\n**SCP-330** - N'en prenez que deux\n**SCP-345** - Cube-puzzle de pierre\n**SCP-354** - La Mare rouge\n**SCP-355** - Le Gazon aiguisé\n**SCP-445** - \"Le Super-papier du Dr Wondertainment\"\n**SCP-500** - La Panacée\n**SCP-517** - Mamie sait tout\n**SCP-524** - Walter le lapin omnivore\n**SCP-529** - Josie le demi-chat\n**SCP-609** - La Boule N°6 ontologique® du Dr Wondertainment\n**SCP-617** - Cailloux de compagnie\n**SCP-674** - Pistolet à exposition\n**SCP-697** - Terraformation toxique\n**SCP-703** - Dans le placard\n**SCP-715** - Mon visage pour que je puisse être\n**SCP-783** - Ici y avait un type ᵗordᵤ\n**SCP-786** - Entonnoir puissance douze\n**SCP-823** - Carnaval des horreurs\n**SCP-872** - Le Fermier en lambeaux\n**SCP-882** - Une machine\n**SCP-920** - M. Perdu\n**SCP-970** - La Pièce récursive\n**SCP-1002** - Liquidateurs\n**SCP-1070** - Le Jeu éducatif\n**SCP-1471** - MalO ver1.0.0\n**SCP-1507** - Flamants roses\n**SCP-1673** - Cimetière amical\n**SCP-1678** - Non-Londres\n**SCP-1715** - Ami en ligne\n**SCP-1981** - \"RONALD REAGAN SE COUPE PENDANT QU'IL PARLE\"\n**SCP-1997** - Livre d'activités infinies\n**SCP-2046** - Cauchemar de Mendeleïev\n**SCP-2223** - Référencement abusif d'images d'anime\n**SCP-2262** - La Police de caractère exaspérante\n**SCP-2521** - ●●|●●●●●|●●|●\n**SCP-2915** - Crousti-chair\n**SCP-2999-A** - Le Lapin blanc\n**SCP-2999-B** - Le Chat noir\n**SCP-3003** - La Fin de l'Histoire\n**SCP-3008** - Un bon vieil Ikea ordinaire et parfaitement normal\n**SCP-3009** - Bonjour, je suis votre Snaposie !\n**SCP-3349** - Impression d'ECG en cours\n**SCP-3889** - Le Semi-remorque de la nuit\n**SCP-4187** - Bu(r)g(er) King\n**SCP-4486** - Le bonheur est relatif\n**SCP-4885** - Trouvez-le\n**SCP-4962** - dack hunt REMIST ER");
                    break;

                case "fr":
                    newSCPList = newSCPList
                        .setColor([5, 6, 77])
                        .setDescription("**SCP-027-FR** - \"Get Rick Rolled\"\n**SCP-134-FR** - Lim(Uₙ)= +∞\n**SCP-157-FR** - Piscine sans fond\n**SCP-172-FR** - \"Points de vue\"");
                    break;

                case "es":
                    newSCPList = newSCPList
                        .setColor([204, 110, 10])
                        .setDescription("**SCP-028-ES** - Orthographe et Grammaire Divertissantes du Dr Wondertainment !");
                    break;

                case "jp":
                    newSCPList = newSCPList
                        .setColor([204, 12, 35])
                        .setDescription("**SCP-009-JP** - Seconde intercalaire\n**SCP-020-JP** - Humain ailé\n**SCP-040-JP** - Il y a un chat.\n**SCP-404-JP** - Not Found\n**SCP-444-JP** - █████[Accès non autorisé]\n**SCP-835-JP** - ~~Xénophobie~~ Enfant noir\n**SCP-910-JP** - Symbole\n**SCP-1100-JP** - CAPTCHA\n**SCP-1440-JP** - と");
                    break;

                case "j":
                    newSCPList = newSCPList
                        .setColor([252, 215, 3])
                        .setDescription("**SCP-300-FR(-J ?)** - L. Alexandre\n**SCP-329-J** - Le Panneaaaauuuu fantôôôôôme");
                    break;
            }

            await interaction.update({ embeds: [newSCPList] });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};