import Header from '@/components/Header'
import Gallery from '@/components/Gallery'
import { getGalleryImages } from '@/lib/sanity'

export const revalidate = 60

export default async function Home() {
  const data = await getGalleryImages()

  return (
    <>
      <Header />
      <main className="pt-16">
        <Gallery data={data} />
      </main>
    </>
  )
}
