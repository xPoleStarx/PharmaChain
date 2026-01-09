
# 🚀 PharmaChain: Sepolia Workflow

Bu proje **Ethereum Sepolia Test Ağı** üzerinde çalışmaktadır.

---

### 1. Günlük Başlatma (Sadece Siteyi Açmak İçin)
Kontrat zaten yüklü olduğu için sadece siteyi başlatmanız yeterlidir.

```bash
npm run dev

```

* **Tarayıcı:** `http://localhost:5173`
* **MetaMask:** Ağı **Sepolia** olarak seçtiğinizden emin olun.

---

### 2. Sıfırdan Kontrat Yükleme (Verileri Temizlemek İçin)

Eğer veritabanını (blokzincir geçmişini) silip temiz bir sayfa açmak isterseniz:

**A. Deploy Edin:**

```bash
npx hardhat run scripts/deploy.cjs --network sepolia

```

**B. .env Dosyasını Güncelleyin:**
Terminalin verdiği yeni adresi kopyalayın ve `.env` dosyasına yapıştırın:

```ini
VITE_CONTRACT_ADDRESS=0xYENI_ADRES_BURAYA

```

**C. Yeniden Başlatın:**
`npm run dev` terminalini durdurup tekrar başlatın.

---

### 🔗 Faydalı Linkler

* **Takip (Explorer):** [Sepolia Etherscan](https://sepolia.etherscan.io/) (Kontrat adresinizi aratın)
* **Para (Faucet):** [Sepolia Faucet](https://sepoliafaucet.com/) (Test ETH biterse)
* **RPC Durumu:** [Alchemy Dashboard](https://dashboard.alchemy.com/)
