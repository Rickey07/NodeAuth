const express = require('express');
const router = express.Router();

router.get('/' , (req , res) => {
    res.render('index' , {title: 'NodeAuth'})
})

router.get('/members' , checkAuth , (req , res) => {
    
    res.render('members/Members' , {userDetails: req.user})
})

router.delete('/logout')

function checkAuth (req , res , next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/user/login');
}

module.exports = router;