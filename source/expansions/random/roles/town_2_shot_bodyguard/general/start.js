// Executes BEFORE introduction

module.exports = function (player) {
	player.game.addAction("town_2_shot_bodyguard/roleblocked", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})

	player.misc.bodyguard_guards_left = 2
}
