const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const db = require('../models/db')();
const helper = require('./helper');

module.exports.get = function (req, res) {

    const msgskill = helper.flash(req.flash('msgskill'));
    const msgfile = helper.flash(req.flash('msgfile'));

    res.render('admin', {
        msgfile,
        msgskill,
        skills: db.stores.file.store['skills'] || {
            age: '',
            concerts: '',
            cities: '',
            years: ''
        }
    });
};

module.exports.postUpload = function (req, res, next) {
    const form = new formidable.IncomingForm();

    const upload = path.join('./public', 'upload');

    if (!fs.existsSync(upload)) fs.mkdirSync(upload);

    form.uploadDir = path.join(process.cwd(), upload);

    form.parse(req, function (err, fields, files) {
        if (err) return next(err);

        const valid = validation(fields, files);

        if (valid.err) {
            fs.unlinkSync(files.photo.path);
            req.flash('msgfile', valid.status);
            return res.redirect(`./`);
        }

        const fileName = path.join(upload, files.photo.name);

        fs.rename(files.photo.path, fileName, function (err) {
            if (err) {
                console.error(err);
                fs.unlinkSync(fileName);
                fs.rename(files.photo.path, fileName);
            }

            const src = fileName.substr(fileName.indexOf(path.sep));

            const {name, price} = fields;
            const additionProducts = helper.array(db.stores.file.store['additionProducts']);
            additionProducts.push({name, src, price});
            db.set('additionProducts', additionProducts);
            db.save();
            req.flash('msgfile', 'Картинка успешно загружена');
            res.redirect('./');
        });
    });
};

module.exports.postSkills = function (req, res) {
    const form = new formidable.IncomingForm();

    form.parse(req, function (err, skills, next) {
        if (err) {
            req.flash('msgskill', 'Ошибка. Счетчики не обновлены');
            res.redirect('./');
            return next(err);
        }

        db.set('skills', skills);
        db.save();
        req.flash('msgskill', 'Счетчики успешно обновлены');
        res.redirect('./');
    });
};

const validation = (fields, files) => {
    if (files.photo.name === '' || files.photo.size === 0) {
        return {status: 'Не загружена картинка!', err: true};
    }
    if (!fields.name) {
        return {status: 'Не указано описание картинки!', err: true};
    }
    if (!fields.price) {
        return {status: 'Не указана цена!', err: true};
    }
    return {status: 'Ok', err: false};
};