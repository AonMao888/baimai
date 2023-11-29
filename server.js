const express = require('express');
const {createClient} = require('@supabase/supabase-js');
const session = require('express-session');
const ejs = require('ejs');
const app = express();
const url = 'https://jeefhhpmoiofftuddara.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZWZoaHBtb2lvZmZ0dWRkYXJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDExODEzNDUsImV4cCI6MjAxNjc1NzM0NX0.yA4mqg37Xp-JGg5_Vsg5QLbXmSdlCcH9yElFX9yhfKc';

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('views',__dirname+'/views');
app.set('view engine','ejs');
app.use(express.static('assets'));
const supabase = createClient(url,key);
app.use(session({
    secret:'baimai789#@',
    resave:true,
    saveUninitialized:true,
    cookie:{secure:false,maxAge: 600*600*1000}
}))

app.use((req,res,next)=>{
    const user = req.session.user;
    res.locals.user = user;
    next()
})

const checkuser = (req,res,next) =>{
    if(!req.session.user){
      return res.redirect('/auth/login');
    }
    next();
}

//listen css file
app.get('/css/home.css',(req,res)=>{res.sendFile(__dirname+'/assets/css/home.css')})
app.get('/css/login.css',(req,res)=>{res.sendFile(__dirname+'/assets/css/login.css')})
app.get('/css/signup.css',(req,res)=>{res.sendFile(__dirname+'/assets/css/signup.css')})

//listen home page(main page)
app.get('/',checkuser,async(req,res)=>{
    const { data: { user }} = await supabase.auth.getUser();
    if(user != null){
        console.log(user)
        console.log(user.user_metadata)
    }else{
        //res.redirect('/auth/login');
        console.log(user)
    }
    const {data:posts,error} = await supabase.from('post').select('*');
    res.render('main',{
        title:"BaiMai ပၢႆးမႂ်ႇ",
        des:"Create, upload and share your memories to the world with BaiMai(ပၢႆးမႂ်ႇ)",
        component:"../component/allpost.ejs",
        data:posts
    })
})

//listen view post page
app.get('/post',async(req,res)=>{res.redirect('./')})
app.get('/post/:id',async(req,res)=>{
    const {data,error} = await supabase.from('post').select().eq('id',req.params.id);
    res.render('main',{
        title:"Post | BaiMai ပၢႆးမႂ်ႇ",
        des:"What post have today..",
        component:"../component/viewpost.ejs",
        data:data
    })
})
//listen signup page
app.get('/auth/signup',async(req,res)=>{
    const { data: { user } } = await supabase.auth.getUser()
    if(user == null){
        
    }else{
        res.redirect('../../')
    }
    res.render('signup')
    console.log(user)
})

//listen login page
app.get('/auth/login',async(req,res)=>{
    const { data: { user } } = await supabase.auth.getUser()
    if(user){res.redirect('../../')}
    res.render('login')
})

//listen signup post request
app.post('/signup',async(req,res)=>{
    const {data,error} = await supabase.auth.signUp({
        email:req.body.email,
        password:req.body.pass,
        options:{
            data:{
                name:req.body.name,
                birth:req.body.birth,
                gender:req.body.gender
            }
        }
    });
    if(data){
        req.session.user = data;
        req.session.authenticated = true;
        res.sendFile(__dirname+'/page/needverify.html');

    }
})
app.post('/login',async(req,res)=>{
    const {data,error} = await supabase.auth.signInWithPassword({
        email:req.body.email,
        password:req.body.pass
    })
    if(data){
        req.session.user = data;
        req.session.authenticated = true;
        res.redirect('../../');

    }
})

//listen settings page
app.get('/settings',async(req,res)=>{
    const {data,error} = await supabase.auth.getUser();
    if(data.user == null){
        res.redirect('/auth/login');
    }else{
        res.render('main',{
            title:"Settings | BaiMai ပၢႆးမႂ်ႇ",
            des:"Settings for site and account.",
            component:"../component/setting.ejs",
            data:data
        })
        console.log(data)
    }
})

app.listen(80,()=>console.log('server started with port 80'))