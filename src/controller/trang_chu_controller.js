const mysql_connected = require('./mysql/mysql_controller')
const client = require('./mqtt/mqtt_controller')
const { response } = require('express')

class Trangchu{
    // Get : /trang_chu
    Trang_chu(req ,res){
        res.render('body/bai5')
    }
    // Get : /trang_chu/page
    Trang_chu_other(req ,res){
        res.render('body/page_other')
    }
    // Get : /hoso
    hoso(req ,res){
        res.render('body/ho_so')
    }
    // Get : /data
    data(req ,res){
        res.render('body/data')
    }
    // Get : /lichsu
    lichsu(req ,res){
        res.render('body/lich_su')
    }

    // MQTT bật tắt led
    mqtt(req ,res){
        // Gửi tin nhắn MQTT
        client.publish("data", JSON.stringify(req.body), (err) => {
            console.log(JSON.stringify(req.body))
            if (err) {
                console.error('Lỗi khi gửi tin nhắn:', err);
            } else {
                console.log('Tin nhắn đã được gửi thành công!');
            }
        });
            // Xử lý tin nhắn nhận được và gửi phản hồi
            const onMessageReceived = (topic, message) => {
                console.log(`Tin nhắn nhận được từ chủ đề ${topic}: ${message}`);
                if( topic === "data_response" ){
                    try {
                        const parsedMessage = JSON.parse(message);
                        console.log(parsedMessage + "data_response");
                        res.json(parsedMessage);
                    } catch (error) {
                        console.error('Lỗi khi phân tích tin nhắn:', error);
                        res.status(500).json({ error: 'Lỗi khi phân tích tin nhắn' });
                    }
                    // Ngừng lắng nghe tin nhắn sau khi đã nhận
                    client.removeListener('message', onMessageReceived);
                }
            };

        client.on('message', onMessageReceived);
        const timestamp = new Date().toLocaleString();
        const date = new Date(timestamp);
        // Định dạng năm, tháng, ngày, giờ, phút, giây
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        // Kết hợp các phần thành định dạng 'YYYY-MM-DD HH:mm:ss'
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        mysql_connected.getConnection(function(err , connection) {
            if (err) throw err;
            var sql = "INSERT INTO actionhistorydemo (action, device, datetime) VALUES (?,?,?);" ;
            connection.query(sql,[req.body.action,req.body.device,formattedDate],function (err, result) {
                if (err) throw err;
            });
            connection.release()
        });
    }
    // MQTT data_common 
    // Get  http://localhost:3000/trang_chu/data_chart
    data_chart(req ,res){
        mysql_connected.getConnection(function(err , connection) {
            if (err) throw err;
            var sql = "SELECT * FROM datasensordemo ORDER BY id DESC LIMIT 1000 OFFSET 1" ;
            connection.query(sql,function (err, result) {
                if (err) throw err;
                var ma_json = JSON.stringify(result)
                res.send(ma_json)
            });
            connection.release()
        });
    }
}
module.exports = new Trangchu