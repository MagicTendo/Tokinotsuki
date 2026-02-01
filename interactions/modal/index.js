const reportMessageActions = require("./src/informations/report-message-actions.js");
const transactionActions = require("./src/games/transaction-actions.js");

modalList = {
    "report-message": reportMessageActions,
    "transaction": transactionActions
}

module.exports = { modalList };