# NodeBattleship

NodeBattleship is a multiplayer Battleship game made with Node.js and socket.io.
At the start of the game, five ships of different sizes are placed randomly in a 10 x 10 grid.
The players then take turns firing shots at the opponent's grid until one player has sunk all of
the opponent's ships.

![Battleship screenshot](http://inf123.github.io/battleship-screenshot.png)

## Install

Step 1: Connect to server (/home/ubuntu/NodeBattleship). You must have nodejs installed. Download/clone this repo to your server.

Step 2: Install dependencies:
```
npm install
```
Step 3: Start server:
```
nodejs battleship.js &
```
Step 4: Open http://54.146.50.124:8900/ in your browser to play. If you get ERR_CONNECTION_REFUSED, repeat Step 3.

