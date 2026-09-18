const { SlashCommandBuilder, MessageFlags } = require("discord.js");
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
                    { name: "☕ MoE Lofi", value: "moe-lofi" },
                    { name: "🎮 RPGamers Network Game Music Radio", value: "rpgamers" },
                    { name: "👾 Kohina", value: "kohina" },
                    { name: "💮 Gensokyo Radio (幻想郷ラジオ)", value: "gensokyo" },
                    { name: "🎤 Vocaloid-Radio", value: "vocaloid" },
                    { name: "👹 Anime Radio", value: "anime" },
                    { name: "📻 Jet Set Radio Evolution (KFAD)", value: "jet-set-radio" },
                    { name: "🛑 otoDB Radio (potentiellement NSFW)", value: "otodb" })
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("resume")
            .setDescription("Reprends la radio en cours."))

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
                .setMaxValue(1_000)
                .setRequired(true))),
    async execute(interaction, client) {
        try {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });

            switch (interaction.options.getSubcommand()) {
                case "play":
                    const getPlayConnection = getVoiceConnection(interaction.guild.id);

                    if (typeof getPlayConnection !== "undefined")
                        getPlayConnection.destroy();

                    const station = interaction.options.getString("station");
                    let audio;
                    let stationInformations;

                    switch (station) {
                        case "moe-lofi":
                            audio = "https://stream-173.zeno.fm/v5reddyk8rhvv";
                            stationInformations = "☕ MoE Lofi - https://zeno.fm/radio/moe-lofi";
                            break;

                        case "rpgamers":
                            audio = "http://stream.rpgamers.net:8000/rpgn";
                            stationInformations = "🎮 RPGamers Network Game Music Radio - http://www.rpgamers.net/radio";
                            break;

                        case "kohina":
                            audio = "https://player.kohina.com/icecast/stream.opus";
                            stationInformations = "👾 Kohina - https://www.kohina.com";
                            break;

                        case "gensokyo":
                            audio = "https://stream.gensokyoradio.net/3";
                            stationInformations = "💮 Gensokyo Radio (幻想郷ラジオ) - https://gensokyoradio.net";
                            break;

                        case "vocaloid":
                            audio = "https://vocaloid.radioca.st/stream";
                            stationInformations = "🎤 Vocaloid-Radio - https://tunein.com/radio/Vocaloid-Radio-s221579/";
                            break;

                        case "anime":
                            audio = "https://radioanime.radioca.st/;/stream";
                            stationInformations = "👹 Anime Radio - https://www.radio-anime.net";
                            break;

                        case "jet-set-radio":
                            audio = "https://dn720307.ca.archive.org/0/items/00-silva-gunner-dj-professor-k-jet-set-radio-6-30-broadcast-full-loop-jet-set-radio-evolution/00%20-%20SilvaGunner-DJ%20Professor%20K%20-%20JET%20SET%20RADIO%206-30%20BROADCAST%20%28FULL%20LOOP%29%20-%20Jet%20Set%20Radio%20Evolution.mp3";
                            stationInformations = "📻 Jet Set Radio Evolution ([SiIvaGunner](https://www.youtube.com/@SiIvaGunner), King for a Day Tournament) - https://www.youtube.com/watch?v=o51EIC19t6Y";
                            break;

                        case "otodb":
                            audio = "https://radio.otodb.net/main.mp3";
                            stationInformations = "🛑 otoDB Radio ([otoDB](https://otodb.net)) - https://radio.otodb.net";
                            break;
                    }

                    const userVoiceChannelID = interaction.member.voice.channel?.id ?? null;

                    if (userVoiceChannelID === null)
                        return await interaction.editReply({ content: "Mets-toi d'abord dans un salon vocal !" });

                    const connection = joinVoiceChannel({
                        channelId: userVoiceChannelID,
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

                        const resource = createAudioResource(audio, {
                            inputType: StreamType.OggOpus,
                            inlineVolume: true
                        });

                        connection.subscribe(player);

                        setTimeout(() => {
                            player?.play(resource);
                        }, 8_000);

                        const audioReadyInterval = setInterval(() => {
                            player.on(AudioPlayerStatus.Playing, async () => {
                                await interaction.editReply({ content: `### La radio est prête !\n> ${stationInformations}` });

                                clearInterval(audioReadyInterval);
                            });
                        }, 1_000);
                    } catch (error) {
                        await sendError(interaction, client, error);
                    }
                    break;

                case "pause":
                    const getPauseConnection = getVoiceConnection(interaction.guild.id);

                    if (typeof getPauseConnection === "undefined")
                        return await interaction.editReply({ content: "Aucune radio est en cours sur ce serveur !" });

                    getPauseConnection.state.subscription.player.pause();

                    await interaction.editReply({ content: "La radio a bien été arrêtée !" });
                    break;

                case "resume":
                    const getResumeConnection = getVoiceConnection(interaction.guild.id);

                    if (typeof getResumeConnection === "undefined")
                        return await interaction.editReply({ content: "Aucune radio est en cours sur ce serveur !" });

                    getResumeConnection.state.subscription.player.unpause();

                    await interaction.editReply({ content: "La radio a bien été reprise !" });
                    break;

                case "volume":
                    const volume = interaction.options.getInteger("amount");
                    const getVolumeConnection = getVoiceConnection(interaction.guild.id);

                    if (typeof getVolumeConnection === "undefined" || typeof getVolumeConnection.state.subscription.player.state.resource === "undefined")
                        return await interaction.editReply({ content: "Aucune radio est en cours sur ce serveur !" });

                    getVolumeConnection.state.subscription.player.state.resource.volume.setVolume(volume / 100);

                    await interaction.editReply({ content: `Le volume de la radio a bien été mise à ${volume}% !` });
                    break;

                case "stop":
                    const getStopConnection = getVoiceConnection(interaction.guild.id);

                    if (typeof getStopConnection === "undefined")
                        return await interaction.editReply({ content: "Aucune radio est en cours sur ce serveur !" });

                    getStopConnection.destroy();

                    await interaction.editReply({ content: "La radio a bien été arrêtée !" });
                    break;
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};