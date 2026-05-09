import Header from '@/components/Header'
import { PortableText } from '@portabletext/react'
import { getSiteSettings, getGraffiti, type AboutImage } from '@/lib/sanity'
import Image from 'next/image'

export const revalidate = 60

export const metadata = {
  title: 'About — Liam Strickland',
}

function AboutImageStrip({ images }: { images: AboutImage[] }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-6 px-6 snap-x snap-mandatory">
      {images.map((img, i) => (
        <div
          key={img.asset._id}
          className="flex-shrink-0 snap-start overflow-hidden"
          style={{ height: 220, width: 'auto' }}
        >
          <Image
            src={img.asset.url}
            alt={img.alt || `Photo ${i + 1}`}
            width={img.asset.metadata?.dimensions?.width || 400}
            height={img.asset.metadata?.dimensions?.height || 300}
            placeholder={img.asset.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={img.asset.metadata?.lqip}
            className="h-full w-auto object-cover"
          />
        </div>
      ))}
    </div>
  )
}

function AboutImageGrid({ images }: { images: AboutImage[] }) {
  return (
    <div className="columns-2 sm:columns-3 gap-2 space-y-2">
      {images.map((img, i) => (
        <div key={img.asset._id} className="break-inside-avoid overflow-hidden">
          <Image
            src={img.asset.url}
            alt={img.alt || `Photo ${i + 1}`}
            width={img.asset.metadata?.dimensions?.width || 400}
            height={img.asset.metadata?.dimensions?.height || 300}
            placeholder={img.asset.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={img.asset.metadata?.lqip}
            className="w-full object-cover"
          />
        </div>
      ))}
    </div>
  )
}

export default async function AboutPage() {
  const [settings, graffiti] = await Promise.all([getSiteSettings(), getGraffiti()])

  return (
    <>
      <Header />
      <main className="pt-16 pb-24">
        <div className="mt-16 space-y-12">

          {/* Top images — horizontal strip, full bleed */}
          {settings?.aboutImagesTop && settings.aboutImagesTop.length > 0 && (
            <section>
              <AboutImageStrip images={settings.aboutImagesTop} />
            </section>
          )}

          {/* Bio + rest in constrained width */}
          <div className="max-w-2xl mx-auto px-6 space-y-12">

            {/* Bio */}
            <section>
              <p className="text-lg leading-relaxed">
                {settings?.aboutText || 'Designer, developer, writer. Based wherever the work takes me.'}
              </p>
            </section>

            {/* Extended About */}
            {settings?.extendedAbout && (
              <section className="font-moonlight prose prose-lg max-w-none text-[var(--fg)] prose-p:text-[var(--fg)] prose-headings:text-[var(--fg)] prose-a:text-[var(--fg)]">
                <PortableText value={settings.extendedAbout as Parameters<typeof PortableText>[0]['value']} />
              </section>
            )}

            {/* Disciplines */}
            {settings?.stack && settings.stack.length > 0 && (
              <section>
                <h2 className="text-xs uppercase tracking-widest text-[var(--fg-muted)] mb-4">Disciplines</h2>
                <ul className="space-y-1">
                  {settings.stack.map((item) => (
                    <li key={item} className="text-sm"><span className="text-lg">⟣ </span>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Contact */}
            {settings?.email && (
              <section>
                <h2 className="text-xs uppercase tracking-widest text-[var(--fg-muted)] mb-4">Contact</h2>
                <a
                  href={`mailto:${settings.email}`}
                  className="text-sm border-b border-[var(--fg)] pb-px hover:opacity-50 transition-opacity"
                >
                  {settings.email}
                </a>
              </section>
            )}

            {/* Elsewhere */}
            {settings?.social && settings.social.length > 0 && (
              <section>
                <h2 className="text-xs uppercase tracking-widest text-[var(--fg-muted)] mb-4">Elsewhere</h2>
                <ul className="space-y-2">
                  {settings.social.map((link) => (
                    <li key={link.platform}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:opacity-50 transition-opacity"
                      >
                        {link.platform} ➺
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

          </div>

          {/* Bottom images — full bleed masonry grid */}
          {settings?.aboutImagesBottom && settings.aboutImagesBottom.length > 0 && (
            <section className="max-w-4xl mx-auto px-6">
              <AboutImageGrid images={settings.aboutImagesBottom} />
            </section>
          )}

          {/* Graffiti gallery */}
          {graffiti && graffiti.length > 0 && (
            <section className="max-w-4xl mx-auto px-6 space-y-6">
              <h2 className="text-xs uppercase tracking-widest text-[var(--fg-muted)]">Tags</h2>
              <div className="columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3">
                {graffiti.map(tag => tag.image?.asset?.url && (
                  <div
                    key={tag._id}
                    className="break-inside-avoid border border-[var(--border)] overflow-hidden bg-[var(--bg-alt,var(--bg))]"
                  >
                    <Image
                      src={tag.image.asset.url}
                      alt="Visitor tag"
                      width={tag.image.asset.metadata?.dimensions?.width || 400}
                      height={tag.image.asset.metadata?.dimensions?.height || 300}
                      className="w-full object-contain"
                      placeholder={tag.image.asset.metadata?.lqip ? 'blur' : 'empty'}
                      blurDataURL={tag.image.asset.metadata?.lqip}
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-[var(--fg-muted)]">
                Tags left by visitors. Leave yours with the marker icon ↘
              </p>
            </section>
          )}

        </div>
      </main>
    </>
  )
}
