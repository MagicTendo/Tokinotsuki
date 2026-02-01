const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Utilitaire",
    data: new SlashCommandBuilder()
        .setName("encode-text")
        .setDescription("Pour coder ou décoder du texte, pratique pour la stéganographie !")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
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
                { name: "💿 ASCII", value: "ascii" },
                { name: "💾 Binaire", value: "binary" },
                { name: "🎨 Hexadécimal", value: "hex" },
                { name: "📦 Base64", value: "base64" },
                { name: "🌊 Morse", value: "morse" },
                { name: "🦯 Braille (GS8)", value: "braille" },
                { name: "📱 Multi-tap", value: "multi-tap" },
                { name: "🧬 Code génétique (ADN)", value: "genetic" },
                { name: "➕ Decabit", value: "decabit" })
            .setRequired(true))
        .addStringOption(option => option
            .setName("text")
            .setDescription("Le texte à coder ou décoder.")
            .setRequired(true)),
    async execute(interaction, client) {
        try {
            const action = interaction.options.getString("action");
            const mode = interaction.options.getString("mode");
            const text = interaction.options.getString("text");
            const encode = action === "encode";
            let secretText;

            switch (mode) {
                case "ascii":
                    secretText = encode ? text.split("").map(character => character.charCodeAt(0)).join(" ") : text.split(" ").map(character => String.fromCharCode(character)).join("");
                    break;

                case "binary":
                    secretText = encode ? text.split("").map((character) => character.charCodeAt(0).toString(2)).join(" ") : text.split(" ").map(character => String.fromCharCode(parseInt(character, 2))).join("");
                    break;

                case "hex":
                    secretText = encode ? new Buffer.from(text).toString("hex") : new Buffer.from(text, "hex").toString("utf-8");
                    break;

                case "base64":
                    secretText = encode ? new Buffer.from(text).toString("base64") : new Buffer.from(text, "base64").toString("utf-8");
                    break;

                case "morse":
                    const morseCodes = { "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".", "F": "..-.", "G": "--.", "H": "....", "I": "..", "J": ".---", "K": "-.-", "L": ".-..", "M": "--", "N": "-.", "O": "---", "P": ".--.", "Q": "--.-", "R": ".-.", "S": "...", "T": "-", "U": "..-", "V": "...-", "W": ".--", "X": "-..-", "Y": "-.--", "Z": "--..", "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.", "0": "-----", ",": "--..--", "?": "..--..", ";": "-.-.-.", ":": "---...", "-": "-....-", "/": "-..-.", "'": ".----.", "!": "-.-.--", " ": " / ", " ": "/" };
                    secretText = "";

                    if (encode) {
                        for (let i = 0; i < text.length; i++) {
                            secretText += ` ${morseCodes[text[i].toUpperCase()] ?? "`?`"}`;
                        }
                    } else {
                        let splittedText = text.split(" ");

                        for (let i = 0; i < splittedText.length; i++) {
                            secretText += Object.keys(morseCodes).find(key => morseCodes[key] === splittedText[i]) ?? "`?`";
                        }
                    }
                    break;

                case "braille":
                    const brailleCodes = { "a": "⠁", "b": "⠃", "c": "⠉", "d": "⠙", "e": "⠑", "f": "⠋", "g": "⠛", "h": "⠓", "i": "⠊", "j": "⠚", "k": "⠅", "l": "⠇", "m": "⠍", "n": "⠝", "o": "⠕", "p": "⠏", "q": "⠟", "r": "⠗", "s": "⠎", "t": "⠞", "u": "⠥", "v": "⠧", "w": "⠺", "x": "⠭", "y": "⠽", "z": "⠵", "A": "⡁", "B": "⡃", "C": "⡉", "D": "⡙", "E": "⡑", "F": "⡋", "G": "⡛", "H": "⡓", "I": "⡊", "J": "⡚", "K": "⡅", "L": "⡇", "M": "⡍", "N": "⡝", "O": "⡕", "P": "⡏", "Q": "⡟", "R": "⡗", "S": "⡎", "T": "⡞", "U": "⡥", "V": "⡧", "W": "⡺", "X": "⡭", "Y": "⡽", "Z": "⡵", "à": "⠁", "é": "⠑", "è": "⠑", "ê": "⠑", "ë": "⠑", "ç": "⠉", "ô": "⠕", "ù": "⠥", "À": "⡁", "É": "⡑", "È": "⡑", "Ê": "⡑", "Ë": "⡑", "Ç": "⡉", "Ô": "⡕", "Ù": "⡥", "1": "⠡", "2": "⠣", "3": "⠩", "4": "⠹", "5": "⠱", "6": "⠫", "7": "⠻", "8": "⠳", "9": "⠪", "0": "⠬", "+": "⡒", "-": "⠤", "*": "⠔", "/": "⣌", "²": "⠣", "=": "⣶", ".": "⠲", ",": "⠂", ":": "⠒", ";": "⠆", "!": "⠖", "?": "⠶", "\\": "⣡", "_": "⢂", "~": "⣠", "|": "⢳", "&": "⠯", "\"": "⣒", "'": "⠄", "#": "⠼", "(": "⢆", ")": "⡘", "[": "⣦", "]": "⣴", "{": "⣷", "}": "⣾", "$": "⡼", "€": "", "%": "⠞", " ": "⠀" };
                    secretText = "";

                    for (let i = 0; i < text.length; i++) {
                        if (encode) {
                            secretText += brailleCodes[text[i].toLowerCase()] ?? "`?`";
                        } else {
                            secretText += Object.keys(brailleCodes).find(key => brailleCodes[key] === text[i]) ?? "`?`";
                        }
                    }
                    break;

                case "multi-tap":
                    const multiTapCodes = { "A": "2", "B": "22", "C": "222", "D": "3", "E": "33", "F": "333", "G": "4", "H": "44", "I": "444", "J": "5", "K": "55", "L": "555", "M": "6", "N": "66", "O": "666", "P": "7", "Q": "77", "R": "777", "S": "7777", "T": "8", "U": "88", "V": "888", "W": "9", "X": "99", "Y": "999", "Z": "9999", " ": "0" };
                    secretText = "";

                    if (encode) {
                        for (let i = 0; i < text.length; i++) {
                            secretText += ` ${multiTapCodes[text[i].toUpperCase()] ?? "`?`"}`;
                        }
                    } else {
                        let splittedText = text.split(" ");

                        for (let i = 0; i < splittedText.length; i++) {
                            secretText += Object.keys(multiTapCodes).find(key => multiTapCodes[key] === splittedText[i]) ?? "`?`";
                        }
                    }
                    break;

                case "genetic":
                    const adnCodes = { "\\*": ["TAA"], "A": ["GCT", "GCC", "GCA", "GCG"], "B": ["GAT"], "C": ["TGT", "TGC"], "D": ["GAC"], "E": ["GAA"], "F": ["TTT", "TTC"], "G": ["GGT", "GGC", "GGA", "GGG"], "H": ["CAT", "CAC"], "I": ["ATT", "ATC", "ATA"], "J": ["TAA"], "K": ["AAA", "AAG"], "L": ["TTA", "TTG", "CTT", "CTC", "CTA", "CTG"], "M": ["ATG"], "N": ["AAT", "AAC"], "O": ["TAA"], "P": ["CCT", "CCC", "CCA", "CCG"], "Q": ["CAA", "CAG"], "R": ["CGT", "CGC", "CGA", "CGG", "AGA", "AGG"], "S": ["TCT", "TCC", "TCA", "TCG", "AGT", "AGC"], "T": ["ACT", "ACC", "ACA", "ACG"], "U": ["TAA"], "V": ["GTT", "GTC", "GTA", "GTG"], "W": ["TGG"], "X": ["TAA"], "Y": ["TAT", "TAC"], "Z": ["GAG"], " ": [" "] };
                    secretText = "";

                    if (encode) {
                        for (let i = 0; i < text.length; i++) {
                            if (adnCodes.hasOwnProperty(text[i].toUpperCase())) {
                                secretText += adnCodes[text[i].toUpperCase()][Math.floor(Math.random() * adnCodes[text[i].toUpperCase()].length)];
                            } else {
                                secretText += Object.values(adnCodes)[0];
                            }
                        }
                    } else {
                        const splittedText = text.split(" ");

                        for (let i = 0; i < splittedText.length; i++) {
                            const genes = splittedText[i].match(/.{1,3}/g);

                            for (let j = 0; j < genes.length; j++) {
                                secretText += Object.keys(adnCodes).find(key => adnCodes[key].includes(genes[j])) ?? "`?`";
                            }

                            secretText += " ";
                        }
                    }
                    break;

                case "decabit":
                    const decabitCodes = { "0": "--+-+++-+-", "1": "+--+++--+-", "2": "+--++-+-+-", "3": "+--+-++-+-", "4": "----+++-++", "5": "++--+++---", "6": "++--++--+-", "7": "++--+-+-+-", "8": "++---++-+-", "9": "---++++-+-", "10": "+-+-+++---", "11": "+-+-+-+-+-", "12": "+-+--++-+-", "13": "+---++-++-", "14": "+---++--++", "15": "--+++-++--", "16": "---++-+++-", "17": "+---+-++-+", "18": "+--++--+-+", "19": "+--++-+--+", "20": "+-+++--+--", "21": "+--+++-+--", "22": "++--+-++--", "23": "-+-++-++--", "24": "+--++--++-", "25": "+-+++-+---", "26": "++-+--++--", "27": "+-+-+-++--", "28": "+--+-+++--", "29": "+--+--++-+", "30": "+-++-++---", "31": "+-++-+-+--", "32": "+-+-++-+--", "33": "+---++++--", "34": "+-+--+-++-", "35": "+++--++---", "36": "+++--+-+--", "37": "+++---++--", "38": "++---+++--", "39": "--+-++++--", "40": "++--++-+--", "41": "-+-+-+-++-", "42": "++----+++-", "43": "+----+-+++", "44": "++---+-+-+", "45": "++-+-+-+--", "46": "++-+-+--+-", "47": "+++----++-", "48": "++--+--++-", "49": "+--+-+-++-", "50": "++++----+-", "51": "++-++---+-", "52": "+-+++---+-", "53": "-++++---+-", "54": "+-+-+---++", "55": "+++-++----", "56": "+++-+-+---", "57": "+-+-+--++-", "58": "-++-+--++-", "59": "+++-+----+", "60": "++++-+----", "61": "-+++-++---", "62": "-+-+-++-+-", "63": "++---++--+", "64": "++-+--+--+", "65": "++-+++----", "66": "++++--+---", "67": "+--++++---", "68": "-+-++++---", "69": "++-+--+-+-", "70": "-++---+++-", "71": "+---+-+++-", "72": "--+-+-+++-", "73": "+----++++-", "74": "--+--++++-", "75": "+++---+-+-", "76": "+-++---++-", "77": "+--+--+++-", "78": "--++--+++-", "79": "+-+---+-++", "80": "-+++--+-+-", "81": "-+-++-+-+-", "82": "-+++---++-", "83": "-+-++--++-", "84": "-+---++++-", "85": "-++++--+--", "86": "-++-++-+--", "87": "--++++-+--", "88": "--++-+++--", "89": "--++-+-++-", "90": "+-++++----", "91": "--++++--+-", "92": "--++-++-+-", "93": "+--+-+--++", "94": "+-++----++", "95": "-+-+++--+-", "96": "-++-+-+-+-", "97": "-+--++-++-", "98": "---+++-++-", "99": "-+--+-+++-", "100": "+---+++-+-", "101": "-+--+++-+-", "102": "+-+-++--+-", "103": "+--++-++--", "104": "++-++--+--", "105": "+-++--++--", "106": "+-+--+++--", "107": "-++--+++--", "108": "++---+-++-", "109": "++-+---++-", "110": "+++-+---+-", "111": "+++-+--+--", "112": "++-+-++---", "113": "++-++-+---", "114": "+-+---+++-", "115": "+-++--+-+-", "116": "-+-+--+++-", "117": "-+++-+-+--", "118": "+-++-+--+-", "119": "-++-+++---", "120": "+++--+--+-", "121": "+++++-----", "122": "-+++++----", "123": "--+++++---", "124": "---+++++--", "125": "----+++++-", "126": "++++++++++" };
                    secretText = "";

                    if (encode) {
                        for (let i = 0; i < text.length; i++) {
                            secretText += ` ${decabitCodes[text[i].charCodeAt(0)] ?? "`?`"}`;
                        }
                    } else {
                        const splittedText = text.split(" ");

                        for (let i = 0; i < splittedText.length; i++) {
                            const character = Object.keys(decabitCodes).find(key => decabitCodes[key] === splittedText[i]);

                            if (typeof character === "undefined") {
                                secretText += "`?`";
                            } else {
                                secretText += String.fromCharCode(parseInt(character));
                            }
                        }
                    }
                    break;
            }

            await interaction.reply({ content: (secretText.substring(0, 1997) + (secretText.length > 1997 ? "..." : "")).replaceAll("?``", "? "), flags: MessageFlags.Ephemeral });
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};