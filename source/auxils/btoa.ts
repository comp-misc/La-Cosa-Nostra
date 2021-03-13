// Base64 decode
export = (string: string): string => Buffer.from(string, "base64").toString("utf8")
