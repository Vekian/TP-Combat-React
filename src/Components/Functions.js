export function checkAvailabilityCapacity(attack, player){
    switch (attack.cost.type) {
        case "pv":
            if (attack.cost.value < player.pv || attack.id === "suicide"){
                if (((attack.power.type === "mana") && (player.mana >= player.manaMax))  && attack.id !== "suicide"){
                    return false;
                }
                return true;
            }
            return false;
        case "mana": 
            if (attack.cost.value <= player.mana){
                if ((attack.power.type === "pv") && (player.pv >= player.pvMax)){
                    return false;
                }
                return true;
            }
            return false;
        default: 
            break;
    }}

export function checkMax(charge, value, valueMax) {
    if (charge > (valueMax - value)){
        return (valueMax - value);
    }
    return charge;
}


export function displayAnimation(target, nameClass){
    target.classList.add(nameClass);
    setTimeout(() => {
        target.classList.remove(nameClass);
    }, 1000);
}

export function getTarget(players, target){
    let kenny = players.find(player => player.name === "Kenny");
    if (kenny.isDead === false){
        target = kenny;
        return target;
    }
    let playersAlive = players.filter(player => player.isDead === false);
    target = playersAlive[Math.floor(Math.random() * playersAlive.length)];
    return target;

}

export function clickImg(player, dispatch, swapAvatar){
    let payload = {
        id: player.id,
        charge1: player.avatar,
        charge2: player.avatarHover
    }
    dispatch(swapAvatar(payload))
    document.getElementById(player.name + player.id).classList.toggle("imgClick");
    setTimeout(() => {
        let payload2 = {
            id: player.id,
            charge1: player.avatarHover,
            charge2: player.avatar
        }
        dispatch(swapAvatar(payload2))
        document.getElementById(player.name + player.id).classList.toggle("imgClick");
    }, 1000)
}
    