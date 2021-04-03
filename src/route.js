const express=require('express')
const router = express.Router()
// Loading User model
const USER=require('./models/user')
const auth = require('./middleware/auth')
const redirectauth = require('./middleware/redirctauth')
const randomBytes = require('random-bytes')

// HomePage
// @route GET /
router.get('/',auth,(req,res)=>{
    res.render('index')
})

router.get('/signup',redirectauth,(req,res)=>{
    res.render('signup.ejs')
})

// Dashboard
// @route GET /dashboard
router.get('/dashboard',(req,res)=>{
    res.render('dashboard.ejs')
})

//Signup page backend Setup
router.post('/signup',async (req,res)=>{
    const user=new USER(req.body)
    const checkmail= await USER.findByEMAILID(req.body.email)
    if(checkmail==true){
        console.log('user not exists')
        try{
            await user.save()
            const token=await user.generateAuthToken()
            res.clearCookie('userData',{httpOnly:true})
            res.cookie("userData", {user,token,isLoggedIn:true},{maxAge: 900000000,httpOnly:true}); 
            res.status(201).send({user,token,result:"Profile Created Successfully"})
            // sendWelcomeEmail(user.email,user.name)
        }catch(e){
            res.status(400).send({result:'Internal Server Error'})
        }
    }else{
        console.log('User esists')
        res.status(400).send({result:'Email is already linked to another account.'})
    }
})

router.post('/login',async(req,res)=>{
    try{
        const user= await USER.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()
        res.clearCookie('userData',{httpOnly:true})
        res.cookie("userData", {user,token,isLoggedIn:true},{maxAge: 900000000,httpOnly:true});     
        res.status(202).send({user,token,result:"Successfully Logged In"})
    }catch(e){
        res.status(500).send({result:'Unable to Login'})
    }
})

router.post('/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !==req.token
        })
        await req.user.save()
        res.clearCookie('userData',{httpOnly:true})
        res.status(202).send({result:'Logged Out Successfully'})
    }catch(e){
        res.status(500).send({result:"internal Server Error"})
    }
})

router.get('/forgot',redirectauth,(req, res) => {
    res.render('forgot')
})

router.post('/forgot',(req, res) => {
        USER.findOne({ email: req.body.email }, async (err, user) => {
            
            if (!user) {
                // req.flash('error', 'No account with that email address exists.');
                return res.redirect('/forgot');
            }
            randomBytes(18,(error, bytes) => {
                if (error) throw error
                var token = bytes.toString('hex');
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                user.save();    
                const mailjet = require ('node-mailjet').connect('93b23c6a910f7d395e5ca29108862de9', '5191ba8ab073a48e1f65c26ccc36076c')
                const request = mailjet
                .post("send", {'version': 'v3.1'})
                .request({
                    "Messages":[
                        {
                        "From": {
                            "Email": "2000harshgupta@gmail.com",
                            "Name": "Harsh"
                        },
                        "To": [
                            {
                            "Email": req.body.email,
                            "Name": "User"
                            }
                        ],
                        "Subject": "Greetings from Mailjet.",
                        "TextPart": 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                                    '<a href="http://' + req.headers.host + '/reset?token=' + token + '">Forgot Password Link</a>\n\n' +
                                    'If you did not request this, please ignore this email and your password will remain unchanged.\n',
                        "HTMLPart": 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n. Please click on the following link, or paste this into your browser to complete the process:\n\n http://'
                                     + req.headers.host + '/reset?token=' + token + '\n\n' +
                                    'If you did not request this, please ignore this email and your password will remain unchanged.\n',
                        "CustomID": "AppGettingStartedTest"
                        }
                    ]
                    })
                    request.then((result) => {
                        console.log(result.body)
                    }).catch((err) => {
                        console.log(err.statusCode)
                    })
            });
        })
    })

    router.get('/reset',redirectauth, function(req, res) {
        USER.findOne({ resetPasswordToken: req.query.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
              console.log(req.query)
            return res.redirect('/forgot');
          }
          res.render('reset', {
            user: req.user
          });
        });
      });
      
      router.post('/reset',(req, res) => {
        USER.findOne({ resetPasswordToken: req.query.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
                // req.flash('error', 'No account with that email address exists.');
                return res.redirect('back');
            }
            
                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                user.save();    
                const mailjet = require ('node-mailjet').connect('93b23c6a910f7d395e5ca29108862de9', '5191ba8ab073a48e1f65c26ccc36076c')
                const request = mailjet
                .post("send", {'version': 'v3.1'})
                .request({
                    "Messages":[
                        {
                        "From": {
                            "Email": "2000harshgupta@gmail.com",
                            "Name": "Harsh"
                        },
                        "To": [
                            {
                            "Email": user.email,
                            "Name": "User"
                            }
                        ],
                        "Subject": "Greetings from Mailjet.",
                        "TextPart": 'Password Changed Successfully \n',
                        "HTMLPart": "<h3>Password Changed Successfully \n</h3>",
                        "CustomID": "AppGettingStartedTest"
                        }
                    ]
                    })
                    request.then((result) => {
                        console.log(result.body)
                        res.redirect('signup')
                    }).catch((err) => {
                        console.log(err)
                        res.redirect('signup')
                    })
            })
    })



module.exports = router
