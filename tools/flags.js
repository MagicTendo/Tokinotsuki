const { capitalize } = require("./modules.js");

const adventureFlags = {
    "none": 0,
    "failed": 1,
    "yukidamiSuccess": 2,
    "yogandaichiSuccess": 3,
    "tennenrinSuccess": 4,
    "reidaihosunSuccess": 5,
    "iryujonSuccess": 6,
    "arkotalanSuccess": 7,
};

const questFlags = {
    "uncomplete": 0,
    "done": 1,
    "completed": 2
}

const teamFlags = {
    null: 0,
    "graniti": 1,
    "pimentes": 2,
    "mentis": 3,
    "champiture": 4
};

const tictactoeFlags = {
    "tokiWin": 0,
    "userWin": 1,
    "tie": 2,
    "continue": 3
};

async function flagToTeam(flag) {
    const team = Object.keys(teamFlags).find(team => teamFlags[team] == flag);
    const teamName = capitalize(team);

    return teamName;
}

module.exports = { adventureFlags, questFlags, teamFlags, tictactoeFlags, flagToTeam };