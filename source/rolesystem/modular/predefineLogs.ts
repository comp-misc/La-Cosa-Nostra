import Player from "../../systems/game_templates/Player"

const predefineLogs = (player: Player): void => {
	// Create a log if it does not exist
	if (!player.modular_log) {
		player.modular_log = []
	}

	if (!player.modular_success_log) {
		player.modular_success_log = []
	}
}

export default predefineLogs
