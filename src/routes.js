const express = require('express');
const multer = require('multer');
const multerConfig = require("./config/multer");


const UserController = require('./controllers/UserController');
const PostController = require('./controllers/PostController');
const CommentController = require('./controllers/CommentController');

const authController = require('./controllers/authController');

const authMiddleware = require('../src/middlewares/auth');



const routes = express.Router();


routes.post('/authenticated', authController.authenticate);


//adm
routes.post('/adm', UserController.createAdm);


//USER
routes.get('/users',  UserController.index);
routes.delete('/user/:userId', UserController.deleteById);
routes.put('/user/:id', UserController.updateById);
routes.post('/user', UserController.create);

//POST
routes.get('/posts', PostController.index);
routes.get('/post/:id', PostController.indexById);
routes.delete('/post/:id', authMiddleware,PostController.delete);
//routes.put('/teacher/:id', PostController.updateById);
routes.post('/post', authMiddleware, multer(multerConfig).single('file'), PostController.create);

//LIKE
routes.post('/post/:id/like', authMiddleware, PostController.like);

//COMMENT
routes.post('/post/:id/comment',authMiddleware, CommentController.create);


module.exports = routes;