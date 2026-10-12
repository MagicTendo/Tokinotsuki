const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const { joinVoiceChannel, entersState, VoiceConnectionStatus, createAudioPlayer, NoSubscriberBehavior, createAudioResource, StreamType, AudioPlayerStatus, getVoiceConnection } = require("@discordjs/voice");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Musique",
    data: new SlashCommandBuilder()
        .setName("radio")
        .setDescription("Pour jouer de la musique dans un salon vocal via des radios.")
        .setIntegrationTypes([0])
        .setContexts([0])
        .addSubcommand(subcommand => subcommand
            .setName("pause")
            .setDescription("Met en pause la radio en cours."))

        .addSubcommand(subcommand => subcommand
            .setName("play")
            .setDescription("Joue de la musique dans un salon vocal en utilisant des radios !")
            .addStringOption(option => option
                .setName("station")
                .setDescription("Choisis la station qui définira l'ambiance de la radio.")
                .addChoices(
                    { name: "👹 Anime Radio", value: "anime" },
                    { name: "💮 Gensokyo Radio (幻想郷ラジオ)", value: "gensokyo" },
                    { name: "📻 Jet Set Radio Evolution (KFAD)", value: "jet-set-radio" },
                    { name: "👾 Kohina", value: "kohina" },
                    { name: "☕ MoE Lofi", value: "moe-lofi" },
                    { name: "🛑 otoDB Radio (potentiellement NSFW)", value: "otodb" },
                    { name: "🎮 RPGamers Network Game Music Radio", value: "rpgamers" },
                    { name: "🎤 Vocaloid-Radio", value: "vocaloid" })
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("resume")
            .setDescription("Reprends la radio en cours."))

        .addSubcommand(subcommand => subcommand
            .setName("status")
            .setDescription("Affiche des informations sur la radio en cours."))

        .addSubcommand(subcommand => subcommand
            .setName("stop")
            .setDescription("Arrête la radio en cours."))

        .addSubcommand(subcommand => subcommand
            .setName("volume")
            .setDescription("Ajuste le volume de la radio en cours.")
            .addIntegerOption(option => option
                .setName("amount")
                .setDescription("Choisis le volume en pourcentage.")
                .setMinValue(0)
                .setMaxValue(150)
                .setRequired(true))),
    async execute(interaction, client) {
        try {
            const radioAction = interaction.options.getSubcommand();
            const voiceChannel = client.channels.cache?.get(interaction.member.voice.channel?.id);
            const userName = interaction.member?.nickname ?? interaction.member?.nick ?? interaction.user.nickname ?? interaction.user.globalName ?? interaction.user.username;

            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

            if (voiceChannel) {
                const getConnection = getVoiceConnection(interaction.guild.id);

                if (radioAction === "play" || (getConnection && getConnection.state.subscription.player.state.resource)) {
                    const stations = {
                        "anime": {
                            "name": "👹 Anime Radio",
                            "credit": "https://www.radio-anime.net",
                            "url": "https://radioanime.radioca.st/;/stream"
                        },
                        "gensokyo": {
                            "name": "💮 Gensokyo Radio (幻想郷ラジオ)",
                            "credit": "https://gensokyoradio.net",
                            "url": "https://stream.gensokyoradio.net/3"
                        },
                        "jet-set-radio": {
                            "name": "📻 Jet Set Radio Evolution ([SiIvaGunner](<https://www.youtube.com/@SiIvaGunner>), King for a Day Tournament)",
                            "credit": "https://www.youtube.com/watch?v=o51EIC19t6Y",
                            "url": "https://dn720307.ca.archive.org/0/items/00-silva-gunner-dj-professor-k-jet-set-radio-6-30-broadcast-full-loop-jet-set-radio-evolution/00%20-%20SilvaGunner-DJ%20Professor%20K%20-%20JET%20SET%20RADIO%206-30%20BROADCAST%20%28FULL%20LOOP%29%20-%20Jet%20Set%20Radio%20Evolution.mp3"
                        },
                        "kohina": {
                            "name": "👾 Kohina",
                            "credit": "https://www.kohina.com",
                            "url": "https://player.kohina.com/icecast/stream.opus"
                        },
                        "moe-lofi": {
                            "name": "☕ MoE Lofi",
                            "credit": "https://zeno.fm/radio/moe-lofi",
                            "url": "https://stream-173.zeno.fm/v5reddyk8rhvv"
                        },
                        "otodb": {
                            "name": "🛑 otoDB Radio ([otoDB](<https://otodb.net>))",
                            "credit": "https://radio.otodb.net",
                            "url": "https://radio.otodb.net/main.mp3"
                        },
                        "rpgamers": {
                            "name": "🎮 RPGamers Network Game Music Radio",
                            "credit": "http://www.rpgamers.net/radio",
                            "url": "http://stream.rpgamers.net:8000/rpgn"
                        },
                        "vocaloid": {
                            "name": "🎤 Vocaloid-Radio",
                            "credit": "https://tunein.com/radio/Vocaloid-Radio-s221579/",
                            "url": "https://vocaloid.radioca.st/stream"
                        }
                    };

                    switch (radioAction) {
                        case "play":
                            const lastVolume = getConnection?.state.subscription.player.state.resource.volume.volume ?? 0.25;

                            if (typeof getConnection !== "undefined")
                                getConnection.destroy();

                            const station = interaction.options.getString("station");
                            const stationURL = stations[station]["url"];
                            const stationName = stations[station]["name"];
                            const stationCredit = stations[station]["credit"];

                            const connection = joinVoiceChannel({
                                channelId: voiceChannel.id,
                                guildId: interaction.guild.id,
                                selfMute: false,
                                selfDeaf: true,
                                adapterCreator: interaction.guild.voiceAdapterCreator
                            });

                            try {
                                await entersState(connection, VoiceConnectionStatus.Ready, 30_000);

                                const player = createAudioPlayer({
                                    behaviors: {
                                        noSubscriber: NoSubscriberBehavior.Play
                                    }
                                });

                                const resource = createAudioResource(stationURL, {
                                    inputType: StreamType.OggOpus,
                                    inlineVolume: true,
                                    metadata: {
                                        "stationName": stationName
                                    }
                                });

                                connection.subscribe(player);
                                player.play(resource);

                                player.on(AudioPlayerStatus.Playing, async () => {
                                    player.state.resource.volume.setVolume(lastVolume);

                                    await voiceChannel.send({ content: `> La radio de **${userName}** est prête !\n> **${stationName}** - ${stationCredit}` });
                                    await interaction.editReply({ content: "✅ La radio a bien commencée (cela peut prendre un peu de temps avant que la musique arrive) !" });
                                });
                            } catch (error) {
                                await sendError(interaction, client, error);
                            }
                            break;

                        case "pause":
                            getConnection.state.subscription.player.pause();

                            await voiceChannel.send({ content: `> La radio a bien été mise en pause par **${userName}** !` });
                            await interaction.editReply({ content: "✅ La radio a bien été mise en pause !" });
                            break;

                        case "resume":
                            getConnection.state.subscription.player.unpause();

                            await voiceChannel.send({ content: `> La radio a bien été reprise par **${userName}** !` });
                            await interaction.editReply({ content: "✅ La radio a bien été reprise !" });
                            break;

                        case "status":
                            const radio = getConnection.state.subscription.player.state.resource;

                            const radioStatus = new EmbedBuilder()
                                .setColor([255, 85, 0])
                                .setDescription(`### Status de la radio\n\n📡 **Station** : ${radio.metadata.stationName}\n⏯️ **État** : ${radio.audioPlayer.state.status === "playing" ? "En cours" : "En pause"}\n🔊 **Volume** : ${radio.volume.volume * 100}%`)
                                .setTimestamp()
                                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                            await interaction.editReply({ embeds: [radioStatus] });
                            break;

                        case "stop":
                            getConnection.destroy();

                            await voiceChannel.send({ content: `> La radio a bien été arrêtée par **${userName}** !` });
                            await interaction.editReply({ content: "✅ La radio a bien été arrêtée !" });
                            break;

                        case "volume":
                            const volume = interaction.options.getInteger("amount");

                            getConnection.state.subscription.player.state.resource.volume.setVolume(volume / 100);

                            await voiceChannel.send({ content: `> Le volume de la radio a bien été mise à **${volume}%** par **${userName}** !` });
                            await interaction.editReply({ content: "✅ Le volume a bien été changé !" });
                            break;
                    }
                } else {
                    await interaction.editReply({ content: "❌ Aucune radio n'est en cours sur ce serveur !" });
                }
            } else {
                await interaction.editReply({ content: "❌ Mets-toi d'abord dans un salon vocal !" });
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};