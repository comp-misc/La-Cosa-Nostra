import { PermissionObject, Snowflake } from "discord.js"
import { RoleInfo } from "./role"

export interface GameConfig {
	mafia: {
		"has-chat": boolean
		"chat-name": string
		"night-only": boolean
	}
	town: {
		"night-chat": boolean
	}
	"day-zero": boolean
	"lynch-ratio-floored": number
	lynch: {
		"top-voted-lynch": boolean
		"top-voted-lynch-minimum-votes": number
		"tied-random": boolean
		"allow-hammer": boolean
		"no-lynch-option": boolean
	}
	"minimum-lynch-votes": number
	"minimum-nolynch-votes": number
	"minimum-trials": number

	"allow-pre-emptive-votes": boolean

	"fast-forwarding": {
		allow: boolean
		ratio: number
		night: boolean
		day: boolean
	}

	"last-wills": {
		allow: boolean
		"character-count-limit": number
	}

	whispers: {
		allow: boolean

		night: boolean
		day: boolean

		broadcast: boolean
		"allow-dead": boolean
	}

	"cause-of-death": {
		"hide-day": boolean
		"hide-night": boolean
		exceptions: string[]
	}
	"show-roles": boolean
	playersNeeded?: number
}

export interface PermissionsConfig {
	admin: string
	alive: string
	dead: string
	spectator: string
	aftermath: string
	pre: string
	backup: string
	notify: string
}

export interface MessagesConfig {
	name: string

	"game-start": string
	"whisper-log": string
	mafia: string

	"opening-quote": string
	"daytime-quote": string
	"nighttime-quote": string
	"no-summary": string
	"no-summary-day": string

	"singular-lynch": string
	"plural-lynch": string
	"abstain-lynch": string

	"game-over": string

	"welcome-dm-message": string | null
	"welcome-message": string | null
}

export interface MessageChecksConfig {
	"alive-pings": {
		restrict: boolean
		exempt: string[]
		threshold: number
		"threshold-time": number
	}
	edits: {
		restrict: boolean
		exempt: string[]
		"minimum-character-count": number
		"edit-ratio": number
	}
	deletion: {
		restrict: boolean
		exempt: string[]
		"minimum-character-count": number
	}
}

export interface EmojiData {
	name: string
	id: Snowflake
}

export interface ChannelsConfig {
	log: string
	voting: string
	main: string
	"whisper-log": string
	roles: string
	"signup-channel": string
	logs: string
	"welcome-channel": string
}

export interface CategoriesConfig {
	private: string
}

export interface SetupRoleData {
	identifier: string
	flavour_identifier?: string
	display_secondary?: string
	attributes?: SetupAttributeData[]
}
export interface SetupAttributeData {
	identifier: string
	expiry?: number
	tags?: Record<string, unknown>
}

export interface PlayingConfig {
	players: "auto" | "dev" | string[] | string
	expansions: string[]
	possibleRoles: RoleInfo[]
	roles: RoleInfo[]
	shuffle: boolean
	flavour: string | null
}

export interface TicksConfig {
	time: number
	"autosave-ticks": number
}

export interface TimeConfig {
	/** Hours offset from UTC (I think?) */
	timezone: number

	/** Hours of day */
	day: number

	/** Hours of night */
	night: number
}

export interface BasePermsConfig {
	read: PermissionObject
	post: PermissionObject
	deny: PermissionObject
	manage: PermissionObject
}

export interface LcnConfig {
	"command-prefix": string
	"automatically-load-saves": boolean
	"auto-reconnect": boolean
	"console-log-level": number
	"file-log-level": number
	"encode-cache": boolean
	"disabled-commands": string[]
	emoji: Record<string, EmojiData>

	"base-perms": BasePermsConfig
	categories: CategoriesConfig
	channels: ChannelsConfig
	game: GameConfig
	messages: MessagesConfig
	"message-checks": MessageChecksConfig
	permissions: PermissionsConfig
	playing: PlayingConfig
	"server-link": string
	ticks: TicksConfig
	time: TimeConfig

	"merge-configs": string[]
}
