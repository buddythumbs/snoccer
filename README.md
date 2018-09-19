This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

![image](https://user-images.githubusercontent.com/24975408/45783244-24ca0580-bc5d-11e8-83df-ddc96b33c11e.png)

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

## Approach

* Use `create-react-app` to bootstrap a react project
* Each player will be their own component
* Grid will be it's own component
* Refereee will be part of the top level component
