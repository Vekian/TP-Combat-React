import { createSlice } from "@reduxjs/toolkit"
const initialState = {
// TODO : Compléter "players" et "monster"
    players: [

    ],
    monster: {
        name: "Hommeoursporc",
        pv : "800",
        pvMax: "800",
        attack: 20,
        defense: 10,
        dodge: 5,
        bgType: "bg-danger",
        faType: "fa-heart",
        barName: ' : pv',
        isAvailable: true,
        status: [
            {type: "poison", turns: 0},
            {type: "stun", turns: 0},
        ],
        buffs: {attack: {value: 0, turns: 0}, 
            defense: {value: 0, turns: 0}, 
            dodge: {value: 0, turns: 0}
        },
    },
    game : {
        isLoaded: false,
        turn: 1,
        numberPlayersPlayed: 0,
        numberPlayersDead: 0,
        lastAction: ["Que le combat commence !"],
        target: [],
    }
    
}

export const fightSlice = createSlice({
    name: "fight",
    initialState,
    reducers: {
        loadGame: (state, action) => {
            state.game.isLoaded = true;
        },
        hitMonster: (state, action) => {
            state.monster.pv -= action.payload.charge1;
        },
        swapAvatar: (state, action) => {
            const playerIndex = state.players.findIndex(player => player.id === action.payload.id);
            state.players[playerIndex].avatar = action.payload.charge2;
            state.players[playerIndex].avatarHover = action.payload.charge1;
        },
        chargePlayers: (state, action) => {
            const playersData = action.payload;
            state.players = [];
            for (let player of playersData) {
                state.players.push(player);
            }
        },
        changeHealthPlayer: (state, action) => {
            console.log(action.payload);
            const playerIndex = state.players.findIndex(player => player.id === action.payload.id);
            state.players[playerIndex].pv += action.payload.charge1;
        },  
        changeManaPlayer: (state, action) => {
            const playerIndex = state.players.findIndex(player => player.id === action.payload.id);
            
            state.players[playerIndex].mana += action.payload.charge1;
        },
        changeAttackBuff: (state, action) => {
            if (action.payload.id === 0){
                state.monster.buffs.attack.value += action.payload.charge1;
                state.monster.buffs.attack.turns += action.payload.charge2;
            }
            else {
                const playerIndex = state.players.findIndex(player => player.id === action.payload.id);
                state.players[playerIndex].buffs.attack.value += action.payload.charge1;
                state.players[playerIndex].buffs.attack.turns += action.payload.charge2;
            }
        },
        changeDefenseBuff: (state, action) => {
            if (action.payload.id === 0){
                state.monster.buffs.defense.value += action.payload.charge1;
                state.monster.buffs.defense.turns += action.payload.charge2;
            }
            else {
                const playerIndex = state.players.findIndex(player => player.id === action.payload.id);
                state.players[playerIndex].buffs.defense.value += action.payload.charge1;
                state.players[playerIndex].buffs.defense.turns += action.payload.charge2;
            }
        },
        changeDodgeBuff: (state, action) => {
            if (action.payload.id === 0){
                state.monster.buffs.dodge.value += action.payload.charge1;
                state.monster.buffs.dodge.turns += action.payload.charge2;
            }
            else {
                const playerIndex = state.players.findIndex(player => player.id === action.payload.id);
                state.players[playerIndex].buffs.dodge.value += action.payload.charge1;
                state.players[playerIndex].buffs.dodge.turns += action.payload.charge2;
            }
        },
        playerPlayed: (state, action) => {
            const playerIndex = state.players.findIndex(player => player.id === action.payload.id);
            state.players[playerIndex].isAvailable = false; 
            state.game.numberPlayersPlayed++;
        },
        monsterPlayed: (state, action) => {
            state.monster.isAvailable = action.payload.charge1;
        },
        playerDead: (state, action) => {
            const playerIndex = state.players.findIndex(player => player.id === action.payload.id);
            state.players[playerIndex].isAvailable = false; 
            state.players[playerIndex].isDead = action.payload.charge2; 
            state.game.numberPlayersDead += action.payload.charge1;
        },
        changeTarget: (state, action) => {
            state.game.target = [action.payload];
        },
        changeStatus: (state, action) => {
            const playerIndex = state.players.findIndex(player => player.id === action.payload.id);
            const statusIndex = state.players[playerIndex].status.findIndex(status => status.type === action.payload.charge2);
            if(statusIndex === -1){
               let newStatus = {type: action.payload.charge2, turns: action.payload.charge1};
               state.players[playerIndex].status.push(newStatus);
            }
            else {
                state.players[playerIndex].status[statusIndex].turns += action.payload.charge1; 
            }
        },
        changeStatusMonster: (state, action) => {
            const statusIndex = state.monster.status.findIndex(status => status.type === action.payload.charge2)
            state.monster.status[statusIndex].turns += action.payload.charge1; 
        },
        changeBuff: (state, action) => {
            if (action.payload.id === 0){
                state.monster.buffs[action.payload.charge2].turns += action.payload.charge1; 
            }
            else {
                const playerIndex = state.players.findIndex(player => player.id === action.payload.id);
                state.players[playerIndex].buffs[action.payload.charge2].turns += action.payload.charge1; 
            }
        },
        displayLastAction: (state, action) => {
            if(action.payload.id === "new"){
                state.game.lastAction = [];
            }
            state.game.lastAction.push(action.payload.charge1);
        },
        newTurn: (state, action) => {
            state.players.map(player => player.isDead ? null : player.isAvailable = true);
            state.monster.isAvailable = true;
            state.game.numberPlayersPlayed = 0;
            state.turn++;
        },
    },
})
export default fightSlice.reducer
export const { loadGame, hitMonster, swapAvatar, chargePlayers, changeHealthPlayer, changeAttackBuff, changeDefenseBuff, changeDodgeBuff, changeStatus, changeBuff, changeStatusMonster, changeManaPlayer, changeTarget, playerPlayed, monsterPlayed, playerDead, newTurn, displayLastAction} = fightSlice.actions