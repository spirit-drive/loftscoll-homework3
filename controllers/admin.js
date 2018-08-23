const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const db = require('../models/db')();

module.exports.get = function (req, res) {
    const {msgfile, msgskill} = req.query;
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

module.exports.postUpload = function (req, res) {
    let form = new formidable.IncomingForm();

    let upload = path.join('./public', 'upload');
    let fileName;

    if (!fs.existsSync(upload)) {
        fs.mkdirSync(upload);
    }

    form.uploadDir = path.join(process.cwd(), upload);

    form.parse(req, function (err, fields, files) {
        if (err) {
            return next(err);
        }

        const valid = validation(fields, files);

        if (valid.err) {
            fs.unlinkSync(files.photo.path);
            return res.redirect(`./?msgfile=${valid.status}`);
        }

        fileName = path.join(upload, files.photo.name);

        fs.rename(files.photo.path, fileName, function (err) {
            if (err) {
                console.error(err);
                fs.unlinkSync(fileName);
                fs.rename(files.photo.path, fileName);
            }

            let src = fileName.substr(fileName.indexOf('\\'));

            const {name, price} = fields;
            const additionProducts = db.stores.file.store['additionProducts'] ? [...db.stores.file.store['additionProducts']] : [];
            additionProducts.push({name, src, price});
            db.set('additionProducts', additionProducts);
            db.save();
            res.redirect('./?msgfile=Картинка успешно загружена');
        });
    });
};

module.exports.postSkills = function (req, res) {
    let form = new formidable.IncomingForm();

    form.parse(req, function (err, skills) {
        if (err) {
            res.redirect('./?msgskill=Ошибка. Счетчики не обновлены');
            return next(err);
        }

        db.set('skills', skills);
        db.save();
        res.redirect('./?msgskill=Счетчики успешно обновлены');
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