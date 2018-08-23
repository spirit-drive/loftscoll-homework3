const express = require('express');
const router = express.Router();

const ctrlHome = require('../controllers/index');
const ctrlAdmin = require('../controllers/admin');
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

router.get('/', ctrlHome.get);
router.post('/', ctrlHome.send);

router.get('/admin', isAdmin, ctrlAdmin.get);
router.post('/admin/upload', isAdmin, ctrlAdmin.postUpload);
router.post('/admin/skills', isAdmin, ctrlAdmin.postSkills);

router.get('/login', ctrlLogin.get);
router.post('/login', ctrlLogin.post);

module.exports = router;