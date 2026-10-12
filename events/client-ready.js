const { CronJob } = require("cron");
const { ActivityType, PresenceUpdateStatus } = require("discord.js");
const { keyvUsers, getValue } = require("../tools/database.js");
const { sendLog } = require("../tools/error-catcher.js");
const { launchFeedScrapping } = require("../tools/rss-feeds.js");
const { getRandomStatus } = require("../tools/statuses.js");

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

        async function updateProfilePictures() {
            const yunayunoriEndDates = ["0 * 9 1 *", "0 * 2 2 *", "0 * 16 2 *", "0 * 2 4 *", "0 * 6 6 *", "0 * 6 9 *", "0 * * 11 *", "0 * * 1 *"];
            const supportEndDates = ["0 * 13 5 *", "0 * * 11 *", "0 * * 1 *"];
            const originalYunayunoriName = "🎴 Yunayunori";
            const originalSupportName = "🟠 TokinoSupport";
            const yunayunoriID = process.env.GUILD_COMMANDS_ID;
            const supportID = "827879505884348456";

            const dates = {
                "0 */1 8 1 *": [yunayunoriID, "🎴 MagikuTendō Bideogēmu", "yunayunori/magictendo"],
                "0 */1 1 2 *": [yunayunoriID, "🍰 Yunayunori", "yunayunori/year-cake"],
                "0 */1 15 2 *": [yunayunoriID, "🌋 Yunranopikuseru", "yunayunori/shutanopikuseru"],
                "0 */1 1 4 *": [yunayunoriID, "🎴 Yunayunori", "yunayunori/april-fools"],
                "0 */1 5 6 *": [yunayunoriID, "🎴 Yunayunori", "yunayunori/blurple"],
                "0 */1 5 9 *": [yunayunoriID, "🍊 Yunrano 95", "yunayunori/kyujugopiku"],
                "0 */1 * 10 *": [yunayunoriID, "🎃 Yunayunori", "yunayunori/halloween"],
                "0 */1 * 12 *": [yunayunoriID, "❄️ Yunayunori", "yunayunori/christmas"],
                "0 */1 12 5 *": [supportID, "🧊 Support Cirno", "tokinotsuki/cirno"],
                "0 */1 * 10 *": [supportID, "🎃 TokinoSupport", "tokinotsuki/halloween"],
                "0 */1 * 12 *": [supportID, "❄️ TokinoSupport", "tokinotsuki/christmas"]
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
            await launchFeedScrapping(client);
            await updateProfilePictures();
            await updateAPI();
        }

        await sendLog(client, "Connectée !");

        console.log(`\n\x1b[93m➔  Every modules of ${client.user.tag} are now ready ! 🎵\x1b[0m`);
        console.timeEnd("\n\x1b[1;97m\x1b[3m🕰️  Time to launch ");
        console.log("\x1b[0m");
    }
};
