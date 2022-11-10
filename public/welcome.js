async function clickedCreateGame() {
    let newGameId = parseInt(document.getElementById('newGameIdInput').value)
    let username = document.getElementById('usernameInput').value
    let otherUsername = document.getElementById('otherUsernameInput').value
    console.log('create new game ', newGameId, username, otherUsername);
    let output = await createNewEmptyGame(newGameId, [username, otherUsername])
    if (output.message === 'GOOD, I added ') {
        console.log('go to words...');
        goTo('words', newGameId, output.key)
    }
}

async function goTo(destination, gameId = null, key = null) {
    let url = window.location.origin + ''
    if (!gameId)
        gameId = parseInt(document.getElementById('targetGameInput').value)
    if (destination === 'words') {
        url += '/words/?gameId=' + gameId + '&' + key
        console.log('going to ', url);
        window.location.href = url

    }
    else if (destination === 'game') {
        url += '/game/connectToGame/' + document.getElementById('targetGameInput').value
            + '/' + document.getElementById('myUsernameInput').value
        let response = await fetch(url)
        let logInMessage = await response.json()
        console.log('logInMessage:', logInMessage);
        if (logInMessage.message === 'success' && 'key' in logInMessage) {
            // let gameUrl = window.location.origin + '/gameId'+gameId+'/'+ logInMessage.key
            let gameUrl = window.location.origin + '/painter?gameId=' + gameId + '&' + logInMessage.key
            console.log('go to game at ', gameUrl);
            window.location.href = gameUrl
        }

    }
    else if (destination === 'welcome') {
        url += '/welcome'
        window.location.href = url

    }
    else if (destination === 'guess') {

        //check login and get key
        let loginUrl = url + '/game/connectToGame/' + document.getElementById('targetGameInput').value
            + '/' + document.getElementById('myUsernameInput').value
        let response = await fetch(loginUrl)
        let logInMessage = await response.json()
        console.log('logInMessage:', logInMessage);
        if ('message' in logInMessage && logInMessage.message === 'success' && 'key' in logInMessage) {
            // let gameUrl = window.location.origin + '/gameId'+gameId+'/'+ logInMessage.key
            let gameUrl = window.location.origin + '/painter?gameId=' + gameId + '&' + logInMessage.key
            console.log('go to game at ', gameUrl);
            window.location.href = gameUrl
        }

        url += '/guess?gameId=' + document.getElementById('targetGameInput').value + '&' + logInMessage.key
        window.location.href = url

    }
}