// Executes BEFORE introduction

module.exports = function (player) {
	player.game.addAction("town_nonconsecutive_poisoner/roleblocked", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})

	player.misc.consecutive_night = false
}
