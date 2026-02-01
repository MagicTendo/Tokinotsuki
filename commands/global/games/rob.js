const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { getCooldownList, hasCooldownFinished } = require("../../../tools/cooldown.js");
const { getValue, updateValue } = require("../../../tools/database.js");
const { sendError } = require("../../../tools/error-catcher.js");
const { getCurrencySymbol, simplify } = require("../../../tools/modules.js");

module.exports = {
    category: "Jeux",
    data: new SlashCommandBuilder()
        .setName("rob")
        .setDescription("Pour essayer voler de l'argent à quelqu'un.")
        .setIntegrationTypes([0])
        .setContexts([0])
        .addUserOption(option => option
            .setName("user")
            .setDescription("L'utilisateur à qui voler.")
            .setRequired(true)),
    async execute(interaction, client) {
        try {
            const robbedUser = interaction.options.getUser("user");
            const userID = interaction.user.id;

            if (robbedUser.bot)
                return await interaction.reply({ content: "❌ Tu ne peux pas voler un bot !", flags: MessageFlags.Ephemeral });
            if (userID === robbedUser.id)
                return await interaction.reply({ content: "❌ Tu ne peux pas voler de l'argent à toi même !", flags: MessageFlags.Ephemeral });
            if (!interaction.guild.members.cache.get(robbedUser.id))
                return await interaction.reply({ content: "❌ L'utilisateur doit être présent sur ce serveur !", flags: MessageFlags.Ephemeral });

            const totalRobberUserMoney = await getValue(userID, "users", "toki-coin");
            let totalRobbedUserMoney = await getValue(robbedUser.id, "users", "toki-coin");

            if (totalRobbedUserMoney < 10_000)
                return await interaction.reply({ content: `❌ La personne n'a pas assez d'argent ! Elle doit avoir au moins ${await simplify(userID, 10_000)} ${getCurrencySymbol("toki-coin")} !`, flags: MessageFlags.Ephemeral });

            const cooldownList = await getCooldownList();

            if (await hasCooldownFinished(interaction, "rob", cooldownList["rob"])) {
                totalRobbedUserMoney > 50_000 ? totalRobbedUserMoney = 50_000 : totalRobbedUserMoney;

                const canRob = true// (Math.floor(Math.random() * 3) + 1) % 3 === 0;
                const totalRobbable = canRob ? totalRobbedUserMoney : totalRobberUserMoney / 2;
                let randomRobAmount = Math.floor(Math.random() * (totalRobbable - 1_000) + 1_000);

                canRob ? randomRobAmount = Math.min(randomRobAmount, totalRobbedUserMoney) : randomRobAmount = -Math.min(randomRobAmount, totalRobberUserMoney);

                await updateValue(userID, "users", "toki-coin", randomRobAmount);
                await updateValue(robbedUser.id, "users", "toki-coin", -randomRobAmount);

                if (canRob) {
                    await interaction.reply({ content: `<@${userID}> a volé ${await simplify(userID, randomRobAmount)} ${getCurrencySymbol("toki-coin")} à <@${robbedUser.id}> !` });
                } else {
                    await interaction.reply({ content: `<@${userID}> a tenté de voler <@${robbedUser.id}>, mais cela n'a pas fonctionné !${randomRobAmount !== 0 ? ` <@${robbedUser.id}> te prends ${await simplify(userID, Math.abs(randomRobAmount))} ${getCurrencySymbol("toki-coin")} !` : ""}` });
                }
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};