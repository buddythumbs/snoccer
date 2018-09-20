import React from 'react'
import { MdError } from 'react-icons/md';
import {PlayerCard, theme } from './Grid'

// External libs
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

export default function Player ({ player_name, color, reds, off }){
    return (<PlayerCard button>
          <ListItemText inset primary={player_name} />
          {
            reds > 0 ?
            <ListItemSecondaryAction>
              <IconButton aria-label={reds}>
                <MdError color={theme.red} />
              </IconButton>
            </ListItemSecondaryAction>:
            color === "yellow" ?
              <ListItemSecondaryAction>
                <IconButton aria-label={reds}>
                  <MdError color={theme.yellow} />
                </IconButton>
              </ListItemSecondaryAction>:
              null
          }
          
        </PlayerCard>
    )
}
