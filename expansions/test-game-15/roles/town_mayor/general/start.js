// Executes BEFORE introduction

module.exports = function (player) {
	player.game.addAction("town_mayor/arbiter_modifier", ["cycle"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})
}
