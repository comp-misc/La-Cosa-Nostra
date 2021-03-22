import fs from "fs"
import expansions from "../expansions"

const ret: Record<string, Buffer> = {}
const assets_dir = __dirname + "/../assets/"

// Add expansions
const expansion_assets = expansions.flatMap((expansion) =>
	expansion.additions.assets.map((asset) => ({
		name: asset,
		directory: expansion.expansion_directory + "/assets",
	}))
)

const assets = fs
	.readdirSync(assets_dir)
	.map((x) => ({ name: x, directory: assets_dir }))
	.concat(expansion_assets)

assets.forEach((asset) => {
	ret[asset.name] = fs.readFileSync(asset.directory + asset.name)
})

export = ret
