// Executes BEFORE introduction

module.exports = function (player) {
	player.game.addAction("town_2_shot_messenger/roleblocked", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})

	player.misc.messenger_messages_left = 2
}