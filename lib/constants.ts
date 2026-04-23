export const PHONE_DISPLAY = '+216 46 209 091'
export const PHONE_TEL = '+21646209091'
export const WHATSAPP_NUMBER = '21646209091'
export const EMAIL = 'paintballsousse@gmail.com'
export const INSTAGRAM_HANDLE = '@paintball_sousse'
export const INSTAGRAM_URL = 'https://www.instagram.com/paintball_sousse/'
export const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61554747521036'

export const MAP_CENTER: [number, number] = [35.8978, 10.5184]

export const ADDRESS_LINES = [
  'Près du Mall of Sousse',
  'Route Sidi Bou Ali, Kalaa Kebira',
]

export function whatsappHref(message: string) {
  const q = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${q}`
}
