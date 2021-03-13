// Executes BEFORE introduction

module.exports = function (player) {
	player.game.addAction("town_2_shot_tracker/roleblock_noresult", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})

	player.misc.tracker_tracks_left = 2
}
