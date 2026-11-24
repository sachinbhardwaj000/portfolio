import { useEffect, useState } from 'react';
import { Github, Linkedin, Mail, Menu, Moon, Sun, ArrowUpRight, Code2, GraduationCap, MapPin, Send, X } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const fallbackProjects = [
  { _id:'amazon', title:'Amazon Clone', description:'A responsive e-commerce interface with product browsing and cart-focused UI.', technologies:['React','Node.js','MongoDB','CSS3'], liveUrl:'#', githubUrl:'#', featured:true },
  { _id:'github', title:'GitHub Clone', description:'A developer dashboard inspired by repository and profile interfaces.', technologies:['HTML5','CSS3','JavaScript'], liveUrl:'#', githubUrl:'#', featured:true },
  { _id:'task-manager', title:'MERN Task Manager', description:'A full-stack task management application with authentication and CRUD workflows.', technologies:['MongoDB','Express','React','Node.js'], liveUrl:'#', githubUrl:'#', featured:true }
];
const skills = ['HTML5','CSS3','JavaScript (ES6+)','React.js','Node.js','Express.js','MongoDB','REST APIs','Git & GitHub'];

export default function App() {
  const [theme,setTheme] = useState(() => localStorage.getItem('portfolio-theme') || 'dark');
  const [menuOpen,setMenuOpen] = useState(false);
  const [projects,setProjects] = useState(fallbackProjects);
  const [form,setForm] = useState({name:'',email:'',message:''});
  const [status,setStatus] = useState('');
  const [sending,setSending] = useState(false);

  useEffect(() => { document.documentElement.dataset.theme=theme; localStorage.setItem('portfolio-theme',theme); },[theme]);
  useEffect(() => {
    fetch(`${API}/projects`).then(r => { if(!r.ok) throw new Error('API unavailable'); return r.json(); })
      .then(data => { if(Array.isArray(data) && data.length) setProjects(data); }).catch(() => {});
  },[]);
  const update = e => setForm({...form,[e.target.name]:e.target.value});
  async function submit(e) {
    e.preventDefault(); setSending(true); setStatus('');
    try {
      const response = await fetch(`${API}/contact`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
      const data = await response.json();
      if(!response.ok) throw new Error(data.message || 'Could not send message');
      setStatus('Thanks! Your message has been sent successfully.'); setForm({name:'',email:'',message:''});
    } catch(error) { setStatus(error.message || 'Server unavailable. Please try again later.'); }
    finally { setSending(false); }
  }

  return <div className="app">
    <header className="navbar"><a className="logo" href="#home">&lt;Sachin/&gt;</a>
      <nav className={menuOpen?'nav-links open':'nav-links'}>{['Home','About','Skills','Projects','Contact'].map(item=><a key={item} onClick={()=>setMenuOpen(false)} href={'#'+item.toLowerCase()}>{item}</a>)}</nav>
      <div className="nav-actions"><button className="icon-btn" aria-label="Toggle theme" onClick={()=>setTheme(theme==='dark'?'light':'dark')}>{theme==='dark'?<Sun/>:<Moon/>}</button><button className="icon-btn menu-btn" aria-label="Toggle navigation" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X/>:<Menu/>}</button></div>
    </header>

    <main>
      <section className="hero" id="home"><div className="hero-grid"></div><div className="hero-inner">
        <div><p className="eyebrow">// full-stack developer</p><h1>Hi, I'm <span className="gradient">Sachin</span></h1>
          <p className="lead">I build responsive web experiences with <span className="cyan">HTML, CSS, JavaScript and the MERN stack.</span></p>
          <p className="muted intro">BCA graduate passionate about building useful, accessible and scalable web applications — from interface to database.</p>
          <div className="actions"><a className="btn primary" href="#projects">Explore Projects <ArrowUpRight size={17}/></a><a className="btn secondary" href="#contact">Let's Connect</a></div>
        </div>
        <div className="terminal"><div className="terminal-top"><i></i><i></i><i></i><span>sachin@developer:~</span></div><div className="terminal-content"><p><b>$</b> whoami</p><p className="cyan">Full-Stack Developer</p><p><b>$</b> tech-stack --list</p><p className="green">MongoDB · Express · React · Node.js</p><p><b>$</b> status</p><p className="purple">Building something meaningful...</p><p><b>$</b> <span className="blink">_</span></p></div></div>
      </div></section>

      <section className="section" id="about"><p className="section-label">01 / about</p><h2>About Me</h2><div className="about-grid"><div className="about-copy"><p>I'm a web developer who enjoys turning ideas into working digital products. I use semantic HTML, modern CSS and JavaScript to create accessible interfaces, and the MERN stack to build complete web applications.</p><p>My focus is writing maintainable code, understanding how frontend and backend systems work together, and continuously improving through hands-on projects.</p></div><div className="info-list"><div className="info-card"><GraduationCap/><div><b>Education</b><span>BCA · Amity University Online</span></div></div><div className="info-card"><MapPin/><div><b>Location</b><span>Haryana, India</span></div></div><div className="info-card"><Code2/><div><b>Focus</b><span>Full-stack web development</span></div></div></div></div></section>

      <section className="section alt" id="skills"><p className="section-label">02 / skills</p><h2>Tech Stack</h2><p className="muted section-desc">Technologies I use to design, build and ship web applications.</p><div className="skills-grid">{skills.map((skill,i)=><div className="skill" key={skill}><span>0{i+1}</span>{skill}</div>)}</div></section>

      <section className="section" id="projects"><p className="section-label">03 / selected work</p><h2>Featured Projects</h2><p className="muted section-desc">A selection of projects built while learning and practising full-stack development.</p><div className="projects-grid">{projects.map(project=><article className="project-card" key={project._id}><div className="project-art"><Code2 size={34}/><span>PROJECT / {project.title.toUpperCase()}</span></div><div className="project-content"><h3>{project.title}</h3><p>{project.description}</p><div className="tags">{(project.technologies||[]).map(t=><span key={t}>{t}</span>)}</div><div className="project-actions">{project.liveUrl && project.liveUrl!=='#' && <a href={project.liveUrl} target="_blank" rel="noreferrer">Live Demo <ArrowUpRight size={15}/></a>}{project.githubUrl && project.githubUrl!=='#' && <a href={project.githubUrl} target="_blank" rel="noreferrer"><Github size={15}/> Source Code</a>}</div></div></article>)}</div></section>

      <section className="section alt" id="contact"><p className="section-label">04 / contact</p><h2>Let's Work Together</h2><p className="muted section-desc">Have an opportunity or project in mind? Send me a message.</p><div className="contact-grid"><form className="contact-form" onSubmit={submit}><label htmlFor="name">Your name</label><input id="name" name="name" value={form.name} onChange={update} placeholder="Enter your name" minLength="2" maxLength="80" required/><label htmlFor="email">Email address</label><input id="email" name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" maxLength="120" required/><label htmlFor="message">Message</label><textarea id="message" name="message" value={form.message} onChange={update} placeholder="Tell me about your idea..." rows="5" minLength="10" maxLength="3000" required/><button className="btn primary submit" disabled={sending}>{sending?'Sending...':'Send Message'} <Send size={16}/></button><p className="form-status" role="status">{status}</p></form><div className="socials"><a href="https://github.com/sachinbhardwaj000" target="_blank" rel="noreferrer"><Github/><span><b>GitHub</b><small>Explore my repositories</small></span><ArrowUpRight/></a><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer"><Linkedin/><span><b>LinkedIn</b><small>Connect professionally</small></span><ArrowUpRight/></a><a href="mailto:hello@example.com"><Mail/><span><b>Email</b><small>hello@example.com</small></span><ArrowUpRight/></a></div></div></section>
    </main>
    <footer>© {new Date().getFullYear()} Sachin. Built with React, Node.js, Express & MongoDB.</footer>
  </div>;
}