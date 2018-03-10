Node.js client built using:
- Node
- Express
- Jade
- Socket.io

This code was built with the help of this tutorial https://socket.io/get-started/chat/

## How to Run ##

#### Clone the repository and npm run
```
git clone https://github.com/chocolatethunder/node-chatroom.git
cd node-chatroom
npm install
npm run start
```

#### If you want to run nodemon
```
npm run devstart
```

Point your browser to http://localhost:9000

## Features ##

- [x] Timestamps. All messages have local user time stamps.
- [x] Unique nickname is assigned on start up.
- [x] User messages scroll from bottom to up.
- [x] Chat log history persists and is loaded for each new user. Saves upto 200 messages.
- [x] All currently connected users are displayed on the side
- [x] Nick name can be changed using the /nick <nickname> command. Alphanumeric only.
- [x] Nick name colour can be changed using the /nickcolor #RRGGBB command. Hash tag is required. 
- [x] Each user's own messages are highlighted in bold along with their highlighted username on the side.
- [x] Cookies are set on initial load up so that the username persists.
