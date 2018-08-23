const formidable = require('formidable');
const db = require('../models/db')();

module.exports.get = function (req, res) {
    if (req.session.isAdmin) return res.redirect('/admin');
    res.render('login', {msglogin: req.query.msglogin});
};
module.exports.post = function (req, res) {
    let form = new formidable.IncomingForm();

    form.parse(req, function (err, admin) {
        if (err) {
            res.redirect('./login/?msglogin=Ошибка. Вход не выполнен');
            return next(err);
        }
        const {_email, _password} = db.stores.file.store.admin;
        const {email, password} = admin;
        if (email === _email && password === _password) {
            req.session.isAdmin = true;
            res.redirect('/admin');
        }
        else {
            res.redirect('./login/?msglogin=Неверный email или пароль');
        }
    });

};
