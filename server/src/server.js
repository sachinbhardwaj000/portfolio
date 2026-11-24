import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { Project, Contact, Admin } from './models.js';

const app=express();
const PORT=process.env.PORT || 5000;
const allowedOrigins=(process.env.CLIENT_URL || 'http://localhost:5173').split(',').map(v=>v.trim());
app.use(helmet());
app.use(cors({origin(origin,callback){if(!origin || allowedOrigins.includes(origin)) return callback(null,true); callback(new Error('Origin not allowed by CORS'));}}));
app.use(express.json({limit:'20kb'}));
app.use('/api/contact',rateLimit({windowMs:15*60*1000,limit:5,standardHeaders:true,legacyHeaders:false}));
app.use('/api/admin/login',rateLimit({windowMs:15*60*1000,limit:10,standardHeaders:true,legacyHeaders:false}));

const asyncRoute=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
const validEmail=value=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const requireAdmin=(req,res,next)=>{
  const token=req.headers.authorization?.startsWith('Bearer ')?req.headers.authorization.slice(7):null;
  if(!token) return res.status(401).json({message:'Authentication required'});
  try{req.admin=jwt.verify(token,process.env.JWT_SECRET);next();}
  catch{return res.status(401).json({message:'Invalid or expired token'});}
};

app.get('/api/health',(req,res)=>res.json({status:'ok',service:'portfolio-api'}));
app.get('/api/projects',asyncRoute(async(req,res)=>{
  const projects=await Project.find().sort({order:1,createdAt:-1}).select('-__v');
  res.json(projects);
}));
app.post('/api/contact',asyncRoute(async(req,res)=>{
  const name=String(req.body.name||'').trim();
  const email=String(req.body.email||'').trim().toLowerCase();
  const message=String(req.body.message||'').trim();
  if(name.length<2 || name.length>80 || !validEmail(email) || message.length<10 || message.length>3000)
    return res.status(400).json({message:'Please provide a valid name, email and message (10–3000 characters).'});
  await Contact.create({name,email,message});
  res.status(201).json({message:'Message saved successfully'});
}));

app.post('/api/admin/login',asyncRoute(async(req,res)=>{
  const {username,password}=req.body||{};
  if(!username || !password) return res.status(400).json({message:'Username and password are required'});
  const admin=await Admin.findOne({username:String(username).trim()});
  if(!admin || !(await bcrypt.compare(String(password),admin.passwordHash)))
    return res.status(401).json({message:'Invalid credentials'});
  if(!process.env.JWT_SECRET || process.env.JWT_SECRET.length<32) throw new Error('JWT_SECRET must contain at least 32 characters');
  const token=jwt.sign({id:admin._id,username:admin.username},process.env.JWT_SECRET,{expiresIn:'8h'});
  res.json({token,username:admin.username,expiresIn:'8h'});
}));

app.post('/api/admin/projects',requireAdmin,asyncRoute(async(req,res)=>{
  const {title,description,technologies=[],liveUrl='',githubUrl='',featured=false,order=0}=req.body||{};
  if(!title?.trim() || !description?.trim()) return res.status(400).json({message:'Title and description are required'});
  const project=await Project.create({title,description,technologies,liveUrl,githubUrl,featured,order});
  res.status(201).json(project);
}));
app.put('/api/admin/projects/:id',requireAdmin,asyncRoute(async(req,res)=>{
  const project=await Project.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
  if(!project) return res.status(404).json({message:'Project not found'});
  res.json(project);
}));
app.delete('/api/admin/projects/:id',requireAdmin,asyncRoute(async(req,res)=>{
  const project=await Project.findByIdAndDelete(req.params.id);
  if(!project) return res.status(404).json({message:'Project not found'});
  res.json({message:'Project deleted'});
}));
app.get('/api/admin/messages',requireAdmin,asyncRoute(async(req,res)=>{
  const messages=await Contact.find().sort({createdAt:-1}).select('-__v');
  res.json(messages);
}));
app.patch('/api/admin/messages/:id/read',requireAdmin,asyncRoute(async(req,res)=>{
  const message=await Contact.findByIdAndUpdate(req.params.id,{read:true},{new:true});
  if(!message) return res.status(404).json({message:'Message not found'});
  res.json(message);
}));
app.delete('/api/admin/messages/:id',requireAdmin,asyncRoute(async(req,res)=>{
  const message=await Contact.findByIdAndDelete(req.params.id);
  if(!message) return res.status(404).json({message:'Message not found'});
  res.json({message:'Message deleted'});
}));

app.use((req,res)=>res.status(404).json({message:'Route not found'}));
app.use((err,req,res,next)=>{
  console.error(err);
  if(err.name==='ValidationError') return res.status(400).json({message:'Invalid data',details:err.message});
  if(err.name==='CastError') return res.status(400).json({message:'Invalid resource id'});
  res.status(500).json({message:process.env.NODE_ENV==='production'?'Internal server error':err.message});
});

async function start(){
  if(!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');
  app.listen(PORT,()=>console.log(`Portfolio API running on port ${PORT}`));
}
start().catch(error=>{console.error('Startup failed:',error.message);process.exit(1);});