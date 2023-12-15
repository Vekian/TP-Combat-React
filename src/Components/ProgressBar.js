import React from 'react';

function ProgressBar ({pv, pvMax, faType, bgType, barName}) {
    return (
            <div>
        
            <div className="progress">
                <div className={`progress-bar progress-bar-danger ${bgType} progress-bar-striped active`} style={{ width: (pv * 100 / pvMax) + "%"}}><h3 className="progress-title mt-2">{barName} {pv}</h3></div>
            </div>
            </div>
        )
}

export default ProgressBar;