const mqtt = require('mqtt');
const mysql_connected = require('../mysql/mysql_controller')
const WebSocket = require('ws');

// Thông tin kết nối MQTT
const broker = 'mqtt://192.168.2.9';  // Địa chỉ IP hoặc hostname của broker
const port = 1883;                  // Cổng mặc định của broker MQTT  

// Kết nối tới broker
//const client = mqtt.connect(`${broker}:${port}`);

const username = 'cuong';      // Thay bằng tên tài khoản của bạn
const password = 'cuong243';      // Thay bằng mật khẩu của bạn

// Kết nối tới broker với tài khoản và mật khẩu
const client = mqtt.connect(`${broker}:${port}`, {
  username: username,
  password: password
});

// Kết nối tới broker MQTT
client.on('connect', () => {
  console.log('Đã kết nối tới broker MQTT');
});

// Xử lý sự kiện lỗi kết nối
client.on('error', (err) => {
    console.error('Lỗi kết nối:', err);
});

// Xử lý sự kiện kết nối thành công
client.on('connect', () => {
  // Đăng ký chủ đề
  client.subscribe('data_response', (err) => {
    if (err) {
      console.error('Lỗi khi đăng ký chủ đề:', err);
    } else {
      console.log(`Đã đăng ký chủ đề: data_response`);
    }
  });
  // Đăng ký chủ đề
  client.subscribe('data_common', (err) => {
    if (err) {
      console.error('Lỗi khi đăng ký chủ đề:', err);
    } else {
      console.log(`Đã đăng ký chủ đề: data_common`);
    }
  });
});

var dem_nhay_led = 0;
var dk_true = false;
// function laysolancanhbao(){
//   mysql_connected.getConnection(function(err, connection) {
//     if (err) throw err;
//     var sql = "select * from datasensordemo order by solancanhbao DESC limit 1 offset 0;";
//     connection.query(sql,function (err, result) {
//       dem_nhay_led = result[0].solancanhbao;
//       console.log("dem_nhay_led  " + dem_nhay_led );
//       if (err) throw err;
//     });
//     connection.release();
//   });
// }

// laysolancanhbao();
// console.log("dem_nhay_led  " + dem_nhay_led );
client.on('message', (topic, message) => {
  const now = new Date();
  const timestamp = now.toLocaleString();
  if (topic == "data_common") {
    const parsedMessage = JSON.parse(message);

    // Tạo đối tượng Date và định dạng lại
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      
      var solannhaydenleddatablas = 0; 
       if(parsedMessage.device4 > 70){
          dk_true = true;
          solannhaydenleddatablas = 1;
        }
        if(parsedMessage.device4 < 70 && dk_true == true){
          dk_true = false;
          dem_nhay_led = dem_nhay_led + 1;
          solannhaydenleddatablas = 2;
        }
        // Tạo đối tượng mới chứa dữ liệu và formattedDate
        const messageWithDate = {
          temperature: parsedMessage.temperature,
          humidity: parsedMessage.humidity,
          light: parsedMessage.light,
          datetime: formattedDate,
          device4: parsedMessage.device4,
          solannhayledcanhbao: dem_nhay_led
        };
        // Sau khi lưu thành công, gửi dữ liệu mới nhất đến tất cả các client WebSocket
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(messageWithDate));
          }
        });

    mysql_connected.getConnection(function(err, connection) {
      if (err) throw err;
      var sql = "INSERT INTO datasensordemo (temperature, humidity, light, datetime, device4,solancanhbao) VALUES (?,?,?,?,?,?);";
      connection.query(sql, [parseInt(parsedMessage.temperature), parseInt(parsedMessage.humidity), parseInt(parsedMessage.light), formattedDate, parseInt(parsedMessage.device4),solannhaydenleddatablas], function (err, result) {
        if (err) throw err;
      });
      connection.release();
    });
  }
});

// Tạo server WebSocket
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  console.log('Client đã kết nối');

  ws.on('close', () => {
    console.log('Client đã ngắt kết nối');
  });
});
module.exports =  client


// Lệnh chayj mosquitto : mosquitto -c "C:\mosquitto\mosquitto.conf"
//mosquitto_passwd -c C:/mosquitto/passwd cuong
//mosquitto_pub -h 192.168.2.9 -t ngu -m "anh đây em ơi" -u cuong -P cuong243
//mosquitto_sub -h 192.168.2.9 -t ngu -u cuong -P cuong243

// Lệnh bật led trên cmd : mosquitto_pub -h 192.168.43.169 -t data -m "{\"action\": \"true\", \"device\": \"ac\"}" -u cuong -P cuong243
//                        mosquitto_pub -h 192.168.43.169 -t data -m "{\"action\": \"true\", \"device\": \"fan\"}" -u cuong -P cuong243
//                        mosquitto_pub -h 192.168.43.169 -t data -m "{\"action\": \"true\", \"device\": \"light\"}" -u cuong -P cuong243
// Lệnh tắt led trên cmd : mosquitto_pub -h 192.168.43.169 -t data -m "{\"action\": \"false\", \"device\": \"ac\"}" -u cuong -P cuong243
//                        mosquitto_pub -h 192.168.43.169 -t data -m "{\"action\": \"false\", \"device\": \"fan\"}" -u cuong -P cuong243
//                        mosquitto_pub -h 192.168.43.169 -t data -m "{\"action\": \"false\", \"device\": \"light\"}" -u cuong -P cuong243


/* 
tính số lần cảnh báo ngày hôm nay
               Select  count(*) as solancanhbaohomnay From datasensordemo Where solancanhbao = 2 And Date(datetime) = CURRENT_DATE
tìm 10 thời điểm ánh sáng cao nhất trong hôm nay
              select light ,datetime from datasensordemo  Where DATE(datetime) = CURRENT_DATE ORDER BY light DESC limit 10 offset 0;
tìm 10 thời điểm ánh sáng thấp nhất và device4 > 50
              select light ,device4 from datasensordemo  Where device4 > 50  ORDER BY light ASC limit 10 offset 0;
Lấy bản ghi mới nhất trong bảng
              select * from datasensordemo ORDER BY id DESC limit 1 offset 0;
Tính temperature trung bình hôm nay
              select AVG(temperature) as tempertaturetoday from datasensordemo Where DATE(datetime) = CURRENT_DATE;
Lấy các bản ghi trong 7 ngày qua
              select * from datasensordemo Where datetime >= DATE_SUB(NOW(), INTERVAL 7 DAY);
Xóa các bản ghi cũ hơn 30 ngày:
              DELETE FROM datasensordemo WHERE datetime < DATE_SUB(NOW(), INTERVAL 30 DAY);
Truy vấn các bản ghi có light trong khoảng từ 200 đến 500 và device4 bằng 1:
              select light,device4  from datasensordemo Where light BETWEEN 200 and 500 and device4 = 1;
Lấy các giá trị light duy nhất trong ngày hôm nay cungf với datetime
              select DISTINCT light from datasensordemo Where DATE(datetime) = CURRENT_DATE;
Lấy ra tất cả thời điểm led cảnh báo trong ngày homo nay
              select device4 , datetime from datasensordemo Where solancanhbao = 1 and DATE(datetime) = CURRENT_DATE;
lấy ra dữ liệu ánh sáng duy nhất cùng với thời gian của nó
              SELECT light, MIN(datetime) AS datetime FROM datasensordemo GROUP BY light;
tính số lần cảnh báo ngày hôm qua
              select count(*) as solancanhbaongayhomnay from datasensordemo where DATE(datetime) = CURDATE() - INTERVAL 1 DAY and solancanhbao = 2;
*/