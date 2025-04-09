import { armor, Decrypter, Encrypter } from 'age-encryption'
import { encode } from 'zbase32'

export async function generateUrlSafeKey (): Promise<string> {
  const entropy = crypto.getRandomValues(new Uint8Array(16))
  return encode(entropy.buffer)
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
