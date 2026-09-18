const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getAllWeather, setAPPID, setCity, setLang, setUnits } = require("openweather-apis")
const { sendError } = require("../../../tools/error-catcher.js");
const { simplify } = require("../../../tools/modules.js");

module.exports = {
    category: "Utilitaire",
    data: new SlashCommandBuilder()
        .setName("weather")
        .setDescription("Donne la météo et des données météorologiques d'un lieu.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addStringOption(option => option
            .setName("place")
            .setDescription("Le lieu, pouvant être un pays, une région, un département, une ville, etc.")
            .setRequired(true)),
    async execute(interaction, client) {
        try {
            const place = interaction.options.getString("place");

            setLang("fr");
            setCity(place);
            setUnits("metric")
            setAPPID(process.env.WEATHER_API_KEY);

            getAllWeather(async function (error, weather) {
                try {
                    const cityName = weather.name;
                    const countryCode = weather.sys.country.toLowerCase();
                    const temperature = String(weather.main.temp).replace(".", ",");
                    const temperatureFeelsLike = String(weather.main.feels_like).replace(".", ",");
                    const weatherDescription = weather.weather[0].description;
                    const time = new Date((weather.dt + weather.timezone) * 1_000);
                    const hours = String(time.getHours()).padStart(2, "0");
                    const minutes = String(time.getMinutes()).padStart(2, "0");
                    const windSpeed = await simplify(interaction.user.id, weather.wind.speed * 3.6);
                    const pressure = weather.main.pressure;
                    const humidity = weather.main.humidity;
                    const visibility = weather.visibility / 1_000;
                    const sunriseTime = weather.sys.sunrise;
                    const sunsetTime = weather.sys.sunset;
                    const weatherIcon = `https://openweathermap.org/assets/images/w/${weather.weather[0].icon}.png`;

                    const weatherEmbed = new EmbedBuilder()
                        .setColor([255, 85, 0])
                        .setTitle(`Météo de "${cityName}" :flag_${countryCode}:`)
                        .setDescription(`🌡️ **Température** : ${temperature}°C (ressentie : ${temperatureFeelsLike}°C)\n⛅️ **Le temps est** : ${weatherDescription}\n🕘 **Heure (approximative)** : ${hours}:${minutes} (UTC+0)\n🍃 **Vitesse du vent** : ${windSpeed}km/h\n🗜️ **Pression** : ${pressure}hPa\n💦 **Taux d'humidité** : ${humidity}%\n🌫️ **Visibilité** : ${visibility}km\n🌄 **Levé du soleil** : <t:${sunriseTime}:R>\n🌇 **Couché du soleil** : <t:${sunsetTime}:R>`)
                        .setThumbnail(weatherIcon)
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ extension: "png", size: 64 }) });

                    await interaction.reply({ embeds: [weatherEmbed] });
                } catch (error) {
                    await interaction.reply({ content: `L'endroit spécifié (${place}) ne semble pas exister dans le monde ou pas être disponible ! Si l'endroit est quand même correcte, alors c'est que l'API a trop été utilisé aujourd'hui ! D:` });
                }
            })
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};