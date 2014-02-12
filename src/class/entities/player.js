function Player(GAME, x, y, bY, vY) {
	var player = GAME.game.add.sprite(x, y, "player");
	player.body.collideWorldBounds = true;
	player.GAME = GAME;
	player.mod = new Object(null);
	player.mod.life = 3;
	player.modStates = new Object(null);
	player.modStates.walking = new Object(null);
	player.modStates.walking.side = null;
	player.modStates.walking = false;
	player.modStates.jumping = false;
	player.modStates.jumpingT = false;
	player.modPhysics = new Object(null);
	player.modPhysics.boundY = bY;
	player.modPhysics.velY = vY;
	player.modPhysics.aVelY = player.modPhysics.velY;
	player.modPhysics.velFrame = 10;
	player.animations.add("run", [0, 1, 2, 3, 4, 5, 6, 7]);
	player.animations.add("jump", [8, 9, 10, 11]);
	player.animations.add("jumprun", [12, 13, 14]);
	player.animations.play("run", player.modPhysics.velFrame, true);
	player.modEvents = new Object();
	player.modEvents.walk = function(side) {
		if (side == null) return 0;
		player.modStates.walkingSide = side;
		player.modStates.walking = true;
	}
	player.modEvents.walking = function() {
		if (player.modStates.walkingSide == 0 && player.body.x - 5 >= 0) player.body.x -= 5;
		else if (player.modStates.walkingSide == 1 && player.body.x + 10 <= 800) player.body.x += 10;
		else return 0;
	}
	player.modEvents.jump = function() {
		player.modStates.jumping = true;
		setTimeout(function(){
			player.modStates.jumpingT = true;
		}, 200);
		player.animations.play("jump", 9);
	}
	player.modEvents.jumping = function() {
		if (player.body.y + player.modPhysics.aVelY <= player.modPhysics.boundY) {
			player.body.y += player.modPhysics.aVelY;
			player.modPhysics.aVelY += player.GAME.PHYSICS.gravity;
			if (player.body.y < 0) player.modPhysics.aVelY = player.GAME.PHYSICS.gravity;
			if (player.modPhysics.aVelY > 0 && player.body.y >= 300) player.animations.play("jumprun", 1);
		} else {
			player.body.y = player.modPhysics.boundY;
			player.modStates.jumping = false;
			player.modStates.jumpingT = false;
			player.modPhysics.aVelY = player.modPhysics.velY;
		}
	}
	player.modEvents.collideWithEnemy = function(player, enemy) {
		if ((player.body.y + player.body.height - 20) < enemy.body.y) {
			enemy.loadTexture("lifedown", 0);
			enemy.animations.add("lifedown", [0, 1, 2, 3, 4]);
			enemy.animations.play("lifedown", 8, false, true);
			enemy.tween = GAME.game.add.tween(enemy).to({x: player.GAME.HUB.score.x, y: player.GAME.HUB.score.y}, 500, Phaser.Easing.Linear.None, true, 0, false, false);
			enemy.tween.onComplete.add(function(enemy){enemy.kill(); GAME.STATS.score += 20}, this);
			player.modPhysics.aVelY = -15;
			player.animations.play("jump", 9);
		} else {
			enemy.kill();
			if (GAME.STATS.score >= 500) GAME.STATS.score -= 500;
			else GAME.STATS.score = 0;
			player.mod.life--;
			if (player.mod.life == 0) return player.GAME.EVENTS.end(1);
			else player.GAME.HUB.texts.removeAll(), player.GAME.HUB.texts.add(player.GAME.game.add.text(10, 30, "-1 UP", {font: "20px Arial", fill:"red"})), setTimeout(function(){
				player.GAME.HUB.texts.removeAll();
			}, 1500);
		}
	}
	player.modEvents.collideWithBonus = function(player, bonus) {
		if (bonus.tagged) return 0;
		bonus.tagged = true;
		bonus.tween = GAME.game.add.tween(bonus).to({x: player.GAME.HUB.score.x, y: player.GAME.HUB.score.y}, 500, Phaser.Easing.Linear.None, true, 0, false, false);
		bonus.tween.onComplete.add(function(bonus){bonus.kill(); GAME.STATS.score += 50}, this);
	}
	player.modEvents.collideWithNacho = function(player, nacho) {
		nacho.kill();
		player.GAME.HUB.texts.removeAll();
		if (player.mod.life < 3) player.mod.life++, player.GAME.HUB.texts.add(player.GAME.game.add.text(10, 30, "+1 UP!", {font: "20px Arial", fill:"green"}));
		GAME.STATS.score += 1000;
		GAME.STATS.isNachoFliping = true;
		GAME.ENTITIES.bonus.modPhysics.velX = GAME.ENTITIES.bonus.modPhysics.defVelX + 20;
		GAME.ENTITIES.background.modPhysics.velX = GAME.ENTITIES.background.modPhysics.defVelX + 5;
		GAME.ENTITIES.floor.modPhysics.velX = GAME.ENTITIES.background.modPhysics.defVelX + 10;
		GAME.ENTITIES.enemys.forEachAlive(function(enemy){
			enemy.kill();
		});
		GAME.ENTITIES.bonus.forEachAlive(function(bonu){
			bonu.kill();
		});
		player.velFrame = player.defVelFrame + 10;
		GAME.STATS.timeCreate = GAME.STATS.defTimeCreate / 5;
		for (i = 0; i < 3; i++) player.GAME.HUB.texts.add(player.GAME.game.add.text(150, (i * 100) + 100, ["WOW!", "¡Impresionante!", "XBOX ONE!!1"][i], {font: GAME.game.rnd.integerInRange(75, 100).toString() + "px Arial", fill:["red", "blue", "yellow", "green"][GAME.game.rnd.integerInRange(0, 4)]}));
		setTimeout(function(){player.GAME.HUB.texts.removeAll()}, 2000);
		setTimeout(GAME.EVENTS.endNacho, 6000);
	}
	player.modEvents.update = function() {
		player.GAME.ENTITIES.enemys.forEachAlive(function(enemy){
			if (rCollision(player, enemy) && enemy.animations.frameTotal > 5) return player.modEvents.collideWithEnemy(player, enemy);
		});
		player.GAME.ENTITIES.bonus.forEachAlive(function(bonu){
			if (rCollision(player, bonu)) return player.modEvents.collideWithBonus(player, bonu);
		});
		player.GAME.ENTITIES.nachos.forEachAlive(function(nacho){
			if (rCollision(player, nacho)) return player.modEvents.collideWithNacho(player, nacho);
		});
		if (GAME.game.input.keyboard.isDown(KEY_LEFTARROW) || GAME.game.input.keyboard.isDown(KEY_A)) player.modEvents.walk(0);
		else if (GAME.game.input.keyboard.isDown(KEY_RIGHTARROW) || GAME.game.input.keyboard.isDown(KEY_D)) player.modEvents.walk(1);
		else player.modStates.walking = false, player.modStates.walkingSide = null;
		if (player.modStates.jumping == false) if (GAME.game.input.keyboard.isDown(KEY_SPACEBAR) || GAME.game.input.keyboard.isDown(KEY_W) || GAME.game.input.keyboard.isDown(KEY_UPARROW)) player.modEvents.jump();
		if (player.modStates.walking == true) player.modEvents.walking();
		if (player.modStates.jumping == true && player.modStates.jumpingT == true) player.modEvents.jumping();
		if (!player.modStates.jumping) player.animations.play("run", player.velFrame, true);
	}
	player.modEvents.restart = function() {
		player.mod.life = 3;
		player.modStates.walking.side = null;
		player.modStates.walking = false;
		player.modStates.jumping = false;
		player.modStates.jumpingT = false;
		player.modPhysics.aVelY = player.modPhysics.velY;
		player.modPhysics.velFrame = 10;
	}
	return player;
}
