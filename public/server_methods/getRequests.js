async function getGameData(gameId, key) {
    let url = (window.location.origin.replace('guess','game') + '') + '/gameId' + gameId +'/'+key
    console.log('get at url ', url);
    let gameData = await fetch(url)
    console.log(gameData);
    let temp = await gameData.json()
    console.log(temp);
    return temp
}