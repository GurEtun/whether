# Wallet-to-Trading Integration Guide

## Overview
The Whether platform now has full integration between the Dynamix.xyz Solana wallet and the trading system. Users can connect their wallet and execute trades directly on the platform.

## Components & Flow

### 1. Wallet Setup
- **Provider**: `DynamicProvider` (lib/dynamic-provider.tsx)
- **Widget**: `WalletButton` (components/wallet-button.tsx)
- **Environment ID**: `0fe280f0-4765-48ea-9fe5-88a96192e920`
- **Network**: Solana

### 2. Trading Integration

#### Main Trading Components
1. **TradePanel** (`components/trade-panel.tsx`)
   - Full-featured trading interface
   - Requires wallet connection
   - Shows wallet connection status
   - Validates shares before execution
   - Displays price preview and slippage

2. **QuickTradeButton** (`components/quick-trade-button.tsx`)
   - Compact trading widget
   - Can be embedded on any page
   - Quick 10-share default trades
   - Expandable details view

3. **TradingFeatures** (`components/trading-features.tsx`)
   - Shows trading lifecycle
   - Indicates which steps require wallet connection
   - Connect button for easier onboarding

#### Core Hook
**useWalletTrading** (`hooks/use-wallet-trading.ts`)

```typescript
const { executeTrade, loading, error, lastTrade, canTrade, isConnected } = useWalletTrading()

// Execute a trade
const result = await executeTrade({
  marketId: "market-123",
  outcome: "yes",
  shares: 100,
  slippage: 0.5, // optional
  priceLimit: 55, // optional
})
```

### 3. Trading Flow

```
User Connects Wallet (Dynamix.xyz)
    ↓
TradePanel Component Loads
    ↓
User Selects Outcome (Yes/No)
    ↓
User Enters Shares
    ↓
System Calculates Cost & Slippage
    ↓
User Clicks "Buy"
    ↓
useWalletTrading.executeTrade() Called
    ↓
API Call to /api/trades/execute
    ↓
Trading Engine Processes Trade
    ↓
Market Prices Update
    ↓
Trade Result Displayed
    ↓
Position Updated in User Portfolio
```

## API Endpoints

### Trade Execution
```
POST /api/trades/execute
Body: {
  marketId: string
  outcome: "yes" | "no"
  shares: number
  priceLimit?: number
  slippage?: number
  userAddress: string (from wallet)
  side?: "buy" | "sell"
}

Response: {
  success: boolean
  orderId: string
  outcome: "yes" | "no"
  shares: number
  filledPrice: number
  totalCost: number
  timestamp: number
  status: "filled" | "pending" | "rejected"
  message?: string
}
```

### Order Status
```
GET /api/jup/orders/status/[orderPubkey]
Response: Order status and details
```

### User Positions
```
GET /api/jup/positions/[pubkey]
GET /api/jup/positions?pubkey=[pubkey]
Response: User's trading positions
```

### User Statistics
```
GET /api/jup/user-stats/[pubkey]
Response: Win rate, total trades, profit/loss, etc.
```

## Usage Examples

### Using TradePanel
```tsx
import { TradePanel } from '@/components/trade-panel'

export function MarketDetail() {
  return (
    <TradePanel
      marketId="market-xyz"
      yesPrice={52}
      noPrice={48}
      onTradeComplete={() => refetchPositions()}
    />
  )
}
```

### Using QuickTradeButton
```tsx
import { QuickTradeButton } from '@/components/quick-trade-button'

export function MarketCard() {
  return (
    <div>
      <QuickTradeButton
        marketId="market-xyz"
        outcome="yes"
        price={52}
        compact={true}
      />
    </div>
  )
}
```

### Using Hook Directly
```tsx
import { useWalletTrading } from '@/hooks/use-wallet-trading'

export function CustomTradeWidget() {
  const { executeTrade, loading, isConnected } = useWalletTrading()

  if (!isConnected) {
    return <p>Please connect your wallet</p>
  }

  return (
    <button onClick={() => executeTrade({ marketId: 'xyz', outcome: 'yes', shares: 10 })}>
      Buy Yes
    </button>
  )
}
```

## Features

✓ Wallet Connection (Dynamix.xyz)
✓ Trade Execution (Yes/No outcomes)
✓ Real-time Price Updates
✓ Slippage Protection
✓ Price Limits
✓ Order Tracking
✓ Position Management
✓ User Statistics
✓ Error Handling
✓ Loading States

## Validation Rules

- **Shares**: Must be 1-1,000,000
- **Slippage**: 0.1% - 5%
- **Price Limit**: Optional, between 1-99¢
- **Wallet**: Must be connected to trade
- **Market**: Must exist and be active

## Error Handling

Common errors and solutions:

1. **"Wallet not connected"**
   - User needs to click wallet button and authorize connection

2. **"Failed to fetch"** (in preview)
   - Expected in Vercel preview environment
   - Will work in production

3. **"Shares must be positive"**
   - User entered invalid share amount

4. **"Order not found"**
   - Trade may still be processing
   - Check order status endpoint

## Trading Engine

The platform uses an in-memory trading engine that:
- Tracks market prices
- Applies realistic price impact based on order size
- Maintains order history
- Calculates user metrics
- Simulates order execution

### Market Price Logic
```typescript
// Base price with random walk
yesPrice = currentPrice + (random * slippage_impact)

// Large orders cause more slippage
slippagePercent = (baseSlippage) * (shares / 1000)

// Final execution price
executionPrice = basePrice ± slippageAmount
```

## Testing

Test the integration:

1. **Connect Wallet**: Click wallet button → Select account → Approve
2. **Navigate to Market**: Go to /markets/[id]
3. **Open Trade Panel**: Should show "Connected" badge
4. **Enter Shares**: e.g., 10 shares
5. **Preview Cost**: Check total cost calculation
6. **Execute Trade**: Click "Buy Yes" or "Buy No"
7. **Confirm**: Check order confirmation

## Debugging

Enable debug logs:
```typescript
// In browser console
window.localStorage.setItem('debug', 'whether:*')
```

Check logs:
- Trading engine: `[useWalletTrading]` prefix
- API responses: Check network tab in DevTools
- Wallet status: Check Dynamic SDK logs

## Production Deployment

Before deploying to production:

1. Verify Dynamic Labs environment ID
2. Test wallet connection on Solana mainnet
3. Verify API endpoints are accessible
4. Test trade execution with small amounts
5. Monitor for errors in production
6. Set up analytics tracking

## Future Enhancements

- [ ] Multi-token support
- [ ] Advanced order types (limit, stop-loss)
- [ ] Liquidity pools
- [ ] Portfolio analytics
- [ ] Automated rebalancing
- [ ] Mobile app
- [ ] WebSocket real-time updates
