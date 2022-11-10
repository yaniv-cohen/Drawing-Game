console.log('guss');

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


const defalutColor = '#ffff00'
let penshape = 'line'
let strokeWidth = 5
let color = defalutColor
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const gameId = urlParams.get('gameId')



function clickedGuessWord() {
    let guessedWord = document.getElementById('guessInput').value
    console.log('guessedWord:', guessedWord);
    postGuessedWord(gameId, guessedWord)
}
let drawings = []
async function setup() {
    console.log('start');

    console.log(gameId);
    let gameDataFromDb = await getGameData(gameId)
    drawings = [...gameDataFromDb.drawings]
    draw(ctx, canvas, drawings)
    setInterval(async () => {
        let gameDataFromDb = await getGameData(gameId)
        drawings = [...gameDataFromDb.drawings]
        draw(ctx, canvas, drawings)
    }, 2000)

}
setup()

