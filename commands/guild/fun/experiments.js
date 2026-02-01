const { SlashCommandBuilder, MediaGalleryBuilder, MessageFlags } = require("discord.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Serveur",
    data: new SlashCommandBuilder()
        .setName("experiments")
        .setDescription("Permet de tester des commandes que je ne suis pas sûr d'ajouter officielement.")
        .addSubcommand(subcommand => subcommand
            .setName("random-letters")
            .setDescription("Pour obtenir des lettres aléatoires de l'alphabet... qui dancent !"))

        .addSubcommand(subcommand => subcommand
            .setName("tsukinotoki")
            .setDescription("Une méthode d'encodage personalisée.")
            .addStringOption(option => option
                .setName("action")
                .setDescription("L'action à effectuer, coder ou décoder.")
                .addChoices(
                    { name: "📥 Coder", value: "encode" },
                    { name: "📤 Décoder", value: "decode" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("mode")
                .setDescription("La méthode d'encodage.")
                .addChoices(
                    { name: "💿 Tsukinotoki Original", value: "original" },
                    { name: "📦 Tsukinotoki Compact", value: "compact" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("text")
                .setDescription("Le texte à coder ou décoder.")
                .setRequired(true))),
    async execute(interaction, client) {
        try {
            switch (interaction.options.getSubcommand()) {
                case "random-letters":
                    const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
                    const punctuation = ["exclamation-mark", "question-mark"];
                    const randomFirstLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
                    const randomSecondLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
                    const randomThirdLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
                    const isPunctuation = Math.floor(Math.random() * 3) === 0;
                    const randomFourthLetter = isPunctuation ? punctuation[Math.floor(Math.random() * punctuation.length)] : alphabet[Math.floor(Math.random() * alphabet.length)];

                    const lettersGallery = new MediaGalleryBuilder().addItems(
                        letter => letter
                            .setDescription(`La lettre ${randomFirstLetter.toUpperCase()} qui danse`)
                            .setURL(`https://yunranodatas.toile-libre.org/${randomFirstLetter}.gif`),
                        letter => letter
                            .setDescription(`La lettre ${randomSecondLetter.toUpperCase()} qui danse`)
                            .setURL(`https://yunranodatas.toile-libre.org/${randomSecondLetter}.gif`),
                        letter => letter
                            .setDescription(`La lettre ${randomThirdLetter.toUpperCase()} qui danse`)
                            .setURL(`https://yunranodatas.toile-libre.org/${randomThirdLetter}.gif`),
                        letter => letter
                            .setDescription(`${isPunctuation ? "Le symbole" : "La lettre"} ${isPunctuation ? randomFourthLetter === "question-mark" ? "?" : "!" : randomFourthLetter.toUpperCase()} qui danse`)
                            .setURL(`https://yunranodatas.toile-libre.org/${randomFourthLetter}.gif`));

                    await interaction.reply({ components: [lettersGallery], flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2] });
                    break;

                case "tsukinotoki":
                    const action = interaction.options.getString("action");
                    const mode = interaction.options.getString("mode");
                    const text = interaction.options.getString("text");

                    function tsukinotoki(conversion, mode) {
                        let output = [];
                        let wordSeparator;
                        let letterSeparator;

                        if (mode === "compact") {
                            wordSeparator = "日";
                            letterSeparator = "㊐";
                        } else {
                            wordSeparator = "月";
                            letterSeparator = "㊊";
                        }

                        switch (conversion) {
                            case "encode":
                                text.split(" ").forEach(word => word.split("").map(character => output.push(`${tsukinotokiAlgorithm(character.charCodeAt(0), true, mode)}${letterSeparator}`)) && output.push(wordSeparator));
                                output = output.join("").slice(0, -2).replaceAll(`${letterSeparator}${wordSeparator}`, wordSeparator);
                                break

                            case "decode":
                                text.split(wordSeparator).forEach(word => output.push(tsukinotokiAlgorithm(word.split(""), false, mode)) && output.push(" "));
                                output = output.join("");
                                break
                        }

                        return output;
                    }

                    function tsukinotokiAlgorithm(number, encode, mode) {
                        let units;
                        let letterSeparator;

                        if (mode === "compact") {
                            units = { "㏾": 31, "㏽": 30, "㏼": 29, "㏻": 28, "㏺": 27, "㏹": 26, "㏸": 25, "㏷": 24, "㏶": 23, "㏵": 22, "㏴": 21, "㏳": 20, "㏲": 19, "㏱": 18, "㏰": 17, "㏯": 16, "㏮": 15, "㏭": 14, "㏬": 13, "㏫": 12, "㏪": 11, "㏩": 10, "㏨": 9, "㏧": 8, "㏦": 7, "㏥": 6, "㏤": 5, "㏣": 4, "㏢": 3, "㏡": 2, "㏠": 1 };
                            letterSeparator = "㊐";
                        } else {
                            units = { "㋋": 12, "㋊": 11, "㋉": 10, "㋈": 9, "㋇": 8, "㋆": 7, "㋅": 6, "㋄": 5, "㋃": 4, "㋂": 3, "㋁": 2, "㋀": 1 };
                            letterSeparator = "㊊";
                        }

                        const finalCode = [];
                        let amount = number;

                        if (encode) {
                            let i = 0;

                            while (i < Object.keys(units).length) {
                                while (Object.values(units)[i] <= amount) {
                                    amount -= Object.values(units)[i];
                                    finalCode.push(Object.keys(units)[i]);
                                }

                                i++;
                            }
                        } else {
                            let temp = [];

                            for (let i = 0; i < amount.length + 1; i++) {
                                if (amount[i] === letterSeparator || i === amount.length) {
                                    finalCode.push(String.fromCharCode(temp.reduce((a, b) => a + b, 0)));
                                    temp = [];
                                } else {
                                    temp.push(units[amount[i]]);
                                }
                            }
                        }

                        return finalCode.join("");
                    }

                    const result = tsukinotoki(action, mode);

                    await interaction.reply({ content: result, flags: MessageFlags.Ephemeral });
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};