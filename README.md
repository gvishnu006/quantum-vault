# QuantumVault

> Zero-knowledge client-side credential vault and cryptographic key manager built with native Web Crypto API (AES-GCM-256 + PBKDF2).

![Security Level](https://img.shields.io/badge/encryption-AES--GCM--256-10b981?style=flat-square)
![PBKDF2](https://img.shields.io/badge/PBKDF2-100k%20iters-06b6d4?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

## Core Capabilities

- 🛡️ **Zero-Knowledge Core**: Plaintext master passphrases and secrets are processed strictly in browser memory.
- ⚡ **PBKDF2 SHA-256**: Key derivation stretches user passphrases using 100,000 hash iterations with a cryptographic random 16-byte salt.
- 🔒 **AES-GCM-256**: Authenticated encryption produces ciphertext along with an initialization vector (IV) and authentication tag.
- 🔑 **Entropy Password Generator**: Generates high-entropy passwords with custom character sets and live entropy rating.
- 📋 **Credential Vault CRUD**: Local encrypted storage with real-time search and clipboard copy auto-wipe.
- 🩺 **Security Health Audit**: Live diagnostics scanning for weak entropy, duplicate credentials, and outdated passwords.
- 💾 **Encrypted Backup Export**: Cold storage export in portable JSON format.

## Local Setup

Launch locally using any standard static file server:

```bash
# Using Python
python -m http.server 3030

# Using Node.js
npx serve .
```

Navigate to `http://localhost:3030` in your web browser.

## Author

Engineered by **[gvishnu006](https://github.com/gvishnu006)**
