
const TrangChu = require('./TrangChu')
const data = require('./data')
const hoso = require('./hoso')
const lichsu = require('./lichsu')


// trình tự đường dẫn là params ở cuối
const cuong = function(app){
    app.use('/trang_chu' , TrangChu)
    app.use('/data' , data)
    app.use('/hoso' , hoso)
    app.use('/lichsu' , lichsu)

}

module.exports = cuong