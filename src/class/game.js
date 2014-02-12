function Game(w, h, fi, fc, fu) {
	var GAME = new Object(null);
	GAME.game = new Phaser.Game(w, h, Phaser.CANVAS, 'canvas', {preload: fi, create: fc, update: fu});
	GAME.game.transparent = true;
	GAME.EVENTS = new Object(null);
	GAME.PHYSICS = new Object(null);
	GAME.PHYSICS.gravity = 0.85;
	GAME.ENTITIES = new Object(null);
	GAME.SOUND = new Object(null);
	GAME.TIMER = new Object(null);
	GAME.STATS = new Object(null);
	GAME.STATS.createdTotal = 0;
	GAME.STATS.paused = false;
	GAME.STATS.timeCreate = 60;
	GAME.STATS.isNachoFliping = false;
	GAME.STATS.createdForNacho = 0;
	GAME.STATS.maxCreatedForNacho = 0;
	GAME.STATS.score = 0;
	GAME.STATS.cEnd = false;
	GAME.STATS.maxScore = 0;
	GAME.STATS.restart = function() {
		GAME.STATS.createdTotal = 0;
		GAME.STATS.timeCreate = 60;
		GAME.STATS.isNachoFliping = false;
		GAME.STATS.createdForNacho = 0;
		GAME.STATS.maxCreatedForNacho = 0;
		GAME.STATS.score = 0;
		GAME.STATS.maxScore = 0;
		if (document.getElementById("cEnd").checked) GAME.STATS.cEnd = false;
		else GAME.STATS.cEnd = true;
		if (document.getElementById("cMusic").checked) GAME.STATS.cSound = true;
		else GAME.STATS.cSound = false;
	}
	GAME.HUB = new Object(null);
	return GAME;
}
