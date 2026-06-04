type BgOrg = { name: string; url?: string }
type BgEntry = { role: string; year: string; orgs: BgOrg[] }

export const SITE = {
  name: 'Liam Strickland',
  email: 'hello@liamstrickland.dev',
  location: 'Cape Town, ZA',
  url: 'https://liamstrickland.dev',
  bookingUrl: 'https://cal.eu/liamstrickland',
} as const

export const ABOUT: {
  disciplines: string[]
  social: { label: string; url: string }[]
  background: BgEntry[]
} = {
  disciplines: [
    'Web Development',
    'Graphic Design',
    'Creative Direction',
  ],
  social: [
    { label: 'Instagram', url: 'https://www.instagram.com/liam_stricko/' },
    { label: 'studio pilz', url: 'https://www.studiopilz.art/' },
    { label: 'GitHub', url: 'https://github.com/str1ck0' },
  ],
  background: [
    {
      role: 'Artist',
      year: '2025',
      orgs: [
        { name: 'Boom Festival' },
        { name: 'Daniel Popper Team', url: 'https://danielpopper.com/' },
      ],
    },
    {
      role: 'Frontend Developer',
      year: '2025',
      orgs: [{ name: 'Full Stack', url: 'https://www.wearefullstack.com/' }],
    },
    {
      role: 'Web Development Teacher',
      year: '2022 – 2025',
      orgs: [{ name: 'Le Wagon', url: 'https://www.lewagon.com/' }],
    },
    {
      role: 'Web Designer',
      year: '2021',
      orgs: [{ name: 'PWD', url: 'https://pwd.com.au/' }],
    },
  ],
}
