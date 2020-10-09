<?php include("inc/header.inc.php"); ?>
	<script type="text/javascript" src="js/vis.js"></script>
	<script type="text/javascript" src="js/engine.js"></script>
	<script type="text/javascript" src="js/arena.js"></script>
	<script type="text/javascript" src="bots/sample.js"></script>
	<script type="text/javascript" src="bots/ondras.js"></script>
	<script type="text/javascript">
	var bots = ["sample","ondras"];
	function init() {
		Arena.init();
		Arena.add("sample","Sundance Kid",1);
		Arena.add("sample","Butch Cassidy",1);  
		Arena.add("ondras","Spiderman",2);  
		Arena.add("ondras","Superman",2);  
	}
	</script>
	
	<p class="note">
		Note #1: this page opens a popup window. Please don't close it: otherwise, you won't be able to run a match.
		<br/>
		Note #2: Arena doesn't work in Opera, as this browser doesn't support [opened window].document.getElementById().
	</p>
	
	<p>
		In the Arena, you can see the live action. Use the form below to specify players and match parameters and click 'Fight'!
	</p>
	
	<fieldset>
		<legend>Players</legend>
		<div id="players"></div>
		<input type="button" onclick="Arena.add()" value="Add new player">
	</fieldset>
	
	<fieldset>
		<legend>Match parameters</legend>
		Speed: <select id="delay">
			<option value="0">As fast as possible</option>
			<option value="100">Fast</option>
			<option value="600" selected="selected">Medium</option>
			<option value="2000">Slow</option>
		</select>
		Number of matches: <select id="count">
			<option selected="selected" value="1">1</option>
			<option value="10">10</option>
			<option value="100">100</option>
		</select>
	</fieldset>
	<input type="button" onclick="Arena.go()" value="Fight!">
<?php include("inc/footer.inc.php"); ?>
