import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title:{type:String,required:true,trim:true,maxlength:100},
  description:{type:String,required:true,trim:true,maxlength:1000},
  technologies:{type:[String],default:[]},
  liveUrl:{type:String,default:''},
  githubUrl:{type:String,default:''},
  featured:{type:Boolean,default:false},
  order:{type:Number,default:0}
},{timestamps:true});

const contactSchema = new mongoose.Schema({
  name:{type:String,required:true,trim:true,maxlength:80},
  email:{type:String,required:true,trim:true,lowercase:true,maxlength:120},
  message:{type:String,required:true,trim:true,maxlength:3000},
  read:{type:Boolean,default:false}
},{timestamps:true});

const adminSchema = new mongoose.Schema({
  username:{type:String,required:true,unique:true,trim:true},
  passwordHash:{type:String,required:true}
},{timestamps:true});

export const Project = mongoose.model('Project',projectSchema);
export const Contact = mongoose.model('Contact',contactSchema);
export const Admin = mongoose.model('Admin',adminSchema);