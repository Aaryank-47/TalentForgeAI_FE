import React from 'react';
import { Shield, ShieldAlert, AlertTriangle, CheckCircle, XCircle, Eye, Monitor, Camera } from 'lucide-react';
import { useMedia } from '../../context/MediaProvider';
import { CameraPreview, ScreenPreview } from '../../modules/shared/system-check/SystemCheck';

interface AssessmentMonitoringPanelProps {
  violationCount: number;
  tabSwitches: number;
  isFullscreen: boolean;
  isFocused: boolean;
}

const AssessmentMonitoringPanel: React.FC<AssessmentMonitoringPanelProps> = ({
  violationCount,
  tabSwitches,
  isFullscreen,
  isFocused,
}) => {
  const { cameraStream, screenStream, faceState } = useMedia();

  const overallScore = Math.max(0, 100 - violationCount * 25);
  const isHighRisk = violationCount >= 3;
  const isMediumRisk = violationCount > 0 && violationCount < 3;

  return (
    <div className="flex flex-col gap-6 text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-sm tracking-wide text-white uppercase">AI Proctoring</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          ACTIVE
        </div>
      </div>

      {/* Video & Screen Feeds */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-slate-500" />
              Webcam Feed
            </span>
            {faceState && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 ${
                faceState.status === 'Excellent' || faceState.status === 'Good'
                  ? 'text-emerald-400'
                  : 'text-rose-400 animate-pulse'
              }`}>
                {faceState.status}
              </span>
            )}
          </div>
          <CameraPreview stream={cameraStream} faceState={faceState} compact={true} label="" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Monitor className="w-3.5 h-3.5 text-slate-500" />
              Screen Share
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 ${
              screenStream ? 'text-indigo-400' : 'text-rose-400'
            }`}>
              {screenStream ? 'Sharing' : 'Missing'}
            </span>
          </div>
          <ScreenPreview stream={screenStream} compact={true} label="" />
        </div>
      </div>

      {/* Integrity Risk Summary */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-slate-400 font-medium">Trust Score</span>
          <span className={`text-xs font-bold ${
            isHighRisk ? 'text-rose-400' : isMediumRisk ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {overallScore}%
          </span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full transition-all duration-500 ${
              isHighRisk ? 'bg-rose-500' : isMediumRisk ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${overallScore}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          {isHighRisk ? (
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          ) : (
            <Shield className={`w-4 h-4 ${isMediumRisk ? 'text-amber-500' : 'text-emerald-500'}`} />
          )}
          <span className={`text-[11px] font-semibold uppercase ${
            isHighRisk ? 'text-rose-400' : isMediumRisk ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {isHighRisk ? 'High Risk Flagged' : isMediumRisk ? 'Warning Level' : 'Secure Session'}
          </span>
        </div>
      </div>

      {/* Metrics List */}
      <div className="space-y-2.5">
        {/* Fullscreen Status */}
        <div className="flex items-center justify-between bg-slate-900/60 border border-slate-850 p-2.5 rounded-lg text-xs">
          <span className="text-slate-400 font-medium">Fullscreen Lock</span>
          {isFullscreen ? (
            <div className="flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              Locked
            </div>
          ) : (
            <div className="flex items-center gap-1 text-rose-400 font-semibold animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              Exited
            </div>
          )}
        </div>

        {/* Window Focus Status */}
        <div className="flex items-center justify-between bg-slate-900/60 border border-slate-850 p-2.5 rounded-lg text-xs">
          <span className="text-slate-400 font-medium">Window Focus</span>
          {isFocused ? (
            <div className="flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              Focused
            </div>
          ) : (
            <div className="flex items-center gap-1 text-rose-400 font-semibold animate-pulse">
              <XCircle className="w-3.5 h-3.5" />
              Background
            </div>
          )}
        </div>

        {/* Tab Switches */}
        <div className="flex items-center justify-between bg-slate-900/60 border border-slate-850 p-2.5 rounded-lg text-xs">
          <span className="text-slate-400 font-medium">Tab Switches</span>
          <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
            tabSwitches > 0 ? 'bg-rose-950/50 border border-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-300'
          }`}>
            {tabSwitches}
          </span>
        </div>

        {/* Total Violations */}
        <div className="flex items-center justify-between bg-slate-900/60 border border-slate-850 p-2.5 rounded-lg text-xs">
          <span className="text-slate-400 font-medium">Total Warnings</span>
          <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
            violationCount > 0 ? 'bg-amber-950/50 border border-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-300'
          }`}>
            {violationCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AssessmentMonitoringPanel;
