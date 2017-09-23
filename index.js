"use strict";

(function () {
    var canvas = document.querySelector("canvas.main");
    var context = canvas.getContext("2d");

    var lengthRatio = canvas.width / 384;

    var bufferCanvases = [...document.querySelectorAll(".buffer")];
    var bufferContexts = bufferCanvases.map(canvas => canvas.getContext("2d"));
    
    var spritesheet = document.querySelector("img");

    var scale = 1;

    var overlayImages = [
        new Image(),
        crop(192, 394, 192, 256),
        crop(0, 394, 192, 256)
    ];
    var overlayImage = overlayImages[0];

    var middleCircle = crop(218, 0, 16, 16);
    var circleEyes = crop(234, 0, 20, 12);

    var colors = ["#ff499d", "#d44b9d", "#d70074", "#450d43"];

    var x;
    var y;

    var sprites = [];
    for (var i = 0; i < 14; i++) {
        var y;
        var sh;
        var oy;

        if (i < 7) {
            y  = 3;
            sh = 70;
            oy = -10;
        } else {
            y  = 76;
            sh = 60;
            oy = 0;
        }

        sprites.push({
            c:  crop(3 + 31 * (i % 7), y, 28, sh),
            ox: 0,
            oy: oy
        });
    }
    sprites = sprites.concat([
        { c: crop(123, 139, 47, 62), ox: -23, oy: -2 },
        { c: crop(173, 139, 48, 62), ox: -24, oy: -2 },
        { c: crop( 89, 139, 31, 62), ox:  -4, oy: -2 },
        { c: crop( 62, 139, 24, 62), ox:   0, oy: -2 },
        { c: crop( 34, 139, 24, 62), ox:   0, oy: -2 },
        { c: crop(  3, 139, 28, 62), ox:   0, oy: -2 },

        { c: crop(123, 204, 47, 62), ox: 4, oy: -2 },
        { c: crop(173, 204, 48, 62), ox: 4, oy: -2 },
        { c: crop( 89, 204, 31, 62), ox: 1, oy: -2 },
        { c: crop( 62, 204, 24, 62), ox: 3, oy: -2 },
        { c: crop( 34, 204, 24, 62), ox: 4, oy: -2 },
        { c: crop(  3, 204, 28, 62), ox: 0, oy: -2 },
    ]);

    bufferContexts[1].fillStyle = colors[0];
    context.imageSmoothingEnabled = false;

    function resetTouchCoords() {
        x = 96;
        y = 128;
    }
    resetTouchCoords();
    
    function queryVar(name) {
        var pairs = location.search.substring(1).split("&");
        for (var pair of pairs) {
            if (pair.split("=")[0] == name) return splitPair[1];
        }
    }
    canvas.width = Math.max(Number(queryVar("size")), 0) || 384;
    canvas.height = canvas.width / 3 * 2;
    
    audio.volume = Math.max(Number(queryVar("volume")), 0) || 1;
    audio.playbackRate = Math.max(Number(queryVar("speed")), 0) || 1;

    addEventListener("mousemove", event => {
        if (event.target == canvas) {
            var rect = canvas.getBoundingClientRect();
            var coords = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };

            if (coords.x > canvas.width / 2) {
                x = (coords.x - canvas.width / 2) / lengthRatio;
                y = coords.y / lengthRatio - 8;
            } else {
                resetTouchCoords();
            }
        } else {
            resetTouchCoords();
        }
    });

    function clear(context=bufferContexts[0]) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }

    function crop(sx, sy, sw, sh) {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");

        canvas.width = sw;
        canvas.height = sh;

        context.drawImage(spritesheet, sx, sy, sw, sh, 0, 0, sw, sh);

        return canvas;
    }

    function drawLeft(sprite) {
        clear(bufferContexts[3]);

        bufferContexts[1].fillRect(0, 0, 192, 256);

        var width = sprite.c.width;
        var height = sprite.c.height;

        bufferContexts[0].drawImage(bufferCanvases[1], 0, 0, 192, 256);

        bufferContexts[3].globalCompositeOperation = "source-over";
        for (var i = 0; i < (192 / 48 + 2) / scale ; i++) {
            for (var j = 0; j < 192 / 45 / scale + 1; j++) {
                bx3.drawImage(
                    sprite.c,
                    (-25 + j * 45 + (i % 2 ? i % 2 * 22 : 0) + s.ox) * scale,
                    (-29 + i * 48 + s.oy) * scale,
                    width * scale,
                    height * scale
                );
            }
        }

        function matchesAny(...spriteIDs) {
            return Boolean(spriteIDs.find(id => Object.is(sprite, sprites[id])));
        }

        if (!overlayImage.src && matchesAny(14, 15, 20, 21)) {
            bufferContexts[3].globalCompositeOperation = "source-in";
            bufferContexts[3].drawImage(overlayImage, 0, 0);
        }

        bufferContexts[0].drawImage(bufferCanvases[3], 0, 0, 192, 256);

        context.drawImage(bufferCanvases[0], 0, 0, canvas.width, canvas.height);
    }

    function drawRight(radius, showMiddleCircle) {
        clear(bufferContexts[4]);

        bufferContexts[2].fillStyle = colors[2];
        bufferContexts[2].fillRect(0, 0, 192, 256);

        if (radius > 0) {
            bufferContexts[4].fillStyle = colors[3];
            bufferContexts[4].beginPath();
            bufferContexts[4].arc(cx, cy, radius, 0, 2 * Math.PI);
            bufferContexts[4].fill();

            if (showMiddleCircle) bufferContexts[4].drawImage(middleCircle, x - 8, y - 8);
            bufferContexts[4].drawImage(circleEyes, x - 10, y - 17 - radius);

            bufferContexts[2].drawImage(bufferCanvases[4], 0, 0);
        }

        bufferContext[0].drawImage(bufferCanvases[2], 192, 0, 192, 256);

        context.drawImage(bc0, 0, 0, canvas.width, canvas.height);
    }
    drawLeft(sprites[7]);
    drawRight(0);

    const BPM = 162;
    const T = 60000 / BPM;

    setTimeout(function () {
        bounce();

        var awPairs = [];
        for (var i =  0; i < 12; i += 2) awPairs.push([i, bounce]);
        for (var i = 12; i < 16; i += 1) awPairs.push([i, bounce]);

        addFlickbeatSet   ( 16,  32, false);
        addFlickoffbeatSet( 32,  48);
        addFlickbeatSet   ( 48,  64);
        addFlickoffbeatSet( 64,  80);
        addFlickbeatSet   ( 80,  88);
        addFlickoffbeatSet( 88,  96);
        addFlickbeatSet   ( 96, 104);
        addFlickoffbeatSet(104, 112);
        addFlickbeatSet   (112, 116);
        addFlickoffbeatSet(116, 120);
        addFlickbeatSet   (120, 124);
        addFlickoffbeatSet(124, 128);
        addFlickbeatSet   (128, 132);
        addFlickoffbeatSet(132, 140);
        addFlickbeatSet   (140, 152);
        addFlickoffbeatSet(152, 158);
        addFlickbeatSet   (158, 168);
        addFlickoffbeatSet(168, 174);
        addFlickbeatSet   (174, 192);
        addFlickoffbeatSet(192, 208);
        addFlickbeatSet   (208, 233, true, false);

        console.log(awPairs);

        function addFlickbeatSet(start, end, useStart = true, useEnd = true) {
            if (useStart) {
                awPairs.push([start, hai]);
            }

            for (var i = start + (useStart ? 1 : 0); i < end - (useEnd ? 4 : 0); i++) {
                awPairs.push([i, flickbeat]);
            }

            if (useEnd) {
                for (var i = end - 4; i < end; i++) awPairs.push([i, hai]);
            }
        }

        function addFlickoffbeatSet(start, end, useStart = true, useEnd = true) {
            if (useStart) {
                awPairs.push([start - .5, ho]);
            }

            for (var i = start + (useStart ? 1 : 0); i < end - (useEnd ? 1 : 0); i++) {
                awPairs.push([i - .5, flickoffbeat]);
            }

            if (useEnd) {
                for (var i = end - 2; i < end; i += .5) awPairs.push([i, mmha]);
            }
        }

        setTimeout(function () {
            bounce();
            audio.play();
        }, T * 2);

        audioWatcher(awPairs, 40);

        audioWatcher([
            [ 63.5, () => { scale = .75; }],
            [ 80  , () => { scale = 1  ; }],
            [ 87.5, () => { scale = .75; }],
            [ 96  , () => { scale = .5 ; }],
            [103.5, () => { scale = .75; }],
            [112  , () => { scale = 1  ; }],
            [115.5, () => { scale = .75; }],
            [120  , () => { scale = .5 ; }],
            [123.5, () => { scale = .3 ; }],
            [128  , () => { scale = .15; overlayImage = overlayImages[1]; }],
            [131.5, () => { scale = .3 ; overlayImage = overlayImages[0]; }],
            [140  , () => { scale = .5 ; }],
            [141  , () => { scale = .75; }],
            [141.5, () => { scale = 1  ; }],
            [142  , () => { scale = .5 ; }],
            [143  , () => { scale = .75; }],
            [143.5, () => { scale = 1  ; }],
            [144  , () => { scale = .3 ; }],
            [151.5, () => { scale = .15; overlayImage = overlayImages[2]; }],
            [158  , () => { scale = 1  ; overlayImage = overlayImages[0]; }],
            [160  , () => { scale = .3 ; }],
            [167.5, () => { scale = .15; overlayImage = overlayImages[2]; }],
            [174  , () => { scale = 1  ; overlayImage = overlayImages[0]; }],
            [176  , () => { scale = .75; }],
            [177  , () => { scale = .5 ; }],
            [178  , () => { scale = .3 ; }],
            [179  , () => { scale = .15; overlayImage = overlayImages[1]; }],
            [184  , () => { scale = .75; overlayImage = overlayImages[0]; }],
            [185  , () => { scale = .5 ; }],
            [186  , () => { scale = .3 ; }],
            [187  , () => { scale = .15; overlayImage = overlayImages[1]; }],
            [191.5, () => { scale = 1  ; overlayImage = overlayImages[0]; }],
            [192.5, () => { scale = .5 ; }],
            [193.5, () => { scale = .5 ; }],
            [194.5, () => { scale = .3 ; }],
            [195.5, () => { scale = .15; overlayImage = overlayImages[2]; }],
            [199.5, () => { scale = .75; overlayImage = overlayImages[0]; }],
            [200.5, () => { scale = .5 ; }],
            [201.5, () => { scale = .3 ; }],
            [202.5, () => { scale = .15; overlayImage = overlayImages[2]; }],
            [208  , () => {              overlayImage = overlayImages[1]; }],
        ], 40);

        audioWatcher([[230, function () {
            c.addEventListener("transitionend", function () {
                var n = document.querySelector("header");
                n.innerHTML = "– wooningc :)<br />Tant Day 2017<br /><a href='javascript: location.reload();'>Replay</a>";
                n.style.animation = "none";
                n.style.webkitAnimation = "none";
                n.style.pointerEvents = "auto";
                n.style.opacity = 1;
                n.style.background = "none";
                n.style.color = "rgba(255, 255, 255, .4)";
            }, false);
            c.style.opacity = 0;
        }]], 500);

    }, 2000);

    function audioWatcher(pairs, accuracy) {
        var i = 0;
        return setInterval(function () {
            if (!pairs[i]) {
                clearInterval(iID);
                return;
            }
            if (audio.currentTime >= pairs[i][0] * T / 1000) {
                pairs[i][1]();
                i++;
            }
        }, accuracy);
    }

    var iIDs = [];
    function repeat(func, amount, delay, options={}) {
        var i = 0;
        interval();

        function interval() {
            func(i);
            i++;
            var newDelay = options.customDelays ? options.customDelays.get(i) || delay : delay;
            if (i <= amount - 1) {
                iIDs[options.index] = setTimeout(interval, newDelay / audio.playbackRate);
            } else {
                if (options.doneFunc) options.doneFunc();
            }
        }
    }

    function bounce() {
        repeat(i => { drawLeft(sprites[i]); }, 7, 40);
    }

    function flickbeat() {
        clearTimeout(iIDs[0]);
        repeat(i => { drawLeft(sprites[i + 14]); }, 6, 20, { customDelays: new Map().set(2, 130) });
        touch();
    }
    function hai() {
        bx1.fillStyle = bx1.fillStyle === colors[1] ? colors[0] : colors[1];
        flickbeat();
    }
    function ho() {
        bx1.fillStyle = bx1.fillStyle === colors[1] ? colors[0] : colors[1];
        flickoffbeat();
    }

    function flickoffbeat() {
        clearTimeout(iIDs[0]);
        repeat(i => { drawLeft(sprites[i + 20]); }, 6, 20, { customDelays: new Map().set(2, 130) });
        touch();
    }
    function mmha() {
        if (bx1.fillStyle === colors[0]) {
        bx1.fillStyle = colors[1];
        flickoffbeat();
        } else {
        bx1.fillStyle = colors[0];
        }
    }

    function touch() {
        clearTimeout(iIDs[1]);
        repeat(i => { drawRight(i < 5 ? 4 * i : 40 - 4 * i, i < 6); }, 11, 25, { index: 1 });
    }
})();