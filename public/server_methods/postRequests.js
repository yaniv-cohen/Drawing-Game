
async function postDrawingArr(gameId, drawings) {

    let url = window.location.origin + '/drawings/gameId' + gameId
    console.log('post to:', url);
    console.log(drawings);
    postData(url, drawings)
        .then((data) => {
            console.log(data); // JSON data parsed by `data.json()` call
        });
}
async function postLocalGame(gameId, localGame) {
    let url = window.location.origin + '/update/gameId' + gameId
    console.log('post to:', url);
    console.log(localGame);
    postData(url, localGame)
        .then((data) => {
            console.log(data); // JSON data parsed by `data.json()` call
        });
}
async function createNewEmptyGame(gameId, playerNames) {
console.log('createNewEmptyGame(gameId, playerNames)', gameId, playerNames);
    let url = window.location.href.replace('words', '').replace('welcome', '') + 'createGame'
    console.log('post to:', url);
    let newGameObj = {
        'gameId': gameId,
        'gameStage': 'word-choose',
        'wordPool': [],
        'drawings': [],
        'onlineUsers': [],
        'userNames': playerNames,
        'chosenWord': null,
        'onlineUsersLastPing': {},
        'startingTime': null,
        'key': 'yaniv',
        'score': 0
        // 'key': ''+Math.floor(Math.random()*9000 +1000)

    }
    console.log(newGameObj);
    let output = await postData(url, newGameObj)
        .then((data) => {
            return (data); // JSON data parsed by `data.json()` call
        });
    console.log(output);
    return {...output, key: newGameObj.key}
}

// POST method implementation:
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    // console.log(response.json());
    let resJson = response.json()
    return resJson; // parses JSON response into native JavaScript objects
}



// POST method implementation:
async function postGuessedWord(gameId, guessedWord) {
    let url = window.location.origin + '/guessWord/gameId' + gameId
    console.log('post to:', url, '   ', guessedWord);
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ 'word': guessedWord + '' }) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}
