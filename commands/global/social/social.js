const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const { getCooldownList, hasCooldownFinished } = require("../../../tools/cooldown.js");
const { updateValue } = require("../../../tools/database.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Social",
    data: new SlashCommandBuilder()
        .setName("social")
        .setDescription("Tout ce qui concerne le social.")
        .setIntegrationTypes([0])
        .setContexts([0, 1, 2])
        .addSubcommand(subcommand => subcommand
            .setName("baka")
            .setDescription("Pour être baka ou traiter quelqu'un de baka !")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Choisis l'utilisateur à traiter de baka.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("bang")
            .setDescription("Pour tirer sur quelqu'un (de façon fictive bien sûr).")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Choisis l'utilisateur à tirer dessus.")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("beg")
            .setDescription("Pour supplier quelqu'un.")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Choisis l'utilisateur à supplier.")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("bye")
            .setDescription("Pour dire au revoir (à quelqu'un).")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Choisis l'utilisateur à qui dire au revoir.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("cook")
            .setDescription("Pour cuisiner (quelqu'un (le mettre dans la sauce)).")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Choisis l'utilisateur à cuisiner.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("cookie")
            .setDescription("Pour donner un cookie à quelqu'un.")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Choisis l'utilisateur à qui donner un cookie.")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("dab")
            .setDescription("Pour dabber (devant quelqu'un).")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Choisis l'utilisateur à dabber devant.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("dance")
            .setDescription("Pour dancer (avec quelqu'un).")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Choisis l'utilisateur avec qui dancer.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("flee")
            .setDescription("Pour s'enfuir ou fuire quelqu'un.")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Choisis l'utilisateur à qui fuire.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("happy-birthday")
            .setDescription("Pour souhaiter l'anniversaire de quelqu'un !")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Choisis l'utilisateur à qui souhaiter son anniversaire !")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("heal")
            .setDescription("Pour soigner quelqu'un !")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Choisis l'utilisateur à soigner !")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("hi")
            .setDescription("Pour dire bonjour ou saluer quelqu'un !")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Choisis l'utilisateur à saluer !")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("hug")
            .setDescription("Pour faire un câlin à quelqu'un.")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Choisis l'utilisateur à qui faire un câlin.")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("hypnotise")
            .setDescription("Pour hypnotiser quelqu'un.")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Choisis l'utilisateur à hypnotiser.")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("kiss")
            .setDescription("Pour embrasser quelqu'un.")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Choisis l'utilisateur à embrasser.")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("no-you")
            .setDescription("Pour contredire quelqu'un !")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Choisis l'utilisateur à contredire.")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("photo")
            .setDescription("Pour prendre quelqu'un en photo en flagrant délit.")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Choisis l'utilisateur à photographier.")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("shrug")
            .setDescription("Pour être indécis (avec quelqu'un).")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Choisis l'utilisateur à qui être indécis.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("slap")
            .setDescription("Pour taper quelqu'un (de façon fictive toujours).")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Choisis l'utilisateur à taper.")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("spin")
            .setDescription("Pour tourner (devant quelqu'un) !")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Choisis l'utilisateur à qui tourner devant lui.")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("splash")
            .setDescription("Pour mouiller quelqu'un !")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Choisis l'utilisateur à mouiller.")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("stare")
            .setDescription("Pour fixer quelqu'un.")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Choisis l'utilisateur à fixer.")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("taida")
            .setDescription("Pour être taida ou traîter quelqu'un de taida !")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Choisis l'utilisateur à traiter de taida !")
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("pat")
            .setDescription("Pour tapoter quelqu'un.")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Choisis l'utilisateur à tapoter.")
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("wasted")
            .setDescription("Pour s'achever ou achever quelqu'un à la façon GTA.")
            .addUserOption(option => option
                .setName("user")
                .setDescription("Choisis l'utilusateur à achever façon GTA.")
                .setRequired(false))),
    async execute(interaction, client) {
        try {
            const subcommand = interaction.commandType === 1 ? interaction.options?.getSubcommand() : "cookie";
            const socialUser = interaction.options.getUser("user") ?? interaction.user;
            const author = interaction.user.globalName;
            const receiver = socialUser.globalName ?? socialUser.username;

            if (!client.guilds.cache.get(interaction.guild.id).members.cache.get(socialUser.id))
                return await interaction.reply({ content: "❌ L'utilisateur n'est pas sur le serveur !", flags: MessageFlags.Ephemeral });

            let canSocial = true;
            let isSelf = socialUser === interaction.user;
            let title;
            let description;
            let socialImages;

            switch (subcommand) {
                case "baka":
                    title = isSelf ? `${author} est un baka !` : `${author} traîte ${receiver} de baka !`;

                    if (socialUser.id === "610493430325313549" && !isSelf) {
                        description = "> Mais il te traîte de baka en retour !";
                        socialImages = ["https://c.tenor.com/EoHidpgurYYAAAAC/tenor.gif"];
                    } else {
                        socialImages = [
                            "https://c.tenor.com/9hpTx40GEKsAAAAd/tenor.gif",
                            "https://c.tenor.com/G4zCaHnNxysAAAAd/tenor.gif",
                            "https://c.tenor.com/axEcqUnz5MkAAAAd/tenor.gif",
                            "https://c.tenor.com/4JpGfOa_yYIAAAAd/tenor.gif",
                            "https://c.tenor.com/GffsABES8JIAAAAd/tenor.gif",
                            "https://c.tenor.com/r4sC8_Ilhf4AAAAd/tenor.gif",
                            "https://c.tenor.com/qNGkXNE-ZbQAAAAd/tenor.gif",
                            "https://c.tenor.com/ty1WwFxMUc8AAAAd/tenor.gif",
                            "https://c.tenor.com/59WzXkqR0U8AAAAd/tenor.gif",
                            "https://c.tenor.com/IgJ04yPkyBgAAAAd/tenor.gif",
                            "https://c.tenor.com/TZju-aIuUmAAAAAd/tenor.gif",
                            "https://c.tenor.com/w5NHcoC15r0AAAAd/tenor.gif",
                            "https://c.tenor.com/-DGDFNYOfFQAAAAd/tenor.gif",
                            "https://c.tenor.com/OyIYV1OjcjQAAAAd/tenor.gif",
                            "https://c.tenor.com/nnGJlIIluzYAAAAd/tenor.gif",
                            "https://c.tenor.com/12_7MZXBB1cAAAAd/tenor.gif"
                        ];
                    }
                    break;

                case "bang":
                    title = `${author} tire sur ${receiver} !`;
                    socialImages = [
                        "https://c.tenor.com/Am61DGzxpGoAAAAd/tenor.gif",
                        "https://c.tenor.com/pvcrnmguRUgAAAAd/tenor.gif",
                        "https://c.tenor.com/7LW7MAWtjXcAAAAd/tenor.gif",
                        "https://c.tenor.com/EX3t2qPlzDIAAAAd/tenor.gif",
                        "https://c.tenor.com/ejpGcd9okHAAAAAd/tenor.gif",
                        "https://c.tenor.com/gQkJLMcaZiIAAAAd/tenor.gif",
                        "https://c.tenor.com/guXgm-Ie55wAAAAd/tenor.gif",
                        "https://c.tenor.com/WvSUs_s7IpkAAAAd/tenor.gif",
                        "https://c.tenor.com/db0y2ej5SmkAAAAd/tenor.gif",
                        "https://c.tenor.com/EDuEGQuIFmEAAAAd/tenor.gif",
                        "https://c.tenor.com/Yo4CNoi8iJwAAAAd/tenor.gif",
                        "https://c.tenor.com/3Gxw4JNPlnsAAAAd/tenor.gif",
                        "https://c.tenor.com/o_tBFZFsBnMAAAAd/tenor.gif",
                        "https://c.tenor.com/AkRRR5KY8KoAAAAd/tenor.gif",
                        "https://c.tenor.com/Tg67X3ILgzIAAAAd/tenor.gif",
                        "https://c.tenor.com/ZpoMHWS8jMMAAAAd/tenor.gif",
                        "https://c.tenor.com/xAJE3fR0B_EAAAAd/tenor.gif",
                        "https://c.tenor.com/YQOstma8QjAAAAAd/tenor.gif",
                        "https://c.tenor.com/9X1R0d6UE-kAAAAd/tenor.gif",
                        "https://c.tenor.com/LIELXkY5vCAAAAAd/tenor.gif",
                        "https://c.tenor.com/Vja2MkojIgsAAAAd/tenor.gif",
                        "https://c.tenor.com/iMtcqbBzc5sAAAAd/tenor.gif",
                        "https://c.tenor.com/q2CSN1blDs4AAAAd/tenor.gif",
                        "https://c.tenor.com/pAxggFtEnusAAAAd/tenor.gif",
                        "https://c.tenor.com/xXgRNNq29usAAAAd/tenor.gif",
                        "https://c.tenor.com/jcbByzSSzNYAAAAd/tenor.gif"
                    ];
                    break;

                case "beg":
                    title = `${author} supplie ${receiver} !`;
                    socialImages = [
                        "https://c.tenor.com/c5NREl_bty0AAAAd/tenor.gif",
                        "https://c.tenor.com/4q5OwnFZJdEAAAAd/tenor.gif",
                        "https://c.tenor.com/8GQgc_fIaKwAAAAd/tenor.gif",
                        "https://c.tenor.com/rt-b5wrDLisAAAAd/tenor.gif",
                        "https://c.tenor.com/ljWsRRGIW_sAAAAd/tenor.gif",
                        "https://c.tenor.com/16uvDADedCMAAAAd/tenor.gif",
                        "https://c.tenor.com/o9V-PmmNGiwAAAAd/tenor.gif",
                        "https://c.tenor.com/KfN9d8rTXHYAAAAd/tenor.gif",
                        "https://c.tenor.com/eB6fOB5dkY4AAAAd/tenor.gif",
                        "https://c.tenor.com/9lme5UGlRWQAAAAd/tenor.gif",
                        "https://c.tenor.com/9KArPDxAkDMAAAAd/tenor.gif",
                        "https://c.tenor.com/DMNAg5awFzMAAAAd/tenor.gif",
                        "https://c.tenor.com/TgtTEClE92gAAAAd/tenor.gif"
                    ];
                    break;

                case "bye":
                    title = isSelf ? `${author} dit au revoir !` : `${author} dit au revoir à ${receiver} !`;
                    socialImages = [
                        "https://c.tenor.com/1rMglc7lcvgAAAAd/tenor.gif",
                        "https://c.tenor.com/XWo6EO7HupMAAAAd/tenor.gif",
                        "https://c.tenor.com/x8Vc_4yrQuoAAAAd/tenor.gif",
                        "https://c.tenor.com/3KtmfSl-C1QAAAAd/tenor.gif",
                        "https://c.tenor.com/xk1Dypa4ZDkAAAAd/tenor.gif",
                        "https://c.tenor.com/9wzq3wK8NwcAAAAd/tenor.gif",
                        "https://c.tenor.com/BEDB6q6-PaYAAAAd/tenor.gif",
                        "https://c.tenor.com/QJGmY4NSAUwAAAAd/tenor.gif",
                        "https://c.tenor.com/OfAn5Cj2A9EAAAAd/tenor.gif",
                        "https://c.tenor.com/EJ1C6RDW3YoAAAAd/tenor.gif",
                        "https://c.tenor.com/f6qHJtjCP5MAAAAd/tenor.gif",
                        "https://c.tenor.com/IlMM16oknOUAAAAd/tenor.gif",
                        "https://c.tenor.com/6y2mFoAUwucAAAAd/tenor.gif",
                        "https://c.tenor.com/PJ78MKEY4BUAAAAd/tenor.gif",
                        "https://c.tenor.com/oiYL8iyWwmkAAAAd/tenor.gif",
                        "https://c.tenor.com/a3SVQBvMyAQAAAAd/tenor.gif",
                        "https://c.tenor.com/yf2J9gTT3rQAAAAd/tenor.gif",
                        "https://c.tenor.com/KwKeSmhRuqwAAAAd/tenor.gif",
                        "https://c.tenor.com/2hBSkJhJarMAAAAd/tenor.gif"
                    ];
                    break;

                case "cook":
                    title = isSelf ? `${author} est en train de cuisiner !` : `${author} cuisine ${receiver} !`;
                    socialImages = [
                        "https://c.tenor.com/_sVpnVd2qdEAAAAd/tenor.gif",
                        "https://c.tenor.com/ZtccWz9BLJwAAAAd/tenor.gif",
                        "https://c.tenor.com/8sJbtdo2rUUAAAAd/tenor.gif",
                        "https://c.tenor.com/qEEeX6AZcCwAAAAd/tenor.gif",
                        "https://c.tenor.com/H-se6DcgSGwAAAAd/tenor.gif",
                        "https://c.tenor.com/flX5arjPeDcAAAAd/tenor.gif",
                        "https://c.tenor.com/euMHPDzYL8AAAAAd/tenor.gif",
                        "https://c.tenor.com/yZCowKJy4UoAAAAd/tenor.gif",
                        "https://c.tenor.com/kp_pQSnRrHwAAAAd/tenor.gif",
                        "https://c.tenor.com/0erDhSgAXi8AAAAd/tenor.gif",
                        "https://c.tenor.com/z-k63cEg48sAAAAd/tenor.gif",
                        "https://c.tenor.com/lJr_T1xokwIAAAAd/tenor.gif",
                        "https://c.tenor.com/FfvvihDWC_AAAAAd/tenor.gif",
                        "https://c.tenor.com/FfvvihDWC_AAAAAd/tenor.gif",
                        "https://c.tenor.com/NYM7btpxHQ8AAAAd/tenor.gif",
                        "https://c.tenor.com/W_J0-YgL_9AAAAAd/tenor.gif",
                        "https://c.tenor.com/xO6Fl8whoNQAAAAd/tenor.gif",
                        "https://c.tenor.com/iZ5gG0RZWrQAAAAd/tenor.gif",
                        "https://c.tenor.com/bNluel7XiRMAAAAd/tenor.gif",
                        "https://c.tenor.com/s67XmWjiNyIAAAAd/tenor.gif",
                        "https://c.tenor.com/TlfwpHCXUxMAAAAd/tenor.gif",
                        "https://c.tenor.com/C5bWpsCtnCsAAAAd/tenor.gif",
                        "https://c.tenor.com/hsg1mI3sr6cAAAAd/tenor.gif",
                        "https://c.tenor.com/Xma6aNZuKq4AAAAd/tenor.gif",
                        "https://c.tenor.com/VpnJJvtMMDEAAAAd/tenor.gif",
                        "https://c.tenor.com/pEcnvgIhk-sAAAAd/tenor.gif",
                        "https://c.tenor.com/ED08RzRvKvoAAAAd/tenor.gif",
                        "https://c.tenor.com/k0cDyX4Cq6IAAAAd/tenor.gif",
                        "https://c.tenor.com/4-w4QrrP4JAAAAAd/tenor.gif",
                        "https://c.tenor.com/p9w5GgxATYsAAAAd/tenor.gif",
                        "https://c.tenor.com/Or7Goy4P0t0AAAAd/tenor.gif"
                    ];
                    break;

                case "cookie":
                    if (socialUser.bot)
                        return await interaction.reply({ content: "❌ Tu ne peux pas mentionner un bot !", flags: MessageFlags.Ephemeral });
                    if (socialUser.id === interaction.user.id)
                        return await interaction.reply({ content: "❌ Tu ne peux pas te mentionner toi même !", flags: MessageFlags.Ephemeral });

                    const cooldownList = await getCooldownList();

                    if (await hasCooldownFinished(interaction, "cookie", cooldownList["cookie"])) {
                        title = `${author} donne un cookie à ${receiver} !`;
                        socialImages = [
                            "https://c.tenor.com/g-WBixuZUnsAAAAd/tenor.gif",
                            "https://c.tenor.com/zluE5zNOkOkAAAAd/tenor.gif",
                            "https://c.tenor.com/7wz4oxdBfboAAAAC/tenor.gif",
                            "https://c.tenor.com/izq1Nrrv5qAAAAAd/tenor.gif",
                            "https://c.tenor.com/DGMpXOXGDZwAAAAC/tenor.gif",
                            "https://c.tenor.com/3S_OU00IuGQAAAAd/tenor.gif",
                            "https://c.tenor.com/_caJ969biMAAAAAd/tenor.gif",
                            "https://c.tenor.com/bBRCCeAYPU8AAAAd/tenor.gif",
                            "https://c.tenor.com/l7vlJJZpwxYAAAAd/tenor.gif",
                            "https://c.tenor.com/5iW2plomNGoAAAAd/tenor.gif",
                            "https://c.tenor.com/7PYz-tzZzrIAAAAd/tenor.gif",
                            "https://c.tenor.com/w1pRNnJKwD8AAAAd/tenor.gif",
                            "https://c.tenor.com/XlvvqsNT8pUAAAAd/tenor.gif",
                            "https://c.tenor.com/K3T0Ym3eqfgAAAAd/tenor.gif",
                            "https://c.tenor.com/FoG9ZTY5_tMAAAAd/tenor.gif",
                            "https://c.tenor.com/orICD8w7EF4AAAAd/tenor.gif",
                            "https://c.tenor.com/WdEEpwmnMsYAAAAd/tenor.gif",
                            "https://c.tenor.com/9Yh8knKM9OsAAAAd/tenor.gif",
                            "https://c.tenor.com/_Wn5KdSnphEAAAAd/tenor.gif",
                            "https://c.tenor.com/T7O8lKksA-YAAAAd/tenor.gif",
                            "https://bakataida.rf.gd/assets/images/fanarts/tokinocookie.gif"
                        ];

                        await updateValue(socialUser.id, "users", "cookie", 1);
                    } else {
                        canSocial = false;
                    }
                    break;

                case "dab":
                    title = isSelf ? `${author} dab !` : `${author} dab devant ${receiver} !`;
                    socialImages = [
                        "https://c.tenor.com/C5riNZAzrksAAAAd/tenor.gif",
                        "https://c.tenor.com/KGGXGFzmtQAAAAAd/tenor.gif",
                        "https://c.tenor.com/YdKjsvFumO4AAAAd/tenor.gif",
                        "https://c.tenor.com/hLF5hGCWoXAAAAAd/tenor.gif",
                        "https://c.tenor.com/JyvkVmVTWUwAAAAd/tenor.gif",
                        "https://c.tenor.com/UaPOwMCYsG8AAAAd/tenor.gif",
                        "https://c.tenor.com/DErrRwwzDOIAAAAd/tenor.gif",
                        "https://c.tenor.com/dnwx7bHN5n0AAAAd/tenor.gif",
                        "https://c.tenor.com/vbyf28hHt2QAAAAd/tenor.gif",
                        "https://c.tenor.com/OjXWZIwSTJsAAAAd/tenor.gif",
                        "https://c.tenor.com/6HW9amyu9foAAAAd/tenor.gif",
                        "https://c.tenor.com/mwuwE5zLBiQAAAAd/tenor.gif",
                        "https://c.tenor.com/LF-vLihvfhwAAAAd/tenor.gif",
                        "https://c.tenor.com/w5Oop53gtA8AAAAd/tenor.gif",
                        "https://c.tenor.com/cbOd_mc2DvIAAAAd/tenor.gif",
                        "https://c.tenor.com/ezucHKDFergAAAAj/tenor.gif",
                        "https://c.tenor.com/Wey55CM0bZoAAAAj/tenor.gif"
                    ];
                    break;

                case "flee":
                    title = isSelf ? `${author} s'enfuit !` : `${author} fuit ${receiver} !`;
                    socialImages = [
                        "https://c.tenor.com/kzFPb4jwFhoAAAAd/tenor.gif",
                        "https://c.tenor.com/zJNU7Zwy258AAAAd/tenor.gif",
                        "https://c.tenor.com/W_0ux9exhhwAAAAd/tenor.gif",
                        "https://c.tenor.com/IU7q-w8KNDwAAAAd/tenor.gif",
                        "https://c.tenor.com/PAOfog-IuSAAAAAd/tenor.gif",
                        "https://c.tenor.com/fy_dp8-dpygAAAAd/tenor.gif",
                        "https://c.tenor.com/TMxdHkKeV4UAAAAd/tenor.gif",
                        "https://c.tenor.com/G2YT33dvNjQAAAAd/tenor.gif",
                        "https://c.tenor.com/DOcFhPnjuSAAAAAd/tenor.gif",
                        "https://c.tenor.com/0UpvCp-bmOYAAAAd/tenor.gif",
                        "https://c.tenor.com/bpqKfFJ2CqEAAAAd/tenor.gif",
                        "https://c.tenor.com/6qRTPnCnJXsAAAAd/tenor.gif",
                        "https://c.tenor.com/mUIXigPWPuYAAAAd/tenor.gif",
                        "https://c.tenor.com/MMA6_WvqS60AAAAd/tenor.gif",
                        "https://c.tenor.com/ruosy_4AkbAAAAAd/tenor.gif",
                        "https://c.tenor.com/rDUjf95xZAMAAAAd/tenor.gif",
                        "https://c.tenor.com/BAYmk47QVNwAAAAd/tenor.gif",
                        "https://c.tenor.com/TaLttzZli_UAAAAd/tenor.gif",
                        "https://c.tenor.com/Zgg2MkMiYcsAAAAd/tenor.gif",
                        "https://c.tenor.com/XbfdY2Lx-zwAAAAd/tenor.gif",
                        "https://c.tenor.com/WFDZBYi3zl4AAAAd/tenor.gif",
                        "https://c.tenor.com/IRCtgc-i9BAAAAAd/tenor.gif",
                        "https://c.tenor.com/X-fSd9efCQcAAAAd/tenor.gif",
                        "https://c.tenor.com/Z_y25UKEvMsAAAAd/tenor.gif",
                        "https://c.tenor.com/zfQk5Y7ueY0AAAAd/tenor.gif",
                        "https://c.tenor.com/BF9yBwexIbMAAAAd/tenor.gif"
                    ];
                    break;

                case "dance":
                    title = isSelf ? `${author} dance !` : `${author} dance avec ${receiver} !`;
                    socialImages = [
                        "https://c.tenor.com/LNVNahJyrI0AAAAd/tenor.gif",
                        "https://c.tenor.com/Ynm40n9fwNMAAAAd/tenor.gif",
                        "https://c.tenor.com/IGBFe1PZhOQAAAAd/tenor.gif",
                        "https://c.tenor.com/M7-Ftr7tsz8AAAAd/tenor.gif",
                        "https://c.tenor.com/X6GUm0Li_aAAAAAd/tenor.gif",
                        "https://c.tenor.com/MBIGOEbCHAEAAAAd/tenor.gif",
                        "https://c.tenor.com/-XljgaiyUPgAAAAd/tenor.gif",
                        "https://c.tenor.com/7L4T7SACcF8AAAAd/tenor.gif",
                        "https://c.tenor.com/609sc-UxciwAAAAd/tenor.gif",
                        "https://c.tenor.com/atG6zaAXy6cAAAAd/tenor.gif",
                        "https://c.tenor.com/Z8M7Txt81cEAAAAd/tenor.gif",
                        "https://c.tenor.com/-HfnlRcSLOcAAAAd/tenor.gif",
                        "https://c.tenor.com/6uG2vnnh4-sAAAAd/tenor.gif",
                        "https://c.tenor.com/uUPR2Ogd9f0AAAAd/tenor.gif",
                        "https://c.tenor.com/0ep-etlRZZQAAAAd/tenor.gif",
                        "https://c.tenor.com/y_qnh9tTaEEAAAAd/tenor.gif",
                        "https://c.tenor.com/jWRFHjiNdkgAAAAd/tenor.gif",
                        "https://c.tenor.com/uh9GwqMDkSUAAAAd/tenor.gif",
                        "https://c.tenor.com/dCq1bVzStK8AAAAd/tenor.gif",
                        "https://c.tenor.com/qqj_RXc-r5AAAAAd/tenor.gif",
                        "https://c.tenor.com/GOYRQva4UeoAAAAd/tenor.gif",
                        "https://c.tenor.com/d-lz7Nu6X2oAAAAd/tenor.gif",
                        "https://c.tenor.com/Lw6Z3WhArHcAAAAd/tenor.gif",
                        "https://c.tenor.com/KkKxg_UPplIAAAAd/tenor.gif",
                        "https://c.tenor.com/b-xhltuOrEYAAAAd/tenor.gif",
                        "https://c.tenor.com/m21RwoBHceEAAAAd/tenor.gif",
                        "https://c.tenor.com/lKmddHTKgWQAAAAd/tenor.gif",
                        "https://c.tenor.com/wMLfRfZGz3EAAAAd/tenor.gif",
                        "https://c.tenor.com/oakdhyAXUnQAAAAd/tenor.gif"
                    ];
                    break;

                case "happy-birthday":
                    title = `${author} souhaite un joyeux anniversaire à ${receiver} !`;
                    socialImages = [
                        "https://c.tenor.com/052nXi7AyagAAAAd/tenor.gif",
                        "https://c.tenor.com/VXU1pFK3Dl4AAAAd/tenor.gif",
                        "https://c.tenor.com/Tb9TR4WLkwAAAAAd/tenor.gif",
                        "https://c.tenor.com/HK0_IknfMHYAAAAd/tenor.gif",
                        "https://c.tenor.com/vm92XzEklHkAAAAd/tenor.gif",
                        "https://c.tenor.com/Egxl8TRxwT4AAAAd/tenor.gif",
                        "https://c.tenor.com/CD2PwXJlqJIAAAAd/tenor.gif",
                        "https://c.tenor.com/MvPvyKfXVCwAAAAd/tenor.gif",
                        "https://c.tenor.com/lb8n3znXeFQAAAAd/tenor.gif",
                        "https://c.tenor.com/4u0ceMGKyKoAAAAd/tenor.gif",
                        "https://c.tenor.com/lYlgP-CGx44AAAAd/tenor.gif",
                        "https://c.tenor.com/kyO3SHt98icAAAAd/tenor.gif",
                        "https://c.tenor.com/3-QGQoCUdK0AAAAd/tenor.gif",
                        "https://c.tenor.com/AFEUGPzljfsAAAAd/tenor.gif",
                        "https://c.tenor.com/0qZF3nQt7kAAAAAd/tenor.gif",
                        "https://c.tenor.com/q5oZKb4l35oAAAAC/tenor.gif"
                    ];
                    break;

                case "heal":
                    title = `${author} soigne ${receiver} !`;
                    socialImages = [
                        "https://c.tenor.com/W4sbl5pmQ6sAAAAd/tenor.gif",
                        "https://c.tenor.com/sxSjNHJ5H24AAAAd/tenor.gif",
                        "https://c.tenor.com/udPYqfNCwv4AAAAd/tenor.gif",
                        "https://c.tenor.com/ykesrZCAwjoAAAAd/tenor.gif",
                        "https://c.tenor.com/eHd02rUqn4kAAAAd/tenor.gif",
                        "https://c.tenor.com/uo0f4c5vKlkAAAAd/tenor.gif",
                        "https://c.tenor.com/ER0gjBOSMj4AAAAd/tenor.gif",
                        "https://c.tenor.com/ze2aIBfRJfoAAAAd/tenor.gif",
                        "https://c.tenor.com/QZ3hVpoLfCQAAAAd/tenor.gif",
                        "https://c.tenor.com/r6MpjyBtWLAAAAAd/tenor.gif",
                        "https://c.tenor.com/2xywiKznS20AAAAd/tenor.gif",
                        "https://c.tenor.com/HOP5RAxD-DkAAAAd/tenor.gif",
                        "https://c.tenor.com/xjgv9f7NnfMAAAAd/tenor.gif",
                        "https://c.tenor.com/K8OkccobdxEAAAAd/tenor.gif",
                        "https://c.tenor.com/N5jMw_Mcg4MAAAAd/tenor.gif",
                        "https://c.tenor.com/aJk93u0B6uAAAAAd/tenor.gif",
                        "https://c.tenor.com/ot93KV2k29IAAAAd/tenor.gif",
                        "https://c.tenor.com/aGh5LIdViMIAAAAd/tenor.gif"
                    ];
                    break;

                case "hi":
                    title = isSelf ? `${author} salue !` : `${author} salue ${receiver} !`;
                    socialImages = [
                        "https://c.tenor.com/KIy1yJZYtUcAAAAd/tenor.gif",
                        "https://c.tenor.com/9aXyxmnYW7oAAAAd/tenor.gif",
                        "https://c.tenor.com/Hntke7HWHhIAAAAd/tenor.gif",
                        "https://c.tenor.com/Obshy86MvfcAAAAd/tenor.gif",
                        "https://c.tenor.com/DuMR7QLYBTYAAAAd/tenor.gif",
                        "https://c.tenor.com/Gp2MsdoLIv4AAAAd/tenor.gif",
                        "https://c.tenor.com/Ju1Ww-si_5QAAAAd/tenor.gif",
                        "https://c.tenor.com/KM3VNP5d1FIAAAAd/tenor.gif",
                        "https://c.tenor.com/eeyZsVwZScsAAAAd/tenor.gif",
                        "https://c.tenor.com/eLrSOiW5MNUAAAAd/tenor.gif",
                        "https://c.tenor.com/Rfhh2dQq1yUAAAAd/tenor.gif",
                        "https://c.tenor.com/yz7x6pCVg3oAAAAd/tenor.gif",
                        "https://c.tenor.com/-45n7VSJk8EAAAAd/tenor.gif",
                        "https://c.tenor.com/Dav5ZktM4rMAAAAd/tenor.gif",
                        "https://c.tenor.com/b1bbdQY3UKoAAAAd/tenor.gif",
                        "https://c.tenor.com/0g-1USdD66MAAAAd/tenor.gif"
                    ];
                    break;

                case "hug":
                    title = `${author} câline ${receiver} !`;
                    socialImages = [
                        "https://c.tenor.com/VrYw1wiHs3EAAAAd/tenor.gif",
                        "https://c.tenor.com/gdhz23_GVvAAAAAC/tenor.gif",
                        "https://c.tenor.com/2VVGNLi-EV4AAAAd/tenor.gif",
                        "https://c.tenor.com/Gl35yHsyFJMAAAAC/tenor.gif",
                        "https://c.tenor.com/3rh2i65m2sAAAAAd/tenor.gif",
                        "https://c.tenor.com/P-8xYwXoGX0AAAAd/tenor.gif",
                        "https://c.tenor.com/NnDI7TW8D24AAAAd/tenor.gif",
                        "https://c.tenor.com/bZzrhkxcs6cAAAAd/tenor.gif",
                        "https://c.tenor.com/BcWUnXsPU_oAAAAd/tenor.gif",
                        "https://c.tenor.com/sJATVEhZ_VMAAAAd/tenor.gif",
                        "https://c.tenor.com/wnc03mLfwy0AAAAd/tenor.gif",
                        "https://c.tenor.com/4KCRNlvol8AAAAAd/tenor.gif",
                        "https://c.tenor.com/VnGzogiS1wgAAAAd/tenor.gif",
                        "https://c.tenor.com/BnB2TTVrcAMAAAAd/tenor.gif",
                        "https://c.tenor.com/oSPZDjEf9vQAAAAd/tenor.gif",
                        "https://c.tenor.com/y9_xxO9iMwkAAAAd/tenor.gif",
                        "https://c.tenor.com/kCBUETL9jPAAAAAd/tenor.gif",
                        "https://c.tenor.com/IgAkOQsb1VoAAAAd/tenor.gif",
                        "https://c.tenor.com/c3mbgoaFXmwAAAAd/tenor.gif",
                        "https://c.tenor.com/C0WXbXrrhxgAAAAd/tenor.gif",
                        "https://c.tenor.com/VZaFkXO5TcsAAAAd/tenor.gif",
                        "https://c.tenor.com/2lr9uM5JmPQAAAAd/tenor.gif",
                        "https://c.tenor.com/ZGmAZOJMh8EAAAAd/tenor.gif"
                    ];
                    break;

                case "hypnotise":
                    title = `${author} hypnotise ${receiver} !`;
                    socialImages = [
                        "https://c.tenor.com/SJmViTMsMnsAAAAd/tenor.gif",
                        "https://c.tenor.com/JONB3xEzHosAAAAd/tenor.gif",
                        "https://c.tenor.com/uWxfXk0ikZsAAAAd/tenor.gif",
                        "https://c.tenor.com/ft7BzF2RLZoAAAAd/tenor.gif",
                        "https://c.tenor.com/rJd8ulEEvZcAAAAd/tenor.gif",
                        "https://c.tenor.com/I_lCuj_EpB0AAAAd/tenor.gif",
                        "https://c.tenor.com/QSIiaQogagEAAAAd/tenor.gif",
                        "https://c.tenor.com/wgKyW_Y-4dAAAAAd/tenor.gif",
                        "https://c.tenor.com/dcHKYFcYe3IAAAAd/tenor.gif",
                        "https://c.tenor.com/gPdUbP_utecAAAAd/tenor.gif"
                    ];
                    break;

                case "kiss":
                    title = `${author} embrasse ${receiver} !`;
                    socialImages = [
                        "https://c.tenor.com/P0_08jmEfMAAAAAd/tenor.gif",
                        "https://c.tenor.com/g8AeFZoe7dsAAAAd/tenor.gif",
                        "https://c.tenor.com/FW3qjrOM9WkAAAAd/tenor.gif",
                        "https://c.tenor.com/HBj-BfRBfp0AAAAd/tenor.gif",
                        "https://c.tenor.com/g92jdEmFrn0AAAAd/tenor.gif",
                        "https://c.tenor.com/xYUjLVz6rJoAAAAd/tenor.gif",
                        "https://c.tenor.com/sbMBW4a-VN4AAAAd/tenor.gif",
                        "https://c.tenor.com/cQzRWAWrN6kAAAAd/tenor.gif",
                        "https://c.tenor.com/9u2vmryDP-cAAAAd/tenor.gif",
                        "https://c.tenor.com/SZ8-4vDwi6cAAAAd/tenor.gif",
                        "https://c.tenor.com/OByUsNZJyWcAAAAd/tenor.gif",
                        "https://c.tenor.com/YhGc7aQAI4oAAAAd/tenor.gif",
                        "https://c.tenor.com/vByy30BRy6EAAAAd/tenor.gif",
                        "https://c.tenor.com/LrKmxrDxJN0AAAAd/tenor.gif",
                        "https://c.tenor.com/dn_KuOESmUYAAAAd/tenor.gif",
                        "https://c.tenor.com/b7DWF8ecBkIAAAAd/tenor.gif",
                        "https://c.tenor.com/BZyWzw2d5tAAAAAd/tenor.gif",
                        "https://c.tenor.com/HJLEYgQcvEAAAAAd/tenor.gif",
                        "https://c.tenor.com/NNo16wdRXrUAAAAd/tenor.gif",
                        "https://c.tenor.com/ZDqsYLDQzIUAAAAd/tenor.gif",
                        "https://c.tenor.com/KE3VW3qP4RAAAAAd/tenor.gif",
                        "https://c.tenor.com/fFXn6UF_Dt4AAAAd/tenor.gif",
                        "https://c.tenor.com/NO6j5K8YuRAAAAAd/tenor.gif",
                        "https://c.tenor.com/L-NTpww8HTUAAAAd/tenor.gif",
                        "https://c.tenor.com/iuAtLtpRcgwAAAAd/tenor.gif",
                        "https://c.tenor.com/F02Ep3b2jJgAAAAd/tenor.gif",
                        "https://c.tenor.com/u920fHfzqJsAAAAd/tenor.gif",
                        "https://c.tenor.com/_RhZ68OdXLwAAAAd/tenor.gif",
                        "https://c.tenor.com/_JqioiurJwIAAAAd/tenor.gif",
                        "https://c.tenor.com/9OV4Q-nMTxsAAAAd/tenor.gif",
                        "https://c.tenor.com/NZUQilMD3IIAAAAd/tenor.gif",
                        "https://c.tenor.com/GoPV-W2pxMUAAAAd/tenor.gif",
                        "https://c.tenor.com/0c9uBaP9Ql8AAAAd/tenor.gif",
                        "https://c.tenor.com/376XxGkLTFIAAAAd/tenor.gif",
                        "https://c.tenor.com/3OW6j6x6Oh8AAAAd/tenor.gif",
                        "https://c.tenor.com/06lz817csVgAAAAd/tenor.gif",
                        "https://c.tenor.com/ItYRNh6P-Q8AAAAd/tenor.gif",
                        "https://c.tenor.com/YHxJ9NvLYKsAAAAd/tenor.gif",
                        "https://c.tenor.com/K6ED8Jkuw2MAAAAd/tenor.gif",
                        "https://c.tenor.com/Cm96sG4j-hQAAAAd/tenor.gif",
                        "https://c.tenor.com/XB3mEB77l7EAAAAd/tenor.gif",
                        "https://c.tenor.com/vhuon7swiOYAAAAd/tenor.gif",
                        "https://c.tenor.com/H7ElWf1bKUkAAAAd/tenor.gif",
                        "https://c.tenor.com/2-Wymg2o2iYAAAAd/tenor.gif",
                        "https://c.tenor.com/25Rz_PwWSHgAAAAd/tenor.gif",
                        "https://c.tenor.com/An_uRjYe3GUAAAAd/tenor.gif",
                        "https://c.tenor.com/2v6L19KYjgQAAAAd/tenor.gif",
                        "https://c.tenor.com/EsKyXpC2wPUAAAAd/tenor.gif",
                        "https://c.tenor.com/ebi-Gt7Rr_IAAAAd/tenor.gif",
                        "https://c.tenor.com/2MZgbU7fxrUAAAAd/tenor.gif"
                    ];
                    break;

                case "no-you":
                    title = `${author} n'est pas d'accord avec ${receiver} !`;
                    socialImages = [
                        "https://c.tenor.com/eaAbCBZy0PoAAAAd/tenor.gif",
                        "https://c.tenor.com/LAcYOwpSIpcAAAAd/tenor.gif",
                        "https://c.tenor.com/VQAmgxo1OHgAAAAd/tenor.gif",
                        "https://c.tenor.com/0W_ZPzYwZd8AAAAd/tenor.gif",
                        "https://c.tenor.com/Vo8H7uYx9BcAAAAd/tenor.gif",
                        "https://c.tenor.com/ySMXaHDfetYAAAAd/tenor.gif",
                        "https://c.tenor.com/fp8iwjPyBfsAAAAd/tenor.gif",
                        "https://c.tenor.com/6eC9MIzlBjsAAAAd/tenor.gif",
                        "https://c.tenor.com/PMgd9hpxuNUAAAAd/tenor.gif",
                        "https://c.tenor.com/GC53JESKYgUAAAAd/tenor.gif",
                        "https://c.tenor.com/N1yaz93pSbYAAAAd/tenor.gif",
                        "https://c.tenor.com/cdf_PpeS7EQAAAAd/tenor.gif",
                        "https://c.tenor.com/MmtNHyUVtVwAAAAd/tenor.gif",
                        "https://c.tenor.com/gBGCBHZCnyoAAAAd/tenor.gif",
                        "https://c.tenor.com/ZNoysK9oPPIAAAAd/tenor.gif",
                        "https://c.tenor.com/oU8k9uSehzwAAAAi/tenor.gif"
                    ];
                    break;

                case "photo":
                    title = `${author} prend en photo ${receiver} en 9K !`;
                    socialImages = [
                        "https://c.tenor.com/6nO7jWQY4k0AAAAd/tenor.gif",
                        "https://c.tenor.com/B1E638M9DQAAAAAd/tenor.gif",
                        "https://c.tenor.com/hsX0Re4U9f0AAAAd/tenor.gif",
                        "https://c.tenor.com/bBQS97IkxGYAAAAd/tenor.gif",
                        "https://c.tenor.com/1K7tk86GcxIAAAAd/tenor.gif",
                        "https://c.tenor.com/hYVQwEIMnT8AAAAd/tenor.gif",
                        "https://c.tenor.com/u_tk3aSJ8VkAAAAC/tenor.gif",
                        "https://c.tenor.com/sFbBTo2uw9kAAAAd/tenor.gif",
                        "https://c.tenor.com/Hu4aNkZCLRoAAAAd/tenor.gif",
                        "https://c.tenor.com/ZPpJBs8rrkEAAAAd/tenor.gif",
                        "https://c.tenor.com/3OTMG5KRALcAAAAd/tenor.gif",
                        "https://c.tenor.com/O3H3j_yEWP0AAAAd/tenor.gif"
                    ];
                    break;

                case "shrug":
                    title = isSelf ? `${author} ne sait pas !` : `${author} hausse les épaules devant ${receiver} !`;
                    socialImages = [
                        "https://c.tenor.com/0GOwPHgcUj0AAAAd/tenor.gif",
                        "https://c.tenor.com/nlSDG33ptOoAAAAd/tenor.gif",
                        "https://c.tenor.com/F6ekeSqr9OsAAAAd/tenor.gif",
                        "https://c.tenor.com/ZaxUeXcUtDkAAAAd/tenor.gif",
                        "https://c.tenor.com/U06tekgz-OQAAAAd/tenor.gif",
                        "https://c.tenor.com/HtRb68DqNPwAAAAd/tenor.gif",
                        "https://c.tenor.com/kmnTi4AsfwQAAAAd/tenor.gif",
                        "https://c.tenor.com/YdK9JDmImKUAAAAd/tenor.gif",
                        "https://c.tenor.com/e1uPTuA2toIAAAAd/tenor.gif",
                        "https://c.tenor.com/kBpbNAlmRkUAAAAd/tenor.gif",
                        "https://c.tenor.com/an4SmYf2MjcAAAAd/tenor.gif",
                        "https://c.tenor.com/U3y_TclQYT0AAAAd/tenor.gif",
                        "https://c.tenor.com/ZS4tAPRPQ6EAAAAd/tenor.gif",
                        "https://c.tenor.com/SxvUPdLQfrgAAAAd/tenor.gif",
                        "https://c.tenor.com/-f4M0nxR048AAAAd/tenor.gif",
                        "https://c.tenor.com/Zw_dz8zbaWIAAAAd/tenor.gif",
                        "https://c.tenor.com/XAdtlGThtf0AAAAd/tenor.gif",
                        "https://c.tenor.com/Z9LeDHw1ROoAAAAd/tenor.gif",
                        "https://c.tenor.com/IwU2F8aM7acAAAAd/tenor.gif"
                    ];
                    break;

                case "slap":
                    title = `${author} tape ${receiver} !`;
                    socialImages = [
                        "https://c.tenor.com/SIrXZQWK9WAAAAAd/tenor.gif",
                        "https://c.tenor.com/Z5ORIDwGVLcAAAAC/tenor.gif",
                        "https://c.tenor.com/EfhPfbG0hnMAAAAd/tenor.gif",
                        "https://c.tenor.com/XiYuU9h44-AAAAAd/tenor.gif",
                        "https://c.tenor.com/Up9LqtY-AuIAAAAd/tenor.gif",
                        "https://c.tenor.com/7D4YxPD36RAAAAAd/tenor.gif",
                        "https://c.tenor.com/0JEIgVMCcaIAAAAd/tenor.gif",
                        "https://c.tenor.com/btnM_mAk51kAAAAd/tenor.gif",
                        "https://c.tenor.com/X2WGK2fbenEAAAAd/tenor.gif",
                        "https://c.tenor.com/FgVH3sT6VTIAAAAd/tenor.gif",
                        "https://c.tenor.com/SPTj2zOlS8gAAAAd/tenor.gif",
                        "https://c.tenor.com/HTHoXnBc400AAAAd/tenor.gif",
                        "https://c.tenor.com/54vXJe6Jj3kAAAAd/tenor.gif",
                        "https://c.tenor.com/7xFcP1KWjY0AAAAd/tenor.gif",
                        "https://c.tenor.com/E3OW-MYYum0AAAAd/tenor.gif",
                        "https://c.tenor.com/cpWuWnOU64MAAAAd/tenor.gif",
                        "https://c.tenor.com/xqxgr-wfiJMAAAAd/tenor.gif",
                        "https://c.tenor.com/dHs5rpszNF0AAAAC/tenor.gif",
                        "https://c.tenor.com/YIg9gYzSq7kAAAAC/tenor.gif",
                        "https://c.tenor.com/B72IF1r2Ms8AAAAd/tenor.gif"
                    ];
                    break;

                case "spin":
                    title = isSelf ? `${author} tourne !` : `${author} tourne devant ${receiver} !`;
                    socialImages = [
                        "https://c.tenor.com/kfXicpYoZMAAAAAd/tenor.gif",
                        "https://c.tenor.com/JCUkBqoE9NsAAAAd/tenor.gif",
                        "https://c.tenor.com/hCfbgMlt0gQAAAAd/tenor.gif",
                        "https://c.tenor.com/UNr77Xg-7NcAAAAd/tenor.gif",
                        "https://c.tenor.com/tXjFSgidaGoAAAAd/tenor.gif",
                        "https://c.tenor.com/VBhhUBvS4UsAAAAd/tenor.gif",
                        "https://c.tenor.com/LDq8tEpCZPwAAAAd/tenor.gif",
                        "https://c.tenor.com/CQmfNrX5MT4AAAAd/tenor.gif",
                        "https://c.tenor.com/1VBwgnE7xTIAAAAd/tenor.gif",
                        "https://c.tenor.com/WLm2bTIGi94AAAAd/tenor.gif",
                        "https://c.tenor.com/PhmcNFzNoWsAAAAd/tenor.gif",
                        "https://c.tenor.com/tCqvd6ATdR4AAAAd/tenor.gif",
                        "https://c.tenor.com/GB5qHbjeZnMAAAAd/tenor.gif",
                        "https://c.tenor.com/i1cdx_jR3gAAAAAC/tenor.gif",
                        "https://c.tenor.com/hQwTpTjZJfkAAAAd/tenor.gif",
                        "https://c.tenor.com/VRqcHGkxbvkAAAAd/tenor.gif",
                        "https://c.tenor.com/UNUe4guW43YAAAAd/tenor.gif",
                        "https://c.tenor.com/9q0aE5-aI7EAAAAd/tenor.gif",
                        "https://c.tenor.com/LelbHoqTY1IAAAAd/tenor.gif",
                        "https://c.tenor.com/OhT2Yo7v-C0AAAAd/tenor.gif",
                        "https://c.tenor.com/-Ud7eMP7fHMAAAAd/tenor.gif"
                    ];
                    break;

                case "splash":
                    title = `${author} éclabousse ${receiver} !`;
                    socialImages = [
                        "https://c.tenor.com/U7J7z7m4CiwAAAAd/tenor.gif",
                        "https://c.tenor.com/szJ4QMGsdVoAAAAd/tenor.gif",
                        "https://c.tenor.com/wvWssqgZBX8AAAAd/tenor.gif",
                        "https://c.tenor.com/crcEiLjiNkUAAAAd/tenor.gif",
                        "https://c.tenor.com/T0XWDXNpQ5UAAAAd/tenor.gif",
                        "https://c.tenor.com/p-ZcUbbJb_wAAAAd/tenor.gif",
                        "https://c.tenor.com/gR1nuyTrdmYAAAAd/tenor.gif",
                        "https://c.tenor.com/3SjkeCxmOJcAAAAd/tenor.gif",
                        "https://c.tenor.com/rcx4nAFwntwAAAAd/tenor.gif",
                        "https://c.tenor.com/FaeI1AeNMTYAAAAd/tenor.gif",
                        "https://c.tenor.com/CFB6BHdYPvoAAAAd/tenor.gif",
                        "https://c.tenor.com/C_mB6B72htUAAAAd/tenor.gif",
                        "https://c.tenor.com/BY2xp63gaAgAAAAd/tenor.gif",
                        "https://c.tenor.com/xmsDDS9QxhwAAAAd/tenor.gif"
                    ];
                    break;

                case "stare":
                    title = `${author} fixe ${receiver}...`;
                    socialImages = [
                        "https://c.tenor.com/-AqMZ7tZPpkAAAAd/tenor.gif",
                        "https://c.tenor.com/wL1b6eKiW8MAAAAC/tenor.gif",
                        "https://c.tenor.com/qVkfUNedvmsAAAAd/tenor.gif",
                        "https://c.tenor.com/FFd634daPcoAAAAd/tenor.gif",
                        "https://c.tenor.com/cb0zdMLmoMIAAAAd/tenor.gif",
                        "https://c.tenor.com/5q0lv--uUKUAAAAd/tenor.gif",
                        "https://c.tenor.com/KZVkRSh8rGoAAAAd/tenor.gif",
                        "https://c.tenor.com/l2DhMTXahzAAAAAd/tenor.gif",
                        "https://c.tenor.com/q9llNrQ8saAAAAAd/tenor.gif",
                        "https://c.tenor.com/VlG3XYw4d0EAAAAd/tenor.gif",
                        "https://c.tenor.com/psYEeopvYYMAAAAd/tenor.gif",
                        "https://c.tenor.com/SEEMSDLdDugAAAAd/tenor.gif",
                        "https://c.tenor.com/iVS8JPEsmD0AAAAd/tenor.gif",
                        "https://c.tenor.com/L17xILFOlPoAAAAd/tenor.gif",
                        "https://c.tenor.com/VC3EDnfJmKEAAAAd/tenor.gif",
                        "https://c.tenor.com/YfqM8h3_6NEAAAAd/tenor.gif",
                        "https://c.tenor.com/ko9kqx5UtMQAAAAd/tenor.gif",
                        "https://c.tenor.com/EsKHl_LUAsgAAAAd/tenor.gif",
                        "https://c.tenor.com/FhrJYU1qhWcAAAAd/tenor.gif",
                        "https://c.tenor.com/gPPUbLL-tgwAAAAd/tenor.gif"
                    ];
                    break;

                case "taida":
                    title = isSelf ? `${author} a la flemme !` : `${author} traite ${receiver} de taida !`;

                    if (socialUser.id === "610493430325313549" && !isSelf) {
                        description = "> Mais il est d'accord avec toi !";
                        socialImages = ["https://c.tenor.com/j7v03WxPm6IAAAAd/tenor.gif"];
                    } else {
                        socialImages = [
                            "https://c.tenor.com/PORlinUAPhwAAAAd/tenor.gif",
                            "https://c.tenor.com/E-GDeMqscZEAAAAd/tenor.gif",
                            "https://c.tenor.com/lve6oowtLt4AAAAd/tenor.gif",
                            "https://c.tenor.com/5Xa6qRGo7yEAAAAd/tenor.gif",
                            "https://c.tenor.com/6HLLZUWbBlEAAAAd/tenor.gif",
                            "https://c.tenor.com/cK_6WVK-0n8AAAAd/tenor.gif",
                            "https://c.tenor.com/jrBQmuo2elMAAAAd/tenor.gif",
                            "https://c.tenor.com/nHjL71BhLOgAAAAd/tenor.gif",
                            "https://c.tenor.com/Ti58ZZLcApoAAAAd/tenor.gif",
                            "https://c.tenor.com/4N3ToBwbvccAAAAd/tenor.gif",
                            "https://c.tenor.com/TCJR_dLW98QAAAAd/tenor.gif",
                            "https://c.tenor.com/dOf4OcenG2wAAAAd/tenor.gif",
                            "https://c.tenor.com/HwTVxkb7a-4AAAAd/tenor.gif",
                            "https://c.tenor.com/yzGKuxVoePcAAAAd/tenor.gif",
                            "https://c.tenor.com/_Jl6jlsRYwUAAAAd/tenor.gif",
                            "https://c.tenor.com/R2Yu04U362kAAAAd/tenor.gif",
                            "https://c.tenor.com/AH5Z8hQe-fIAAAAd/tenor.gif"
                        ];
                    }
                    break;

                case "pat":
                    title = `${author} tapote ${receiver} !`;
                    socialImages = [
                        "https://c.tenor.com/E6fMkQRZBdIAAAAd/tenor.gif",
                        "https://c.tenor.com/kIh2QZ7MhBMAAAAd/tenor.gif",
                        "https://c.tenor.com/pvF8xcytu1YAAAAd/tenor.gif",
                        "https://c.tenor.com/X3uRWln9tBUAAAAd/tenor.gif",
                        "https://c.tenor.com/8w4TYd2tsKcAAAAd/tenor.gif",
                        "https://c.tenor.com/8e9QI2E7SEMAAAAd/tenor.gif",
                        "https://c.tenor.com/zBPha3hhm7QAAAAd/tenor.gif",
                        "https://c.tenor.com/UDiBKJ6qBiUAAAAd/tenor.gif",
                        "https://c.tenor.com/wLqFGYigJuIAAAAd/tenor.gif",
                        "https://c.tenor.com/N41zKEDABuUAAAAd/tenor.gif",
                        "https://c.tenor.com/oUS1jdJBkIwAAAAd/tenor.gif",
                        "https://c.tenor.com/7xrOS-GaGAIAAAAd/tenor.gif",
                        "https://c.tenor.com/fDAeg5EWRy0AAAAd/tenor.gif",
                        "https://c.tenor.com/8Redi_A9GLwAAAAd/tenor.gif",
                        "https://c.tenor.com/EtbdHrQDN2UAAAAd/tenor.gif",
                        "https://c.tenor.com/Y1ijcaLdxQcAAAAd/tenor.gif",
                        "https://c.tenor.com/kIh2QZ7MhBMAAAAd/tenor.gif",
                        "https://c.tenor.com/D3wMebymct8AAAAd/tenor.gif"
                    ];
                    break;

                case "wasted":
                    title = isSelf ? `${author} a perdu !` : `${author} fait perdre ${receiver} !`;
                    socialImages = [
                        "https://c.tenor.com/Re9dglY0sCwAAAAd/tenor.gif",
                        "https://c.tenor.com/hDFU7nFDFhcAAAAd/tenor.gif",
                        "https://c.tenor.com/M17-O96DXfMAAAAd/tenor.gif",
                        "https://c.tenor.com/PJbU0yjG3BUAAAAd/tenor.gif",
                        "https://c.tenor.com/tmt1kX9T5_MAAAAd/tenor.gif",
                        "https://c.tenor.com/RJsSYNSKF7oAAAAd/tenor.gif",
                        "https://c.tenor.com/FJmJM5jRVp4AAAAd/tenor.gif",
                        "https://c.tenor.com/RU_RjYoHDusAAAAd/tenor.gif",
                        "https://c.tenor.com/gQAWuiZnbZ4AAAAC/tenor.gif",
                        "https://c.tenor.com/I_msiNVliZ4AAAAd/tenor.gif"
                    ];
                    break;
            }

            if (canSocial) {
                const socialRandomIndex = Math.floor(Math.random() * socialImages.length);
                const socialImage = socialImages[socialRandomIndex];

                const socialEmbed = new EmbedBuilder()
                    .setColor([255, 85, 0])
                    .setTitle(title)
                    .setImage(socialImage)
                    .setTimestamp()
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                if (typeof description !== "undefined")
                    socialEmbed.setDescription(description);

                await interaction.reply({ embeds: [socialEmbed] });
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};