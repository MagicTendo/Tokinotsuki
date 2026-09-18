const { ActivityType, PresenceUpdateStatus } = require("discord.js");
const { CronJob } = require("cron");
const { exec } = require("child_process");
const { readFileSync, writeFileSync } = require("fs");
const Parser = require("rss-parser");
const { keyvUsers, getValue } = require("../tools/database.js");
const { sendCriticalError, sendLog } = require("../tools/error-catcher.js");
const { getRandomStatus } = require("../tools/statuses.js");

const parser = new Parser();

module.exports = {
    name: "clientReady",
    once: true,
    async execute(client) {
        async function setRandomStatus() {
            const randomActivity = getRandomStatus(client);

            await client.user.setPresence({
                activities: [{
                    type: randomActivity.type,
                    name: randomActivity.activity,
                    state: randomActivity.type === ActivityType.Custom ? randomActivity.activity : "(ﾉ≧ヮ≦)ﾉ*･ﾟ✧　時の月～～～～～～～～～",
                    url: "https://twitch.tv/bakataida"
                }],
                status: PresenceUpdateStatus.Online
            });
        }

        async function setupSocialMediaNotifications() {
            console.log(`\n\x1b[30m➔  Startind to fetch RSS feeds... 📶\x1b[0m`);

            const socialMediaRoutes = {
                "youtube-bakataida": "https://www.youtube.com/feeds/videos.xml?channel_id=UCIyeTq7DcQlJUIP8CKf1zOw",
                "youtube-otomadan": "https://www.youtube.com/feeds/videos.xml?channel_id=UCDwOADtlYqiOnk5bw9ODaJw",
                "youtube-vowod": "https://www.youtube.com/feeds/videos.xml?channel_id=UC4lxauFU0Ayb2uDsJJ4LnnA",
                "youtube-team-pik": "https://www.youtube.com/feeds/videos.xml?channel_id=UCWcEymGkHNF73QM9KbzS_7w",
                "youtube-yunayunori": "https://www.youtube.com/feeds/videos.xml?channel_id=UCYMc2Rt2ZplrPS7dwLMP8AQ",
                "youtube-olivier": "https://www.youtube.com/feeds/videos.xml?channel_id=UCnNS9mYZhSspxC9ejyHIBCw",
                "twitch": "https://twitchrss.com/feeds/?username=bakataida&feed=streams",
                "instagram": "https://rss.bloat.cat/?action=display&bridge=InstagramBridge&context=Username&u=bakataida&media_type=all&format=Atom",
                "pixiv": "https://rss-bridge.lewd.tech/?action=display&bridge=PixivBridge&context=User&userid=87601725&posts=1&mode=illustrations%2F&format=Atom",
                "bluesky": "https://bsky.app/profile/did:plc:5xp53iakukfbfxdpgftptggr/rss",
                "bandcamp": "http://wtf.roflcopter.fr/rss-bridge/?action=display&bridge=BandcampBridge&context=By+band&band=bakataida&type=releases&limit=1&format=Atom",
                "github": "https://github.com/MagicTendo.atom"
            };

            const socialMediaAlerts = {
                "youtube": "## <@&1028062134292185158> Une nouvelle vidéo est sortie sur [CHANNEL_NAME] !",
                "twitch": "## <@&1467462732281413684> BakaTaida vient de commencer un nouveau live !",
                "instagram": "## <@&1538630700700536922> BakaTaida vient de poster un nouveau dessin sur Instagram !",
                "pixiv": "## <@&1538630720132489317> BakaTaida vient de poster un nouveau dessin sur pixiv !",
                "bluesky": "## <@&1467463259664941160> BakaTaida vient de poster un nouveau dessin sur Bluesky !",
                "bandcamp": "## <@&1538630594391707718> BakaTaida vient de publier un nouvel album sur Bandcamp !",
                "github": "## <@&1548106606451892296> BakaTaida vient de [ACTION] [REPOSITORY] !"
            };

            for (let i = 0; i < Object.keys(socialMediaRoutes).length; i++) {
                const socialMediaID = Object.keys(socialMediaRoutes)[i];
                const socialMediaRoute = socialMediaRoutes[socialMediaID];

                const socialMediaNotificationJob = new CronJob("*/20 * * * *", async () => {
                    const socialMediaFeed = await parser.parseURL(socialMediaRoute);
                    const socialMediaLastUpdates = readFileSync("./json/social-media-last-updates.json", "utf-8");
                    const socialMediaLastUpdateList = JSON.parse(socialMediaLastUpdates);

                    if (socialMediaFeed.items.length > 0) {
                        const socialMediaLastPublicationDateRaw = socialMediaFeed.items[0]?.pubDate ?? socialMediaFeed.items[0]?.published ?? socialMediaFeed.items[0]?.date_modified;
                        const socialMediaLastPublicationDate = new Date(socialMediaLastPublicationDateRaw).getTime();

                        if (socialMediaLastPublicationDate > socialMediaLastUpdateList[socialMediaID]) {
                            const socialMediaTitleTag = socialMediaFeed?.title;
                            const postTitle = socialMediaFeed.items[0]?.title;
                            const postLink = socialMediaFeed.items[0]?.link ?? socialMediaFeed.items[0]?.url;

                            if (!socialMediaTitleTag.includes("has stopped streaming") && !postTitle?.includes("Bridge returned error") && postLink !== socialMediaRoute) {
                                const githubRepositoryName = postTitle?.split(" ")?.[2];
                                const socialMediaChannelLink = socialMediaID === "github" ? `https://github.com/MagicTendo/${githubRepositoryName}` : postLink;
                                const githubRepositoryAction = postTitle?.includes("pushed") ? "mettre à jour" : postTitle?.toLowerCase()?.includes("Initial commit") ? "publier" : null;

                                if (socialMediaID === "github" && githubRepositoryAction || socialMediaID !== "github") {
                                    const postMessage = `${socialMediaAlerts[socialMediaID.split("-")[0]].replace("[CHANNEL_NAME]", `\`${socialMediaTitleTag}\``).replace("[ACTION]", githubRepositoryAction).replace("[REPOSITORY]", githubRepositoryName)}\n** **\n${socialMediaChannelLink}`;

                                    await client.channels.fetch(process.env.SOCIAL_MEDIAS_CHANNEL_ID).then(async channel => {
                                        await channel.send({ content: postMessage });
                                    });

                                    socialMediaLastUpdateList[socialMediaID] = socialMediaLastPublicationDate;

                                    writeFileSync("./json/social-media-last-updates.json", JSON.stringify(socialMediaLastUpdateList, null, 4));
                                }
                            } else {
                                await sendLog(client, "Broken RSS feed!", `The [${socialMediaID}](${socialMediaRoute}) RSS feed no longer works!`, "error");
                            }
                        }
                    }
                }, null, true, "Europe/Paris");

                socialMediaNotificationJob.start();
            }

            console.log(`\n\x1b[32m➔  RSS feeds initialised ! ✅\x1b[0m`);
        }

        async function updateProfilePictures() {
            const yunayunoriEndDates = ["0 * 9 1 *", "0 * 2 2 *", "0 * 16 2 *", "0 * 2 4 *", "0 * 6 6 *", "0 * 6 9 *", "0 * * 11 *", "0 * * 1 *"];
            const supportEndDates = ["0 * 13 5 *", "0 * * 11 *", "0 * * 1 *"];
            const originalYunayunoriName = "🎴 Yunayunori";
            const originalSupportName = "🟠 TokinoSupport";
            const yunayunoriID = process.env.GUILD_COMMANDS_ID;
            const supportID = "827879505884348456";

            const dates = {
                "0 * 8 1 *": [yunayunoriID, "🎴 MagikuTendō Bideogēmu", "yunayunori/magictendo"],
                "0 * 1 2 *": [yunayunoriID, "🍰 Yunayunori", "yunayunori/year-cake"],
                "0 * 15 2 *": [yunayunoriID, "🌋 Yunranopikuseru", "yunayunori/shutanopikuseru"],
                "0 * 1 4 *": [yunayunoriID, "🎴 Yunayunori", "yunayunori/april-fools"],
                "0 * 5 6 *": [yunayunoriID, "🎴 Yunayunori", "yunayunori/blurple"],
                "0 * 5 9 *": [yunayunoriID, "🍊 Yunrano 95", "yunayunori/kyujugopiku"],
                "0 * * 10 *": [yunayunoriID, "🎃 Yunayunori", "yunayunori/halloween"],
                "0 * * 12 *": [yunayunoriID, "❄️ Yunayunori", "yunayunori/christmas"],
                "0 * 12 5 *": [supportID, "🧊 Support Cirno", "tokinotsuki/cirno"],
                "0 * * 10 *": [supportID, "🎃 TokinoSupport", "tokinotsuki/halloween"],
                "0 * * 12 *": [supportID, "❄️ TokinoSupport", "tokinotsuki/christmas"]
            };

            for (const [date, data] of Object.entries(dates)) {
                const profilePictureManagerJob = new CronJob(date, async () => {
                    const server = client.guilds.cache.find(guild => guild.id === data[0]);

                    if (server) {
                        await server.setName(data[1]);
                        await server.setIcon(`./assets/images/server-icons/${data[2]}.png`);
                    }
                }, null, true, "Europe/Paris");

                profilePictureManagerJob.start();
            }

            for (let i = 0; i < yunayunoriEndDates.length; i++) {
                const yunayunoriProfilePictureResetJob = new CronJob(yunayunoriEndDates[i], async () => {
                    const server = client.guilds.cache.find(guild => guild.id === yunayunoriID);

                    if (server) {
                        await server.setName(originalYunayunoriName);
                        await server.setIcon("./assets/images/server-icons/yunayunori/classic.png");
                    }
                }, null, true, "Europe/Paris");

                yunayunoriProfilePictureResetJob.start();
            }

            for (let i = 0; i < supportEndDates.length; i++) {
                const tokinoSupportProfilePictureResetJob = new CronJob(supportEndDates[i], async () => {
                    const server = client.guilds.cache.find(guild => guild.id === supportID);

                    if (server) {
                        await server.setName(originalSupportName);
                        await server.setIcon("./assets/images/server-icons/tokinotsuki/classic.png");
                    }
                }, null, true, "Europe/Paris");

                tokinoSupportProfilePictureResetJob.start();
            }
        }

        async function updateAPI() {
            const uptime = new Date().toISOString();
            const usages = await getValue("toki", "toki", "usages");
            const registeredRaw = await keyvUsers.query("SELECT COUNT(*) FROM users;");
            const registered = registeredRaw[0]["count"];
            const users = client.users.cache.size;
            const guilds = client.guilds.cache.size;

            await fetch(`http://tokinotsuki.toile-libre.org/api.php?key=${process.env.TOKI_API_KEY}&uptime=${uptime}&usages=${usages}&registered=${registered}&users=${users}&guilds=${guilds}`).then(function (response) {
                return response.text();
            }).then(async function (data) {
                console.log(`\n\x1b[36m➔  API : ${data} 🌐\x1b[0m`);
            });
        }

        await setRandomStatus();

        setInterval(setRandomStatus, 20_000);

        if (process.env.TESTING_MODE === "false") {
            await setupSocialMediaNotifications();
            await updateProfilePictures();
            await updateAPI();
        }

        await sendLog(client, "Connectée !");

        console.log(`\n\x1b[93m➔  Every modules of ${client.user.tag} are now ready ! 🎵\x1b[0m`);
        console.timeEnd("\n\x1b[1;97m\x1b[3m🕰️  Time to launch ");
        console.log("\x1b[0m");
    }
};
