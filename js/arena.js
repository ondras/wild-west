var Arena = {
	players:[],
	sides:{},
	matches:0,
	window:false,
	results:function(arr, obj) {
		for (var i=0;i<arr.length;i++) {
			if (arr[i]) { this.players[i].total++; }
		}
		for (var p in obj) {
			if (obj[p]) { this.sides[p]++; }
		}
		
		this.matches--;
		if (!this.matches) { 
			var report1 = [];
			var report2 = [];
			for (var i=0;i<this.players.length;i++) {
				var p = this.players[i];
				report1.push(p.name+": "+p.total);
			}
			for (var p in this.sides) {
				report2.push(p+": "+this.sides[p]);
			}
			this.window.alert("Game results\n\nPlayers:\n"+report1.join(", ") + "\n\nSides:\n" + report2.join(", ")); 
		}
	},
	
	match:function(cb, vis) {
		this.window.document.getElementById("console").innerHTML = "";
		var engine = new Engine(document.getElementById("delay").value, vis, cb);
		for (var i=0;i<this.players.length;i++) {
			var p = this.players[i];
			engine.addPlayer(p.bot,p.name,p.side);
		}
		engine.start();
	},

	go:function() {
		if (!this.window || !this.window.document) {
			alert("There is no Arena window opened. Either you closed it or your browser prevented its creation. Please reload the page.");
			return;
		}
		this.players = [];
		this.sides = {};
		
		var players = document.getElementById("players").getElementsByTagName("div");
		for (var i=0;i<players.length;i++) {
			var d = players[i];
			var bot = d.getElementsByTagName("select")[0].value;
			var inputs = d.getElementsByTagName("input");
			var name = inputs[0].value;
			var side = inputs[1].value;
			this.players.push({
				bot:bot,
				name:name,
				side:side,
				total:0
			});
			this.sides[side] = 0;
		}

		var vis = new Vis(this.window);
		this.window.focus();

		var cnt = parseInt(document.getElementById("count").value);
		this.matches = cnt;
		
		var obj = this;
		var cb = function(results1, results2) { obj.results(results1, results2); }
		for (var i=0;i<cnt;i++) { this.match(cb, vis); }
	},
	
	add:function(ai, name, side) {
		var d = document.createElement("div");
		var s = document.createElement("select");
		d.appendChild(document.createTextNode("AI: "));
		d.appendChild(s);
		for (var i=0;i<bots.length;i++) {
			var o = document.createElement("option");
			if (ai == bots[i]) { o.selected = true; }
			o.innerHTML = bots[i];
			o.value = bots[i];
			s.appendChild(o);
		}
		
		var n = document.createElement("input");
		n.type = "text";
		d.appendChild(document.createTextNode(" Name: "));
		if (name) { n.value = name; }
		d.appendChild(n);

		var n = document.createElement("input");
		n.type = "text";
		n.size = 10;
		d.appendChild(document.createTextNode(" Side: "));
		if (side) { n.value = side; }
		d.appendChild(n);
		
		var del = document.createElement("input");
		del.type = "button";
		del.value = "Remove player";
		del.onclick = function() { d.parentNode.removeChild(d); }
		d.appendChild(document.createTextNode(" "));
		d.appendChild(del);

		document.getElementById("players").appendChild(d);
		
		return false; /* prevent form submit */
	},

	init:function() {
		this.window = window.open("_arena.html", "_blank", "width=600,height=600");
		window.focus();
		if (!this.window || !this.window.document) {
			alert("This page needs to open a popup window. Please disable your popup blocker and reload the page, or you won't be able to run any matches in the Arena.");
		}
	}
}
