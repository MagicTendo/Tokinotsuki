const { capitalise } = require("./modules.js");

const adventureFlags = {
    "none": 0,
    "failed": 1,
    "yukamiSuccess": 2,
    "yokanatcciSuccess": 3,
    "tenerinaSuccess": 4,
    "otsorayoSuccess": 5,
    "surusikiSuccess": 6,
    "reinaisuSuccess": 7,
    "iyiyaSuccess": 8,
    "arukotaSuccess": 9
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
    const teamName = capitalise(team);

    return teamName;
}

module.exports = { adventureFlags, questFlags, teamFlags, tictactoeFlags, flagToTeam };