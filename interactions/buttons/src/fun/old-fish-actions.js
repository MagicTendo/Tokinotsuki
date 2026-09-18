const { EmbedBuilder, MessageFlags } = require("discord.js");
const { sendError } = require("../../../../tools/error-catcher.js");
const { completeQuest } = require("../../../../tools/modules.js");

module.exports = {
    async execute(interaction, client) {
        try {
            const buttonContent = interaction.customId.split("_");

            switch (buttonContent[1]) {
                case "catch":
                    const oldFishes = ["une morue", "un Poisson Nuit", "un Poisson du Vent", "un Poisson de la Glace", "un Poisson de Feu", "un Poisson de la Terre", "un Poisson des Ténébres", "un Poisson de la Melodie", "un Octafish", "un Tokinosakana", "un Zakana Denkiteki"];
                    const ranndomOldFishIndex = Math.floor(Math.random() * oldFishes.length);
                    const randomOldFish = oldFishes[ranndomOldFishIndex];

                    const nostalgiaFishCatchEmbed = new EmbedBuilder()
                        .setColor([84, 150, 255])
                        .setTitle(`Tu as attrapé ${randomOldFish} :D`)
                        .setDescription("-# *Tu n'as pas vraiment obtenu ce poisson en réalité, c'est juste une simulation.*");

                    await interaction.update({ embeds: [nostalgiaFishCatchEmbed], components: [] });

                    if (ranndomOldFishIndex === 1)
                        if (await completeQuest(interaction.user.id, "fish"))
                            await interaction.reply({ content: "📜 En obtenant ce poisson, tu as terminé la quête `Poisson de nuit` !", flags: [MessageFlags.Ephemeral] })
                    break;

                case "no-catch":
                    await interaction.reply({ content: "❌ Le poisson n'a pas mordu !", flags: [MessageFlags.Ephemeral] });
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};