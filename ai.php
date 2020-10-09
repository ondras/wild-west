<?php include("inc/header.inc.php"); ?>
	
<p>
	Creating a JS bot for playing Wild West is not a difficult task. You need only minimum JavaScript syntax knowledge,
	programming experience is advantageous but not necessary. 
	<br/>
	For easy reference, a sample bot was created. You can view its source at <a href="bots/sample.js">bots/sample.js</a>
</p>

<h3>How to write a bot</h3>
<p>
	Every Wild West bot is an instantiable JavaScript object. In other words, your bot must be declared as
<code>function myBot() {}</code> and not <code>var myBot = {}</code>.

Apart from this basic declaration, the object in question must implement six easy methods (functions).
Their names, parameters and return values are described below.

</p>

<ol id="bot">
	<li>
		<code>getName()</code> <br/>
		This method is called without arguments and returns a single string - the name of your bot.
	</li>
	<li>
		<code>getAuthor()</code> <br/>
		This method is called without arguments and returns a single string - your name.
	</li>
	<li>
		<code>getVersion()</code> <br/>
		This method is called without arguments and returns a single number - your bot's version.
	</li>
	<li>
		<code>prepare(myIndex, arrayOfTeams)</code> <br/>
		Game engine executes this method once, before the match starts. This is used to let players know 
		about their competitors. Argument <em>myIndex</em> tells the bot its index in players table (starting from zero). 
		Second argument, <em>arrayOfTeams</em>, informs about teams participating in the game: for every player, the array contains 
		name of his team. This means that <em>arrayOfTeams[myIndex]</em> is the team in which your bot plays.<br/>
		This method doesn't return anything.
	</li>
	<li>
		<code>playRound()</code> <br/>
		The core method: it is called every round and is used to find out what action your bot performs. 
		There are no arguments passed to <em>playRound()</em>. 
		<br/>
		This method must return an array with two elements: chosen action and action target. Chosen action is one of the 
		following four predefined constants: <code>ACTION_BLOCK</code>, <code>ACTION_ARM</code>, <code>ACTION_SHOOT</code>, <code>ACTION_DANDY</code>. 
		These correspond to four allowed actions available in game <a href="rules">rules</a>. 
		Action target makes sense only for <em>ACTION_SHOOT</em> and is equal to the index of a player you want to shoot at.
	</li>

	<li>
		<code>roundResults(arrayOfActions, arrayOfLives)</code> <br/>
		This method is called at the end of every round. Its purpose is to notify players about what other bots decided to do. 
		First argument is an array, whose length equals to number of players. Each item is a value returned by 
		<em>playRound()</em> of the respective player.
		Second argument is also an array, but contains only boolean values, specifying state of each player. True == alive, false == dead.
		<br/>
		This method doesn't return anything.
	</li>
	
</ol>

<h3>How to obey the rules</h3>
<p>
	When designing your AI, please keep in mind these useful suggestions:
</p>

<ul>
	<li>Your bot must not interfere in any way with any other bot/code. Game engine is well protected against any tampering, 
	but other page parts are of course vulnerable.</li>
	<li>Your bot must not communicate in any way with other bot instances.</li>
	<li>When an invalid value is returned from the method <em>playRound()</em> (bad action, non-existent target, shooting while unarmed), 
	your bot is penalized by doing nothing during the round. 
	Keep this in mind and make sure that only meaningful values are returned.</li>
	<li>Your bot can freely alter values passed as parameters to its methods. Nothing will crash.
	However, such behavior is often considered bad coding.</li>
	<li>It is very pitiful to analyze source code of other bots in order to improve your own. This doesn't apply to the Sample AI :)</li>
</ul>


<h3>How to use a bot</h3>
<p>
	First of all, you are strongly encouraged to test your bot in the Arena. For this purpose, you can download Arena in the 
	<a href="download">download</a> section. 
	Once you have the Arena working, just include your bot's .js file and add constructor name to <em>bots</em> array.
	<br/>
	When you are satisfied with your masterpiece, feel free to send it to me! I will happily include your bot in the official 
	Arena, so you can compete against other players!
</p>

<?php include("inc/footer.inc.php"); ?>
