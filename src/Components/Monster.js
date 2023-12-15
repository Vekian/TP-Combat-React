import React, { useEffect, useRef } from 'react';
import ProgressBar from './ProgressBar';
import { useDispatch, useSelector } from 'react-redux';
import { changeHealthPlayer, hitMonster, changeTarget, displayLastAction, changeStatus, changeStatusMonster, changeDefenseBuff, changeAttackBuff, monsterPlayed } from '../features/fight/fightSlice.js';
import { getTarget } from './Functions.js';

function Monster() {
  const dispatch = useDispatch();
  const monster = useSelector(state => state.fight.monster);
  const playersPlayed = useSelector(state => state.fight.game.numberPlayersPlayed);
  const playersDead = useSelector(state => state.fight.game.numberPlayersDead);
  const target = useSelector(state => state.fight.game.target[0]);
  const players = useSelector(state => state.fight.players);
  const idButton = document.getElementById(monster.id + monster.name);
  const isComponentMounted = useRef(false);
 
  useEffect(() => {
    let newTarget = getTarget(players, target);
    dispatch(changeTarget(newTarget));
    if (monster.pv < 0){
      let payload = {
        id: 0,
        charge1: 0
      }
      payload.charge1= (monster.pv);
        dispatch(hitMonster(payload));
      let payload2 = {
        id: "add",
        charge1: monster.name + " meurt en poussant cri bestial"
      }
      dispatch(displayLastAction(payload2));
    }
 
      if (!isComponentMounted.current) {
          isComponentMounted.current = true;
          return;
        }
      idButton.classList.toggle("animationDegatsCardMonster");
      setTimeout(() => {idButton.classList.toggle("animationDegatsCardMonster");}, 600)

  }, [monster.pv]);

  useEffect(() => {
    let stunIndex = monster.status.findIndex(status => status.type === "stun");
    
    if (playersPlayed === (4 - playersDead)  && playersDead !== 4 && (monster.status[stunIndex].turns === 0)) {
      if (monster.pv < 400 && monster.pv > 250) {
        attackAll(players);
      }

      else {
        if (monster.buffs.defense.value < -20 || monster.buffs.attack.value < -10) {
          debuff(monster);
          
        }
        else if (Math.floor(Math.random() * 100) + 1  > (target.dodge + target.buffs.dodge.value + 30) ){
          stun(target);
          
        }
        strongAttack(players, target);
      }
    }
    else if (playersPlayed === (4 - playersDead)  && playersDead !== 4){
      let payload = {
        id: 0, 
        charge1: false,
      }
      dispatch(monsterPlayed(payload));
    }
  }, [playersPlayed, playersDead, dispatch]);

  function strongAttack(players, target) {
    let payload = {
      id: 0, 
      charge1: 0,
      charge2: false,
    }
    let newTarget = getTarget(players, target);
    dispatch(changeTarget(newTarget));
      payload.id = newTarget.id;
      payload.charge1 = (-50 - (monster.attack + monster.buffs.attack.value) ) + newTarget.defense + newTarget.buffs.defense.value;
      if (Math.floor(Math.random() * 100) + 1 > (newTarget.dodge + newTarget.buffs.dodge.value) )
      {
        dispatch(changeHealthPlayer(payload));
        let payload2 = {
          id: "add",
          charge1: monster.name + " inflige " + Math.abs(payload.charge1) + " dommages à " + newTarget.name
        }
        dispatch(displayLastAction(payload2));
        triggerPeste(newTarget);
      }
      else {
        let payload2 = {
          id: "add",
          charge1: newTarget.name + " esquive le coup puissant de " + monster.name
        }
        dispatch(displayLastAction(payload2));
      }
    payload.charge1 = false;
    dispatch(monsterPlayed(payload));
  }

  function attackAll(players) {
    let payload = {
      id: 0, 
      charge1: 0,
    }
    let message = monster.name + " s'enrage et inflige ";
    for (let player of players) {
      payload.id = player.id;
      payload.charge1 = (-30 - (monster.attack + monster.buffs.attack.value) ) + player.defense + player.buffs.defense.value;
      if (Math.floor(Math.random() * 100) + 1 > (player.dodge + player.buffs.dodge.value) )
      {
        dispatch(changeHealthPlayer(payload));
        message += Math.abs(payload.charge1 ) + " dommages à " + player.name + ", ";
        triggerPeste(player);
      }
    }
    let payload2 = {
      id: "add",
      charge1: message
    }
    dispatch(displayLastAction(payload2));
    payload.charge1 = false;
    dispatch(monsterPlayed(payload));
  }

  function debuff(monster){
    let payload = {
      id: 0,
      charge1: Math.abs(monster.buffs.defense.value),
      charge2: (monster.buffs.defense.turns * -1)
    }

    dispatch(changeDefenseBuff(payload));
    payload.charge1 = Math.abs(monster.buffs.attack.value);
    payload.charge2 = (monster.buffs.defense.turns * -1);
    dispatch(changeAttackBuff(payload));
    let payload2 = {
      id: "add",
      charge1: monster.name + " supprime ses malus de défense et d'attaque"
    }
    dispatch(displayLastAction(payload2));
  }

  function stun(target){

    let payload = {
      id: target.id,
      charge1: 2,
      charge2: "stun",
    }
    let payload2 = {
      id: "new",
      charge1: monster.name + " porte un coup critique et étourdit " + target.name + "pour " + payload.charge1 + " tours"
    }
    dispatch(displayLastAction(payload2));
    dispatch(changeStatus(payload));
  }

  function triggerPeste(player){
    let payload = {
      id: 0,
      charge1: 3,
      charge2: "poison",
    }
    for (let status of player.status){
        if (status.type === "peste") {
            dispatch(changeStatusMonster(payload));
            let payload2 = {
              id: "add",
              charge1: monster.name + " contracte la peste et est empoisonné pour " + payload.charge1 + " tours"
            }
            dispatch(displayLastAction(payload2));
            break;
        }
    }
}

  return (
      <section>
        <div className="container mt-5 pt-5 pt-xxl-1 mt-xxl-1">
          <div className="row">
            <div className="card-monstre col-sm-12">
                <div className="text-center">
                  <div className="row">
                    <div id={monster.id + monster.name} className="d-flex flex-column-reverse align-items-center monsterImg">
                      {monster.pv < 400 ? <img src="img/manbearpig.webp" alt='monster' height="70%" /> : <img src="img/Manbearpigsafe.webp" alt='monster' /> }
                    </div>
                    <div className="text-dark" id="degatsMonster"><span className="degatsImg"></span></div>
                    <div className='d-flex justify-content-center align-items-center mt-xxl-3'>
                        {monster.attack} {monster.buffs.attack.value !== 0 ? "(" + ((monster.buffs.attack.value > 0 && "+") || (monster.buffs.attack.value < 0 && "")) + monster.buffs.attack.value + ")" : null} <img src="img/atk.png" alt="attaque" height="25px" className="me-2"/>
                        <span className="text-dark" id="degatsMonster"></span>{monster.defense} {monster.buffs.defense.value !== 0 ? "(" + ((monster.buffs.defense.value > 0 && "+") || (monster.buffs.defense.value < 0 && "")) + monster.buffs.defense.value + ")" : null} <i className="fa-solid fa-shield me-3 ms-1" style={{color: "#77767b"}}></i>
                        {monster.dodge} {monster.buffs.dodge.value !== 0 ? "(" + ((monster.buffs.dodge.value > 0 && "+") || (monster.buffs.dodge.value < 0 && "")) + monster.buffs.dodge.value + ")" : null} <i className="fa-solid fa-wind ms-1" style={{color: "#26a269"}}></i>
                        {monster.status.map(statu => statu.type === "poison" && statu.turns > 0 ? (  <span key={statu.type + monster.name} className="ms-3">
                              {statu.turns} <i className="fas fa-skull" style={{ color: "#813d9c" }}></i>
                            </span>) : null)}
                        {monster.status.map(statu => statu.type === "stun" && statu.turns > 0 ? (  <span key={statu.type + monster.name} className="ms-3">
                          {statu.turns} <i className="fa-solid fa-bolt" style={{ color: "#e5a50a" }}></i>
                        </span>) : null)}
                    </div>
                  </div>
                <ProgressBar pv={monster.pv} pvMax={monster.pvMax} bgType="bg-danger"
                faType="fa-heart" barName="pv : " />
              </div>
            </div>
          </div>
        </div>
      </section >
    )
}


export default Monster;