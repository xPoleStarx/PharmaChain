# 🚀 Sepolia Deployment Quick Reference

## ⚡ 5-Minute Deployment Checklist

### **Prerequisites (Do Once)**
```bash
# 1. Get Sepolia ETH
Visit: https://sepoliafaucet.com/
Amount needed: 0.1 Sepolia ETH

# 2. Get Alchemy RPC URL
Visit: https://www.alchemy.com/
Create app → Ethereum → Sepolia
Copy HTTPS URL
```

### **Configuration (2 minutes)**
```bash
# Edit .env file
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_FROM_METAMASK
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
```

### **Deployment Commands (3 minutes)**
```bash
# 1. Compile contracts
npx hardhat compile

# 2. Deploy to Sepolia
npx hardhat run scripts/deploy.cjs --network sepolia

# 3. Copy the contract address from output
# Example: 0x1234567890abcdef1234567890abcdef12345678
```

### **Frontend Configuration (1 minute)**
```bash
# Update .env with deployment output
VITE_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
VITE_USE_REAL_BLOCKCHAIN=true
VITE_PROVIDER_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Restart frontend
npm run dev
```

### **Verification**
```bash
# 1. Switch MetaMask to Sepolia network
# 2. Connect wallet to app
# 3. Register a test drug
# 4. Check Etherscan:
https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
```

---

## 🔗 Essential Links

| Resource | URL |
|----------|-----|
| **Sepolia Faucet** | https://sepoliafaucet.com/ |
| **Alchemy** | https://www.alchemy.com/ |
| **Infura** | https://www.infura.io/ |
| **Sepolia Etherscan** | https://sepolia.etherscan.io/ |
| **Full Guide** | See SEPOLIA_DEPLOYMENT_GUIDE.md |

---

## 🆘 Common Issues

### "Insufficient funds"
→ Get more Sepolia ETH from faucet

### "Invalid API Key"
→ Check SEPOLIA_RPC_URL in .env

### "Transaction pending forever"
→ Wait 2-3 minutes, check Etherscan

### "Frontend not connecting"
→ Restart dev server: `npm run dev`

---

## 📊 Expected Costs (Sepolia)

| Action | Gas Cost |
|--------|----------|
| Deploy Contract | ~0.01-0.02 ETH |
| Register Drug | ~0.001-0.002 ETH |
| Transfer Drug | ~0.0005-0.001 ETH |
| Update Temp | ~0.0003-0.0005 ETH |

**Total for testing:** ~0.05-0.1 Sepolia ETH

---

## ✅ Success Criteria

- [ ] Contract visible on Sepolia Etherscan
- [ ] Frontend connects to Sepolia
- [ ] Can register drugs via MetaMask
- [ ] Transactions confirm in ~15-30 seconds

---

**Deployment Time:** ~5-10 minutes  
**Cost:** $0 (free testnet)

For detailed instructions, see: `SEPOLIA_DEPLOYMENT_GUIDE.md`
