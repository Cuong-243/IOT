const express = require('express')
const router = express.Router()
const trang_chu_controller = require('../controller/trang_chu_controller')

// trình tự đường dẫn là params ở cuối
router.get('/' , trang_chu_controller.hoso)


module.exports = router