var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
app.use(bodyParser.json());

var state = {
    lists: {}
}

// autocomplete list for item types
app.get('/item-types', function (req, res) {
   fs.readFile( __dirname + "/mocks/" + "item-types.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data );
   });
})

// autocomplete list for item types
app.get('/lists', function (req, res) {
    console.log( state.lists );
    res.end( JSON.stringify(state.lists) );
})

// Create new list
app.post('/create-list', function (req, res) {
    console.log("create list:", req.body);
    
    var data = req.body;

    data.id = new Date().getTime();
    state.lists[data.id] = data;

    console.log("created new list:", data);
    
    res.end( JSON.stringify(data) );
})

// delete entire list
app.delete('/list/:id', function (req, res) {
    delete state.lists[req.params.id];

    console.log("deleted list:", req.params.id);
    
    res.end(JSON.stringify({
        message: "deleted successfully!"
    }));
})

// add an item to the list
app.post('/list/:id', function (req, res) {
    var data = req.body;

    try{
        state.lists[req.params.id][data.name] = data;

        console.log("added new item list:", data.name);
    }catch(e){
        console.log("Exception @ add item to list:"+e.message);
    }

    res.end(JSON.stringify(data));
})

// edit an item of the list
app.put('/list/:id', function (req, res) {
    var data =  req.body;

    state.lists[req.params.id][data.name] = data;

    console.log("edited item:", data.name);
    
    res.end(JSON.stringify(data));
})

// delete an item from the list
app.delete('/list/:id/:item', function (req, res) {
    delete state.lists[req.params.id][req.params.item]

    console.log("deleted item:", req.params.item);
    
    res.end(JSON.stringify({
        message: "Delete item successfully from the list!"
    }));
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})