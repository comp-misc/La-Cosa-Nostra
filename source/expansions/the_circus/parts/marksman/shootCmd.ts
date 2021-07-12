import Marksman from "."
import weightedRandom from "../../../../auxils/weightedRandom"
import { CommandUsageError, RoleCommand } from "../../../../commands/CommandType"
import makeCommand from "../../../../commands/makeCommand"
import getDeathBroadcast from "../../../../systems/executable/misc/getDeathBroadcast"
import getDeathMessage from "../../../../systems/executable/misc/getDeathMessage"
import ActionPriorities from "../../../../systems/game_templates/ActionPriorities"
import Player from "../../../../systems/game_templates/Player"

enum Outcome {
	KILL = "kill",
	MISS = "injure",
	SELF_INFLICT = "self inflict",
}

const shoot: RoleCommand = async (game, message, params, from) => {
	const role = from.role.getPartOrThrow(Marksman)

	if (role.getBulletsShot() >= role.config.bullets) {
		await message.reply(":x: You have already shot all your bullets!")
		return
	}
	if (params.length === 0 || params.length > 2 || (params.length == 2 && params[1] !== "confirm")) {
		throw new CommandUsageError()
	}
	const playerMatch = game.getPlayerMatch(params[0])
	if (playerMatch.score < 0.7) {
		await message.reply(":x: Unknown player")
		return
	}
	const target = playerMatch.player
	if (!target.isAlive()) {
		await message.reply(":x: You can't use your ability on a dead player!")
		return
	}
	if (from === target) {
		await message.reply("You can't use your ability on yourself!")
		return
	}
	if (params.length != 2 || params[1] !== "confirm") {
		await message.reply(":warning: Please use `!shoot <player> confirm` to confirm your shot")
		return
	}

	const config = role.config
	const outcome = weightedRandom(
		[Outcome.KILL, config.killProbability],
		[Outcome.MISS, config.missProbability],
		[Outcome.SELF_INFLICT, config.selfInflictProbability]
	)

	role.addBulletShot()
	if (outcome === Outcome.MISS) {
		await game.sendPin(
			game.getMainChannel(),
			`:gun: **${from.getDisplayName()}** couldn't hit the broad side of a barn with a :banana:!\n` +
				`They attempted to shoot **${target.getDisplayName()}** but missed! They are left uninjured`
		)
		return
	}

	let actualTarget: Player
	if (outcome === Outcome.SELF_INFLICT) {
		await game.sendPin(
			game.getMainChannel(),
			`:gun: **${from.getDisplayName()}** attempted to shoot **${target.getDisplayName()}**, but the bullet exploded in the chamber, killing them instantly!`
		)
		actualTarget = from
	} else {
		await game.sendPin(
			game.getMainChannel(),
			`:gun: **${from.getDisplayName()}** draws their gun, and shoots **${target.getDisplayName()}** square in the chest`
		)
		actualTarget = target
	}

	await game.addAction("marksman/shoot", ["instant"], {
		expiry: 1,
		from,
		to: actualTarget,
		priority: ActionPriorities.KILL,
		target: actualTarget,
	})

	if (actualTarget.isAlive()) {
		return
	}
	await actualTarget.getPrivateChannel().send(getDeathMessage(game, actualTarget, "__shot__"))
	await game.sendPin(game.getLogChannel(), getDeathBroadcast(game, actualTarget, "__shot__"))

	await game.checkWin()
}

shoot.PRIVATE_ONLY = true
shoot.DEAD_CANNOT_USE = true
shoot.ALIVE_CANNOT_USE = false
shoot.DISALLOW_DAY = false
shoot.DISALLOW_NIGHT = true

export default makeCommand(shoot, {
	name: "shoot",
	description: "Shoot a player",
	usage: "shoot <player>",
})
