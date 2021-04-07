// Executes BEFORE introduction
import { AttributeStart } from "../../../../../systems/Attribute"

const start: AttributeStart = async (player) => {
	if (
		player
			.getGame()
			.actions.find((x) => x.from === player.identifier && x.identifier === "a/ability_watch/roleblock_noresult")
	) {
		return
	}

	await player.getGame().addAction("a/ability_watch/roleblock_noresult", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})
}

export default start
