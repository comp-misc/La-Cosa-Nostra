import fs from "fs"
import expansions from "../expansions"
import path from "path"
import recursiveFileFind from "../auxils/recursiveFileFind"

const ret: Record<string, Buffer> = {}
const assets_dir = __dirname + "/../assets/"

// Add expansions
const expansion_assets = expansions.flatMap((expansion) => expansion.additions.assets.map(path.parse))

const assets = [...recursiveFileFind(assets_dir).map(path.parse), ...expansion_assets]

assets.forEach((asset) => {
	ret[asset.base] = fs.readFileSync(asset.dir + "/" + asset.base)
})

export default ret
