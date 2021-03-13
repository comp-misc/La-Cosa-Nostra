// Executes BEFORE introduction

module.exports = function (player) {
	player.misc.fool_lynched = false

	player.game.addAction("3p_fool/lynched", ["lynch"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})
}
