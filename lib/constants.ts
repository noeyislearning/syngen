import "dotenv/config"

/**
 * API
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL
/**
 * Sidebar
 * */
export const SIDEBAR_COOKIE_NAME = "sidebar:state"
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
export const SIDEBAR_WIDTH = "16rem"
export const SIDEBAR_WIDTH_MOBILE = "18rem"
export const SIDEBAR_WIDTH_ICON = "3rem"
export const SIDEBAR_KEYBOARD_SHORTCUT = "b"
/**
 * Mobile Viewport
 * */
export const MOBILE_BREAKPOINT = 768
/**
 * Charts
 */
export const THEMES = { light: "", dark: ".dark" } as const
