const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { convert } = require("convert");
const { Convert, Converter } = require("easy-currencies");
const moment = require("moment-timezone");
const { sendError } = require("../../../tools/error-catcher.js");

module.exports = {
    category: "Utilitaire",
    data: new SlashCommandBuilder()
        .setName("convert")
        .setDescription("Pour faire des conversions d'unités.")
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2])
        .addSubcommand(subcommand => subcommand
            .setName("area")
            .setDescription("Pour faire des conversions d'aires.")
            .addNumberOption(option => option
                .setName("value")
                .setDescription("La valeur à convertir.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("from")
                .setDescription("L'unité de la valeur.")
                .addChoices(
                    { name: "mm² (millimètre carré)", value: "mm²" },
                    { name: "cm² (centimètre carré)", value: "cm²" },
                    { name: "m² (mètre carré)", value: "m²" },
                    { name: "km² (kilomètre carré)", value: "km²" },
                    { name: "ac (acre)", value: "ac" },
                    { name: "ca (centiare)", value: "ca" },
                    { name: "da (déciare)", value: "da" },
                    { name: "are (are)", value: "are" },
                    { name: "daa (décare)", value: "daa" },
                    { name: "ha (hectare)", value: "ha" },
                    { name: "ft² (pied carré)", value: "ft²" },
                    { name: "in² (pouce carré)", value: "in²" },
                    { name: "yd² (yard carré)", value: "yd²" },
                    { name: "mi² (mille carré)", value: "mi²" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("to")
                .setDescription("L'unité désirée.")
                .addChoices(
                    { name: "mm² (millimètre carré)", value: "mm²" },
                    { name: "cm² (centimètre carré)", value: "cm²" },
                    { name: "m² (mètre carré)", value: "m²" },
                    { name: "km² (kilomètre carré)", value: "km²" },
                    { name: "ac (acre)", value: "ac" },
                    { name: "ca (centiare)", value: "ca" },
                    { name: "da (déciare)", value: "da" },
                    { name: "are (are)", value: "are" },
                    { name: "daa (décare)", value: "daa" },
                    { name: "ha (hectare)", value: "ha" },
                    { name: "ft² (pied carré)", value: "ft²" },
                    { name: "in² (pouce carré)", value: "in²" },
                    { name: "yd² (yard carré)", value: "yd²" },
                    { name: "mi² (mille carré)", value: "mi²" })
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("angle")
            .setDescription("Pour faire des conversions d'angles.")
            .addNumberOption(option => option
                .setName("value")
                .setDescription("La valeur à convertir.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("from")
                .setDescription("L'unité de la valeur.")
                .addChoices(
                    { name: "° (degré)", value: "°" },
                    { name: "rad (radian)", value: "rad" },
                    { name: "gon (grade)", value: "gon" },
                    { name: "turn (tour complet)", value: "turn" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("to")
                .setDescription("L'unité désirée.")
                .addChoices(
                    { name: "° (degré)", value: "°" },
                    { name: "rad (radian)", value: "rad" },
                    { name: "gon (grade)", value: "gon" },
                    { name: "turn (tour complet)", value: "turn" })
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("data")
            .setDescription("Pour faire des conversions de données informatiques.")
            .addNumberOption(option => option
                .setName("value")
                .setDescription("La valeur à convertir.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("from")
                .setDescription("L'unité de la valeur.")
                .addChoices(
                    { name: "bit (bit)", value: "bits" },
                    { name: "B (octet)", value: "B" },
                    { name: "Ko (kilooctet)", value: "KB" },
                    { name: "Mo (mégaoctet)", value: "MB" },
                    { name: "Go (gigaoctet)", value: "GB" },
                    { name: "To (téraoctet)", value: "TB" },
                    { name: "Po (pétaoctet)", value: "PB" },
                    { name: "Kio (kibi-octet)", value: "KiB" },
                    { name: "Mio (mébi-octet)", value: "MiB" },
                    { name: "Gio (gibi-octet)", value: "GiB" },
                    { name: "Tio (tebi-octet)", value: "TiB" },
                    { name: "Pio (pébi-octet)", value: "PiB" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("to")
                .setDescription("L'unité désirée.")
                .addChoices(
                    { name: "bit (bit)", value: "bits" },
                    { name: "B (octet)", value: "B" },
                    { name: "Ko (kilooctet)", value: "KB" },
                    { name: "Mo (mégaoctet)", value: "MB" },
                    { name: "Go (gigaoctet)", value: "GB" },
                    { name: "To (téraoctet)", value: "TB" },
                    { name: "Po (pétaoctet)", value: "PB" },
                    { name: "Kio (kibi-octet)", value: "KiB" },
                    { name: "Mio (mébi-octet)", value: "MiB" },
                    { name: "Gio (gibi-octet)", value: "GiB" },
                    { name: "Tio (tebi-octet)", value: "TiB" },
                    { name: "Pio (pébi-octet)", value: "PiB" })
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("energy")
            .setDescription("Pour faire des conversions d'énergies.")
            .addNumberOption(option => option
                .setName("value")
                .setDescription("La valeur à convertir.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("from")
                .setDescription("L'unité de la valeur.")
                .addChoices(
                    { name: "J (joule)", value: "J" },
                    { name: "Wh (watt-heure)", value: "Wh" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("to")
                .setDescription("L'unité désirée.")
                .addChoices(
                    { name: "J (joule)", value: "J" },
                    { name: "Wh (watt-heure)", value: "Wh" })
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("force")
            .setDescription("Pour faire des conversions de forces.")
            .addNumberOption(option => option
                .setName("value")
                .setDescription("La valeur à convertir.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("from")
                .setDescription("L'unité de la valeur.")
                .addChoices(
                    { name: "N (Newton)", value: "N" },
                    { name: "lbf (livre-force)", value: "lbf" },
                    { name: "klb (kilolivre-force)", value: "klb" },
                    { name: "pdl (poundal)", value: "pdl" },
                    { name: "kp (kilopond)", value: "kp" },
                    { name: "dyn (dyne)", value: "dyn" },
                    { name: "tf (tonne-force)", value: "tf" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("to")
                .setDescription("L'unité désirée.")
                .addChoices(
                    { name: "N (Newton)", value: "N" },
                    { name: "lbf (livre-force)", value: "lbf" },
                    { name: "klb (kilolivre-force)", value: "klb" },
                    { name: "pdl (poundal)", value: "pdl" },
                    { name: "kp (kilopond)", value: "kp" },
                    { name: "dyn (dyne)", value: "dyn" },
                    { name: "tf (tonne-force)", value: "tf" })
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("length")
            .setDescription("Pour faire des conversions de longueurs.")
            .addNumberOption(option => option
                .setName("value")
                .setDescription("La valeur à convertir.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("from")
                .setDescription("L'unité de la valeur.")
                .addChoices(
                    { name: "mm (millimètre)", value: "mm" },
                    { name: "cm (centimètre)", value: "cm" },
                    { name: "m (mètre)", value: "m" },
                    { name: "km (kilomètre)", value: "km" },
                    { name: "in (pouce)", value: "in" },
                    { name: "ft (pied)", value: "ft" },
                    { name: "yd (yard)", value: "yd" },
                    { name: "mi (mille terrestre)", value: "mi" },
                    { name: "nmi (mille marin)", value: "nmi" },
                    { name: "ly (année-lumière)", value: "ly" },
                    { name: "pc (parsec)", value: "pc" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("to")
                .setDescription("L'unité désirée.")
                .addChoices(
                    { name: "mm (millimètre)", value: "mm" },
                    { name: "cm (centimètre)", value: "cm" },
                    { name: "m (mètre)", value: "m" },
                    { name: "km (kilomètre)", value: "km" },
                    { name: "in (pouce)", value: "in" },
                    { name: "ft (pied)", value: "ft" },
                    { name: "yd (yard)", value: "yd" },
                    { name: "mi (mille terrestre)", value: "mi" },
                    { name: "nmi (mille marin)", value: "nmi" },
                    { name: "ly (année-lumière)", value: "ly" },
                    { name: "pc (parsec)", value: "pc" })
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("mass")
            .setDescription("Pour faire des conversions de masses.")
            .addNumberOption(option => option
                .setName("value")
                .setDescription("La valeur à convertir.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("from")
                .setDescription("L'unité de la valeur.")
                .addChoices(
                    { name: "mg (milligrame)", value: "mg" },
                    { name: "g (gramme)", value: "g" },
                    { name: "kg (kilogramme)", value: "kg" },
                    { name: "t (tonne)", value: "t" },
                    { name: "oz (once)", value: "oz" },
                    { name: "lb (livre)", value: "lb" },
                    { name: "st (stone)", value: "st" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("to")
                .setDescription("L'unité désirée.")
                .addChoices(
                    { name: "mg (milligrame)", value: "mg" },
                    { name: "g (gramme)", value: "g" },
                    { name: "kg (kilogramme)", value: "kg" },
                    { name: "t (tonne)", value: "t" },
                    { name: "oz (once)", value: "oz" },
                    { name: "lb (livre)", value: "lb" },
                    { name: "st (stone)", value: "st" })
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("money")
            .setDescription("Pour faire des conversions de monnaie.")
            .addNumberOption(option => option
                .setName("value")
                .setDescription("Le montant à convertir.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("from")
                .setDescription("La monnaie de départ.")
                .setAutocomplete(true)
                .setRequired(true))
            .addStringOption(option => option
                .setName("to")
                .setDescription("La monnaie converti.")
                .setAutocomplete(true)
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("power")
            .setDescription("Pour faire des conversions de puissances.")
            .addNumberOption(option => option
                .setName("value")
                .setDescription("La valeur à convertir.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("from")
                .setDescription("L'unité de la valeur.")
                .addChoices(
                    { name: "W (watt)", value: "W" },
                    { name: "kW (kilowatt)", value: "kW" },
                    { name: "MW (mégawatt)", value: "MW" },
                    { name: "GW (gigawatt)", value: "GW" },
                    { name: "TW (terrawat)", value: "TW" },
                    { name: "PW (pétawatt)", value: "PW" },
                    { name: "hp (cheval-vapeur)", value: "hp" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("to")
                .setDescription("L'unité désirée.")
                .addChoices(
                    { name: "W (watt)", value: "W" },
                    { name: "kW (kilowatt)", value: "kW" },
                    { name: "MW (mégawatt)", value: "MW" },
                    { name: "GW (gigawatt)", value: "GW" },
                    { name: "TW (terrawat)", value: "TW" },
                    { name: "PW (pétawatt)", value: "PW" },
                    { name: "hp (cheval-vapeur)", value: "hp" })
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("temperature")
            .setDescription("Pour faire des conversions de températures.")
            .addNumberOption(option => option
                .setName("value")
                .setDescription("La valeur à convertir.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("from")
                .setDescription("L'unité de la valeur.")
                .addChoices(
                    { name: "°C (degré Celsius)", value: "C" },
                    { name: "°F (degré Fahrenheit)", value: "F" },
                    { name: "°K (degré Kelvin)", value: "K" },
                    { name: "°R (degré Rankine)", value: "R" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("to")
                .setDescription("L'unité désirée.")
                .addChoices(
                    { name: "°C (degré Celsius)", value: "C" },
                    { name: "°F (degré Fahrenheit)", value: "F" },
                    { name: "°K (degré Kelvin)", value: "K" },
                    { name: "°R (degré Rankine)", value: "R" })
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("time")
            .setDescription("Pour faire des conversions de temps.")
            .addNumberOption(option => option
                .setName("value")
                .setDescription("La valeur à convertir.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("from")
                .setDescription("L'unité de la valeur.")
                .addChoices(
                    { name: "fs (femtoseconde)", value: "fs" },
                    { name: "ps (picoseconde)", value: "ps" },
                    { name: "ns (nanoseconde)", value: "ns" },
                    { name: "µs (microseconde)", value: "µs" },
                    { name: "ms (milliseconde)", value: "ms" },
                    { name: "s (seconde)", value: "s" },
                    { name: "min (minute)", value: "min" },
                    { name: "h (heure)", value: "h" },
                    { name: "d (jour)", value: "d" },
                    { name: "wk (semaine)", value: "wk" },
                    { name: "fn (quinzaine)", value: "fn" },
                    { name: "mo (mois)", value: "mo" },
                    { name: "yr (année)", value: "yr" },
                    { name: "dec (décennie)", value: "dec" },
                    { name: "centuries (siècle)", value: "centuries" },
                    { name: "millennia (millénaire)", value: "millennia" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("to")
                .setDescription("L'unité désirée.")
                .addChoices(
                    { name: "fs (femtoseconde)", value: "fs" },
                    { name: "ps (picoseconde)", value: "ps" },
                    { name: "ns (nanoseconde)", value: "ns" },
                    { name: "µs (microseconde)", value: "µs" },
                    { name: "ms (milliseconde)", value: "ms" },
                    { name: "s (seconde)", value: "s" },
                    { name: "min (minute)", value: "min" },
                    { name: "h (heure)", value: "h" },
                    { name: "d (jour)", value: "d" },
                    { name: "wk (semaine)", value: "wk" },
                    { name: "fn (quinzaine)", value: "fn" },
                    { name: "mo (mois)", value: "mo" },
                    { name: "yr (année)", value: "yr" },
                    { name: "dec (décennie)", value: "dec" },
                    { name: "centuries (siècle)", value: "centuries" },
                    { name: "millennia (millénaire)", value: "millennia" })
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("timezone")
            .setDescription("Pour faire des conversions de fuseaux horaires.")
            .addStringOption(option => option
                .setName("value")
                .setDescription("L'heure à convertir. Le format est HH:MM.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("from")
                .setDescription("Le fuseau horaire à convertir.")
                .setAutocomplete(true)
                .setRequired(true))
            .addStringOption(option => option
                .setName("to")
                .setDescription("Le fuseau horaire converti.")
                .setAutocomplete(true)
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("pressure")
            .setDescription("Pour faire des conversions de pressions.")
            .addNumberOption(option => option
                .setName("value")
                .setDescription("La valeur à convertir.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("from")
                .setDescription("L'unité de la valeur.")
                .addChoices(
                    { name: "Pa (Pascal)", value: "Pa" },
                    { name: "bar (bar)", value: "bar" },
                    { name: "psi (livre par pouce carré)", value: "psi" },
                    { name: "Torr (torr)", value: "Torr" },
                    { name: "atm (atmosphère)", value: "atm" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("to")
                .setDescription("L'unité désirée.")
                .addChoices(
                    { name: "Pa (Pascal)", value: "Pa" },
                    { name: "bar (bar)", value: "bar" },
                    { name: "psi (livre par pouce carré)", value: "psi" },
                    { name: "Torr (torr)", value: "Torr" },
                    { name: "atm (atmosphère)", value: "atm" })
                .setRequired(true)))

        .addSubcommand(subcommand => subcommand
            .setName("volume")
            .setDescription("Pour faire des conversions de volumes.")
            .addNumberOption(option => option
                .setName("value")
                .setDescription("La valeur à convertir.")
                .setRequired(true))
            .addStringOption(option => option
                .setName("from")
                .setDescription("L'unité de la valeur.")
                .addChoices(
                    { name: "mL (millilitre)", value: "mL" },
                    { name: "cL (centilitre)", value: "cL" },
                    { name: "L (litre)", value: "L" },
                    { name: "mm³ (millimètre cube)", value: "mm³" },
                    { name: "cm³ (centimètre cube)", value: "cm³" },
                    { name: "m³ (mètre cube)", value: "m³" },
                    { name: "km³ (kilomètre cube)", value: "km³" },
                    { name: "mi³ (mille cube)", value: "mi³" },
                    { name: "yd³ (yard cube)", value: "yd³" },
                    { name: "ft³ (pied cube)", value: "ft³" },
                    { name: "in³ (pouce cube)", value: "in³" },
                    { name: "ac ft (acre-pied)", value: "ac ft" },
                    { name: "tsp (cuillère à café)", value: "tsp" },
                    { name: "tbsp (cuillère à soupe)", value: "tbsp" },
                    { name: "c (tasse)", value: "c" },
                    { name: "p (pinte)", value: "p" },
                    { name: "qt (quart)", value: "qt" },
                    { name: "gal (gallon)", value: "gal" })
                .setRequired(true))
            .addStringOption(option => option
                .setName("to")
                .setDescription("L'unité désirée.")
                .addChoices(
                    { name: "mL (millilitre)", value: "mL" },
                    { name: "cL (centilitre)", value: "cL" },
                    { name: "L (litre)", value: "L" },
                    { name: "mm³ (millimètre cube)", value: "mm³" },
                    { name: "cm³ (centimètre cube)", value: "cm³" },
                    { name: "m³ (mètre cube)", value: "m³" },
                    { name: "km³ (kilomètre cube)", value: "km³" },
                    { name: "mi³ (mille cube)", value: "mi³" },
                    { name: "yd³ (yard cube)", value: "yd³" },
                    { name: "ft³ (pied cube)", value: "ft³" },
                    { name: "in³ (pouce cube)", value: "in³" },
                    { name: "ac ft (acre-pied)", value: "ac ft" },
                    { name: "tsp (cuillère à café)", value: "tsp" },
                    { name: "tbsp (cuillère à soupe)", value: "tbsp" },
                    { name: "c (tasse)", value: "c" },
                    { name: "p (pinte)", value: "p" },
                    { name: "qt (quart)", value: "qt" },
                    { name: "gal (gallon)", value: "gal" })
                .setRequired(true))),
    async autocomplete(interaction) {
        const conversionType = interaction.options.getSubcommand();
        const focusedValue = interaction.options.getFocused().toLowerCase();
        let list;
        let filteredList;

        if (conversionType === "money") {
            const conversion = await Convert().from("EUR").fetch();

            list = Object.keys(conversion.rates);
            filteredList = list.filter(element => element.replaceAll("_", " ").toLowerCase().includes(focusedValue)).slice(0, 24);
        } else if (conversionType === "timezone") {
            list = moment.tz.names();
            filteredList = list.filter(element => element.replaceAll("_", " ").toLowerCase().includes(focusedValue)).slice(0, 24);
        }

        await interaction.respond(filteredList.map(element => ({ name: element.replaceAll("_", " "), value: element })));
    },
    async execute(interaction, client) {
        try {
            const conversionType = interaction.options.getSubcommand();
            const value = conversionType === "timezone" ? interaction.options.getString("value") : interaction.options.getNumber("value");
            const fromUnit = interaction.options.getString("from").replaceAll(" ", "_");
            const toUnit = interaction.options.getString("to").replaceAll(" ", "_");

            if (conversionType === "money") {
                const fromCurrency = fromUnit.toUpperCase(), toCurrency = toUnit.toUpperCase();

                await new Converter().convert(value, fromCurrency, toCurrency).then(async result => {
                    await interaction.reply({ content: `${value} ${fromUnit} = **${result} ${toUnit}** !` });
                }).catch(async error => {
                    await interaction.reply({ content: `❌ Une des deux monnaies (ou les deux) (\`${fromCurrency}\` / \`${toCurrency}\`) n'existe pas !`, flags: MessageFlags.Ephemeral });
                    return;
                });
            } else if (conversionType === "timezone") {
                if (!moment.tz.zone(fromUnit))
                    return await interaction.reply({ content: `❌ La timezone \`${fromUnit}\` n'existe pas !`, flags: MessageFlags.Ephemeral });
                if (!moment.tz.zone(toUnit))
                    return await interaction.reply({ content: `❌ La timezone \`${toUnit}\` n'existe pas !`, flags: MessageFlags.Ephemeral });

                const timezoneValue = moment(value.replaceAll(/am|pm/gi, "").trim(), "HH:mm").format("HH:mm");
                const currentTime = `${moment().format().split("T")[0]} ${timezoneValue}`;

                if (!moment(currentTime, "YYYY-MM-DD HH:mm").isValid() || !moment(timezoneValue, "HH:mm").isValid())
                    return await interaction.reply({ content: "❌ L'heure n'est pas correcte !", flags: MessageFlags.Ephemeral });

                const fromTimezone = moment.tz(currentTime, fromUnit);
                const toTimezone = fromTimezone.clone().tz(toUnit);
                const fromResult = fromTimezone.locale("fr").format("Do MMMM YYYY, H:mm");
                const toResult = toTimezone.locale("fr").format("Do MMMM YYYY, H:mm");
                let fromTimezomeName = moment.tz.zone(fromUnit).abbr();
                let toTimezomeName = moment.tz.zone(toUnit).abbr();
                const fromTimezomeCountryCode = fromUnit.split("/").at(-1).replaceAll("_", " ");
                const toTimezomeCountryCode = toUnit.split("/").at(-1).replaceAll("_", " ");

                isNaN(fromTimezomeName) ? fromTimezomeName : fromTimezomeName = moment.tz.zone(fromUnit).abbrs.at(0);
                isNaN(toTimezomeName) ? toTimezomeName : toTimezomeName = moment.tz.zone(toUnit).abbrs.at(0);

                await interaction.reply({ content: `${fromResult} ${fromTimezomeName} ${fromTimezomeCountryCode} = **${toResult} ${toTimezomeName} ${toTimezomeCountryCode}** !` });
            } else {
                const result = convert(value, fromUnit).to(toUnit);
                const cleanUnits = {
                    "turn": " tour(s)",
                    "C": "°C",
                    "F": "°F",
                    "K": "°K",
                    "R": "°R",
                    "centuries": " siècles",
                    "millenia": " millénaire"
                };

                await interaction.reply({ content: `${value}${cleanUnits[fromUnit] || fromUnit} = **${result}${cleanUnits[toUnit] || toUnit}** !` });
            }
        } catch (error) {
            await sendError(interaction, client, error);
        }
    }
};