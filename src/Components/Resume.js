import { useSelector } from 'react-redux';


function Resume({player}) {
    const lastAction = useSelector(state => state.fight.game.lastAction);

    function displayMessage(){
        return lastAction.map((message) => (
            <div key={message} >{message} </div>
          ));
    }

    return (
        <div className={`mt-2 resumeActions col-4 d-flex flex-column p-2 ${(lastAction.length > 2 ) ? 'pt-5' : 'pt-3'} align-items-center justify-content-center`}>
            {displayMessage()}
        </div>
    )
}

export default Resume;