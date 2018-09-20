import React, { Component } from 'react';


// External libs
import { injectGlobal } from 'styled-components'
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';
import Replay from '@material-ui/icons/Replay';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// Components
import PlayerCard from './components/Player'
import { theme, Layout, Pitch, Player, PlayerDetail, ButtonBar, Middle, HeaderInfo } from './components/Grid'

// Functions
import { randomPlayers, updateCoord, checkIfCloseOrOccupied } from './utilities/coordinate-utilities'

injectGlobal`
  @import url('ttps://fonts.googleapis.com/css?family=Cutive+Mono');

  body {
    font-family: 'Cutive Mono', monospace;
    margin: 0;
    padding: 0;
    background-color: ${theme.canvas};
  }
`
const initialState = {
  width: 100,
  height: 100,
  grid_square_size: 5,
  number_players: 10,
  max_cycles: 10000,
  cycle_time_milliseconds: 100,
  sin_bin: [],
  paused: true
}

class App extends Component { 
  constructor(props){
    super(props)

      this._start = this._start.bind(this)
      this._pause = this._pause.bind(this)
      this._reset = this._reset.bind(this)
      
      this.state = {...initialState}
  }


  _setup(){
    const { cycle_time_milliseconds } = this.state
    let players = this.createPlayers()
    this.timer = setInterval(
      this.updateGame, cycle_time_milliseconds
    )
    this.setState({ players, cycles: 0, sin_bin: [] })
  }

  createPlayers(){
    const { width, height, number_players } = this.state
    return randomPlayers({ 
      max_width:width, 
      max_height:height, 
      number:number_players 
    })
  }

  _pause(){
    if(this.timer) {
      console.log("Pausing timer")
      clearInterval(this.timer)
    }
  }

  _start(){
    const { cycle_time_milliseconds } = this.state
    if(this.timer) {
      console.log("Starting timer")
      this.timer = setInterval(
        this.updateGame, cycle_time_milliseconds
      )
      return
    }
    this._setup()
    this.setState({ paused: false })
  }

  _reset(){
    if(!this.timer) 
    clearInterval(this.timer)
    this.timer = undefined
    this.setState({...initialState})
  }

  updateGame = () => {
    const { cycles, players, max_cycles, width, height, paused } = this.state
    if(paused) return
    if(cycles < max_cycles){

      let mutatedPlayers = players.map( (player,i) => {
        if(player.color === 'red') {
          player.sin_bin_cycles ++
          if(player.sin_bin_cycles < 10) return player
          return player.reds < 2 ? { 
            ...player, 
            x: Math.round(Math.random() * width), 
            y: Math.round(Math.random() * height), 
            color: false, 
            sin_bin_cycles: 0 
          } : player
        }
        // Copy the player and get updated coordinates
        let newPlayer = {
          ...player,
          ...updateCoord({player,max:width,min:0}),
        }

        // Check all other players to see if the new coordinates put current 
        // player within +/- 2 of another player

        let close = checkIfCloseOrOccupied({ x: newPlayer.x, y: newPlayer.y, players,i})

        // If the player has a color attribute then it must be a yellow
        if(close.close){
          // debugger
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

      if(mutatedPlayers.filter(player => !player.off).length === 1){
        let winner = mutatedPlayers.filter(player => !player.reds)[0]
        this.setState({
          // Filter out players with red cards
          players: mutatedPlayers,
          cycles: cycles + 1,
          winner 
        })
      }else{
        this.setState({
          // Filter out players with red cards
          players: mutatedPlayers,
          cycles: cycles + 1
        })
      }
    }else{
      clearInterval(this.timer)
    }
  }

  createGrid(){

    const { grid_square_size, players } = this.state

    return players.filter(player => player.color !== 'red').map((player,i) => {
      return <Player
        key={i}
        gridSquareSize={grid_square_size}
        x={player.x}
        y={player.y}
        color={players.color}
        >
          <PlayerDetail reds={player.reds} color={player.color}/>
      </Player>
    })
  }

  render() {
    const { width, height, grid_square_size, players, cycles, winner, number_players, paused } = this.state
    
    let good = players ? players.filter(player => !player.off) : []
    let bad = players ? players.filter(player => player.color === 'red') : []
    
    if(winner) clearInterval(this.timer)
      
    
    return ( 
        <Layout gridSquareSize={grid_square_size} gridWidth={width}>
          <List component="nav">
            <ListSubheader>Players</ListSubheader>
            { good.map(player => <PlayerCard key={player.player_name} {...player} />) }
          </List>
          <Middle>
            <Paper style={{padding:10}} elevation={1}>
              <Typography variant="headline" component="h3">
                {cycles} seconds
              </Typography>
              <Typography component="p">
                { winner ? `${winner.player_name} wins` : `${players ? players.filter(player => !player.off).length: number_players} players left` }
              </Typography>
            </Paper>
            <Pitch gridSquareSize={grid_square_size} gridHeight={height} gridWidth={width}>
            { !paused ? this.createGrid(width,height) : "Press Play to Start"}
            </Pitch>
            <ButtonBar>
              <Button color={theme.main} onClick={this._start}>
                <PlayArrow/> Start
              </Button>
              <Button color={theme.main} onClick={this._pause}>
                <Pause/> Pause
              </Button>
              <Button color={theme.main} onClick={this._reset}>
                <Replay/> Reset
              </Button>
            </ButtonBar>
          </Middle>
          <List component="nav">
            <ListSubheader>Sin-Binned Players</ListSubheader>
            { bad.map(player => <PlayerCard key={player.player_name} {...player} />) }
          </List>
        </Layout>
      )
  }
}

export default App;
