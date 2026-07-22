import { useEffect, useRef, useState } from 'react'

const leftHeroImages = [
  '/assets/lobby-hotel.webp',
  '/assets/hero-left-02.webp',
  '/assets/hero-left-03.webp',
]

const rightHeroImages = [
  '/assets/hero-right-03.webp',
  '/assets/hero-right-02.webp',
  '/assets/hero-right-01.webp',
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
                <img src={src} alt={index === 0 ? 'Hotel lobby finished with Kalinga Stone surfaces' : 'Kalinga Stone material inspiration'} />
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

const statementMessages = [
  [['Storytelling', 'through'], ['design']],
  [['a', 'curated', 'selection', 'of', 'over'], ['100', 'projects', 'worldwide.']],
]

function Statement() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const firstWords = [...section.querySelectorAll('.statement-message-1 .statement-word')]
    const secondWords = [...section.querySelectorAll('.statement-message-2 .statement-word')]
    let frame = 0

    const clamp = (value) => Math.min(1, Math.max(0, value))
    const ease = (value) => 1 - Math.pow(1 - clamp(value), 4)

    const paintWords = (words, progress, entering) => {
      const count = Math.max(words.length - 1, 1)

      words.forEach((word, index) => {
        const stagger = (index / count) * .19
        const start = entering ? .39 + stagger : .1 + stagger
        const local = ease((progress - start) / .27)
        const visible = entering ? local : 1 - local
        const direction = index % 2 === 0 ? -1 : 1
        const distance = (40 + index * 5) * direction
        const movement = entering ? distance * (1 - local) : distance * local

        word.style.setProperty('--statement-opacity', visible.toFixed(3))
        word.style.setProperty('--statement-x', `${movement.toFixed(2)}px`)
        word.style.setProperty('--statement-blur', `${(8 * (1 - visible)).toFixed(2)}px`)
      })
    }

    const render = () => {
      frame = 0
      if (reducedMotion.matches) {
        paintWords(firstWords, 1, false)
        paintWords(secondWords, 1, true)
        return
      }

      const bounds = section.getBoundingClientRect()
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1)
      const progress = clamp(-bounds.top / travel)

      paintWords(firstWords, progress, false)
      paintWords(secondWords, progress, true)
    }

    const requestRender = () => {
      if (!frame) frame = window.requestAnimationFrame(render)
    }

    render()
    window.addEventListener('scroll', requestRender, { passive: true })
    window.addEventListener('resize', requestRender)
    reducedMotion.addEventListener('change', requestRender)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestRender)
      window.removeEventListener('resize', requestRender)
      reducedMotion.removeEventListener('change', requestRender)
    }
  }, [])

  return (
    <section
      className="statement"
      ref={sectionRef}
      aria-label="Storytelling through design. A curated selection of over 100 projects worldwide."
    >
      <div className="statement-sticky">
        <div className="statement-stage" aria-hidden="true">
          {statementMessages.map((lines, messageIndex) => {
            let wordIndex = 0
            return (
              <h2 className={`statement-message statement-message-${messageIndex + 1}`} key={messageIndex}>
                {lines.map((line, lineIndex) => (
                  <span className="statement-line" key={lineIndex}>
                    {line.map((word) => {
                      const index = wordIndex++
                      return <span className="statement-word" key={`${word}-${index}`}>{word}</span>
                    })}
                  </span>
                ))}
              </h2>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const signatureCards = [
  { image: '/assets/signature-01.webp', title: 'Material-led design', copy: 'Surfaces conceived as architectural elements, balancing tactility, performance and a quiet visual rhythm.' },
  { image: '/assets/signature-02.webp', title: 'A language of texture', copy: 'Finishes that make light visible—softly honed, richly dimensional and made to reward a closer look.' },
  { image: '/assets/signature-03.webp', title: 'Made through collaboration', copy: 'A creative process shared with architects and designers, from first sketch to finished space.' },
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
  ['K', '15+', 'years of expertise'],
  ['A', '65+', 'countries exported'],
  ['L', '35+', 'cities in India'],
  ['I', '500+', 'exquisite designs'],
  ['N', '5000+', 'global clients'],
  ['G', '20,000+', 'Number of Kitchens Crafted'],
  ['A', '15+', 'Lakh Production Capacity (sq ft)'],
]

function Stats() {
  const sectionRef = useRef(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches) {
      setRevealed(true)
      return undefined
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setRevealed(true)
      observer.disconnect()
    }, { threshold: .35 })

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={`stats-band ${revealed ? 'is-revealed' : ''}`} ref={sectionRef} aria-label="Kalinga Stone by the numbers">
      {stats.map(([letter, number, label], index) => (
        <div className="stat" style={{ '--stat-delay': `${index * .5}s` }} key={`${letter}-${label}`}>
          <span className="stat-mark" aria-hidden="true">{letter}</span>
          <strong>{number}</strong>
          <small>{label}</small>
        </div>
      ))}
    </section>
  )
}

function Projects() {
  const sectionRef = useRef(null)
  const [revealed, setRevealed] = useState(false)
  const [sequenceStage, setSequenceStage] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    let middleTimer = 0
    let rightTimer = 0

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true)
      setSequenceStage(3)
      return undefined
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRevealed(true)
        setSequenceStage(1)
        middleTimer = window.setTimeout(() => setSequenceStage(2), 1800)
        rightTimer = window.setTimeout(() => setSequenceStage(3), 3600)
        observer.disconnect()
      }
    }, { threshold: 0.01, rootMargin: '0px 0px -55% 0px' })

    observer.observe(section)
    return () => {
      observer.disconnect()
      window.clearTimeout(middleTimer)
      window.clearTimeout(rightTimer)
    }
  }, [])

  const projects = [
    {
      room: '/assets/classic-crystal-room.webp',
      swatch: '/assets/classic-crystal-swatch.webp',
      title: 'Classic Crystal',
      type: 'Marble',
      variant: 'classic',
    },
    {
      room: '/assets/emperador-scuro-room.webp',
      swatch: '/assets/emperador-scuro-swatch.webp',
      title: 'Emperador Scuro',
      type: 'Marble',
      variant: 'scuro',
    },
    {
      room: '/assets/classic-crystal-room.webp',
      swatch: '/assets/classic-crystal-swatch.webp',
      title: 'Classic Crystal',
      type: 'Marble',
      variant: 'classic',
    },
  ]

  return (
    <section className={`projects-section stage-${sequenceStage} ${revealed ? 'is-revealed' : ''}`} id="projects" ref={sectionRef}>
      <div className="project-cards">
        {projects.map((project, index) => (
          <article className={`project-card p${index + 1}`} key={`${project.title}-${index}`}>
            <img className={`project-room ${project.variant}`} src={project.room} alt={`${project.title} marble used in an interior`} />
            {project.variant === 'scuro' && <span className="project-room-shade" aria-hidden="true" />}
            <div className="project-material">
              <span className={`project-swatch ${project.variant}`}><img src={project.swatch} alt="" /></span>
              <span className="project-material-copy"><strong>{project.title}</strong><small>{project.type}</small></span>
            </div>
          </article>
        ))}
      </div>
      <a className="text-link" href="#collections">See all projects</a>
    </section>
  )
}

const stoneDeck = [
  { name: 'Quartz', image: '/assets/stone-quartz.webp', imageClass: 'quartz' },
  { name: 'Marble', image: '/assets/stone-marble.webp', imageClass: 'marble' },
  { name: 'Terrazzo', image: '/assets/stone-terrazzo.webp', imageClass: 'terrazzo' },
  { name: 'Porcelain', image: '/assets/stone-porcelain.webp', imageClass: 'porcelain' },
]

function Stones() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const cardRefs = useRef([])
  const [activeStone, setActiveStone] = useState(0)

  useEffect(() => {
    let frame = 0
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const update = () => {
      frame = 0
      const section = sectionRef.current
      const stage = stageRef.current
      if (!section || !stage) return

      const rect = section.getBoundingClientRect()
      const travel = Math.max(1, section.offsetHeight - window.innerHeight)
      const progress = Math.min(1, Math.max(0, -rect.top / travel))
      const rawStep = (reducedMotion.matches ? Math.round(progress * 3) : progress * 3)
      const base = Math.min(3, Math.floor(rawStep))
      const fraction = base === 3 ? 0 : rawStep - base
      const scaleX = stage.clientWidth / 1440
      const scaleY = stage.clientHeight / 864
      const stackOffset = (relativeIndex) => relativeIndex <= 0 ? 140 : relativeIndex === 1 ? 70 : 0

      cardRefs.current.forEach((card, index) => {
        if (!card) return

        let x = 0
        let y = 0
        let rotation = 0
        let opacity = 1
        let zIndex = 1

        if (index < base) {
          x = 1390 * scaleX
          y = 50 * scaleY
          rotation = 5
          opacity = 0
          zIndex = 0
        } else if (index === base && base < 3) {
          x = (140 + fraction * 1250) * scaleX
          y = (140 - fraction * 90) * scaleY
          rotation = fraction * 5
          opacity = 1 - Math.min(1, Math.max(0, (fraction - .15) / .65))
          zIndex = 10
        } else {
          const relativeIndex = index - base
          const fromOffset = stackOffset(relativeIndex)
          const toOffset = stackOffset(relativeIndex - 1)
          const offset = fromOffset + (toOffset - fromOffset) * fraction
          x = offset * scaleX
          y = offset * scaleY
          zIndex = Math.max(1, 8 - relativeIndex)
        }

        card.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg)`
        card.style.opacity = String(opacity)
        card.style.zIndex = String(zIndex)
      })

      setActiveStone(Math.min(3, Math.round(rawStep)))
    }

    const requestUpdate = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    reducedMotion.addEventListener('change', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      reducedMotion.removeEventListener('change', requestUpdate)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section className="stones-section" ref={sectionRef}>
      <div className="stones-sticky">
        <div className="stones-canvas">
          <div className="section-title stacked-title light"><span>The</span>Stones</div>
          <div className="stones-stage" ref={stageRef} aria-live="polite" aria-label={`Stone collection: ${stoneDeck[activeStone].name}`}>
            {stoneDeck.map((stone, index) => (
              <article
                className="stone-card"
                key={stone.name}
                ref={(node) => { cardRefs.current[index] = node }}
                aria-hidden={index !== activeStone}
              >
                <img className={`stone-card-image ${stone.imageClass}`} src={stone.image} alt="" />
                <span className="stone-card-shade" aria-hidden="true" />
                <h2>{stone.name}</h2>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Visualise() {
  const previewRef = useRef(null)
  const handleRef = useRef(null)
  const draggingRef = useRef(false)
  const [comparison, setComparison] = useState(50)
  const [surface, setSurface] = useState(0)
  const surfaces = [
    { name: 'Murano Beige · Honed', color: '#d7d1c8', option: '/assets/visualizer-option-01.webp', filter: 'none', lightLabel: false },
    { name: 'Emperador Scuro · Honed', color: '#5e544e', option: '/assets/visualizer-option-02.webp', filter: 'brightness(.58) saturate(.55) sepia(.18)', lightLabel: true },
    { name: 'Botticino · Honed', color: '#9b8d6d', option: '/assets/visualizer-option-03.webp', filter: 'sepia(.42) saturate(.72) brightness(.93)', lightLabel: true },
    { name: 'Polar White · Honed', color: '#e7ecef', option: '/assets/visualizer-option-04.webp', filter: 'saturate(.24) brightness(1.14)', lightLabel: false },
  ]
  const activeSurface = surfaces[surface]

  const moveComparison = (clientX) => {
    const preview = previewRef.current
    if (!preview) return
    const rect = preview.getBoundingClientRect()
    const position = ((clientX - rect.left) / rect.width) * 100
    setComparison(Math.min(95, Math.max(5, position)))
  }

  const handlePointerDown = (event) => {
    draggingRef.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    moveComparison(event.clientX)
  }

  const handlePointerMove = (event) => {
    if (draggingRef.current) moveComparison(event.clientX)
  }

  const handlePointerUp = (event) => {
    draggingRef.current = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const handleSliderKey = (event) => {
    const changes = { ArrowLeft: -2, ArrowDown: -2, ArrowRight: 2, ArrowUp: 2 }
    if (event.key in changes) {
      event.preventDefault()
      setComparison((value) => Math.min(95, Math.max(5, value + changes[event.key])))
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      setComparison(event.key === 'Home' ? 5 : 95)
    }
  }

  return (
    <section className="visualise-section" id="visualise">
      <div className="visualise-heading">
        <div className="section-title stacked-title"><span>The</span>Visualise space</div>
        <p className="section-intro">Our surfaces are designed to provide professionals with a tool to enhance their projects.</p>
      </div>
      <div className="visualise-grid">
        <div
          className="comparison-preview"
          ref={previewRef}
          style={{ '--comparison': `${comparison}%` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <img className="comparison-image comparison-before" src="/assets/visualizer-before-room.webp" alt="Living room before applying a Kalinga surface" />
          <div className="comparison-after" aria-hidden="true">
            <img
              className="comparison-image"
              src="/assets/visualizer-after-room.webp"
              alt=""
              style={{ filter: activeSurface.filter }}
            />
          </div>
          <div className="room-chip"><i />Living room</div>
          <span className="comparison-label before-label">Before</span>
          <span className="comparison-label after-label">After</span>
          <span className="comparison-line" aria-hidden="true" />
          <button
            className="comparison-handle"
            ref={handleRef}
            type="button"
            role="slider"
            aria-label="Before and after comparison"
            aria-valuemin="5"
            aria-valuemax="95"
            aria-valuenow={Math.round(comparison)}
            onKeyDown={handleSliderKey}
          >
            <span className="ba-grip">‹ ›</span>
          </button>
          <div className="preview-surface-panel" onPointerDown={(event) => event.stopPropagation()}>
            <div className="preview-swatches">
              {surfaces.map((item, index) => (
                <button
                  className={index === surface ? 'selected' : ''}
                  type="button"
                  aria-label={`Use ${item.name}`}
                  aria-pressed={index === surface}
                  style={{ backgroundColor: item.color }}
                  onClick={() => setSurface(index)}
                  key={item.name}
                />
              ))}
            </div>
            <strong>{activeSurface.name}</strong>
          </div>
        </div>
        <div className="visualise-copy">
          <h2>Capture, take a<br />look, decide</h2>
          <div className="visualise-steps">
            <p>Take a photo of your room</p>
            <p>Choose the marble you desire, be it floor or wall</p>
            <p>Review how it fits in your home</p>
          </div>
          <div className="material-options" aria-label="Choose a marble finish">
            {surfaces.map((item, index) => (
              <button
                className={`${index === surface ? 'selected' : ''} ${item.lightLabel ? 'light-label' : ''}`}
                type="button"
                aria-label={`Preview ${item.name}`}
                aria-pressed={index === surface}
                onClick={() => setSurface(index)}
                key={item.name}
              >
                <img src={item.option} alt="" />
                <span>Marble opts</span>
              </button>
            ))}
          </div>
          <button className="ruby-button visualizer-cta" type="button" onClick={() => handleRef.current?.focus()}>Try the visualizer</button>
          <div className="visualise-links"><a href="#visualise">Look into your home</a><a href="#contact">Contact us</a></div>
        </div>
      </div>
    </section>
  )
}

function GlobalReach() {
  return (
    <section className="global-section" id="company">
      <div className="global-heading">
        <div className="section-title stacked-title"><span>Creating landmarks</span>Across the globe</div>
        <p className="section-intro">Our surfaces are designed to provide professionals with a tool to enhance their projects.</p>
      </div>
      <div className="world-map-stage">
        <div className="world-map-art">
          <img className="world-map" src="/assets/world-map.webp" alt="World map showing Kalinga Stone's international presence" />
        </div>
      </div>
    </section>
  )
}

const clubCards = [
  { image: '/assets/slabs.webp', title: 'Designing with intention' },
  { image: '/assets/craft.webp', title: 'The hands behind the surface' },
  { image: '/assets/signature-01.webp', title: 'Materials that change a room' },
  { image: '/assets/signature-03.webp', title: 'A study in light and stone' },
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
        <Statement />
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
