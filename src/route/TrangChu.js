const express = require('express')
const router = express.Router()
const trang_chu_controller = require('../controller/trang_chu_controller')

// trình tự đường dẫn là params ở cuối
router.get('/' , trang_chu_controller.Trang_chu)

router.get('/data_chart' , trang_chu_controller.data_chart)
router.get('/page' , trang_chu_controller.Trang_chu_other)
router.post('/mqtt' , trang_chu_controller.mqtt)




module.exports = router