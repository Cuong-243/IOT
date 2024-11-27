const express = require('express')
const router = express.Router()
const trang_chu_controller = require('../controller/trang_chu_controller')
const lich_su_controller = require('../controller/lichsu_controller')


// trình tự đường dẫn là params ở cuối
router.get('/' , trang_chu_controller.lichsu)
router.post('/getdata' , lich_su_controller.getdatasearch)


module.exports = router