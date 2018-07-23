// - - - - - - - - - - - - - Declaration - - - - - - - - - - - - - - - - - - - - - - - -
var http = require('http');
var url = require('url');
var sQuerry = require('querystring');
var express = require('express');
var bodyParser = require('body-parser');
var option = {
    disconnect: function (client, dc) {
        var cp = client.connectionParameters;
        console.log("Disconnecting from database ", cp.database);
    },
    connect: function () {

    }
};
var pgPromise = require('pg-promise')(option);
var app = express();
// - - - - - - - - - - - - - Connection Config For OnlineDB - - - - - - - - - - - - - - - - - - - - - - - -
var conConfig = {
    host: 'ec2-174-129-33-29.compute-1.amazonaws.com',
    port: 5432,
    database: 'd6vunmh1nc6k56',
    user: 'hfnjvdmrwqmzmz',
    password: '190c9ee00177ef7024ba0797b4e4812c3f4cbbf0fc6f6373e4fdbc918c435985',
    ssl: true,
    poolSize: 25
};
var db = pgPromise(conConfig);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
module.exports = db;
module.exports = pgPromise;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// - - - - - - - - - - - - - - Functions - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - Variables - - - - - - - - - - - - - - - - - - - -
var GET_PRODUCT_BY_ID = "SELECT a.Name,b.PictureLink,a.Description,a.NumbPlayers,\n\
a.IdealNumbPlayers,a.TimePlay,a.Age,a.Price \n\
FROM Product a, Picture b WHERE b.ID = a.PictureID AND a.ID=${id}";
var GET_CATEGORY_BY_ID = "";
var GET_ALL_CATEGORY = "SELECT c.* FROM \"Category\" c";
var SEE_ALL_TABLE = "SELECT table_name FROM information_schema.tables WHERE table_type='BASE TABLE' AND table_schema='public'";
// - - - - - - - - - - - - - - Setting - - - - - - - - - - - - - - - - - - - - -
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// - - - - - - - - - - - - - Handle Get Method - - - - - - - - - - - - - - - - 
app.get("/", function (req, res) {
    res.writeHeader(200, {'Content-type': "text/html"});
    res.write("<meta charset='UTF-8'>");
    res.write("<h1>Hello All. Testing</h1>");
});
app.get("/getProductByID", function (req, res) {
    console.log("id:" + req.query.id);
//    console.log("id:"+req.id);
//    db.manyOrNone(GET_PRODUCT_BY_ID)
    db.manyOrNone(SEE_ALL_TABLE).then(function (row) {
        for (var i = 0; i < row.length; i++) {
            console.log(row[i].table_name);
        }
        res.end();
    }).catch(function (error) {
        console.log(error);
    });
});
app.get("/getAllCategory", function (req, res) {
    db.manyOrNone(GET_ALL_CATEGORY).then(function (row) {
        var categories = {"category": []};
        for (var i = 0; i < row.length; i++) {
            var cate = {"id": row[i].ID.toString(), "name": row[i].CategoryName};
            categories.category.push(cate);
        }
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHeader(200, {'Content-type': "Application/json"});
        res.write(JSON.stringify(categories));
        res.end();
    }
    ).catch(function (error) {
        console.log(error);
    });

});
// - - - - - - - - - - - - - Handle Post Method - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - Server - - - - - - - - - - - - - - - - - - - - - 
var server = app.listen(process.env.PORT || 8080, function () {
    console.log('listening on ' + server.address().port);
});
