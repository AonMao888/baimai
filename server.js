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
const supabase = createClient(url,key);
app.use(session({
    secret:'baimai789#@',
    resave:true,
    saveUninitialized:true,
    cookie:{secure:false,maxAge: 6000*6000*1000*9000}
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
app.get('/img/logo.png',(req,res)=>{res.sendFile(__dirname+'/assets/img/logo.png')})
app.get('/css/home.css',(req,res)=>{res.sendFile(__dirname+'/assets/css/home.css')})
app.get('/css/login.css',(req,res)=>{res.sendFile(__dirname+'/assets/css/login.css')})
app.get('/css/signup.css',(req,res)=>{res.sendFile(__dirname+'/assets/css/signup.css')})
app.get('/css/profile.css',(req,res)=>{res.sendFile(__dirname+'/assets/css/profile.css')})
app.get('/font/jojar.ttf',(req,res)=>{res.sendFile(__dirname+'/assets/font/jojar.ttf')})
app.get('/js/signup.js',(req,res)=>{res.sendFile(__dirname+'/assets/js/signup.js')})
app.get('/page/needverify.html',(req,res)=>{res.sendFile(__dirname+'/page/needverify.html')})

//render component file
app.get('/component/allpost.ejs',(req,res)=>{res.sendFile(__dirname+'/component/allpost.ejs')})
app.get('/component/homepostimg.ejs',(req,res)=>{res.sendFile(__dirname+'/component/homepostimg.ejs')})
app.get('/component/setting.ejs',(req,res)=>{res.sendFile(__dirname+'/component/setting.ejs')})
app.get('/component/viewpost.ejs',(req,res)=>{res.sendFile(__dirname+'/component/viewpost.ejs')})

//listen home page(main page)
app.get('/',checkuser,async(req,res)=>{
    const { data: { user }} = await supabase.auth.getUser();
    if(user != null){
        const {data:udb,err} = await supabase.from('user').select().eq('uid',user.id);
        if(udb){
        }else{
            const {data,erro} = await supabase.from('user').insert({
                uid:user.id,
                profile_img:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
            })
        }
    }else{
        let url = req.protocol+'://'+req.get('host')
        res.redirect(url+'/auth/login');
    }
    const {data:posts,error} = await supabase.from('post').select('*');
    const {data:me,err} = await supabase.from('user').select().eq('uid',user.id);
    res.render('main',{
        title:"BaiMai ပၢႆးမႂ်ႇ",
        des:"Create, upload and share your memories to the world with BaiMai(ပၢႆးမႂ်ႇ)",
        component:"../component/allpost.ejs",
        data:{
            posts:posts,
            me:me
        },
        db:''
    })
    console.log(me)
})

//listen view post page
app.get('/post',async(req,res)=>{res.redirect('./')})
app.get('/post/:id',async(req,res)=>{
    const {data,error} = await supabase.from('post').select().eq('id',req.params.id);
    res.render('main',{
        title:"Post | BaiMai ပၢႆးမႂ်ႇ",
        des:"What post have today..",
        component:"../component/viewpost.ejs",
        data:data,
        db:''
    })
})

//listen signup page
app.get('/auth/signup',async(req,res)=>{
    const { data: { user } } = await supabase.auth.getUser()
    if(user == null){
        
    }else{
        res.redirect(req.protocol+'://'+req.get('host'))
    }
    res.render('signup')
    console.log(user)
})

//listen login page
app.get('/auth/login',async(req,res)=>{
    const { data: { user } } = await supabase.auth.getUser()
    if(user){res.redirect(req.protocol+'://'+req.get('host'))}
    res.render('login')
})

//listen signup post request
app.post('/auth/signup',async(req,res)=>{
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
        if(req.query.next){
            return res.redirect(req.query.next);
        }else{
            let url = req.protocol+'://'+req.get('host')
            return res.redirect(url);
        }
    }
})
app.post('/auth/login',async(req,res)=>{
    const {data,error} = await supabase.auth.signInWithPassword({
        email:req.body.email,
        password:req.body.pass
    })
    if(data){
        let url = req.protocol+'://'+req.get('host')
        req.session.user = data;
        req.session.authenticated = true;
        if(req.query.next){
            return res.redirect(req.query.next);
        }else{
            return res.redirect(url)
        }
    }
})

//listen settings page
app.get('/settings',async(req,res)=>{
    let url = req.protocol+'://'+req.get('host')
    const {data,error} = await supabase.auth.getUser();
    if(data.user == null){
        res.redirect(url+'/auth/login?next=https://baimai.vercel.app');
    }else{
        res.render('main',{
            title:"Settings | BaiMai ပၢႆးမႂ်ႇ",
            des:"Settings for site and account.",
            component:"../component/setting.ejs",
            data:data,
            db:''
        })
    }
})

//listen upload page
app.get('/upload',async(req,res)=>{
    let url = req.protocol+'://'+req.get('host')
    const {data:user,error} = await supabase.auth.getUser();
    console.log(user)
    if(user.user == null){
        res.redirect(url+'/auth/login?next=https://baimai.vercel.app');
    }else{
        const {data:udb,err} = await supabase.from('user').select().eq('uid',user.user.id);
        console.log(udb)
        res.render('main',{
            title:"Add memories | BaiMai ပၢႆးမႂ်ႇ",
            des:"What memories you have today? Upload it to BaiMai ပၢႆးမႂ်ႇ",
            component:"../component/upload.ejs",
            data:user,
            db:udb
        })
    }
})

//listen data from upload post
app.post('/upload',async(req,res)=>{
    const {data,error}= await supabase.from('post').insert({
        poster_name:req.body.uname,
        poster_img:req.body.uimg,
        poster_id:req.body.uid,
        date:req.body.date,
        des:req.body.des,
        img1:req.body.img1,
        img2:req.body.img2,
        img3:req.body.img3,
        img4:req.body.img4,
        img5:req.body.img5,
        time:req.body.time
    })
    if(data){
        return res.redirect('../')
    }else{
        return res.json(error)
    }
})

//listen logout
app.get('/logout',async(req,res)=>{
    const {error} = await supabase.auth.signOut();
    req.session.destroy();
    res.json({status:'success'});
})

//listen profile page
app.get('/profile/:id',async(req,res)=>{
    const {data:profile,error} = await supabase.from('user').select().eq('uid',req.params.id);
    const {data:{user}} = await supabase.auth.getUser();
    if(user){
        res.render('profile',{
            profile:profile,
            me:user
        })
        console.log(profile);
        console.log(user)
    }else{
        return res.redirect('../../');
    }
})

app.get('/api/:type/:id',async(req,res)=>{
    let uid = req.params.id;
    let type = req.params.type;
    if(type == 'user'){
        const {data,error} = await supabase.from('user').select().eq('uid',uid);
        if(data){
            res.json(data);
        }else{
            res.json({status:'failed',msg:'No user found by this id!'})
        }
    }else if(type == 'poster'){
        const {data,error} = await supabase.from('user').select().eq('uid',uid);
        if(data){
            res.json({
                name:data[0].name,
                username:data[0].username,
                profile_img:data[0].profile_img
            });
        }else{
            res.json({status:'failed',msg:'No user found by this id!'})
        }
    }
})
app.listen(80,()=>console.log('server started with port 80'))