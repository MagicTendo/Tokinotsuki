const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, SeparatorBuilder, TextDisplayBuilder, SectionBuilder, ContainerBuilder, MessageFlags } = require("discord.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Utilitaire",
    data: new SlashCommandBuilder()
        .setName("todo")
        .setDescription("Permet de créer une to-do list.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addStringOption(option => option
            .setName("task-1")
            .setDescription("La première tâche.")
            .setMaxLength(300)
            .setRequired(true))
        .addStringOption(option => option
            .setName("task-2")
            .setDescription("La deuxième tâche.")
            .setMaxLength(300)
            .setRequired(false))
        .addStringOption(option => option
            .setName("task-3")
            .setDescription("La troisième tâche.")
            .setMaxLength(300)
            .setRequired(false))
        .addStringOption(option => option
            .setName("task-4")
            .setDescription("La quatrième tâche.")
            .setMaxLength(300)
            .setRequired(false))
        .addStringOption(option => option
            .setName("task-5")
            .setDescription("La cinquième tâche.")
            .setMaxLength(300)
            .setRequired(false))
        .addStringOption(option => option
            .setName("task-6")
            .setDescription("La sixième tâche.")
            .setMaxLength(300)
            .setRequired(false))
        .addStringOption(option => option
            .setName("task-7")
            .setDescription("La septième tâche.")
            .setMaxLength(300)
            .setRequired(false))
        .addStringOption(option => option
            .setName("task-8")
            .setDescription("La huitième tâche.")
            .setMaxLength(300)
            .setRequired(false))
        .addStringOption(option => option
            .setName("task-9")
            .setDescription("La neuvième tâche.")
            .setMaxLength(300)
            .setRequired(false))
        .addStringOption(option => option
            .setName("task-10")
            .setDescription("La dixième tâche.")
            .setMaxLength(300)
            .setRequired(false)),
    async execute(interaction, client) {
        try {
            const tasks = [];

            for (let i = 1; i < 26; i++) {
                const task = interaction.options.getString(`task-${i}`);

                if (task !== null)
                    tasks.push(task);
            }

            const todoList = new ContainerBuilder()
                .setAccentColor([255, 85, 0]);

            for (let i = 0; i < tasks.length; i++) {
                const button = new ButtonBuilder()
                    .setEmoji({ name: "⬜" })
                    .setStyle(ButtonStyle.Success)
                    .setCustomId(`todo_${i}_${interaction.user.id}`);

                const text = new TextDisplayBuilder().setContent(`**${i + 1}** - ${tasks[i]}`);
                const section = new SectionBuilder().addTextDisplayComponents(text).setButtonAccessory(button);

                todoList.addSectionComponents(section);

                if (tasks.length !== i + 1)
                    todoList.addSeparatorComponents(new SeparatorBuilder().setSpacing(2));
            }

            await interaction.reply({ components: [todoList], flags: MessageFlags.IsComponentsV2 });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};