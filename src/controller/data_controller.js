const mysql_connected = require('./mysql/mysql_controller')
const client = require('./mqtt/mqtt_controller')
const { response } = require('express')

class Data{
    // Post : /getdata
    getdata(req ,res){
        var sql = `SELECT * FROM datasensor`
        var limit = parseInt(10) || 10;
        var offset = (req.body.data1 - 1) * 10;
        var cuong = [];
        if(req.body.data2 !== ""){
            sql += " WHERE datetime LIKE ?";
            cuong.push(req.body.data2 + "%")
        }
        cuong.push(limit);
        cuong.push(offset);
        mysql_connected.getConnection(function(err , connection) {
            if (err) throw err;
           sql += ` ORDER BY id DESC LIMIT ? OFFSET ?`;
            connection.query(sql,cuong,function (err, result) {
                if (err) throw err;
                var ma_json = JSON.stringify(result)
                res.send(ma_json)
            });
            connection.release()
        });
    }

    
}
module.exports = new Data