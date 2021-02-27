const mysql = require('mysql');
const express = require('express');
const cors = require('cors');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'TestPW',
    database: 'cardbase'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

const app = express();

const port = 5000;
app.listen(port, function(req, res){
    console.log(`Server listening on port: ${port}`);
})

app.use(cors());

//built-in middleware
app.use(express.urlencoded());
app.use(express.json());

//static resource delivery
//app.use('/public', express.static('public'));
//app.use('/src', express.static('src'));
app.use(express.static('dist'));

//Routing
app.get('/', function(request, response){
    response.sendFile('./dist/index.html', {root: __dirname});
});

app.get('/api/library', function(request, response){
    let id = request.query.id;
    console.log("id: "+ id);
    let sql = 'SELECT cardDescriptions.name, cards.quantity, cardDescriptions.imagePath, cardDescriptions.rarity, cardDescriptions.cost FROM cards ' +
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
            response.send('This user has no cards.');
        }			
    });
});

app.get('/api/packCount', function(request, response){
    let id = request.query.id;
    console.log("id: "+ id);
    let sql = 'SELECT accounts.packCount ' +
    'FROM accounts ' +
    'WHERE accounts.Id = ?'
    connection.query(sql, [id], function(error, results, fields) {
        if (results.length > 0) {
            let count = JSON.parse(JSON.stringify(results));
            response.send(count);
        } else {
            response.send('This username does not exist.');
        }			
    });
});

app.get('/api/deck', function(request, response){
    let id = request.query.id;
    console.log("id: "+ id);
    let sql = 'SELECT cardDescriptions.name, cards.quantity, cards.reservedQuantity, cardDescriptions.imagePath, cardDescriptions.rarity, cardDescriptions.cost, cardDescriptions.color FROM cards ' +
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
            response.send('This user has no cards');
        }			
    });
});

app.get('/api/packs', function(request, response){
    let id = request.query.id;
    console.log("id: "+ id);

    let rarities = [];
    let commonCards = [];
    let rareCards = [];

    connection.query(
        'SELECT id, name, rarity, imagePath FROM cardDescriptions WHERE enabled = true;', function(error, results, fields) {
            if (results.length > 0) {
                rarities = JSON.parse(JSON.stringify(results));

                //4 commons per pack, 1 uncommon or rare, uncommons are twice as common as rares
                for (let i = 0; i < rarities.length; i++){
                    let card = rarities[i]
                    if (card.rarity === 'COMMON'){
                        commonCards.push(card)
                    }
                    else if (card.rarity === 'UNCOMN'){
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
                            });
                        } else {
                            console.log ( id + ':' + collatedArray[j].id +  ':' + collatedArray[j].count);
                            let sql = 'INSERT INTO cards (userId, cardDescriptionId, quantity, reservedQuantity) VALUES (?, ?, ?, 0);';
                            connection.query( sql,[parseInt(id),collatedArray[j].id, collatedArray[j].count], function(error, results, fields) {
                                if (error) throw error;
                                console.log("card(s) inserted");		
                            });
                        }
                    });   
                }

                let sql = 'UPDATE accounts SET packCount = packCount - 1 ' 
                        + 'WHERE  accounts.id = ? AND accounts.packCount > 0 ;';
                connection.query( sql, [parseInt(id)], function(error, results, fields) {
                    //update cardcount
                    if (error) throw error;
                    console.log("card total updated");		
                });   

            } else {
                console.log('Cannot access the cardDescriptions table.');
                response.send('Cannot access the cardDescriptions table.');
            }			
    });
});

//Authorization
app.post('/api/login', function(request, response){
    let username = request.body.username;
    if (username) {
        connection.query('SELECT id FROM accounts WHERE username = ?', [username], function(error, results, fields) {
			if (results.length > 0) {
                let idObject = JSON.parse(JSON.stringify(results[0]));
				response.send(idObject);
			} else {
				response.send('This username does not exist.');
			}			
		});
	} else {
		response.send('Please enter username.');
    }
})

//Saving Changes to the Deck
app.post('/api/saveDeck', function(request, response){
    let id = request.body.params.id;
    let cardsToUpdate = request.body.params.cards;
    
    if (id) {
        for (cardToUpdate of cardsToUpdate){
            let cardName = cardToUpdate.name;
            let reservedQuantity = cardToUpdate.reserved;
            console.log(id + ":" + cardName + ":" + reservedQuantity);
            let sql = 'UPDATE cards '
                    + 'INNER JOIN cardDescriptions ' 
                    + 'ON cardDescriptions.id = cards.cardDescriptionId '
                    + 'SET cards.reservedQuantity = ? '
                    + 'WHERE cards.userId = ? AND cardDescriptions.`name` = ?; '
    
            connection.query( sql, [reservedQuantity, parseInt(id), cardName ], function(error, results, fields) {
                if (error) throw error;
                console.log("reserved quantity updated");		
            });
        }
	} else {
		response.send('Trying to update deck without a valid ID');
    }
})

app.get('/home/:id', function(req, res){
    const id = req.params.id;
    res.send('Hello User Number: ' + id);
});

app.get('*', function(request, response){
    response.sendFile('./dist/index.html', {root: __dirname});
});

// 404 Page
app.use(function (request, response){
    response.status(404).sendFile('./404.html', {root: __dirname});
});

// Choose a random element of an array
function chooseRandom(in_array){
    return in_array[Math.floor(Math.random() * in_array.length)];
}

//collate entries with the same id into single entries
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
            out_array.push({'id':in_array[i].id, 'name':in_array[i].name, 'rarity':in_array[i].rarity, 'count':1, 'imagePath':in_array[i].imagePath });
        }    
    }
    return out_array;
}