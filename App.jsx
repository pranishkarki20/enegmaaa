import React, { useState } from 'react'; // Enigma Club React page
import { ArrowDownRight, ArrowRight, ArrowUpRight, Menu, X, MoveUpRight, Command, Sparkles } from 'lucide-react';

const events = [
  { day: '12', month: 'OCT', title: 'Build Night: AI, but useful', type: 'WORKSHOP', time: '5:30 PM · INNOVATION LAB', color: 'lime' },
  { day: '19', month: 'OCT', title: 'The 24-hour hackathon', type: 'HACKATHON', time: '9:00 AM · MAIN AUDITORIUM', color: 'orange' },
  { day: '26', month: 'OCT', title: 'Open Source, open doors', type: 'COMMUNITY', time: '4:00 PM · ROOM 204', color: 'blue' },
];
const projects = [
  { n: '01', title: 'Campus Compass', text: 'A map made by students, for students.', tag: 'WEB · NEXT.JS', art: 'compass' },
  { n: '02', title: 'Quiet Hours', text: 'Finding the perfect place to focus.', tag: 'MOBILE · FLUTTER', art: 'quiet' },
  { n: '03', title: 'Waste Less', text: 'Making campus sustainability visible.', tag: 'DATA · PYTHON', art: 'waste' },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [joinMessage, setJoinMessage] = useState('NO SPAM. JUST SIGNAL.');
  const join = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/join/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      if (!response.ok) throw new Error('Could not submit');
      setJoinMessage('YOU’RE ON THE LIST. SEE YOU SOON.');
      setEmail('');
    } catch {
      setJoinMessage('COULDN’T CONNECT. PLEASE TRY AGAIN SOON.');
    }
  };
  return <>
    <header className="topbar"><a className="brand" href="#home" aria-label="Enigma home"><span className="brand-mark">e<span>.</span></span><span className="brand-name">ENIGMA<small>TECH CLUB · EST. 2018</small></span></a>
      <nav className={menuOpen ? 'nav open' : 'nav'}><a href="#about" onClick={()=>setMenuOpen(false)}>ABOUT</a><a href="#projects" onClick={()=>setMenuOpen(false)}>PROJECTS</a><a href="#events" onClick={()=>setMenuOpen(false)}>EVENTS</a><a href="#community" onClick={()=>setMenuOpen(false)}>COMMUNITY</a><a className="nav-join" href="#join" onClick={()=>setMenuOpen(false)}>JOIN THE CLUB <ArrowUpRight size={15}/></a></nav>
      <button className="menu-toggle" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X/> : <Menu/>}</button>
    </header>
    <main id="home">
      <section className="hero">
        <div className="hero-copy"><div className="eyebrow"><span className="pulse"/> STUDENT-LED. FUTURE-FOCUSED. <span className="eyebrow-year">[ 20—26 ]</span></div><h1>Make the<br/><span className="outline">unknown</span><br/>possible<span className="period">.</span></h1><p className="hero-desc">We’re the people who stay curious, build things that matter, and make the future a little less mysterious.</p><a className="button dark" href="#about">GET TO KNOW US <ArrowRight size={17}/></a>
          <div className="hero-note"><span className="note-line"/> A SPACE FOR THE CURIOUS<br/><span className="note-indent">AND THE “WHAT IF?” PEOPLE.</span></div>
        </div>
        <div className="hero-art" aria-label="Abstract illustration of a glowing digital portal"><div className="art-top"><span>FIG 01 / THE BEGINNING</span><span>✳</span></div><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit orbit-three"/><div className="sun-core"><span>e</span></div><div className="orbit-dot dot-a"/><div className="orbit-dot dot-b"/><div className="orbit-dot dot-c"/><div className="art-caption"><span>NO MAP.<br/>NO LIMITS.</span><ArrowDownRight size={25}/></div><div className="art-coordinate">18°31' N &nbsp; 73°51' E</div></div>
        <div className="scroll-cue"><span>SCROLL TO EXPLORE</span><ArrowDownRight size={16}/></div>
        <div className="hero-side">IDEAS IN MOTION — IDEAS IN MOTION —</div>
      </section>
      <section className="marquee" aria-label="Our motto"><div className="marquee-track">MAKE • BREAK • LEARN • REPEAT • MAKE • BREAK • LEARN • REPEAT •&nbsp;</div></section>
      <section className="intro section-pad" id="about"><div className="section-label"><span>01 / WHO WE ARE</span><span>✳</span></div><div className="intro-grid"><h2>Not just a club.<br/><span>A launchpad.</span></h2><div className="intro-copy"><p>Enigma is where ideas escape the group chat. We’re a community of makers, thinkers, tinkerers and the gloriously curious—learning by doing, building by sharing.</p><a className="text-link" href="#community">A LITTLE MORE ABOUT US <ArrowUpRight size={16}/></a></div></div><div className="stats"><div><strong>600<span>+</span></strong><small>MINDS IN THE MIX</small></div><div><strong>24</strong><small>THINGS BUILT THIS YEAR</small></div><div><strong>∞</strong><small>WAYS TO GET INVOLVED</small></div><div className="stat-stamp"><Command size={23}/><span>YOUR NEXT<br/>THING STARTS HERE</span></div></div></section>
      <section className="projects section-pad" id="projects"><div className="section-label"><span>02 / MADE HERE</span><a href="#join">EXPLORE PROJECTS <ArrowUpRight size={15}/></a></div><div className="projects-head"><h2>We make<br/>things <span>happen.</span></h2><p>Curiosity, meet code.<br/>A few things our members<br/>have brought to life.</p></div><div className="project-grid">{projects.map(p=><article className="project-card" key={p.n}><div className={`project-art ${p.art}`}><span className="project-num">{p.n} / PROJECT</span>{p.art==='compass'&&<><div className="map-grid"/><div className="map-pin">✳</div><div className="map-label">YOU ARE<br/>HERE <ArrowUpRight size={12}/></div></>}{p.art==='quiet'&&<><div className="quiet-circle"><span>shhh.</span></div><div className="quiet-spark">✳</div></>}{p.art==='waste'&&<><div className="waste-shape">↗</div><div className="waste-circle">LESS<br/>WASTE</div><span className="waste-leaf">✳</span></>}</div><div className="project-info"><div><span>{p.tag}</span><h3>{p.title}</h3><p>{p.text}</p></div><a href="#join" aria-label={`Learn about ${p.title}`}><ArrowUpRight size={18}/></a></div></article>)}</div></section>
      <section className="events section-pad" id="events"><div className="section-label"><span>03 / COMING UP</span><a href="#join">ALL EVENTS <ArrowUpRight size={15}/></a></div><div className="events-title"><h2>Save your<br/><span>spot.</span></h2><p>GOOD PEOPLE. BIG IDEAS.<br/>NO EXPERIENCE REQUIRED.</p></div><div className="event-list">{events.map(e=><a className="event-row" href="#join" key={e.day}><div className={`event-date ${e.color}`}><b>{e.day}</b><span>{e.month}</span></div><div className="event-details"><span>{e.type}</span><h3>{e.title}</h3><small>{e.time}</small></div><div className="event-arrow"><ArrowUpRight size={20}/></div></a>)}</div></section>
      <section className="community" id="community"><div className="community-art"><div className="com-sun"/><div className="com-star">✳</div><div className="com-type">COME AS<br/>YOU ARE<span>.</span></div><div className="com-bottom">CURIOUS LOOKS GOOD ON YOU.</div></div><div className="community-copy"><div className="section-label"><span>04 / FIND YOUR PEOPLE</span></div><h2>Bring your<br/>kind of <span>curious.</span></h2><p>You don’t need a perfect idea or a head start in code. Bring a question, a half-formed thought, or just yourself. There’s a place for you here.</p><a className="button dark" href="#join">MEET YOUR COMMUNITY <ArrowRight size={17}/></a><div className="community-foot"><span>ALL YEARS. ALL SKILL LEVELS.</span><span>JUST SHOW UP.</span></div></div></section>
    <section className="join section-pad" id="join"><div className="section-label"><span>05 / YOUR MOVE</span><span>ENIGMA, UNIVERSITY CAMPUS</span></div><div className="join-content"><div><span className="join-kicker"><Sparkles size={15}/> YOUR NEXT CHAPTER</span><h2>Wonder<br/>what’s <span>next?</span></h2></div><div className="join-form-wrap"><p>Get the good stuff: upcoming events, project calls and the occasional “you have to see this.”</p><form className="join-form" onSubmit={join}><label className="sr-only" htmlFor="email">Your email address</label><input id="email" type="email" placeholder="Your email address" value={email} onChange={e=>setEmail(e.target.value)} required/><button type="submit" aria-label="Subscribe"><ArrowRight size={20}/></button></form><small aria-live="polite">{joinMessage}</small></div></div></section>
    </main>
    <footer className="footer"><a className="brand footer-brand" href="#home"><span className="brand-mark">e<span>.</span></span><span className="brand-name">ENIGMA<small>TECH CLUB · EST. 2018</small></span></a><span className="footer-motto">KEEP WONDERING.</span><div className="footer-links"><a href="#about">ABOUT</a><a href="#events">EVENTS</a><a href="mailto:hello@enigmaclub.edu">SAY HELLO <MoveUpRight size={13}/></a></div><span className="copyright">© 2026 ENIGMA CLUB</span></footer>
  </>;
}
export default App;
