// External lib
import styled from 'styled-components'

// Images
import yellow from '../assets/png/yellow.png';
import red from '../assets/png/red.png';
import green from '../assets/png/green.png';

// External lib
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';

export const theme = {
    main: "#232629",
    yellow : "#FFF700",
    red: "#DB1010",
    player: "#93BF4C",
    canvas: "#FFFFFF"
}

export const PlayerDetail = styled.span`
    display: flex;
    width: 20px;
    height:20px;
    color: ${props => props.color ? theme[props.color] : theme.player };
    display: ${props => props.color === 'red' ? 'none' : 'inline-block' };
    background: ${props => props.color === 'yellow' ? `url(${yellow})` : props.reds > 0 ? `url(${red})` : `url(${green})`} no-repeat;
    background-size: 20px;
    font-size: 2em;    
`

export const Layout = styled.div`
    padding: 20px;
    width: 80%;
    margin: auto;
    display:grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr;
    grid-gap: 10px;
    @media only screen and (max-width: 1120px) {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr auto;
    }
    
`

export const Middle = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    @media only screen and (max-width: 1120px) {
        display: none;
    }
`

export const Pitch = styled(Paper)`
    margin-top: 10px;
    width: ${props => props.gridWidth*props.gridSquareSize}px;
    height: ${props => props.gridHeight*props.gridSquareSize}px;
    position:relative;
    background-color: ${theme.main}!important;
    
    /* grid-template-columns: repeat(${props => props.gridWidth},${props => props.gridSquareSize}fr);
    grid-template-rows: repeat(${props => props.gridHeight},${props => props.gridSquareSize}fr); */
`
export const StyledPre = styled.pre`
    border: 1px solid gray;
    font-size: 0.7em;
    overflow-y: auto;
`

export const Player = styled.div`
    width:${props => props.gridSquareSize}px;
    height:${props => props.gridSquareSize}px;
    position: absolute;
    left: ${props => props.x*props.gridSquareSize}px;
    bottom: ${props => props.y*props.gridSquareSize}px;
    /* border: 1px solid white; */
    /* transition: all 0.1s linear; */
    cursor: pointer;
    transform: ${props => props.occupied ? 'scale(3)' : 'none' };
`

export const Players = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
`

export const PlayerCard = styled(ListItem)`
    cursor: default;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    transition: all 0.1s linear;
`

export const ButtonBar = styled.div`
    padding: 10px;
    display: flex;
    justify-content: space-between;
`

export const RespPaper = styled(Paper)`
    display: none;
    @media only screen and (max-width: 1120px) {
        display: flex;
        align-items: center;
        grid-column: 1 / 3;
        grid-row: 1 /2 ;
    }
`

export const RespButtonBar = styled.div`
    display: none;
    @media only screen and (max-width: 1120px) {
        display: flex;
        align-items: center;
    }
`

export const HeaderInfo = styled.div`

`
