
// Function to create 10 (unique) coordinates on 100 x 100 grid
export const randomPlayers = ({maxWidth=100, maxHeight=100, number=10}) => {

    let playersArray = []
    for (let i = 0; i < number; i++) {

        // Create object entry indexed by player number (starting from 0)
        let x = Math.round(Math.random() * maxWidth)
        let y = Math.round(Math.random() * maxHeight)

        // WHile the coordinates are occupied, get more
        while(checkIfOccupied({x,y,players:playersArray})){
            console.log("Coordinates %i, %i occupied!",x,y)
            x = Math.round(Math.random() * maxWidth)
            y = Math.round(Math.random() * maxHeight)
        }

        playersArray.push({
            player: i,
            player_name: `player-${i}`,
            x,
            y,
            color: false,
            reds: 0,
            off: false,
            sin_bin_cycles: 0
        })
    }
    return playersArray
}

// Functiuon that, given and x and y coordinate, will check all players coordinates to see if they occupy that space
export const checkIfOccupied = ({x=0,y=0,players=[]}) => {
    return players.reduce((occupied,player,i) => player.x === x && player.y === y ? { index: i, occupied: true} : occupied, false)
}

// Functiuon that, given and x and y coordinate, will check all players coordinates to see if they occupy that space or are within +/- 2 squares
export const checkIfCloseOrOccupied = ({x=0,y=0,players=[], i}) => {
    // console.log("x: %f, y: %f",x,y)
    return players.filter((player,p) => p !== i).reduce((occupied,player) => {
        if((player.x > x-2 && player.x < x+2 ) && ( player.y > y-2 && player.y < y+2 )){
            occupied.closeTo.push(player)
            occupied.close = true
        } 
        return occupied
    }, {closeTo: [], close: false})
}
// Update x coordinate ( +/- 1 in x direction)
export const updateX = ({x, max=100, min=100}) => {
    return (-1 + Math.random()*2) > 0 ? (x + 1 < max ? x + 1 : x-1 ): (x - 1 > min ? x-1 : x + 1)
}

// Update y coordinate ( +/- 1 in y direction)
export const updateY = ({y, max=100, min=100}) => {
    return (-1 + Math.random()*2) > 0 ? (y + 1 < max ? y + 1 : y-1 ): (y - 1 > min ? y-1 : y + 1)
}

// Pick whether to update X or Y
export const updateCoord = ({player,max=100, min=100}) => {
    return Math.random() > 0.5 ? { x: updateX({x:player.x, max, min}) } : { y: updateY({y: player.y, max, min}) }
}
