import React from 'react';
import { checkAvailabilityCapacity, clickImg, checkMax } from "./Functions.js"
import { useDispatch, useSelector } from 'react-redux'
import { hitMonster, swapAvatar, displayLastAction, changeHealthPlayer, changeAttackBuff, changeDefenseBuff, changeDodgeBuff, changeManaPlayer, playerPlayed, changeStatusMonster, changeStatus} from '../features/fight/fightSlice.js'

function ButtonCapacity({player, attack}) {
    const dispatch = useDispatch();
    const target = useSelector(state => state.fight.game.target[0]);
    const players = useSelector(state => state.fight.players);
    const monster = useSelector(state => state.fight.monster);
    const idButtonMonster = document.getElementById("degatsMonster");
    const idButtonPlayer = document.getElementById("degats" + player.name);

    function displayDegatsMonster(id, degats){
        if (id === 0){
            idButtonMonster.innerHTML = `<img src="img/damage.png" alt="dmg" height="40px" width="40px">
            <div class="centered">${degats}</div>`;
            idButtonMonster.classList.toggle("animationAffichageDesDegats");
            setTimeout(() => {idButtonMonster.classList.toggle("animationAffichageDesDegats");
            idButtonMonster.innerHTML = "";}, 600)
        }
        else {
            idButtonPlayer.id = "degatsPlayer";
            idButtonPlayer.innerHTML = `<img src="img/damage.png" alt="dmg" height="40px" width="40px">
            <div class="centeredPlayer">${degats}</div>`;
            idButtonPlayer.classList.toggle("animationAffichageDesDegats");
            setTimeout(() => {idButtonPlayer.classList.toggle("animationAffichageDesDegats");
            idButtonPlayer.innerHTML = "";
            idButtonPlayer.id = "degats" + player.name}, 600)
        }
        
    }

    function getAttack(attack, player) {
        let payload = {
            id: player.id,
            charge1: 0,
            charge2: 0,
        }
        function heal(attack, player){
            payload.charge1 = -5;
            if (checkAvailabilityCapacity(attack, player)){
                dispatch(changeManaPlayer(payload));
                let newCharge  = 10;
                payload.charge1 = checkMax(newCharge, player.pv, player.pvMax);
                dispatch(changeHealthPlayer(payload));
                let payload2 = {
                    id: "new",
                    charge1: player.name + " récupère " + payload.charge1 + " points de vie"
                }
                dispatch(displayLastAction(payload2));
                dispatch(playerPlayed(player));
            }
        }
        function mana(attack, player){
            payload.charge1 = attack.cost.value * -1;
            if (checkAvailabilityCapacity(attack, player)) {
                dispatch(changeHealthPlayer(payload));
                displayDegatsMonster(player.id, Math.abs(payload.charge1));
                let newCharge = 10;
                payload.charge1 = checkMax(newCharge, player.mana, player.manaMax);
                dispatch(changeManaPlayer(payload));
                let payload2 = {
                    id: "new",
                    charge1: player.name + " récupère " + payload.charge1 + " points de mana"
                }
                dispatch(displayLastAction(payload2));
                dispatch(playerPlayed(player));
            }
        }

        function buffAttack(attack, player, players){
            payload.charge1 = attack.cost.value * -1;
            if (checkAvailabilityCapacity(attack, player)){
                dispatch(changeManaPlayer(payload));
                clickImg(player, dispatch, swapAvatar)
                for (let playerAtk of players){
                    payload.id = playerAtk.id;
                    payload.charge1 = 10;
                    payload.charge2 = 3;
                    dispatch(changeAttackBuff(payload));
                };
                let payload2 = {
                    id: "new",
                    charge1: player.name + " boost l'attaque de toute l'équipe de 10"
                }
                dispatch(displayLastAction(payload2));
                dispatch(playerPlayed(player));
            }
        }

        function peaceInWorld(attack, player, players){
            payload.charge1 = (attack.cost.value * -1);
            if (checkAvailabilityCapacity(attack, player)){
                dispatch(changeHealthPlayer(payload));
                displayDegatsMonster(player.id, Math.abs(payload.charge1));
                let newCharge = attack.power.value;
                let message = player.name + " sacrifie " + attack.cost.value + " points de vie pour soigner ";
                for (let playerHeal of players){
                    if ((playerHeal.name !== player.name) && playerHeal.pv > 0){
                        payload.id = playerHeal.id;
                        payload.charge1 = checkMax(newCharge, playerHeal.pv, playerHeal.pvMax);
                        dispatch(changeHealthPlayer(payload));
                        message += payload.charge1 + " point de vie à " + playerHeal.name + ", ";
                    }
                }
                let payload2 = {
                    id: "new",
                    charge1: message
                }
                dispatch(displayLastAction(payload2));
                dispatch(playerPlayed(player));
            }
        }

        function circoncision (attack, player) {
            if (checkAvailabilityCapacity(attack, player)){
                payload.charge1 = (attack.cost.value * -1);
                dispatch(changeManaPlayer(payload));
                if (Math.floor(Math.random() * 100) + 1  > (monster.dodge + monster.buffs.dodge.value)){
                    payload.charge1 = attack.power.value + player.attack + player.buffs.attack.value;
                    dispatch(hitMonster(payload));

                    displayDegatsMonster(0, payload.charge1);
                    payload.id = 0;
                    payload.charge1 = attack.power.value *-1;
                    payload.charge2 = attack.effect.value;
                    dispatch(changeDefenseBuff(payload));

                    let payload2 = {
                    id: "new",
                    charge1: player.name + " inflige " + Math.abs(payload.charge1) + " dommages et diminue la défense de " + monster.name + " de " + attack.power.value + " pendant " + attack.effect.value + " tours"
                    }
                    dispatch(displayLastAction(payload2));
                }
                else {
                    let payload2 = {
                        id: "new",
                        charge1 : monster.name + " esquive le coup"
                    };
                    dispatch(displayLastAction(payload2));
                }
                
                hitBack();
                dispatch(playerPlayed(player));
            }
        }

        function manaAll(attack, player, players){
            payload.charge1 = (attack.cost.value * -1);
            if (checkAvailabilityCapacity(attack, player)){
                dispatch(changeHealthPlayer(payload));
                displayDegatsMonster(player.id, Math.abs(payload.charge1));
                let newCharge = attack.power.value;
                let message = player.name + " sacrifie " + attack.cost.value + " points de vie pour donner ";
                for (let playerMana of players){
                    if (playerMana.name !== player.name && playerMana.pv > 0){
                        payload.id = playerMana.id;
                        payload.charge1 = checkMax(newCharge, playerMana.mana, playerMana.manaMax);
                        dispatch(changeManaPlayer(payload));
                        message += payload.charge1 + " point de mana à " + playerMana.name + ", ";
                    }
                }
                let payload2 = {
                    id: "new",
                    charge1: message
                }
                dispatch(displayLastAction(payload2));
                dispatch(playerPlayed(player));
            }
        }

        function kickBalls(attack, player) {
            payload.charge1 = attack.cost.value * (-1);
            if (checkAvailabilityCapacity(attack, player)){
                dispatch(changeManaPlayer(payload));
                if (Math.floor(Math.random() * 100) + 1  > (monster.dodge + monster.buffs.dodge.value)){
                    payload.charge1 = (attack.power.value + player.attack + player.buffs.attack.value) - (monster.defense + monster.buffs.defense.value);
                    let message = player.name + " tabasse les testicules de " + monster.name + " et inflige " + payload.charge1 + " dommages";
                    dispatch(hitMonster(payload));
                    displayDegatsMonster(0, payload.charge1);
                    if(Math.floor(Math.random() * 100) + 1 <= 30 - monster.dodge) {
                        payload.charge1 = attack.effect.value;
                        payload.charge2 = attack.effect.type;
                        message += ", le paralysant pour " + attack.effect.value + " tours";
                        dispatch(changeStatusMonster(payload));
                        let payload2 = {
                            id: "new",
                            charge1 : message
                            };
                        dispatch(displayLastAction(payload2));
                    }
                    else {
                        let payload2 = {
                        id: "new",
                        charge1 : message
                        };
                        dispatch(displayLastAction(payload2));
                        hitBack();
                    }
                    
                }
                else {
                    let payload2 = {
                        id: "new",
                        charge1 : monster.name + " esquive le coup"
                    };
                    dispatch(displayLastAction(payload2));
                }
                dispatch(playerPlayed(player));
            }
        }

        function tampon(attack, player){
            payload.charge1 = attack.cost.value * (-1);
            if (checkAvailabilityCapacity(attack, player)){
                dispatch(changeManaPlayer(payload));
                if (Math.floor(Math.random() * 100) + 1  > (monster.dodge + monster.buffs.dodge.value)){
                    payload.charge1 = (attack.power.value + player.attack + player.buffs.attack.value) - (monster.defense + monster.buffs.defense.value);
                    dispatch(hitMonster(payload));
                    displayDegatsMonster(0, payload.charge1);
                    payload.charge1 = attack.effect.value;
                    payload.charge2 = attack.effect.type;
                    dispatch(changeStatusMonster(payload));
                    let payload2 = {
                        id: "new",
                        charge1 : player.name + " lance un tampon usagé et inflige " + attack.power.value + " dommages à " + monster.name + " et l'empoisonne pour " + attack.effect.value + " tours"
                    };
                    dispatch(displayLastAction(payload2));
                }
                else {
                    let payload2 = {
                        id: "new",
                        charge1 : monster.name + " esquive le coup"
                    };
                    dispatch(displayLastAction(payload2));
                }
                
                dispatch(playerPlayed(player));
            }
        }

        function deathHippie(attack, player){
            if (checkAvailabilityCapacity(attack, player)){
                payload.charge1 = attack.cost.value * -1;
                dispatch(changeManaPlayer(payload));
                clickImg(player, dispatch, swapAvatar)
                payload.charge1 = attack.power.value;
                payload.charge2 = attack.effect.value;
                dispatch(changeAttackBuff(payload));
                dispatch(changeDefenseBuff(payload));
                let payload2 = {
                    id: "new",
                    charge1 : player.name + " dépense " + attack.cost.value + " mana pour booster son attaque et sa défense de " + attack.power.value
                };
                dispatch(displayLastAction(payload2));
                dispatch(playerPlayed(player));
            }
        }

        function pissChat(attack, player) {
            if (checkAvailabilityCapacity(attack, player)){
                payload.charge1 = attack.cost.value * -1;
                clickImg(player, dispatch, swapAvatar)
                dispatch(changeHealthPlayer(payload));
                displayDegatsMonster(player.id, Math.abs(payload.charge1));
                dispatch(playerPlayed(player));
                payload.charge1 = attack.power.value;
                payload.charge2 = attack.effect.value;
                dispatch(changeAttackBuff(payload));
                dispatch(changeDefenseBuff(payload));
                dispatch(changeDodgeBuff(payload));
            }
        }

        function peste(attack, player){
            if (checkAvailabilityCapacity(attack, player)){
                payload.charge1 = attack.cost.value * -1;
                dispatch(changeHealthPlayer(payload));
                displayDegatsMonster(player.id, Math.abs(payload.charge1));
                payload.charge1 = attack.power.value;
                payload.charge2 = attack.power.type;
                dispatch(changeStatus(payload));
                payload.charge1 = attack.effect.value;
                payload.charge2 = attack.effect.type;
                dispatch(changeStatus(payload));
                let payload2 = {
                    id: "new",
                    charge1 : player.name + " attrape la peste, devient empoisonné pour " + attack.effect.value + " tours, mais empoisonne l'ennemi dès qu'il attaque " + player.name
                };
                dispatch(displayLastAction(payload2));
                dispatch(playerPlayed(player));
            }
        }

        function suicide(attack, player){
            payload.charge1 = attack.cost.value * -1;
            dispatch(changeHealthPlayer(payload));
            displayDegatsMonster(player.id, Math.abs(payload.charge1));
            let newCharge = attack.power.value;
            let message = player.name + "sacrifie " + attack.cost.value + " points de vie pour donner ";
            for (let playerMana of players){
                if (playerMana.name !== player.name && playerMana.pv > 0){
                    payload.id = playerMana.id;
                    payload.charge1 = checkMax(newCharge, playerMana.mana, playerMana.manaMax);
                    dispatch(changeManaPlayer(payload));
                    message += payload.charge1 + " point de mana à " + playerMana.name + ", ";
                }
            }
            let payload2 = {
                id: "new",
                charge1 : message
            };
            dispatch(displayLastAction(payload2));
            dispatch(playerPlayed(player));
        }

        function strongAttack(attack, player){
            if (checkAvailabilityCapacity(attack, player)){
                payload.charge1 = attack.power.value + player.attack + player.buffs.attack.value - (monster.defense + monster.buffs.defense.value);
                dispatch(hitMonster(payload));
                displayDegatsMonster(0, payload.charge1);
                let payload2 = {
                    id: "new",
                    charge1 : player.name + " inflige " + payload.charge1 + " dommages à " + monster.name + " perdant " + attack.cost.value + " points de mana"
                };
                payload.charge1 = attack.cost.value * -1;
                dispatch(changeManaPlayer(payload));
                dispatch(displayLastAction(payload2));
                hitBack();
                dispatch(playerPlayed(player));
            }
        }

        function triggerPeste(player){
            for (let status of player.status){
                if (status.type === "peste") {
                    payload.charge1 = 3;
                    payload.charge2 = "poison";
                    dispatch(changeStatusMonster(payload));
                    let payload2 = {
                        id: "add",
                        charge1 : monster.name + " contracte la peste et est empoisonné pour " + payload.charge1 + " tours"
                    };
                    dispatch(displayLastAction(payload2));
                    break;
                }
            }
        }

        function hitBack(){
            let rand = Math.floor(Math.random() * 10);
            let stunIndex = monster.status.findIndex(status => status.type === "stun");
            if (rand < 5 && monster.status[stunIndex].turns === 0){
                payload.charge1 = -25;
                if (target.pv > 0){
                    payload.id = target.id;
                    triggerPeste(target);
                }
                else {
                    triggerPeste(player);
                }
                dispatch(changeHealthPlayer(payload));
                let payload2 = {
                    id: "add",
                    charge1: monster.name + " riposte et inflige " + Math.abs(payload.charge1) + " dommages à " + target.name
                }
                dispatch(displayLastAction(payload2));
            }
        }

        switch (attack.id){
            case "buffAtckStan": 
                buffAttack(attack, player, players);
                break;
            case "soloGuit": 
                manaAll(attack, player, players);
                break;
            case "kickBalls":
                kickBalls(attack, player);
                break;
            case "pisseChat":
                pissChat(attack, player);
                break;
            case "heal": 
                heal(attack, player);
                break;
            case "mana": 
                mana(attack, player);
                break;
            case "strong":
                strongAttack(attack, player);
                break;
            case "peaceInWorld":
                peaceInWorld(attack, player, players);
                break;
            case "circoncision":
                circoncision(attack, player);
                break;
            case "tampon":
                tampon(attack, player);
                break;
            case "deathHippie":
                deathHippie(attack, player);
                break;
            case "peste":
                peste(attack, player);
                break;
            case "suicide":
                suicide(attack, player);
                break;
            default:
                payload.charge1 = attack.power.value + player.attack + player.buffs.attack.value;
                dispatch(hitMonster(payload));
                displayDegatsMonster(0, payload.charge1);
                let payload2 = {
                    id: "new",
                    charge1: player.name + " inflige " + payload.charge1 + " dommages à " + monster.name
                  }
                  dispatch(displayLastAction(payload2));
                dispatch(playerPlayed(player));
                hitBack();
                break;
        }
        }
        
    function checkTurn(player) {
        if (!(player.isDead) && (player.isAvailable)) {
            return true;
        }
        return false;
    }
    
    const handleHit = (event) => {
        if (checkTurn(player)) {
            getAttack(attack, player);
        }
        
      };


    return (

            <button type="button" onClick={(event) => handleHit(event)} className={`btn d-flex flex-wrap justify-content-center toolTip top  ${checkAvailabilityCapacity(attack, player) ? "capacityValid" : "capacityInvalid"} mt-xxl-2 mb-xxl-1 mb-2 `} data-tip={attack.description} >
                <span className="capacityDescription">{attack.name} </span>
            <div>
            <span className={`ms-2`}>{attack.power.value}</span><i className={` ${attack.power.type === "peste" && "fas fa-skull ms-2"} ${attack.power.type === "buffAtk" && "fa-solid fa-person-arrow-up-from-line ms-2"} ${attack.power.type === "mana" && "fas fa-fire-alt ms-2"} ${attack.power.type === "pv" && "fa-solid fa-heart ms-2"} ${attack.power.type === "attack" && "fas fa-bomb ms-2"}`}></i>
            {attack.cost.value === 0 ? (
                null
            ) : (
                <span>
                    <span className='ms-3'>-{attack.cost.value}</span>
                    <i className={` ${attack.cost.type === "mana" ? "fas fa-fire-alt ms-2" : ""} ${attack.cost.type === "pv" ? "fa-solid fa-heart ms-2" : ""} ${attack.cost.type === "attack" ? "fas fa-bomb ms-2" : ""}`}></i>
                </span>
            )}
            </div>
            </button>
        )
}



export default ButtonCapacity;