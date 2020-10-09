ondras = function() {}
ondras.prototype.getName = function() {	return "ondras AI"; }
ondras.prototype.getAuthor = function() { return "Ondra Žára"; }
ondras.prototype.getVersion = function() { return 0.1; }

ondras.prototype.prepare = function(myIndex, sidesArray) {
	this.players = [];
	this.myIndex = myIndex;
	for (var i=0;i<sidesArray.length;i++) {
		var o = {
			alive:true,
			ammo:0,
			side:sidesArray[i],
			dandy:0,
			index:i
		}
		this.players.push(o);
	}
	this.round = 0;
}

ondras.prototype.playRound = function() {
	this.round++;
	
	/* v prvnim kole nahodne frajer/nabit */
	if (this.round == 1) {
		return (Math.random() > 0.5 ? [ACTION_DANDY,false] : [ACTION_ARM,false]);
	}
	
	var ops = []; /* oponents */
	var friends = 0;
	var mySide = this.players[this.myIndex].side;
	for (var i=0;i<this.players.length;i++) {
		var p = this.players[i];
		if (p.alive && p.side != mySide) { ops.push(p); }
		if (p.alive && p.side == mySide && i != this.myIndex) { friends++; }
	}
	
	var opts = []; /* avail options */
	var armed = 0;
	var unarmed = 0;
	
	for (var i=0;i<ops.length;i++) {
		if (ops[i].ammo) { armed++; } else { unarmed++; }
		if (ops[i].dandy == 2 && this.players[this.myIndex].ammo) { opts.push(ACTION_SHOOT); }
	}
	
	if (!this.players[this.myIndex].ammo) { 
		opts.push(ACTION_ARM); 
	} else {
		opts.push(ACTION_SHOOT); 
	}
	if (this.players[this.myIndex].dandy == 2) { opts.push(ACTION_DANDY); }

	if (armed <= friends) { /* free to act */
		opts.push(ACTION_DANDY);
	} else { /* afraid to act */
		opts.push(ACTION_BLOCK);
	}
	
	var act = opts[Math.floor(Math.random()*opts.length)];
	var target = ops.sort(this._sortDandy)[0];
	
	var data = (act == ACTION_SHOOT ? target.index : false);
	return [act,data];
}

ondras.prototype.roundResults = function(actionsArray, alivesArray) {
	for (var i=0;i<actionsArray.length;i++) {
		var act = actionsArray[i];
		var p = this.players[i];
		p.alive = alivesArray[i];
		if (act[0] == ACTION_ARM) { p.ammo++; }
		if (act[0] == ACTION_DANDY) { p.dandy++; }
		if (act[0] == ACTION_SHOOT) { p.ammo--; }
	}
	this.alives = alivesArray;
}

ondras.prototype._sortDandy = function(a,b) {
	if (a.dandy != b.dandy) {
		return b.dandy - a.dandy;
	}
	return Math.random() - 0.5;
}