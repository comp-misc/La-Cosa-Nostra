// Executes BEFORE introduction

module.exports = function (player) {
	player.game.addAction("town_2_shot_kidnapper/roleblocked", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})

	player.misc.kidnapper_kidnaps_left = 2
}
