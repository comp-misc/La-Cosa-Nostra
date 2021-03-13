// Executes BEFORE introduction

module.exports = function (player) {
	player.game.addAction("mafia_2_shot_tracker/roleblock_noresult", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})

	player.addAttribute("mafia_factionkill")

	player.misc.tracker_tracks_left = 2
}
