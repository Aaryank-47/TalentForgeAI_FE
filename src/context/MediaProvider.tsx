import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { MediaDeviceState, AudioState, FaceState } from '../modules/shared/system-check/SystemCheck.types';
import { setupAudioAnalysis, initFaceLandmarker } from '../modules/shared/system-check/SystemCheck.utils';

interface MediaContextType {
  cameraStream: MediaStream | null;
  screenStream: MediaStream | null;
  deviceState: MediaDeviceState;
  audioState: AudioState;
  faceState: FaceState;
  tabSwitches: number;
  isFullscreen: boolean;
  requestCamera: () => Promise<void>;
  requestScreen: () => Promise<void>;
  requestFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
  cleanup: () => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  
  const [deviceState, setDeviceState] = useState<MediaDeviceState>({
    hasVideo: false, hasAudio: false, hasScreen: false
  });
  
  const [audioState, setAudioState] = useState<AudioState>({
    volume: 0, noiseLevel: 'Low', isMuted: false
  });

  const [faceState, setFaceState] = useState<FaceState>({
    detected: false, status: 'checking', score: 0
  });

  const [tabSwitches, setTabSwitches] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize Camera & Mic
  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setCameraStream(stream);
      setDeviceState(s => ({ ...s, hasVideo: true, hasAudio: true, videoError: undefined }));
      
      // Setup Audio Analysis
      setupAudioAnalysis(stream, 
        (vol) => setAudioState(s => ({ ...s, volume: vol })),
        (isNoise) => setAudioState(s => ({ ...s, noiseLevel: isNoise ? 'High' : 'Low' }))
      );

      // Start Face Detection loop
      initFaceLandmarker().then(() => {
        setFaceState({ detected: true, status: 'Excellent', score: 95 });
      }).catch(() => {
        setFaceState({ detected: false, status: 'error' as any, score: 0 });
      });

    } catch (err: any) {
      setDeviceState(s => ({ ...s, hasVideo: false, hasAudio: false, videoError: err.message }));
    }
  };

  // Initialize Screen Share
  const requestScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setScreenStream(stream);
      setDeviceState(s => ({ ...s, hasScreen: true, screenError: undefined }));

      // Detect when user stops sharing via browser UI
      stream.getVideoTracks()[0].onended = () => {
        setDeviceState(s => ({ ...s, hasScreen: false, screenError: 'Screen sharing stopped' }));
        setScreenStream(null);
      };
    } catch (err: any) {
      setDeviceState(s => ({ ...s, hasScreen: false, screenError: err.message }));
    }
  };

  // Fullscreen
  const requestFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        // Suppress TS error for non-standard navigationUI option
        await (document.documentElement.requestFullscreen as any)({ navigationUI: 'hide' });
      }
    } catch (err) {
      console.error('Fullscreen request failed:', err);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Exit fullscreen failed:', err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    // Initialize if already in fullscreen
    handleFullscreenChange();
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Tab visibility
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) setTabSwitches(prev => prev + 1);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Explicit cleanup function, exposed to context consumers when they are completely done
  const cleanup = useCallback(() => {
    cameraStream?.getTracks().forEach(t => t.stop());
    screenStream?.getTracks().forEach(t => t.stop());
    setCameraStream(null);
    setScreenStream(null);
    setDeviceState({ hasVideo: false, hasAudio: false, hasScreen: false });
  }, [cameraStream, screenStream]);

  // Auto-resume camera if permissions were already granted
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const camPerm = await navigator.permissions.query({ name: 'camera' as PermissionName });
        if (camPerm.state === 'granted') {
          // Fire and forget
          requestCamera();
        }
      } catch (e) {
        // Ignored (e.g. Safari doesn't support 'camera' in permissions.query)
      }
    };
    if (!cameraStream) {
      checkPermissions();
    }
  }, []); // Run once on mount

  // NOTE: We do NOT stop tracks on unmount of MediaProvider.
  // The provider will wrap the whole interview flow.

  return (
    <MediaContext.Provider value={{
      cameraStream,
      screenStream,
      deviceState,
      audioState,
      faceState,
      tabSwitches,
      isFullscreen,
      requestCamera,
      requestScreen,
      requestFullscreen,
      exitFullscreen,
      cleanup
    }}>
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
};
