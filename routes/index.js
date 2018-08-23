const express = require('express');
const router = express.Router();

const { get: getIndex, send: sendMail } = require('../controllers/index');
const { get: getAdmin, postUpload, postSkills} = require('../controllers/index');
const { get: getLogin, postLogin} = require('../controllers/index');
const ctrlLogin = require('../controllers/login');

const isAdmin = (req, res, next) => {
    // если в сессии текущего пользователя есть пометка о том, что он является
    // администратором
    if (req.session && req.session.isAdmin) {
        // то всё хорошо :)
        return next();
    }
    // если нет, то перебросить пользователя на страницу введения пароля
    res.redirect('/login');
};

router.get('/', getIndex);
router.post('/', sendMail);

router.get('/admin', isAdmin, getAdmin);
router.post('/admin/upload', isAdmin, postUpload);
router.post('/admin/skills', isAdmin, postSkills);

router.get('/login', getLogin);
router.post('/login', postLogin);

module.exports = router;