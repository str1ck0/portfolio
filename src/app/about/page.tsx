import Header from '@/components/Header'
import { PortableText } from '@portabletext/react'
import { getSiteSettings, getGraffiti, urlFor, type AboutImage } from '@/lib/sanity'
import Image from 'next/image'

export const revalidate = 60

export const metadata = {
  title: 'About — Liam Strickland',
}

function AboutImages({ images }: { images: AboutImage[] }) {
  return (
    <>
      {images.map((img, i) => (
        <section key={img.asset._id}>
          <Image
            src={urlFor(img).width(1200).quality(85).auto('format').url()}
            alt={img.alt || `Photo ${i + 1}`}
            width={Math.round((img.asset.metadata?.dimensions?.width || 800) * (1 - (img.crop?.left || 0) - (img.crop?.right || 0)))}
            height={Math.round((img.asset.metadata?.dimensions?.height || 600) * (1 - (img.crop?.top || 0) - (img.crop?.bottom || 0)))}
            placeholder={img.asset.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={img.asset.metadata?.lqip}
            className="w-full h-auto block"
          />
        </section>
      ))}
    </>
  )
}

export default async function AboutPage() {
  const [settings, graffiti] = await Promise.all([getSiteSettings(), getGraffiti()])

  return (
    <>
      <Header />
      <main className="pt-16 pb-20">
        <div className="mt-8 sm:mt-14 space-y-8 sm:space-y-12">

          {/* All content in constrained column */}
          <div className="max-w-2xl mx-auto px-5 sm:px-6 space-y-8 sm:space-y-12">

            {/* Images above bio */}
            {settings?.aboutImagesTop && settings.aboutImagesTop.length > 0
              ? <AboutImages images={settings.aboutImagesTop} />
              : settings?.aboutImage?.asset?.url && (
                <section>
                  <Image
                    src={urlFor(settings.aboutImage).width(1200).quality(85).auto('format').url()}
                    alt={settings.aboutImage.alt || 'About'}
                    width={Math.round((settings.aboutImage.asset.metadata?.dimensions?.width || 800) * (1 - (settings.aboutImage.crop?.left || 0) - (settings.aboutImage.crop?.right || 0)))}
                    height={Math.round((settings.aboutImage.asset.metadata?.dimensions?.height || 600) * (1 - (settings.aboutImage.crop?.top || 0) - (settings.aboutImage.crop?.bottom || 0)))}
                    placeholder={settings.aboutImage.asset.metadata?.lqip ? 'blur' : 'empty'}
                    blurDataURL={settings.aboutImage.asset.metadata?.lqip}
                    className="w-full h-auto block"
                  />
                </section>
              )
            }

            {/* Bio */}
            <section>
              <p className="text-base sm:text-lg leading-relaxed">
                {settings?.aboutText || 'Designer, developer, writer. Based wherever the work takes me.'}
              </p>
            </section>

            {/* Extended About */}
            {settings?.extendedAbout && (
              <section className="font-moonlight prose prose-base sm:prose-lg max-w-none text-[var(--fg)] prose-p:text-[var(--fg)] prose-headings:text-[var(--fg)] prose-a:text-[var(--fg)]">
                <PortableText value={settings.extendedAbout as Parameters<typeof PortableText>[0]['value']} />
              </section>
            )}

            {/* Disciplines */}
            {settings?.stack && settings.stack.length > 0 && (
              <section>
                <h2 className="text-xs uppercase tracking-widest text-[var(--fg-muted)] mb-3">Disciplines</h2>
                <ul className="space-y-1">
                  {settings.stack.map((item) => (
                    <li key={item} className="text-sm"><span className="text-lg">⟣ </span>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Contact + Elsewhere side by side on mobile */}
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
              {settings?.email && (
                <section>
                  <h2 className="text-xs uppercase tracking-widest text-[var(--fg-muted)] mb-3">Contact</h2>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-sm border-b border-[var(--fg)] pb-px hover:opacity-50 transition-opacity"
                  >
                    {settings.email}
                  </a>
                </section>
              )}

              {settings?.social && settings.social.length > 0 && (
                <section>
                  <h2 className="text-xs uppercase tracking-widest text-[var(--fg-muted)] mb-3">Elsewhere</h2>
                  <ul className="space-y-1.5">
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

            {/* Images below bio */}
            {settings?.aboutImagesBottom && settings.aboutImagesBottom.length > 0 && (
              <AboutImages images={settings.aboutImagesBottom} />
            )}

            {/* Copyright */}
            <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--fg-muted)] pt-2 border-t border-[var(--border)] text-center">
              © {new Date().getFullYear()} Liam Strickland
            </p>

          </div>

          {/* Graffiti gallery */}
          {graffiti && graffiti.length > 0 && (
            <section className="max-w-2xl mx-auto px-5 sm:px-6 space-y-4">
              <h2 className="text-xs uppercase tracking-widest text-[var(--fg-muted)]">Tags</h2>
              <div className="columns-2 sm:columns-3 gap-2">
                {graffiti.map(tag => tag.image?.asset?.url && (
                  <div
                    key={tag._id}
                    className="break-inside-avoid mb-2 border border-[var(--border)] overflow-hidden"
                  >
                    <Image
                      src={tag.image.asset.url}
                      alt="Visitor tag"
                      width={tag.image.asset.metadata?.dimensions?.width || 400}
                      height={tag.image.asset.metadata?.dimensions?.height || 300}
                      className="w-full h-auto block"
                      placeholder={tag.image.asset.metadata?.lqip ? 'blur' : 'empty'}
                      blurDataURL={tag.image.asset.metadata?.lqip}
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-[var(--fg-muted)]">Tags left by visitors — leave yours ↘</p>
            </section>
          )}

        </div>
      </main>
    </>
  )
}
