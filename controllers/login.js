const formidable = require('formidable');
const db = require('../models/db')();
const helper = require('./helper');

module.exports.get = function (req, res) {
    if (req.session.isAdmin) return res.redirect('/admin');
    const msglogin =helper.flash(req.flash('msglogin'));

    res.render('login', {msglogin});
};
module.exports.post = function (req, res) {
    let form = new formidable.IncomingForm();

    form.parse(req, function (err, admin) {
        if (err) {
            req.flash('msglogin', 'Ошибка. Вход не выполнен');
            res.redirect('./login');
            return next(err);
        }
        const {_email, _password} = db.stores.file.store.admin;
        const {email, password} = admin;
        if (email === _email && password === _password) {
            req.session.isAdmin = true;
            res.redirect('/admin');
        }
        else {
            req.flash('msglogin', 'Неверный email или пароль');
            res.redirect('./login');
        }
    });

};
