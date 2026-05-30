export const SITE = {
  name: 'Liam Strickland',
  email: 'hello@liamstrickland.dev',
  location: 'Cape Town, ZA',
  bookingUrl: 'https://cal.eu/liamstrickland',
} as const

export const ABOUT = {
  disciplines: [
    'Web Development',
    'Graphic Design',
    'Creative Direction',
  ],
  social: [
    { label: 'Instagram', url: 'https://www.instagram.com/liam_stricko/' },
    { label: 'studio pilz', url: 'https://www.studiopilz.art/' },
    { label: 'GitHub', url: 'https://github.com/str1ck0' }
  ],
  clients:
    'Le Wagon ·  Kunda Valley · Garden Elegance',
} as const
