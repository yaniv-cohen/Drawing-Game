var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

function getMousePosition(canvas, click) {
    let rect = canvas.getBoundingClientRect();
    // console.log(click.clientX - rect.x);
    // console.log(click.clientY - rect.y);
    let output = [click.clientX - rect.x, click.clientY - rect.y]
    return output
}


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
        linesArray.push([...currentLine])
        penUp = true

    }
    draw()
})


function draw() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.rect(20, 40, 50, 50);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(240, 160, 20, 0, Math.PI * 2, false);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(160, 10, 100, 40);
    ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
    ctx.stroke();
    ctx.closePath();
    console.log(linesArray);

    linesArray.forEach(line => {
        console.log(line[0], ' to ', line[1]);
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 0, 255, 1)";
        ctx.moveTo(line[0][0], line[0][1]);
        ctx.lineTo(line[1][0], line[1][1]);
        ctx.stroke();
        ctx.closePath();


        ctx.beginPath();
        setTimeout(()=>{console.log('wait')}, 000)
    })

}

let penUp = true
let linesArray = [
    [[10, 200], [150, 220]],
    [[50, 100], [50, 120]],
]
let currentLine = [[], []]
function setup() {

    draw()
}

setup()
