var Engine = function(d, vis, cb) {
	/* --------------------------- private properties --------------------------- */
	var delay = d || 0;
	var bots = {};
	var methodList = ["getName","getAuthor","getVersion","prepare","playRound","roundResults"];
	
	var players = [];
	
	var roundNum = 0;
	var alivePlayers = 0;
	var logLevel = -1;
	var dandyVictors = [];
	var roundLimit = 0;
	var playerRounds = 20;
	var playing = false;
	
	/* --------------------------- private methods --------------------------- */	
	var decideRound = function() {
		for (var i=0;i<players.length;i++) {
			var p = players[i];
			switch (p.action[0]) {
				case ACTION_DANDY:
					p.dandy++;
					vis.send(vis.MSG_ACTION_DANDY,p);
				break;
				
				case ACTION_ARM:
					p.ammo++;
					vis.send(vis.MSG_ACTION_ARM,p);
				break;
				
				case ACTION_BLOCK:
					vis.send(vis.MSG_ACTION_BLOCK,p);
				break;

				case ACTION_SHOOT:
					var target = parseInt(p.action[1]);
					p.ammo--;
					vis.send(vis.MSG_ACTION_SHOOT,p,players[target]);
					if (players[target].action[0] != ACTION_BLOCK) {
						/* kill! */
						vis.send(vis.MSG_KILL,p,players[target]);
						if (players[target].alive) { alivePlayers--; }
						players[target].alive = false;
					} else {
						vis.send(vis.MSG_BLOCK,p);
					}
				break;
				
				default:
					vis.send(vis.MSG_ACTION_NONE,p);
				break;
			}
		}
		
		for (var i=0;i<players.length;i++) {
			var p = players[i];
			if (!p.alive) { continue; }
			if (p.dandy >= 3) { dandyVictors.push(p); }
		}
	}
	
	var notifyPlayers = function() {
		for (var i=0;i<players.length;i++) {
			var arr1 = [];
			var arr2 = [];
			for (var j=0;j<players.length;j++) {
				var p = players[j];
				var act = p.action;
				arr1.push([act[0],act[1]]);
				arr2.push(p.alive);
			}
			players[i].bot.roundResults(arr1, arr2);
		}
	}
	
	var playRound = function() {
		roundNum++;
		vis.send(vis.MSG_INFO_ROUND,roundNum);
		for (var i=0;i<players.length;i++) {
			var p = players[i];
			if (!p.alive) { 
				p.action = [ACTION_NONE,false];
				continue; 
			}
			
			setConstants();
			var action = p.bot.playRound();
			setConstants();
			
			if (!(action instanceof Array) || action.length != 2) {
				action = [ACTION_NONE,false];
				vis.send(vis.MSG_WARN_BADFORMAT,p);
			}
			var type = action[0];
			if (type != ACTION_BLOCK && type != ACTION_ARM && type != ACTION_SHOOT && type != ACTION_DANDY && type != ACTION_NONE) {
				action[0] = ACTION_NONE;
				vis.send(vis.MSG_WARN_BADACTION,p);
			}
			if (type == ACTION_SHOOT) {
				var target = parseInt(action[1]);
				if (isNaN(target) || target < 0 || target >= players.length) {
					action[0] = ACTION_NONE;
					vis.send(vis.MSG_WARN_BADTARGET,p);
				}
				if (!p.ammo) {
					action[0] = ACTION_NONE;
					vis.send(vis.MSG_WARN_NOAMMO,p);
				}
			}
			p.action = action;
		}
		
		decideRound();
		notifyPlayers();
		
		checkEndConditions();
		if (playing) { setTimeout(playRound,delay); }
	}
	
	var checkEndConditions = function() {
		var results1 = [];
		var results2 = {};
		
		var sideCounts = {}
		for (var i=0;i<players.length;i++) {
			var p = players[i];
			results1.push(false);
			results2[p.side] = false;
			if (!p.alive) { continue; }
			if (!(p.side in sideCounts)) { sideCounts[p.side] = 0; }
			sideCounts[p.side]++;
		}
		var positiveSides = [];
		for (var s in sideCounts) {
			if (sideCounts[s]) { positiveSides.push(s); }
		}

		if (!alivePlayers) {
			vis.send(vis.MSG_END_DEAD);
		} else if (dandyVictors.length) {
			var arr = [];
			vis.send(vis.MSG_END_DANDY,dandyVictors);
			for (var i=0;i<dandyVictors.length;i++) {
				results1[dandyVictors[i].index] = true;
				results2[dandyVictors[i].side] = true;
			}
		} else if (positiveSides.length == 1) {
			var arr = [];
			for (var i=0;i<players.length;i++) {
				var p = players[i];
				if (p.alive) { 
					arr.push(p); 
					results1[p.index] = true;
					results2[p.side] = true;
				}
			}
			vis.send(vis.MSG_END_WINNERS,arr,positiveSides[0]);
		} else if (roundNum >= roundLimit) {
			vis.send(vis.MSG_END_DRAW,roundNum);
		} else {
			return; /* continue */
		}
		playing = false;
		if (cb) { cb(results1, results2); }
	}
	
	var setConstants = function() {
		window.ACTION_NONE = 0;
		window.ACTION_BLOCK = 1;
		window.ACTION_ARM = 2;
		window.ACTION_SHOOT = 3;
		window.ACTION_DANDY = 4;
	}
	setConstants();
	
	/* --------------------------- public methods --------------------------- */
	this.addPlayer = function(constructorName, name, side) {
		if (playing) { return; }
		var c = constructorName.toString();
		if (!(c in window)) {
			vis.send(vis.MSG_ERROR_CONSTRUCTOR,c);
			return;
		}
		var inst = new window[c]();
		var ok = true;
		for (var i=0;i<methodList.length;i++) {
			var m = methodList[i];
			if (!inst[m] || typeof(inst[m]) != "function") { 
				ok = false;
				vis.send(vis.MSG_ERROR_METHOD,c,m);
			}
		}
		if (!ok) { return; }

		var s = side || 1;
		
		var o = {
			bot: inst,
			side: s,
			name: name,
			action: false,
			index: players.length
		}
		players.push(o);
		vis.send(vis.MSG_INFO_PLAYER,o);
	}
	
	this.start = function() {
		if (playing) { return; }
		playing = true;
		roundNum = 0;
		dandyVictors = [];
		alivePlayers = players.length;
		roundLimit = alivePlayers * playerRounds;
		vis.send(vis.MSG_INFO_START,players,roundLimit);
		
		for (var i=0;i<players.length;i++) {
			var p = players[i];
			p.ammo = 0;
			p.dandy = 0;
			p.alive = true;
			var arr = [];
			for (var j=0;j<players.length;j++) { arr.push(players[j].side); }
			players[i].bot.prepare(i,arr);
		}
		
		
		checkEndConditions();
		if (playing) { setTimeout(playRound,delay); }
	}
}
