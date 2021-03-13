// Executes BEFORE introduction

module.exports = function (player) {
	player.misc.oracle_last_target = null

	player.game.addAction("town_2_shot_oracle/roleblocked", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})

	player.game.addAction("town_2_shot_oracle/reveal", ["killed"], {
		name: "Oracle-reveal",
		expiry: Infinity,
		from: player,
		to: player,
		tags: ["permanent"],
	})

	player.misc.oracle_selects_left = 2
}
