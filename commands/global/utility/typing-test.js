const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Utilitaire",
    data: new SlashCommandBuilder()
        .setName("typing-test")
        .setDescription("Permet d'évaluer ta rapidité à écrire en WPM (word per minute) !")
        .setIntegrationTypes([0])
        .setContexts([0, 1, 2]),
    async execute(interaction, client) {
        try {
            const words = ["air", "baka", "banque", "bot", "champignon", "clavier", "code", "cookie", "crash", "cuisiner", "dessin", "dictionnaire", "discord", "discussion", "dormir", "eau", "feu", "heure", "horloge", "inutile", "isokitsu", "jeux", "kyuju", "lettre", "livre", "magasin", "manger", "minerai", "minute", "mot", "musique", "oiseau", "omelette", "orange", "phrase", "ping", "poisson", "renard", "score", "seconde", "social", "temps", "tempura", "terre", "test", "texte", "toki", "tokinotsuki"];
            let ended = false;
            let sentence = [];

            for (let i = 0; i < 15; i++) {
                const randomWordIndex = Math.floor(Math.random() * words.length);

                sentence.push(words[randomWordIndex]);
                words.splice(randomWordIndex, 1);
            }

            const countdownStart = Math.round(Date.now() / 1_000) + 6;
            sentence = sentence.join(" ");

            await interaction.reply({ content: `Le test va commencer dans <t:${countdownStart}:R> ! Tu vas devoir recopier les mots que je vais t'envoyer !` });

            setTimeout(async () => {
                const typingCollector = await interaction.channel.createMessageCollector({ filter: message => message.author.id === interaction.user.id, time: 60_000 });

                await interaction.editReply({ content: "Le test a commencé !" });
                await interaction.followUp({ content: sentence });

                const startTime = Date.now();

                typingCollector.on("collect", async message => {
                    const endTime = Date.now();
                    const time = (endTime - startTime) / 1_000;
                    const timeMinutes = time / 60;
                    const sentenceWords = sentence.split(" ");
                    const messageWords = message.content.split(" ");
                    let errors = 0;
                    ended = true;

                    for (let i = 0; i < message.content.length; i++) {
                        if (messageWords[i] !== sentenceWords[i])
                            errors++;
                    }

                    errors += Math.max(0, sentenceWords.length - messageWords.length);

                    if (errors <= sentenceWords.length / 2) {
                        const cpm = Math.round(message.content.length / timeMinutes);
                        const characterBasedGrossWPM = Math.round(message.content.length / 5 / timeMinutes);
                        const characterBasedNetWPM = Math.round(characterBasedGrossWPM - (errors / timeMinutes));
                        const accuracy = Math.round((characterBasedNetWPM / characterBasedGrossWPM) * 100);

                        const typingEmbed = new EmbedBuilder()
                            .setColor([255, 85, 0])
                            .setTitle("Résultats")
                            .setDescription(`🔠 **CPM** : ${cpm}\n⌨️ **Gross WPM** : ${characterBasedGrossWPM}\n💻 **Net WPM** : ${characterBasedNetWPM}\n⏱️ **Temps** : ${Math.round(timeMinutes * 60)} secondes\n❌ **Erreurs** : ${errors}\n🎯 **Précision** : ${accuracy}%`)
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64, dynamic: true }) });

                        await message.reply({ embeds: [typingEmbed] });
                    } else {
                        await message.reply({ content: "Tu as fait trop d'erreurs, réessaye !" });
                    }

                    await typingCollector.stop();
                });

                typingCollector.on("end", async () => {
                    if (!ended)
                        await interaction.followUp({ content: "Tu as pris trop de temps, réessaye !" });
                });
            }, 5_000);
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};