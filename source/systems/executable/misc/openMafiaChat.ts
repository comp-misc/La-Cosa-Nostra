import Game from "../../game_templates/Game"

export default async (game: Game): Promise<void> => {
	const mafiaChannel = game.channels.mafia
	if (!mafiaChannel) {
		return
	}
	const textChannel = game.findTextChannel(mafiaChannel.id)
	const post_perms = game.config["base-perms"].post
	const read_perms = game.config["base-perms"].read

	const mafia = game.findAllPlayers((x) => x.see_mafia_chat)
	mafia.forEach((mafia) => {
		if (!mafia.getSpecialChannels().some((x) => x.id === mafiaChannel.id)) {
			mafia.addSpecialChannel(textChannel)
		}
	})
	for (let i = 0; i < mafia.length; i++) {
		const member = mafia[i].getGuildMember()
		if (!member) {
			continue
		}

		if (mafia[i].isAlive()) {
			await textChannel.createOverwrite(member, post_perms)
		} else {
			await textChannel.createOverwrite(member, read_perms)
		}
	}
}
