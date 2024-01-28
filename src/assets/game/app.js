/**
 * A Pixel Perfect Collision Detection for EaselJS Bitmap-Objects
 * @author olsn, indiegamr.com
 **/

this.ndgmr = this.ndgmr || {};

(function () {
  var collisionCanvas = document.createElement("canvas");
  var collisionCtx = collisionCanvas.getContext("2d");
  //collisionCtx.globalCompositeOperation = 'source-in';
  collisionCtx.save();

  var collisionCanvas2 = document.createElement("canvas");
  var collisionCtx2 = collisionCanvas2.getContext("2d");
  collisionCtx2.save();

  var cachedBAFrames = [];

  var checkRectCollision = function (bitmap1, bitmap2) {
    var b1, b2;
    b1 = getBounds(bitmap1);
    b2 = getBounds(bitmap2);
    return calculateIntersection(b1, b2);
  };
  ndgmr.checkRectCollision = checkRectCollision;

  var checkPixelCollision = function (
    bitmap1,
    bitmap2,
    alphaThreshold,
    getRect,
  ) {
    //display the intersecting canvases for debugging
    if (ndgmr.DEBUG || ndgmr.DEBUG_COLLISION) {
      document.body.appendChild(collisionCanvas);
      document.body.appendChild(collisionCanvas2);
    }

    getRect = getRect || false;

    var areObjectsCloseEnough,
      intersetion,
      imageData1,
      imageData2,
      pixelIntersection;

    areObjectsCloseEnough = _collisionDistancePrecheck(bitmap1, bitmap2);
    if (!areObjectsCloseEnough) {
      return false;
    }

    intersection = checkRectCollision(bitmap1, bitmap2);
    if (!intersection) {
      return false;
    }

    alphaThreshold = alphaThreshold || 0;
    alphaThreshold = Math.min(0.99999, alphaThreshold);

    //setting the canvas size
    collisionCanvas.width = intersection.width;
    collisionCanvas.height = intersection.height;
    collisionCanvas2.width = intersection.width;
    collisionCanvas2.height = intersection.height;

    imageData1 = _intersectingImagePart(intersection, bitmap1, collisionCtx, 1);
    imageData2 = _intersectingImagePart(
      intersection,
      bitmap2,
      collisionCtx2,
      2,
    );

    //compare the alpha values to the threshold and return the result
    // = true if pixels are both > alphaThreshold at one coordinate
    pixelIntersection = _compareAlphaValues(
      imageData1,
      imageData2,
      intersection.width,
      intersection.height,
      alphaThreshold,
      getRect,
    );

    if (pixelIntersection) {
      pixelIntersection.x += intersection.x;
      pixelIntersection.x2 += intersection.x;
      pixelIntersection.y += intersection.y;
      pixelIntersection.y2 += intersection.y;
    } else {
      return false;
    }

    return pixelIntersection;
  };
  ndgmr.checkPixelCollision = checkPixelCollision;

  var _collisionDistancePrecheck = function (bitmap1, bitmap2) {
    var ir1, ir2, b1, b2;

    b1 = bitmap1.localToGlobal(0, 0);
    b2 = bitmap2.localToGlobal(0, 0);

    ir1 =
      bitmap1 instanceof createjs.Bitmap
        ? { width: bitmap1.image.width, height: bitmap1.image.height }
        : bitmap1.spriteSheet.getFrame(bitmap1.currentFrame).rect;
    ir2 =
      bitmap2 instanceof createjs.Bitmap
        ? { width: bitmap2.image.width, height: bitmap2.image.height }
        : bitmap2.spriteSheet.getFrame(bitmap2.currentFrame).rect;

    //precheck if objects are even close enough
    return (
      Math.abs(b2.x - b1.x) <
        ir2.width * bitmap2.scaleX + ir1.width * bitmap1.scaleX &&
      Math.abs(b2.y - b1.y) <
        ir2.height * bitmap2.scaleY + ir1.height * bitmap2.scaleY
    );
  };

  var _intersectingImagePart = function (intersetion, bitmap, ctx, i) {
    var bl, image, frameName, sr;

    if (bitmap instanceof createjs.Bitmap) {
      image = bitmap.image;
    } else if (bitmap instanceof createjs.Sprite) {
      frame = bitmap.spriteSheet.getFrame(bitmap.currentFrame);
      frameName =
        frame.image.src +
        ":" +
        frame.rect.x +
        ":" +
        frame.rect.y +
        ":" +
        frame.rect.width +
        ":" +
        frame.rect.height; // + ':' + frame.rect.regX  + ':' + frame.rect.regY
      if (cachedBAFrames[frameName]) {
        image = cachedBAFrames[frameName];
      } else {
        cachedBAFrames[frameName] = image =
          createjs.SpriteSheetUtils.extractFrame(
            bitmap.spriteSheet,
            bitmap.currentFrame,
          );
      }
    }

    bl = bitmap.globalToLocal(intersetion.x, intersetion.y);
    ctx.restore();
    ctx.save();
    //ctx.clearRect(0,0,intersetion.width,intersetion.height);
    ctx.rotate(
      _getParentalCumulatedProperty(bitmap, "rotation") * (Math.PI / 180),
    );
    ctx.scale(
      _getParentalCumulatedProperty(bitmap, "scaleX", "*"),
      _getParentalCumulatedProperty(bitmap, "scaleY", "*"),
    );
    ctx.translate(
      -bl.x - intersetion["rect" + i].regX,
      -bl.y - intersetion["rect" + i].regY,
    );
    if ((sr = bitmap.sourceRect) != undefined) {
      ctx.drawImage(
        image,
        sr.x,
        sr.y,
        sr.width,
        sr.height,
        0,
        0,
        sr.width,
        sr.height,
      );
    } else {
      ctx.drawImage(image, 0, 0, image.width, image.height);
    }
    return ctx.getImageData(0, 0, intersetion.width, intersetion.height).data;
  };

  var _compareAlphaValues = function (
    imageData1,
    imageData2,
    width,
    height,
    alphaThreshold,
    getRect,
  ) {
    var alpha1,
      alpha2,
      x,
      y,
      offset = 3,
      pixelRect = { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity };

    // parsing through the pixels checking for an alpha match
    // TODO: intelligent parsing, not just from 0 to end!
    for (y = 0; y < height; ++y) {
      for (x = 0; x < width; ++x) {
        alpha1 = imageData1.length > offset + 1 ? imageData1[offset] / 255 : 0;
        alpha2 = imageData2.length > offset + 1 ? imageData2[offset] / 255 : 0;

        if (alpha1 > alphaThreshold && alpha2 > alphaThreshold) {
          if (getRect) {
            if (x < pixelRect.x) pixelRect.x = x;
            if (x > pixelRect.x2) pixelRect.x2 = x;
            if (y < pixelRect.y) pixelRect.y = y;
            if (y > pixelRect.y2) pixelRect.y2 = y;
          } else {
            return { x: x, y: y, width: 1, height: 1 };
          }
        }
        offset += 4;
      }
    }

    if (pixelRect.x != Infinity) {
      pixelRect.width = pixelRect.x2 - pixelRect.x + 1;
      pixelRect.height = pixelRect.y2 - pixelRect.y + 1;
      return pixelRect;
    }

    return null;
  };

  // this is needed to paint the intersection part correctly,
  // if the tested bitmap is a child to a rotated/scaled parent
  // this was not painted correctly before
  var _getParentalCumulatedProperty = function (child, propName, operation) {
    operation = operation || "+";
    if (child.parent && child.parent[propName]) {
      var cp = child[propName];
      var pp = _getParentalCumulatedProperty(child.parent, propName, operation);
      if (operation == "*") {
        return cp * pp;
      } else {
        return cp + pp;
      }
    }

    return child[propName];
  };

  var calculateIntersection = function (rect1, rect2) {
    // first we have to calculate the
    // center of each rectangle and half of
    // width and height
    var dx,
      dy,
      r1 = {},
      r2 = {};
    r1.cx = rect1.x + (r1.hw = rect1.width / 2);
    r1.cy = rect1.y + (r1.hh = rect1.height / 2);
    r2.cx = rect2.x + (r2.hw = rect2.width / 2);
    r2.cy = rect2.y + (r2.hh = rect2.height / 2);

    dx = Math.abs(r1.cx - r2.cx) - (r1.hw + r2.hw);
    dy = Math.abs(r1.cy - r2.cy) - (r1.hh + r2.hh);

    if (dx < 0 && dy < 0) {
      dx = Math.min(Math.min(rect1.width, rect2.width), -dx);
      dy = Math.min(Math.min(rect1.height, rect2.height), -dy);
      return {
        x: Math.max(rect1.x, rect2.x),
        y: Math.max(rect1.y, rect2.y),
        width: dx,
        height: dy,
        rect1: rect1,
        rect2: rect2,
      };
    } else {
      return null;
    }
  };
  ndgmr.calculateIntersection = calculateIntersection;

  var getBounds = function (obj) {
    var bounds = { x: Infinity, y: Infinity, width: 0, height: 0 };
    if (obj instanceof createjs.Container) {
      bounds.x2 = -Infinity;
      bounds.y2 = -Infinity;
      var children = obj.children,
        l = children.length,
        cbounds,
        c;
      for (c = 0; c < l; c++) {
        cbounds = getBounds(children[c]);
        if (cbounds.x < bounds.x) bounds.x = cbounds.x;
        if (cbounds.y < bounds.y) bounds.y = cbounds.y;
        if (cbounds.x + cbounds.width > bounds.x2)
          bounds.x2 = cbounds.x + cbounds.width;
        if (cbounds.y + cbounds.height > bounds.y2)
          bounds.y2 = cbounds.y + cbounds.height;
        //if ( cbounds.x - bounds.x + cbounds.width  > bounds.width  ) bounds.width  = cbounds.x - bounds.x + cbounds.width;
        //if ( cbounds.y - bounds.y + cbounds.height > bounds.height ) bounds.height = cbounds.y - bounds.y + cbounds.height;
      }
      if (bounds.x == Infinity) bounds.x = 0;
      if (bounds.y == Infinity) bounds.y = 0;
      if (bounds.x2 == Infinity) bounds.x2 = 0;
      if (bounds.y2 == Infinity) bounds.y2 = 0;

      bounds.width = bounds.x2 - bounds.x;
      bounds.height = bounds.y2 - bounds.y;
      delete bounds.x2;
      delete bounds.y2;
    } else {
      var gp,
        gp2,
        gp3,
        gp4,
        imgr = {},
        sr;
      if (obj instanceof createjs.Bitmap) {
        sr = obj.sourceRect || obj.image;

        imgr.width = sr.width;
        imgr.height = sr.height;
      } else if (obj instanceof createjs.Sprite) {
        if (
          obj.spriteSheet._frames &&
          obj.spriteSheet._frames[obj.currentFrame] &&
          obj.spriteSheet._frames[obj.currentFrame].image
        ) {
          var cframe = obj.spriteSheet.getFrame(obj.currentFrame);
          imgr.width = cframe.rect.width;
          imgr.height = cframe.rect.height;
          imgr.regX = cframe.regX;
          imgr.regY = cframe.regY;
        } else {
          bounds.x = obj.x || 0;
          bounds.y = obj.y || 0;
        }
      } else {
        bounds.x = obj.x || 0;
        bounds.y = obj.y || 0;
      }

      imgr.regX = imgr.regX || 0;
      imgr.width = imgr.width || 0;
      imgr.regY = imgr.regY || 0;
      imgr.height = imgr.height || 0;
      bounds.regX = imgr.regX;
      bounds.regY = imgr.regY;

      gp = obj.localToGlobal(0 - imgr.regX, 0 - imgr.regY);
      gp2 = obj.localToGlobal(imgr.width - imgr.regX, imgr.height - imgr.regY);
      gp3 = obj.localToGlobal(imgr.width - imgr.regX, 0 - imgr.regY);
      gp4 = obj.localToGlobal(0 - imgr.regX, imgr.height - imgr.regY);

      bounds.x = Math.min(Math.min(Math.min(gp.x, gp2.x), gp3.x), gp4.x);
      bounds.y = Math.min(Math.min(Math.min(gp.y, gp2.y), gp3.y), gp4.y);
      bounds.width =
        Math.max(Math.max(Math.max(gp.x, gp2.x), gp3.x), gp4.x) - bounds.x;
      bounds.height =
        Math.max(Math.max(Math.max(gp.y, gp2.y), gp3.y), gp4.y) - bounds.y;
    }
    return bounds;
  };
  ndgmr.getBounds = getBounds;
})();

// http://createjs.com/#!/TweenJS/demos/sparkTable
// http://createjs.com/Docs/TweenJS/modules/TweenJS.html
// view-source:http://createjs.com/Demos/EaselJS/Game.html COPY THIS
var stage,
  w,
  h,
  loader,
  pipe1height,
  pipe2height,
  pipe3height,
  startX,
  startY,
  wiggleDelta,
  topFill;
var background,
  bird,
  ground,
  pipe,
  prize,
  coin,
  poop,
  coins,
  poops,
  bottomPipe,
  boxes,
  pipes,
  rotationDelta,
  counter,
  counterOutline,
  highScore,
  highScoreOutline;
var prizeBox;
var started = false;
var startJump = false; // Has the jump started?

var jumpAmount = 120; // How high is the jump?
var jumpTime = 266;

var dead = false; // is the bird dead?
var KEYCODE_SPACE = 32; //usefull keycode
var gap = 350;
var staticGap = 350;
var countPipes = 0;
var masterPipeDelay = 1.5; // delay between pipes
var pipeDelay = masterPipeDelay; //counter used to monitor delay
var restartable = false;
var rd = 0;
var health = 10;
var token; // the token we can use to submit our score

var counterShow = false;

let modeOn = false;
let modeFromPipes = 0;
let modeType = 0; // 0 NEGATIVE 1 POSITIVE
let modeCount = 0;

 function init() {
  document.onkeydown = handleKeyDown;

  // createjs.MotionGuidePlugin.install();

  stage = new createjs.Stage("testCanvas");

  createjs.Touch.enable(stage);
  // stage.canvas.width = document.body.clientWidth; //document.width is obsolete
  // stage.canvas.height = document.body.clientHeight; //document.height is obsolete

  // grab canvas width and height for later calculations:
  w = stage.canvas.width;
  h = stage.canvas.height;

  manifest = [
    { src: "src/assets/img/bird.png", id: "bird" },
    { src: "src/assets/img/background2.png", id: "background" },
    { src: "src/assets/img/ground2.png", id: "ground" },
    { src: "src/assets/img/pipe.png", id: "pipe" },
    { src: "src/assets/img/restart.png", id: "start" },
    { src: "src/assets/img/score.png", id: "score" },
    { src: "src/assets/img/share.png", id: "share" },
    { src: "src/assets/img/box.png", id: "prize" },
    { src: "src/assets/img/poop.png", id: "poop" },
    { src: "src/assets/img/coin.png", id: "coin" },
    { src: "src/assets/img/add-to-leaderboard.png", id: "leaderboard" },
    { src: "src/assets/fonts/FB.eot" },
    { src: "src/assets/fonts/FB.svg" },
    { src: "src/assets/fonts/FB.ttf" },
    { src: "src/assets/fonts/FB.woff" },
  ];

  loader = new createjs.LoadQueue(false);
  loader.addEventListener("complete", handleComplete);
  loader.loadManifest(manifest);
}

let modeText;

function handleComplete() {
  background = new createjs.Shape();
  background.graphics
    .beginBitmapFill(loader.getResult("background"))
    .drawRect(0, 0, w, h);
  background.y = 0 + outerPadding;

  var groundImg = loader.getResult("ground");
  ground = new createjs.Shape();
  ground.graphics
    .beginBitmapFill(groundImg)
    .drawRect(0, 0, w + groundImg.width, groundImg.height);
  ground.tileW = groundImg.width;
  ground.y = h - groundImg.height - outerPadding;

  var data = new createjs.SpriteSheet({
    images: [loader.getResult("bird")],
    //set center and size of frames, center is important for later bird roation
    frames: { width: 92, height: 64, regX: 46, regY: 32, count: 3 },
    // define two animations, run (loops, 0.21x speed) and dive (returns to dive and holds frame one static):
    animations: { fly: [0, 2, "fly", 0.21], dive: [1, 1, "dive", 1] },
  });
  bird = new createjs.Sprite(data, "fly");

  startX = w / 2 - 92 / 2;
  startY = 512 + outerPadding;
  wiggleDelta = 18;

  // Set initial position and scale 1 to 1
  bird.setTransform(startX, startY, 1, 1);
  // Set framerate
  bird.framerate = 30;

  //338, 512
  // Use a tween to wiggle the bird up and down using a sineInOut Ease
  createjs.Tween.get(bird, { loop: true })
    .to({ y: startY + wiggleDelta }, 380, createjs.Ease.sineInOut)
    .to({ y: startY }, 380, createjs.Ease.sineInOut);

  stage.addChild(background);

  // Add padding to the top to make up for the small background graphic
  topFill = new createjs.Graphics();
  topFill.beginFill("#70c5ce").rect(0, 0, w, outerPadding); //color of the sky
  topFill = new createjs.Shape(topFill);
  stage.addChild(topFill);

  pipes = new createjs.Container();
  boxes = new createjs.Container();
  poops = new createjs.Container();
  coins = new createjs.Container();
  stage.addChild(pipes, boxes, poops, coins);

  stage.addChild(bird, ground);
  stage.addEventListener("stagemousedown", handleJumpStart);

  // Same thing as topFill on the bottom, but after the bird, ground
  // and pipes because they'll always be behind this layer
  bottomFill = new createjs.Graphics();
  bottomFill.beginFill("#ded895").rect(0, h - outerPadding, w, outerPadding); //color of the ground
  bottomFill = new createjs.Shape(bottomFill);
  stage.addChild(bottomFill);

  counter = createText(false, "#ffffff", 1, "86px");
  modeText = createText(false, "#ffffff", 1, "86px");
  counterOutline = createText(true, "#000000", 1, "86px");
  highScore = createText(false, "#ffffff", 0, "60px");
  highScoreOutline = createText(true, "#000000", 0, "60px");
  modeText.y = 260;
  modeText.alpha = 0;

  stage.addChild(modeText, counter, counterOutline);

  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.interval = 100;
  createjs.Ticker.addEventListener("tick", tick);

  // setHeight()

  console.log(window.eventService.getUser());
  if (window.eventService.getUser()) {
    highScore.text = 0;
    highScoreOutline.text = 0;
  }
  /*  if (supports_html5_storage()) {
      var storage = localStorage.getItem("highScore");
      if (storage) {
        highScore.text = storage;
        highScoreOutline.text = storage;
      } else {
        localStorage.setItem("highScore", 0);
      }
    } else {
      var myCookie = document.cookie.replace(/(?:(?:^|.*;\s*)highScore\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      if (myCookie) {
        highScore.text = myCookie;
        highScoreOutline.text = myCookie;
      } else {
        document.cookie = "highScore=0";
      }
    }*/
}

function handleKeyDown(e) {
  //cross browser issues exist
  if (!e) {
    var e = window.event;
  }
  if (e.keyCode == KEYCODE_SPACE) {
    spacebar();
    return false;
  }
}

function spacebar() {
  handleJumpStart();
  if (dead && restartable) {
    restart();
    restartable = false;
  }
  return false;
}

function handleJumpStart() {
  if (!dead) {
    createjs.Tween.removeTweens(bird);
    bird.gotoAndPlay("fly");

    if (bird.y < -200) {
      bird.y = -200;
    }

    if (bird.roation < 0) {
      rotationDelta = (-bird.rotation - 20) / 5;
    } else {
      rotationDelta = (bird.rotation + 20) / 5;
    }

    createjs.Tween.get(bird)
      .to(
        {
          y: bird.y - rotationDelta,
          rotation: -20,
        },
        rotationDelta,
        createjs.Ease.linear,
      ) //rotate to jump position and jump bird
      .to(
        {
          y: bird.y - jumpAmount,
          rotation: -20,
        },
        jumpTime - rotationDelta,
        createjs.Ease.quadOut,
      ) //rotate to jump position and jump bird
      .to({ y: bird.y }, jumpTime, createjs.Ease.quadIn) //reverse jump for smooth arch
      .to({ y: bird.y + 200, rotation: 90 }, 380 / 1.5, createjs.Ease.linear) //rotate back
      .call(diveBird) // change bird to diving position
      .to(
        { y: ground.y - 30 },
        (h - (bird.y + 200)) / 1.5,
        createjs.Ease.linear,
      ); //drop to the bedrock

    if (!started) {
      token = undefined; // clear the previous token
      getNewScore(function (tk) {
        token = tk;
      });
      started = true;
      counterShow = true;
      bird.framerate = 60;
    }
  }
}

function diveBird() {
  bird.gotoAndPlay("dive");
}

function restart() {
  $("canvas").trigger("gameRestart");

  //hide anything on stage and show the score
  pipes.removeAllChildren();
  boxes.removeAllChildren();
  coins.removeAllChildren();
  poops.removeAllChildren();
  createjs.Tween.get(start)
    .to({ y: start.y + 10 }, 50)
    .call(removeStart);
  counter.text = 0;
  counterOutline.text = 0;
  counterOutline.alpha = 0;
  counter.alpha = 0;
  counter.font = "86px 'Flappy Bird'";
  counterOutline.font = counter.font;
  counter.y = 150 + outerPadding;
  modeText.y = 250 + outerPadding;
  modeText.text = "REKT";
  modeText.font = "86px 'Flappy Bird'";
  counterOutline.y = counter.y;
  counterShow = false;
  highScore.alpha = 0;
  highScoreOutline.alpha = 0;
  pipeDelay = masterPipeDelay;
  dead = false;
  started = false;
  startJump = false;
  createjs.Tween.removeTweens(bird);
  bird.x = startX;
  bird.y = startY;
  bird.rotation = 0;
  rd = 0;
  createjs.Tween.get(bird, { loop: true })
    .to({ y: startY + wiggleDelta }, 380, createjs.Ease.sineInOut)
    .to({ y: startY }, 380, createjs.Ease.sineInOut);
}

function die() {
  $("canvas").trigger("gameEnd");

  dead = true;
  bird.gotoAndPlay("dive");
  gap = staticGap;

  modeOn = false;
  modeType = 0;
  modeFromPipes = 0;
  modeCount = 0;

  /*  ga('send', 'event', "Flappy Bird", "Score", counter.text, counter.text);*/
  /*  highScore.text = 500;
    highScoreOutline.text = 500;*/
  if (counter.text > highScore.text) {
    highScore.text = counter.text;
    highScoreOutline.text = counterOutline.text;

    /*    if (supports_html5_storage()) {
          localStorage.setItem("highScore", counter.text);
        } else {
          document.cookie = "highScore=" + counter.text;
        }*/
  }

  // window.eventService.sendEvent({
  //   type: "final",
  //   data: Number(counter.text),
  // });

  createjs.Tween.removeTweens(bird);
  createjs.Tween.get(bird)
    .wait(0)
    .to({ y: bird.y + 200, rotation: 90 }, 380 / 1.5, createjs.Ease.linear) //rotate back
    .call(diveBird) // change bird to diving position
    .to({ y: ground.y - 30 }, (h - (bird.y + 200)) / 1.5, createjs.Ease.linear); //drop to the bedrock
  createjs.Tween.get(stage).to({ alpha: 0 }, 100).to({ alpha: 1 }, 100);

  score = addImageAtCenter("score", 0, -150);
  start = addImageAtCenter("start", -120, 50);
  share = addImageAtCenter("share", 120, 50);
  leaderboard = addImageAtCenter("leaderboard", 0, 150);

  stage.removeChild(counter, counterOutline);
  //prizeBox = addImageAtCenter('prize', 0, -150);
  stage.addChild(score);
  stage.addChild(start);
  stage.addChild(share);
  stage.addChild(leaderboard);

  counter.y = counter.y + 160;
  counter.font = "60px 'Flappy Bird'";
  counterOutline.y = counter.y;
  counterOutline.font = "60px 'Flappy Bird'";
  counter.alpha = 0;
  counterOutline.alpha = 0;

  modeText.y = 260;
  modeText.font = "60px 'Flappy Bird'";
  modeText.alpha = 0;

  // highScore.text = 30
  // highScoreOutline.text = 30
  highScore.y = counter.y + 80;
  highScoreOutline.y = highScore.y;

  stage.addChild(counter, counterOutline, highScore, highScoreOutline);

  //dropIn(prizeBox);
  dropIn(score);
  dropIn(start);
  dropIn(leaderboard);
  dropIn(counter);
  dropIn(counterOutline);
  dropIn(highScore);
  dropIn(highScoreOutline);
  createjs.Tween.get(share)
    .to({ alpha: 1, y: share.y + 50 }, 400, createjs.Ease.sineIn)
    .call(addClickToStart);
}

function removeStart() {
  stage.removeChild(start);
  stage.removeChild(share);
  stage.removeChild(score);
  stage.removeChild(leaderboard);
}

function addClickToStart(item) {
  start.addEventListener("click", restart);
  share.addEventListener("click", goShare);
  leaderboard.addEventListener("click", function () {
    submitScore(token);
  });
  restartable = true;
}

function dropIn(item) {
  createjs.Tween.get(item).to(
    { alpha: 1, y: item.y + 50 },
    400,
    createjs.Ease.sineIn,
  );
}

function addImageAtCenter(id, xOffset, yOffset) {
  var image = new createjs.Bitmap(loader.getResult(id));
  image.alpha = 0;
  image.x = w / 2 - image.image.width / 2 + xOffset;
  image.y = h / 2 - image.image.height / 2 + yOffset;
  return image;
}

function createText(isOutline, color, alpha, fontSize) {
  var text = new createjs.Text(0, fontSize + " 'Flappy Bird'", color);
  if (isOutline) {
    text.outline = 5;
  }
  text.color = color;
  text.textAlign = "center";
  text.x = w / 2;
  text.y = 150 + outerPadding;
  text.alpha = alpha;
  return text;
}

function goShare() {
  // window.eventService.sendEvent({
  //   type: "share",
  //   data: Number(counter.text),
  // });
  //window.open("http://twitter.com/share?url=http%3A%2F%2Fflappybird.io&text=I scored " + countText + " on HTML5 Flappy Bird.");
}

// function showAd() {
//     $('.in-game-unit')
// }

function supports_html5_storage() {
  try {
    localStorage.setItem("test", "foo");
    return "localStorage" in window && window.localStorage !== null;
  } catch (e) {
    return false;
  }
}

function tick(event) {
  var deltaS = event.delta / 1000;

  var l = pipes.numChildren;

  if (bird.y > ground.y - 40) {
    if (!dead) {
      console.log(health);
      if (health > 0) {
        // window.eventService.reduceHealth();
        handleJumpStart();
      } else {
        die();
      }
    }
    if (bird.y > ground.y - 30) {
      createjs.Tween.removeTweens(bird);
    }
  }

  if (!dead) {
    ground.x = (ground.x - deltaS * 300) % ground.tileW;
  }

  if (started && !dead) {
    rd = rd + deltaS;
    if (pipeDelay < 0) {
      if (countPipes > 10 && countPipes <= 20) {
        gap -= 3;
      } else if (countPipes > 20 && countPipes <= 50) {
        gap -= 5;
      } else if (countPipes > 50) {
        if (gap < staticGap) {
          gap += 5;
        }
      }

      let changedGap = modeOn ? gap + (modeType === 0 ? -30 : 30) : gap;

      pipe = new createjs.Bitmap(loader.getResult("pipe"));
      pipe.x = w + 600;
      pipe.y = (ground.y - changedGap * 2) * Math.random() + changedGap * 1.5;
      pipes.addChild(pipe);
      console.log(pipe);

      if (pipes.numChildren % 5 === 0) {
        prize = new createjs.Bitmap(loader.getResult("prize"));
        prize.x = w + 630;
        prize.y = pipe.y - changedGap + 100;
        boxes.addChild(prize);
        dropIn(prize);
      }

      let isTop = Math.floor(Math.random() * 100) % 2 === 1;

      /*      if(isBad) {
              poop = new createjs.Bitmap(loader.getResult("poop"));
              poop.x = w + 430;
              poop.y = isTop ? 100 : ground.y - 300;/!*(ground.y - gap * 2) * Math.random() + gap * 1.5;*!/
              poops.addChild(poop);
              dropIn(poop);
            } else {

            }*/
      if (!modeOn) {
        coin = new createjs.Bitmap(loader.getResult("coin"));
        coin.x = w + 430;
        coin.y = isTop ? 100 : ground.y - 300;
        coins.addChild(coin);
        dropIn(coin);
      }
      // createjs.Tween.get(pipe).to({x:0 - pipe.image.width}, 5100)

      pipe2 = new createjs.Bitmap(loader.getResult("pipe"));
      pipe2.scaleX = -1;
      pipe2.rotation = 180;
      pipe2.x = pipe.x; //+ pipe.image.width
      pipe2.y = pipe.y - changedGap;
      // createjs.Tween.get(pipe2).to({x:0 - pipe.image.width}, 5100)

      pipes.addChild(pipe2);

      pipeDelay = masterPipeDelay;
    } else {
      pipeDelay = pipeDelay - 1 * deltaS;
    }
    for (var i = 0; i < l; i++) {
      pipe = pipes.getChildAt(i);
      prize = boxes.getChildAt(i);
      poop = poops.getChildAt(i);
      coin = coins.getChildAt(i);
      if (prize) {
        if (true) {
          var collision = ndgmr.checkRectCollision(prize, bird, 1, true);
          if (collision) {
            if (collision.width > 30 && collision.height > 30) {
              // window.eventService.sendEvent({
              //   type: "box",
              //   data: pipes.numChildren,
              // });
              boxes.removeChild(prize);
            }
          }
        }
        prize.x = prize.x - deltaS * 300;
        if (prize.x + prize.image.width <= -prize.w) {
          boxes.removeChild(prize);
        }
      }
      /*      if(poop) {
              if(true) {
                var collision = ndgmr.checkRectCollision(poop, bird, 1, true);
                if (collision) {
                  if (collision.width > 30 && collision.height > 30) {
                    poops.removeChild(poop);
                  }
                }
              }
              poop.x = (poop.x - deltaS * 300);
              if (poop.x + poop.image.width <= -poop.w) {
                poops.removeChild(poop);
              }
            }*/

      if (coin) {
        if (true) {
          var collision = ndgmr.checkRectCollision(coin, bird, 1, true);
          if (collision) {
            if (collision.width > 30 && collision.height > 30) {
              let isBad = Math.floor(Math.random() * 100) % 2 === 1;
              modeText.text = isBad ? "REKT" : "GOD";
              modeText.alpha = 1;
              modeFromPipes = countPipes;
              modeType = isBad ? 0 : 1;
              modeOn = true;
              modeCount = 0;

              coins.removeAllChildren();
            }
          }
        }
        try {
          coin.x = coin.x - deltaS * 300;
          if (coin.x + coin.image.width <= -coin.w) {
            coins.removeChild(coin);
          }
        } catch (e) {}
      }

      if (pipe) {
        let removed = false;
        if (true) {
          // tried replacing true with this, but it's off: pipe.x < bird.x + 92 && pipe.x > bird.x
          var collision = ndgmr.checkRectCollision(pipe, bird, 1, true);
          if (collision) {
            if (collision.width > 8 && collision.height > 8) {
              console.log(health);
              if (health > 0) {
                // window.eventService.reduceHealth();
                pipes.removeChild(pipe);
                removed = true;
              } else {
                die();
              }
            }
          }
        }
        if (!removed) {
          pipe.x = pipe.x - deltaS * 300;
          if (pipe.x <= 338 && pipe.rotation === 0 && pipe.name != "counted") {
            pipe.name = "counted"; //using the pipe name to count pipes
            counter.text = counter.text + 1;
            // window.eventService.sendEvent({
            //   type: "count",
            //   data: Number(counter.text),
            // });
            counterOutline.text = counterOutline.text + 1;
            countPipes += 1;
            modeCount += 1;
            if (modeCount > 10) {
              modeOn = false;
              modeCount = 0;
            }
          }
          if (pipe.x + pipe.image.width <= -pipe.w) {
            pipes.removeChild(pipe);
          }
        }
      }
    }
    if (counterShow) {
      counter.alpha = 1;
      counterOutline.alpha = 1;
      counterShow = false;
    }

    if (modeOn) {
      modeText.alpha = 1;
    } else {
      modeText.alpha = 0;
    }
  }
  stage.update(event);
}

/*
var apiUrl = 'flappy-backend.fly.dev';//'localhost:3001'//
var rootUrl = 'flappybird.io';//'localhost:4000'//
*/

function retreiveScore() {
  /*  var hash = location.hash.substring(1);
    $.get( "https://" + apiUrl + "/scores/" + hash, {}, function(data) {
      $('.score').html(data.count);
    }, "json");*/
}

function submitScore(token) {
  /*  console.log('SUMBIT')
    ga('send', 'event', "Flappy Bird", "Score Time", counter.text + " - " + rd, rd);
    $.post( "https://" + apiUrl + "/scores/" + token + "?count=" + counter.text, { }, function(data) {
      window.location = "http://" + window.location.host + "/leaderboard/new/#" + token;
    }, "json");*/
}

function updateScore(name) {
  /*  var hash = location.hash.substring(1);
    $.ajax( {
      type: "post",
      url: "https://" + apiUrl + "/scores/" + hash + "?name="+name,
      success: function(data) {
        console.log(data)
        if (data.msg === "ok") {
          $('.error').hide();
          window.location = "http://" + window.location.host + "/leaderboard/";
        } else {
          $('.error').show().text(data.msg);
          ga('send', 'event', "Flappy Bird", "Name", name);
        }
      },
      error: function(data) {
        $('.error').show().text(data.responseJSON.msg);
      },
    });*/
}

function getNewScore(cb) {
  /*  $.post("https://" + apiUrl + "/scores", {}, function(data) {
      cb(data.token)
    })*/
}

function listScores() {
  /*  $.get( "https://" + apiUrl + "/scores", {}, function(data) {
      $('.loading').remove();
      for (var i=0;i<data.day.length;i++)
      {
        var element = $('<tr><td>' +
          '</td><td>' +
          data.day[i].count +
          '</td></tr>');
        element.children('td').eq(0).text(data.day[i].name);
        $('.day').append(element);
      }
      for (var n=0 ;n<data.hour.length;n++)
      {
        var element2 = $('<tr><td>' +
          '</td><td>' +
          data.hour[n].count +
          '</td></tr>');
        element2.children('td').eq(0).text(data.hour[n].name);
        $('.hour').append(element2);
      }
    }, "json");*/
}
