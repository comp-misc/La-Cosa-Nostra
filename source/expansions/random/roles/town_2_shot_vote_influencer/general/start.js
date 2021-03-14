// Executes BEFORE introduction

module.exports = function (player) {
	player.game.addAction("town_2_shot_vote_influencer/roleblocked", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})

	player.misc.vote_influencer_influences_left = 2
}
