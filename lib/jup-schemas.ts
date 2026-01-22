import { z } from "zod"

/**
 * Event schema - minimal fields used in UI
 */
export const EventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(["active", "closed", "resolved", "cancelled"]).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  imageUrl: z.string().optional(),
  markets: z.array(z.unknown()).optional(),
}).passthrough()

export type Event = z.infer<typeof EventSchema>

/**
 * Market schema - minimal fields used in UI
 */
export const MarketSchema = z.object({
  id: z.string(),
  eventId: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  yesPrice: z.number().optional(),
  noPrice: z.number().optional(),
  volume: z.number().optional(),
  liquidity: z.number().optional(),
  status: z.enum(["active", "closed", "resolved", "cancelled"]).optional(),
  resolution: z.string().nullable().optional(),
  endTime: z.string().optional(),
}).passthrough()

export type Market = z.infer<typeof MarketSchema>

/**
 * Order schema - minimal fields used in UI
 */
export const OrderSchema = z.object({
  id: z.string().optional(),
  pubkey: z.string().optional(),
  marketId: z.string().optional(),
  side: z.enum(["buy", "sell"]).optional(),
  outcome: z.enum(["yes", "no"]).optional(),
  price: z.number().optional(),
  size: z.number().optional(),
  filledSize: z.number().optional(),
  status: z.enum(["open", "filled", "cancelled", "expired"]).optional(),
  createdAt: z.string().optional(),
}).passthrough()

export type Order = z.infer<typeof OrderSchema>

/**
 * Position schema - minimal fields used in UI
 */
export const PositionSchema = z.object({
  id: z.string().optional(),
  pubkey: z.string().optional(),
  marketId: z.string().optional(),
  outcome: z.enum(["yes", "no"]).optional(),
  size: z.number().optional(),
  averagePrice: z.number().optional(),
  unrealizedPnl: z.number().optional(),
  realizedPnl: z.number().optional(),
}).passthrough()

export type Position = z.infer<typeof PositionSchema>

/**
 * Unsigned transaction response
 */
export const UnsignedTxSchema = z.object({
  transaction: z.string(),
  message: z.string().optional(),
}).passthrough()

export type UnsignedTx = z.infer<typeof UnsignedTxSchema>

/**
 * Validate and log schema errors without blocking
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context: string
): T {
  const result = schema.safeParse(data)
  
  if (!result.success) {
    console.warn(`[Jupiter API] Schema validation warning for ${context}:`, result.error.errors)
  }
  
  // Return data as-is regardless of validation
  return data as T
}

/**
 * Validate array of items
 */
export function safeValidateArray<T>(
  schema: z.ZodSchema<T>,
  data: unknown[],
  context: string
): T[] {
  return data.map((item, index) => safeValidate(schema, item, `${context}[${index}]`))
}
