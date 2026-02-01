const { ContainerBuilder, ButtonBuilder, ButtonStyle, TextDisplayBuilder, SectionBuilder, MessageFlags } = require("discord.js");
const { sendError } = require("../../../../tools/error-catcher.js");

module.exports = {
    async execute(interaction, client) {
        try {
            const buttonContent = interaction.customId.split("_");

            const newTodoList = new ContainerBuilder(interaction.message.components[0].toJSON());
            const componentList = [newTodoList];

            const newTodoComponents = newTodoList.components;
            const oldText = newTodoComponents[buttonContent[1] * 2].components[0].data.content;

            const button = new ButtonBuilder()
                .setEmoji({ name: "✔️" })
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true)
                .setCustomId(`todo_${buttonContent[1]}_${interaction.user.id}`);

            const text = new TextDisplayBuilder().setContent(`*~~${oldText}~~*`);
            const section = new SectionBuilder().addTextDisplayComponents(text).setButtonAccessory(button);

            newTodoComponents[buttonContent[1] * 2] = section;

            let validatedTasks = 0;

            for (let i = 0; i < newTodoComponents.length; i++) {
                if (newTodoComponents[i].data.type === 9)
                    newTodoComponents[i].accessory.data.style === ButtonStyle.Danger ? validatedTasks++ : validatedTasks;
            }

            if (validatedTasks === Math.ceil(newTodoComponents.length / 2))
                newTodoList.setAccentColor([14, 207, 0]);

            await interaction.update({ components: componentList, flags: MessageFlags.IsComponentsV2 });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};