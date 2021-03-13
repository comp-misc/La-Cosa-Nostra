// Executes BEFORE introduction

module.exports = function (player) {
	player.game.addAction("town_2_shot_firefighter/roleblocked", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})

	player.misc.firefighter_extinguishes_left = 2
}
