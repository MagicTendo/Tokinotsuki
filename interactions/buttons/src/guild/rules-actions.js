const { MessageFlags } = require("discord.js");
const { sendError } = require("../../../../tools/error-catcher.js");

module.exports = {
    async execute(interaction, client) {
        try {
            if (interaction.member.roles.cache.has("805878889725165578")) {
                await interaction.guild.members.cache.get(interaction.user.id).roles.remove("805878889725165578");
                await interaction.guild.members.cache.get(interaction.user.id).roles.add("750028696290852875");
                await interaction.guild.members.cache.get(interaction.user.id).roles.add("872571888356974624");
                await interaction.reply({ content: "✅ Tu peux maintenant intéragir sur le serveur !", flags: [MessageFlags.Ephemeral] });
            } else {
                await interaction.reply({ content: "✅ Tu as déjà accepté le règlement !", flags: [MessageFlags.Ephemeral] });
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};