import { CategoryChannel, Client, Message, Snowflake, SnowflakeUtil, TextChannel } from "discord.js"
import fs from "fs"
import fetch from "node-fetch"
import zlib from "zlib"
import formatDate from "../../../../auxils/formatDate"
import { AdminCommand } from "../../../../commands/CommandType"
import makeCommand from "../../../../commands/makeCommand"
import getLogger from "../../../../getLogger"

const download = async (uri: string): Promise<Buffer | null> => {
	try {
		return await (await fetch(uri)).buffer()
	} catch (err) {
		console.log("Error downloading %s, skipping", uri)
		return null
	}
}

const getMessage = async (channel: TextChannel, from?: Snowflake): Promise<Message[]> =>
	(await channel.messages.fetch({ limit: 100, before: from })).array()

interface GuildSerialised {
	id: Snowflake
	name: string
	icon_url: string | null
	icon: Buffer | null
}
interface UserSerialised {
	id: Snowflake
	username: string
	discriminator: string
	avatar: string
	bot: boolean
	avatar_displayable: Buffer | null
	display_name: string | null
	display_hex_colour: string | null
}
interface AttachmentSerialised {
	id: string
	data: Buffer | null
	filename: string | null
	filesize: number
}
interface MessageSerialised {
	id: Snowflake
	content: string
	user: Snowflake
	createdTimestamp: number
	system: boolean
	pinned: boolean
	editedTimestamp: number | null
	attachments: AttachmentSerialised[]
}
interface ChannelSerialised {
	users: Record<Snowflake, UserSerialised>
	messages: MessageSerialised[]
}

interface TextChannelSerialised {
	id: SnowflakeUtil
	position: number
	calculated_position: number
	name: string
	topic: string | null
	last_pin_at: Date | null
	parentID: string | null
	rate_limit_per_user: number
	messages: MessageSerialised[]
	guild: Snowflake
}

interface SerialiseResult {
	channels: TextChannelSerialised[]
	categories: {
		id: Snowflake
		name: string
	}[]
	guilds: GuildSerialised[]
	users: UserSerialised[]
}

const indexChannel = async (channel: TextChannel, truncate_time: number) => {
	let id: Snowflake | undefined = undefined
	let concat: Message[] = []

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const messages: Message[] = await getMessage(channel, id)

		concat = messages.concat(concat)

		if (messages.length < 100) {
			break
		} else {
			id = messages[99].id
		}

		console.log("Indexed %s", messages[99].createdAt)

		if (messages[99].createdTimestamp < truncate_time) {
			console.log("Truncated.")
			break
		}
	}

	return concat
}

const serialiseChannel = async (channel: TextChannel, truncate_time: number): Promise<ChannelSerialised> => {
	const messages = await indexChannel(channel, truncate_time)
	const storage: ChannelSerialised = {
		users: {},
		messages: [],
	}

	// Sort messages
	messages.sort(function (a, b) {
		return a.createdTimestamp - b.createdTimestamp
	})

	for (let i = 0; i < messages.length; i++) {
		const message = messages[i]

		if (message.createdTimestamp < truncate_time) {
			break
		}

		const user = message.author
		const member = message.member

		if (!storage.users[user.id]) {
			storage.users[user.id] = {
				id: user.id,
				username: user.username,
				discriminator: user.discriminator,
				avatar: user.displayAvatarURL().replace(/\?size=[0-9]{1,}/g, "?size=128"),
				bot: user.bot,
				avatar_displayable: null,
				display_name: member ? member.displayName : null,
				display_hex_colour: member ? member.displayHexColor : null,
			}
		}

		const pushable: MessageSerialised = {
			id: message.id,
			content: message.cleanContent,
			user: message.author.id,
			createdTimestamp: message.createdTimestamp,
			system: message.system,
			pinned: message.pinned,
			editedTimestamp: message.editedTimestamp,
			attachments: [],
		}

		if (message.attachments.size > 0) {
			const attachments = message.attachments.array()
			for (let j = 0; j < attachments.length; j++) {
				const attachment = attachments[j]

				console.log(
					`Downloading attachment ${attachment.name || "Attachment"}, ${attachment.id} [${
						attachment.size
					} bytes]`
				)

				const data = await download(attachment.url)
				pushable.attachments.push({
					id: attachment.url,
					data: data,
					filename: attachment.name,
					filesize: attachment.size,
				})
			}
		}

		storage.messages.push(pushable)
	}

	return storage
}

const serialise = async (
	client: Client,
	message: Message,
	status_message: Message,
	channel_ids: string[] = [],
	truncate_time: number
): Promise<SerialiseResult> => {
	const channels: TextChannel[] = []
	const returnable: SerialiseResult = {
		channels: [],
		users: [],
		categories: [],
		guilds: [],
	}

	// {guild, channels: [], users: []}
	for (let i = 0; i < channel_ids.length; i++) {
		const channel = client.channels.cache.find((x) => x.id === channel_ids[i])
		if (!channel) {
			await message.channel.send(`Unknown channel ${channel_ids[i]}`)
			continue
		}

		if (channel instanceof CategoryChannel) {
			// Get children IDs and concat if non-existent
			channel_ids = channel_ids.concat(channel.children.array().map((x) => x.id))
			returnable.categories.push({ id: channel.id, name: channel.name })
			continue
		}

		// Text
		if (channel instanceof TextChannel) {
			channels.push(channel)
		}
	}

	let message_amount = 0

	// Index
	for (let i = 0; i < channels.length; i++) {
		const channel = channels[i]

		// Log
		console.log("\x1b[1mSerialising %s/%s channels.\x1b[0m", i + 1, channels.length)
		await status_message.edit(
			`:hourglass_flowing_sand: Archiving the channels into a file. Please be patient. [**${i + 1}/${
				channels.length
			}**]`
		)
		const output = await serialiseChannel(channel, truncate_time)

		returnable.channels.push({
			id: channel.id,
			position: channel.position,
			calculated_position: channel.calculatedPosition,
			name: channel.name,
			topic: channel.topic,
			last_pin_at: channel.lastPinAt,
			parentID: channel.parentID,
			rate_limit_per_user: channel.rateLimitPerUser,
			messages: output.messages,
			guild: channel.guild.id,
		})

		message_amount += output.messages.length

		if (!returnable.categories.some((x) => x.id === channel.parentID) && channel.parent) {
			returnable.categories.push({
				id: channel.parent.id,
				name: channel.parent.name,
			})
		}

		if (!returnable.guilds.some((x) => x.id === channel.guild.id)) {
			const addable: GuildSerialised = {
				id: channel.guild.id,
				name: channel.guild.name,
				icon_url: channel.guild.iconURL({ size: 256 }),
				icon: null,
			}

			if (addable.icon_url) {
				console.log("Downloading profile picture of guild icon %s", channel.guild.id)
				addable.icon = await download(addable.icon_url)
			}

			returnable.guilds.push(addable)
		}

		for (const id in output.users) {
			if (returnable.users.some((x) => x.id === id)) {
				continue
			}

			const addable = output.users[id]

			addable.id = id

			if (addable.avatar) {
				console.log("Downloading profile picture of user %s", addable.id)
				addable.avatar_displayable = await download(addable.avatar)
			}

			returnable.users.push(addable)
		}
	}

	console.log(
		"\x1b[1mLogged %s category/(ies), %s channel(s), %s user(s), %s message(s)\x1b[0m",
		returnable.categories.length,
		returnable.channels.length,
		returnable.users.length,
		message_amount
	)

	return returnable
}

const archive: AdminCommand = async (message, params, config) => {
	const logger = getLogger()

	if (params.length < 3) {
		await message.channel.send(
			":x: Incorrect syntax. Please use `" +
				config["command-prefix"] +
				"d-archive <save file name> <truncate unix timestamp> <text/category channel ID> [<text/category channel ID>...]` instead!"
		)
		return
	}

	if (!params[0].endsWith(".dsave")) {
		await message.channel.send(":x: The name of the save directory should end with `.dsave`!")
		return
	}

	const truncate_time = parseInt(params[1]) * 1000
	const channel_ids = params.splice(2)

	const status_message = await message.channel.send(
		":hourglass_flowing_sand: Archiving the channels into a file. Please be patient. [*Initialising*]"
	)

	const start_time = new Date()

	const output = await serialise(message.client, message, status_message, channel_ids, truncate_time)

	const archive_directory = __dirname + "/../../../../data/d-archive/"

	if (!fs.existsSync(archive_directory)) {
		logger.log(2, "[Archiver] Made d-archive directory in data.")
		fs.mkdirSync(archive_directory)
	}

	const save_directory = archive_directory + params[0]

	const savable = zlib.deflateSync(JSON.stringify(output))

	fs.writeFileSync(save_directory, savable)
	const file_size = fs.statSync(save_directory).size / 100000

	logger.log(2, `[Archiver] Saved file to ${save_directory} [%s ${file_size}]`)

	await message.channel.send(
		`:exclamation: Complete! - Save file is **${Math.floor(file_size * 1000) / 1000}**MB! Took **${formatDate(
			new Date().getTime() - start_time.getTime()
		)}**.`
	)
}

export default makeCommand(archive, {
	name: "d-archive",
	description: "Creates a full archive of all guild information",
	usage: "d-archive <save file name> <truncate unix timestamp> <text/category channel ID> [<text/category channel ID>...]",
})
