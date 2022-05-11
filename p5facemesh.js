var my_results;
function p5facemesh_setup() {

    const videoElement = document.getElementsByClassName('input_video')[0];
    const p5canvas = createCanvas(1280, 720);//document.getElementsByClassName('output_canvas')[0];
    const canvasElement = p5canvas.elt;
    const canvasCtx = canvasElement.getContext('2d');
    pixelDensity(1.0);
    //    noLoop();

    function onResults(results) {

        //my_results = results;
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(
            results.image, 0, 0, canvasElement.width, canvasElement.height);
        if (results.multiFaceLandmarks) {
            for (const landmarks of results.multiFaceLandmarks) {
                drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION,
                    { color: '#C0C0C070', lineWidth: 1 });
                drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, { color: '#FF3030' });
                drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, { color: '#FF3030' });
                drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, { color: '#FF3030' });
                drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, { color: '#30FF30' });
                drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, { color: '#30FF30' });
                drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, { color: '#30FF30' });
                drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, { color: '#E0E0E0' });
                drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, { color: '#E0E0E0' });
            }
        }
        canvasCtx.restore();
        draw();
    }

    const faceMesh = new FaceMesh({
        locateFile: (file) => {
            console.log(file);
            //return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
            return `data/${file}`;
        }
    });
    faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    faceMesh.onResults(onResults);

    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await faceMesh.send({ image: videoElement });
        },
        width: 1280,
        height: 720
    });
    camera.start();
}