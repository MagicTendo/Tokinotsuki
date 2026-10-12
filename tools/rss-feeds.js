const { CronJob } = require("cron");
const { readFileSync, writeFileSync } = require("fs");
const Parser = require("rss-parser");
const { sendLog } = require("../tools/error-catcher.js");

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

const parser = new Parser();

async function launchFeedScrapping(client) {
    console.log(`\n\x1b[30m➔  Startind to fetch RSS feeds... 📶\x1b[0m`);

    for (let i = 0; i < Object.keys(socialMediaRoutes).length; i++) {
        const socialMediaName = Object.keys(socialMediaRoutes)[i];
        const socialMediaRoute = socialMediaRoutes[socialMediaName];

        const socialMediaNotificationJob = new CronJob("*/25 9-23,0 * * *", async () => {
            try {
                await sendMessage(client, socialMediaRoute, socialMediaName);
            } catch (error) {
                await sendLog(client, `Une erreur s'est produite avec la route ${socialMediaName}...`, error.message, "error");
            }
        }, null, true, "Europe/Paris");

        socialMediaNotificationJob.start();
    }

    console.log(`\n\x1b[32m➔  RSS feeds initialised ! ✅\x1b[0m`);
}

async function sendMessage(client, feedURL, feedName) {
    const result = { "error": true, "message": "" };
    const socialMediaFeed = await parser.parseURL(feedURL);
    const socialMediaLastUpdates = readFileSync("./json/social-media-last-updates.json", "utf-8");
    const socialMediaLastUpdateList = JSON.parse(socialMediaLastUpdates);

    if (socialMediaFeed.items.length > 0) {
        const socialMediaLastPublicationDateRaw = socialMediaFeed.items[0]?.pubDate ?? socialMediaFeed.items[0]?.published ?? socialMediaFeed.items[0]?.date_modified;
        const socialMediaLastPublicationDate = new Date(socialMediaLastPublicationDateRaw).getTime();

        if (socialMediaLastPublicationDate > socialMediaLastUpdateList[feedName]) {
            const socialMediaTitleTag = socialMediaFeed?.title;
            const postTitle = socialMediaFeed.items[0]?.title;
            const postLink = socialMediaFeed.items[0]?.link ?? socialMediaFeed.items[0]?.url;

            if (!socialMediaTitleTag.includes("has stopped streaming") && !postTitle?.includes("Bridge returned error") && postLink !== feedURL) {
                const githubRepositoryName = postTitle?.split(" ")?.[2];
                const socialMediaChannelLink = feedName === "github" ? `https://github.com/MagicTendo/${githubRepositoryName}` : postLink;
                const githubRepositoryAction = postTitle?.includes("pushed") ? "mettre à jour" : postTitle?.toLowerCase()?.includes("Initial commit") ? "publier" : null;

                if ((feedName !== "twitch" && feedName !== "github") || (feedName === "twitch" && postTitle.includes("started")) || (feedName === "github" && githubRepositoryAction)) {
                    const postMessage = `${socialMediaAlerts[feedName.split("-")[0]].replace("[CHANNEL_NAME]", `\`${socialMediaTitleTag}\``).replace("[ACTION]", githubRepositoryAction).replace("[REPOSITORY]", githubRepositoryName)}\n** **\n${socialMediaChannelLink}`;

                    await client.channels.fetch(process.env.SOCIAL_MEDIAS_CHANNEL_ID).then(async channel => {
                        await channel.send({ content: postMessage });
                    });

                    socialMediaLastUpdateList[feedName] = socialMediaLastPublicationDate;

                    writeFileSync("./json/social-media-last-updates.json", JSON.stringify(socialMediaLastUpdateList, null, 4));

                    result["message"] = "Message envoyé !";
                }

                result["error"] = false;
                result["message"] = "Message non envoyé...";
            } else {
                await sendLog(client, "Flux RSS cassé!", `Le flux [${feedName}](${feedURL}) ne semble plus fonctionner...`, "error");

                result["message"] = "Flux RSS cassé...";
            }
        } else {
            result["message"] = "Aucune nouveauté...";
        }
    } else {
        result["message"] = "Flux RSS vide...";
    }

    return result;
}

module.exports = { socialMediaRoutes, launchFeedScrapping, sendMessage };