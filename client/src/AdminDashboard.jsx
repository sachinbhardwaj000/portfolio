import { useEffect, useState } from 'react';
import { ArrowLeft, LogOut, Plus, Pencil, Trash2, Inbox, FolderKanban, RefreshCw, CheckCircle2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const emptyProject = {title:'',description:'',technologies:'',liveUrl:'',githubUrl:'',featured:false,order:0};

export default function AdminDashboard(){
  const [token,setToken]=useState(()=>localStorage.getItem('portfolio-admin-token')||'');
  const [username,setUsername]=useState(()=>localStorage.getItem('portfolio-admin-user')||'');
  const [credentials,setCredentials]=useState({username:'',password:''});
  const [tab,setTab]=useState('projects');
  const [projects,setProjects]=useState([]);
  const [messages,setMessages]=useState([]);
  const [editing,setEditing]=useState(null);
  const [project,setProject]=useState(emptyProject);
  const [notice,setNotice]=useState('');
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);

  async function request(path,options={}){
    const response=await fetch(API+path,{...options,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...(options.headers||{})}});
    const data=await response.json().catch(()=>({message:'Unexpected server response'}));
    if(!response.ok) throw new Error(data.message||'Request failed');
    return data;
  }
  async function loadData(){
    setBusy(true);setError('');
    try{
      const [p,m]=await Promise.all([request('/projects'),request('/admin/messages')]);
      setProjects(p);setMessages(m);
    }catch(e){setError(e.message);}
    finally{setBusy(false);}
  }
  useEffect(()=>{if(token) loadData();},[token]);
  function logout(){localStorage.removeItem('portfolio-admin-token');localStorage.removeItem('portfolio-admin-user');setToken('');setUsername('');setProjects([]);setMessages([]);}
  async function login(e){
    e.preventDefault();setBusy(true);setError('');
    try{const data=await request('/admin/login',{method:'POST',body:JSON.stringify(credentials)});localStorage.setItem('portfolio-admin-token',data.token);localStorage.setItem('portfolio-admin-user',data.username);setUsername(data.username);setToken(data.token);}
    catch(e){setError(e.message);}
    finally{setBusy(false);}
  }
  function startEdit(item){setEditing(item._id);setProject({...item,technologies:(item.technologies||[]).join(', ')});setNotice('');setError('');window.scrollTo({top:0,behavior:'smooth'});}
  function resetEditor(){setEditing(null);setProject(emptyProject);}
  async function saveProject(e){
    e.preventDefault();setBusy(true);setError('');setNotice('');
    const payload={...project,technologies:project.technologies.split(',').map(x=>x.trim()).filter(Boolean),order:Number(project.order)||0};
    try{
      await request(editing?'/admin/projects/'+editing:'/admin/projects',{method:editing?'PUT':'POST',body:JSON.stringify(payload)});
      setNotice(editing?'Project updated successfully.':'Project added successfully.');resetEditor();await loadData();
    }catch(e){setError(e.message);}
    finally{setBusy(false);}
  }
  async function deleteProject(id){
    if(!window.confirm('Delete this project? This cannot be undone.'))return;
    setError('');setNotice('');
    try{await request('/admin/projects/'+id,{method:'DELETE'});setNotice('Project deleted.');await loadData();}
    catch(e){setError(e.message);}
  }
  async function markRead(id){
    try{await request('/admin/messages/'+id+'/read',{method:'PATCH'});await loadData();}
    catch(e){setError(e.message);}
  }
  async function deleteMessage(id){
    if(!window.confirm('Delete this message?'))return;
    try{await request('/admin/messages/'+id,{method:'DELETE'});setNotice('Message deleted.');await loadData();}
    catch(e){setError(e.message);}
  }

  if(!token)return <main className="admin-shell"><a className="admin-back" href="/"><ArrowLeft size={17}/> Back to portfolio</a><form className="login-card" onSubmit={login}><p className="section-label">PRIVATE AREA / ADMIN</p><h1>Welcome back</h1><p className="muted">Sign in to manage your portfolio content.</p><label>Username</label><input autoComplete="username" value={credentials.username} onChange={e=>setCredentials({...credentials,username:e.target.value})} required/><label>Password</label><input type="password" autoComplete="current-password" value={credentials.password} onChange={e=>setCredentials({...credentials,password:e.target.value})} required/>{error&&<p className="admin-error">{error}</p>}<button className="btn primary admin-submit" disabled={busy}>{busy?'Signing in...':'Sign in'}</button><p className="muted admin-hint">Admin credentials are created in your MongoDB admins collection. There is no public sign-up.</p></form></main>;

  return <main className="admin-shell"><header className="admin-header"><div><a className="admin-back" href="/"><ArrowLeft size={17}/> View portfolio</a><p className="section-label">CONTROL PANEL</p><h1>Portfolio Admin</h1><p className="muted">Signed in as {username}</p></div><button className="btn secondary" onClick={logout}><LogOut size={16}/> Sign out</button></header>
    <div className="admin-tabs"><button className={tab==='projects'?'active':''} onClick={()=>setTab('projects')}><FolderKanban size={17}/> Projects ({projects.length})</button><button className={tab==='messages'?'active':''} onClick={()=>setTab('messages')}><Inbox size={17}/> Messages ({messages.length})</button><button className="refresh-btn" onClick={loadData}><RefreshCw size={16}/> Refresh</button></div>
    {error&&<p className="admin-alert error">{error}</p>}{notice&&<p className="admin-alert success"><CheckCircle2 size={17}/>{notice}</p>}
    {tab==='projects'?<div className="admin-content"><form className="admin-editor" onSubmit={saveProject}><div className="editor-heading"><h2>{editing?'Edit project':'Add a project'}</h2>{editing&&<button type="button" className="text-button" onClick={resetEditor}>Cancel edit</button>}</div><label>Project title</label><input value={project.title} onChange={e=>setProject({...project,title:e.target.value})} maxLength="100" required/><label>Description</label><textarea rows="3" value={project.description} onChange={e=>setProject({...project,description:e.target.value})} maxLength="1000" required/><label>Technologies <small>(comma separated)</small></label><input value={project.technologies} onChange={e=>setProject({...project,technologies:e.target.value})} placeholder="React, Node.js, MongoDB"/><div className="editor-two"><div><label>Live demo URL</label><input type="url" value={project.liveUrl} onChange={e=>setProject({...project,liveUrl:e.target.value})} placeholder="https://..."/></div><div><label>GitHub URL</label><input type="url" value={project.githubUrl} onChange={e=>setProject({...project,githubUrl:e.target.value})} placeholder="https://github.com/..."/></div></div><div className="editor-two"><div><label>Display order</label><input type="number" value={project.order} onChange={e=>setProject({...project,order:e.target.value})}/></div><label className="featured-check"><input type="checkbox" checked={!!project.featured} onChange={e=>setProject({...project,featured:e.target.checked})}/> Featured project</label></div><button className="btn primary" disabled={busy}>{editing?<Pencil size={16}/>:<Plus size={16}/>} {busy?'Saving...':editing?'Save changes':'Add project'}</button></form>
      <section className="admin-list"><h2>Existing projects</h2>{projects.length===0?<p className="muted">No projects yet. Add your first project using the form.</p>:projects.map(item=><article className="admin-item" key={item._id}><div><h3>{item.title}</h3><p>{item.description}</p><div className="tags">{(item.technologies||[]).map(t=><span key={t}>{t}</span>)}</div></div><div className="item-actions"><button aria-label={'Edit '+item.title} onClick={()=>startEdit(item)}><Pencil size={17}/></button><button className="danger" aria-label={'Delete '+item.title} onClick={()=>deleteProject(item._id)}><Trash2 size={17}/></button></div></article>)}</section></div>
      :<section className="admin-messages"><h2>Contact inbox</h2>{messages.length===0?<p className="muted">Your inbox is empty. New contact form submissions will appear here.</p>:messages.map(message=><article className={'message-card '+(message.read?'read':'unread')} key={message._id}><div className="message-head"><div><h3>{message.name}</h3><a href={'mailto:'+message.email}>{message.email}</a></div><time>{new Date(message.createdAt).toLocaleString()}</time></div><p>{message.message}</p><div className="message-actions">{!message.read&&<button className="text-button" onClick={()=>markRead(message._id)}>Mark as read</button>}<button className="text-button danger-text" onClick={()=>deleteMessage(message._id)}>Delete message</button></div></article>)}</section>}
    <footer className="admin-footer">Portfolio Admin · Keep your login credentials private</footer>
  </main>;
}
