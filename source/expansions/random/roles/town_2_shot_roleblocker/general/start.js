// Executes BEFORE introduction

module.exports = function (player) {
	player.game.addAction("town_2_shot_roleblocker/roleblocked", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})

	player.misc.roleblocker_roleblocks_left = 2
}
