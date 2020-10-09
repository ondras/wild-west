var Vis = function(win) {
	this.logLevel = -1;
	this.playerSize = 99;
	this.players = {};
	this.win = win;
	this.colors = ["#faa","#afa","#aaf","#aff","#faf"];
	this.send = function(message, player, data) {
		this.log(message, player, data);
		this.draw(message, player, data);
	}
	
	this.isClass = function(element,className) {
		var arr = element.className.split(" ");
		for (var i=0;i<arr.length;i++) { 
			if (arr[i] == className) { return true; } 
		}
		return false;
	}

	this.addClass = function(element,className) {
		if (this.isClass(element,className)) { return; }
		element.className += " "+className;
	}
	
	this.removeClass = function(element,className) {
		var names = element.className.split(" ");
		var newClassArr = [];
		for (var i=0;i<names.length;i++) {
			if (names[i] != className) { newClassArr.push(names[i]); }
		}
		element.className = newClassArr.join(" ");
	}

	this.getName = function(player) {
		return player.name+" (#"+player.index+")";
	}
	
	this.log = function(msg, player, data) {
		var level = msg.level;
		if (level < this.logLevel) { return; }
		var console = this.win.document.getElementById("console");
		if (!console) { return; }
		var txt = "";
		switch (msg.name) {
			case "MSG_ACTION_NONE":
				txt = "Player "+this.getName(player)+" does nothing"+(player.alive ? "" : " (dead)");
			break;
			case "MSG_ACTION_BLOCK":
				txt = "Player "+this.getName(player)+" blocks";
			break;
			case "MSG_ACTION_SHOOT":
				txt = "Player "+this.getName(player)+" shoots at player "+this.getName(data);
			break;
			case "MSG_ACTION_ARM":
				txt = "Player "+this.getName(player)+" arms himself";
			break;
			case "MSG_ACTION_DANDY":
				txt = "Player "+this.getName(player)+" is Dandy";
			break;
			case "MSG_KILL":
				txt = "Player "+this.getName(player)+" successfully kills player "+this.getName(data);
			break;
			case "MSG_BLOCK":
				txt = "...blocked";
			break;
			case "MSG_WARN_BADFORMAT":
				txt = "Player "+this.getName(player)+" doesn't return correct format of action -> reverting to ACTION_NONE";
			break;
			case "MSG_WARN_BADACTION":
				txt = "Player "+this.getName(player)+" doesn't return correct action type -> reverting to ACTION_NONE";
			break;
			case "MSG_WARN_BADTARGET":
				txt = "Player "+this.getName(player)+" doesn't specify correct target -> reverting to ACTION_NONE";
			break;
			case "MSG_WARN_NOAMMO":
				txt = "Player "+this.getName(player)+" doesn't have enough ammo -> reverting to ACTION_NONE";
			break;
			case "MSG_ERROR_CONSTRUCTOR":
				txt = "I don't know anything about bot '"+player+"'";
			break;
			case "MSG_ERROR_METHOD":
				txt = "Bot '"+player+"' doesn't implement method '"+data+"' -> cannot participate";
			break;
			case "MSG_INFO_ROUND":
				txt = "Starting round "+player;
			break;
			case "MSG_INFO_PLAYER":
				txt = "Adding player "+this.getName(player)+", side "+player.side;
			break;
			case "MSG_INFO_START":
				txt = "Starting match for max. "+data+" rounds with "+player.length+" players";
			break;
			case "MSG_END_DEAD":
				txt = "Noone survived";
			break;
			case "MSG_END_DANDY":
				var arr = [];
				for (var i=0;i<player.length;i++) {
					arr.push(this.getName(player[i]));
				}
				txt = "Players winning by being most Dandy: "+arr.join(", ");
			break;
			case "MSG_END_WINNERS":
				var arr = [];
				for (var i=0;i<player.length;i++) {
					arr.push(this.getName(player[i]));
				}
				txt = "Side '"+data+"' wins by staying alive until end of match!<br/>";
				txt += "Winners: "+arr.join(", ");
			break;
			case "MSG_END_DRAW":
				txt = "Played "+player+" rounds without result => draw";
			break;
		}
	
		if (level == 1) { txt = "<strong>"+txt+"</strong>"; }
		console.innerHTML += txt+"<br/>";
		console.scrollTop = console.scrollHeight;
	}
	
	this.draw = function(msg, player, data) {
		var a = this.win.document.getElementById("arena");
		if (!a) { return; }
		switch (msg.name) {
			case "MSG_INFO_START":
				/* draw figures */
				while (a.firstChild) { a.removeChild(a.firstChild); }
				var w = a.offsetWidth;
				var h = a.offsetHeight;
				var cx = w/2;
				var cy = h/2;
				var outer = Math.min(w,h)/2 - this.playerSize / 2;
				
				this.players = {};
				var sideCount = 0;
				for (var i=0;i<player.length;i++) {
					var p = player[i];
					var s = p.side;
					if (!(s in this.players)) { 
						sideCount++;
						this.players[s] = []; 
					}
					this.players[s].push(p);
				}
				
				var index = 0;
				for (var s in this.players) {
					var arr = this.players[s];
					var angle = 2 * Math.PI * index/sideCount;
					var cnt = arr.length;
					var size = (cnt * this.playerSize)/2;
					var inner = Math.sqrt(outer*outer - size*size); /* inner radius */
					var center_x = cx - inner * Math.cos(angle);
					var center_y = cy + inner * Math.sin(angle);
					var tangent = [cy-center_y, center_x-cx];
					var norm = Math.sqrt(tangent[0]*tangent[0] + tangent[1]*tangent[1]);
					tangent[0] = tangent[0]/norm;
					tangent[1] = tangent[1]/norm;
					for (var i=0;i<arr.length;i++) {
						var p = arr[i];
						var sign = (i % 2 ? 1 : -1);
						var dist = (arr.length % 2 ? Math.ceil(i/2) : Math.floor(i/2)+0.5);
						
						var x = center_x + dist * this.playerSize * sign * tangent[0];
						var y = center_y + dist * this.playerSize * sign * tangent[1];
						var color = this.colors[index % this.colors.length];

						var div = this.win.document.createElement("div");
						div.className = "player";
						div.style.width = this.playerSize + "px";
						div.style.height = this.playerSize + "px";
						div.style.left = Math.round(x - this.playerSize/2)+"px";
						div.style.top = Math.round(y - this.playerSize/2)+"px";

						var img = this.win.document.createElement("img");
						img.style.backgroundColor = color;
						
						var name = this.win.document.createElement("div");
						name.className = "name";
						name.innerHTML = p.name;
						div.appendChild(name);
						div.appendChild(img);
						var ai = this.win.document.createElement("div");
						ai.className = "ai";
						ai.innerHTML = p.bot.getName()+ " v"+p.bot.getVersion() + "<br/>" + p.bot.getAuthor();
						div.appendChild(ai);
						
						a.appendChild(div);
						img.src = "images/player.gif";
						
						p.div = div;
						p.img = img;
					}
					index++;
				}
			break;
			
			case "MSG_END_WINNERS":
			case "MSG_END_DANDY":
				for (var i=0;i<player.length;i++) {
					var p = player[i];
					this.addClass(p.div,"winner");
				}
			break;
			
			case "MSG_INFO_ROUND":
				for (var s in this.players) {
					for (var i=0;i<this.players[s].length;i++) {
						var p = this.players[s][i];
						if (!p.alive) { p.img.src = "images/player-dead.gif"; }
					}
				}
			break;
			
			case "MSG_KILL":
				this.addClass(data.div,"dead");
			break;

			case "MSG_ACTION_BLOCK":
				player.img.src = "images/player-block.gif";
			break; 

			case "MSG_ACTION_DANDY":
				player.img.src = "images/player-dandy.gif";
			break;
			
			case "MSG_ACTION_SHOOT":
				player.img.src = "images/player-shoot.gif";
			break; 
			
			case "MSG_ACTION_ARM":
				player.img.src = "images/player-arm.gif";
			break;
		}
	}
	
	this.addMessage = function(name,level) {
		this[name] = {name:name,level:level};
	}
	
	this.init = function() {
		this.addMessage("MSG_ACTION_NONE",-1);
		this.addMessage("MSG_ACTION_BLOCK",-1);
		this.addMessage("MSG_ACTION_SHOOT",-1);
		this.addMessage("MSG_ACTION_ARM",-1);
		this.addMessage("MSG_ACTION_DANDY",-1);
		this.addMessage("MSG_KILL",0);
		this.addMessage("MSG_BLOCK",-1);

		this.addMessage("MSG_WARN_BADFORMAT",0);
		this.addMessage("MSG_WARN_BADACTION",0);
		this.addMessage("MSG_WARN_BADTARGET",0);
		this.addMessage("MSG_WARN_NOAMMO",0);
		
		this.addMessage("MSG_END_DEAD",1);
		this.addMessage("MSG_END_DANDY",1);
		this.addMessage("MSG_END_WINNERS",1);
		this.addMessage("MSG_END_DRAW",1);
		
		this.addMessage("MSG_ERROR_CONSTRUCTOR",1);
		this.addMessage("MSG_ERROR_METHOD",1);

		this.addMessage("MSG_INFO_ROUND",0);
		this.addMessage("MSG_INFO_PLAYER",0);
		this.addMessage("MSG_INFO_START",0);
	}
	
	this.init();
}