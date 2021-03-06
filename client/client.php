<html>
<head>
<link rel="shortcut icon" href="icon.png" type="image/png" />
<link rel="stylesheet" type="text/css" href="style.css">
<?php include_once("analytics.php") ?>
<script src="https://code.jquery.com/jquery-2.1.0.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/fabric.js/1.4.0/fabric.min.js"></script>
<script src="client.js"></script>
<title>Octogenarian</title>
</head>
<body>
	<a href="https://github.com/rainshapes/lifemmo"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"></a>
	<center>
	<h1>Octogenarian</h1>
	<div id="field">
	<canvas id="maincanvas" width="600" height="600"></canvas>
	</div>
	<br />
	<input id="pause" type="button" onClick="pause()" value="Pause"/>
	<a href="http://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank">
		<input type="button" value="Explain" /></a>
	<br />
	Rule:
	<br />
	 S: 
	<input id="ruleS" />
	 B: 
	<input id="ruleB" />
	<input type="button" value="Change" id="change" onClick="changeRule()" />
</center>
</body>
</html>
