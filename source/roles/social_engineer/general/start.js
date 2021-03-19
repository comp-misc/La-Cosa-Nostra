// Executes BEFORE introduction

module.exports = function (player) {
	player.misc.se_influence_log = new Array()

	player.game.addAction("social_engineer/promotion", ["cycle"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
		priority: 13,
	})
}
