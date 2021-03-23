// Executes BEFORE introduction
import { RoleStart } from "../../../../../systems/Role"

const start: RoleStart = (player) => {
	if (
		player
			.getGame()
			.actions.find((x) => x.from === player.identifier && x.identifier === "a/ability_gunsmith/roleblock_noresult")
	) {
		return
	}

	player.getGame().addAction("a/ability_gunsmith/roleblock_noresult", ["roleblock"], {
		from: player,
		to: player,
		expiry: Infinity,
		tags: ["permanent"],
	})
}

export default start
