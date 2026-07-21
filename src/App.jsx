import { useEffect, useRef, useState } from 'react'

const leftHeroImages = [
  '/assets/hero-left-01.png',
  '/assets/hero-left-02.png',
  '/assets/hero-left-03.png',
]

const rightHeroImages = [
  '/assets/hero-right-03.png',
  '/assets/hero-right-02.png',
  '/assets/hero-right-01.png',
]

function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <button className="menu-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open}>
        {open ? 'Close' : 'Menu'}
      </button>
      <nav className={`nav-left ${open ? 'is-open' : ''}`} aria-label="Primary navigation">
        <a href="#collections">Collections</a>
        <a href="#projects">Projects</a>
        <a href="#visualise">Vass</a>
      </nav>
      <a className="brand" href="#top" aria-label="Kalinga Stone home">
        <img src="/logo/wordmark-red.svg" alt="Kalinga Stone" />
      </a>
      <nav className={`nav-right ${open ? 'is-open' : ''}`} aria-label="Company navigation">
        <a href="#company">The company</a>
        <a className="talk-pill" href="#contact">Let&apos;s talk</a>
      </nav>
    </header>
  )
}

function Hero() {
  const sectionRef = useRef(null)
  const leftTrackRef = useRef(null)
  const rightTrackRef = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const section = sectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      const travel = Math.max(1, section.offsetHeight - window.innerHeight)
      const progress = Math.min(1, Math.max(0, -rect.top / travel))
      const distance = window.innerHeight * 2

      if (leftTrackRef.current) {
        leftTrackRef.current.style.transform = `translate3d(0, ${-progress * distance}px, 0)`
      }
      if (rightTrackRef.current) {
        rightTrackRef.current.style.transform = `translate3d(0, ${(-1 + progress) * distance}px, 0)`
      }
      setActive(Math.min(2, Math.round(progress * 2)))
    }

    const requestUpdate = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section className="split-hero" id="top" ref={sectionRef} aria-label="Kalinga Stone inspiration gallery">
      <div className="hero-sticky">
        <div className="hero-column hero-column-left">
          <div className="hero-track" ref={leftTrackRef}>
            {leftHeroImages.map((src, index) => (
              <figure className="hero-frame" key={src}>
                <img src={src} alt={index === 0 ? 'Terrazzo bathroom designed with Kalinga Stone' : 'Kalinga Stone material inspiration'} />
              </figure>
            ))}
          </div>
        </div>
        <div className="hero-column hero-column-right">
          <div className="hero-track right-track" ref={rightTrackRef}>
            {rightHeroImages.map((src, index) => (
              <figure className="hero-frame" key={src}>
                <img src={src} alt={index === 2 ? 'Kitchen island designed with Kalinga Stone' : 'Kalinga Stone interior inspiration'} />
              </figure>
            ))}
          </div>
        </div>
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="hero-kicker">Inspiration, collaborations, and ideas<br />that quietly shape our world</p>
          <h1><span>Go beyond</span>The finished space</h1>
        </div>
        <div className="hero-progress" aria-label={`Hero image ${active + 1} of 3`}>
          {[0, 1, 2].map((item) => <i className={item === active ? 'active' : ''} key={item} />)}
        </div>
        <div className="scroll-label">Scroll <span>↓</span></div>
      </div>
    </section>
  )
}

const signatureCards = [
  { image: '/assets/signature-01.png', title: 'Material-led design', copy: 'Surfaces conceived as architectural elements, balancing tactility, performance and a quiet visual rhythm.' },
  { image: '/assets/signature-02.png', title: 'A language of texture', copy: 'Finishes that make light visible—softly honed, richly dimensional and made to reward a closer look.' },
  { image: '/assets/signature-03.png', title: 'Made through collaboration', copy: 'A creative process shared with architects and designers, from first sketch to finished space.' },
]

function WhyKalinga() {
  const [open, setOpen] = useState(0)
  const rows = ['Signature style', 'Standout collections', 'Innovations']

  return (
    <section className="why-section" id="collections">
      <div className="section-title stacked-title"><span>Why</span>Kalinga?</div>
      <div className="accordion">
        {rows.map((row, index) => (
          <div className={`accordion-row ${open === index ? 'open' : ''}`} key={row}>
            <button type="button" onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}>
              <span>{row}</span><b>{open === index ? '×' : '+'}</b>
            </button>
            <div className="accordion-panel" aria-hidden={open !== index}>
              <div className="accordion-panel-inner">
                {index === 0 ? (
                  <>
                    <div className="panel-head"><span>Form, feeling and function—held in balance.</span><span>← &nbsp;&nbsp; →</span></div>
                    <div className="signature-grid">
                      {signatureCards.map((card) => (
                        <article key={card.title}>
                          <div className="signature-image"><img src={card.image} alt="" /></div>
                          <h3>{card.title}</h3>
                          <p>{card.copy}</p>
                        </article>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="accordion-copy">A considered family of surfaces designed to give creative ideas greater range, clarity and permanence.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const stats = [
  ['15+', 'years of expertise'], ['65+', 'countries exported'], ['35+', 'cities in India'],
  ['500+', 'exquisite designs'], ['5000+', 'global clients'], ['20000+', 'kitchens crafted'],
]

function Stats() {
  return (
    <section className="stats-band" aria-label="Kalinga Stone by the numbers">
      {stats.map(([number, label], index) => (
        <div className="stat" key={label}><span className="stat-mark">{String.fromCharCode(107 + index)}</span><strong>{number}</strong><small>{label}</small></div>
      ))}
    </section>
  )
}

function Projects() {
  return (
    <section className="projects-section" id="projects">
      <div className="project-cards">
        {[0, 1, 2].map((item) => (
          <article className={`project-card p${item + 1}`} key={item}>
            <img src={item === 1 ? '/assets/hero-left-02.png' : '/assets/project-shower.png'} alt="Kalinga Stone project interior" />
            <div><span>{item === 1 ? 'Unquiet House' : 'Ocean Crest'}</span><small>{item === 1 ? 'Mumbai' : 'Goa'}</small></div>
          </article>
        ))}
      </div>
      <a className="text-link" href="#collections">See all projects</a>
    </section>
  )
}

function Stones() {
  return (
    <section className="stones-section">
      <div className="section-title stacked-title light"><span>The</span>Stones</div>
      <div className="stones-stage">
        <div className="stone-sheet sheet-one" />
        <div className="stone-sheet sheet-two" />
        <img src="/assets/stones.png" alt="Kalinga Stone quartz and engineered surface collection" />
        <h2>Quartz</h2>
      </div>
    </section>
  )
}

function Visualise() {
  const [surface, setSurface] = useState(0)
  const surfaces = [
    { name: 'Calacatta Sand', color: '#dfd4c4', image: '/assets/visualizer-after.png' },
    { name: 'Bianco Terrazzo', color: '#c8c1b6', image: '/assets/visualizer-before.png' },
    { name: 'Nero', color: '#4a443f', image: '/assets/hero-left-02.png' },
    { name: 'Polar White', color: '#f0eee9', image: '/assets/visualizer-before.png' },
  ]

  return (
    <section className="visualise-section" id="visualise">
      <div className="section-title stacked-title"><span>The</span>Visualise space</div>
      <p className="section-intro">See surfaces in your room before you decide. A simple way to compare tone, texture and atmosphere.</p>
      <div className="visualise-grid">
        <div className="room-preview">
          <img src={surfaces[surface].image} alt={`Living space shown with ${surfaces[surface].name}`} />
          <span className="hotspot">+</span>
          <small>Living room</small>
        </div>
        <div className="visualise-copy">
          <p className="eyebrow">Make it yours</p>
          <h2>Capture, take a<br />look, decide</h2>
          <p>Take a photo of your room. Choose the surface you love. See it in your space in seconds.</p>
          <div className="swatches">
            {surfaces.map((item, index) => (
              <button className={index === surface ? 'selected' : ''} type="button" onClick={() => setSurface(index)} key={item.name}>
                <i style={{ background: item.color }} /><span>{item.name}</span>
              </button>
            ))}
          </div>
          <a className="ruby-button" href="#contact">Try the visualiser</a>
          <div className="visualise-links"><a href="#projects">View all projects</a><a href="#contact">Contact us</a></div>
        </div>
      </div>
    </section>
  )
}

function GlobalReach() {
  return (
    <section className="global-section" id="company">
      <div className="section-title stacked-title"><span>Creating landmarks</span>Across the globe</div>
      <p className="section-intro">Our surfaces are specified in remarkable spaces across more than 65 countries.</p>
      <img className="world-map" src="/assets/world-map.png" alt="World map showing Kalinga Stone's international presence" />
    </section>
  )
}

const clubCards = [
  { image: '/assets/slabs.png', title: 'Designing with intention' },
  { image: '/assets/craft.png', title: 'The hands behind the surface' },
  { image: '/assets/signature-01.png', title: 'Materials that change a room' },
  { image: '/assets/signature-03.png', title: 'A study in light and stone' },
]

function Club() {
  return (
    <section className="club-section">
      <div className="section-title stacked-title"><span>The</span>Kalinga Club</div>
      <p className="section-intro">Ideas, collaborations and stories from a global design community.</p>
      <div className="club-grid">
        {clubCards.map((card) => (
          <article key={card.title}>
            <img src={card.image} alt="" />
            <p className="eyebrow">News</p>
            <h3>{card.title}</h3>
            <p>Perspectives on material, architecture and the people who make considered spaces possible.</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Newsletter() {
  return (
    <section className="newsletter">
      <h2>Do you want to stay updated on KalingaStone news?</h2>
      <p>Register for the Kalinga newsletter. Receive our latest stories, projects and ideas from the world of architecture.</p>
      <a href="mailto:hello@kalingastone.com?subject=Newsletter%20signup">Sign up for our newsletter</a>
    </section>
  )
}

const contactRows = [
  ['⌖', 'Find a showroom or a retailer'], ['♙', 'Register as a professional'], ['▣', 'Bespoke and Project Consultancy'],
  ['ⓘ', 'Request Information'], ['✉', 'Sign up for the newsletter'],
]

function GetInTouch() {
  return (
    <section className="contact-section" id="contact">
      <div className="section-title stacked-title"><span>Get in</span>Touch</div>
      <p className="section-intro">Our surfaces are designed to give professionals a tool for enhancing every project.</p>
      <div className="contact-list">
        {contactRows.map(([icon, label]) => (
          <a href="mailto:hello@kalingastone.com" key={label}><span><i>{icon}</i>{label}</span><b>+</b></a>
        ))}
      </div>
    </section>
  )
}

function Featured() {
  return (
    <section className="featured-section">
      <article className="feature feature-red">
        <h3>Slabs in design</h3><p>How designers are creative with natural stone slabs</p><a href="#projects">Read more</a>
      </article>
      <article className="feature feature-image">
        <h3>ABC × Artistic Tile</h3><p>A bold expression of movement &amp; pattern</p><a href="#projects">Read more</a>
      </article>
    </section>
  )
}

const footerColumns = [
  ['Collections', 'Quartz', 'Marble', 'Terrazzo', 'Elixir', 'Custom Terrazzo'],
  ['Company', 'Our Story', 'Craftsmanship', 'Sustainability', 'Careers'],
  ['Explore', 'Projects', 'Experience', 'Visualiser', 'Find a Dealer'],
  ['Contact', 'Sales', 'Support', 'Dealer Locator', 'Book a Visit'],
]

function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand"><img src="/logo/wordmark-white.svg" alt="Kalinga Stone" /><p>Premium engineered surfaces—terrazzo, marble and quartz, made in India.</p></div>
        {footerColumns.map(([title, ...items]) => (
          <div className="footer-col" key={title}><h3>{title}</h3>{items.map((item) => <a href="#top" key={item}>{item}</a>)}</div>
        ))}
      </div>
      <div className="footer-bottom"><span>© 2026 Kalinga Stone. All rights reserved.</span><div><a href="#top">Privacy</a><a href="#top">Terms</a><a href="#top">Instagram</a><a href="#top">LinkedIn</a></div></div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <section className="statement"><h2>Storytelling through<br />design — a curated selection of over<br />100 projects worldwide.</h2></section>
        <WhyKalinga />
        <Stats />
        <Projects />
        <Stones />
        <Visualise />
        <GlobalReach />
        <Club />
        <Newsletter />
        <GetInTouch />
        <Featured />
      </main>
      <Footer />
    </>
  )
}
