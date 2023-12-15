import React, { useEffect } from 'react';
import { newTurn } from '../features/fight/fightSlice.js'
import PlayerCard from './PlayerCard';
import Alerte from './Alerte';
import { useDispatch, useSelector } from 'react-redux';
import { changeManaPlayer, displayLastAction, changeHealthPlayer, changeStatus, changeBuff, changeStatusMonster, playerDead, hitMonster } from '../features/fight/fightSlice.js';
import { checkMax } from "./Functions.js"

function PlayerList(){

  const players = useSelector(state => state.fight.players);
  const monster = useSelector(state => state.fight.monster);

  const dispatch = useDispatch();


  function checkStatus(status, id){
    let payload = {
      id: id,
      charge1: 0,
      charge2: "",
    };

    function poison (payload, status){
      if (payload.id === 0){
        payload.charge1 = (5 * status.turns);
        dispatch(hitMonster(payload));
        let payload2 = {
          id: "add",
          charge1: monster.name + " est empoisonné et perd " + payload.charge1 + " points de vie"
        }
        dispatch(displayLastAction(payload2));
        payload.charge1 = -1;
        payload.charge2 = status.type;
        dispatch(changeStatusMonster(payload));
      }
      else {
        payload.charge1 = (-5 * status.turns);
        dispatch(changeHealthPlayer(payload));
        payload.charge1 = -1;
        payload.charge2 = status.type;
        dispatch(changeStatus(payload));
      }
    };

    function peste (payload, status) {
      if (payload.id === 0){
        payload.charge1 = -1;
        payload.charge2 = status.type;
        dispatch(changeStatusMonster(payload));
      }
      else {
        payload.charge1 = -1;
        payload.charge2 = status.type;
        dispatch(changeStatus(payload));
      }
    };

    function resurect(payload){
      payload.charge1 = 50;
      dispatch(changeHealthPlayer(payload));
      payload.charge1 = -1;
      payload.charge2 = false;
      dispatch(playerDead(payload));
      let payload2 = {
        id: "add",
        charge1: "Kenny revient d'entre les morts !"
      }
      dispatch(displayLastAction(payload2));
    }

    function stun(payload, status) {
      if (payload.id === 0){
        payload.charge1 = -1;
        payload.charge2 = status.type;
        dispatch(changeStatusMonster(payload));
      } else {
        payload.charge1 = -1;
        payload.charge2 = status.type;
        dispatch(changeStatus(payload))
      }
    }

    function triggerStatus(status, payload) {
      switch (status.type){
        case "poison":
          if (status.turns !== 0){
            poison(payload, status);
          }
          break;
        case "peste":
          if (status.turns !== 0){
            peste(payload, status);
          }
          break;
        case "stun":
          if (status.turns !== 0){
            stun(payload, status);
          }
          break;
        case "target": {
          if (status.turns !== 0){
            payload.charge1 = -1;
            payload.charge2 = status.type;
            dispatch(changeStatus(payload));
          }
          break;
        }
        case "resurrecting": {
          if (status.turns > 0){
            if (status.turns === 1){
              resurect(payload);
            }
            payload.charge1 = -1;
            payload.charge2 = status.type;
            dispatch(changeStatus(payload));
            
          }
          break;
        }
        default:
            break;
      }
    }

    for (let statu of status){
            triggerStatus(statu, payload);
          }
  }

  function checkBuff(buffs, id){
    let payload = {
      id: id,
      charge1: -1,
      charge2: "",
    };

    for (let buff in buffs){
      payload.charge2 = buff;
      if (buffs[buff].turns !== 0){
        dispatch(changeBuff(payload));
      }
    }
  }

  function gainManaEndTurn(player){
    if (!player.isDead){
      let charge = checkMax( 5, player.mana, player.manaMax);
      let payload = {
        id: player.id, 
        charge1: charge
      };
      dispatch(changeManaPlayer(payload));
    }
  }


  useEffect(() => {
    if (monster.isAvailable === false) {
      for (let player of players){
        checkStatus(player.status, player.id);
        checkBuff(player.buffs, player.id);
        gainManaEndTurn(player);

      }
      checkStatus(monster.status, 0);
      checkBuff(monster.buffs, 0);
      dispatch(newTurn());
      
    }
  }, [monster.isAvailable, dispatch]);
  const displayPlayers = () => {
    return players.map((player, index) => (
      <PlayerCard key={index} player={player} />
    ));
  }

  return (
    <div>
        <div className='row'>
          {displayPlayers()}
        </div>
    </div>
  );
  
}

export default PlayerList;