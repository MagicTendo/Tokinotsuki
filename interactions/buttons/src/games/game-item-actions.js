const { updateValue } = require("../../../../tools/database.js");
const { sendError } = require("../../../../tools/error-catcher.js");
const { getCurrencySymbol, simplify } = require("../../../../tools/modules.js");

module.exports = {
    async execute(interaction) {
        try {
            const buttonContent = interaction.customId.split("_");
            const userID = interaction.user.id;
            let originalOwner;

            switch (buttonContent[1]) {
                case "sell":
                    const price = buttonContent[2];
                    originalOwner = buttonContent[4];

                    await updateValue(userID, "users", "toki-coin", Number(price));

                    if (buttonContent.includes("arkeology") && userID !== originalOwner) {
                        await interaction.update({ content: `<@${userID}> a gagné ${await simplify(userID, price)} ${getCurrencySymbol("toki-coin")} en volant la trouvaille de <@${originalOwner}> !`, embeds: [], components: [], files: [] });
                    } else {
                        await interaction.update({ content: `Tu as gagné ${await simplify(userID, price)} ${getCurrencySymbol("toki-coin")} !`, embeds: [], components: [], files: [] });
                    }
                    break;

                case "keep":
                    const itemKey = buttonContent[2];
                    const itemName = buttonContent[3];
                    originalOwner = buttonContent[5];

                    await updateValue(userID, "users", itemKey, 1);

                    if (buttonContent.includes("arkeology") && userID !== originalOwner) {
                        await interaction.update({ content: `<@${userID}> a volé ${itemName.toLowerCase()} découvert par <@${originalOwner}> !`, embeds: [], components: [], files: [] });
                    } else {
                        await interaction.update({ content: `${itemName} a bien été sauvegardé !`, embeds: [], components: [], files: [] });
                    }
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};