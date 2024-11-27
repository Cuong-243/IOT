const mysql_connected = require('./mysql/mysql_controller')
const client = require('./mqtt/mqtt_controller')
const { response } = require('express')

class Lichsu{
    // Post : /getdata
    getdata(req ,res){
        var limit = parseInt(10) || 10;
        var offset = (req.body.data1 - 1) * 10;

        // Khởi tạo các biến lưu điều kiện lọc
        var actions = [];
        var devices = [];

        if(req.body.data2.length != 0){
            for(var i = 0; i < req.body.data2.length; i++){
                let value = req.body.data2[i];
                
                if (value === "Điều hòa") {
                    devices.push("ac");
                } else if (value === "Quạt") {
                    devices.push("fan");
                } else if (value === "Đèn") {
                    devices.push("light");
                } else if (value === "Bật") {
                    actions.push("true");
                } else if (value === "Tắt") {
                    actions.push("false");
                }
            }
        }

        mysql_connected.getConnection(function(err, connection) {
            if (err) throw err;

            // Câu SQL động dựa trên điều kiện
            let sql = `SELECT * FROM actionhistory`;
            let conditions = [];
            let values = [];

            // Thêm điều kiện action nếu có
            if (actions.length > 0) {
                conditions.push(`action IN (${actions.map(() => '?').join(', ')})`);
                values.push(...actions);
            }

            // Thêm điều kiện device nếu có
            if (devices.length > 0) {
                conditions.push(`device IN (${devices.map(() => '?').join(', ')})`);
                values.push(...devices);
            }

            // Nếu có điều kiện lọc, thêm WHERE
            if (conditions.length > 0) {
                sql += ` WHERE ` + conditions.join(' AND ');
            }

            sql += ` ORDER BY id DESC LIMIT ? OFFSET ?`;
            values.push(limit, offset);

            // Thực thi truy vấn
            connection.query(sql, values, function(err, result) {
                if (err) throw err;
                var ma_json = JSON.stringify(result);
                res.send(ma_json);
            });

            connection.release();
        });
    }
    // Post : /getdatasearch
    getdatasearch(req ,res){
        console.log(req.body.data3 + " data 3")
        console.log(req.body.data2 + " data 2")
        console.log(req.body.data1 + " data 1")
        
        var limit = parseInt(10) || 10;
        var offset = (req.body.data1 - 1) * 10;

        // Khởi tạo các biến lưu điều kiện lọc
        var actions = [];
        var devices = [];

        if(req.body.data2.length != 0){
            for(var i = 0; i < req.body.data2.length; i++){
                let value = req.body.data2[i];
                
                if (value === "Điều hòa") {
                    devices.push("ac");
                } else if (value === "Quạt") {
                    devices.push("fan");
                } else if (value === "Đèn") {
                    devices.push("light");
                } else if (value === "Bật") {
                    actions.push("true");
                } else if (value === "Tắt") {
                    actions.push("false");
                }
            }
        }

        var ok = 1;
        if(req.body.data3 === "Điều hòa"){
            ok = 0;
            if (!devices.includes("ac")) {
                devices.push("ac");
            }
        }else if(req.body.data3 === "Đèn"){
            ok = 0;
            if (!devices.includes("light")) {
                devices.push("light");
            }
        }else if(req.body.data3 === "Quạt"){
            ok = 0;
            if (!devices.includes("fan")) {
                devices.push("fan");
            }
        }else if(req.body.data3 === ""){
            ok = 0;
        }

        mysql_connected.getConnection(function(err, connection) {
            if (err) throw err;

            // Câu SQL động dựa trên điều kiện
            let sql = `SELECT * FROM actionhistory`;
            let conditions = [];
            let values = [];

            // Thêm điều kiện action nếu có
            if (actions.length > 0) {
                conditions.push(`action IN (${actions.map(() => '?').join(', ')})`);
                values.push(...actions);
            }

            // Thêm điều kiện device nếu có
            if (devices.length > 0) {
                conditions.push(`device IN (${devices.map(() => '?').join(', ')})`);
                values.push(...devices);
            }
            var daCoWhere = false;
            // Nếu có điều kiện lọc, thêm WHERE
            if (conditions.length > 0) {
                sql += ` WHERE ` + conditions.join(' AND ');
                daCoWhere = true;
            }
            if(ok === 1) {
                if(daCoWhere === true ){
                    sql += ` AND datetime LIKE ? `;
                }else{
                    sql += ` WHERE datetime LIKE ? `;
                }
                values.push(req.body.data3 + "%")
            }
            sql += ` ORDER BY id DESC LIMIT ? OFFSET ?`;
            values.push(limit, offset);

            // Thực thi truy vấn
            connection.query(sql, values, function(err, result) {
                if (err) throw err;
                var ma_json = JSON.stringify(result);
                res.send(ma_json);
            });

            connection.release();
        });
    }
}
module.exports = new Lichsu