import React, { Component } from 'react';


// External libs
import { injectGlobal } from 'styled-components'
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Play from '@material-ui/icons/PlayCircleFilled';
import Pause from '@material-ui/icons/Pause';
import FastForward from '@material-ui/icons/FastForward';
import Rewind from '@material-ui/icons/FastRewind';
import Replay from '@material-ui/icons/Replay';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

// Components
import PlayerCard from './components/Player'
import { 
  theme, 
  Layout, 
  Pitch, 
  Player, 
  PlayerDetail, 
  ButtonBar, 
  Middle,
  RespButtonBar,
  RespPaper 
} from './components/Grid'

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
  paused: true,
  players: [],
  sin_bin_wait: 10,
  max_reds: 2,
  off_players: 0,
  started: false,
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
    this.setState({ players, cycles: 0, sin_bin: [], started: true })
  }

  createPlayers(){
    const { width, height, number_players } = this.state
    return randomPlayers({ 
      maxWidth:width, 
      maxHeight:height, 
      number:number_players 
    })
  }

  _pause(){
    const { paused } = this.state
    this.setState({paused: !paused})
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
    const { 
      cycles, 
      players, 
      max_cycles, 
      width, 
      height, 
      paused, 
      sin_bin_wait, 
      max_reds 
    } = this.state

    let offPlayers = 0 
    
    if(paused) return
    
    if(cycles < max_cycles){

      let mutatedPlayers = players.map( (player,i) => {
                
        // Check if current player has red card
        if(player.color === 'red') {
          
          // add another tick to sin bin cycles
          player.sin_bin_cycles ++

          // Check if the player is under the wait time, if so, just return as-is
          if(player.sin_bin_cycles < sin_bin_wait || player.off) return player

          // Player in sin bin more than wait time and is not off

            return {
              ...player, 
              x: Math.round(Math.random() * width), 
              y: Math.round(Math.random() * height), 
              color: 'false', 
              sin_bin_cycles: 0 
            } 
        }

        // No red

        // Copy the player and get updated coordinates
        let newPlayer = {
          ...player,
          ...updateCoord({
            player,
            max: width,
            min:0
          }),
        }

        // Check all other players to see if the new coordinates put current 
        // player within +/- 2 of another player

        let close = checkIfCloseOrOccupied({ x: newPlayer.x, y: newPlayer.y, players,i})

        if(close.close){

          // debugger
          newPlayer.color = newPlayer.color === 'yellow' ? 'red' : 'yellow'

          if(newPlayer.color === 'red') {
            newPlayer.reds ++
            // Check if this is the players first red
            if(newPlayer.reds < max_reds){
              newPlayer.sin_bin_cycles = 0
            }else{
              newPlayer.off = true
            }
          }
        }

        return newPlayer
      })
      console.log(mutatedPlayers.filter(player => !player.off).length)
      if(mutatedPlayers.filter(player => !player.off).length === 1){
        let winner = mutatedPlayers.filter(player => !player.off)[0]
        this.setState({
          // Filter out players with red cards
          players: mutatedPlayers,
          cycles: cycles + 1,
          paused: true,
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
    const { width, height, grid_square_size, players, cycles, winner, number_players, paused, started, cycle_time_milliseconds } = this.state
    
    let bad = players ? players.filter(player => player.color === 'red') : []
    
    if(winner) clearInterval(this.timer)
      
    const Buttons = [
      <IconButton  color={theme.main} onClick={this._start} disabled={started ? true : false } >
        <Play/> 
      </IconButton >,
      <IconButton  color={theme.main} onClick={this._pause}>
        { !paused ?  <Pause/> :<PlayArrow/> }
      </IconButton >,
      <IconButton  color={theme.main} onClick={this._reset}>
        <Replay/> 
      </IconButton >,
    ]
    
    return ( 
        <Layout gridSquareSize={grid_square_size} gridWidth={width}>
          <List component="nav">
            <RespButtonBar>
              { Buttons }
            </RespButtonBar>
            <ListSubheader>Players</ListSubheader>
            { players ? players.filter(player => !player.off).map(player => <PlayerCard key={player.player_name} {...player} />) : null }
          </List>
          <Middle>
            <Paper style={{padding:10}} elevation={1}>
              <Typography style={{display: 'flex', justifyContent: 'space-between'}} variant="headline" component="h3">
                {cycles} seconds
              </Typography>
              <Typography component="p">
                { winner ? `${winner.player_name} wins!!!` : `${players ? players.filter(player => !player.off).length: number_players} players left` }
              </Typography>
            </Paper>
            <Pitch gridSquareSize={grid_square_size} gridHeight={height} gridWidth={width}>
            { !paused ? this.createGrid(width,height) : "Press Play to Start"}
            </Pitch>
            <ButtonBar>
              { Buttons }
            </ButtonBar>
          </Middle>
          <List component="nav">
            <RespPaper style={{padding:10}} elevation={1}>
              <Typography style={{display: 'flex', justifyContent: 'space-between'}} variant="headline" component="h3">
                {cycles} seconds /  { winner ? `${winner.player_name} wins!!!` : `${players ? players.filter(player => !player.off).length: number_players} players` }
              </Typography>
            </RespPaper>
            <ListSubheader>Sin-Binned Players</ListSubheader>
            { players ? players.filter(player => player.color === 'red').map(player => <PlayerCard key={player.player_name} {...player} />) : null}
          </List>
        </Layout>
      )
  }
}

export default App;
