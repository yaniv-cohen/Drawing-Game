const express = require('express')
const app = express()
const randomWords = require('random-words');

const path = require('path');
app.use(express.json());
/////

let activeGames = [
    // {gameId: 2, playerA:{username:'yaniv', lastPing: 100}, playerB:{username:'ofri', lastPing: 150} }
]

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://yanivFast1:RkkL3xhXAmpqnEZW@drawgame.mfttuza.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(async (err) => {
    /////
    const collection = client.db("DrawGame").collection("games");
    await collection.deleteMany({})
    //serve html
    app.use(express.static('public'))

    //remember all the games that where created, 


    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, 'public/index.html'));
    });
    app.get('/words/*', function (req, res) {
        console.log('get words')
        let query = req.url.substring(req.url.indexOf('?') + 8);
        console.log(query);
        let gameId = query.split('&')[0]
        let key = query.split('&')[1]
        console.log('gameId', gameId, key);
        res.sendFile(path.join(__dirname, 'public/words.html'));
    });
    app.get('/welcome', function (req, res) {
        // console.log('welcome');
        res.sendFile(path.join(__dirname, 'public/welcome.html'));
    });
    app.get('/painter', async function (req, res) {
        let query = req.url.substring(req.url.indexOf('?') + 8);
        console.log(query);
        let gameId = query.split('&')[0]
        let key = query.split('&')[1]
        // console.log(gameId, key);
        console.log('starting setup for gameId: ' + gameId, key);
        let gameDataFromDb = await getGameDataFromDb(collection, gameId)
        console.log(gameDataFromDb);

        if (!gameDataFromDb) {
            console.log('got nothing from db');
        }
        // drawings = [...gameDataFromDb.drawings]

        //handle activeGamesPing
        let activeGame = (activeGames.find(game => game.gameId == gameDataFromDb.gameId))
        // console.log('activeGame:', activeGame)
        if (activeGame.playerA.username && activeGame.playerA.username === gameDataFromDb.userNames[0]) {
            //Open game for 1 minute
            activeGame.playerA.lastPing = new Date().getTime()
            //if guesser tried to login not more than a minute ago, start the game
            if (activeGame.playerB.lastPing > new Date().getTime() - 60000) {
                let gameStage = gameDataFromDb.gameStage
                if (gameStage === 'painting') {
                    res.sendFile(path.join(__dirname, 'public/index.html'));
                }
                else if (gameStage === 'choose-word') {
                    res.sendFile(path.join(__dirname, 'public/words.html'));

                }
                else {
                    res.send('something went wrong with gameStage', gameStage)
                }
            }
            else {
                res.sendFile(path.join(__dirname, 'public/waitingPainter.html'));
            }
        }

        //check that it updated
        let checkActiveGame = (activeGames.find(game => game.gameId == gameDataFromDb.gameId))
        console.log('checkActiveGame:', checkActiveGame)


    });
    app.get('/game/connectToGame/:gameId/:username', async function (req, res) {
        let gameId = req.params.gameId
        let username = req.params.username
        console.log('username', username, 'gameId', gameId);
        // if(username.indexOf('.'))
        // {
        //     res.sendFile(path.join(__dirname, 'public/welcome.html'));
        //     return
        // }
        let gameData = await collection.findOne({ "gameId": parseInt(gameId) })
        console.log('allowed: ', gameData.userNames, '    ', gameData.userNames.includes(username));
        if (gameData.userNames.includes(username)) {
            res.send({ message: 'success', key: gameData.key });
        }
        else {
            res.send({ message: 'fail' });
        }
    });
    app.get('/guess', function (req, res) {
        // console.log('guess');
        let query = req.url.substring(req.url.indexOf('?') + 8);
        console.log(query);
        let gameId = query.split('&')[0]
        let key = query.split('&')[1]
        console.log('guess at ', gameId, key);

        //handle activeGamesPing
        let activeGame = (activeGames.find(game => game.gameId == gameId))
        console.log('activeGame:', activeGame)
        activeGame.playerB.lastPing = new Date().getTime() + 60000
        //check that it updated
        let checkActiveGame = (activeGames.find(game => game.gameId == gameId))
        console.log('checkActiveGame:', checkActiveGame)
        res.sendFile(path.join(__dirname, 'public/guess.html'));
    });
    //GET requests
    app.get('/gameId:gameId/:key', async function (req, res) {
        // console.log('get');
        let output = await collection.findOne({ 'gameId': parseInt(req.params.gameId) })
        // console.log(output);
        res.send(output)
    });

    app.post('/guessWord/gameId:gameId', async function (req, res) {
        console.log(req.body);
        let word = req.body.word
        console.log('word:', word);
        let output = await collection.findOne({ 'gameId': parseInt(req.params.gameId) })
        console.log(word, ' and chosenWord', output.chosenWord);
        if (word === output.chosenWord) {
            let chosenLength = output.chosenWord.length
            let pointGain = chosenLength > 5 ? 5 : (chosenLength === 5 ? 3 : 1)
            console.log('success, gain ', pointGain, 'points');
            await collection.updateOne({ 'gameId': parseInt(req.params.gameId) },
                { $set: { 'score': parseInt(output.score) + pointGain } })
        }
    });

    //POST requests
    app.post('/drawings/gameId:gameId', async function (req, res) {
        let data = req.body
        console.log(data);
        console.log('POST drawing to gameId', req.params.gameId, data);
        let output = await collection.updateOne({ 'gameId': parseInt(req.params.gameId) },
            { $set: { "drawings": data } })

        console.log(output);
        if (output)
            res.send({ message: 'GOOD' })
        else res.send({ message: 'BAD' })
    });
    app.post('/updateWord/gameId:gameId', async function (req, res) {
        console.log('POST update');
        let data = req.body
        console.log(data);
        let output = await collection.updateOne({ 'gameId': parseInt(req.params.gameId) },
            { $set: { "chosenWord": data, 'gameStage': 'painting' } })
        console.log(output);
        if (output)
            res.send({ message: 'GOOD, updated words' })
        else res.send({ message: 'BAD, did not update words' })
    });
    app.post('/createGame', async function (req, res) {
        console.log('POST Create new Game');
        let data = req.body
        data.wordPool = getRandomWordsArr()
        console.log(data);
        let output = await collection.insertOne(data)
        console.log(output);
        if (output) {
            // {gameId: 2, playerA:{username:'yaniv', lastPing: 100}, playerB:{username:'ofri', lastPing: 150} }
            activeGames.push({
                gameId: data.gameId,
                playerA: { username: data.userNames[0], lastPing: null },
                playerB: { username: data.userNames[1], lastPing: null },
                createdTime: new Date().getTime()
            })
            console.log('activeGames', activeGames);
            res.send({ message: 'GOOD, I added ', data })
        }
        else res.send({ message: "BAD, couldn't add ", data })
    });

    app.listen(process.env.PORT || 3000, () => {
        console.log('listening on port: ' + process.env.PORT || 3000);
    });


    // perform actions on the collection object
    // await createGame(collection, 1, [10, 20],[]   )
    // Math.floor(Math.random() * 1000)
    await createGame(collection, 2, ['Yaniv', 'Lior'],
        [
            // { shape: 'line', arr: [[50, 50], [150, 70]], stroke: 15, color: '#ff0000' },
            // { shape: 'line', arr: [[80, 20], [190, 170]], stroke: 15, color: '#ff0000' }
        ],
        'painting'
    )

    let output = await collection.findOne();
    console.log(output)
    // client.close();
});

async function getGameDataFromDb(collection, gameId) {
    return (await collection.findOne({ 'gameId': parseInt(gameId) }))
}
async function createGame(collection, id, users, initialDrawingsArr, gameStage) {
    let wordsArr = getRandomWordsArr()
    let newGame = {
        'gameId': id,
        'userNames': users,
        'gameStage': gameStage,
        'wordPool': wordsArr,
        'chosenWord': wordsArr[0],
        'drawings': initialDrawingsArr,
        'onlineUsersLastPing': {},
        'startingTime': null,
        'key': 'yaniv',
        // 'key': ''+Math.floor(Math.random()*9000 +1000)
        'score': 0
    }
    console.log(newGame);
    let output = await collection.insertOne(newGame)
    // console.log(output);
    if (output) {
        activeGames.push({
            gameId: id, playerA: { username: users[0], lastPing: null },
            playerB: { username: users[1], lastPing: null },
            createdTime: new Date().getTime()
        })
    }
}


function getRandomWordsArr() {
    //this might look sily and ineffective, but the npm package does the same ineffective method :)
    console.log('get words');
    let easy = ''
    while (easy.length < 3) {
        easy = randomWords({ exactly: 1, maxLength: 5 })[0]
    }

    let medium = ''
    while (medium.length != 5) {

        medium = randomWords({ exactly: 1, maxLength: 5 })[0]
    }

    let hard = ''
    while (hard.length < 6) {

        hard = randomWords({ exactly: 1 })[0]
    }

    let arr = [easy, medium, hard]
    return (arr);
}




