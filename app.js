window.onload = function() {
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
    var resetButton = document.getElementById('resetButton');

    var bubbles = [
        { x: 100, y: 100, radius: 50, color: 'red', hit: false },
        { x: 100, y: 250, radius: 50, color: 'blue', hit: false },
        { x: 100, y: 400, radius: 50, color: 'green', hit: false },
        { x: 100, y: 550, radius: 50, color: 'yellow', hit: false }
    ];
    var arrowLength = 50; 
    var arrowSpeed = 2; 
    var arrows = [];

    function initializeArrows() {
        arrows = [];
        bubbles.forEach(function(bubble) {
            arrows.push({ x: canvas.width - arrowLength, y: bubble.y, dx: 0, dy: 0, color: 'black', target: bubble });
        });
    }

    function drawCircle(ctx, x, y, radius, color) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

    function drawArrow(ctx, startX, startY, endX, endY, color) {
        var headLength = 10; 
        var angle = Math.atan2(endY - startY, endX - startX);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headLength * Math.cos(angle - Math.PI / 6), endY - headLength * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(endX - headLength * Math.cos(angle + Math.PI / 6), endY - headLength * Math.sin(angle + Math.PI / 6));
        ctx.lineTo(endX, endY);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

    function drawScene() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        bubbles.forEach(function(bubble) {
            drawCircle(ctx, bubble.x, bubble.y, bubble.radius, bubble.color); 
        });
        arrows.forEach(function(arrow) {
            if (!arrow.target.hit) {
                arrow.x += arrow.dx;
                arrow.y += arrow.dy;

                var dx = arrow.target.x - arrow.x;
                var dy = arrow.target.y - arrow.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance - 50 <= arrow.target.radius) {
                    arrow.target.hit = true;
                    arrow.target.color = 'black';
                    arrow.dx = 0;
                    arrow.dy = 0;
                }
            }
            drawArrow(ctx, arrow.x, arrow.y, arrow.x - arrowLength, arrow.y, arrow.color);
        });
    }

    function resetGame() {
        bubbles = [
            { x: 100, y: 100, radius: 50, color: 'red', hit: false },
            { x: 100, y: 250, radius: 50, color: 'blue', hit: false },
            { x: 100, y: 400, radius: 50, color: 'green', hit: false },
            { x: 100, y: 550, radius: 50, color: 'yellow', hit: false }
        ];
        initializeArrows();
        drawScene();
    }

    canvas.addEventListener('click', function(event) {
        var clickX = event.offsetX;
        var clickY = event.offsetY;

        bubbles.forEach(function(bubble, index) {
            var dx = clickX - bubble.x;
            var dy = clickY - bubble.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= bubble.radius && !bubble.hit) {
                var arrow = arrows[index];
                var angle = Math.atan2(bubble.y - arrow.y, bubble.x - arrow.x);
                arrow.dx = Math.cos(angle) * arrowSpeed;
                arrow.dy = Math.sin(angle) * arrowSpeed;
            }
        });
    });

    resetButton.addEventListener('click', function() {
        resetGame();
    });

    initializeArrows();
    setInterval(drawScene, 1000 / 60);
};
