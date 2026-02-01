const fishTable = {
    "Un|Le|bururumiya": { probability: 20, color: [46, 152, 240], emoji: "🐟️", shadow: "❔", name: "bururumiya", price: 150 },
    "Une|L'|algue": { probability: 15, color: [12, 69, 6], emoji: "🌱", shadow: "❔", name: "seaweed", price: 250 },
    "Un|Le|miyanukira": { probability: 15, color: [166, 67, 18], emoji: "➰", shadow: "❔", name: "miyanukira", price: 250 },
    "Un|Le|miyasani": { probability: 15, color: [195, 201, 201], emoji: "🪽", shadow: "❔", name: "miyasani", price: 250 },
    "Une|La|norositsono": { probability: 10, color: [146, 134, 181], emoji: "🪼", shadow: "❔", name: "norositsono", price: 500 },
    "Un|Le|miyafoi": { probability: 10, color: [61, 162, 209], emoji: "▫️", shadow: "❔", name: "miyafoi", price: 500 },
    "Un|Le|miyakitsu": { probability: 5, color: [255, 85, 0], emoji: "🕘️", shadow: "❔", name: "miyakitsu", currency: "cookie", price: 3 },
    "Un|Le|miyasumira": { probability: 5, color: [61, 2, 15], emoji: "🌌", shadow: "❔", name: "miyasumira", price: 750 },
    "Un|Le|miyanerami": { probability: 2.5, color: [115, 14, 14], emoji: "🤨", shadow: "❔", name: "miyanerami", price: 1_000 },
    "Un|Le|miyakitcci": { probability: 1, color: [38, 117, 67], emoji: "🌵", shadow: "❔", name: "miyakitcci", price: 1_500 },
    "Un|Le|miyasiniri": { probability: 0.75, color: [129, 198, 230], emoji: "🕯️", shadow: "❔", name: "miyasiniri", price: 2_500 },
    "Un|Le|miyasiniru": { probability: 0.3, color: [219, 18, 209], emoji: "✨", shadow: "❔", name: "miyasiniru", price: 5_000 },
    "Un|Le|miyatsutsari": { probability: 0.2, color: [23, 76, 79], emoji: "🌀", shadow: "❔", name: "miyatsutsari", price: 7_500 },
    "Un|Le|miyašana": { probability: 0.15, color: [16, 0, 43], emoji: "🌑", shadow: "❔", name: "miyasana", price: 9_000 },
    "Un|Le|miyarono": { probability: 0.1, color: [14, 21, 48], emoji: "🦈", shadow: "❔", name: "miyarono", price: 10_000, secret: true }
};

const fishes = Object.values(fishTable).map(fish => fish.name);

const oreTable = {
    "broken": { probability: 7.5, color: [168, 3, 0], name: "broken", price: 0 },
    "path": { probability: 5, color: [23, 42, 69], name: "path", price: 0 },
    "Un|Le|caillou": { probability: 20, color: [87, 87, 87], emoji: "🪨", shadow: "❔", name: "rock", price: 500 },
    "Un|Le|tekanorisi": { probability: 15, color: [173, 255, 250], emoji: "❄️", shadow: "❔", name: "tekanorisi", price: 750 },
    "Un|Le|tekaotsi": { probability: 15, color: [250, 217, 155], emoji: "🔆", shadow: "❔", name: "tekaotsi", price: 750 },
    "Un|Le|tekatenari": { probability: 10, color: [166, 67, 18], emoji: "⬜️", shadow: "❔", name: "tekatenari", price: 900 },
    "Un|Le|tekakiniru": { probability: 10, color: [146, 134, 181], emoji: "🟣", shadow: "❔", name: "tekakiniru", price: 900 },
    "Un|Le|tekatsono": { probability: 5, color: [235, 157, 191], emoji: "⚪️", shadow: "❔", name: "tekatsono", price: 1_000 },
    "Un|Le|tekakitsu": { probability: 5, color: [255, 184, 145], emoji: "🕘️", shadow: "❔", name: "tekakitsu", currency: "cookie", price: 5 },
    "Un|Le|tekatccora": { probability: 2.5, color: [255, 85, 0], emoji: "⚫️", shadow: "❔", name: "tekatccora", price: 2_000 },
    "Un|Le|tekapafi": { probability: 2.5, color: [110, 27, 9], emoji: "▫️", shadow: "❔", name: "tekapafi", price: 2_000 },
    "Un|Le|tekatcceni": { probability: 1, color: [12, 69, 6], emoji: "🟢", shadow: "❔", name: "tekatcceni", price: 5_000 },
    "Un|Le|tekayikoa": { probability: 0.75, color: [217, 171, 63], emoji: "🟡", shadow: "❔", name: "tekayikoa", price: 7_500 },
    "Un|Le|tekayuru": { probability: 0.3, color: [38, 117, 67], emoji: "🔵", shadow: "❔", name: "tekayuru", price: 10_000 },
    "Un|Le|tekaroka": { probability: 0.2, color: [16, 0, 43], emoji: "🔴", shadow: "❔", name: "tekaroka", price: 15_000 },
    "Un|Le|tekanoki": { probability: 0.15, color: [115, 14, 14], emoji: "♨️", shadow: "❔", name: "tekanoki", price: 20_000 },
    "Un|Le|takakumi": { probability: 0.1, color: [61, 162, 209], emoji: "🟪", shadow: "❔", name: "takakumi", price: 25_000 }
};

const ores = Object.values(oreTable).map(ore => ore.name).filter(ore => ore.price !== 0);

const artefactTable = {
    "Un|Le|morceau de tissu": { probability: 20, color: [166, 110, 50], emoji: "◻️", shadow: "❔", name: "fabric", price: 750 },
    "Une|La|fleur séchée": { probability: 15, color: [166, 110, 50], emoji: "🥀", shadow: "❔", name: "dried-flower", price: 1_000 },
    "Une|L'|ébauche incompréhensible": { probability: 15, color: [166, 110, 50], emoji: "📜", shadow: "❔", name: "sketch", price: 1_000 },
    "Un|L'|outil inconnu": { probability: 15, color: [166, 110, 50], emoji: "🔨", shadow: "❔", name: "tool", price: 1_000 },
    "Un|Le|stonkosan": { probability: 10, color: [166, 110, 50], emoji: "📈", shadow: "❔", name: "stonkosan", price: 2_500 },
    "Un|Le|stonkookie": { probability: 10, color: [166, 110, 50], emoji: "📊", shadow: "❔", name: "stonkookie", currency: "cookie", price: 10 },
    "Un|L'|appareil complexe": { probability: 5, color: [166, 110, 50], emoji: "⚙️", shadow: "❔", name: "machine", price: 5_000 },
    "Un|L'|os": { probability: 5, color: [255, 181, 171], emoji: "🦴", shadow: "❔", name: "bone", price: 5_000 },
    "Un|Le|ticket du temps": { probability: 2.5, color: [166, 110, 50], emoji: "🕘️", shadow: "❔", name: "time-ticket", currency: "cookie", price: 20 },
    "Un|Le|Yatosan": { probability: 1, color: [166, 110, 50], emoji: "🪙", shadow: "❔", name: "yatosan", price: 10_000 },
    "Une|L'|amulette": { probability: 0.75, color: [166, 110, 50], emoji: "🪬", shadow: "❔", name: "amulet", price: 12_500 },
    "Un|Le|crâne": { probability: 0.3, color: [255, 219, 171], emoji: "💀", shadow: "❔", name: "skull", price: 15_000 },
    "Un|Le|minaiya": { probability: 0.2, color: [166, 110, 50], emoji: "💎", shadow: "❔", name: "minaiya", price: 20_000 },
    "Un|Le|fragment sombre": { probability: 0.15, color: [166, 110, 50], emoji: "<:Fragment:1462199252297056420>", shadow: "❔", name: "fragment", price: 35_000 },
    "Un|Le|crystal clair": { probability: 0.1, color: [166, 110, 50], emoji: "🔮", shadow: "❔", name: "crystal", price: 50_000 }
};

const artefacts = Object.values(artefactTable).map(artefact => artefact.name);

const birdTable = {
    "blur": { probability: 30, color: [168, 3, 0], name: "blur", price: 0 },
    "Une|La|photo d'un bururusani": { probability: 20, color: [158, 202, 219], emoji: "🐦️", shadow: "❔", name: "bururusani", price: 1_000 },
    "Une|La|photo d'un sanifuruno": { probability: 15, color: [189, 191, 191], emoji: "☁️", shadow: "❔", name: "sanifuruno", price: 1_500 },
    "Une|La|photo d'un saniiramo": { probability: 12.5, color: [199, 158, 12], emoji: "🔦", shadow: "❔", name: "saniiramo", price: 2_500 },
    "Une|La|photo d'un sanikitcci": { probability: 10, color: [217, 217, 217], emoji: "🎯", shadow: "❔", name: "sanikitcci", price: 3_500 },
    "Une|La|photo d'un sanienu": { probability: 10, color: [107, 20, 0], emoji: "🔥", shadow: "❔", name: "sanienu", price: 3_500 },
    "Une|La|photo d'un sanikitsu": { probability: 10, color: [107, 20, 0], emoji: "🕘️", shadow: "❔", name: "sanikitsu", currency: "cookie", price: 3_500 },
    "Une|La|photo d'un saniruyu": { probability: 1.5, color: [0, 2, 36], emoji: "🔽", shadow: "❔", name: "saniruyu", price: 5_000 },
    "Une|La|photo d'un sinirireiri": { probability: 0.5, color: [186, 252, 255], emoji: "💙", shadow: "❔", name: "sinirireiri", price: 10_000 },
    "Une|La|photo d'un siniritsekino": { probability: 0.4, color: [189, 87, 25], emoji: "🧡", shadow: "❔", name: "siniritsekino", price: 25_000 },
    "Une|La|photo d'un sinirirenata": { probability: 0.1, color: [63, 14, 84], emoji: "💜", shadow: "❔", name: "sinirirenata", price: 50_000 }
};

const birds = Object.values(birdTable).map(bird => bird.name).filter(bird => bird.price !== 0);

const kerusunaTable = {
    "Un|Le|ping": { emoji: "🔴", name: "ping", price: 9 },
    "Une|La|provision alimentaire": { emoji: "🍽️", name: "food-provision", price: 250 },
    "Une|La|provision d'eau": { emoji: "💧", name: "water-provision", price: 500 },
    "Un|Le|kit de soin": { emoji: "⛑️", name: "care-kit", price: 1_500 },
    "Un|Le|kit de nuit": { emoji: "💤", name: "sleep-kit", price: 2_500 },
    "Une|La|canne à pêche": { emoji: "🎣", name: "fishing-rod", price: 1_500, unique: true },
    "Une|La|pioche": { emoji: "⛏️", name: "pickaxe", price: 15_000, unique: true },
    "Un|Le|pinceau": { emoji: "🖌️", name: "brush", price: 50_000, unique: true },
    "Un|L'|appareil photo": { emoji: "📷", name: "camera", price: 125_000, unique: true },
    "Un|Le|compte Foyllori": { emoji: "🏦", name: "bank", price: 25_000, unique: true },
    "Une|L'|amélioration du compte Foyllori": { emoji: "💴", name: "bank-capacity", price: 25_000 }
};

const cookieTable = {
    "Un|Le|cookie": { canSell: true, emoji: "🍪", name: "cookie", price: 90 },
    "Un|Le|paquet de 4 cartes": { currency: "cookie", emoji: "🎴", name: "booster-pack", price: 999 }
};

const upgradeTable = {
    "Une|L'|âme d'Inosayo": { emoji: "<:StraightSoul:1462199259557269688>", name: "inosayo", price: 50_000, unique: true },
    "Une|L'|âme d'Oseitena": { emoji: "<:RoundSoul:1462199256931631205>", name: "oseitena", price: 100_000, unique: true },
    "Une|L'|amélioration de canne à pêche": { currency: "questshroom", emoji: "🪝", name: "fishing-rod-upgrade", price: 3, unique: true },
    "Une|L'|amélioration de pioche": { currency: "questshroom", emoji: "⚒️", name: "pickaxe-upgrade", price: 3, unique: true },
    "Une|L'|amélioration de pinceau": { currency: "questshroom", emoji: "🎨", name: "brush-upgrade", price: 3, unique: true },
    "Une|L'|amélioration d'appareil photo": { currency: "questshroom", emoji: "📸", name: "camera-upgrade", price: 3, unique: true },
};

const cards = {
    "Aniyoni Yuyunori": { probability: 15, color: [0, 0, 0], emoji: "🌙", name: "yuyunori-card", type: "character" },
    "Yarinu Inosayo": { probability: 10, color: [0, 0, 0], emoji: "🌋", name: "inosayo-card", type: "character" },
    "Tcceyado Kafisana": { probability: 10, color: [0, 0, 0], emoji: "🌳", name: "kafisana-card", type: "character" },
    "Tsurika Ekayasena": { probability: 10, color: [0, 0, 0], emoji: "🎐", name: "ekayase-card", type: "character" },
    "Rinaki Isokitsu": { probability: 9, color: [0, 0, 0], emoji: "🕘️", name: "isokitsu-card", type: "character" },
    "Mefuyi Miyunira": { probability: 5, color: [0, 0, 0], emoji: "🎼", name: "miyunira-card", type: "character" },
    "Tukano Kerusuna": { probability: 5, color: [0, 0, 0], emoji: "🔎", name: "kerusuna-card", type: "character" },
    "Noisira Oseitena": { probability: 5, color: [0, 0, 0], emoji: "🌌", name: "oseitena-card", type: "character" },
    "Sarayi Reisifinaa": { probability: 5, color: [0, 0, 0], emoji: "🕯️", name: "reisifinaa-card", type: "character" },
    "Sorano Yatccuria": { probability: 5, color: [0, 0, 0], emoji: "🧪", name: "yatccuria-card", type: "character" },
    "Sorano Tcceisa": { probability: 5, color: [0, 0, 0], emoji: "📐", name: "tcceisa-card", type: "character" },
    "Kanoyarae Opukira": { probability: 5, color: [0, 0, 0], emoji: "⛏️", name: "opukira-card", type: "character" },
    "Foylrin Suyasomin": { probability: 5, color: [0, 0, 0], emoji: "💫", name: "suyasomin-card", type: "character" },
    "Foylrin Mijilse": { probability: 5, color: [0, 0, 0], emoji: "♠️", name: "mijilse-card", type: "character" },

    "Bururu Tsuru": { probability: 0.1, color: [0, 0, 0], emoji: "🟦", name: "tsuru-card", type: "bururu" },
    "Bururu Enu": { probability: 0.1, color: [0, 0, 0], emoji: "🔥", name: "enu-card", type: "bururu" },
    "Bururu Norisi": { probability: 0.1, color: [0, 0, 0], emoji: "🧊", name: "norisi-card", type: "bururu" },
    "Bururu Miya": { probability: 0.1, color: [0, 0, 0], emoji: "🐟️", name: "miya-card", type: "bururu" },
    "Bururu Sani": { probability: 0.1, color: [0, 0, 0], emoji: "🐦️", name: "sani-card", type: "bururu" },
    "Bururu Rono": { probability: 0.1, color: [0, 0, 0], emoji: "💪", name: "rono-card", type: "bururu" },
    "Bururu Tcceni": { probability: 0.1, color: [0, 0, 0], emoji: "🟩", name: "tcceni-card", type: "bururu" },
    "Bururu Ciniru": { probability: 0.1, color: [0, 0, 0], emoji: "🟪", name: "ciniru-card", type: "bururu" },
    "Bururu Sari": { probability: 0.1, color: [0, 0, 0], emoji: "🌠", name: "sari-card", type: "bururu" },
    "Bururu Foi": { probability: 0.1, color: [0, 0, 0], emoji: "▫️", name: "foi-card", type: "bururu" }
};

const itemTable = Object.assign({ "Toki Coin": { emoji: "🪙", name: "toki-coin" }, "Questshroom": { emoji: "🍄", name: "questshroom" }, "Paquet de cartes": { emoji: "🎴", name: "booster-pack" } }, kerusunaTable, cookieTable);
const items = ["toki-coin", "cookie", "questshroom", "booster-pack", "food-provision", "water-provision", "care-kit", "sleep-kit"];
const fakeItems = ["broken", "path", "fail", "blur"];
const allBuyableTables = [kerusunaTable, cookieTable, upgradeTable];
const allSellableTables = [fishTable, oreTable, artefactTable, birdTable, cookieTable];

const shopToItemTable = {
    "kerusuna": kerusunaTable,
    "tokinotsuki": cookieTable,
    "kafisana": fishTable,
    "opukira": oreTable,
    "tcceisa": artefactTable,
    "ekayasena": birdTable,
    "reisifinaa": upgradeTable
};

const uniqueItemEmojis = {
    "fishing-rod": "🎣",
    "fishing-rod-upgrade": "🪝",
    "pickaxe": "⛏️",
    "pickaxe-upgrade": "⚒️",
    "brush": "🖌️",
    "brush-upgrade": "🎨",
    "camera": "📷️",
    "camera-upgrade": "📸",
    "inosayo": "<:StraightSoul:1462199259557269688>",
    "oseitena": "<:RoundSoul:1462199256931631205>",
    "foyllori": "🏦"
}

module.exports = { fishTable, fishes, oreTable, ores, birdTable, birds, artefactTable, artefacts, kerusunaTable, cookieTable, upgradeTable, cards, itemTable, items, fakeItems, allBuyableTables, allSellableTables, shopToItemTable, uniqueItemEmojis };