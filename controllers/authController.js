const User = require('../models/userModel');

const bcrypt = require("bcryptjs");

exports.signUp = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
        const newUser = await User.create({
            username,
            password: hashedPassword,
        });
        req.session.user = newUser;

        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        })
    } catch (error) {
        res.status(400).json({
            status: "fail"
        })
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        
        if(!user) {
            res.status(404).json({
                status: "fail",
                message: 'user not found'
            });
            return;
        }

        const passwordIsCorrect = await bcrypt.compare(password, user.password);

        if(passwordIsCorrect) {
            req.session.user = user;
            res.status(201).json({
                status: 'success',  
            });
        } else {
            res.status(404).json({
                status: "fail",
                message: "incorrect username or password"
            });
        }

    } catch (error) {
        console.log("error login: ", error);
        res.status(400).json({
            status: "fail",
            message: "error"
        });
    }
}