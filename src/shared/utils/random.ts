import { customAlphabet } from 'nanoid'

/**
 * Generates a cryptographically secure random string
 * using ZBase32 alphabet.
 * @param {number} length - The length of the random string to generate.
 * @returns {string} - The generated random string.
 */
export const randomBase32 = customAlphabet('ybndrfg8ejkmcpqxot1uwisza345h769')
