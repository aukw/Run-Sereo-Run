function Entities(GAME, vX) {
	var entities = GAME.game.add.group();
	entities.modPhysics = new Object();
	entities.modPhysics.velX = vX;
	entities.modEvents = new Object();
	entities.modEvents.create = function(type, vgrid) {
		if (vgrid == undefined) vgrid = GAME.game.rnd.integerInRange(1, 5);
		if (type == 0) ent = entities.create(800, vgrid * 100, "avatares", GAME.game.rnd.integerInRange(0, 312));
		else if (type == 1) ent = entities.create(800, vgrid * 100, "bonus");
		else if (type == 2) ent = entities.create(800, vgrid * 100, "nacho");
		else return 0;
		return ent.body.immovable = true;
	}
	entities.modEvents.update = function(v) {
		if (v == undefined) v = 2;
		entities.forEachAlive(function(ent){
			ent.body.x -= v;
			if (ent.body.x >= -50) return 0;
			ent.kill();
			if (entities.type = 0) GAME.STATS.score += 10;
			if (GAME.STATS.cEnd && GAME.STATS.score >= GAME.STATS.maxScore) GAME.EVENTS.win();
		});
	}
	return entities;
}
