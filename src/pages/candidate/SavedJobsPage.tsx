import { useState } from 'react';
import { Bookmark, MapPin, Trash2 } from 'lucide-react';
import { jobsData } from '../../constants/candidate_mockData';

const SavedJobsPage = () => {
  const [saved, setSaved] = useState(jobsData.filter(j => j.saved));

  const removeJob = (id: string) => setSaved(prev => prev.filter(j => j.id !== id));

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">Saved Jobs</h1>
          <p className="text-sm text-slate-500 mt-0.5">{saved.length} jobs saved</p>
        </div>
      </div>

      {saved.length === 0 ? (
        <div className="card p-16 flex flex-col items-center justify-center text-center">
          <Bookmark className="w-12 h-12 text-slate-200 mb-4" />
          <h3 className="font-bold text-slate-900 mb-2">No saved jobs yet</h3>
          <p className="text-sm text-slate-500">Browse jobs and save the ones you like for easy access later.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {saved.map(job => (
            <div key={job.id} className="card p-5 hover:border-primary-200 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${job.companyColor} flex items-center justify-center text-white font-bold text-base flex-shrink-0`}>
                    {job.companyLogo}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{job.title}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{job.company}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                      <span>·</span>
                      <span>{job.type}</span>
                      <span>·</span>
                      <span className="font-semibold text-emerald-600">{job.salary}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {job.skills.map(s => <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{s}</span>)}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">Posted {job.posted}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg ${job.match >= 90 ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                    {job.match}% Match
                  </span>
                  <button
                    onClick={() => removeJob(job.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-[#E5E7EB]">
                <button className="flex-1 py-2 text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors">Apply Now</button>
                <button className="flex-1 py-2 text-sm font-semibold border border-[#E5E7EB] text-slate-700 rounded-xl hover:bg-slate-50 transition-colors">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;
