const express = require('express');
const multer = require('multer');
const multerConfig = require("./config/multer");

const AdmController = require('./controllers/AdmController');
const TeacherController = require('./controllers/TeacherController');
const StudantController = require('./controllers/StudentController');
const PostController = require('./controllers/PostController');
const CommentController = require('./controllers/CommentController');
const authController = require('./controllers/authController');
const authControllerAdm = require('./controllers/authAdmController');
const authMiddleware = require('../src/middlewares/auth');
const authAdmMiddleware = require('../src/middlewares/auth');

const routes = express.Router();


routes.post('/authenticate', authController.authenticate);

routes.post('/authenticateAdm', authControllerAdm.authenticate);

//ADM
routes.post('/adm', AdmController.create);

//TEACHER
routes.get('/teachers',  TeacherController.index);
routes.delete('/teacher/:teacherId', TeacherController.deleteById);
routes.put('/teacher/:id', authAdmMiddleware, TeacherController.updateById);
routes.post('/teacher',authAdmMiddleware, TeacherController.create);

//Studant
routes.get('/students',  StudantController.index);
routes.delete('/student/:studantId', StudantController.deleteById);
routes.put('/student/:id',  StudantController.updateById);
routes.post('/student',  multer(multerConfig).single('file'), StudantController.create);

//POST
routes.get('/posts', PostController.index);
routes.delete('/post/:id', authMiddleware,PostController.delete);
//routes.put('/teacher/:id', PostController.updateById);
routes.post('/post', authMiddleware, multer(multerConfig).single('file'), PostController.create);


//LIKE
routes.post('/post/:postId/like', PostController.like);

//COMMENT
routes.post('/post/:postId/comment', CommentController.create);


module.exports = routes;