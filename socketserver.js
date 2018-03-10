let generate 	= require('chance')();

let processor = function(io) {
	
	let msgHistory = [];
	let users = [];	
	let init = false;
	
	io.on("connection", function(socket) {
		
		// On opening first connection
		
		// Get Cookie
		let userCookie	= socket.request.cookies;
		
		// Create a new user
		let userObj = {
			uname: null,
			uid: null,
			colour: null
		}
		
		if (userCookie["uid"] === null || userCookie["uid"] === "undefined" || userCookie["uid"] === "") {
			// Create a new user
			userObj.uname 	= generate.first({nationality:"en"});
			userObj.uid 	= generate.string({length:8});
			userObj.colour 	= generate.color({format:"hex"});			
		} else {			
			// Reload the last user
			userObj.uname 	= userCookie["uname"];
			userObj.uid 	= userCookie["uid"];
			userObj.colour 	= userCookie["ucolour"];
		}
	
		// Add user to online user list	
		var userIndex = users.map(function(user) { return user.uname; }).indexOf(userObj.uname);
		if (userIndex == -1) {
			users.push(userObj);
		}
		
		let jsonMsg;
		
		// Send the user history to append to the message box
		jsonMsg = JSON.stringify({type:"history", data: msgHistory});
		socket.emit("init", jsonMsg);
		// Send a hello message containing user name to let them know
		jsonMsg = JSON.stringify({type:"username", data: userObj});
		socket.emit("init", jsonMsg);
		// Broadcast the new user list to be updated
		io.emit("update users", JSON.stringify(users));	


		console.log(userCookie);
		
		
		// Handle subsequence messages after
		socket.on("chat message", function(message) {
			// Check for any commands
			var commands = message.split(" ");
			// Color change
			if (commands[0] == "/nickcolor") {
				
				if (commands[1].match(/^#[0-9a-f]{3,6}$/i)) {
					userObj.colour = commands[1];
					socket.emit("colour changed");
				} else {
					socket.emit("colour invalid");
				}
				
			} else if (commands[0] == "/nick") {
				
				if (commands[1].match(/^[a-z0-9]+$/i)) {
					if (commands[1] === userObj.uname) {
						socket.emit("nick owned");			
					} else if (users.filter(function(e) {return e.uname === commands[1];}).length > 0) {
						socket.emit("nick unique");
					} else {						
						// update the username in the list
						users.forEach(function(user) {
							if(user.uname === userObj.uname){
								userObj.uname = commands[1];
							}
						});						
						// Update the username
						userObj.uname = commands[1];						
						// Update username in the UI
						jsonMsg = JSON.stringify({type:"username update", data: userObj});
						socket.emit("init", jsonMsg);
						// Update the userlist
						io.emit("update users", JSON.stringify(users));
					}				
				} else {
					socket.emit("nick invalid");
				}
				
			} else {
				
				// Create a chat message object
				let chatObj = {
					time: new Date(),
					msgtxt: message,
					uname: userObj.uname,
					color: userObj.colour
				};
				// Store
				msgHistory.push(chatObj);
				// Prune for the last 200 messages
				msgHistory = msgHistory.slice(-200);
				// Send
				let jsonMsg = JSON.stringify({type:"message", data: chatObj});			
				io.emit("chat message", jsonMsg);	
			}

		});
		
		// Handle user disconnect
		socket.on("disconnect", function() {
			// remove user from list
			var deleteindex = users.map(function(user) { return user.uname; }).indexOf(userObj.uname);
			users.splice(deleteindex,1);
			// Broadcast the new user list to be updated
			io.emit("update users", JSON.stringify(users));
		});
		
	});

}

module.exports = processor;