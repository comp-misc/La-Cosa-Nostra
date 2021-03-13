// Executes BEFORE introduction

module.exports = function (player) {
	player.game.addAction("town_1_shot_lazy_tracker/roleblock_noresult", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})

	player.misc.lazy_tracker_tracks_left = 1
}
