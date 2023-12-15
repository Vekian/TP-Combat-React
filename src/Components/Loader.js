import React from 'react';

const Loader = () => {
  return (
    <div className='d-flex flex-column justify-content-center align-items-center vh-100'>
      <div className='d-flex'>
        <img src="img/loading.gif" />
        <img src="img/loading2.gif" />
      </div>
      <p>Chargement en cours...</p>
      {/* Vous pouvez également ajouter un indicateur de chargement ici */}
    </div>
  );
};

export default Loader;