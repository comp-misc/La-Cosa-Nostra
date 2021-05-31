import { GuildMember } from "discord.js"
import Game from "../../game_templates/Game"

export default async (game: Game): Promise<void> => {
	const mafiaChannel = game.channels.mafia
	if (!mafiaChannel) {
		return
	}
	const textChannel = game.findTextChannel(mafiaChannel.id)
	const read_perms = game.config["base-perms"].read

	const mafia = game.findAllPlayers((x) => x.see_mafia_chat)
	mafia.forEach((mafia) => {
		if (!mafia.getSpecialChannels().some((x) => x.id === mafiaChannel.id)) {
			mafia.addSpecialChannel(textChannel)
		}
	})

	await Promise.all(
		mafia
			.map((mafia) => mafia.getGuildMember())
			.filter((m) => !!m)
			.map((member) => textChannel.createOverwrite(member as GuildMember, read_perms))
	)
}
