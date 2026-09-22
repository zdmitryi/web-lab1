const canvas = document.getElementById('graph-canvas');
const ctx = canvas.getContext('2d');
const form = document.getElementById('coordinate-form');
const yInput = document.getElementById('y-input');
const yError = document.getElementById('y-error');
const rError = document.getElementById('r-error');
const resultsBody = document.getElementById('result-body');



form.addEventListener('submit', function(event) {
    event.preventDefault();
    console.log("Форма отправлена!!");

    const x = parseFloat(document.getElementById('x-select').value);

    const y = parseFloat(yInput.value);

    const rCheckboxes = document.querySelectorAll('input[name="r"]:checked');
    console.log('Выбрано радиусов:', rCheckboxes.length);

    let isValid = true;

    if (isNaN(y) || y < -3 || y > 3){
        yError.style.display = 'block';
        isValid = false;
    } else {
        yError.style.display = 'none';
    }

    if (rCheckboxes.length === 0) {
        rError.style.display = 'block';
        isValid = false;
    } else {
        rError.style.display = 'none';
    }

    if (!isValid){
        return;
    }

    rCheckboxes.forEach(function(checkbox) {
        const r = parseFloat(checkbox.value);
        console.log('Проверяем R =', r);
        const isHit = checkHit(x, y, r);
        console.log(`При r = ${r}:${isHit}`);
    });

});

const SCALE = 50;                      
const CENTER_X = canvas.width / 2;
const CENTER_Y = canvas.height / 2;

drawAxes();

function drawAxes(){
    ctx.beginPath();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;

    ctx.moveTo(0, CENTER_Y);
    ctx.lineTo(canvas.width, CENTER_Y);

    ctx.moveTo(CENTER_X, 0);
    ctx.lineTo(CENTER_X, canvas.height);

    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width - 10, CENTER_Y - 5);
    ctx.lineTo(canvas.width, CENTER_Y);
    ctx.lineTo(canvas.width - 10, CENTER_Y + 5);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(CENTER_X - 5, 10);
    ctx.lineTo(CENTER_X, 0);
    ctx.lineTo(CENTER_X + 5, 10);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.fillText('X', canvas.width - 20, CENTER_Y - 10);
    ctx.fillText('Y', CENTER_X + 10, 15);
}

function drawArea(r, color){
    const rPixel = r * SCALE;
    const halfR = rPixel / 2;

    const toPxX = (x) => CENTER_X + x * SCALE;
    const toPxY = (y) => CENTER_Y - y * SCALE;

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(toPxX(0), toPxY(0));
    ctx.lineTo(toPxX(-r), toPxY(0));
    ctx.lineTo(toPxX(-r), toPxY(r));
    ctx.lineTo(toPxX(0), toPxY(r));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toPxX(0), toPxY(0)); // Центр
    ctx.arc(toPxX(0), toPxY(0), halfR, Math.PI / 2, Math.PI, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toPxX(0), toPxY(0));
    ctx.lineTo(toPxX(0), toPxY(-r/2));
    ctx.lineTo(toPxX(r), toPxY(0));
    ctx.closePath();
    ctx.fill();
    ctx.stroke()


}

function checkHit(x, y, r){

    const isInSquare = (x >= -r && x <= 0 && y >= 0 && y <= r);

    const isInTriangle = (x >= 0 && x <= r && y <= 0 && y >= -r/2 && (x - 2*y) <= r);

    const isInCircle = (x >= -r/2 && x <= 0 && y >= -r/2 && y <= 0 && (x*x + y*y) <= (r/2)*(r/2));

    return isInSquare || isInTriangle || isInCircle;
}