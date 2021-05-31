import { createHash, BinaryToTextEncoding } from "crypto"

export default (string: string, hash = "md5", encoding: BinaryToTextEncoding = "hex"): string =>
	createHash(hash).update(string).digest(encoding)
