// Executes BEFORE introduction

module.exports = function (player) {
	player.game.addAction("mafia_2_shot_deflector/roleblocked", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})

	player.addAttribute("mafia_factionkill")

	player.misc.deflector_deflections_left = 2
}
