# 🚀 PharmaChain Sepolia Deployment Guide

## Deploy to Sepolia Testnet in Under 30 Minutes

---

## ✅ Pre-Deployment Checklist

### **Step 1: Get Sepolia Test ETH (5 minutes)**

You need **~0.1 Sepolia ETH** for deployment and testing.

**🔗 Recommended Faucets (Choose ONE):**

1. **Alchemy Sepolia Faucet** ⭐ **BEST**
   - URL: https://sepoliafaucet.com/
   - Requires: Alchemy account (free)
   - Amount: 0.5 Sepolia ETH/day
   - Speed: Instant

2. **Infura Sepolia Faucet**
   - URL: https://www.infura.io/faucet/sepolia
   - Requires: Infura account (free)
   - Amount: 0.5 Sepolia ETH/day
   - Speed: Instant

3. **QuickNode Faucet**
   - URL: https://faucet.quicknode.com/ethereum/sepolia
   - Requires: Twitter account
   - Amount: 0.05 Sepolia ETH
   - Speed: Fast

4. **Google Cloud Faucet** (No registration)
   - URL: https://cloud.google.com/application/web3/faucet/ethereum/sepolia
   - Requires: Nothing (but limited)
   - Amount: 0.05 Sepolia ETH
   - Speed: Moderate

**📝 Action Items:**
- [ ] Create a new MetaMask wallet or use existing one
- [ ] Copy your wallet address (0x...)
- [ ] Visit one of the faucets above
- [ ] Request Sepolia ETH
- [ ] Verify balance in MetaMask (switch to Sepolia network)

---

### **Step 2: Get Free RPC Provider (5 minutes)**

Choose **Alchemy** (recommended) or **Infura**.

#### **Option A: Alchemy (Recommended)**

1. Go to: https://www.alchemy.com/
2. Sign up for free account
3. Click "Create New App"
4. Settings:
   - **Name:** PharmaChain
   - **Chain:** Ethereum
   - **Network:** Sepolia
5. Click "View Key" → Copy **HTTPS URL**
   - Example: `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`

#### **Option B: Infura**

1. Go to: https://www.infura.io/
2. Sign up for free account
3. Create new project: "PharmaChain"
4. Select "Ethereum" → "Sepolia"
5. Copy **HTTPS endpoint**
   - Example: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`

**📝 Action Items:**
- [ ] Create Alchemy or Infura account
- [ ] Create new project
- [ ] Copy RPC URL
- [ ] Save for next step

---

### **Step 3: Export Private Key (2 minutes)**

⚠️ **SECURITY WARNING:** Never share your private key or commit it to Git!

**From MetaMask:**
1. Open MetaMask
2. Click three dots (⋮) → Account Details
3. Click "Show Private Key"
4. Enter password
5. Copy private key (starts with `0x...`)

**📝 Action Items:**
- [ ] Export private key from MetaMask
- [ ] Keep it secure (you'll add it to `.env` next)

---

## 🔧 Configuration Steps

### **Step 4: Update `.env` File (2 minutes)**

Open your `.env` file and update it:

```env
# ============================================
# Sepolia Deployment Configuration
# ============================================

# Your wallet private key (NEVER commit this!)
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE

# Alchemy RPC URL (or Infura)
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# ============================================
# Frontend Configuration (Update AFTER deployment)
# ============================================

# Will be filled after deployment
VITE_CONTRACT_ADDRESS=

# Set to true to use real blockchain
VITE_USE_REAL_BLOCKCHAIN=true

# Sepolia RPC for frontend (same as above)
VITE_PROVIDER_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
```

**📝 Action Items:**
- [ ] Replace `YOUR_PRIVATE_KEY_HERE` with your actual private key
- [ ] Replace `YOUR_API_KEY` with your Alchemy/Infura API key
- [ ] Save the file

---

### **Step 5: Update `hardhat.config.cjs` (Already Done!)**

The Sepolia network configuration has been added. No action needed.

---

## 🚀 Deployment Commands

### **Step 6: Compile Contracts (1 minute)**

```bash
npx hardhat compile
```

**Expected Output:**
```
Compiled 1 Solidity file successfully
```

---

### **Step 7: Deploy to Sepolia (2-3 minutes)**

```bash
npx hardhat run scripts/deploy.cjs --network sepolia
```

**Expected Output:**
```
Deploying PharmaChain contract...

✅ PharmaChain deployed successfully!
Contract address: 0x1234567890abcdef1234567890abcdef12345678

📝 Add this to your .env file:
VITE_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
VITE_USE_REAL_BLOCKCHAIN=true
VITE_PROVIDER_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

🔗 View on Etherscan:
https://sepolia.etherscan.io/address/0x1234567890abcdef1234567890abcdef12345678
```

**📝 Action Items:**
- [ ] Copy the contract address (0x...)
- [ ] Save it for next step
- [ ] Visit Etherscan link to verify deployment

---

### **Step 8: Update `.env` with Contract Address (1 minute)**

Update your `.env` file with the deployed contract address:

```env
VITE_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
VITE_USE_REAL_BLOCKCHAIN=true
VITE_PROVIDER_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
```

**📝 Action Items:**
- [ ] Update `VITE_CONTRACT_ADDRESS` in `.env`
- [ ] Verify `VITE_USE_REAL_BLOCKCHAIN=true`
- [ ] Verify `VITE_PROVIDER_URL` points to Sepolia
- [ ] Save the file

---

### **Step 9: Restart Frontend (1 minute)**

Stop the current dev server (Ctrl+C) and restart:

```bash
npm run dev
```

**📝 Action Items:**
- [ ] Stop current dev server
- [ ] Run `npm run dev`
- [ ] Open http://localhost:5173

---

### **Step 10: Configure MetaMask for Sepolia (2 minutes)**

1. Open MetaMask
2. Click network dropdown (top)
3. Enable "Show test networks" in settings if needed
4. Select "Sepolia test network"
5. Verify you have Sepolia ETH balance

**📝 Action Items:**
- [ ] Switch MetaMask to Sepolia network
- [ ] Verify ETH balance > 0
- [ ] Connect wallet to PharmaChain app

---

## 🧪 Testing Your Deployment

### **Step 11: Test Drug Registration (5 minutes)**

1. **Connect Wallet:**
   - Click "Connect Wallet" in PharmaChain UI
   - Approve connection in MetaMask

2. **Register a Test Drug:**
   - Go to Manufacturer Dashboard
   - Fill in drug details:
     - **ID:** `TEST-001`
     - **Name:** `Aspirin Test`
     - **Batch:** `BATCH-2026-001`
     - **Temperature:** `4`
     - **Location:** `Manufacturing Facility`
   - Click "Register Drug"
   - Approve transaction in MetaMask
   - Wait for confirmation (~15 seconds)

3. **Verify on Etherscan:**
   - Copy transaction hash from MetaMask
   - Visit: `https://sepolia.etherscan.io/tx/YOUR_TX_HASH`
   - Verify transaction status: ✅ Success

**📝 Action Items:**
- [ ] Connect wallet successfully
- [ ] Register test drug
- [ ] Confirm transaction in MetaMask
- [ ] Verify on Etherscan

---

## 📊 Verification & Monitoring

### **View Your Contract on Etherscan**

```
https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
```

**What to Check:**
- ✅ Contract is verified (green checkmark)
- ✅ Transactions are visible
- ✅ Contract balance is 0 ETH (normal)
- ✅ Creator address matches your wallet

---

### **Monitor Gas Costs**

Typical gas costs on Sepolia:
- **Deploy Contract:** ~0.01-0.02 Sepolia ETH
- **Register Drug:** ~0.001-0.002 Sepolia ETH
- **Transfer Drug:** ~0.0005-0.001 Sepolia ETH
- **Update Temperature:** ~0.0003-0.0005 Sepolia ETH

---

## 🔧 Troubleshooting

### **Error: "Insufficient funds for gas"**

**Solution:**
- Get more Sepolia ETH from faucet
- Wait 24 hours if daily limit reached
- Try a different faucet

---

### **Error: "Invalid API Key"**

**Solution:**
- Verify `SEPOLIA_RPC_URL` in `.env`
- Check Alchemy/Infura dashboard for correct URL
- Ensure no extra spaces in `.env` file

---

### **Error: "Private key is invalid"**

**Solution:**
- Ensure private key starts with `0x`
- Remove any spaces or quotes
- Re-export from MetaMask if needed

---

### **Frontend Not Connecting to Sepolia**

**Solution:**
1. Verify `.env` has correct values
2. Restart dev server: `npm run dev`
3. Hard refresh browser: Ctrl+Shift+R
4. Check browser console for errors

---

### **Transaction Pending Forever**

**Solution:**
- Sepolia can be slow during high usage
- Wait up to 2-3 minutes
- Check Etherscan for transaction status
- If stuck >5 minutes, try increasing gas price

---

## 📋 Complete Deployment Checklist

### **Pre-Deployment**
- [ ] ✅ Get Sepolia ETH from faucet (0.1+ ETH)
- [ ] ✅ Create Alchemy/Infura account
- [ ] ✅ Get RPC URL
- [ ] ✅ Export private key from MetaMask

### **Configuration**
- [ ] ✅ Update `.env` with `PRIVATE_KEY`
- [ ] ✅ Update `.env` with `SEPOLIA_RPC_URL`
- [ ] ✅ Verify `hardhat.config.cjs` has Sepolia network

### **Deployment**
- [ ] ✅ Compile contracts: `npx hardhat compile`
- [ ] ✅ Deploy to Sepolia: `npx hardhat run scripts/deploy.cjs --network sepolia`
- [ ] ✅ Copy contract address from output
- [ ] ✅ Update `.env` with `VITE_CONTRACT_ADDRESS`
- [ ] ✅ Update `.env` with `VITE_PROVIDER_URL` (Sepolia RPC)

### **Frontend**
- [ ] ✅ Restart dev server: `npm run dev`
- [ ] ✅ Switch MetaMask to Sepolia network
- [ ] ✅ Connect wallet to app
- [ ] ✅ Test drug registration

### **Verification**
- [ ] ✅ View contract on Etherscan
- [ ] ✅ Verify transaction success
- [ ] ✅ Test all features (register, transfer, update)

---

## 🎉 Success Criteria

You've successfully deployed when:
- ✅ Contract visible on Sepolia Etherscan
- ✅ Frontend connects to Sepolia network
- ✅ Can register drugs via MetaMask
- ✅ Transactions confirm in ~15-30 seconds
- ✅ Block Explorer shows your transactions

---

## 📞 Next Steps After Deployment

### **Share Your dApp**
1. Deploy frontend to Vercel/Netlify (free)
2. Share URL with others
3. They can connect their MetaMask and interact

### **Add More Test Accounts**
1. Create additional MetaMask accounts
2. Get Sepolia ETH for each
3. Test multi-role workflows (Manufacturer → Distributor → Pharmacy)

### **Monitor Usage**
- Check Etherscan daily for transactions
- Monitor Alchemy/Infura dashboard for API usage
- Track gas costs

---

## 🔐 Security Reminders

⚠️ **CRITICAL:**
- ✅ **NEVER** commit `.env` to Git
- ✅ **NEVER** share your private key
- ✅ Use a **separate wallet** for testnet (not your mainnet wallet)
- ✅ Keep private keys in password manager
- ✅ Add `.env` to `.gitignore` (already done)

---

## 📚 Useful Links

- **Sepolia Etherscan:** https://sepolia.etherscan.io/
- **Alchemy Dashboard:** https://dashboard.alchemy.com/
- **Infura Dashboard:** https://infura.io/dashboard
- **MetaMask Support:** https://support.metamask.io/
- **Hardhat Docs:** https://hardhat.org/docs

---

## 🎓 What You've Accomplished

✅ Deployed a production-ready smart contract to public testnet  
✅ Configured professional RPC infrastructure  
✅ Connected frontend to live blockchain  
✅ Enabled multi-user testing  
✅ Gained experience with real blockchain deployment  

**Estimated Total Time:** 20-30 minutes  
**Cost:** $0 (all free tier services)

---

## 🚀 Ready for Production?

After successful Sepolia testing, consider:
1. **Security Audit:** Get contract audited before mainnet
2. **Gas Optimization:** Reduce deployment and transaction costs
3. **Mainnet Deployment:** Follow same process but with real ETH
4. **Domain & Hosting:** Deploy frontend to custom domain

---

**Congratulations! Your PharmaChain dApp is now live on Sepolia! 🎉**

*Questions? Issues? Check the Troubleshooting section above.*
