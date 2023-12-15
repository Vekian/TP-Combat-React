import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux'
import { checkAvailabilityCapacity, clickImg } from "./Functions.js"
import { playerDead, swapAvatar, displayLastAction, playerPlayed, changeHealthPlayer, changeStatus } from '../features/fight/fightSlice.js'
import ButtonCapacity from './ButtonCapacity';
import ProgressBar from './ProgressBar';

function PlayerCard({player}) {
    const dispatch = useDispatch();
    const idButton = document.getElementById(player.name + player.id);
    const isComponentMounted = useRef(false);

    useEffect(() => {
        if (player.pv <= 0 && player.isDead === false) {
        let payload = {
            id: player.id,
            charge1: 1,
            charge2: true,
        }
        dispatch(playerDead(payload));
        let payload2 = {
            id: "add",
            charge1: player.name + " meurt"
          }
          dispatch(displayLastAction(payload2));
        payload.charge1= (player.pv * -1);
        dispatch(changeHealthPlayer(payload));

        if (player.name === "Kenny"){
            let payload2 = {
                id: player.id,
                charge1: 2,
                charge2: "resurrecting",
            }
            dispatch(changeStatus(payload2));
        }
        idButton.classList.toggle("animationDegatsCard");
        setTimeout(() => {idButton.classList.toggle("animationDegatsCard");}, 400)
        }
    }, [player, dispatch]);

    useEffect(() => {
        for (let attack of player.attacks) {
            if (checkAvailabilityCapacity(attack, player)){
                return
            }
        }
        let payload = {
            id: player.id
        }
        let payload2 = {
            id: "add",
            charge1: player.name + " ne peut plus jouer et passe son tour"
          }
          dispatch(displayLastAction(payload2));
        dispatch(playerPlayed(payload));

    }, [player, dispatch]);

    useEffect(() => {
        if (!isComponentMounted.current) {
            isComponentMounted.current = true;
            return;
          }
        idButton.classList.toggle("animationDegatsCard");
        setTimeout(() => {idButton.classList.toggle("animationDegatsCard");}, 600)
      }, [player.pv]);

    

        return (
            <div key={player.id} className={`col-sm-3 card center ${(player.isAvailable && !player.isDead) ? '' : 'opacity-25'}`} id={`joueur${player.id}`}  >

                    <div  className="card-body text-center">
                        <h5 className="card-title">{player.name}</h5>
                        <span className="text-dark" id={"degats" + player.name}></span>
                        <div className="d-flex justify-content-center imgPlayer">
                            <img id={player.name + player.id} src={player.avatar} alt={player.name} onClick={() => clickImg(player, dispatch, swapAvatar)}/>
                        </div>
                        <div className='d-flex justify-content-center align-items-center'>
                            {player.attack} {player.buffs.attack.value !== 0 ? "(" + ((player.buffs.attack.value > 0 && "+") || (player.buffs.attack.value < 0 && "")) + player.buffs.attack.value + ")" : null} <img src="img/atk.png" alt="attaque" height="30px" className="me-2"/>
                            {player.defense} {player.buffs.defense.value !== 0 ? "(" + ((player.buffs.defense.value > 0 && "+") || (player.buffs.defense.value < 0 && "")) + player.buffs.defense.value + ")" : null} <i className="fa-solid fa-shield fa-xl me-3 ms-1" style={{color: "#77767b"}}></i>
                            {player.dodge} {player.buffs.dodge.value !== 0 ? "(" + ((player.buffs.attack.value > 0 && "+") || (player.buffs.dodge.value < 0 && "")) + player.buffs.dodge.value + ")" : null} <i className="fa-solid fa-wind fa-xl ms-1" style={{color: "#26a269"}}></i>
                            {player.status.map(statu => statu.type === "poison" && statu.turns > 0 ? (  <span key={statu.type + player.name} className="ms-3">
                              {statu.turns} <i className="fas fa-skull" style={{ color: "#813d9c" }}></i>
                            </span>) : null)}
                            {player.status.map(statu => statu.type === "stun" && statu.turns > 0 ? (  <span key={statu.type + player.name} className="ms-3">
                                {statu.turns} <i className="fa-solid fa-bolt" style={{ color: "#e5a50a" }}></i>
                            </span>) : null)}
                            {player.status.map(statu => statu.type === "peste" && statu.turns > 0 ? (  <span key={statu.type + player.name} className="ms-3">
                                {statu.turns} <i className="fa-solid fa-virus" style={{ color: "#a51d2d" }}></i>
                            </span>) : null)}
                            {player.status.map(statu => statu.type === "resurrecting" && statu.turns > 0 ? (  <span key={statu.type + player.name} className="ms-3">
                                {statu.turns} <i className="fa-solid fa-ring" style={{ color: "#f6d32d" }}></i>
                            </span>) : null)}
                        </div>
                        
                        <ProgressBar pv={player.pv} pvMax={player.pvMax} faType='fa-heart' barName='pv : ' bgType='bg-danger' />
                        <ProgressBar pv={player.mana} pvMax={player.manaMax} faType='fa-fire-alt' barName='mana : ' />
                        <div className="row mt-xxl-1">
                            <div className="d-flex flex-column ">
                                <ButtonCapacity player={player} attack={player.attacks[0]} />
                                <ButtonCapacity player={player} attack={player.attacks[1]} />
                                <ButtonCapacity player={player} attack={player.attacks[2]} />
                                <ButtonCapacity player={player} attack={player.attacks[3]} />
                            </div>
                        </div >
                    </div >

                </div >
            )
}

export default PlayerCard;