import React, { useEffect } from 'react';
import './Game.css';
import Monster from './Monster';
import Resume from './Resume';
import Alerte from './Alerte';
import Loader from './Loader';
import { useDispatch, useSelector } from 'react-redux';
import PlayerList from './PlayerList';

import { chargePlayers, loadGame } from '../features/fight/fightSlice.js';

function App () {
  const dispatch = useDispatch();
  const monster = useSelector(state => state.fight.monster);
  const isLoaded = useSelector(state => state.fight.game.isLoaded);
  const players = useSelector(state => state.fight.players);

  useEffect(() => {
    let bodyData = {
      id: [1,2,3,4],
    };
    let data = JSON.stringify(bodyData);
     fetch('https://mathieu-combat-react.projets.garage404.com/', 
    {
      body: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
      dispatch(chargePlayers(data));
      setTimeout(() => dispatch(loadGame()), 1500);
    })
  }, [])
  
  return (
    <div>
      {(isLoaded) ? (
        (monster.pv > 0) ? (
          players.every(player => player.isDead === true) ? 
          (
            <div className='row'>
              <Alerte message="Vous avez perdu" />
            </div>
          ) : (
          <div className="App d-flex flex-column justify-content-center">
            <Monster />
            <br></br>
            <div>
              <Resume />
            </div>
            <section className="container-fluid mt-xxl-4">
              <PlayerList />
            </section>
            <div></div>
          </div>
        )) : (
          <Alerte message="Vous avez gagné" />
        )
      ) : (
        <Loader />
      ) }
    </div>
  )
}


export default App;