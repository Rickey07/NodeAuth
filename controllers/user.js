const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const formidable = require('formidable');
const {check , validationResult} = require('express-validator');
router.get('/login' , ( req , res ) => {
    res.render('users/login' , {title: 'Login'})
})


router.get('/register' , (req , res) => {
    res.render('users/register' , {title: 'Register'})
})

router.get('/members' , (req , res) => {
    res.render('user/member' , {title:'Members'});
});

router.post('/register' , [check('name' , 'Name should be at least of 5 characters').isLength({min: 5}) , check('email' , 'Email is required').notEmpty()
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
check('confirmPassword' , 'Password does not match').custom((value , {req}) => value === req.body.password) , 
check('profileImage' , 'Profile Image cannot be empty').notEmpty()] , async  ( req ,res ) => {
    
    try {
        let results = validationResult(req);
        let errors = results.errors;
        for(key in errors) {
            console.log(errors[key].value)
        }
        
        if(!results.isEmpty()) {
            res.render('users/register' , {errors: errors})
        }

    } catch (e) {
        console.log(e);
    }
})

module.exports = router;