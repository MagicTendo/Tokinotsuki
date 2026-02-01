const pingActions = require("./src/informations/ping-actions.js");
const reportActions = require("./src/informations/report-actions.js");
const oldFishActions = require("./src/fun/old-fish-actions.js");
const scpActions = require("./src/fun/scp-actions.js");
const adventureActions = require("./src/games/adventure-actions.js");
const gameItemActions = require("./src/games/game-item-actions.js");
const cardsActions = require("./src/games/cards-actions.js");
const blackjackActions = require("./src/games/blackjack-actions.js");
const fightActions = require("./src/games/fight-actions.js");
const pikPikActions = require("./src/games/pikpik-actions.js");
const shopActions = require("./src/games/shop-actions.js");
const taskActions = require("./src/games/task-actions.js");
const tictactoeActions = require("./src/games/tictactoe-actions.js");
const teamActions = require("./src/games/team-actions.js");
const clearChannelActions = require("./src/utility/clear-channel-actions.js");
const ticketActions = require("./src/utility/ticket-actions.js");
const todoActions = require("./src/utility/todo-actions.js");
const bakaButtonActions = require("./src/guild/baka-button-actions.js");

buttonList = {
    "ping": pingActions,
    "report": reportActions,
    "old-fish": oldFishActions,
    "scp": scpActions,
    "adventure": adventureActions,
    "item": gameItemActions,
    "cards": cardsActions,
    "blackjack": blackjackActions,
    "fight": fightActions,
    "pikpik": pikPikActions,
    "shop": shopActions,
    "task": taskActions,
    "tictactoe": tictactoeActions,
    "team": teamActions,
    "clear-channel": clearChannelActions,
    "ticket": ticketActions,
    "todo": todoActions,
    "baka-button": bakaButtonActions
}

module.exports = { buttonList };