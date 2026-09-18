const reportMessageActions = require("./src/informations/report-message-actions.js");
const changeTeamActions = require("./src/games/change-team.js");
const transactionActions = require("./src/games/transaction-actions.js");

modalList = {
    "report-message": reportMessageActions,
    "change-team": changeTeamActions,
    "transaction": transactionActions
};

module.exports = { modalList };