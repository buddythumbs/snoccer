This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

![image](https://user-images.githubusercontent.com/24975408/45784738-c0f60b80-bc61-11e8-81f5-772393611669.png)

## Install

```
git clone https://github.com/buddythumbs/snoccer.git
cd snoccer
npm install && npm run start
```

## Overview

* Sample dev app to simulate (sort of) soccer game
* **100m x 100m (100 1mx1m squares)** playing area
* **1** referee, **10** players
* Players start randomly distributed across the playing area
* Every player allowed to move **once** per cycle
* Cycle every **1 second**
* Player can move **1m east-west** or **1m north-south** per cycle
* Player to receive **yellow card** if they move to within **2m** of another player
  * The **player that moves** is the player to receive a yellow card
* If a player recieves **2 yellow cards**, they are **ejeceted from the game** for **10 seconds**
* The player can ask the referee if they are eligible to play again
* The player will be allowed play the *first time* this happens *only*
* Last player on pitch is the winner

## Assumptions 

* Player cannot leave the pitch boundary
* Player asks the referee for eligibility to play **after** the 10 seconds has passed
* WHen returning to play; player returns with random coordinates (x: 50%, y: 50% didn't work and neither did returning to coordinates they left at)

## Approach

* Use `create-react-app` to bootstrap a react project - this will allow lifecycle methods to update state and render changes on screen to show UI for the app.
* Each cycle_time (1 second) the players will each move 1 space in random +/- and x/y direction and as part of update, check if they moved to within 2 spaces of another player.
* If they are, they receieve a yellow as long as they have not already got a yellow. If they already had a yellow card, they are given a red and are not in the game for 10 cycles (seconds).
* The first red is recorded with the player so that the next time they receive a red they are ejected


