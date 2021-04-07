// Stores all the executable actions

import actionables from "../actionables" // for now
import crypto from "crypto"
import auxils from "../auxils"
import Game from "./Game"
import { Message } from "discord.js"
import getLogger from "../../getLogger"
import Player, { PlayerIdentifier } from "./Player"

const allowedTriggers = [
	"cycle",
	"chat",
	"lynch",
	"attacked",
	"killed",
	"visit",
	"roleblock",
	"postcycle",
	"instant",
	"outvisit",
	"retrooutvisit",
	"retrovisit",
	"retrocycle",
	"vote",
	"unvote",
	"arbitrary",
	"miscellaneous",
] as const
export type Trigger = typeof allowedTriggers[number]

const uncombinable: Trigger[] = ["retrooutvisit", "retrovisit", "retrocycle"]

interface SharedActionOptions<T> {
	name?: string
	expiry: number
	meta?: T
}

export interface ActionOptions<T> extends SharedActionOptions<T> {
	from: Player
	to: Player
	tags?: string[]
	/** Number of "hits" before execution */
	execution?: number
	target?: Player
	attack?: Player
	priority?: number
}
export interface Actionable<T> extends SharedActionOptions<T> {
	from: PlayerIdentifier
	to: PlayerIdentifier
	tags: string[]
	/** Number of "hits" before execution */
	execution: number
	target?: PlayerIdentifier
	attack?: PlayerIdentifier
	priority: number

	id?: string
	identifier: string
	triggers: Trigger[]
	cycles: number
}

export interface ExecutionParams extends Record<string, any> {
	priority?: number
	reason?: string
	visitor?: PlayerIdentifier
	visited?: PlayerIdentifier
	target?: PlayerIdentifier
	message?: Message
}

type ActionablePredicate<T> = (actionable: Actionable<T>) => boolean

interface StoredActionable<T> extends Actionable<T> {
	_scan: string[]
}

export default class Actions {
	game: Game
	actions: StoredActionable<unknown>[]
	visit_log: ExecutionParams[]
	private previous_visit_log: ExecutionParams[]

	constructor(game: Game) {
		this.actions = []
		this.visit_log = []
		this.previous_visit_log = []

		this.game = game

		return this
	}

	async add<T>(
		identifier: string,
		triggers: Trigger[],
		options: ActionOptions<T>,
		rearrange = true
	): Promise<Actionable<T>> {
		// Actions are calculated relative to the step

		for (let i = 0; i < triggers.length; i++) {
			if (!allowedTriggers.includes(triggers[i])) {
				throw new Error("Unknown trigger " + triggers[i] + ".")
			}
		}

		if (triggers.length > 1) {
			uncombinable.forEach((entry) => {
				if (triggers.includes(entry)) {
					throw new Error(`${entry} trigger cannot be combined`)
				}
			})
		}
		const mapIdentifier = (player: Player): string => {
			if (typeof player === "string") {
				getLogger().logError("Id passed to action instead of player")
				return this.game.getPlayerOrThrow(player).identifier
			}
			return player.identifier
		}

		const actionable: StoredActionable<T> = {
			name: options.name,
			from: mapIdentifier(options.from),
			to: mapIdentifier(options.to),
			meta: options.meta,
			target: options.target ? mapIdentifier(options.target) : undefined,
			attack: options.attack ? mapIdentifier(options.attack) : undefined,

			id: crypto.randomBytes(4).toString("hex"),
			identifier,
			triggers,
			tags: options.tags || [],
			expiry: options.expiry || 0,
			priority: options.priority || 0,
			execution: options.execution || 0,
			cycles: 0,
			_scan: [],
		}

		if (actionable.tags.includes("system")) {
			actionable.from = "*"
			actionable.to = "*"
		}

		let implicit_priority = 0
		if (actionable.from !== "*") {
			const from = this.game.getPlayer(actionable.from)
			if (from) {
				implicit_priority = from.getStat("priority", Math.max)
				actionable.from = from.identifier
			}
		}

		if (actionable.to !== "*") {
			const to = this.game.getPlayer(actionable.to)
			if (to) {
				actionable.to = to.identifier
			}
		}

		actionable.priority = actionable.priority || implicit_priority

		// Append new tags to array
		const runnable = actionables[actionable.identifier]

		if (typeof runnable === "function" && Array.isArray(runnable.TAGS)) {
			actionable.tags = actionable.tags.concat(runnable.TAGS)
		}

		this.actions.push(actionable)

		if (rearrange) {
			this.sortByPriority(true)
		}

		if (triggers.includes("instant")) {
			// Execute immediately
			await this.execute("instant")
		}

		this.game.tentativeSave()
		return actionable
	}

	private sortByPriority(shuffle_first = false): void {
		if (shuffle_first) {
			this.actions = auxils.shuffle(this.actions)
		}

		this.actions.sort(function (a, b) {
			if (!a || !b) {
				return -1
			}

			return a.priority - b.priority
		})
	}

	find<T>(condition: ActionablePredicate<unknown>): Actionable<T> | null {
		return (this.actions.find(condition) || null) as Actionable<T> | null
	}

	findAll<T>(condition: ActionablePredicate<unknown>): Actionable<T>[] {
		return (this.actions.filter(condition) || null) as Actionable<T>[]
	}

	delete<T>(condition: ActionablePredicate<unknown>): Actionable<T>[] {
		const toKeep: StoredActionable<unknown>[] = []
		const toRemove: Actionable<T>[] = []
		for (const action of this.actions) {
			if (condition(action)) {
				toRemove.push(action as Actionable<T>)
			} else {
				toKeep.push(action)
			}
		}
		this.actions = toKeep
		return toRemove
	}

	exists(condition: ActionablePredicate<unknown>): boolean {
		return this.actions.some(condition)
	}

	get(): Actionable<unknown>[] {
		return this.actions
	}

	async step(): Promise<void> {
		// Iterate through actions
		await this.execute("cycle")
	}

	// "params" is optional
	async execute(type: Trigger, params?: ExecutionParams, check_expiries = true): Promise<void> {
		// Actions: [from, to, game]
		// Returns: boolean
		// If true for chat, lynch, arbitrary types, subtract one
		// from expiration

		// Create loop identifier
		const loop_id = crypto.randomBytes(8).toString("hex")

		const game = this.game

		if (type === "chat") {
			const message = params?.message
			if (!params || !message) {
				throw new Error("No message specified for chat action")
			}
			const sender = game.getPlayerById(message.author.id)

			if (!sender) {
				return
			}
			params.target = sender.identifier
		}

		if (type === "visit") {
			if (!params) {
				throw new Error("Must specify params for a visit")
			}
			this.visit_log.push(params)
			await this.execute("outvisit", params)
		}

		let i = 0
		while (i < this.actions.length) {
			const action = this.actions[i]

			if (!action) {
				i++
				continue
			}

			if (action._scan.includes(loop_id)) {
				i++
				continue
			}

			action._scan.push(loop_id)

			if (
				["cycle"].includes(type) &&
				!action.triggers.includes("retrooutvisit") &&
				!action.triggers.includes("retrovisit") &&
				!action.triggers.includes("retrocycle")
			) {
				action.execution--
				action.cycles++

				if (action.expiry !== Infinity && !action.tags.includes("permanent")) {
					action.expiry--
				}
			}

			if (
				type === "retrocycle" &&
				(action.triggers.includes("retrooutvisit") ||
					action.triggers.includes("retrovisit") ||
					action.triggers.includes("retrocycle"))
			) {
				action.execution--
				action.cycles++

				if (action.expiry !== Infinity && !action.tags.includes("permanent")) {
					action.expiry--
				}
			}

			if (!action.triggers.includes(type)) {
				i++
				continue
			}

			const run = actionables[action.identifier]

			if (!run) {
				getLogger().log(3, "Bad undefined function in actions: " + action.identifier + "!")
				i++
				continue
			}

			let rerun = false

			const execute = async (): Promise<boolean | void> => {
				rerun = true

				try {
					return await run(action, game, params)
				} catch (err) {
					getLogger().logError(err)
					getLogger().log(
						4,
						"[Error follow-up] attempted to destroy action %s to prevent snowballing.\nFrom: %s\nTo: %s",
						action.identifier,
						action.from,
						action.to
					)
					// Attempts to destroy action in event of failure
					return true
				}
			}

			// Non-routine triggers
			if (
				[
					"chat",
					"lynch",
					"attacked",
					"killed",
					"visit",
					"roleblock",
					"outvisit",
					"retrooutvisit",
					"retrovisit",
					"vote",
					"unvote",
					"arbitrary",
					"miscellaneous",
				].includes(type)
			) {
				if (!params) {
					throw new Error("Must specify params")
				}
				const target: string = action.target || action.to

				let check = params.target

				if (["outvisit"].includes(type)) {
					check = params.visitor
				}

				if (check === target || target === "*") {
					if (action.execution <= 0) {
						const result = await execute()

						if (result === true) {
							// Immediately mark for deletion
							action.expiry = 0
						}
					}
				}
			}

			// Periodic-triggers
			if (["cycle", "postcycle", "instant", "retrocycle"].includes(type)) {
				if (action.execution <= 0) {
					const result = await execute()

					if (result === true) {
						// Immediately mark for deletion
						action.expiry = 0
					}
				}
			}

			/* Had to shift this in;
      yes, yes, I know it slows stuff down;
      but dang it there's no easier way out */
			if (check_expiries) {
				this.nullExpiries(type)
			}

			if (rerun) {
				i = 0
			} else {
				i++
			}
		}

		// Remove loop ID
		for (let i = 0; i < this.actions.length; i++) {
			const action = this.actions[i]

			if (!action) {
				continue
			}

			action._scan = this.actions[i]._scan.filter((x) => x !== loop_id)
		}

		if (type === "cycle") {
			for (let i = 0; i < this.visit_log.length; i++) {
				const visit_log = this.visit_log[i]

				await this.execute("retrovisit", visit_log)

				const inverse_log = Object.assign({}, visit_log)

				inverse_log.visited = inverse_log.target
				inverse_log.target = inverse_log.visitor

				delete inverse_log.visitor

				await this.execute("retrooutvisit", inverse_log)
			}

			await this.execute("retrocycle")

			this.previous_visit_log = this.previous_visit_log.concat(this.visit_log)
			this.visit_log = []
		}

		// Decrement those outside cycle
		if (check_expiries) {
			this.nullExpiries()
			this.removeUndefinedActionables()
		}
	}

	reinstantiate(game: Game): void {
		this.game = game
	}

	private nullExpiries(trigger: Trigger | null = null): void {
		// Check expiries, remove
		for (let i = 0; i < this.actions.length; i++) {
			if (!this.actions[i]) {
				continue
			}

			if (this.actions[i].expiry < 1 && (trigger === null || this.actions[i].triggers.includes(trigger))) {
				delete this.actions[i]
			}
		}
	}

	private removeUndefinedActionables(): void {
		this.actions = this.actions.filter((action) => !!action)
	}
}
