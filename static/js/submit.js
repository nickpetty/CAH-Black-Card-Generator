var card = document.getElementById("card");
var ctx = card.getContext("2d");
ctx.font = "30px Helvetica";
ctx.fillStyle = 'white';

document.getElementById('content').onkeyup = draw;
document.getElementById('pick').onchange = updatePick;

function draw() {
	var lines = fragmentText(this.value, card.width * 0.9),
		font_size = 40;
	ctx.save();
	ctx.clearRect(0, 0, card.width, 385);

	lines.forEach(function(line, i) {
		ctx.textAlign = "left";
		ctx.fillText(line, 20, (i + 1) * font_size);
	});
	ctx.restore();
}


function updatePick() {
	var pickNumber = parseInt(this.value);
	if (pickNumber > 1) {
		ctx.save();

		ctx.clearRect(0, 385, card.width, card.height);

		ctx.fillStyle = 'white';
		ctx.beginPath();
		ctx.arc(280,400,15,0,2*Math.PI);
		ctx.closePath();
		ctx.fill();

		ctx.fillStyle = "black"; 
		ctx.textBaseline = "top";
		ctx.font = "bold 25px Helvetica";
		ctx.fillText(pickNumber, 273, 390);

		ctx.fillStyle = "white";
		ctx.font = "22px Helvetica";
		ctx.fillText('PICK', 207, 390);

		ctx.restore();
	};

	if (pickNumber < 2) {
		ctx.save();

		ctx.clearRect(0, 385, card.width, card.height);

		ctx.fillStyle = 'black';
		ctx.beginPath();
		ctx.arc(280,400,15,0,2*Math.PI);
		ctx.closePath();
		ctx.fill();

		ctx.fillStyle = "black"; 
		ctx.textBaseline = "top";
		ctx.font = "bold 25px Helvetica";
		ctx.fillText(pickNumber, 273, 390);

		ctx.fillStyle = "black";
		ctx.font = "22px Helvetica";
		ctx.fillText('PICK', 207, 390);

		ctx.restore();
	}
}

// http://sourcoder.blogspot.com/2012/12/text-wrapping-in-html-canvas.html
function fragmentText(text, maxWidth) {
    var words = text.split(' '),
        lines = [],
        line = "";
    if (ctx.measureText(text).width < maxWidth) {
        return [text];
    }
    while (words.length > 0) {
        while (ctx.measureText(words[0]).width >= maxWidth) {
            var tmp = words[0];
            words[0] = tmp.slice(0, -1);
            if (words.length > 1) {
                words[1] = tmp.slice(-1) + words[1];
            } else {
                words.push(tmp.slice(-1));
            }
        }
        if (ctx.measureText(line + words[0]).width < maxWidth) {
            line += words.shift() + " ";
        } else {
            lines.push(line);
            line = "";
        }
        if (words.length === 0) {
            lines.push(line);
        }
    }
    return lines;
}
