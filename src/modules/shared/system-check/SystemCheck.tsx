import React, { useEffect, useRef } from 'react';
import { Mic, Eye, Monitor, Volume2, AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import type { SystemCheckProps, FaceState } from './SystemCheck.types';
import { useMedia } from '../../../context/MediaProvider';

// Sub-components for reuse in Interview Room
export const CameraPreview = ({
  stream,
  faceState,
  label = "Your Camera Preview",
  compact = false
}: {
  stream: MediaStream | null;
  faceState?: FaceState;
  label?: string;
  compact?: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={`relative bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center ${compact ? 'h-20' : 'h-20 min-h-[240px]'}`}>
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
          <span className="text-slate-500 text-sm">Camera Off</span>
        </div>
      )}

      {/* Face Status Overlay */}
      {faceState && stream && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/50 backdrop-blur-sm border border-white/10 text-white">
          <Eye className="w-3 h-3" />
          {faceState.status === 'checking' ? 'Detecting Face...' : faceState.status}
        </div>
      )}

      {label && (
        <div className="absolute bottom-2 left-2 right-2 text-center">
          <span className="text-[10px] text-white/70 font-medium bg-black/40 px-2 py-1 rounded">{label}</span>
        </div>
      )}
      
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-recording-pulse" />
        <span className="text-[10px] text-white/90 font-medium bg-black/40 px-1.5 py-0.5 rounded">LIVE</span>
      </div>
    </div>
  );
};

export const ScreenPreview = ({
  stream,
  label = "Screen Share Preview",
  compact = false
}: {
  stream: MediaStream | null;
  label?: string;
  compact?: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={`relative bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center ${compact ? 'h-20' : 'h-20 min-h-[240px]'}`}>
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
          <span className="text-slate-500 text-sm">Screen Share Off</span>
        </div>
      )}

      {label && (
        <div className="absolute bottom-2 left-2 right-2 text-center">
          <span className="text-[10px] text-white/70 font-medium bg-black/40 px-2 py-1 rounded">{label}</span>
        </div>
      )}
      
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-recording-pulse" />
        <span className="text-[10px] text-white/90 font-medium bg-black/40 px-1.5 py-0.5 rounded">SHARING</span>
      </div>
    </div>
  );
};

export const MicLevelBar = ({ volume }: { volume: number }) => {
  const bars = Array.from({ length: 15 });
  return (
    <div className="flex items-end gap-0.5 h-8">
      {bars.map((_, i) => {
        const threshold = (i / bars.length) * 100;
        const isActive = volume > threshold;
        return (
          <div
            key={i}
            className={`w-1.5 rounded-sm transition-all duration-75 ${isActive ? 'bg-emerald-500' : 'bg-slate-200'}`}
            style={{ height: isActive ? `${Math.max(20, (volume / 100) * 100)}%` : '20%' }}
          />
        );
      })}
    </div>
  );
};

export const TabSwitchIndicator = ({ count, lastAt }: { count: number; lastAt?: string }) => (
  <div className={`flex items-center justify-between p-3 rounded-xl border ${count > 0 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
    <div className="flex items-center gap-2">
      <Monitor className={`w-4 h-4 ${count > 0 ? 'text-red-500' : 'text-emerald-500'}`} />
      <div>
        <p className={`text-sm font-semibold ${count > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
          {count === 0 ? 'No Tab Switches Detected' : `${count} Tab Switch${count > 1 ? 'es' : ''} Detected`}
        </p>
        {lastAt && <p className="text-[10px] text-slate-500 mt-0.5">Last at {lastAt}</p>}
      </div>
    </div>
    <span className={`text-lg font-black tabular-nums ${count > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{count}</span>
  </div>
);

export const NoiseDetectionIndicator = ({ flags, compliant }: { flags: number; compliant: boolean }) => (
  <div className={`flex items-center justify-between p-3 rounded-xl border ${!compliant ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
    <div className="flex items-center gap-2">
      <Volume2 className={`w-4 h-4 ${!compliant ? 'text-amber-500' : 'text-emerald-500'}`} />
      <div>
        <p className={`text-sm font-semibold ${!compliant ? 'text-amber-700' : 'text-emerald-700'}`}>
          {compliant ? 'Only Candidate Voice Detected' : `${flags} External Noise Event${flags > 1 ? 's' : ''}`}
        </p>
        <p className="text-xs text-slate-500">
          {compliant ? 'Environment is clean — no background voices' : 'Background noise or secondary voice detected'}
        </p>
      </div>
    </div>
    {!compliant && (
      <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">{flags}</span>
    )}
  </div>
);

export const FaceDetectionIndicator = ({ status, pct = 100 }: { status: string; pct?: number }) => {
  const good = status === 'Excellent' || status === 'Good' || status === 'ok' || status === 'checking';
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border ${!good ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
      <div className="flex items-center gap-2">
        <Eye className={`w-4 h-4 ${!good ? 'text-red-500' : 'text-emerald-500'}`} />
        <div>
          <p className={`text-sm font-semibold ${!good ? 'text-red-700' : 'text-emerald-700'}`}>Face Visibility: {status}</p>
          <p className="text-xs text-slate-500">{pct}% of interview time face was visible</p>
        </div>
      </div>
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${good ? 'text-emerald-700 bg-emerald-100 border-emerald-200' : 'text-red-700 bg-red-100 border-red-200'}`}>{pct}%</span>
    </div>
  );
};


// Internal Check Card Component
const CheckCard = ({
  icon, label, detail, status, extra
}: {
  icon: React.ReactNode; label: string; detail: string; status: 'checking' | 'ok' | 'error' | 'warning' | 'active'; extra?: React.ReactNode;
}) => {
  const styles = {
    checking: { border: 'border-slate-200', bg: 'bg-slate-50', text: 'text-slate-500', dot: 'bg-slate-400 animate-gentle-spin', msg: 'Checking' },
    ok: { border: 'border-emerald-200', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', msg: 'Ready' },
    error: { border: 'border-red-200', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', msg: 'Failed' },
    warning: { border: 'border-amber-200', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', msg: 'Warning' },
    active: { border: 'border-primary-200', bg: 'bg-primary-50', text: 'text-primary-700', dot: 'bg-primary-500', msg: 'Active' },
  }[status];

  return (
    <div className={`rounded-xl border p-4 transition-all ${styles.border} ${styles.bg}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${styles.bg} border ${styles.border} text-slate-600`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{label}</p>
            <p className="text-xs text-slate-500">{detail}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-semibold ${styles.text}`}>
          <div className={`w-2 h-2 rounded-full ${styles.dot}`} />
          {styles.msg}
        </div>
      </div>
      {extra && <div className="mt-3 pl-12">{extra}</div>}
    </div>
  );
};

// Main SystemCheck Component
export const SystemCheck: React.FC<SystemCheckProps> = ({ mode, settings, onReady, onFailed }) => {
  const { 
    cameraStream, screenStream, deviceState, audioState, faceState, 
    tabSwitches, isFullscreen, requestCamera, requestScreen, requestFullscreen 
  } = useMedia();

  // Resolve requirements from settings or defaults based on mode
  const reqCamera = settings?.cameraRequired ?? true;
  const reqMic = settings?.microphoneRequired ?? true;
  const reqScreen = settings?.screenSharingRequired ?? false;
  const reqFullscreen = settings?.fullscreenRequired ?? true;
  const reqNoise = settings?.noiseDetection ?? true;
  const reqFace = settings?.faceDetection ?? true;

  // Check if everything required is ready
  const isCameraReady = !reqCamera || (deviceState.hasVideo && (!reqFace || faceState.detected));
  const isMicReady = !reqMic || deviceState.hasAudio;
  const isScreenReady = !reqScreen || deviceState.hasScreen;
  const isFullscreenReady = !reqFullscreen || isFullscreen;
  const isNoiseReady = !reqNoise || audioState.noiseLevel === 'Low';

  const isOverallReady = isCameraReady && isMicReady && isScreenReady && isFullscreenReady && isNoiseReady;

  useEffect(() => {
    if (isOverallReady && onReady) onReady();
  }, [isOverallReady, onReady]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-fade-in-up">
      {/* Left: Checks */}
      <div className="space-y-3">
        {/* Mic Check */}
        {reqMic && (
          <CheckCard
            icon={<Mic className="w-4 h-4" />}
            label="Microphone"
            detail={deviceState.hasAudio ? 'Microphone connected and receiving audio' : deviceState.audioError || 'Click to allow microphone'}
            status={deviceState.hasAudio ? 'ok' : 'error'}
            extra={deviceState.hasAudio ? (
              <div className="space-y-2">
                <MicLevelBar volume={audioState.volume} />
                {audioState.volume === 0 && <p className="text-[10px] text-amber-600">No input detected. Say something!</p>}
              </div>
            ) : (
              <button onClick={requestCamera} className="text-xs bg-primary-100 text-primary-700 px-3 py-1.5 rounded-lg font-bold hover:bg-primary-200">Request Permission</button>
            )}
          />
        )}

        {/* Camera Check */}
        {reqCamera && (
          <CheckCard
            icon={<Eye className="w-4 h-4" />}
            label="Camera & Face Detection"
            detail={deviceState.hasVideo ? `Camera connected. Face visibility: ${faceState.status}` : deviceState.videoError || 'Click to allow camera'}
            status={deviceState.hasVideo && (!reqFace || faceState.detected) ? 'ok' : deviceState.hasVideo ? 'warning' : 'error'}
            extra={deviceState.hasVideo ? null : (
              <button onClick={requestCamera} className="text-xs bg-primary-100 text-primary-700 px-3 py-1.5 rounded-lg font-bold hover:bg-primary-200">Request Permission</button>
            )}
          />
        )}

        {/* Screen Share */}
        {reqScreen && (
          <CheckCard
            icon={<Monitor className="w-4 h-4" />}
            label="Screen Share"
            detail={deviceState.hasScreen ? 'Screen is being shared securely' : deviceState.screenError || 'Screen sharing is required for proctoring'}
            status={deviceState.hasScreen ? 'ok' : 'error'}
            extra={deviceState.hasScreen ? null : (
              <button onClick={requestScreen} className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-200">Share Entire Screen</button>
            )}
          />
        )}

        {/* Noise & Environment */}
        {reqNoise && (
          <CheckCard
            icon={<Volume2 className="w-4 h-4" />}
            label="Environment Noise"
            detail={audioState.noiseLevel === 'Low' ? 'Environment is clean' : 'High background noise detected'}
            status={audioState.noiseLevel === 'Low' ? 'ok' : 'warning'}
          />
        )}

        {/* Fullscreen Requirement */}
        {reqFullscreen && (
          <CheckCard
            icon={<Shield className="w-4 h-4" />}
            label="Fullscreen Mode"
            detail={isFullscreen ? 'Fullscreen active' : 'Interview must be taken in fullscreen'}
            status={isFullscreen ? 'ok' : 'error'}
            extra={isFullscreen ? null : (
              <button onClick={requestFullscreen} className="text-xs bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-bold hover:bg-slate-300">Enter Fullscreen</button>
            )}
          />
        )}
      </div>

      {/* Right: Previews */}
      <div className="space-y-4">
        {/* Camera Preview */}
        <CameraPreview stream={cameraStream} faceState={faceState} />
        
        {/* Screen Preview */}
        {deviceState.hasScreen && (
          <ScreenPreview stream={screenStream} />
        )}

        {/* Summary Card */}
        <div className={`card p-4 border-2 transition-all ${isOverallReady ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2 mb-3">
            {isOverallReady ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-primary-500 animate-gentle-spin" />}
            <h4 className="font-bold text-sm text-slate-900">{isOverallReady ? 'All Checks Passed' : 'Waiting for permissions...'}</h4>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600"><span>Camera & Mic</span> <span className={deviceState.hasVideo && deviceState.hasAudio ? 'text-emerald-600 font-bold' : 'text-slate-400'}>{deviceState.hasVideo ? 'Connected' : 'Pending'}</span></div>
            <div className="flex justify-between text-slate-600"><span>Screen Share</span> <span className={deviceState.hasScreen ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'}>{deviceState.hasScreen ? 'Active' : 'Required'}</span></div>
            <div className="flex justify-between text-slate-600"><span>Fullscreen</span> <span className={isFullscreen ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'}>{isFullscreen ? 'Active' : 'Required'}</span></div>
          </div>

          {tabSwitches > 0 && (
            <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-amber-700 text-xs font-semibold flex gap-2 items-center">
              <AlertTriangle className="w-3.5 h-3.5" />
              {tabSwitches} Tab Switch(es) detected. Do not leave the interview page.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemCheck;
