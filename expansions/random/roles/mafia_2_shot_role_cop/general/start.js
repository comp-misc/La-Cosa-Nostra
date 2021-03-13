// Executes BEFORE introduction

module.exports = function (player) {
	player.addAttribute("mafia_factionkill")

	player.game.addAction("mafia_2_shot_role_cop/roleblock_noresult", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})

	player.misc.role_cop_checks_left = 2
}
