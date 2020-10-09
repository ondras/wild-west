/* constructor */
sample = function() {
	this.ammo = 0;
}

/* bot name */
sample.prototype.getName = function() {
	return "Simple SampleAI";
}

/* author name */
sample.prototype.getAuthor = function() {
	return "Ondra Žára";
}

/* bot version */
sample.prototype.getVersion = function() {
	return 0.1;
}

/* info about players */
sample.prototype.prepare = function(myIndex, sidesArray) {
	this.mySide = sidesArray[myIndex];
	this.sides = sidesArray;
}

/* play one round */
sample.prototype.playRound = function() {
	if (this.ammo && Math.random() > 0.5) {
		for (var i=0;i<this.alives.length;i++) {
			if (this.alives[i] && this.sides[i] != this.mySide) {
				this.ammo--;
				return [ACTION_SHOOT,i];
			}
		}
	} else {
		this.ammo++;
		return [ACTION_ARM,false];
	}
}

/* see round actions */
sample.prototype.roundResults = function(actionsArray, alivesArray) {
	this.alives = alivesArray;
}
