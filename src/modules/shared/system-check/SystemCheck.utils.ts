import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

let faceLandmarker: FaceLandmarker | null = null;

// Initialize MediaPipe Face Landmarker using CDN to avoid serving heavy WASM locally
export const initFaceLandmarker = async (): Promise<FaceLandmarker> => {
  if (faceLandmarker) return faceLandmarker;

  const filesetResolver = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
  );

  faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
      delegate: 'GPU'
    },
    outputFaceBlendshapes: true,
    runningMode: 'VIDEO',
    numFaces: 2 // Detect multiple to warn
  });

  return faceLandmarker;
};

export const setupAudioAnalysis = (
  stream: MediaStream, 
  onVolumeChange: (vol: number) => void,
  onNoiseDetected: (isNoise: boolean) => void
) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const analyser = audioContext.createAnalyser();
  const microphone = audioContext.createMediaStreamSource(stream);

  analyser.smoothingTimeConstant = 0.8;
  analyser.fftSize = 1024;

  microphone.connect(analyser);

  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  let animationFrameId: number;

  const analyze = () => {
    analyser.getByteFrequencyData(dataArray);
    
    // Calculate volume
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    const volume = Math.min(100, Math.max(0, (average / 128) * 100)); // Normalize 0-100
    
    onVolumeChange(volume);

    // Basic background noise heuristic (consistent low-frequency amplitude when no one is speaking)
    const isNoise = average > 15 && average < 40; 
    onNoiseDetected(isNoise);

    animationFrameId = requestAnimationFrame(analyze);
  };

  analyze();

  return () => {
    cancelAnimationFrame(animationFrameId);
    audioContext.close();
  };
};
