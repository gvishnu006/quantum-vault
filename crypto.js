// QuantumVault Web Crypto Cryptographic Primitives
class QuantumCrypto {
  static async deriveKey(passphrase, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      enc.encode(passphrase),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  static async encrypt(plaintext, passphrase) {
    const enc = new TextEncoder();
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await this.deriveKey(passphrase, salt);

    const ciphertext = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      enc.encode(plaintext)
    );

    return {
      salt: Array.from(salt),
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(ciphertext))
    };
  }

  static async decrypt(bundle, passphrase) {
    const salt = new Uint8Array(bundle.salt);
    const iv = new Uint8Array(bundle.iv);
    const data = new Uint8Array(bundle.data);
    const key = await this.deriveKey(passphrase, salt);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      data
    );

    const dec = new TextDecoder();
    return dec.decode(decrypted);
  }
}

window.QuantumCrypto = QuantumCrypto;
