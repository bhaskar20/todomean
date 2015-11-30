var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');
app.use(express.static(__dirname+'/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

//API 
var ToDo = mongoose.model('ToDo',{
	text:String
});

app.get('/api/todos',function (req,res) {
	ToDo.find(function (err,todos) {
		if(err){
			res.send(err);
		}
		res.json(todos);
	});
});
app.post('/api/todos',function (req,res) {
	ToDo.create({
		text:req.body.text,
		done:false
	},function (err,todo) {
		if(err){
			res.send(err);
		}
		ToDo.find(function (err,todos) {
			if(err){
				res.send(err);
			}
			res.json(todos);
		});
	});
});

app.delete('/api/todos/:todo_id',function (req,res) {
	ToDo.remove({
		_id:req.params.todo_id
	},function (err,todo) {
		if(err){
			res.send(err);
		}
		ToDo.find(function (err,todos) {
			if(err){
				res.send(err);
			}
			res.json(todos);
		});
	});
});
//API END

// APPLICATION

app.get('*',function (req,res) {
	res.sendfile('./public/index.html');
});
// APPLICATION END


app.listen(8080);
console.log("App listening on port 8080");