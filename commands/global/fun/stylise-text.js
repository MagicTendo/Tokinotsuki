const { SlashCommandBuilder, AttachmentBuilder, MessageFlags } = require("discord.js");
const Uwuifier = require("uwuifier").default;
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Fun",
    data: new SlashCommandBuilder()
        .setName("stylise-text")
        .setDescription("Modifie l'aspect d'un texte dans divers formats.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addStringOption(option => option
            .setName("style")
            .setDescription("Choisis le style que tu veux pour ton texte !")
            .addChoices(
                { name: "🔄️ dᴉ|Ⅎ", value: "flip" },
                { name: "🔙 esreveR", value: "reverse" },
                { name: "👏 C👏l👏a👏p", value: "clap" },
                { name: "✨ A e s t h e t i c", value: "aesthetic" },
                { name: "➖ LLaarrggee", value: "large" },
                { name: "🫠 mOcK", value: "mock" },
                { name: "🌸 UwUify", value: "uwuify" },
                { name: "🔢 337 5P34K", value: "leet-speak" },
                { name: "👺 Z̟̻̣̰̠̟ͩ͆ͤa̞̪ͩͤͩ̿l̞̙̱ͬg̴̱̰̰̥̐̓ͮͦͯ͜ỏ̥̻̞͈̞͈̔ͮ̑͆̑", value: "zalgo" })
            .setRequired(true))
        .addStringOption(option => option
            .setName("text")
            .setDescription("Le texte à styliser.")
            .setRequired(true)),
    async execute(interaction, client) {
        try {
            const style = interaction.options.getString("style");
            const text = interaction.options.getString("text");
            let processedText;

            switch (style) {
                case "flip":
                    const flippedCharacters = { "a": "ɐ", "e": "ǝ", "r": "ɹ", "t": "ʇ", "y": "ʎ", "u": "n", "i": "ᴉ", "p": "d", "q": "b", "d": "p", "f": "ɟ", "g": "ƃ", "h": "ɥ", "j": "ɾ", "k": "ʞ", "l": "l", "m": "ɯ", "w": "ʍ", "c": "ɔ", "v": "ʌ", "b": "q", "n": "u", "A": "∀", "E": "Ǝ", "R": "ꓤ", "T": "ꓕ", "Y": "⅄", "U": "∩", "P": "Ԁ", "Q": "Ꝺ", "D": "ᗡ", "F": "Ⅎ", "G": "⅁", "J": "ᒋ", "K": "ꓘ", "L": "⅂", "W": "M", "C": "Ↄ", "V": "ᴧ", "B": "ꓭ", "à": "ɐ̖", "ā": "ɐ̱", "ç": "ɔ̉", "é": "ǝ̖", "è": "ǝ̖", "ê": "ǝ̬", "ë": "ǝ̤", "ē": "ǝ̱", "ī": "ᴉ̱", "ñ": "ṵ", "ô": "o̬", "ō": "o̱", "š": "s̭", "ù": "∩̖", "ú": "∩̗", "û": "∩̬", "ū": "∩̱", "À": "Ɐ̖̀", "Ā": "Ɐ̱", "Ç": "Ͻ̉", "É": "Ǝ̖", "È": "Ǝ̖", "Ê": "Ǝ̬", "Ë": "Ǝ̤", "Ē": "Ǝ̱", "I": "I̱", "Ñ": "N̰", "Ô": "O̬", "Ō": "O̱", "Š": "S̭", "Ù": "∩̖", "Ú": "∩̗", "Û": "∩̬", "Ū": "∩̱", "1": "Ɩ", "2": "ᘔ", "3": "Ɛ", "4": "ᔭ", "5": "ϛ", "6": "9", "7": "Ɫ", "8": "8", "9": "6", ".": "˙", ",": "\\`", "?": "¿", "!": "¡", "&": "⅋", "\"": "„", "'": ",", "_": "‾", "~": "∽", "`": "⸜", "⸢": "⸣", "⸣": "⸢", "⸤": "⸥", "⸥": "⸤", "「": "」", "」": "「", "€": "℈" };
                    const reversedText = text.split("").reverse();
                    processedText = "";

                    for (let i = 0; i < reversedText.length; i++) {
                        processedText += flippedCharacters[reversedText[i]] ?? reversedText[i];
                    }
                    break;

                case "reverse":
                    processedText = text.split("").reverse().join("");
                    break;

                case "clap":
                    processedText = text.split("").join("👏");
                    break;

                case "aesthetic":
                    processedText = text.split("").join(" ");
                    break;

                case "large":
                    processedText = "";

                    for (let i = 0; i < text.length; i++) {
                        processedText += text[i].repeat(2);
                    }
                    break;

                case "mock":
                    processedText = text.split("").map((character, i) => i % 2 == 0 ? character.toLowerCase() : character.toUpperCase()).join("");
                    break;

                case "uwuify":
                    const uwuifier = new Uwuifier();

                    processedText = uwuifier.uwuifySentence(text);
                    break;

                case "leet-speak":
                    const letterToNumber = { "A": "4", "E": "3", "T": "7", "I": "1", "O": "0", "S": "5", "G": "6", "L": "1", "B": "8" };
                    processedText = "";

                    for (let i = 0; i < text.length; i++) {
                        processedText += letterToNumber[text[i].toUpperCase()] ?? text[i].toUpperCase();
                    }
                    break;

                case "zalgo":
                    const zalgo = ["̉", "", "̐", "", "̑", "", "̓", "̔", "", "̽", "̾", "̿", "͆", "͋", "͒", "͝", "͡", "ͣ", "ͤ", "ͥ", "ͦ", "ͧ", "ͨ", "ͩ", "ͪ", "ͫ", "ͬ", "ͭ", "ͮ", "ͯ", "̘", "̙", "̝", "̞", "̟", "̠", "̣", "̤", "̥", "̪", "̬", "̮", "̯", "̰", "̱", "̼", "ͅ", "͈", "͜", "͢", "̴", "̵", "̶", "̻", "̼"];
                    processedText = "";

                    for (let i = 0; i < text.length; i++) {
                        const randomInterations = Math.floor(Math.random() * 9) + 5;
                        let character = text[i];

                        for (let j = 0; j < randomInterations; j++) {
                            if (character === " ") break;

                            const randomZalgoIndex = Math.floor(Math.random() * zalgo.length);

                            character += zalgo[randomZalgoIndex];
                        }

                        processedText += character;
                    }

                    processedText = `\n\n${processedText}\n\n`;

                    const zalgoFile = new AttachmentBuilder(new Buffer.from(processedText), { name: "zalgo.txt" });

                    return await interaction.reply({ content: "-# *Oui c'est un fichier texte, Discord limite et filtre le zalgo, mais pas quand c'est dans un fichier !*", files: [zalgoFile], flags: MessageFlags.Ephemeral });
                    break;
            }

            await interaction.reply({ content: processedText, flags: MessageFlags.Ephemeral });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};