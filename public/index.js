
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

//global vars for drawing
let penUp = true
let drawings = []
let currentLine = [[], []]

function getMousePosition(canvas, click) {
    let rect = canvas.getBoundingClientRect();
    // console.log(click.clientX - rect.x);
    // console.log(click.clientY - rect.y);
    let output = [click.clientX - rect.x, click.clientY - rect.y]
    return output
}

const defalutColor = '#bb4400'
let penshape = 'line'
let strokeWidth = 5
let gameId
let color = defalutColor
canvas.addEventListener('mousedown', (e) => {

    let clickAt = [...getMousePosition(canvas, e)]
    if (penUp) {
        console.log('start drawing at: ', clickAt);
        currentLine[0] = clickAt
        penUp = false
    }
    else {
        console.log('end drawing at: ', clickAt);
        currentLine[1] = clickAt
        if (penshape === 'rectangle') {

            let topLeftX = Math.min(currentLine[0][0], currentLine[1][0])
            let topLeftY = Math.min(currentLine[0][1], currentLine[1][1])
            let bottomRightX = Math.max(currentLine[0][0], currentLine[1][0])
            let bottomRightY = Math.max(currentLine[0][1], currentLine[1][1])
            currentLine = [[topLeftX, topLeftY], [bottomRightX, bottomRightY]]
        }
        let newDrawObj = {
            shape: penshape, arr: [currentLine[0], currentLine[1]],
            stroke: parseInt(strokeWidth), color: color
        }

        drawings.push({ ...newDrawObj })
        penUp = true

    }
    draw(ctx, canvas, drawings)
})




async function setup() {
    console.log('start');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const gameId = urlParams.get('gameId')
    console.log(gameId);
    let gameDataFromDb = await getGameData(gameId)
    drawings = [...gameDataFromDb.drawings]
    document.getElementById('chosenWordDiv').innerText = gameDataFromDb.chosenWord
    draw(ctx, canvas, drawings)
}
async function exportClicked(gameId = 2) {
    console.log('export', drawings);
    await postDrawingArr(gameId, drawings)

}

async function importClicked(gameId = 2) {
    let temp = await getGameData(gameId)
    console.log('temp:', temp);
    drawings = temp.drawings
    draw(ctx, canvas, drawings)
}
function updateOptions() {
    shapeFromInput = document.getElementById('shapeInput').value
    strokeWidthFromInput = document.getElementById('strokeWidthInput').value
    colorFromInput = document.getElementById('colorInput').value

    penshape = shapeFromInput
    strokeWidth = Math.max(strokeWidthFromInput, 1)
    color = colorFromInput
    console.log('Current options:', penshape, strokeWidth, color);
}
setup()
