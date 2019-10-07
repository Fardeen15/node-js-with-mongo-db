var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
//online db path
// var url = "mongodb+srv://fardeem:fardeen17@mydb-vsjit.mongodb.net/admin?retryWrites=true&w=majority";

//local db path
var url = "mongodb://localhost:27017/mydb"

var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(express.static('public'));
var arr = [];
app.route('/index.html').get((req, res) => {
    console.log(true)
    if (res) {
        res.send(arr)
        res.end()
        console.log('req')
    }
}).post(urlencodedParser, function (req, res) {
    var response = {
        firstname: req.body.first_name,
        lastname: req.body.last_name
    };
    arr.push(response)
    if (response) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            dbo.collection("customers").insertOne(response, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        });
    }
    // res.end()
}).put(() => {

})
app.route('/index2').get((req, res) => {
    if (res) {
        if (req.query.filter) {
            console.log(req.query.filter)
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db("mydb");
                /*Return only the documents where the address starts with an "S":*/
                var query =  {firstname: {'$regex' : req.query.filter}};
                dbo.collection("customers").find().filter(query).toArray(function (err, result) {
                    if (err) throw err;
                    console.log(query, result)
                    arr = result
                    db.close();
                });
            });
        } else {
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db("mydb");
                dbo.collection("customers").find({}).toArray(function (err, result) {
                    if (err) throw err;
                    arr = result
                    db.close();
                });
            });
        }
        res.send(arr)
        res.end()
    } else {
        console.log('error for  /index2res')
    }
})
app.route('/delete').get((req, res) => {
    if (res) {
        if (req.query.id) {
            arr.splice(req.query.index, 1)
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db("mydb");
                var obj = { firstname: req.query.id }
                console.log(obj);
                dbo.collection("customers").deleteOne(obj, function (err, obj) {
                    if (err) throw err;
                    db.close();
                });
            });
            res.send(arr)
            res.end()
        }
    } else {

        console.log('error for  /index2res')

    }
})

app.route('/edit').get((req, res) => {
    if (res) {
        var oldObj = {
            firstname: req.query.oldfname,
            lastname: req.query.oldlname
        }
        var obj = {
            firstname: req.query.firstname,
            lastname: req.query.lastname
        }
        var newobj = { $set: obj }
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            dbo.collection("customers").updateOne(oldObj, newobj, function (err, res) {
                if (err) throw err;
                console.log("1 document updated");
                db.close();
            });
        });
        console.log(req.query)
        arr.splice(req.query.index, 1, obj)
        res.send(arr)
        res.end()
    } else {
        console.log('error for  /index2res')
    }
})


var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})