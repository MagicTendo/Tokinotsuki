const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const {getValue } = require("../../../tools/database");
const { sendError } = require("../../../tools/error-catcher");

module.exports = {
    category: "Jeux",
    data: new SlashCommandBuilder()
        .setName("task")
        .setDescription("Donne une tâche à faire. Chaque tâche réalisé donne une récompense !")
        .setIntegrationTypes([0])
        .setContexts([0]),
    async execute(interaction, client) {
        try {
            const userID = interaction.user.id;
            const tasks = [
                {
                    "Obtient **3 cookies**": ["cookie", 3]
                },
                {
                    "Obtient **9 points Congelo**": ["congelo", 9],
                    "Achète la **pioche**": ["pickaxe", 1]
                },
                {
                    "Pêche **3 bururumiya**": ["miya", 3],
                    "Pêche **5 algues**": ["seaweed", 5],
                    "Pêche **1 norositsono**": ["norositsono", 1],
                },
                {
                    "Achète **5 provisions alimentaires **": ["food-provision", 5],
                    "Achète **10 provisions d'eau **": ["water-provision", 10],
                    "Achète **5 kits de soin**": ["care-kit", 5],
                    "Achète **3 kit de nuit**": ["sleep-kit", 3]
                },
                {
                    "Achète un **compte Foyllori**": ["bank", 1],
                    "Achète le **pinceau**": ["brush", 1],
                    "Découvre **3 fleurs séchées**": ["dried-flower", 3],
                    "Découvre **2 os**": ["bone", 2],
                    "Découvre **1 ticket de temps**": ["time-ticket", 1]
                },
                {
                    "Achète **l'amélioration de canne à pêche**": ["fishing-rod", 2],
                    "Achète **3 amélioration du compte Foyllori**": ["bank-capacity", 3],
                    "Achète **3 paquets de 4 cartes**": ["booster-pack", 4],
                    "Obtient **99 cookies**": ["cookie", 99],
                    "Obtient **99 points Congelo**": ["congelo", 99],
                    "Récupère **10 cailloux**": ["rock", 10]
                },
                {
                    "Accomplie la quête \"**Daily routine**\"": ["quest-routine", 1],
                    "Achète **l'amélioration de pioche**": ["pickaxe", 2],
                    "Achète **l'âme d'Inosayo**": ["inosayo", 1],
                    "Achète **15 provisions alimentaires **": ["food-provision", 15],
                    "Achète **25 provisions d'eau **": ["water-provision", 25],
                    "Achète **10 kits de soin**": ["care-kit", 10],
                    "Achète **5 kit de nuit**": ["sleep-kit", 5]
                },
                {
                    "Accomplie la quête \"**Pure love**\"": ["quest-love", 1],
                    "Achète **l'amélioration de pinceau**": ["brush", 2],
                    "Achète **l'appareil photo**": ["camera", 1],
                    "Pêche **9 miyakitsus**": ["miyakitsu", 9],
                    "Photographie **3 bururusanis**": ["bururusani", 3],
                    "Photographie **2 saniiramos**": ["saniiramo", 2],
                    "Photographie **1 saniruyu**": ["saniruyu", 1],
                    "Photographie **1 sinirireiri**": ["sinirireiri", 1]
                },
                {
                    "Accomplie la quête \"**Icy**\"": ["quest-icy", 1],
                    "Accomplie la quête \"**GTN genius**\"": ["quest-gtn", 1],
                    "Achète **l'amélioration d'appareil photo**": ["camera", 2],
                    "Achète **l'âme d'Oseitena**": ["oseitena", 1],
                    "Obtient la carte **Rinaki Isokitsu**": ["isokitsu-card", 1],
                    "Pêche **1 miyarono**": ["miyarono", 1],
                    "Récupère **1 takakumi**": ["takakumi", 1],
                    "Trouve **1 crystal clair**": ["crystal", 1],
                    "Photographie **1 sinirirenata**": ["sinirirenata", 1]
                },
            ];
            const taskTotal = tasks.length;
            const currentTask = await getValue(userID, "users", "task");

            if (currentTask >= taskTotal)
                return await interaction.reply({ content: "Tu as déjà accomplie toutes les tâches disponibles !", flags: MessageFlags.Ephemeral });

            const currentTaskObject = Object.keys(tasks[currentTask]);
            let taskDescription = "";
            let isComplete = true;

            for (let i = 0; i < currentTaskObject.length; i++) {
                const taskRequirement = tasks[currentTask][currentTaskObject[i]];

                if (isComplete && await getValue(userID, "users", taskRequirement[0]) < taskRequirement[1])
                    isComplete = false;

                taskDescription += `> ${isComplete ? "✅" : "❌"} ${currentTaskObject[i]}\n`;
            }

            const taskButton = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setEmoji({ name: "✔️" })
                    .setLabel("Valider")
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(!isComplete)
                    .setCustomId(`task_${currentTask}_${taskTotal}_${userID}`));

            const taskEmbed = new EmbedBuilder()
                .setColor([255, 85, 0])
                .setTitle(`Tâche #${currentTask + 1}`)
                .setDescription(`${taskDescription}\n-# *Attention, tout ce qui est demandé doit être dans l'inventaire, pas juste simplement obtenu une fois.*`)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

            await interaction.reply({ embeds: [taskEmbed], components: [taskButton], flags: MessageFlags.Ephemeral });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};