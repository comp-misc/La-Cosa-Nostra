// Executes BEFORE introduction

module.exports = function (player) {
	player.game.addAction("town_2_shot_vigilante/roleblocked", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})

	player.misc.vigilante_kills_left = 2
}
