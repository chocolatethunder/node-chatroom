$("document").ready(function() {
	let socket = io();
	let uname = "";
	// Set initial cookies
	document.cookie = "uid=; path=/;";
	document.cookie = "uname=; path=/;";
	document.cookie = "ucolour=; path=/;";
	
	// Handle sending the message
	$("form").submit(function() {
		socket.emit("chat message", $("#msg").val());
		$("#msg").val("");
		return false;		
	});
	
	$("#msg").keydown(function(e) {
		if (e.keyCode === 13) {
			socket.emit("chat message", $("#msg").val());
			$("#msg").val("");
			return false;
		}
	});
	
	// Handle initial username
	socket.on("init", function(message) {
		
		let msgData = JSON.parse(message);
		
		// Message history handling
		if(msgData.type === "history") {
			let msgs = "";
			$.each(msgData.data, function(index, msg) {
				// parse time
				let date = new Date(msg.time);
				let timestamp = ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);
				// Append messages
				msgs = msgs + "<li style=\"color:" + msg.color + "\">" + timestamp + " " + msg.uname + ": " + msg.msgtxt + "</li>"
			});
			// Put into HTML
			appendMessages(msgs);
		}
		// User name handling
		if(msgData.type === "username") {
			uname	 = msgData.data.uname;
			uid		 = msgData.data.uid;
			ucolour	 = msgData.data.colour;
			let msg	 = $("<li class=\"userbold\">").text("SERVER: You are now joined as " + uname);
			appendMessages(msg);
			$("#userStatus").empty();
			$("#userStatus").append("Logged in as: " + uname);
			// Set cookie
			document.cookie = "uid=" + uid + "; path=/;";
			document.cookie = "uname=" + uname + "; path=/;";
			document.cookie = "ucolour=" + ucolour + "; path=/;";
		}
		
		// Update User name handling
		if(msgData.type === "username update") {
			uname = msgData.data.uname;
			let msg = $("<li class=\"userbold\">").text("SERVER: You are now " + uname);
			appendMessages(msg);
			$("#userStatus").empty();
			$("#userStatus").append("Logged in as: " + uname);
			document.cookie = "uname=" + uname + "; path=/;";
		}
	});
	
	// Update user list Globally
	socket.on("update users", function(message) {
		let users = "";
		let usrData = JSON.parse(message);
		console.log(usrData);
		$.each(usrData, function (key, data) {
			if(data.uname === uname) {
				users = users + "<li class=\"userbold\">" + data.uname + "</li>";
			} else {
				users = users + "<li>" + data.uname + "</li>";
			}
		});
		$("#users").empty();
		$("#users").append(users);
	});
	
	// UI updates
	// Colour updates
	socket.on("colour changed", function() {
		let msg = $("<li class=\"userbold\">").text("SERVER: Colour change successful.");
		appendMessages(msg);
	});
	socket.on("colour invalid", function() {
		let msg = $("<li class=\"userbold\">").text("SERVER: Invalid colour!");
		appendMessages(msg);
	});	
	// Nick name updates
	socket.on("nick invalid", function() {
		let msg = $("<li class=\"userbold\">").text("SERVER: Invalid nickname!");
		appendMessages(msg);
	});
	socket.on("nick unique", function() {
		let msg = $("<li class=\"userbold\">").text("SERVER: Nickname must be unique!");
		appendMessages(msg);
	});
	socket.on("nick owned", function() {
		let msg = $("<li class=\"userbold\">").text("SERVER: You already own this nickname.");
		appendMessages(msg);
	});
	
	// Handle receiving the message
	socket.on("chat message", function(message) {
		
		let msgData = JSON.parse(message);
		let date = new Date(msgData.data.time);
		let timestamp = ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);
		
		if(msgData.type === "message") {
			let msg = timestamp + " " + msgData.data.uname + ": " + msgData.data.msgtxt;
			if (msgData.data.uname === uname) {
				msg = $("<li class=\"userbold\" style=\"color:" + msgData.data.color + "\">").text(msg);
			} else {
				msg = $("<li style=\"color:" + msgData.data.color + "\">").text(msg);
			}
			appendMessages(msg);			
		}
		
	});
});

function appendMessages(msgs) {
	// Append the message
	$("#messages").append(msgs);
	
	let flag = false;
	
	// Resize the message display height
	if( $("#messages").prop("scrollHeight") >= $("#msgDisplay").prop("scrollHeight") && flag !== true) {
		$("#messages").height($("#msgDisplay").prop("scrollHeight"));
		$("#messages").css({"overflow-y":"scroll"});
	}
	
	// Scroll to the last message received
	$("#messages").animate({
		scrollTop:$("#messages").prop("scrollHeight")
	}, 1000);
}