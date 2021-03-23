// Executes BEFORE introduction
import { AttributeStart } from "../../../../../systems/Attribute"

const start: AttributeStart = (player): void => {
	if (
		player
			.getGame()
			.actions.find((x) => x.from === player.identifier && x.identifier === "a/ability_watch/roleblock_noresult")
	) {
		return
	}

	player.getGame().addAction("a/ability_watch/roleblock_noresult", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})
}

export default start
