const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const nerdamer = require("nerdamer/all.min");
const countryList = require("../../../json/countries.json");
const hiraganaKatakanaList = require("../../../json/hiragana-katakana.json");
const { canCreateCollector, endCollector } = require("../../../tools/collectors-manager.js");
const { sendError } = require("../../../tools/error-catcher.js");
const { clean } = require("../../../tools/modules.js");

module.exports = {
    category: "Apprentissage",
    data: new SlashCommandBuilder()
        .setName("learn")
        .setDescription("Pour apprendre les pays du monde, leur nom, leur drapeau ou leur capital !")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addSubcommand(subcommand => subcommand
            .setName("capitals")
            .setDescription("Un pays aléatoire sera donné et tu devras écrire le nom de sa capitale ! * si elle n'existe pas.")
            .addIntegerOption(option => option
                .setName("rounds")
                .setDescription("Le nombres de capitale à trouver.")
                .setMinValue(3)
                .setMaxValue(276)
                .setRequired(true))
            .addStringOption(option => option
                .setName("continent")
                .setDescription("Dans quel continent les pays doivent être ?")
                .addChoices(
                    { name: "🌍 Partout dans le monde", value: "everywhere" },
                    { name: "🌐 Pays de l'ONU", value: "onu" },
                    { name: "🚩 Pays n'étant pas dans l'ONU", value: "not-onu" },
                    { name: "🪘 Afrique", value: "africa" },
                    { name: "🍁 Amérique du nord", value: "north-america" },
                    { name: "🦜 Amérique du sud", value: "south-america" },
                    { name: "🏯 Asie", value: "asia" },
                    { name: "🦅 États américains", value: "usa-states" },
                    { name: "💶 Europe", value: "europe" },
                    { name: "🌊 Océanie", value: "oceania" },
                    { name: "🐚 Îles", value: "islands" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("round-duration")
                .setDescription("Quelle durée pour chaque manche ?")
                .addChoices(
                    { name: "🚀 5 secondes", value: "5000" },
                    { name: "🚄 10 secondes", value: "10000" },
                    { name: "🚗 20 secondes", value: "20000" },
                    { name: "🚲 25 secondes", value: "25000" },
                    { name: "🛹 30 secondes", value: "30000" },
                    { name: "🕓 45 secondes", value: "45000" },
                    { name: "🐌 1 minute", value: "60000" })
                .setRequired(false))
            .addStringOption(option => option
                .setName("death-match")
                .setDescription("Activer le mode death match ? Une erreur, et la partie est terminé !")
                .addChoices(
                    { name: "✅ Oui", value: "yes" },
                    { name: "❌ Non", value: "no" })
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("flags")
            .setDescription("Un drapeau aléatoire sera donné et tu devras écrire le nom du pays !")
            .addIntegerOption(option => option
                .setName("rounds")
                .setDescription("Le nombres de drapeaux à trouver.")
                .setMinValue(3)
                .setMaxValue(276)
                .setRequired(true))
            .addStringOption(option => option
                .setName("continent")
                .setDescription("Dans quel continent les pays doivent être ?")
                .addChoices(
                    { name: "🌍 Partout dans le monde", value: "everywhere" },
                    { name: "🌐 Pays de l'ONU", value: "onu" },
                    { name: "🚩 Pays n'étant pas dans l'ONU", value: "not-onu" },
                    { name: "🪘 Afrique", value: "africa" },
                    { name: "🍁 Amérique du nord", value: "north-america" },
                    { name: "🦜 Amérique du sud", value: "south-america" },
                    { name: "🏯 Asie", value: "asia" },
                    { name: "🦅 États américains", value: "usa-states" },
                    { name: "💶 Europe", value: "europe" },
                    { name: "🌊 Océanie", value: "oceania" },
                    { name: "🐚 Îles", value: "islands" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("round-duration")
                .setDescription("Quelle durée pour chaque manche ?")
                .addChoices(
                    { name: "🚀 5 secondes", value: "5000" },
                    { name: "🚄 10 secondes", value: "10000" },
                    { name: "🚗 20 secondes", value: "20000" },
                    { name: "🚲 25 secondes", value: "25000" },
                    { name: "🛹 30 secondes", value: "30000" },
                    { name: "🕓 45 secondes", value: "45000" },
                    { name: "🐌 1 minute", value: "60000" })
                .setRequired(false))
            .addStringOption(option => option
                .setName("death-match")
                .setDescription("Activer le mode death match ? Une erreur, et la partie est terminé !")
                .addChoices(
                    { name: "✅ Oui", value: "yes" },
                    { name: "❌ Non", value: "no" })
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("kana")
            .setDescription("Pour apprendre les deux syllabaires japonais !")
            .addIntegerOption(option => option
                .setName("rounds")
                .setDescription("Le nombres de kana à traduire.")
                .setMinValue(3)
                .setMaxValue(208)
                .setRequired(true))
            .addStringOption(option => option
                .setName("syllabary")
                .setDescription("Quel syllabaire réviser ?")
                .addChoices(
                    { name: "📖 Tout (sauf archaïque)", value: "everything" },
                    { name: "🍙 Hiragana", value: "hiragana" },
                    { name: "🎴 Katakana", value: "katakana" },
                    { name: "📜 Archaïque", value: "archaic" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("round-duration")
                .setDescription("Quelle durée pour chaque manche ?")
                .addChoices(
                    { name: "🚀 5 secondes", value: "5000" },
                    { name: "🚄 10 secondes", value: "10000" },
                    { name: "🚗 20 secondes", value: "20000" },
                    { name: "🚲 25 secondes", value: "25000" },
                    { name: "🛹 30 secondes", value: "30000" },
                    { name: "🕓 45 secondes", value: "45000" },
                    { name: "🐌 1 minute", value: "60000" })
                .setRequired(false))
            .addStringOption(option => option
                .setName("death-match")
                .setDescription("Activer le mode death match ? Une erreur, et la partie est terminé !")
                .addChoices(
                    { name: "✅ Oui", value: "yes" },
                    { name: "❌ Non", value: "no" })
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("mathematics")
            .setDescription("Des calculs seront donné, et il faudra les résoudre le plus rapidemment possible !")
            .addIntegerOption(option => option
                .setName("rounds")
                .setDescription("Le nombres de calculs à effectuer.")
                .setMinValue(3)
                .setMaxValue(100)
                .setRequired(true))
            .addStringOption(option => option
                .setName("themes")
                .setDescription("Dans quel continent les pays doivent être ?")
                .addChoices(
                    { name: "🧮 Tout", value: "everything" },
                    { name: "➕ Opérations", value: "operations" },
                    { name: "➗ Fractions", value: "fractions" },
                    { name: "💥 Simplifications de puissances", value: "powers" },
                    { name: "✅ Simplifications de racines carrés", value: "square-roots" },
                    { name: "❌ Équations du premier degré", value: "equations" },
                    { name: "📈 Dérivées", value: "derivatives" },
                    { name: "📉 Dérivées secondes", value: "second-derivatives" },
                    { name: "💻 Conversions en base 2", value: "base-2" },
                    { name: "🔡 Conversions en base 16", value: "base-16" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("round-duration")
                .setDescription("Quelle durée pour chaque manche ?")
                .addChoices(
                    { name: "🚀 5 secondes", value: "5000" },
                    { name: "🚄 10 secondes", value: "10000" },
                    { name: "🚗 20 secondes", value: "20000" },
                    { name: "🚲 25 secondes", value: "25000" },
                    { name: "🛹 30 secondes", value: "30000" },
                    { name: "🕓 45 secondes", value: "45000" },
                    { name: "🐌 1 minute", value: "60000" })
                .setRequired(false))
            .addStringOption(option => option
                .setName("death-match")
                .setDescription("Activer le mode death match ? Une erreur, et la partie est terminé !")
                .addChoices(
                    { name: "✅ Oui", value: "yes" },
                    { name: "❌ Non", value: "no" })
                .setRequired(false)))

        .addSubcommand(subcommand => subcommand
            .setName("outlines")
            .setDescription("Un contour de pays aléatoire sera donné et tu devras écrire le nom du pays !")
            .addIntegerOption(option => option
                .setName("rounds")
                .setDescription("Le nombres de contours à trouver.")
                .setMinValue(3)
                .setMaxValue(276)
                .setRequired(true))
            .addStringOption(option => option
                .setName("continent")
                .setDescription("Dans quel continent les pays doivent être ?")
                .addChoices(
                    { name: "🌍 Partout dans le monde", value: "everywhere" },
                    { name: "🌐 Pays de l'ONU", value: "onu" },
                    { name: "🚩 Pays n'étant pas dans l'ONU", value: "not-onu" },
                    { name: "🪘 Afrique", value: "africa" },
                    { name: "🍁 Amérique du nord", value: "north-america" },
                    { name: "🦜 Amérique du sud", value: "south-america" },
                    { name: "🏯 Asie", value: "asia" },
                    { name: "💶 Europe", value: "europe" },
                    { name: "🌊 Océanie", value: "oceania" },
                    { name: "🐚 Îles", value: "islands" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("round-duration")
                .setDescription("Quelle durée pour chaque manche ?")
                .addChoices(
                    { name: "🚀 5 secondes", value: "5000" },
                    { name: "🚄 10 secondes", value: "10000" },
                    { name: "🚗 20 secondes", value: "20000" },
                    { name: "🚲 25 secondes", value: "25000" },
                    { name: "🛹 30 secondes", value: "30000" },
                    { name: "🕓 45 secondes", value: "45000" },
                    { name: "🐌 1 minute", value: "60000" })
                .setRequired(false))
            .addStringOption(option => option
                .setName("death-match")
                .setDescription("Activer le mode death match ? Une erreur, et la partie est terminé !")
                .addChoices(
                    { name: "✅ Oui", value: "yes" },
                    { name: "❌ Non", value: "no" })
                .setRequired(false))),
    async execute(interaction, client) {
        try {
            if (await canCreateCollector(interaction, interaction.guild.id)) {
                await interaction.deferReply();

                const quizType = interaction.options.getSubcommand();
                const rounds = interaction.options.getInteger("rounds");
                const roundDurationRaw = interaction.options.getString("round-duration");
                const roundDuration = roundDurationRaw === null ? 30_000 : Number(roundDurationRaw);
                const isDeathMatch = interaction.options.getString("death-match") === "yes";
                const deleteDelay = 2_000;
                const jsonQuiz = ["capitals", "flags", "outlines"];
                const errors = [];
                let questions = [];
                let isCorrect = false;
                let isStopped = false;
                let maximumRound = 0;
                let currentRound = 0;
                let points = 0;

                async function generateQuestions() {
                    if (jsonQuiz.includes(quizType)) {
                        const continent = interaction.options.getString("continent");

                        if (continent === "everywhere" || continent.includes("onu")) {
                            for (let i = 0; i < countryList["continents"].length; i++) {
                                const currentContinent = countryList["continents"][i];

                                if (quizType === "outlines" && currentContinent === "usa-states")
                                    continue;

                                for (let j = 0; j < Object.keys(countryList).length - 1; j++) {
                                    const countryCode = Object.keys(countryList[currentContinent])[j];
                                    const country = countryList[currentContinent][countryCode];

                                    if ((continent === "onu" && !country["onu"]) || (continent === "not-onu" && country["onu"]))
                                        continue;

                                    quizType === "capitals" ? questions.push(`${country["name"]}|${country["capital"]}|${countryCode}`) : quizType === "flags" ? questions.push(`https://flagcdn.com/w2560/${countryCode}.png|${country["name"]}|${countryCode}`) : questions.push(`https://img.geonames.org/img/country/250/${countryCode.toUpperCase()}.png|${country["name"]}|${countryCode}`);
                                }
                            }
                        } else {
                            const specificcountryList = Object.keys(countryList[continent]);

                            for (let i = 0; i < specificcountryList.length; i++) {
                                const countryCode = specificcountryList[i];
                                const country = countryList[continent][countryCode];

                                quizType === "capitals" ? questions.push(`${country["name"]}|${country["capital"]}|${countryCode}`) : quizType === "flags" ? questions.push(`https://flagcdn.com/w2560/${countryCode}.png|${country["name"]}|${countryCode}`) : questions.push(`https://img.geonames.org/img/country/250/${countryCode.toUpperCase()}.png|${country["name"]}|${countryCode}`);
                            }
                        }

                        questions = questions.sort(() => 0.5 - Math.random()).slice(0, rounds);
                        maximumRound = questions.length;
                    } else if (quizType === "kana") {
                        const syllabary = interaction.options.getString("syllabary");
                        const syllabaries = syllabary === "everything" ? ["hiragana", "katakana"] : [syllabary];

                        for (let i = 0; i < syllabaries.length; i++) {
                            for (let j = 0; j < hiraganaKatakanaList[syllabaries[i]].length; j++) {
                                questions.push(`${hiraganaKatakanaList[syllabaries[i]][j]["kana"]}|${hiraganaKatakanaList[syllabaries[i]][j]["roumaji"]}`);
                            }
                        }

                        questions = questions.sort(() => 0.5 - Math.random()).slice(0, rounds);
                        maximumRound = questions.length;
                    } else {
                        const calculationThemes = ["operations", "fractions", "equations", "bases"];
                        const operations = ["+", "-", "*"];
                        let calculationTheme = interaction.options.getString("themes");
                        let isEverything = calculationTheme === "everything";
                        let patterns;
                        let pattern;
                        let randomPatternIndex;
                        let calcul;
                        let result;
                        maximumRound = rounds;

                        for (let i = 0; i < rounds; i++) {
                            if (isEverything)
                                calculationTheme = calculationThemes[Math.floor(Math.random() * calculationThemes.length)];

                            calcul = "";

                            if (calculationTheme.includes("base")) {
                                const randomNumber = Math.floor(Math.random() * 51);
                                const isToDecimal = Math.floor(Math.random() * 2) === 0;

                                if (calculationTheme === "base-2") {
                                    if (isToDecimal) {
                                        calcul = `(${randomNumber.toString(2)})₂ = (?)₁₀`;
                                        result = randomNumber;
                                    } else {
                                        calcul = `(${randomNumber})₁₀ = (?)₂`;
                                        result = randomNumber.toString(2);
                                    }
                                } else {
                                    if (isToDecimal) {
                                        calcul = `(${randomNumber.toString(16)})₁₆ = (?)₁₀`;
                                        result = randomNumber;
                                    } else {
                                        calcul = `(${randomNumber})₁₀ = (?)₁₆`;
                                        result = randomNumber.toString(16);
                                    }
                                }
                            } else {
                                patterns = calculationTheme === "operations" ? ["0 A 0", "0 A 0 A 0", "0 A 0 A 0 A 0", "0 A 0 A 0 A 0 A 0 A 0", "0 A (0)", "0 A (0 B 0)", "(0 B 0) A (0 B 0)", "-(0 B 0) A 0", "-((0 B 0) B 0) A 0", "x(0 B 0)", "0x A x A 0"] : calculationTheme === "fractions" ? ["0 / I", "(0 A 0) / I", "(0 / I) A (0 / I)", "(0 A 0 / I) B (0 A 0 / I)", "(0 / I) B (0 / I) B (0 / I)"] : calculationTheme === "powers" ? ["2^2", "3^2", "4^2", "5^2", "6^2", "7^2", "8^2", "9^2", "2^3", "3^3", "4^3", "5^3"] : calculationTheme === "square-roots" ? ["sqrt(4)", "sqrt(9)", "sqrt(16)", "sqrt(25)", "sqrt(36)", "sqrt(49)", "sqrt(64)", "sqrt(81)", "sqrt(100)", "0sqrt(I)", "(sqrt(I) * sqrt(I))^2"] : calculationTheme === "equations" ? ["x A 0 = N", "0 A x A 0 = N", "0 A x A 0 A 0 = N", "(0 A x) A 0 = N", "x A (0 A 0) = N", "(x A 0) A (0 A 0) = N"] : ["F 0", "F x A 0", "F 0x A 0", "F x^2 A x A 0", "F x^2 A 0x A 0", "F 0x^2 A 0x A 0", "F 0x^2 A 0x A 0", "F x^3 A x^2 A x A 0", "F x^3 A x^2 A 0x A 0", "F x^3 A 0x^2 A 0x A 0", "F 0x^3 A 0x^2 A 0x A 0", "F x / I", "F 0x / I", "F x^2 / I", "F 0x^2 / I", "F x^3 / I", "F 0x^3 / I"];
                                randomPatternIndex = Math.floor(Math.random() * patterns.length);
                                pattern = patterns[randomPatternIndex];

                                for (let j = 0; j < pattern.length; j++) {
                                    const randomNumber = Math.floor(Math.random() * 26);
                                    const randomOperationIndex = Math.floor(Math.random() * operations.length);
                                    const randomOperation = operations[randomOperationIndex];

                                    calcul += pattern[j].replace("0", randomNumber).replace("A", randomOperation).replace("B", randomOperation.replace("*", "+")).replace("N", "0").replace("I", randomNumber + 1).replace("F", "f(x) =");
                                }

                                result = calculationTheme === "equations" ? await nerdamer.solveEquations([calcul]).toString().split(",")[1] : calculationTheme === "derivatives" ? await nerdamer(`diff(${calcul.replace("f(x) =", "")}, x)`) : calculationTheme === "second-derivatives" ? await nerdamer(`diff(${calcul.replace("f(x) =", "")}, x, 2)`) : await nerdamer(calcul);
                            }

                            questions.push(`${calcul}${calculationTheme === "derivatives" ? " ; f'(x) = ?" : calculationTheme === "second-derivatives" ? " ; f\"(x) = ?" : ""}|${result}`);
                        }
                    }
                }

                async function nextRound(previousAnswer = null) {
                    if (questions.length === 0)
                        return await endGame();

                    const question = questions[0].split("|")[0];
                    const answer = questions[0].split("|")[1];
                    const countryCode = questions[0].split("|")[2];
                    const quizImage = [];
                    isCorrect = false;
                    currentRound++;

                    const learnEmbed = new EmbedBuilder()
                        .setColor([255, 85, 0])
                        .setTitle(`${quizType === "capitals" ? `Quelle est la capitale de ce territoire : **\`${question}\`** ?` : quizType === "flags" ? `Quelle territoire a ce drapeau ?` : quizType === "kana" ? `Quel est ce kana : ${question}` : quizType === "outlines" ? `Quelle territoire a ce contour ?` : `Quelle est le résultat : **${question.replaceAll("*", "\\*")}** |`} (${currentRound} / ${maximumRound})`)
                        .setDescription(`⌚ **Temps restant** : <t:${Math.floor(Date.now() / 1_000 + (roundDuration / 1_000))}:R>\n⭐ **Points** : ${points}${previousAnswer !== null ? `\n💡 **Réponse précédante** : ${previousAnswer.replaceAll("*", "\\*")}` : ""}\n\n-# Envoie \`skip\` si tu ne connais pas la réponse, ou \`*\` quand la question n'a pas de réponse (des territoires n'ont pas des capitales par exemple, mais ça reste rare). Si tu veux arrêter, envoie \`stop\`.`)
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                    if (quizType !== "capitals" && quizType !== "kana" && quizType !== "mathematics") {
                        learnEmbed.setImage("attachment://question.png");

                        const questionImageResponse = await fetch(question);
                        const questionImageBuffer = await questionImageResponse.arrayBuffer();
                        const questionImage = new AttachmentBuilder(new Buffer.from(questionImageBuffer), { name: "question.png" });

                        quizImage.push(questionImage);
                    }

                    await interaction.editReply({ embeds: [learnEmbed], files: quizImage });

                    const collector = await interaction.channel.createMessageCollector({ filter: message => message.author.id === interaction.user.id && !message.author.bot, time: roundDuration });
                    const cleanRealAnswer = await cleanAnswer(answer);

                    await collector.on("collect", async message => {
                        const userGuess = message.content;

                        await message?.delete();

                        if (userGuess === "stop")
                            isStopped = true;
                        if (userGuess === "skip" || userGuess === "stop")
                            return await collector.stop();

                        const cleanUserAnswer = await cleanAnswer(userGuess);

                        if (cleanUserAnswer === cleanRealAnswer || countryList["alternative-names"][quizType === "flags" ? "countries" : "capitals"]?.[countryCode].includes(cleanUserAnswer) || nerdamer(cleanUserAnswer).eq(cleanRealAnswer)) {
                            points += 1;
                            isCorrect = true;

                            await collector.stop();
                        } else {
                            if (isDeathMatch) {
                                return await endGame();
                            } else {
                                await message.channel.send({ content: "Mauvaise réponse..." }).then(message => {
                                    setTimeout(async () => { message.delete() }, deleteDelay)
                                });
                            }
                        }
                    });

                    await collector.on("end", async () => {
                        if (isStopped)
                            return await endGame();

                        if (!isCorrect) {
                            errors.push(questions[0]);

                            if (isDeathMatch)
                                return await endGame();

                            await interaction.channel.send({ content: `La réponse était **\`${answer}\`** !` }).then(message => {
                                setTimeout(async () => { message.delete() }, deleteDelay)
                            });
                        }

                        if (questions.length !== 0) {
                            await questions.shift();
                            await nextRound(answer);
                        } else {
                            return await endGame();
                        }
                    });
                }

                async function cleanAnswer(answer) {
                    answer = await clean(answer);

                    return answer.replaceAll(" ", "").toLowerCase();
                }

                async function endGame() {
                    const numberErrors = errors.length;
                    let errorList = "";

                    for (let i = 0; i < errors.length; i++) {
                        if (i >= 50) {
                            errorList += "- ...";
                            break;
                        }

                        const errorQuestion = errors[i]?.split("|")[0];
                        const answerQuestion = errors[i]?.split("|")[1];

                        if (quizType === "capitals" || quizType === "kana") {
                            errorList += `- ${errorQuestion} : **${answerQuestion}**\n`;
                        } else if (quizType === "mathematics") {
                            errorList += errorQuestion.includes("x") ? `- ${errorQuestion.replaceAll("*", "\\*")} <=> **${answerQuestion.replaceAll("*", "\\*")}**\n` : `- ${errorQuestion.replaceAll("*", "\\*")} = **${answerQuestion.replaceAll("*", "\\*")}**\n`;
                        } else {
                            errorList += `- [${answerQuestion}](${errorQuestion})\n`;
                        }
                    }

                    await endCollector(interaction.guild.id);

                    const finishedLearnEmbed = new EmbedBuilder()
                        .setColor([255, 85, 0])
                        .setTitle("Fin de la partie !")
                        .setDescription(numberErrors !== 0 || points !== 0 ? `## Tu as eu ${points} bonne(s) réponse(s) !\n\n${numberErrors > 0 ? `❌ Et tu as fait **${numberErrors}** erreur(s) :\n${errorList}` : "Tu as fait un sans-fautes, félicitations !"}` : "Tu n'as pas joué...")
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                    await interaction.editReply({ embeds: [finishedLearnEmbed], files: [] });
                }

                await generateQuestions();
                await nextRound();
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};