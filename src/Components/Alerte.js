import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

function Alerte({message}) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Vérifiez si le message est "Vous avez gagné"
    if (message !== "Vous avez perdu") {
      // Activez l'affichage des confettis
      setShowConfetti(true);

      // Désactivez les confettis après quelques secondes
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000); // 5000 millisecondes (5 secondes) dans cet exemple
    }
  }, [message]);

  return (
    <div>
      {showConfetti && <Confetti />}
      {message === "Vous avez perdu" ? <div className='d-flex flex-column align-items-center mt-5'><img src="img/loser.jpg" alt="loser" /><p>Vous avez perdu!</p></div> : <div className='d-flex flex-column align-items-center mt-5'><img src="img/winner.jpeg" alt="winner"/><p>Vous avez gagné!</p></div>}
    </div>
  );
}

export default Alerte;