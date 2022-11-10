function draw(ctx, canvas, drawings) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.beginPath();
    // ctx.rect(20, 40, 50, 50);
    // ctx.fillStyle = "#FF0000";
    // ctx.fill();
    // ctx.closePath();

    // ctx.beginPath();
    // ctx.arc(240, 160, 20, 0, Math.PI * 2, false);
    // ctx.fillStyle = "green";
    // ctx.fill();
    // ctx.closePath();

    drawings.forEach(drawObject => {
        if (drawObject.shape === 'line') {
            console.log(drawObject);
            ctx.lineWidth = drawObject.stroke;
            ctx.strokeStyle = drawObject.color;
            ctx.beginPath();
            ctx.moveTo(drawObject.arr[0][0], drawObject.arr[0][1]);
            ctx.lineTo(drawObject.arr[1][0], drawObject.arr[1][1]);
            ctx.stroke();
            ctx.closePath();
        }
        else if (drawObject.shape === 'rectangle') {
            ctx.beginPath();
            ctx.strokeStyle = drawObject.color;
            ctx.lineWidth = drawObject.stroke;
            ctx.rect(drawObject.arr[0][0], drawObject.arr[0][1],
                drawObject.arr[1][0] - drawObject.arr[0][0], drawObject.arr[1][1] - drawObject.arr[0][1]);
            ctx.stroke();
            ctx.closePath();
        }
    })
}
