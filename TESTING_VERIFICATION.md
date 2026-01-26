# Wallet Trading Integration - Verification & Testing Guide

## Quick Start Verification (5 minutes)

### Step 1: Verify Components Load
Open the browser console and check:
```javascript
// These should not error
import { TradePanel } from '@/components/trade-panel'
import { QuickTradeButton } from '@/components/quick-trade-button'
import { WalletStatus } from '@/components/wallet-status'
```

### Step 2: Test Wallet Connection
1. Navigate to any page with `WalletButton` visible
2. Click the wallet button
3. Should show Dynamic Labs connection UI
4. Select Solana wallet
5. Authorize connection
6. Should see wallet address in UI

### Step 3: Test Trading Panel
1. Navigate to `/markets/[id]`
2. Locate `TradePanel` component
3. Should show "Connected" badge
4. Select "Yes" outcome
5. Enter "10" shares
6. Should calculate: 10 × price = estimated cost
7. Click "Buy Yes" button
8. Should execute without errors

### Step 4: Verify API Integration
Open DevTools Network tab:
1. Execute a trade
2. Should see POST request to `/api/trades/execute`
3. Request body should include `userAddress`, `marketId`, `outcome`, `shares`
4. Response should have `orderId`, `success: true`, `filledPrice`

## Detailed Testing Scenarios

### Scenario 1: Fresh Connection
**Expected:** User sees wallet connection prompt, connects, then can trade

1. Clear browser storage: `localStorage.clear()`
2. Refresh page
3. Click "Connect Wallet" button
4. Complete Dynamix.xyz connection
5. Return to app
6. Should see connected status ✓
7. Trade panel should be enabled ✓

**Validation Points:**
- [ ] Wallet prompt appears
- [ ] Connection completes successfully
- [ ] Address displays correctly
- [ ] Trade controls become enabled
- [ ] Status persists across pages

### Scenario 2: Execute Trade
**Expected:** Trade executes and returns confirmation

1. Connect wallet (from Scenario 1)
2. Navigate to `/markets/[id]` (pick any market)
3. TradePanel shows "Connected" badge
4. Click "Yes" button to select outcome
5. Enter "5" in shares input
6. Observe price preview updates
7. Click "Buy Yes for $..." button
8. Wait for trade to execute

**Validation Points:**
- [ ] Outcome selection works (Yes/No buttons highlight)
- [ ] Share input accepts positive numbers
- [ ] Price calculation appears: `shares × price / 100 = cost`
- [ ] Trade button shows cost
- [ ] Loading state appears during execution
- [ ] Success message shows order ID
- [ ] Panel resets after trade

### Scenario 3: Error Handling
**Expected:** Errors display gracefully

#### Test 3a: Invalid Shares
1. Try entering "-5" shares → Should reject or show error
2. Try entering "99999999" shares → Should show "exceed maximum"
3. Try entering "abc" → Should not accept non-numbers

#### Test 3b: Wallet Disconnect
1. Trade panel is visible and enabled
2. Open developer tools → Clear localStorage
3. Refresh page
4. Trade panel should show disconnected
5. Try clicking trade button → Should prompt to connect

#### Test 3c: Network Error
1. Open DevTools → Network throttling → "Offline"
2. Try to execute trade
3. Should show error message
4. Restore connection
5. Try again → Should work

**Validation Points:**
- [ ] Proper error messages appear
- [ ] No silent failures
- [ ] UI remains responsive
- [ ] Retry is possible
- [ ] Recovery is straightforward

### Scenario 4: Quick Trade Button
**Expected:** Compact widget works correctly

1. Find page with `QuickTradeButton` component
2. Click outcome button (Yes/No)
3. Should show simplified UI
4. Optional: Click "Details" to expand
5. Adjust shares with +/- buttons
6. Click trade button
7. Should execute same way as TradePanel

**Validation Points:**
- [ ] Compact button size appropriate
- [ ] Details expand/collapse works
- [ ] Share adjustment works (1-1000)
- [ ] Trade executes successfully
- [ ] Works on mobile layout

### Scenario 5: Trading Features Lifecycle
**Expected:** Lifecycle shows wallet requirement indicators

1. Navigate to page with `TradingFeatures` component
2. If wallet NOT connected:
   - [ ] Steps 2-4 should appear grayed out
   - [ ] Wallet icons should appear on steps 2-4
   - [ ] "Requires wallet connection" text visible
   - [ ] Connect button visible in header
3. If wallet IS connected:
   - [ ] All steps should be fully visible
   - [ ] No wallet icons/warnings
   - [ ] All steps at full opacity

## Integration Point Verification

### API Endpoints
Test each endpoint (use curl or Postman):

```bash
# 1. Create Order
curl -X POST http://localhost:3000/api/trades/execute \
  -H "Content-Type: application/json" \
  -d '{
    "marketId": "test-market",
    "outcome": "yes",
    "shares": 10,
    "userAddress": "wallet-address"
  }'

# Expected response:
# {
#   "success": true,
#   "orderId": "order-xxx",
#   "filledPrice": 52.5,
#   "totalCost": 52.50,
#   "timestamp": 1234567890
# }

# 2. Check Order Status
curl http://localhost:3000/api/jup/orders/status/order-xxx

# 3. Get User Positions
curl http://localhost:3000/api/jup/positions/[pubkey]

# 4. Get User Stats
curl http://localhost:3000/api/jup/user-stats/[pubkey]
```

### Wallet Context Integration
Check that `useWalletTrading` receives:

```typescript
const { user, isAuthenticated } = useDynamicContext()
// user.verifiedCredentials[0].address should exist
// isAuthenticated should be true when connected
```

## Performance Checks

### Load Times
- [ ] TradePanel loads in < 1 second
- [ ] QuickTradeButton loads in < 500ms
- [ ] Trade execution request completes in < 3 seconds
- [ ] Order confirmation appears in < 1 second after success

### Memory
- [ ] No memory leaks from repeated connects/disconnects
- [ ] Component cleanup on unmount works properly
- [ ] No duplicate listeners/subscriptions

### Network
- [ ] Only necessary API calls made
- [ ] No failed requests (404, 500 errors)
- [ ] Proper error handling for slow networks

## Mobile Responsiveness

Test on:
- [ ] Mobile (375px width) - buttons stack, readable text
- [ ] Tablet (768px width) - multi-column layout works
- [ ] Desktop (1920px width) - full layout displays

**Mobile Specific Tests:**
- [ ] Touch targets at least 44x44px
- [ ] Text is readable without zoom
- [ ] Forms don't overflow
- [ ] Keyboard doesn't cover inputs
- [ ] Bottom sheet/modals work

## Accessibility Checks

- [ ] Keyboard navigation works (Tab/Enter)
- [ ] Screen reader announces buttons
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] Errors announced to assistive technology

## Debug Commands

Enable comprehensive logging:
```javascript
// In browser console
localStorage.setItem('debug', 'whether:*')

// Then look for logs with these prefixes:
// [useWalletTrading] - Wallet trading operations
// [v0] - Debug console logs
// [trade] - Trade execution
// [api] - API calls
```

## Common Issues & Solutions

| Issue | Symptoms | Solution |
|-------|----------|----------|
| Wallet not connecting | "Failed to fetch" error | Normal in preview, check production |
| Trade not executing | Button stays disabled after click | Check network, verify wallet address |
| Wrong prices | Costs calculated incorrectly | Clear cache, refresh page |
| Address not showing | Wallet shows "Connected" but no address | Wait 2-3 seconds, page may still be loading |
| Repeated errors | Same error every trade attempt | Check browser console for details, try refresh |

## Pre-Launch Checklist

### Code Quality
- [ ] No console errors
- [ ] No console warnings
- [ ] TypeScript compiles without errors
- [ ] All imports resolve correctly

### Functionality
- [ ] Wallet connection works
- [ ] Trade execution works
- [ ] Error handling works
- [ ] All UI elements responsive
- [ ] Loading states display correctly

### Performance
- [ ] Page load < 3 seconds
- [ ] Trade execution < 5 seconds
- [ ] No jank on interactions
- [ ] Smooth animations

### Security
- [ ] User addresses never logged
- [ ] API calls use correct methods
- [ ] No sensitive data in localStorage
- [ ] HTTPS enforced in production

### Compatibility
- [ ] Chrome/Edge latest
- [ ] Firefox latest
- [ ] Safari latest
- [ ] Mobile browsers

### Documentation
- [ ] Integration guide complete
- [ ] API endpoints documented
- [ ] Error codes documented
- [ ] Usage examples provided

## Test Data

Use these for testing:

**Market IDs:**
- `market-001` - "Will Bitcoin reach $100k?"
- `market-002` - "Will US inflation drop below 3%?"
- `market-003` - "Will SpaceX land on Mars?"

**Test Shares:**
- 1 (minimum)
- 10 (typical)
- 100 (larger trade)
- 1,000,000 (maximum)

**Test Slippage:**
- 0.1% (minimum)
- 0.5% (default)
- 5% (maximum)

## Success Criteria

Trading system is ready when:
- ✓ Users can connect wallet
- ✓ Users can execute trades
- ✓ Trades are confirmed immediately
- ✓ Positions update correctly
- ✓ Errors are handled gracefully
- ✓ UI is responsive and smooth
- ✓ All validation works
- ✓ No console errors

## Sign-Off

Date Tested: ___________
Tester Name: ___________
Status: [ ] Ready for Production [ ] Needs Fixes

Issues Found:
1. ___________
2. ___________
3. ___________

Approved By: ___________ Date: ___________
