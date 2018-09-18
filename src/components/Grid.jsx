import styled from 'styled-components'

export const theme = {
    main: "#232629",
    yellow : "#F9EC57",
    red: "#EF6E41",
    player: "#93BF4C",
    canvas: "#6B6E71"
}

export const PlayerDetail = styled.span`
    color: ${props => props.color ? theme[props.color] : theme.player };
    display: ${props => props.color === 'red' ? 'none' : 'inline-block' };
    font-size: 2em;    
`

export const Layout = styled.div`
    width: 80%;
    margin: auto;
    display:grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr;
    grid-gap: 10px;
    border: 1px solid red;
`

export const Pitch = styled.div`
    margin-top: 10px;
    width: ${props => props.gridWidth*props.gridSquareSize}px;
    height: ${props => props.gridHeight*props.gridSquareSize}px;
    position:relative;
    background-color: ${theme.main};
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
