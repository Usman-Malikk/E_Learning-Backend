const express = require('express');

const router = express.Router();

const isAuth = require('../middlewares/is-auth')

const classroomController = require('../controllers/resource');
const UploadFile = require('../middlewares/uploadFile');
const upload  = require('../middlewares/imageHandling');

router.post('/',upload.array('file'),UploadFile);

module.exports = router; 