import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X, Lightbulb, UsersRound, Trophy, CircleHelp, Sparkles, Instagram, MessageCircle } from 'lucide-react';
import AuthPanel from './AuthPanel.jsx';
import { getCurrentUser } from './authApi.js';
import './redesign.css';
import './accessibility.css';

// Operative names, roles, and bios are taken from the public Enigma website.
// Individual email addresses are intentionally omitted; use the club contact links.
const operatives = [
  { id: 'OP_101', name: 'Yamuna Sharma D', role: 'Lead', bio: 'Always drawn to art and creativity, I love finding stories in colors, design, and the little details that often go unnoticed.', image: '/assets/enigma/lead.jpeg' },
  { id: 'OP_102', name: 'Kshitij Sharma', role: 'Co-Lead', bio: 'A curious jack of all trades who loves learning, building, and exploring new skills across domains.', image: '/assets/enigma/colead.jpg' },
  { id: 'OP_103', name: 'Krishal Karna', role: 'Technical Lead', bio: 'Turning data into decisions — one model at a time.', image: '/assets/enigma/tech.jpeg' },
  { id: 'OP_104', name: 'Shaili Srivastava', role: 'Operation Lead', bio: 'Passionate about technology and problem-solving. I love building efficient systems, optimizing workflows, and constantly learning new things to stay ahead.', image: '/assets/enigma/operation.jpeg' },
  { id: 'OP_105', name: 'Aakash Agarwal', role: 'Resource Lead', bio: 'Passionate technologist solving real-world challenges.', image: '/assets/enigma/resource.jpeg' },
  { id: 'OP_106', name: 'Ayadee Aphiwatamorn', role: 'Creative Lead', bio: 'Creativity isn’t just what I do—it’s how I see the world. I love turning ideas into something visual, meaningful, and uniquely mine.', image: '/assets/enigma/creative.jpeg' },
  { id: 'OP_107', name: 'Suyog Lal Shrestha', role: 'Photography Lead', bio: 'Eager and enthusiastic about exploring new things.', image: '/assets/enigma/photography.jpeg' },
  { id: 'OP_108', name: 'Sworaj Khadka', role: 'Social Media Lead', bio: 'Crafting our digital presence and keeping the community engaged one post at a time.', image: '/assets/enigma/social.jpg' },
];

// Past missions are shown separately so they cannot be mistaken for upcoming events.
const pastMissions = [
  { title: 'THE BLINDDATE', description: '“Who is gonna be your tech partner?”', date: 'March 17, 2026', venue: '002 Seminar Hall', image: '/assets/enigma/BlindDate.jpeg' },
  { title: 'RACE FOR ROLES 2026', description: 'Recruitment drive for Enigma’s core teams. Technical, Social Media, Design, and Management roles filled by passionate innovators.', date: 'Feb 11, 2026', venue: 'Main Auditorium', image: '/assets/enigma/raceforroles.jpg' },
  { title: 'INNOVATION DUEL 2025', description: 'Students turned campus problems into real solutions. Showcased prototypes and smart innovations for campus life improvement.', date: 'Nov 27, 2025', venue: 'LH 113 & 127', image: '/assets/enigma/event_2025.jpg', gallery: ['/assets/enigma/p1.jpg', '/assets/enigma/p2.jpg', '/assets/enigma/p3.jpg', '/assets/enigma/p4.jpg', '/assets/enigma/p5.jpg', '/assets/enigma/p6.jpg'] },
];
function Brand({ footer = false }) {
  return <a className={`brand${footer ? ' brand--footer' : ''}`} href="#home" aria-label="Enigma home">
    <img className="brand-logo" src="/assets/enigma/Logo_Updated-BB2DRv6b.png" alt="" width="38" height="38" loading={footer ? 'lazy' : 'eager'} decoding="async" />
    <span className="brand-name">ENIGMA<small>JAIN UNIVERSITY | TECH CLUB</small></span>
  </a>;
}

export default function EnigmaApp() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [joinMessage, setJoinMessage] = useState('NO SPAM. JUST SIGNAL.');
  const [events, setEvents] = useState([]);
  const [eventsLoaded, setEventsLoaded] = useState(false);
  const [eventsError, setEventsError] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => setUser(null));
  }, []);

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') setMenuOpen(false);
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  useEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -35px 0px' });
    const observeTargets = (root) => {
      if (root.nodeType !== Node.ELEMENT_NODE) return;
      if (root.matches('[data-reveal]')) observer.observe(root);
      root.querySelectorAll('[data-reveal]').forEach((target) => observer.observe(target));
    };
    observeTargets(document.body);
    const mutations = new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach(observeTargets)));
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => { mutations.disconnect(); observer.disconnect(); document.documentElement.classList.remove('motion-ready'); };
  }, []);

  // Load only current, published events from Django. The API filters past events.
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    fetch(`${apiUrl}/events/`)
      .then((response) => {
        if (!response.ok) throw new Error('Could not load events');
        return response.json();
      })
      .then((items) => setEvents(items.map((item) => {
        const date = new Date(item.starts_at);
        return {
          day: date.toLocaleDateString('en', { day: '2-digit', timeZone: 'Asia/Kolkata' }),
          month: date.toLocaleDateString('en', { month: 'short', timeZone: 'Asia/Kolkata' }).toUpperCase(),
          title: item.title,
          type: item.category,
          time: [date.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' }), item.venue].filter(Boolean).join(' · '),
          url: item.registration_url || '#join',
        };
      })))
      .catch(() => { setEvents([]); setEventsError(true); })
      .finally(() => setEventsLoaded(true));
  }, []);

  // Preserve the existing Django signup request and its success/error feedback.
  async function join(event) {
    event.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/join/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error('Could not submit');
      setJoinMessage('YOU\u2019RE ON THE LIST. SEE YOU SOON.');
      setEmail('');
    } catch {
      setJoinMessage('COULDN\u2019T CONNECT. PLEASE TRY AGAIN SOON.');
    }
  }
  const closeMenu = () => setMenuOpen(false);

  return <>
    <a className="skip-link" href="#main-content">SKIP TO CONTENT</a>
    <header className="site-header" data-entrance>
      <Brand />
      <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      <nav id="primary-navigation" className={`site-nav${menuOpen ? ' site-nav--open' : ''}`} aria-label="Main navigation">
        <a href="#about" onClick={closeMenu}>ABOUT</a><a href="#events" onClick={closeMenu}>EVENTS</a><a href="#community" onClick={closeMenu}>COMMUNITY</a>
        <a href="#operatives" onClick={closeMenu}>OPERATIVES</a>
        <button className="nav-auth" type="button" onClick={() => { setAuthOpen(true); closeMenu(); }}>{user ? 'ACCOUNT' : 'SIGN IN'} <ArrowUpRight size={14} /></button>
        <a className="nav-cta" href="#join" onClick={closeMenu}>JOIN THE CLUB <ArrowUpRight size={16} /></a>
      </nav>
    </header>

    <main id="home">
      <section className="hero" id="main-content">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" /> STUDENT-LED. FUTURE-FOCUSED. <span className="year">[ 20—26 ]</span></p>
            <h1 data-reveal="headline">Make the<br /><span>unknown</span><br />possible<i>.</i></h1>
            <p className="hero-description">We're the people who stay curious, build things that matter, and make the future a little less mysterious. At Jain University, Enigma is a student-led community for curious builders, coders, and creators.</p>
            <a className="button button--light" href="#join">JOIN THE CLUB <ArrowDown size={17} /></a>
            <p className="hero-aside">A SPACE FOR THE CURIOUS<br />AND THE “WHAT IF?” PEOPLE.</p>
          </div>
          {/* Place the extracted club logo at the center of the portal artwork. */}
          <div className="hero-art" data-reveal="float">
            <div className="logo-orbit" aria-hidden="true">
              <div className="logo-disc-face logo-disc-face--front"><img className="art-logo" src="/assets/enigma/Logo_Updated-BB2DRv6b.png" alt="" width="256" height="256" decoding="async" /></div>
              <div className="logo-disc-face logo-disc-face--back"><img className="art-logo" src="/assets/enigma/Logo_Updated-BB2DRv6b.png" alt="" width="256" height="256" decoding="async" /></div>
            </div>
            <nav className="hero-socials" aria-label="Enigma social media">
              <a href="https://chat.whatsapp.com/KUe221OJGsd63Hs5grwUMS" target="_blank" rel="noopener noreferrer" aria-label="Join Enigma on WhatsApp"><MessageCircle size={17} aria-hidden="true" /><span>WHATSAPP</span></a>
              <a href="https://www.instagram.com/ju_enigma/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Follow Enigma on Instagram"><Instagram size={17} aria-hidden="true" /><span>INSTAGRAM</span></a>
            </nav>
          </div>
          <a className="scroll-hint" href="#about">SCROLL TO EXPLORE <ArrowDown size={15} /></a><span className="hero-vertical">IDEAS IN MOTION — IDEAS IN MOTION —</span>
        </div>
      </section>

      <div className="ticker" aria-label="Our motto"><div>MAKE • BREAK • LEARN • REPEAT</div></div>

      <section className="about-sector" id="about">
        <div className="about-sector-intro" data-reveal="left">
          <p className="about-sector-kicker"><span /> SECTOR.ORIGIN</p>
          <h2>ABOUT<br /><em>ENIGMA.</em></h2>
          <div className="about-sector-copy">
            <p className="about-sector-lead">ENIGMA is a collective of student innovators dedicated to technical excellence and creative destruction.</p>
            <p><span>[SYSTEM_MANIFESTO]:</span> We believe in creating an environment where high-intensity technology meets radical creativity, empowering the next generation of builders.</p>
          </div>
        </div>
        <div className="about-sector-grid">
          <article className="about-sector-card" data-reveal="scale">
            <span className="about-sector-number">01</span><span className="about-sector-icon"><Lightbulb size={27} /></span>
            <h3>TECH INNOVATION</h3><p>Fostering creative solutions and cutting-edge technological advancement in a raw technical environment.</p>
          </article>
          <article className="about-sector-card" data-reveal="scale">
            <span className="about-sector-number">02</span><span className="about-sector-icon"><UsersRound size={27} /></span>
            <h3>CORE COMMUNITY</h3><p>Building a collaborative network of passionate tech enthusiasts and technical rebels.</p>
          </article>
          <article className="about-sector-card" data-reveal="scale">
            <span className="about-sector-number">03</span><span className="about-sector-icon"><Trophy size={27} /></span>
            <h3>MISSION EXCELLENCE</h3><p>Striving for technical mastery and professional development through rigorous missions.</p>
          </article>
          <article className="about-sector-card about-sector-card--mission" data-reveal="scale">
            <h3>MISSION.LOG</h3><p>To empower students with the knowledge and community needed to excel in technical innovation.</p>
            <span className="about-sector-help" aria-hidden="true"><CircleHelp size={34} /></span>
          </article>
        </div>
      </section>

      <section className="events section-wrap" id="events">
        <div className="section-kicker"><span>03 / COMING UP</span><a href="#join">ALL EVENTS <ArrowUpRight size={15} /></a></div>
        <div className="section-heading section-heading--events" data-reveal="up"><h2>Save your<br /><span>spot.</span></h2><p>GOOD PEOPLE. BIG IDEAS.<br />NO EXPERIENCE REQUIRED.</p></div>
        <div className="event-list">{events.map((event, index) => <a className="event-card" data-reveal="left" href={event.url} key={`${event.day}-${event.title}`}>
          <span className={`event-date event-date--${index}`}><b>{event.day}</b><small>{event.month}</small></span>
          <span className="event-info"><small>{event.type}</small><strong>{event.title}</strong><span>{event.time}</span></span><span className="event-arrow"><ArrowUpRight size={19} /></span>
        </a>)}{eventsLoaded && events.length === 0 && <p className="empty-events">{eventsError ? 'EVENT LIST UNAVAILABLE. PLEASE CHECK BACK SOON.' : 'UPCOMING EVENT DETAILS WILL BE ANNOUNCED HERE.'}</p>}</div>
        <div className="archive-heading" data-reveal="up"><span>ARCHIVE OF COMPLETED OPERATIONS AND TECHNICAL DEPLOYMENTS.</span><h3>PAST MISSIONS.</h3></div>
        <div className="archive-grid">{pastMissions.map((mission) => <article className="archive-card" data-reveal="scale" key={mission.title}>
          <span className="archive-status">MISSION COMPLETE</span><img className="archive-image" src={mission.image} alt={`${mission.title} event`} loading="lazy" decoding="async" /><h4>{mission.title}</h4><p>{mission.description}</p><small>{mission.date} &nbsp;·&nbsp; {mission.venue}</small>
          {mission.gallery && <div className="mission-gallery" aria-label="Innovation Duel 2025 photo gallery">{mission.gallery.map((image) => <img key={image} src={image} alt="Innovation Duel 2025 event gallery photo" loading="lazy" decoding="async" />)}</div>}
        </article>)}</div>
      </section>

      <section className="operatives section-wrap" id="operatives">
        <div className="section-kicker"><span>05 / THE OPERATIVES</span><span>CORE COMMUNITY</span></div>
        <div className="section-heading" data-reveal="up"><h2>The people<br />behind the <span>signal.</span></h2><p>Core unit responsible for technical rebellion<br />and deployment of innovative solutions.</p></div>
        <div className="operative-grid">{operatives.map((person, index) => <article className="operative-card" data-reveal="scale" key={person.id}>
          <div className={`operative-art operative-art--${index % 4}`} aria-hidden="true"><img src={person.image} alt="" loading="lazy" decoding="async" /></div>
          <div className="operative-details"><span>{person.role}</span><h3>{person.name}</h3><p>{person.bio}</p></div>
        </article>)}</div>
        <a className="inline-link operative-contact" href="#contact">CONTACT THE CLUB <ArrowUpRight size={15} /></a>
      </section>

      <section className="community" id="community">
        <div className="community-art" data-reveal="left" aria-hidden="true"><div className="community-sun" /><span className="community-star">✳</span><strong>COME AS<br />YOU ARE<span>.</span></strong><small>CURIOUS LOOKS GOOD ON YOU.</small></div>
        <div className="community-copy" data-reveal="right"><div className="section-kicker"><span>04 / FIND YOUR PEOPLE</span></div><h2>Bring your<br />kind of <span>curious.</span></h2><p>You don’t need a perfect idea or a head start in code. Bring a question, a half-formed thought, or just yourself. There’s a place for you here.</p><a className="button button--dark" href="#join">MEET YOUR COMMUNITY <ArrowRight size={17} /></a><div className="community-foot"><span>ALL YEARS. ALL SKILL LEVELS.</span><span>JUST SHOW UP.</span></div></div>
      </section>

      <section className="join section-wrap" id="join">
        <div className="section-kicker"><span>07 / YOUR MOVE</span><span>JAIN UNIVERSITY | ENIGMA TECH CLUB</span></div>
        <div className="join-main" data-reveal="up"><div><p className="join-eyebrow"><Sparkles size={15} /> YOUR NEXT CHAPTER</p><h2>Wonder<br />what’s <span>next?</span></h2></div><div className="join-copy"><p>Get the good stuff: upcoming events, project calls and the occasional “you have to see this.”</p><form className="join-form" onSubmit={join}><label className="sr-only" htmlFor="email">Your email address</label><input id="email" type="email" placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} required /><button type="submit" aria-label="Subscribe"><ArrowRight size={19} /></button></form><small className="form-message" aria-live="polite">{joinMessage}</small></div></div>
      </section>

      <section className="contact section-wrap" id="contact">
        <div className="section-kicker"><span>06 / SECURE UPLINK</span><span>ENIGMA SECURITY PROTOCOL: ENCRYPTED</span></div>
        <h2>Let’s make<br /><span>something happen.</span></h2>
        <p>Establish a direct connection for technical inquiries or collaboration requests.</p>
        <div className="contact-grid" data-reveal="up">
          <a href="mailto:enigmaclub5@gmail.com"><small>UPLINK.EMAIL</small><strong>enigmaclub5@gmail.com</strong><span>EMAIL THE CLUB <ArrowUpRight size={15} /></span></a>
          <a href="tel:+919696724664"><small>COMMS.DIRECT</small><strong>+91 96967 24664</strong><span>CALL THE CLUB <ArrowUpRight size={15} /></span></a>
          <a href="https://www.google.com/maps/search/?api=1&query=JCVR%2B27P%2C%20Karnataka%20562112" target="_blank" rel="noreferrer"><small>BASE.LOC</small><strong>JCVR+27P, Karnataka 562112</strong><span>OPEN MAP <ArrowUpRight size={15} /></span></a>
        </div>
      </section>
    </main>

    <footer className="site-footer"><Brand footer /><span className="footer-motto">KEEP WONDERING.</span><nav className="footer-socials" aria-label="Social media"><a href="https://chat.whatsapp.com/KUe221OJGsd63Hs5grwUMS" target="_blank" rel="noopener noreferrer" aria-label="Join Enigma on WhatsApp" title="WhatsApp"><MessageCircle size={19} aria-hidden="true" /></a><a href="https://www.instagram.com/ju_enigma/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Follow Enigma on Instagram" title="Instagram"><Instagram size={19} aria-hidden="true" /></a></nav><nav className="footer-links" aria-label="Footer"><a href="#about">ABOUT</a><a href="#events">EVENTS</a><a href="mailto:enigmaclub5@gmail.com">SAY HELLO <ArrowUpRight size={13} /></a></nav><small className="copyright">© 2026 ENIGMA CLUB</small></footer>
    {authOpen && <AuthPanel onClose={() => setAuthOpen(false)} user={user} onUserChange={setUser} />}
  </>;
}
