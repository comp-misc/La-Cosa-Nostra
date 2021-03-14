// Executes BEFORE introduction

module.exports = function (player) {
	player.game.addAction("town_1_shot_jailkeeper/roleblocked", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})

	player.misc.jailkeeper_jails_left = 1
}
