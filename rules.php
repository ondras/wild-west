<?php include("inc/header.inc.php"); ?>
	
<ol id="rules">
	<li><strong>General:</strong> <em>Wild West</em> is a game played by 2+ players. Every player belongs to a team. 
	The main aim of the game is to eliminate enemy team(s) and survive the fight.
	</li>
	<li><strong>Game flow:</strong> The game is played in rounds. Each round, every player performs one of predefined actions. Actions
	from all players are 
	executed simultaneously. If a certain number (player count * 20) of rounds is played without satisfied victory conditions, 
	the game is called a draw.
	</li>
	<li><strong>Allowed actions are:</strong>
		<table>
			<tr>
				<td><img src="images/player-arm.gif" alt="Arm"/></td>
				<td><strong><em>Arm</em></strong> - player increases the amount of ammunition loaded into his gun. At the beginning of the game, 
				there is no ammo loaded. One cannot shoot without at least one bullet in his gun.</td>
			</tr>

			<tr>
				<td><img src="images/player-shoot.gif" alt="Shoot"/></td>
				<td><strong><em>Shoot</em></strong> - player shoots at one specified target. This decreases the number of bullets in player's gun. 
				It is not possible to shoot with empty gun.</td>
			</tr>

			<tr>
				<td><img src="images/player-block.gif" alt="Block"/></td>
				<td><strong><em>Block</em></strong> - blocking player cannot be hit by enemy shot. This is the only action which defends against 
				(any number of) shooting enemies.</td>
			</tr>

			<tr>
				<td><img src="images/player-dandy.gif" alt="Dandy"/></td>
				<td><strong><em>Dandy</em></strong> - player demonstrates his mental superiority by doing a comic gesture. Anyone who manages to 
				perform three Dandys during the match (without being shot) is declared a winner.</td>
			</tr>

			</table>
	</li>
	
	<li><strong>Victory conditions:</strong> the game ends when one of the following is met:
		<ol>
			<li>All alive players are from the same team - they win</li>
			<li>An alive player managed to perform three Dandys during the match - all such players are winners</li>
			<li>All players are dead - draw</li>
			<li>The maximum number of rounds have passed - draw</li>
		</ol>
	</li>
	
	<li><strong>Miscellaneous:</strong>
		<ol>
			<li>Everyone has only one life: a player is dead after being shot once.</li>
			<li>Three Dandys don't have to be played in a row.</li>
			<li>It is legal (but pointless) to shoot at dead players.</li>
			<li>It is legal (but pointless) to shoot at friendly players (from your team).</li>
			<li>Player's gun stores ammo for infinite amount of time and it can store any number of bullets. Therefore, it is possible to 
			do e.g. the following: Arm, Dandy, Arm, Block, Shoot, Shoot.</li>
			<li>One player can be hit by multiple enemies in one round. If his action is not Block, he is declared dead.</li>

		</ol>
	</li>
	
</ol>
	
<?php include("inc/footer.inc.php"); ?>
