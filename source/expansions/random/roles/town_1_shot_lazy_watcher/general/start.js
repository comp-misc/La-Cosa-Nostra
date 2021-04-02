// Executes BEFORE introduction

module.exports = function (player) {
	player.game.addAction("town_1_shot_lazy_watcher/roleblock_noresult", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})

	player.misc.lazy_watcher_watches_left = 1
}