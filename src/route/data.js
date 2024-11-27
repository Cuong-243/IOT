const express = require('express')
const router = express.Router()
const trang_chu_controller = require('../controller/trang_chu_controller')
const Data_controller = require('../controller/data_controller')


// trình tự đường dẫn là params ở cuối
router.get('/' , trang_chu_controller.data)
router.post('/getdata' , Data_controller.getdata)

module.exports = router