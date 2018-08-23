const db = require('../models/db')();
const config = require('../config.json');
const nodemailer = require('nodemailer');
const formidable = require('formidable');
const helper = require('./helper');

module.exports.get = function (req, res) {
    const {additionProducts, skills} = db.stores.file.store;
    const msgemail = helper.flash(req.flash('msgemail'));

    res.render('index', {additionProducts, skills, msgemail});
};

module.exports.send = function (req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        if (err) return next(err);

        const {name, email, message} = fields;

        // просим наличия имени, обратной почты и текста
        if (!name || !email || !message) {
            // если что-либо не указано - сообщаем об этом
            req.flash('msgemail', 'Все поля нужно заполнить!');
            return res.redirect('/');
        }

        //инициализируем модуль для отправки писем и указываем данные из конфига
        const transporter = nodemailer.createTransport(config.mail.smtp);
        const dateTime = (new Date()).toLocaleString('ru-Ru');
        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: config.mail.smtp.auth.user,
            subject: config.mail.subject,
            text: `${message.trim().slice(0, 500)}\n ${dateTime}\n Отправлено с: <${email}>`
        };
        // отправляем почту
        transporter.sendMail(mailOptions, function(error) {
            // если есть ошибки при отправке - сообщаем об этом
            if (error) {
                req.flash('msgemail', `При отправке письма произошла ошибка!: ${error}`);
                return res.redirect('/');
            }

            // Записываем в базу данных на всякий случай
            const mails = helper.array(db.stores.file.store.mails);
            mails.push({...fields, dateTime});
            db.set('mails', mails);
            db.save();

            // Важно! Сейчас работать не будет, т.к. я убрал данные авторизации, но письма приходят, все работает
            req.flash('msgemail', 'Письмо успешно отправлено');
            res.redirect('/');
        });
    });
};