// Executes BEFORE introduction

module.exports = function (player) {
	player.game.addAction("arsonist/attacked", ["attacked"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})
}
