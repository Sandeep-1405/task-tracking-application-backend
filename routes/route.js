const router = require('express').Router();

const {
    createUser,
    userLogin,
    authentication,
    getAllTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    getTaskByCategory,
    getTaskBySearchValue

} = require('../controllers/controllers');


router.post('/register', createUser);

router.post('/login', userLogin);

router.get('/tasks', authentication, getAllTasks);

router.post('/tasks', authentication, createTask);

router.get('/tasks/:id', authentication, getTaskById );

router.put('/tasks/:id', authentication, updateTask );

router.delete('/tasks/:id',authentication,deleteTask);

router.get('/category/:value',authentication,getTaskByCategory);

router.get('/search/:value',authentication,getTaskBySearchValue);

module.exports = router