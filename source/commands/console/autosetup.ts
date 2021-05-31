import getGuild from "../../getGuild"
import getLogger from "../../getLogger"
import { GuildChannelType } from "../../GuildChannelType"
import { CategoriesConfig } from "../../LcnConfig"
import { ConsoleCommand } from "../CommandType"

const autosetup: ConsoleCommand = async (client, config) => {
	const logger = getLogger()

	// Run auto setup
	logger.log(2, "Executing auto-setup.")

	const guild = getGuild(client)

	logger.log(2, "Creating roles as per config.")

	const createRole = async (name: string, position?: number) => {
		if (guild.roles.cache.some((x) => x.name === name)) {
			logger.log(2, "Role %s already exists, not creating.", name)
			return
		}

		const role = await guild.roles.create({ data: { name, position } })
		if (position) {
			logger.log(2, `Created role ${name} (position ${position}).`)
		} else {
			logger.log(2, `Created role ${name}.`)
		}

		return role
	}

	const createChannel = async (name: string, type: GuildChannelType = "text") => {
		if (guild.channels.cache.some((x) => x.name === name && x.type === type)) {
			logger.log(2, "Channel %s (%s) already exists, not creating.", name, type)
			return
		}

		const channel = await guild.channels.create(name, { type })
		logger.log(2, "Created channel %s (%s)", name, type)

		return channel
	}

	// Create individual roles

	const permissions = config.permissions

	const member = guild.me
	const member_position = (member?.roles.highest.position || 0) + 1

	await Promise.all(
		Object.entries(permissions).map(([key, permission]) => {
			let position: number | undefined = undefined

			if (key === "admin") {
				position = member_position - 1
			}
			return createRole(permission, position)
		})
	)

	logger.log(2, "Creating text channels as per config.")

	await Promise.all(Object.values(config.channels).map((channelName: string) => createChannel(channelName, "text")))

	logger.log(2, "Creating category channels as per config.")

	const categories = config.categories

	for (const key in categories) {
		await createChannel(categories[key as keyof CategoriesConfig], "category")
	}

	console.log(
		"Auto-setup complete. You may modify the roles and channels as you wish, but please do not change their names."
	)
}

export default autosetup
