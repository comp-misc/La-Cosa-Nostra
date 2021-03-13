// Executes BEFORE introduction

module.exports = function (player) {
	player.misc.haunted_jester_lynched = false
	player.misc.haunted_jester_haunted = false

	player.game.addAction("3p_haunted_jester/lynched", ["lynch"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})
}
