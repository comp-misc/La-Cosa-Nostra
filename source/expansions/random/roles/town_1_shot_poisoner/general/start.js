// Executes BEFORE introduction

module.exports = function (player) {
	player.game.addAction("town_1_shot_poisoner/roleblocked", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})

	player.misc.apothecarist_poisons_left = 1
}
