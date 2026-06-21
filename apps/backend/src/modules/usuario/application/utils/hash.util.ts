import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

/**
 * Gera o hash bcrypt de uma senha em texto plano.
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compara uma senha em texto plano com um hash bcrypt armazenado.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}
