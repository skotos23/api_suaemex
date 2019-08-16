const router = require('express').Router();
const user = require('../models/users');
const passport = require('passport');
router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/documents',
    failureRedirect: '/users/signin',
    failureFlash: true
}));
router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});
router.post('/users/signup', async (req, res) => {
    const {name, firstName, lastName, email, password, confirm_password} = req.body;
    const errors = [];
    if (!name && !firstName && !lastName && !email && !password && !confirm_password) {

        errors.push({text: 'hay datos faltantes'});
    }
    if (password !== confirm_password) {
        errors.push({text: 'La contraseña no coincide'});
    }
    if (password.length < 4) {
        errors.push({text: 'contraseña muy corta, minimo 4 caracteres'});

    }
    if (errors.length > 0) {
        res.render('users/signup', {errors, name, firstName, lastName, email, password, confirm_password});
    } else {
        const emailUser = await user.findOne({email: email});
        if (emailUser) {
            res.redirect('/users/signup');
            req.flash('success_msg', 'El correo electronico ya esta registrado');

        } else {
            const nuevo_usuario = new user({name, firstName, lastName, email, password});
            nuevo_usuario.password = await nuevo_usuario.encryptPassword(password);
            await nuevo_usuario.save();
            req.flash('success_msg', 'estas registrado');
            res.redirect('/users/signin');
        }
    }
});
router.get('/users/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
});


module.exports = router;