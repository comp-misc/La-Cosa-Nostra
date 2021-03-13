import { createHash, BinaryToTextEncoding } from "crypto"

export = (string: string, hash = "md5", encoding: BinaryToTextEncoding = "hex"): string =>
	createHash(hash).update(string).digest(encoding)
