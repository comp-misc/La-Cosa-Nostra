// Executes BEFORE introduction

module.exports = function (player) {
	player.game.addAction("mafia_2_shot_jailkeeper/roleblocked", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})

	player.addAttribute("mafia_factionkill")

	player.misc.jailkeeper_jails_left = 2
}
