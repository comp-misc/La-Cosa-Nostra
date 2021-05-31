import fs from "fs"

const textsList = [
	"changed_lynch",
	"death_broadcast",
	"death_message",
	"delay_notice",
	"getting_lynched",
	"lynching",
	"lynch_off",
	"lynchtext_available",
	"lynchtext_hammer_tvl",
	"lynchtext_hammer",
	"lynchtext_maxnolynch",
	"lynchtext_maxrandom",
	"lynchtext_nolynch",
	"lynchtext_standard",
	"lynchtext_tvl",
	"lynchtext_uncheck",
	"new_period",
	"nolynching",
	"nolynch_off",
	"nolynch_reached",
	"opening",
	"prime",
	"public_votecount",
	"public_vote_ended",
	"public_vote",
	"revert_nolynching",
	"unlynching",
	"win_log",
	"win_message",
] as const

type Texts = {
	[T in typeof textsList[number]]: string
}

const texts = Object.fromEntries(
	textsList.map((item) => [item, fs.readFileSync(`${__dirname}/${item}.txt`, "utf-8")])
) as Texts

export default texts
