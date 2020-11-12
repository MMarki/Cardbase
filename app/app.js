const mysql = require('mysql');
const express = require('express');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'BigChungus420',
    database: 'cardbase'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use('/css', express.static('css'));
app.use('/images', express.static('images'));

//Serve Home
app.get('/',function(request, response){
    response.sendFile('C:/Users/marce/Desktop/Cardbase/app/index.html');
})

app.get('/home',function(request, response){
    response.sendFile('C:/Users/marce/Desktop/Cardbase/app/home.html');
})

app.get('/library',function(request, response){
    response.sendFile('C:/Users/marce/Desktop/Cardbase/app/library.html');
})

app.get('/deck',function(request, response){
    response.sendFile('C:/Users/marce/Desktop/Cardbase/app/deck.html');
})

app.get('/packs',function(request, response){
    response.sendFile('C:/Users/marce/Desktop/Cardbase/app/packs.html');
})

//Authorization
app.post('/auth', function(request, response){
    let username = request.body.username;
    if (username) {
        connection.query('SELECT * FROM accounts WHERE username = ?', [username], function(error, results, fields) {
			if (results.length > 0) {
                console.log("results!");
				response.redirect('/home');
			} else {
				response.send('This username does not exist.');
			}			
			response.end();
		});
	} else {
		response.send('Please enter username.');
		response.end();
    }
})

app.get('/home/:id', function(req, res){
    const id = req.params.id;
    res.send('Hello User Number: ' + id);
})

const port = 8080;
const hostname = '127.0.0.1';
app.listen(port, function(req, res){
    console.log(`Server running at http://${hostname}:${port}/`);
})