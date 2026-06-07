import { armor, Decrypter, Encrypter } from 'age-encryption'

import { randomBase32 } from '@/shared/utils/random'

export async function decrypt (
  passphrase: string,
  ciphertext: string
): Promise<string> {
  const decrypter = new Decrypter()
  decrypter.addPassphrase(passphrase)

  const decodedCiphertext = armor.decode(ciphertext)
  const plaintext = await decrypter.decrypt(decodedCiphertext, 'text')
  return plaintext
}

export async function encrypt (
  passphrase: string,
  plaintext: string
): Promise<string> {
  const encrypter = new Encrypter()
  encrypter.setPassphrase(passphrase)

  const ciphertext = await encrypter.encrypt(plaintext)
  return armor.encode(ciphertext)
}

/**
 * Generates a random cryptographically secure key that is safe to use in URLs.
 * @returns Generated symmetric key string.
 */
export async function generateUrlSafeKey (): Promise<string> {
  return randomBase32(32)
}
