import React, { Component } from 'react';
import { theme, Layout, Pitch, Player, PlayerDetail, StyledPre } from './components/Grid'
import { injectGlobal } from 'styled-components'
import { FaBeer } from 'react-icons/fa';
import { MdAccessibility, MdBookmark } from 'react-icons/md';
// Functions
import { randomPlayers, checkIfOccupied, updateX, updateY, updateCoord, checkIfCloseOrOccupied } from './utilities/coordinate-utilities'

injectGlobal`
  @import url('ttps://fonts.googleapis.com/css?family=Cutive+Mono');

  body {
    font-family: 'Cutive Mono', monospace;
    margin: 0;
    padding: 0;
    background-color: ${theme.canvas};
  }
`
class App extends Component { 
  constructor(props){
    super(props)
      this.state = {
        width: 100,
        height: 100,
        grid_square_size: 5,
        number_players: 10,
        max_cycles: 10000,
        cycle_time_milliseconds: 100,
        sin_bin: []
      }
  }

  componentWillMount = () => {
    const { cycle_time_milliseconds} = this.state
    let players = this.createPlayers()
    let repeats = 0
    this.timer = setInterval(
      this.updateGame, cycle_time_milliseconds
    )
    this.setState({ players, cycles: 0 })
  }

  createPlayers(){
    const { width, height, number_players } = this.state
    return randomPlayers({ 
      max_width:width, 
      max_height:height, 
      number:number_players 
    })
  }

  updateGame = () => {
    const { cycles, players, max_cycles, width, sin_bin } = this.state
    if(cycles < max_cycles){

      let mutatedPlayers = players.map( (player,i) => {
        if(player.color === 'red') {
          player.sin_bin_cycles ++
          if(player.sin_bin_cycles < 10) return player
          return player.reds < 2 ? { ...player, color: false, sin_bin_cycles: 0 } : player
        }
        // Copy the player and get updated coordinates
        let newPlayer = {
          ...player,
          ...updateCoord({player,max:width,min:0}),
        }

        // Check all other players to see if the new coordinates put current 
        // player within +/- 2 of another player

        let close = checkIfCloseOrOccupied({ x: newPlayer.x, y: newPlayer.y, players,i})

        console.log(close)
        // If the player has a color attribute then it must be a yellow
        if(close.close){
          // debugger
          console.log("Player: %s got close to %s",newPlayer.player_name, close.closeTo[0])
          newPlayer.color = newPlayer.color === 'yellow' ? 'red' : 'yellow'

          if(newPlayer.color === 'red') {
            newPlayer.reds ++
            if(newPlayer.reds < 2){
              newPlayer.sin_bin_cycles = 0
            }else{
              newPlayer.off = true
            }
          }
        }

        return newPlayer
      })

      this.setState({
        // Filter out players with red cards
        players: mutatedPlayers,
        cycles: cycles + 1,
      })
    }else{
      clearInterval(this.timer)
    }
  }

  createGrid(){

    const { width, height, grid_square_size, players } = this.state

    let grid =[]
    let grid_number = 0

    return players.filter(player => player.color != 'red').map((player,i) => {
      return <Player
        key={i}
        gridSquareSize={grid_square_size}
        x={player.x}
        y={player.y}
        color={players.color}
        >
          <PlayerDetail color={player.color}>
            <MdAccessibility /> { player.color == 'yellow' ? <MdBookmark/> : null}
          </PlayerDetail>
      </Player>
    })
  }

  render() {
    const { width, height, grid_square_size, players } = this.state
    // console.log(sin_bin)
    return ( 
        <Layout gridSquareSize={grid_square_size} gridWidth={width}>
          <StyledPre>{JSON.stringify(players.filter(player => player.color !== "red"),null,2)}</ StyledPre>
          <Pitch gridSquareSize={grid_square_size} gridHeight={height} gridWidth={width}>
           { this.createGrid(width,height)}
          </Pitch>
          <StyledPre>{JSON.stringify(players.filter(player => player.off),null,2)}</ StyledPre>
        </Layout>
      )
  }
}

export default App;
