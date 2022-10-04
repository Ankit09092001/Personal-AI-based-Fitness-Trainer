let detector;
let poses;
let video;

async function init() {
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    { modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER }
  );//to create a detector with thunder version.
   
  edges = {
    "5,7": "m",
    "7,9": "m",
    "6,8": "c",
    "8,10": "c",
    "5,6": "y",
    "5,11": "m",
    "6,12": "c",
    "11,12": "y",
    "11,13": "m",
    "13,15": "m",
    "12,14": "c",
    "14,16": "c",
  };
  await getPoses();
}

async function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();

  await init();
}

async function getPoses() {
  poses = await detector.estimatePoses(video.elt);
  setTimeout(getPoses, 0);
}

function draw() {
  background(220);
  translate(width,0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);

  //calling function to Draw keypoints and skeleton
  drawKeypoints();
  drawSkeleton();

}

// used to draw keypoints on joints
function drawKeypoints() {
  if (poses && poses.length > 0) {
    for (let kp of poses[0].keypoints) {
      const { x, y, score } = kp;
      if (score > 0.3) {
        fill(255);
        stroke(0);
        strokeWeight(4);
        circle(x, y, 16);
      }
    }
  }
}

// Draws lines between the keypoints
function drawSkeleton() {
  confidence_threshold = 0.5;

  if (poses && poses.length > 0) {
    for (const [key] of Object.entries(edges)) {
      const p = key.split(",");
      const p1 = p[0];
      const p2 = p[1];

      const y1 = poses[0].keypoints[p1].y;
      const x1 = poses[0].keypoints[p1].x;
      const c1 = poses[0].keypoints[p1].score;
      const y2 = poses[0].keypoints[p2].y;
      const x2 = poses[0].keypoints[p2].x;
      const c2 = poses[0].keypoints[p2].score;

      if (c1 > confidence_threshold && c2 > confidence_threshold) {
        strokeWeight(3);
        stroke("rgb(0, 255, 0)");
        line(x1, y1, x2, y2);
      }

    }
  }
}
