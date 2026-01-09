# 🎬 PharmaChain: Canlı Demo Senaryosu (Sepolia)

Bu senaryo, bir ilacın **Üretici -> Distribütör -> Eczane -> Hasta** arasındaki yolculuğunu gerçek blokzincir üzerinde simüle eder.

---

### 🎭 Rol Dağılımı ve Cüzdanlar
*Sunum öncesi bu hesapların MetaMask'te hazır olduğundan emin ol.*

* **Rol 1: Manufacturer (Üretici)** -> `Account 1`
* **Rol 2: Distributor (Dağıtıcı)** -> `Account 2`
* **Rol 3: Pharmacy (Eczane)** -> `Account 3`
* **Rol 4: Patient (Hasta)** -> `Account 4`

---

### 🚀 Sahne 1: Üretim (The Genesis)

1.  **Bağlan:** MetaMask'tan **Account 1**'i seç. Siteye bağlan.
2.  **Kayıt:** `Manufacturer Dashboard`'a git.
3.  **İşlem:** "Register New Drug" butonuna bas.
    * *İlaç Adı:* `Aspirin Gold (Demo)`
    * *ID:* (Otomatik veya `DEMO-001`)
4.  **Onay:** MetaMask onayını ver ve bekle.
5.  **Sonuç:** İlacın listeye düştüğünü göster. *"Şu an bu ilaç blokzincire kazındı ve sahibi benim."* de.

---

### 🚚 Sahne 2: Distribütöre Transfer

1.  **Hazırlık:** MetaMask'ı aç, **Account 2**'nin (Distribütör) adresini kopyala.
2.  **Transfer:** Üretici panelinde ilacın yanındaki **Transfer** butonuna bas.
3.  **Giriş:** Açılan kutuya Account 2 adresini yapıştır.
4.  **Onay:** "Transfer" de ve MetaMask onayını ver.
5.  **Geçiş:** İşlem bitince MetaMask'tan **Account 2**'ye geçiş yap. Sayfayı yenile.
6.  **Sonuç:** `Distributor Dashboard`'unda ilacın belirdiğini göster. *"İlaç artık üreticide değil, distribütörün mülkiyetinde."*

---

### 🏥 Sahne 3: Eczaneye Sevkiyat

1.  **Hazırlık:** MetaMask'ı aç, **Account 3**'ün (Eczane) adresini kopyala.
2.  **Transfer:** Distribütör panelinde ilacın yanındaki **Transfer** butonuna bas.
3.  **Giriş:** Açılan kutuya Account 3 adresini yapıştır.
4.  **Onay:** MetaMask onayını ver.
5.  **Geçiş:** İşlem bitince MetaMask'tan **Account 3**'e geçiş yap. Sayfayı yenile.
6.  **Sonuç:** `Pharmacy Dashboard`'unda ilacın geldiğini göster.

---

### 💊 Sahne 4: Hastaya Satış (Final)

1.  **Hazırlık:** MetaMask'ı aç, **Account 4**'ün (Hasta) adresini kopyala.
2.  **Satış:** Eczane panelinde **Sell / Verify** butonuna bas.
3.  **Giriş:** Açılan kutuya Account 4 adresini yapıştır.
4.  **Onay:** MetaMask onayını ver.
5.  **Geçiş:** İşlem bitince MetaMask'tan **Account 4**'e geçiş yap.
6.  **Sonuç:** `Patient Dashboard` (veya My Medicines) ekranında ilacın son sahibinin hasta olduğunu göster.

---

### 🕵️ Sahne 5: Büyük Kanıt (Etherscan)

1.  Son işlemin "Transaction Hash"ini kopyala veya Etherscan linkine tıkla.
2.  Etherscan üzerinde ilacın **From: Eczane -> To: Hasta** yolculuğunu göster.
3.  *"Gördüğünüz gibi, ilacın fabrikadan çıkıp hastaya ulaşana kadarki tüm serüveni şeffaf ve değiştirilemez bir şekilde kayıt altına alındı."* diyerek bitir.

---

### 💡 Sunum İpuçları
* **Bekleme Süreleri:** Sepolia gerçek bir ağ olduğu için onaylar 15-20 saniye sürebilir. Bu arada *"Şu an dünyadaki madenciler işlemimizi onaylıyor"* diyerek boşluğu doldur.
* **Cüzdan Değişimi:** En çok unutulan adım budur. Rol değiştirdiğinde **MUTLAKA** MetaMask'tan da hesabı değiştirmeyi unutma.
* **Hata Olursa:** Sayfayı yenile (F5) ve cüzdanın doğru hesapta olduğundan emin ol.