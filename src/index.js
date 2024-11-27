const express = require('express')
const app = express()
const port = 3000    
const path = require('path')
const { engine } = require ('express-handlebars')

const route = require('./route/index')
var cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use(express.json());// để parse body của request dưới dạng JSON.
app.use(express.urlencoded({ extended: true }));  // để parse dữ liệu của form và đưa vào req.body.

//Đặt đuôi handerbar thành .hbs
app.engine('hbs', engine(
    {
      extname : '.hbs',
      partialsDir: __dirname + '/view/partials/' // dùng partial
    }
));

//Chỉ định công cụ để hiện lên fontend
app.set('view engine', 'hbs');
// Chỉ định đường dẫn tới nơi lưu trữ file để hiện lên fontend
app.set('views', path.join(__dirname , 'view'));

// Chỉ định đường dẫn file tĩnh , gồm đường dẫn các file tĩnh vd : css, js, img , audio , ..
app.use(express.static(path.join(__dirname , 'public')))
 
// route/index là nơi chứa định tuyến ban đầu( route )
route(app)

// Lắng nghe
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
