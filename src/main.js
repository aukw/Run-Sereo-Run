/*
	Copyright (C) 2013 Guillermo Diz

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
var KEY_SPACEBAR = 32;
var KEY_LEFTARROW = 37;
var KEY_UPARROW = 38;
var KEY_RIGHTARROW = 39;
var KEY_A = 65;
var KEY_W = 87;
var KEY_D = 68;
var texts;
function rCollision(a, b) {
	var aX = a.body.x, aY = a.body.y, aW = a.body.width, aH = a.body.height;
	var bX = b.body.x, bY = b.body.y, bW = b.body.width, bH = b.body.height;
	if (aX + aW > bX && aY + aH > bY && aX < bX + bW && aY < bY + bH) return true;
	return false;
}
var GAME = new Game(800, 600, preload, create, update);

function preload() {
	GAME.game.load.spritesheet("player", "./assets/player.png", 78, 112);
	GAME.game.load.spritesheet("avatares", "./assets/avatares.png", 50, 50, 312);
	GAME.game.load.image("bonus", "./assets/bonus.png");
	GAME.game.load.image("nacho", "./assets/nacho.png");
	GAME.game.load.image("background", "./assets/background.png");
	GAME.game.load.image("floor", "./assets/floor.png");
	GAME.game.load.image("guru", "./assets/guru.png");
	GAME.game.load.image("win", "./assets/win.png");
	GAME.game.load.image("creditos", "./assets/creditos.png");
	GAME.game.load.spritesheet("lifedown", "./assets/life.png", 77, 11);
	GAME.game.load.spritesheet("heart", "./assets/hub/hearts.png", 25, 25);
	GAME.game.load.audio("sound1", ["./assets/sound/sound1.ogg", "./assets/sound/sound1.mp3"], true);
	GAME.game.load.audio("sound2", ["./assets/sound/sound2.ogg", "./assets/sound/sound2.mp3"], true);
}

function create() {
	GAME.game.input.keyboard.addKeyCapture(KEY_A);
	GAME.game.input.keyboard.addKeyCapture(KEY_D);
	GAME.game.input.keyboard.addKeyCapture(KEY_W);
	GAME.game.input.keyboard.addKeyCapture(KEY_SPACEBAR);
	GAME.game.input.keyboard.addKeyCapture(KEY_LEFTARROW);
	GAME.game.input.keyboard.addKeyCapture(KEY_RIGHTARROW);
	GAME.game.input.keyboard.addKeyCapture(KEY_UPARROW);
	GAME.ENTITIES.background = GAME.game.add.tileSprite(0, 0, 2065, 600, "background");
	GAME.ENTITIES.background.modPhysics = new Object(null);
	GAME.ENTITIES.background.modPhysics.velX = 0.2;
	GAME.ENTITIES.background.modPhysics.aVelX = 0.1;
	GAME.ENTITIES.floor = GAME.game.add.tileSprite(0, 500, 1590, 100, "floor");
	GAME.ENTITIES.floor.modPhysics = new Object(null);
	GAME.ENTITIES.floor.modPhysics.velX = 5;
	GAME.ENTITIES.floor.modPhysics.aVelX = 1;
	GAME.ENTITIES.player = new Player(GAME, 338, 393, 393, -23);
	GAME.ENTITIES.enemys = new Entities(GAME, 0, 5);
	GAME.ENTITIES.bonus = new Entities(GAME, 1, 5);
	GAME.ENTITIES.nachos = new Entities(GAME, 2, 5);
	GAME.HUB.score = GAME.game.add.text(90, 7, "¡Comienza una nueva partida!", {font: "16px Arial", fill: "black"});
	GAME.HUB.maxScore = GAME.game.add.text(300, 7, "", {font: "16px Arial", fill: "black"});
	GAME.HUB.level = GAME.game.add.text(650, 7, "", {font: "16px Arial", fill: "black"});
	GAME.HUB.life = new HUB_life();
	GAME.HUB.texts = GAME.game.add.group();
	GAME.SOUND.music = GAME.game.add.audio("sound1", 1, false);
	GAME.SOUND.guru = GAME.game.add.audio("sound2", 1, false);
	GAME.EVENTS.end(0);
}

function update() {
	if (GAME.STATS.paused == true) return 0;
	if (GAME.STATS.cEnd == true && GAME.STATS.score >= GAME.STATS.maxScore) GAME.EVENTS.win();
	if (GAME.TIMER.createManager[1] != GAME.STATS.createTime) GAME.TIMER.createManager[1] = GAME.STATS.timeCreate;
	GAME.TIMER.createManager[0]++;
	if (GAME.TIMER.createManager[0] >= GAME.TIMER.createManager[1]) {
		GAME.TIMER.createManager[0] = 0;
		GAME.TIMER.createManager[2].apply(this, []);
	}
	GAME.ENTITIES.player.modEvents.update();
	GAME.ENTITIES.enemys.modEvents.update(GAME.ENTITIES.enemys.modPhysics.velX);
	GAME.ENTITIES.bonus.modEvents.update(GAME.ENTITIES.bonus.modPhysics.velX);
	GAME.ENTITIES.nachos.modEvents.update(GAME.ENTITIES.nachos.modPhysics.velX);
	GAME.HUB.score.content = "Score: " + GAME.STATS.score.toString();
	GAME.HUB.life.update();
	if (GAME.ENTITIES.player.modStates.walkingSide == 0) GAME.ENTITIES.floor.tilePosition.x -= GAME.ENTITIES.floor.modPhysics.velX - GAME.ENTITIES.floor.modPhysics.aVelX, GAME.ENTITIES.background.tilePosition.x -= GAME.ENTITIES.background.modPhysics.velX - GAME.ENTITIES.background.modPhysics.aVelX;
	else if (GAME.ENTITIES.player.modStates.walkingSide == 1) GAME.ENTITIES.floor.tilePosition.x -= GAME.ENTITIES.floor.modPhysics.velX + GAME.ENTITIES.floor.modPhysics.aVelX, GAME.ENTITIES.background.tilePosition.x -= GAME.ENTITIES.background.modPhysics.velX + GAME.ENTITIES.background.modPhysics.aVelX;
	else GAME.ENTITIES.floor.tilePosition.x -= GAME.ENTITIES.floor.modPhysics.velX, GAME.ENTITIES.background.tilePosition.x -= GAME.ENTITIES.background.modPhysics.velX;
}

GAME.EVENTS.win = function() {
	GAME.ENTITIES.enemys.forEachExists(function(enemy){
		enemy.kill();
	});
	GAME.ENTITIES.bonus.forEachExists(function(bonu){
		bonu.kill();
	});
	GAME.ENTITIES.nachos.forEachExists(function(nacho){
		nacho.kill();
	});
	if (GAME.SOUND.music) GAME.SOUND.music.stop();
	GAME.ENTITIES.floor.visible = false;
	GAME.STATS.paused = true;
	GAME.EVENTS.endNacho();
	GAME.ENTITIES.player.modEvents.restart();
	if (GAME.HUB.texts) GAME.HUB.texts.removeAll();
	GAME.ENTITIES.player.tween = GAME.game.add.tween(GAME.ENTITIES.player).to({x: 400, y: 600 - 194 - 112}, 3000, Phaser.Easing.Bounce.Out, true, 0, false, false);
	GAME.ENTITIES.player.tween.onComplete.add(function(player){player.animations.stop("jump"); player.animations.play("run", 10)}, this);
	GAME.ENTITIES.win = GAME.game.add.sprite(800, 600 - 194, "win");
	GAME.ENTITIES.win.tween = GAME.game.add.tween(GAME.ENTITIES.win).to({x: 0}, 3000, Phaser.Easing.Elastic.Out, true, 0, false, false);
	GAME.ENTITIES.background.tilePosition.x = 0;
	GAME.HUB.win = GAME.game.add.text(100, -50, "¡Enhorabuena! Has ganado una PS4", {font: "30px Arial", fill: "black"});
	GAME.HUB.win.tween = GAME.game.add.tween(GAME.HUB.win).to({y: 120}, 3000, Phaser.Easing.Elastic.Out, true, 0, false, false);
	GAME.HUB.win.tween.onComplete.add(function(){setTimeout(function(){
		GAME.ENTITIES.player.tween = GAME.game.add.tween(GAME.ENTITIES.player).to({x:900}, 2000, Phaser.Easing.Linear.None, true, 0, false, false);
		GAME.ENTITIES.player.tween.onComplete.add(function(p){p.kill()}, this);
		GAME.ENTITIES.win.tween = GAME.game.add.tween(GAME.ENTITIES.win).to({y: 600}, 2000, Phaser.Easing.Bounce.Out, true, 0, false, false);
		GAME.ENTITIES.win.tween.onComplete.add(function(p){p.kill()}, this);
		GAME.HUB.win.tween = GAME.game.add.tween(GAME.HUB.win).to({y:600}, 2000, Phaser.Easing.Bounce.Out, true, 0, false, false);
		GAME.HUB.win.tween.onComplete.add(function(p){p.destroy()}, this);
		GAME.HUB.win.tween.onComplete.add(function(){
			GAME.HUB.win = GAME.game.add.sprite(850, 20, "creditos");
			GAME.HUB.win.tween = GAME.game.add.tween(GAME.HUB.win).to({x: 800 - 154}, 2000, Phaser.Easing.Bounce.In, true, 0, false, false);
		}, this);
	}, 2000)}, this);
}

GAME.EVENTS.createAllManager = function() {
	var v = 0;
	if (GAME.STATS.createdForNacho == GAME.STATS.maxCreatedForNacho) v = 1, GAME.STATS.createdForNacho = 0, GAME.STATS.maxCreatedForNacho = GAME.game.rnd.integerInRange(20, 30);
	if (GAME.STATS.isNachoFliping == true) v = 2;
	else GAME.STATS.createdForNacho++;
	GAME.STATS.createdTotal++;
	GAME.EVENTS.createAll(v);
}

GAME.EVENTS.createAll = function(mode) {
	var f = new Array(1);
	if (mode == 0) f = [function(i){GAME.ENTITIES.enemys.modEvents.create(0, i)}, function(i){GAME.ENTITIES.bonus.modEvents.create(1, i)}];
	if (mode == 1) f = [function(i){GAME.ENTITIES.enemys.modEvents.create(0, i)}, function(i){GAME.ENTITIES.nachos.modEvents.create(2, i)}];
	if (mode == 2) f = [function(i){GAME.ENTITIES.bonus.modEvents.create(1, i)}, function(i){GAME.ENTITIES.bonus.modEvents.create(1, i)}];
	var grid = new Array(4);
	var gridUsed = new Array(4);
	for (i = 0; i < grid.length; i++) grid[i] = i + 1, gridUsed[i] = 0;
	for (i = 0; i < f.length; i++) {
		var a = 0;
		var gridReal = new Array(null);
		for (e = 0; e < grid.length; e++) if (gridUsed[e] == 0) gridReal[a] = grid[e], a++;
		var r = GAME.game.rnd.integerInRange(0, gridReal.length);
		var gridAct = gridReal[r];
		f[i].apply(this, [gridAct]);
		for (e = 0; e < grid.length; e++) if (grid[e] == gridReal[r]) gridUsed[e] = 1;
	}
}

function setLocalScore() {
	if (GAME.STATS.level == 0) localStorage.maxScore0 = GAME.STATS.score;
	else if (GAME.STATS.level == 1) localStorage.maxScore1 = GAME.STATS.score;
	else if (GAME.STATS.level == 2) localStorage.maxScore2 = GAME.STATS.score;
	else if (GAME.STATS.level == 3) localStorage.maxScore3 = GAME.STATS.score;
	else return;
}

function getLocalScore() {
	if (GAME.STATS.level == 0) return localStorage.maxScore0;
	else if (GAME.STATS.level == 1) return localStorage.maxScore1;
	else if (GAME.STATS.level == 2) return localStorage.maxScore2;
	else if (GAME.STATS.level == 3) return localStorage.maxScore3;
	else return null;
}

GAME.EVENTS.end = function(type) {
	if (GAME.ENTITIES.player.tween != undefined) GAME.ENTITIES.player.tween.stop();
	if (GAME.ENTITIES.win) GAME.ENTITIES.win.tween.stop();
	if (GAME.HUB.win) GAME.HUB.win.tween.stop();
	GAME.ENTITIES.player.kill();
	GAME.ENTITIES.enemys.forEachExists(function(enemy){
		if (enemy.tween) enemy.tween.stop();
		enemy.kill();
	});
	GAME.ENTITIES.bonus.forEachExists(function(bonu){
		if (bonu.tween) bonu.tween.stop();
		bonu.kill();
	});
	GAME.ENTITIES.nachos.forEachExists(function(nacho){
		nacho.kill();
	});
	if (GAME.SOUND.music) GAME.SOUND.music.stop();
	GAME.ENTITIES.floor.visible = false;
	GAME.HUB.life.visible = false;
	GAME.STATS.paused = true;
	GAME.EVENTS.endNacho();
	GAME.ENTITIES.player.modEvents.restart();
	if (GAME.HUB.texts) GAME.HUB.texts.removeAll();
	if (!type) return 0;
	var recordStr = "";
	var newRecord = false;
	if (typeof(Storage) !== "undefined") {
		if (getLocalScore() == undefined) setLocalScore();
		else if (GAME.STATS.score > getLocalScore()) setLocalScore(), newRecord = true;
		if (newRecord) recordStr = "High Score: " + getLocalScore().toString() + " (¡Nuevo record!)";
		else recordStr = "High Score: " + getLocalScore().toString();
	}
	GAME.ENTITIES.guru = GAME.game.add.sprite(0, -600, "guru");
	GAME.ENTITIES.guru.tween = GAME.game.add.tween(GAME.ENTITIES.guru).to({y:0}, 1000, Phaser.Easing.Back.InOut, true, 0, false, false);
    GAME.ENTITIES.guru.tween.onComplete.add(function(){
		if (GAME.STATS.cSound) GAME.SOUND.guru.play();
		GAME.HUB.scoreTop = GAME.game.add.text(180, 450, "Score: " + GAME.STATS.score.toString(), {font:"25px Arial", fill:"white"});
		GAME.HUB.levelTop = GAME.game.add.text(450, 450, "Nivel: " + ["Principiante", "Intermedio", "Experto", "Meriforero"][GAME.STATS.level], {font:"25px Arial", fill:"white"});
		if (newRecord) GAME.HUB.maxScoreTop = GAME.game.add.text(180, 480, "High Score: " + getLocalScore().toString() + " (¡Nuevo record!)", {font:"25px Arial", fill:"white"});
		else GAME.HUB.maxScoreTop = GAME.game.add.text(180, 480, recordStr, {font:"25px Arial", fill:"white"});
		var str = "GAME OVER";
		var i = 0;
		texts = new Array();
		var timer = setInterval(function(){
			if (str[i] == "") return;
			texts.push(GAME.game.add.text((i * 50) + 180, -100, str[i], {font:"50px Arial", fill:"red"}));
			texts[i].tween = GAME.game.add.tween(texts[i]).to({y:400}, 1500, Phaser.Easing.Bounce.Out, true, 0, false, false);
			if (i + 1 <= str.length) return i++;
			else return clearInterval(timer);
		}, 200);
	}, this);
    return 1;
}

GAME.EVENTS.restart = function(level) {
	GAME.STATS.restart();
    if (level == 0) GAME.EVENTS.level(5, 0.2, 5, 10, 60, 15, 25000);
    else if (level == 1) GAME.EVENTS.level(7, 0.5, 7, 14, 50, 20, 20000);
    else if (level == 2) GAME.EVENTS.level(10, 0.8, 10, 16, 40, 30, 15000);
    else if (level == 3) GAME.EVENTS.level(12, 1, 11, 20, 30, 40, 10000);
    else return 0;
    if (texts) {
		var i = 0;
		clearInterval(timer);
		var timer = setInterval(function(){
			if (!texts[i]) return;
			if (texts[i].tween) texts[i].tween.stop();
			texts[i].tween = GAME.game.add.tween(texts[i]).to({y:-150}, 800, Phaser.Easing.Bounce.Out, true, 0, false, false);
			texts[i].tween.onComplete.add(function(text){
				text.destroy();
			}, this);
			if (i + 1 <= texts.length) return i++;
			else return clearInterval(timer);
		}, 50);
	}
	if (GAME.HUB.scoreTop) GAME.HUB.scoreTop.destroy();
	if (GAME.HUB.levelTop) GAME.HUB.levelTop.destroy();
	if (GAME.HUB.maxScoreTop) GAME.HUB.maxScoreTop.destroy();
    if (GAME.HUB.texts) GAME.HUB.texts.removeAll();
    if (GAME.HUB.win) GAME.HUB.win.destroy();
    if (GAME.STATS.cSound) GAME.SOUND.music.play("", 0, 0.6, true);
    GAME.TIMER.createManager = [0, GAME.STATS.timeCreate, GAME.EVENTS.createAllManager];
    GAME.ENTITIES.floor.visible = true;
    GAME.HUB.life.visible = true;
    GAME.ENTITIES.player.reset(338, 392);
    if (GAME.ENTITIES.win) GAME.ENTITIES.win.kill();
    if (GAME.SOUND.guru.isPlaying) GAME.SOUND.guru.stop();
    if (GAME.ENTITIES.guru) {
		GAME.ENTITIES.guru.tween.stop();
		GAME.ENTITIES.guru.tween = GAME.game.add.tween(GAME.ENTITIES.guru).to({y:-800}, 1000, Phaser.Easing.Bounce.Out, true, 0, false, false);
		GAME.ENTITIES.guru.tween.onComplete.add(function(guru){guru.kill()}, this);
	}
	GAME.STATS.paused = false;
}

GAME.EVENTS.reend = function(level) {
	GAME.EVENTS.end(0);
	GAME.EVENTS.restart(level);
}

GAME.EVENTS.level = function(vXbonus, vXbackground, vXfloor, velFramePlayer, timeCreate, mXnacho, mXscore) {
	if (vXbonus == 5) GAME.STATS.level = 0;
	else if (vXbonus == 7) GAME.STATS.level = 1;
	else if (vXbonus == 10) GAME.STATS.level = 2;
	else if (vXbonus == 12) GAME.STATS.level = 3;
	else return 0;
	GAME.HUB.level.content = "Nivel: " + ["Principiante", "Intermedio", "Experto", "Meriforero"][GAME.STATS.level];
	if (GAME.STATS.cEnd == true) GAME.HUB.maxScore.content = "Max. Score: " + mXscore.toString();
	else GAME.HUB.maxScore.content = "Modo Infinito";
	GAME.ENTITIES.bonus.modPhysics.velX = vXbonus;
	GAME.ENTITIES.bonus.modPhysics.defVelX = vXbonus;
	GAME.ENTITIES.enemys.modPhysics.velX = vXbonus;
	GAME.ENTITIES.nachos.modPhysics.velX = vXbonus;
	GAME.ENTITIES.background.modPhysics.velX = vXbackground;
	GAME.ENTITIES.background.modPhysics.defVelX = vXbackground;
	GAME.ENTITIES.floor.modPhysics.velX = vXfloor;
	GAME.ENTITIES.floor.modPhysics.defVelX = vXfloor
	GAME.ENTITIES.player.velFrame = velFramePlayer;
	GAME.ENTITIES.player.defVelFrame = velFramePlayer;
	GAME.STATS.timeCreate = timeCreate;
	GAME.STATS.defTimeCreate = timeCreate;
	GAME.STATS.maxCreatedForNacho = mXnacho;
	GAME.STATS.maxScore = mXscore;
}

GAME.EVENTS.endNacho = function() {
	GAME.STATS.isNachoFliping = false;
	GAME.ENTITIES.bonus.modPhysics.velX = GAME.ENTITIES.bonus.modPhysics.defVelX;
	GAME.ENTITIES.background.modPhysics.velX = GAME.ENTITIES.background.modPhysics.defVelX;
	GAME.ENTITIES.floor.modPhysics.velX = GAME.ENTITIES.floor.modPhysics.defVelX;
	GAME.ENTITIES.player.velFrame = GAME.ENTITIES.player.defVelFrame;
	GAME.ENTITIES.player.animations.stop("run");
	if (GAME.ENTITIES.player.modStates.jumpingT == false) GAME.ENTITIES.player.animations.play("run", 10);
	GAME.STATS.timeCreate = GAME.STATS.defTimeCreate;
	if (GAME.TIMER.createManager) GAME.TIMER.createManager[0] = 0;
}
