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
// var GET_PRODUCT_BY_ID = "SELECT a.\"Name\",b.\"PictureLink\",a.\"Description\",a.\"NumbPlayers\",\n\
// a.\"IdealNumbPlayers\",a.\"TimePlay\",a.\"Age\",a.\"Price\" \n\
// FROM \"Product\" a, \"Picture\" b WHERE b.\"ID\" = a.\"PictureID\" AND a.\"ID\"=";


var GET_PRODUCT_BY_ID = "SELECT a.\"ID\", a.\"Name\",a.\"PictureID\",a.\"Description\",a.\"NumbPlayers\",\n\
a.\"IdealNumbPlayers\",a.\"TimePlay\",a.\"Age\",a.\"Price\" \n\
FROM \"Product\" a WHERE a.\"ID\"=";
var GET_PRODUCT_BY_CATEGORYID = "SELECT a.\"ID\", a.\"Name\",a.\"PictureID\",a.\"Description\",a.\"NumbPlayers\",\n\
a.\"IdealNumbPlayers\",a.\"TimePlay\",a.\"Age\",a.\"Price\" \n\ FROM \"Product\" a, \"ProductCategory\" b WHERE a.\"ID\" = b.\"ProductID\" AND  b.\"CategoryID\"=";
var GET_CATEGORY_BY_ID = "";
var GET_ALL_CATEGORY = "SELECT c.* FROM \"Category\" c";
var SEE_ALL_TABLE = "SELECT table_name FROM information_schema.tables WHERE table_type='BASE TABLE' AND table_schema='public'";
var GET_USER_BY_USERNAME = "SELECT a.\"Username\", a.\"Password\" FROM \"Account\" a WHERE a.\"Username\" = ";
var GET_CUSTOMER_BY_USERNAME = "  SELECT c.\"Username\" , c.\"Id\", c.\"Name\",c.\"DayOfBirth\",c.\"Address\",c.\"PhoneNumber\",\n\
c.\"Username\" FROM \"Customer\" c, \"Account\" a WHERE c.\"Username\" = a.\"Username\" AND  c.\"Username\"=";

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
 var products = [];
    db.manyOrNone(GET_PRODUCT_BY_ID+req.query.id).then(function (row) {
        for (var i = 0; i < row.length; i++) {
            var product={"id": row[i].ID.toString(),"name": row[i].Name, "description":row[i].Description,"numplayer":row[i].NumbPlayers,
            "idealNumbPlayers":row[i].IdealNumbPlayers,"timePlay":row[i].TimePlay,"age":row[i].Age,"price":row[i].Price};
            products.push(product);
        }
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHeader(200, {'Content-type': "Application/json"});
        res.write(JSON.stringify(products));
        res.end();
    }).catch(function (error) {
        console.log(error);
    });
});
app.get("/getAllCategory", function (req, res) {
    db.manyOrNone(GET_ALL_CATEGORY).then(function (row) {
        var categories = [];
        for (var i = 0; i < row.length; i++) {
            var cate={"id": row[i].ID.toString(), "name": row[i].CategoryName};
            categories.push(cate);
        }
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHeader(200, {'Content-type': "Application/json"});
        res.write(JSON.stringify(categories));
        res.end();
    }).catch(function (error) {
        console.log(error);
    });

});

app.get("/getProductByCategoryID", function (req, res) {
    console.log("" + GET_PRODUCT_BY_CATEGORYID);
    db.manyOrNone(GET_PRODUCT_BY_CATEGORYID + req.query.id).then(function (row) {
        var products = [];
        for (var i = 0; i < row.length; i++) {
            var product={"id": row[i].ID.toString(),"name": row[i].Name, "description":row[i].Description,"numplayer":row[i].NumbPlayers, "idealNumbPlayers":row[i].IdealNumbPlayers,"timePlay":row[i].TimePlay,"age":row[i].Age,"price":row[i].Price};
            products.push(product);
        }
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHeader(200, {'Content-type': "Application/json"});
        res.write(JSON.stringify(products));
        res.end();
    }).catch(function (error) {
        console.log(error);
    });

});

app.get("/getUserByUsername", function (req, res) {
    console.log("" + GET_USER_BY_USERNAME +"'"+req.query.id.toString()+ "'");
 var users = [];
    db.manyOrNone(GET_USER_BY_USERNAME+ req.query.id).then(function (row) {
        for (var i = 0; i < row.length; i++) {
            var user={"username": row[i].Username,"password": row[i].Password};
            users.push(user);
        }
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHeader(200, {'Content-type': "Application/json"});
        res.write(JSON.stringify(users));
        res.end();
    }).catch(function (error) {
        console.log(error);
    });
});

app.get("/getCustomerByUsername", function (req, res) {
    console.log("" + GET_CUSTOMER_BY_USERNAME +"'"+req.query.id.toString()+ "'");
 var users = [];
    db.manyOrNone(GET_CUSTOMER_BY_USERNAME+req.query.id).then(function (row) {
        for (var i = 0; i < row.length; i++) {
            var user={"id": row[i].Id.toString(),"name": row[i].Name,"dayOfBirth": row[i].DayOfBirth.toString(),"address": row[i].Address,
            "phone": row[i].PhoneNumber,"username": row[i].Username};
            users.push(user);
        }
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHeader(200, {'Content-type': "Application/json"});
        res.write(JSON.stringify(users));
        res.end();
    }).catch(function (error) {
        console.log(error);
    });
});
// - - - - - - - - - - - - - Handle Post Method - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - Server - - - - - - - - - - - - - - - - - - - - - 
var server = app.listen(process.env.PORT || 8080, function () {
    console.log('listening on ' + server.address().port);
});
