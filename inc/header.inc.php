<?php
	$links = array();
	$links["info"] = "Game Info";
	$links["rules"] = "Game Rules";
	$links["ai"] = "Write your own AI";
	$links["arena"] = "Arena";
	$links["download"] = "Download";
	
	$rnd = array(	"the TRUE power of JavaScript!", "who have you shot down today?",
					"the most amusing way of learning JavaScript", "your mistletoe is no match for my TOW missile!",
					"learn, code, shoot!", "if there is a God, he surely hates randomized page titles",
					"prototype-based fun", "original point'n'shoot simulation",
					"support your local sheriff!", "Butch Cassidy and Sundance Kid played this",
					"favorite videogame of Chuck Norris", "meet Wyatt Earp", 
					"Bang!", "JS-based shooting sim", "coding was never so challenging",
					"Arm, Block, Shoot, Dadny, Win!", "I don't like your face, foreigner",
					"no advanced JavaScript knowledge needed", "no special JavaScript knowledge needed",
					"smart gaming", "create your own bot!", "Firebug certified", "Wanted: dead or alive!"
					);
	
	$js = array();
	$js["arena"] = "init()";

	$title = "";
	$scr = basename($_SERVER["SCRIPT_FILENAME"]);
	
	$menu = '<ul id="menu">';
	foreach ($links as $name=>$label) {
		$menu .= "<li";
		if ($name.".php" == $scr) {
			$menu .= ' class="active"';
			$title = $label;
		}
		$menu .= '><a href="'.$name.'">'.$label.'</a></li>';
	}
	$menu .= "</ul>";
	
	$suffix = " - ".$rnd[array_rand($rnd)];
	
	$init = "";
	foreach ($js as $name=>$code) {
		if ($name.".php" == $scr) {
			$init = ' onload="'.$code.'"';
		}
	}
?>
<html>
	<head>
		<title>Wild West - <?php echo $title.$suffix; ?></title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<link rel="stylesheet" media="all" type="text/css" href="style.css" />
	</head>
	<body<?php echo $init; ?>>
		<h1>Wild West - Competitive JavaScript!</h1>
		<?php echo $menu; ?>
		<hr class="clear" />
	<h2><?php echo $title; ?></h2>
