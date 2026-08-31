import React from 'react';
import { Shield, ShieldAlert, AlertTriangle, CheckCircle, XCircle, Camera, Monitor } from 'lucide-react';
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
    <div className="flex flex-col gap-6 text-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary-600" />
          <h3 className="font-bold text-sm tracking-wide text-slate-900 uppercase">AI Proctoring</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          ACTIVE
        </div>
      </div>

      {/* Video & Screen Feeds */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-slate-500" />
              Webcam Feed
            </span>
            {faceState && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                faceState.status === 'Excellent' || faceState.status === 'Good'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
              }`}>
                {faceState.status}
              </span>
            )}
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900">
            <CameraPreview stream={cameraStream} faceState={faceState} compact={true} label="" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
              <Monitor className="w-3.5 h-3.5 text-slate-500" />
              Screen Share
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
              screenStream ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}>
              {screenStream ? 'Sharing' : 'Missing'}
            </span>
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900">
            <ScreenPreview stream={screenStream} compact={true} label="" />
          </div>
        </div>
      </div>

      {/* Integrity Risk Summary */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-slate-600 font-medium">Trust Score</span>
          <span className={`text-xs font-bold ${
            isHighRisk ? 'text-rose-600' : isMediumRisk ? 'text-amber-600' : 'text-emerald-700'
          }`}>
            {overallScore}%
          </span>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full transition-all duration-500 ${
              isHighRisk ? 'bg-rose-500' : isMediumRisk ? 'bg-amber-500' : 'bg-primary-600'
            }`}
            style={{ width: `${overallScore}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          {isHighRisk ? (
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          ) : (
            <Shield className={`w-4 h-4 ${isMediumRisk ? 'text-amber-600' : 'text-primary-600'}`} />
          )}
          <span className={`text-[11px] font-bold uppercase ${
            isHighRisk ? 'text-rose-700' : isMediumRisk ? 'text-amber-700' : 'text-slate-800'
          }`}>
            {isHighRisk ? 'High Risk Flagged' : isMediumRisk ? 'Warning Level' : 'Secure Session'}
          </span>
        </div>
      </div>

      {/* Metrics List */}
      <div className="space-y-2.5">
        {/* Fullscreen Status */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs shadow-sm">
          <span className="text-slate-600 font-medium">Fullscreen Lock</span>
          {isFullscreen ? (
            <div className="flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Locked
            </div>
          ) : (
            <div className="flex items-center gap-1 text-rose-600 font-semibold animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              Exited
            </div>
          )}
        </div>

        {/* Window Focus Status */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs shadow-sm">
          <span className="text-slate-600 font-medium">Window Focus</span>
          {isFocused ? (
            <div className="flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Focused
            </div>
          ) : (
            <div className="flex items-center gap-1 text-rose-600 font-semibold animate-pulse">
              <XCircle className="w-3.5 h-3.5" />
              Background
            </div>
          )}
        </div>

        {/* Tab Switches */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs shadow-sm">
          <span className="text-slate-600 font-medium">Tab Switches</span>
          <span className={`font-bold px-2 py-0.5 rounded text-[11px] border ${
            tabSwitches > 0 ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-slate-200 text-slate-700'
          }`}>
            {tabSwitches}
          </span>
        </div>

        {/* Total Violations */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs shadow-sm">
          <span className="text-slate-600 font-medium">Total Warnings</span>
          <span className={`font-bold px-2 py-0.5 rounded text-[11px] border ${
            violationCount > 0 ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-200 text-slate-700'
          }`}>
            {violationCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AssessmentMonitoringPanel;
