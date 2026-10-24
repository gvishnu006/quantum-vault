// QuantumVault Password Generator
class PasswordGenerator {
  static generate(options = {}) {
    const {
      length = 18,
      uppercase = true,
      lowercase = true,
      numbers = true,
      symbols = true
    } = options;

    let chars = '';
    if (lowercase) chars += 'abcdefghijkmnopqrstuvwxyz';
    if (uppercase) chars += 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    if (numbers) chars += '23456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) chars = 'abcdefghijkmnopqrstuvwxyz';

    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    return result;
  }

  static calculateEntropy(password) {
    let pool = 0;
    if (/[a-z]/.test(password)) pool += 26;
    if (/[A-Z]/.test(password)) pool += 26;
    if (/[0-9]/.test(password)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(password)) pool += 32;
    if (pool === 0) return 0;
    return Math.round(password.length * Math.log2(pool));
  }
}

window.PasswordGenerator = PasswordGenerator;
