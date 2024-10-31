// Dynamic background color variables
let dayLength = 600; // Duration of a day (in frames)
let sunriseColor, noonColor, sunsetColor, nightColor;

// Tree animation variables
let growthSpeed = 0.5;
let maxSize = 50;
let circleSizes = [];
let noiseOffsets = [];
let swayNoiseOffset; // Noise offset for sway effect

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Initialize dynamic background colors
  nightColor = color(20, 24, 82);      // Night color (deep blue)
  sunriseColor = color(255, 160, 80);  // Sunrise color (orange)
  noonColor = color(135, 206, 250);    // Daytime color (light blue)
  sunsetColor = color(255, 99, 71);    // Sunset color (orange-red)

  // Initialize tree parameters
  let totalCircles = 6 + 4 * 2 + 3 * 2 + 2 * 2;
  swayNoiseOffset = random(1000); // Initialize noise offset for sway effect
  for (let i = 0; i < totalCircles; i++) {
    circleSizes.push(0);          // Initial size of all circles is 0
    noiseOffsets.push(random(1000)); // Random noise offset for each circle
  }
}

function draw() {
  // Calculate current background color (transitioning from night to sunrise, daytime, and then sunset)
  let timeOfDay = frameCount % dayLength;
  let r, g, b;
  if (timeOfDay < dayLength / 4) { // Sunrise
    let sunriseProgress = sin(map(timeOfDay, 0, dayLength / 4, -HALF_PI, HALF_PI));
    r = lerp(red(nightColor), red(sunriseColor), sunriseProgress);
    g = lerp(green(nightColor), green(sunriseColor), sunriseProgress);
    b = lerp(blue(nightColor), blue(sunriseColor), sunriseProgress);
  } else if (timeOfDay < dayLength / 2) { // Daytime
    let dayProgress = sin(map(timeOfDay, dayLength / 4, dayLength / 2, -HALF_PI, HALF_PI));
    r = lerp(red(sunriseColor), red(noonColor), dayProgress);
    g = lerp(green(sunriseColor), green(noonColor), dayProgress);
    b = lerp(blue(sunriseColor), blue(noonColor), dayProgress);
  } else if (timeOfDay < (3 * dayLength) / 4) { // Sunset
    let sunsetProgress = sin(map(timeOfDay, dayLength / 2, (3 * dayLength) / 4, -HALF_PI, HALF_PI));
    r = lerp(red(noonColor), red(sunsetColor), sunsetProgress);
    g = lerp(green(noonColor), green(sunsetColor), sunsetProgress);
    b = lerp(blue(noonColor), blue(sunsetColor), sunsetProgress);
  } else { // Night
    let nightProgress = sin(map(timeOfDay, (3 * dayLength) / 4, dayLength, -HALF_PI, HALF_PI));
    r = lerp(red(sunsetColor), red(nightColor), nightProgress);
    g = lerp(green(sunsetColor), green(nightColor), nightProgress);
    b = lerp(blue(sunsetColor), blue(nightColor), nightProgress);
  }
  background(r, g, b); // Set background color

  // Draw tree animation
  drawBaseStructure();
  drawCircles();

  // Control growth of circle sizes
  for (let i = 0; i < circleSizes.length; i++) {
    if (circleSizes[i] < maxSize) {
      circleSizes[i] += growthSpeed;
    }
  }
}

// Draw the base structure (flowerpot)
function drawBaseStructure() {
  fill(150, 180, 100); // Pot color
  noStroke();
  rectMode(CENTER);
  rect(width / 2, height - 150, 300, 80);

  fill(80, 160, 90); // Green semi-circles
  for (let i = 0; i < 5; i++) {
    arc(width / 2 - 120 + i * 60, height - 150, 60, 60, PI, 0);
  }

  fill(200, 60, 60); // Red semi-circles
  for (let i = 0; i < 4; i++) {
    arc(width / 2 - 90 + i * 60, height - 150, 60, 60, 0, PI);
  }
}

// Draw circles for tree trunk and branches with noise-based sway
function drawCircles() {
  let currentIndex = 0;
  let circleSize = 50;

  drawVerticalCircles(width / 2, height - 200, 6, circleSize, currentIndex);
  currentIndex += 6;

  drawHorizontalCircles(width / 2, height - 450, 4, circleSize, -1, currentIndex);
  currentIndex += 4;
  drawHorizontalCircles(width / 2, height - 450, 4, circleSize, 1, currentIndex);
  currentIndex += 4;

  drawHorizontalCircles(width / 2, height - 350, 3, circleSize, -1, currentIndex);
  currentIndex += 3;
  drawHorizontalCircles(width / 2, height - 350, 3, circleSize, 1, currentIndex);
  currentIndex += 3;

  drawHorizontalCircles(width / 2, height - 550, 2, circleSize, -1, currentIndex);
  currentIndex += 2;
  drawHorizontalCircles(width / 2, height - 550, 2, circleSize, 1, currentIndex);
}

// Draw vertical circles (trunk) with sway effect
function drawVerticalCircles(x, y, count, size, indexStart) {
  let sway = map(noise(swayNoiseOffset + frameCount * 0.01), 0, 1, -5, 5); // Calculate sway

  for (let i = 0; i < count; i++) {
    let noiseX = map(noise(noiseOffsets[indexStart + i] + frameCount * 0.01), 0, 1, -10, 10);
    let noiseY = map(noise(noiseOffsets[indexStart + i] + 1000 + frameCount * 0.01), 0, 1, -10, 10);
    let circleSize = circleSizes[indexStart + i];
    drawColoredCircle(x + noiseX + sway, y - i * size * 1.2 + noiseY, circleSize);

    if (i > 0) {
      drawLine(x + sway, y - (i - 1) * size * 1.2, x + sway, y - i * size * 1.2);
    }
  }
}

// Draw horizontal circles (branches) with sway effect
function drawHorizontalCircles(x, y, count, size, direction, indexStart) {
  let sway = map(noise(swayNoiseOffset + frameCount * 0.01), 0, 1, -5, 5); // Calculate sway

  for (let i = 1; i <= count; i++) {
    let noiseX = map(noise(noiseOffsets[indexStart + i - 1] + frameCount * 0.01), 0, 1, -10, 10);
    let noiseY = map(noise(noiseOffsets[indexStart + i - 1] + 1000 + frameCount * 0.01), 0, 1, -10, 10);
    let xPos = x + i * size * 1.2 * direction + noiseX + sway;
    let circleSize = circleSizes[indexStart + i - 1];
    drawColoredCircle(xPos, y + noiseY, circleSize);

    drawLine(x + sway, y, xPos, y + noiseY);
  }
}

// Draw a circle with alternating red and green halves
function drawColoredCircle(x, y, size) {
  noStroke();
  fill(200, 60, 60); // Red top half
  arc(x, y, size, size, PI, 0);
  fill(80, 160, 90); // Green bottom half
  arc(x, y, size, size, 0, PI);
}

// Draw connecting line for branches
function drawLine(x1, y1, x2, y2) {
  stroke(100, 50, 50, 150);
  strokeWeight(3);
  line(x1, y1, x2, y2);
}

// Reset circle sizes on mouse click
function mousePressed() {
  for (let i = 0; i < circleSizes.length; i++) {
    circleSizes[i] = 0;
  }
}

// Adjust canvas size on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
