import React from 'react';
import { Search, Filter, MoreHorizontal, User, Star, MapPin, Briefcase } from 'lucide-react';

const AtsPipeline = () => {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Senior Frontend Developer</h1>
          <p className="text-sm text-slate-500 mt-1">Engineering Dept • San Francisco (Hybrid) • Posted 12 days ago</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary text-sm">View Job Post</button>
          <button className="btn-primary text-sm flex items-center gap-2">
            <User className="w-4 h-4" /> Add Candidate
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="input-field pl-9 text-sm"
            placeholder="Search candidates in this job..."
          />
        </div>
        <button className="btn-secondary flex items-center gap-2 text-sm px-3">
          <Filter className="w-4 h-4 text-slate-500" /> Filters
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
        <PipelineColumn title="Sourced" count={12} color="bg-slate-100">
          <CandidateCard name="Alex Johnson" role="Frontend Engineer" company="TechCorp" score={85} />
          <CandidateCard name="Samantha Lee" role="React Developer" company="StartupInc" score={92} />
          <CandidateCard name="David Kim" role="Software Engineer" company="Agency LLC" score={78} />
        </PipelineColumn>
        
        <PipelineColumn title="AI Screened" count={8} color="bg-primary-50 border-t-2 border-primary-500">
          <CandidateCard name="Sarah Jenkins" role="Senior Frontend" company="BigTech Co" score={96} aiScreened />
          <CandidateCard name="Michael Chen" role="UI Developer" company="Design Agency" score={88} aiScreened />
        </PipelineColumn>

        <PipelineColumn title="Technical Interview" count={4} color="bg-warning/10 border-t-2 border-warning">
          <CandidateCard name="Emily Davis" role="Frontend Lead" company="E-commerce Ltd" score={94} aiScreened />
        </PipelineColumn>

        <PipelineColumn title="Culture Fit" count={2} color="bg-purple-50 border-t-2 border-purple-400">
          <CandidateCard name="James Wilson" role="Senior Developer" company="Fintech Inc" score={91} aiScreened />
        </PipelineColumn>

        <PipelineColumn title="Offer" count={1} color="bg-success/10 border-t-2 border-success">
          {/* Empty for now to show drag target potential */}
        </PipelineColumn>
      </div>
    </div>
  );
};

const PipelineColumn = ({ title, count, color, children }: { title: string, count: number, color: string, children?: React.ReactNode }) => (
  <div className="w-80 flex-shrink-0 flex flex-col bg-slate-50/50 rounded-xl border border-border overflow-hidden">
    <div className={`px-4 py-3 border-b border-border flex justify-between items-center ${color}`}>
      <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
      <span className="bg-white text-slate-600 text-xs font-bold px-2 py-1 rounded-md shadow-sm">{count}</span>
    </div>
    <div className="p-3 flex-1 overflow-y-auto space-y-3">
      {children}
    </div>
  </div>
);

const CandidateCard = ({ name, role, company, score, aiScreened = false }: any) => (
  <div className="bg-white p-4 rounded-lg border border-border shadow-sm cursor-grab hover:border-primary-300 hover:shadow-md transition-all group">
    <div className="flex justify-between items-start mb-3">
      <div className="flex gap-3 items-center">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium text-sm">
          {name.split(' ').map((n: string) => n[0]).join('')}
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 text-sm group-hover:text-primary-600 transition-colors">{name}</h4>
          <p className="text-xs text-slate-500">{role}</p>
        </div>
      </div>
      <button className="text-slate-400 hover:text-slate-600">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
    
    <div className="flex flex-col gap-2 mt-4">
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
        <span className="truncate">{company}</span>
      </div>
      <div className="flex justify-between items-center mt-2 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
          <Star className="w-3.5 h-3.5 text-warning fill-warning" />
          <span className="text-xs font-bold text-slate-700">{score}/100</span>
        </div>
        {aiScreened && (
          <span className="text-[10px] font-medium bg-primary-50 text-primary-700 px-2 py-1 rounded">
            AI Summary Available
          </span>
        )}
      </div>
    </div>
  </div>
);

export default AtsPipeline;
