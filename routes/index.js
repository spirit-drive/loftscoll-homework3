const express = require('express');
const router = express.Router();

const { get: getIndex, send: sendMail } = require('../controllers/index');
const { get: getAdmin, postUpload, postSkills} = require('../controllers/admin');
const { get: getLogin, post: postLogin} = require('../controllers/login');

const isAdmin = (req, res, next) => {
    if (req.session.isAdmin) return next();
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