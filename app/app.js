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

const port = 5000;
const hostname = '127.0.0.1';
app.listen(port, function(req, res){
    console.log(`Server running at http://${hostname}:${port}/`);
})

app.use(express.urlencoded());
app.use(express.json());
app.use('/css', express.static('css'));
app.use('/images', express.static('images'));
app.use('/frontend', express.static('frontend'));

//Routing
app.get('/', function(request, response){
    response.sendFile('./index.html', {root: __dirname});
});

app.get('/home', function(request, response){
    response.sendFile('./home.html', {root: __dirname});
});

app.get('/library', function(request, response){
    let id = request.query.id;
    console.log("id: "+ id);
    let sql = 'SELECT cardDescriptions.name, cards.quantity FROM cards ' +
    'INNER JOIN accounts ' +
    'ON cards.userId = accounts.id ' +
    'INNER JOIN cardDescriptions ' +
    'ON cards.cardDescriptionId = cardDescriptions.id '+
    'WHERE accounts.Id = ?'
    connection.query(sql, [id], function(error, results, fields) {
        if (results.length > 0) {
            console.log("request made");
            let card = JSON.parse(JSON.stringify(results));
            response.send(card);
        } else {
            response.send('This username does not exist.');
        }			
        response.end();
    });
    //response.sendFile('./library.html', {root: __dirname});
});

app.get('/deck', function(request, response){
    response.sendFile('./deck.html', {root: __dirname});
});

app.get('/packs', function(request, response){
    let id = request.query.id;
    console.log("id: "+ id);

    let rarities = [];
    let commonCards = [];
    let rareCards = [];

    connection.query(
        'SELECT id, name, rarity FROM cardDescriptions ', function(error, results, fields) {
            if (results.length > 0) {
                rarities = JSON.parse(JSON.stringify(results));

                for (let i = 0; i < rarities.length; i++){
                    let card = rarities[i]
                    if (card.rarity === 'COMMON'){
                        commonCards.push(card)
                    }
                    else if (card.rarity === 'UNCOMN'){
                        rareCards.push(card);
                        rareCards.push(card);
                        rareCards.push(card);
                    }
                    else if (card.rarity === 'RARE'){
                        rareCards.push(card);
                    }
                }

                let packCards = []

                packCards.push(chooseRandom(commonCards));
                packCards.push(chooseRandom(commonCards));
                packCards.push(chooseRandom(commonCards));
                packCards.push(chooseRandom(commonCards));

                packCards.push(chooseRandom(rareCards));

                console.log(packCards);
                response.send(packCards);
                response.end();

                const collatedArray = collateArray(packCards);

                for (let j = 0; j < collatedArray.length; j++){
                    //check to see if there's already an entry with a given uid and cardDescriptionId combo.
                    let sql = 'SELECT * FROM cards ' 
                            + 'WHERE  userId = ? AND cardDescriptionId = ? ;';
                    connection.query( sql, [parseInt(id), collatedArray[j].id], function(error, results, fields) {
                        //if so update that
                        if (results.length > 0) {
                            existingCard = JSON.parse(JSON.stringify(results));
                            console.log(existingCard);
                            let sql = 'UPDATE cards SET quantity = ? WHERE userId = ? AND cardDescriptionId = ? ;';
                            connection.query( sql,[collatedArray[j].count + existingCard[0].quantity, parseInt(id),collatedArray[j].id], function(error, results, fields) {
                                if (error) throw error;
                                console.log("card updated");		
                                response.end();
                            });
                        } else {
                            console.log ( id + ':' + collatedArray[j].id +  ':' + collatedArray[j].count);
                            let sql = 'INSERT INTO cards (userId, cardDescriptionId, quantity) VALUES (?, ?, ?);';
                            connection.query( sql,[parseInt(id),collatedArray[j].id, collatedArray[j].count], function(error, results, fields) {
                                if (error) throw error;
                                console.log("card(s) inserted");		
                                response.end();
                            });
                        }
                        response.end();
                    });   
                }

            } else {
                console.log('Cannot access the cardDescriptions table.');
                response.send('Cannot access the cardDescriptions table.');
            }			
    });
});

//Authorization
app.post('/auth', function(request, response){
    let username = request.body.username;
    if (username) {
        connection.query('SELECT id FROM accounts WHERE username = ?', [username], function(error, results, fields) {
			if (results.length > 0) {
                let id = JSON.parse(JSON.stringify(results[0])).id;
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

// 404 Page
app.use(function (request, response){
    response.status(404).sendFile('./404.html', {root: __dirname});
});

function chooseRandom(in_array){
    return in_array[Math.floor(Math.random() * in_array.length)];
}

function collateArray(in_array){
    let out_array = [];
    for (let i = 0; i < in_array.length; i++){
        let included = false;
        for(let j = 0; j < out_array.length; j++){
            if (out_array[j].id === in_array[i].id){
                included = true;
                //increment count
                out_array[j].count += 1;
            } 
        }
        if (!included){
            out_array.push({'id':in_array[i].id, 'name':in_array[i].name, 'rarity':in_array[i].rarity, 'count':1 });
        }    
    }
    return out_array;
}