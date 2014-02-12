function HUB_life(x, y, idclass, player) {
	life = GAME.game.add.group();
	life.mod = new Object(null);
	if (x == undefined) x = 5;
	if (y == undefined) y = 2;
	if (!idclass) idclass = "heart";
	if (!player) player = GAME.ENTITIES.player;
	life.mod.x = x, life.mod.y = y, life.mod.idclass = idclass, life.mod.player = player;
	for (i = 0; i < 3; i++) life.create((i * 25) + x, y, idclass);
	life.update = function() {
		var life_array = [1, 1, 1];
		for (i = 0; i < life.mod.player.mod.life; i++) life_array[i] = 0;
		var a = 0;
		life.forEachExists(function(heart){
			if (life_array[a] == 0) heart.frame = 0;
			else heart.frame = 1;
			a++;
		});
	}
	return life;
}
