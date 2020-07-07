const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true
    } , 
    password: {
        type: String,
        required: true,
        bcrypt: true
    } , 
    email: {
        type: String
    } ,
    name: {
        type: String,
        required: true
    } , 
    profileImage: {
        type: String
    }


});

 let User = module.exports = mongoose.model('User' , userSchema);

module.exports.createUser = async function (newUser , callBack) {
    try {
        await bcrypt.hash(newUser.password , 10 , (err , hash) => {
            if(err) {
                console.log(`Error occured at ${err}`)
            } else {
                  // Set hash password
                    newUser.password = hash
                    // Create user 
                  newUser.save(callBack);
            }
        })
    } catch (err) {
        console.log(err);
    }

}

module.exports.getUserByUserName = async (username , callBack) => {
    try {
        let query = {username: username};
        User.findOne(query , callBack)
    } catch (e) {
        console.log(`Error occured at ${e}`)
    }
}

module.exports.getUserById = async (id , callBack) => {
    try {
        User.findById(id , callBack);
    } catch (e) {
        console.log(`Error Occured at ${e}`)
    }
}

module.exports.comparePassword = async (candidatePassword , hash , callBack) => {
    try {
        bcrypt.compare(candidatePassword , hash , (err , isMatch) => {
            if (err) return callBack(err);
            callBack(null , isMatch);
        })
    } catch (err) {
        console.log(`Error Occured at ${err}`)
    }
}