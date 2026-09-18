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
            const robbedUserID = robbedUser.id;

            if (robbedUser.bot)
                return await interaction.reply({ content: "❌ Tu ne peux pas voler un bot !", flags: [MessageFlags.Ephemeral] });
            if (userID === robbedUserID)
                return await interaction.reply({ content: "❌ Tu ne peux pas voler de l'argent à toi même !", flags: [MessageFlags.Ephemeral] });
            if (!interaction.guild.members.cache.get(robbedUserID))
                return await interaction.reply({ content: "❌ L'utilisateur doit être présent sur ce serveur !", flags: [MessageFlags.Ephemeral] });

            const totalRobberUserMoney = await getValue(userID, "users", "toki-coin");
            let totalRobbedUserMoney = await getValue(robbedUserID, "users", "toki-coin");

            if (totalRobbedUserMoney < 10_000)
                return await interaction.reply({ content: `❌ La personne n'a pas assez d'argent ! Elle doit avoir au moins ${await simplify(userID, 10_000)} ${getCurrencySymbol("toki-coin")} !`, flags: [MessageFlags.Ephemeral] });

            const cooldownList = await getCooldownList();

            if (await hasCooldownFinished(interaction, "rob", cooldownList["rob"])) {
                totalRobbedUserMoney > 50_000 ? totalRobbedUserMoney = 50_000 : totalRobbedUserMoney;

                const canRobTokiCoins = (Math.floor(Math.random() * 3) + 1) % 3 === 0;
                const canRobCookies = await getValue(robbedUserID, "users", "cookie") >= 5;
                const randomRobCookiesAmount = Math.floor(Math.random() * 5);
                let randomRobTokiCoinsAmount = Math.floor(Math.random() * ((canRobTokiCoins ? totalRobbedUserMoney : totalRobberUserMoney / 2) - 1_000)) + 1_000;

                canRobTokiCoins ? randomRobTokiCoinsAmount = Math.min(randomRobTokiCoinsAmount, totalRobbedUserMoney) : randomRobTokiCoinsAmount = -Math.min(randomRobTokiCoinsAmount, totalRobberUserMoney);

                await updateValue(userID, "users", "toki-coin", randomRobTokiCoinsAmount);
                await updateValue(robbedUserID, "users", "toki-coin", -randomRobTokiCoinsAmount);

                if (canRobTokiCoins && canRobCookies)
                    await updateValue(robbedUserID, "users", "cookie", -randomRobCookiesAmount);

                if (canRobTokiCoins)
                    await interaction.reply({ content: `<@${userID}> a volé ${await simplify(userID, randomRobTokiCoinsAmount)} ${getCurrencySymbol("toki-coin")} ${canRobCookies ? `et ${randomRobCookiesAmount} ${getCurrencySymbol("cookie")} à` : "à"} <@${robbedUserID}> !` });
                else
                    await interaction.reply({ content: `<@${userID}> a tenté de voler <@${robbedUserID}>, mais cela n'a pas fonctionné !${randomRobTokiCoinsAmount !== 0 ? ` <@${robbedUserID}> te prends ${await simplify(userID, Math.abs(randomRobTokiCoinsAmount))} ${getCurrencySymbol("toki-coin")} !` : ""}` });
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};