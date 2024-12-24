const router = require('express').Router();

const {
    createUser,
    userLogin,
    authentication,
    getAllTasks,
    createTask,
    getTaskById,
    updateTask

} = require('../controllers/controllers');


router.post('/register', createUser);

router.post('/login', userLogin);

router.get('/tasks', authentication, getAllTasks);

router.post('/tasks', authentication, createTask);

router.get('/tasks/:id', authentication, getTaskById );

router.put('/tasks/:id', authentication, updateTask );

module.exports = router