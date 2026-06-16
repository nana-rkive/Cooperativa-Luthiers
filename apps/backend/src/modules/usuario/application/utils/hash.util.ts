import * as crypto from 'crypto';

/**
 * hashes a password using HMAC SHA-256 with a fixed salt
 */
export function hashPassword(password: string, salt: string = 'luthiers-cooperative-salt-2026'): string {
    return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

/**
 * compares a password with a target hash
 */
export function comparePassword(password: string, hash: string): boolean {
    return hashPassword(password) === hash;
}
