import crypto from "crypto";

export function hashPassword(password: string, salt: string) {
    return crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha512').toString('hex')
}

export function comparePassword(hash: string, password: string, salt: string) {
    return hash === hashPassword(password, salt)
}