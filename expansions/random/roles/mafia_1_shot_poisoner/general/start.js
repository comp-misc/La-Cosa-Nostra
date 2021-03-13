// Executes BEFORE introduction

module.exports = function (player) {
	player.game.addAction("mafia_1_shot_poisoner/roleblocked", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})

	player.addAttribute("mafia_factionkill")

	player.misc.toxicologist_poisons_left = 1
}
