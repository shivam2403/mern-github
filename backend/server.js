import express from 'express';
import userRoutes from './routes/userRoutes.js'
import exploreRoutes from './routes/exploreRoutes.js'
import authRoutes from './routes/authRoutes.js'
import dotenv from 'dotenv'
import cors from 'cors'
import connectMongoDB from './db/connectMongoDB.js';
import './passport/githubAuth.js'
import session from 'express-session';
import passport from 'passport';
import path from 'path'

dotenv.config();
const app=express();
const PORT=process.env.PORT || 5000;
const __dirname=path.resolve();
console.log('__dirname',__dirname);

app.use(session({secret:'keyboard cat', resave:false, saveUninitialized:false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());


// app.get('/',(req,res)=>{
//     res.send("Server is ready!");
// })


app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/explore',exploreRoutes);

app.use(express.static(path.join(__dirname,"/frontend/dist")))

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"frontend","dist","index.html"));
})

app.listen(PORT,()=>{
    console.log(`Server started on http://localhost:${PORT}`);
    connectMongoDB();
})