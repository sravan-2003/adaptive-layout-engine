import { z } from 'zod'

export const RectSchema = z.object({ x: z.number().finite(), y: z.number().finite(), width: z.number().positive(), height: z.number().positive() })
export type Rect = z.infer<typeof RectSchema>
export const ImportanceSchema = z.enum(['primary', 'secondary', 'tertiary'])
export type Importance = z.infer<typeof ImportanceSchema>

const BaseElementSchema = z.object({ id: z.string().min(1), importance: ImportanceSchema, rect: RectSchema, zIndex: z.number().int(), locked: z.boolean(), visible: z.boolean().optional() })
export const TextElementSchema = BaseElementSchema.extend({ type: z.literal('text'), role: z.enum(['headline', 'subtext', 'tagline']), content: z.string(), fontSize: z.number().positive(), minFontSize: z.number().positive(), fontWeight: z.number().int().min(100).max(900), maxLines: z.number().int().positive(), color: z.string(), letterSpacing: z.string().optional(), textTransform: z.enum(['none', 'uppercase']).optional() })
export type TextElement = z.infer<typeof TextElementSchema>
export const ImageElementSchema = BaseElementSchema.extend({ type: z.literal('image'), src: z.string().min(1), asset: z.string().optional(), aspectRatioLocked: z.boolean(), glow: z.string().optional() })
export type ImageElement = z.infer<typeof ImageElementSchema>
export const LogoElementSchema = BaseElementSchema.extend({ type: z.literal('logo'), src: z.string().min(1), minSize: z.number().positive() })
export type LogoElement = z.infer<typeof LogoElementSchema>
export const CtaElementSchema = BaseElementSchema.extend({ type: z.literal('cta'), label: z.string().min(1), minTouchTarget: z.number().positive(), icon: z.enum(['arrow', 'none']).optional(), variant: z.enum(['pill', 'plain']).optional() })
export type CtaElement = z.infer<typeof CtaElementSchema>
export const FeatureElementSchema = BaseElementSchema.extend({ type: z.literal('feature'), label: z.string().min(1), icon: z.enum(['circle', 'diamond', 'square']), color: z.string(), fontSize: z.number().positive(), minFontSize: z.number().positive() })
export type FeatureElement = z.infer<typeof FeatureElementSchema>
export const AdElementSchema = z.discriminatedUnion('type', [TextElementSchema, ImageElementSchema, LogoElementSchema, CtaElementSchema, FeatureElementSchema])
export type AdElement = z.infer<typeof AdElementSchema>

export const SurfaceSchema = z.object({ id: z.string().min(1), name: z.string().min(1), width: z.number().int().positive(), height: z.number().int().positive(), safeZone: z.object({ top: z.number().nonnegative(), right: z.number().nonnegative(), bottom: z.number().nonnegative(), left: z.number().nonnegative() }), category: z.enum(['social', 'video', 'display']) })
export type Surface = z.infer<typeof SurfaceSchema>
export const LayoutSchema = z.object({ id: z.string().min(1), surfaceId: z.string().min(1), elements: z.array(AdElementSchema) })
export type Layout = z.infer<typeof LayoutSchema>
