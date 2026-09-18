const { EmbedBuilder } = require("discord.js");
const { KeyvPostgres } = require("@keyv/postgres");
const { KeyvGzip } = require("@keyv/compress-gzip");
const { sendError, sendDatabaseError } = require("./error-catcher.js");
const keyvGzip = new KeyvGzip();
const keyvUsers = new KeyvPostgres({ uri: `postgresql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`, table: "users", compression: keyvGzip, ssl: process.env.TESTING_MODE === "false" ? { rejectUnauthorized: false } : false });
const keyvGuilds = new KeyvPostgres({ uri: `postgresql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`, table: "guilds", compression: keyvGzip, ssl: process.env.TESTING_MODE === "false" ? { rejectUnauthorized: false } : false });
const keyvToki = new KeyvPostgres({ uri: `postgresql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`, table: "toki", compression: keyvGzip, ssl: process.env.TESTING_MODE === "false" ? { rejectUnauthorized: false } : false });

keyvUsers.on("error", async error => await sendDatabaseError(error, "users"));
keyvGuilds.on("error", async error => await sendDatabaseError(error, "guilds"));
keyvToki.on("error", async error => await sendDatabaseError(error, "toki"));

async function tryAddingUserToDatabase(interaction, client, id, type) {
    try {
        if (client.users.cache.get(id).bot)
            return;

        let userData = (type === "users" ? await keyvUsers.get(id) : await keyvGuilds.get(id)) ?? {};

        if (!userData) {
            userData = {};

            type === "users" ? await keyvUsers.set(id, userData) : await keyvGuilds.set(id, userData);

            await client.channels.fetch(process.env.LOG_CHANNEL_ID).then(async channel => {
                const logEmbed = new EmbedBuilder()
                    .setColor([3, 119, 252])
                    .setTitle(`Nouvelle insertion dans la base de données : ${interaction.user.globalName} !`)
                    .setTimestamp()
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                await channel.send({ embeds: [logEmbed] });
            });
        }
    } catch (error) {
        await sendError(interaction, client, error);
    }
}

async function getValue(id, type, item, checkKey = false) {
    try {
        const getRawItems = (type === "users" ? await keyvUsers.get(id) : type === "guilds" ? await keyvGuilds.get(id) : await keyvToki.get(id)) ?? undefined;

        if (getRawItems === undefined)
            return null;

        const getItems = JSON.parse(getRawItems) ?? {};

        if (checkKey)
            return getItems[item];

        return getItems[item] ?? 0;
    } catch (error) {
        await sendDatabaseError(error, type);
    }
}

async function hasValue(id, type, item) {
    const itemQuantity = await getValue(id, type, item);

    return itemQuantity > 0;
}

async function updateValue(id, type, item, value, isAdditive = true) {
    try {
        const rawData = (type === "users" ? await keyvUsers.get(id) : type === "guilds" ? await keyvGuilds.get(id) : await keyvToki.get(id)) ?? {};
        const data = typeof rawData === "string" ? JSON.parse(rawData) : (rawData ?? {});

        let newData = {};
        newData[item] = isAdditive ? (data[item] ?? 0) + value : value;

        type === "users" ? await keyvUsers.set(id, Object.assign({}, data, newData)) : type === "guilds" ? await keyvGuilds.set(id, Object.assign({}, data, newData)) : await keyvToki.set(id, Object.assign({}, data, newData));
    } catch (error) {
        await sendDatabaseError(error, type);
    }
}

async function deleteKey(id, type) {
    try {
        type === "users" ? await keyvUsers.delete(id) : keyvGuilds.delete(id);
    } catch (error) {
        await sendDatabaseError(error, type);
    }
}

async function deleteValue(id, type, item) {
    if (await hasValue(id, type, item)) {
        try {
            const rawData = (type === "users" ? await keyvUsers.get(id) : await keyvGuilds.get(id));
            const data = typeof rawData === "string" ? JSON.parse(rawData) : (rawData ?? {});

            let newData = data;
            delete newData[item];

            if (Object.keys(newData).length === 0)
                await deleteKey(id, type);
            else
                type === "users" ? await keyvUsers.set(id, data) : await keyvGuilds.set(id, data);
        } catch (error) {
            await sendDatabaseError(error, type);
        }
    }
}

module.exports = { keyvUsers, keyvGuilds, keyvToki, tryAddingUserToDatabase, getValue, hasValue, updateValue, deleteKey, deleteValue };