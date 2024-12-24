const router = require('express').Router();

const {
    createUser,
    userLogin,
    authentication,
    getAllTasks

} = require('../controllers/controllers');


router.post('/register', createUser);

router.post('/login', userLogin);

router.get('/tasks', authentication, getAllTasks);

module.exports = router