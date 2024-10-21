//Initalisation
let growthSpeed = 0.5; // Speed at which the circles move at
let maxSize = 50; // Maximum size of the circles (apples)
let circleSizes = []; // Array to store sizes of circles for animation
let noiseOffsets = []; // Array to store noise offsets for each circle's movement

function setup() {
  createCanvas(windowWidth, windowHeight); // The canvas is set to the windows width and height.
  background(50, 70, 100); // Background similar to the textured blue tone

  // Initialize circle sizes and noise offsets for animation
  let totalCircles = 6 + 4 * 2 + 3 * 2 + 2 * 2; // Total number of circles on the tree
  for (let i = 0; i < totalCircles; i++) {
    circleSizes.push(0); // Start with size 0 for all circles
    noiseOffsets.push(random(1000)); // Random noise seed for each circle's movement
  }
}

function draw() {
  background(78, 104, 119); // Redraw background each frame to avoid trails

  drawBaseStructure();
  drawCircles();

  // Increase the size of the circles over time
  for (let i = 0; i < circleSizes.length; i++) {
    if (circleSizes[i] < maxSize) {
      circleSizes[i] += growthSpeed; // Grow the circle size
    }
  }
}

// Draw the base structure (the pot-like structure)
function drawBaseStructure() {
  fill(150, 180, 100); // Yellowish tone for the base
  noStroke();
  rectMode(CENTER);
  rect(width / 2, height - 150, 300, 80); // The demensions of the rectangle

  fill(80, 160, 90); // Green tone for semi-circles
  for (let i = 0; i < 5; i++) {
    arc(width / 2 - 120 + i * 60, height - 150, 60, 60, PI, 0); // The location of the green semicircles
  }

  fill(200, 60, 60); // Red tone for semi-circles
  for (let i = 0; i < 4; i++) {
    arc(width / 2 - 90 + i * 60, height - 150, 60, 60, 0, PI); // The location of the red semicircles
  }
}

// Draw the circles to represent the branches and leaves with Perlin noise
function drawCircles() {
  let currentIndex = 0;
  let circleSize = 50; // Max radius for the main circles

  // Draw circles along the trunk
  drawVerticalCircles(width / 2, height - 200, 6, circleSize, currentIndex);
  currentIndex += 6; // Increment index for next set of circles

  // Draw branches with circles
  drawHorizontalCircles(width / 2, height - 450, 4, circleSize, -1, currentIndex); // The location of the circles on the middle left branch of the tree
  currentIndex += 4;
  drawHorizontalCircles(width / 2, height - 450, 4, circleSize, 1, currentIndex); // The location of the circles on the middle right branch of the tree
  currentIndex += 4;

  drawHorizontalCircles(width / 2, height - 350, 3, circleSize, -1, currentIndex); // The location of the cirles on the bottom left branch of the tree
  currentIndex += 3;
  drawHorizontalCircles(width / 2, height - 350, 3, circleSize, 1, currentIndex); // The location of the circles on the bottom right branch of the tree
  currentIndex += 3;

  drawHorizontalCircles(width / 2, height - 550, 2, circleSize, -1, currentIndex);
  currentIndex += 2; // The loaction of the circles on the top left branch of the tree
  drawHorizontalCircles(width / 2, height - 550, 2, circleSize, 1, currentIndex); // The location of the circles on the top right branch of the tree
}

// Draw vertical circles (trunk-like structure) with Perlin noise
function drawVerticalCircles(x, y, count, size, indexStart) {
  for (let i = 0; i < count; i++) {
    let noiseX = map(noise(noiseOffsets[indexStart + i] + frameCount * 0.01), 0, 1, -10, 10); // Perlin noise for horizontal movement
    let noiseY = map(noise(noiseOffsets[indexStart + i] + 1000 + frameCount * 0.01), 0, 1, -10, 10); // Perlin noise for vertical movement
    let circleSize = circleSizes[indexStart + i]; // Get the current size for animation
    drawColoredCircle(x + noiseX, y - i * size * 1.2 + noiseY, circleSize);
    if (i > 0) {
      // Draw lines between circles to create trunk-like connection
      drawLine(x, y - (i - 1) * size * 1.2, x, y - i * size * 1.2);
    }
  }
}

// Draw horizontal circles (branch-like structure) with Perlin noise
function drawHorizontalCircles(x, y, count, size, direction, indexStart) {
  for (let i = 1; i <= count; i++) {
    let noiseX = map(noise(noiseOffsets[indexStart + i - 1] + frameCount * 0.01), 0, 1, -10, 10); // Perlin noise for horizontal movement
    let noiseY = map(noise(noiseOffsets[indexStart + i - 1] + 1000 + frameCount * 0.01), 0, 1, -10, 10); // Perlin noise for vertical movement
    let xPos = x + i * size * 1.2 * direction + noiseX;
    let circleSize = circleSizes[indexStart + i - 1]; // Get the current size for animation
    drawColoredCircle(xPos, y + noiseY, circleSize);
    // Draw lines connecting the circles to form branches
    drawLine(x, y, xPos, y);
  }
}

// Draw a colored circle with alternating red and green halves
function drawColoredCircle(x, y, size) {
  noStroke();
  fill(200, 60, 60); // Red
  arc(x, y, size, size, PI, 0); // Top half red
  fill(80, 160, 90); // Green
  arc(x, y, size, size, 0, PI); // Bottom half green
}

// Draw a line between two points
function drawLine(x1, y1, x2, y2) {
  stroke(100, 50, 50, 150); // Soft brownish color for branches
  strokeWeight(3);
  line(x1, y1, x2, y2);
}

function resizeCanvas(){
  resizeCanvas(windowWidth, windowHeight);
}