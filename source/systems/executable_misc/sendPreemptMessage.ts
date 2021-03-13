import Player from "../game_templates/Player"
import auxils from "./../auxils"

export = async (player: Player, successes: Player[]): Promise<void> => {
	const successesNames = successes.map((x) => "**" + x.getDisplayName() + "**")

	await player
		.getPrivateChannel()
		.send(
			":open_file_folder: Your pre-emptive vote" +
				auxils.vocab("s", successesNames.length) +
				" against " +
				auxils.pettyFormat(successesNames) +
				" " +
				auxils.vocab("has", successesNames.length) +
				" been executed."
		)
}
