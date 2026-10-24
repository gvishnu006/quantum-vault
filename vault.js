// QuantumVault Storage & CRUD Manager
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('nav-open'));
  }

  // Password Generator UI Hooks
  const lenSlider = document.getElementById('lenSlider');
  const lenValue = document.getElementById('lenValue');
  const chkUpper = document.getElementById('chkUpper');
  const chkLower = document.getElementById('chkLower');
  const chkNums = document.getElementById('chkNums');
  const chkSymbols = document.getElementById('chkSymbols');
  const genPassword = document.getElementById('genPassword');
  const entropyBar = document.getElementById('entropyBar');
  const entropyScore = document.getElementById('entropyScore');
  const strengthLabel = document.getElementById('strengthLabel');
  const regenerateBtn = document.getElementById('regenerateBtn');
  const copyGenBtn = document.getElementById('copyGenBtn');

  function updateGenerator() {
    if (!lenSlider || !genPassword) return;
    const len = parseInt(lenSlider.value, 10);
    lenValue.innerText = len;

    const pass = PasswordGenerator.generate({
      length: len,
      uppercase: chkUpper.checked,
      lowercase: chkLower.checked,
      numbers: chkNums.checked,
      symbols: chkSymbols.checked
    });

    genPassword.innerText = pass;
    const entropy = PasswordGenerator.calculateEntropy(pass);
    entropyScore.innerText = `${entropy} bits entropy`;

    let color = '#ef4444';
    let label = 'Weak';
    let width = '25%';

    if (entropy > 80) {
      color = '#10b981';
      label = 'Quantum-Safe';
      width = '100%';
    } else if (entropy > 60) {
      color = '#34d399';
      label = 'Strong';
      width = '75%';
    } else if (entropy > 40) {
      color = '#f59e0b';
      label = 'Moderate';
      width = '50%';
    }

    entropyBar.style.width = width;
    entropyBar.style.backgroundColor = color;
    strengthLabel.innerText = `Strength: ${label}`;
    strengthLabel.style.color = color;
  }

  if (lenSlider) {
    lenSlider.addEventListener('input', updateGenerator);
    [chkUpper, chkLower, chkNums, chkSymbols].forEach(el => el.addEventListener('change', updateGenerator));
    regenerateBtn.addEventListener('click', updateGenerator);
    copyGenBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(genPassword.innerText).then(() => {
        copyGenBtn.innerText = 'Copied!';
        setTimeout(() => copyGenBtn.innerText = 'Copy', 1800);
      });
    });
    updateGenerator();
  }

  // Vault Management
  let masterKey = null;
  let vaultItems = [];

  const masterPass = document.getElementById('masterPass');
  const unlockBtn = document.getElementById('unlockBtn');
  const vaultCard = document.getElementById('vaultCard');

  const defaultSampleData = [
    { id: 1, title: 'GitHub Account', username: 'gvishnu006', pass: 'p4$$w0rd-G1tHub-2026!', category: 'Dev' },
    { id: 2, title: 'AWS Cloud Console', username: 'admin-vishnu', pass: 'k#99-ZqL!m00-AWS', category: 'Cloud' },
    { id: 3, title: 'ProtonMail Encrypted', username: 'vishnu@pm.me', pass: 'pr0t0n-s3cur1ty-k3y', category: 'Email' }
  ];

  unlockBtn.addEventListener('click', async () => {
    const pass = masterPass.value.trim();
    if (!pass) return alert('Please enter a master passphrase.');

    masterKey = pass;
    const stored = localStorage.getItem('quantum_vault_data');
    if (stored) {
      try {
        const bundle = JSON.parse(stored);
        const decryptedJson = await QuantumCrypto.decrypt(bundle, masterKey);
        vaultItems = JSON.parse(decryptedJson);
      } catch (err) {
        return alert('Decryption failed! Incorrect master passphrase or corrupted ciphertext.');
      }
    } else {
      vaultItems = defaultSampleData;
      await saveVault();
    }

    renderUnlockedVault();
  });

  async function saveVault() {
    if (!masterKey) return;
    const json = JSON.stringify(vaultItems);
    const bundle = await QuantumCrypto.encrypt(json, masterKey);
    localStorage.setItem('quantum_vault_data', JSON.stringify(bundle));
  }

  function renderUnlockedVault() {
    vaultCard.innerHTML = `
      <div class="unlocked-header">
        <div>
          <h3>Encrypted Vault (Unlocked)</h3>
          <p style="color: var(--text-muted); font-size: 0.85rem;">${vaultItems.length} secure credentials active in memory</p>
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <button class="btn btn-primary" id="addEntryBtn">+ Add Item</button>
          <button class="btn btn-outline" id="lockBtn">Lock</button>
        </div>
      </div>

      <div class="vault-search-row">
        <input type="text" id="searchInput" placeholder="Search by service or username...">
      </div>

      <div class="items-list" id="itemsList"></div>
    `;

    document.getElementById('lockBtn').addEventListener('click', () => {
      masterKey = null;
      vaultItems = [];
      location.reload();
    });

    document.getElementById('searchInput').addEventListener('input', (e) => {
      renderItems(e.target.value.toLowerCase());
    });

    document.getElementById('addEntryBtn').addEventListener('click', () => {
      const title = prompt('Enter Service Name (e.g., Stripe, Gmail):');
      if (!title) return;
      const username = prompt('Enter Username or Email:');
      const pass = prompt('Enter Password (or leave empty to auto-generate):') || PasswordGenerator.generate({ length: 20 });

      vaultItems.push({ id: Date.now(), title, username, pass, category: 'General' });
      saveVault();
      renderUnlockedVault();
    });

    renderItems('');
  }

  function renderItems(filter = '') {
    const list = document.getElementById('itemsList');
    if (!list) return;

    const filtered = vaultItems.filter(item => 
      item.title.toLowerCase().includes(filter) || 
      item.username.toLowerCase().includes(filter)
    );

    if (filtered.length === 0) {
      list.innerHTML = `<div style="text-align: center; color: var(--text-dim); padding: 2rem;">No credentials match filter.</div>`;
      return;
    }

    list.innerHTML = filtered.map(item => `
      <div class="vault-item">
        <div class="item-meta">
          <div class="item-title">${item.title} <span class="item-tag">${item.category}</span></div>
          <div class="item-user">${item.username}</div>
        </div>
        <div class="item-actions">
          <button class="copy-item-btn" data-pass="${item.pass}">Copy Secret</button>
          <button class="del-item-btn" data-id="${item.id}">Delete</button>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.copy-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pass = btn.getAttribute('data-pass');
        navigator.clipboard.writeText(pass).then(() => {
          btn.innerText = 'Copied!';
          setTimeout(() => btn.innerText = 'Copy Secret', 1800);
        });
      });
    });

    list.querySelectorAll('.del-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        vaultItems = vaultItems.filter(it => it.id !== id);
        saveVault();
        renderItems(document.getElementById('searchInput').value.toLowerCase());
      });
    });
  }
});
