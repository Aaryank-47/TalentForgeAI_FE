import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Download, Star, CheckCircle2, PlayCircle, Bot, X } from 'lucide-react';

const CandidateDetail = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/recruiter/pipeline" className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-display font-bold text-slate-900">Candidate Profile</h1>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary text-sm text-error hover:bg-error/5 hover:text-error border-error/20">Reject</button>
          <button className="btn-primary text-sm flex items-center gap-2">Advance to Interview</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="space-y-6">
          <div className="card p-6 text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-primary-700 mb-4 border-4 border-white shadow-sm">
              SJ
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">Sarah Jenkins</h2>
            <p className="text-slate-600 text-sm mt-1">Senior Frontend Developer</p>
            
            <div className="mt-6 flex flex-col gap-3 text-sm text-slate-600 text-left">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400" /> sarah.jenkins@example.com
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400" /> +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-400" /> San Francisco, CA (Open to Remote)
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border flex gap-2 justify-center">
              <button className="btn-secondary flex-1 flex justify-center items-center gap-2 text-xs">
                <Download className="w-3.5 h-3.5" /> Resume
              </button>
              <button className="btn-secondary flex-1 flex justify-center items-center gap-2 text-xs">
                <Mail className="w-3.5 h-3.5" /> Message
              </button>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-slate-900 mb-4 font-display">Skills & Tags</h3>
            <div className="flex flex-wrap gap-2">
              <SkillBadge name="React" level="expert" />
              <SkillBadge name="TypeScript" level="expert" />
              <SkillBadge name="Next.js" level="advanced" />
              <SkillBadge name="Tailwind CSS" level="advanced" />
              <SkillBadge name="GraphQL" level="intermediate" />
              <SkillBadge name="Node.js" level="intermediate" />
            </div>
          </div>
        </div>

        {/* Right Column - AI Insights & Experience */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Scorecard */}
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg font-display">AI Assessment Score</h3>
                  <p className="text-primary-100 text-sm">Based on resume parse and technical screening</p>
                </div>
              </div>
              <div className="text-4xl font-bold font-display flex items-end gap-1">
                96<span className="text-lg text-primary-200 font-medium pb-1">/100</span>
              </div>
            </div>
            <div className="p-6 bg-white">
              <h4 className="font-semibold text-slate-900 mb-3 text-sm">AI Summary</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Sarah is a highly qualified candidate with 6+ years of specialized experience in React ecosystem. She demonstrates exceptionally strong architectural knowledge and has a proven track record of leading UI migrations. Her recent assessment indicates senior-level proficiency in state management and performance optimization.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-success uppercase tracking-wider flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Key Strengths</h5>
                  <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                    <li>React/TS Architecture</li>
                    <li>Mentorship & Leadership</li>
                    <li>Performance Optimization</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-warning uppercase tracking-wider flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> Areas to Probe</h5>
                  <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                    <li>Backend integration depth</li>
                    <li>Experience with specific testing frameworks</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="card p-6">
            <h3 className="font-bold text-slate-900 mb-6 font-display text-lg">Work Experience</h3>
            <div className="space-y-6">
              <ExperienceItem 
                role="Lead Frontend Engineer" 
                company="BigTech Co." 
                duration="Jan 2023 - Present (3 yrs 10 mos)"
                description="Spearheaded the migration of a legacy monolithic application to a micro-frontend architecture using React, Next.js, and Module Federation. Managed a team of 4 frontend engineers."
              />
              <ExperienceItem 
                role="Senior UI Developer" 
                company="Creative Agency LLC" 
                duration="Mar 2020 - Dec 2022 (2 yrs 10 mos)"
                description="Developed high-performance interactive web applications for Fortune 500 clients. Implemented complex animations and state management using Redux and Framer Motion."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkillBadge = ({ name, level }: { name: string, level: string }) => {
  const getColors = () => {
    switch(level) {
      case 'expert': return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'advanced': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };
  
  return (
    <span className={`px-2.5 py-1 text-xs font-medium border rounded-md ${getColors()}`}>
      {name}
    </span>
  );
}

const ExperienceItem = ({ role, company, duration, description }: any) => (
  <div className="relative pl-6 border-l-2 border-slate-100 last:border-transparent pb-6 last:pb-0">
    <div className="absolute w-3 h-3 bg-primary-500 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
    <h4 className="font-bold text-slate-900 text-base">{role}</h4>
    <div className="flex items-center gap-2 mt-1 mb-2 text-sm">
      <span className="font-medium text-primary-700">{company}</span>
      <span className="text-slate-300">•</span>
      <span className="text-slate-500">{duration}</span>
    </div>
    <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
  </div>
);

export default CandidateDetail;
