// Base64 encode
export = (string: string): string => Buffer.from(string).toString("base64")
