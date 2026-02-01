const helpActions = require("./src/informations/help-actions.js");
const adventureActions = require("./src/games/adventure-actions.js");
const shopActions = require("./src/games/shop-actions.js");

selectMenuList = {
    "help": helpActions,
    "adventure": adventureActions,
    "shop": shopActions,
}

module.exports = { selectMenuList };