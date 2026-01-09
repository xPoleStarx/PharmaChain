# 🔧 Quick Debugging Guide

## Current Status
- ✅ Event filter fix applied (lines 221-222)
- ✅ Comprehensive logging added
- ✅ Contract redeployed to: `0x5FbDB2315678afecb367f032d93F642f64180aa3`

## Steps to Debug

### 1. **Open Browser Console**
   - Open your app in the browser
   - Press `F12` to open DevTools
   - Go to the **Console** tab

### 2. **Check What Address You're Using**
   - Look for logs starting with `🔍 [getAllDrugsByOwner]`
   - Verify the owner address matches your MetaMask account

### 3. **Register a New Product**
   - Click "Register New Drug"
   - Fill in the form
   - Submit and wait for transaction to mine
   - **Watch the console logs!**

### 4. **What to Look For in Console**

```
🔍 [getAllDrugsByOwner] Starting fetch for owner: 0xf39Fd...
🔍 [getAllDrugsByOwner] Normalized owner: 0xf39fd...
🔍 [getAllDrugsByOwner] Filters created: {...}
🔍 [getAllDrugsByOwner] Events found: {registeredEvents: X, transferredEvents: Y}
🔍 [getAllDrugsByOwner] Sample registered event: {...}
🔍 [getAllDrugsByOwner] Extracted drugId from registered event: DRUG-...
🔍 [getAllDrugsByOwner] Total unique drug IDs: 1 [...]
🔍 [getAllDrugsByOwner] Fetching drug details for ID: DRUG-...
🔍 [getAllDrugsByOwner] Drug found: {id, name, currentOwner, matches: true}
🔍 [getAllDrugsByOwner] Final result: 1 drugs owned by 0xf39Fd...
```

### 5. **Common Issues**

#### ❌ "Events found: {registeredEvents: 0, transferredEvents: 0}"
**Problem:** No events found at all
**Solutions:**
- Check if you're connected to the correct network (localhost:8545)
- Verify contract address in `.env` matches deployment
- Make sure Hardhat node is running
- Try registering a NEW product (old data is gone after redeployment)

#### ❌ "Drug ownership mismatch - skipping"
**Problem:** Drug exists but owner doesn't match
**Solutions:**
- Check which MetaMask account you're using
- Verify you're logged in as Manufacturer
- Check the `currentOwner` in the logs

#### ❌ "Drug not found for ID: ..."
**Problem:** Event exists but can't fetch drug details
**Solutions:**
- Contract might be out of sync
- Try redeploying: `npx hardhat run scripts/deploy.cjs --network localhost`

### 6. **Nuclear Option: Fresh Start**

If nothing works, do a complete reset:

```powershell
# 1. Stop all processes (Ctrl+C in both terminals)

# 2. Restart Hardhat node
npx hardhat node

# 3. In a new terminal, redeploy
npx hardhat run scripts/deploy.cjs --network localhost

# 4. Update .env with new contract address (if changed)

# 5. Restart dev server
npm run dev

# 6. Hard refresh browser (Ctrl+Shift+R)

# 7. Register a NEW product
```

## Expected Console Output After Fix

After registering a product, you should see:
1. ✅ Transaction mined successfully
2. ✅ `registeredEvents: 1` (or more)
3. ✅ Drug ID extracted correctly
4. ✅ Drug details fetched
5. ✅ Ownership matches: `true`
6. ✅ Final result: `1 drugs owned by...`
7. ✅ **Product appears in UI!**

## Still Not Working?

Copy and paste the **ENTIRE console output** (especially the 🔍 logs) and share it with me!
