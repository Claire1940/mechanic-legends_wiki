import { BookOpen, Car, Coins, Hammer, Megaphone, Ticket, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'codes' -> t('nav.codes')
	path: string // URL 路径，如 '/codes'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// Mechanic Legends 内容分类（来源: 0_meta/mechanic-legends_wiki/关键词.json 7 分类）
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'codes', path: '/codes', icon: Ticket, isContentType: true },
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'money', path: '/money', icon: Coins, isContentType: true },
	{ key: 'upgrades', path: '/upgrades', icon: Wrench, isContentType: true },
	{ key: 'cars', path: '/cars', icon: Car, isContentType: true },
	{ key: 'repair', path: '/repair', icon: Hammer, isContentType: true },
	{ key: 'features', path: '/features', icon: Megaphone, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> ['codes', 'guide', 'money', ...]

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
