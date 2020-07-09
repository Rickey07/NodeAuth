const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const multer = require('multer');
const bcrypt = require('bcrypt');
const path = require('path');
const {check , validationResult} = require('express-validator');
const passportConfig = require('../config/passport-login')(passport)
let Storage = multer.diskStorage({
    destination:(req , file ,cb) => {
        cb(null ,'public/uploads/')
    },
    filename:(req,file,cb) => {
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    }
})

let upload = multer({
    storage:Storage,
}).single('profileImage');
router.get('/login', checkNotAuth , ( req , res ) => {
    res.render('users/login' , {title: 'Login'})
})


router.get('/register',checkNotAuth , (req , res) => {
    res.render('users/register' , {title: 'Register'})
})



router.post('/register' , upload ,[check('name' , 'Name should be at least of 5 characters').isLength({min: 5}) , check('email' , 'Email is required').notEmpty()
.normalizeEmail()
.isEmail()
.custom((value , {req}) => {
    return new Promise((resolve , reject) => {
        User.findOne({email:req.body.email} , (err , user) => {
            if(err) {
                reject(new Error('Internal server Error ! Please Try after sometime'))
            }

            if(Boolean(user)) {
                reject(new Error('Email Already exists'))
            }

            resolve(true)
        })
    })
}) , check('username' , 'username is required').notEmpty() , 
check('password' , 'Min length is 6 ').isLength({min:6}) , 
check('confirmPassword' , 'Password does not match').custom((value , {req}) => value === req.body.password) , ] , async  ( req ,res ) => {
    try {
        console.log(req.body);
        let result = validationResult(req);
        let errors = result.errors;
        for(key in errors) {
            console.log(errors[key].value)
        }
        
        if(!result.isEmpty()) {
            res.render('users/register' , {errors: errors})
        } 
        
        if(req.file == undefined) {
            res.render('users/register' , {imgErr: 'Please Upload an Image'})
        }   else {

            const hashedPassword = await bcrypt.hash(req.body.password , 10);
            const newUser = await new User({
                username:req.body.username,
                password:hashedPassword,
                email:req.body.email,
                name:req.body.name,
                profileImage:req.file.filename
            }).save()
    
            res.render('users/login' , {successMsg: 'SuccessFully Registered Now You May Login !' , title:"Login"})
            
        }     

    } catch (e) {
        res.render('users/login' ,  {errorMsg: 'Internal Server Error Please Try Again Later!' , title:"Login"} );
    }
});

router.post('/login' , passport.authenticate('local' , {
    failureRedirect: '/user/login',
    successRedirect:'/members',
    failureFlash: true
}))


function checkNotAuth  (req , res , next)  {
    if(req.isAuthenticated()) {
        res.redirect('/members');
    }
    next();
}


module.exports = router;