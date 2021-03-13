// Executes BEFORE introduction

module.exports = function (player) {
	player.game.addAction("town_2_shot_alignment_cop/roleblock_noresult", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})

	player.misc.cop_investigations = 2
}
