import CryptoJS from 'crypto-js'

// Encryption utility for sensitive data
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production'

export function encrypt(text: string): string {
  try {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString()
  } catch (error) {
    console.error('Encryption error:', error)
    return text
  }
}

export function decrypt(encryptedText: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error('Decryption error:', error)
    return encryptedText
  }
}

// Hash function for API keys (one-way)
export function hashApiKey(apiKey: string): string {
  return CryptoJS.SHA256(apiKey).toString()
}
