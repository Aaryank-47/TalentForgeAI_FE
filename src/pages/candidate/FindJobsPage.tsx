import { useState } from 'react';
import { Search, MapPin, Filter, X, Bookmark, ChevronDown, Star, ExternalLink, CheckCircle, Briefcase, Building, Globe, Users, ThumbsUp, ThumbsDown, ChevronRight, ArrowUpRight } from 'lucide-react';
import { jobsData, companiesData } from '../../constants/candidate_mockData';

// ─── Types ───────────────────────────────────────────────
type Job = typeof jobsData[0];
type Company = typeof companiesData[0];

// ─── Job Card ─────────────────────────────────────────────
const JobCard = ({
  job, selected, onSelect, saved, onSave,
}: {
  job: Job; selected: boolean; onSelect: () => void; saved: boolean; onSave: () => void;
}) => {
  const matchColor = job.match >= 90 ? 'bg-emerald-500' : job.match >= 80 ? 'bg-blue-500' : 'bg-amber-500';
  return (
    <div
      onClick={onSelect}
      className={`p-4 border-b border-[#E5E7EB] hover:bg-slate-50 cursor-pointer transition-colors ${selected ? 'bg-primary-50/40 border-l-2 border-l-primary-500' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl ${job.companyColor} flex items-center justify-center text-white font-bold flex-shrink-0`}>
          {job.companyLogo}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">{job.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{job.company}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`${matchColor} text-white text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap`}>
                {job.match}%<br /><span className="text-[8px]">Match</span>
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onSave(); }}
                className="p-1 text-slate-300 hover:text-primary-500 transition-colors"
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-primary-500 text-primary-500' : ''}`} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1.5">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
            <span>·</span>
            <span>🌐 {job.type}</span>
            <span>·</span>
            <span className="font-semibold text-slate-700">{job.salary}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {job.skills.slice(0, 3).map(s => (
              <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{s}</span>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-2">{job.posted}</p>
        </div>
      </div>
    </div>
  );
};

// ─── Company Card ─────────────────────────────────────────
const CompanyCard = ({
  company, selected, onSelect,
}: {
  company: Company; selected: boolean; onSelect: () => void;
}) => (
  <div
    onClick={onSelect}
    className={`p-4 border-b border-[#E5E7EB] flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-colors ${selected ? 'bg-primary-50/40 border-l-2 border-l-primary-500' : ''}`}
  >
    <div className={`w-10 h-10 rounded-xl ${company.logoColor} flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {company.logo}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1">
        <p className="text-sm font-bold text-slate-900">{company.name}</p>
        {company.verified && <CheckCircle className="w-3.5 h-3.5 text-blue-500" />}
      </div>
      <p className="text-[11px] text-slate-400">{company.openJobs} open jobs</p>
    </div>
    <div className="flex items-center gap-1 text-amber-500">
      <Star className="w-3 h-3 fill-amber-400" />
      <span className="text-xs font-bold text-slate-700">{company.rating}</span>
    </div>
  </div>
);

// ─── Job Detail Panel ─────────────────────────────────────
const JobDetailPanel = ({ job, onClose }: { job: Job; onClose: () => void }) => {
  const [tab, setTab] = useState<'Overview' | 'Responsibilities' | 'Requirements' | 'Benefits' | 'Company'>('Overview');
  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-[#E5E7EB]">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${job.companyColor} flex items-center justify-center text-white font-bold text-lg`}>
              {job.companyLogo}
            </div>
            <div>
              <h2 className="font-display font-bold text-[#0F172A] text-base">{job.title}</h2>
              <p className="text-sm text-slate-500">{job.company}</p>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{job.location}</span>
                <span>·</span>
                <span>{job.type}</span>
                <span>·</span>
                <span className="font-semibold text-slate-700">{job.salary}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Match + skills */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-wrap gap-1">
            {job.skills.map(s => <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{s}</span>)}
          </div>
          <span className={`text-white text-xs font-bold px-3 py-1 rounded-lg whitespace-nowrap ${job.match >= 90 ? 'bg-emerald-500' : job.match >= 80 ? 'bg-blue-500' : 'bg-amber-500'}`}>
            {job.match}% Match
          </span>
        </div>

        {/* CTAs */}
        <div className="flex gap-2">
          <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
            Apply Now
          </button>
          <button className="px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors flex items-center gap-1.5">
            <Bookmark className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E7EB] overflow-x-auto">
        {(['Overview', 'Responsibilities', 'Requirements', 'Benefits', 'Company'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
              tab === t ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5 text-sm text-slate-700 leading-relaxed space-y-3">
        {tab === 'Overview' && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Department', value: job.department },
                { label: 'Job Type', value: job.type },
                { label: 'Experience', value: job.experience },
                { label: 'Apply By', value: job.deadline },
              ].map(f => (
                <div key={f.label} className="bg-slate-50 rounded-xl p-3 border border-[#E5E7EB]">
                  <p className="text-[10px] text-slate-400 mb-0.5">{f.label}</p>
                  <p className="text-xs font-bold text-slate-900">{f.value}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{job.description}</p>
          </>
        )}
        {tab === 'Responsibilities' && (
          <ul className="space-y-2">
            {job.responsibilities.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        )}
        {tab === 'Requirements' && (
          <ul className="space-y-2">
            {job.requirements.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        )}
        {tab === 'Benefits' && (
          <div className="flex flex-wrap gap-2">
            {job.benefits.map((b, i) => (
              <span key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium px-3 py-1.5 rounded-full">✓ {b}</span>
            ))}
          </div>
        )}
        {tab === 'Company' && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-10 h-10 rounded-xl ${job.companyColor} flex items-center justify-center text-white font-bold`}>{job.companyLogo}</div>
              <div>
                <p className="font-bold text-slate-900">{job.company}</p>
                <p className="text-xs text-slate-500">{job.department}</p>
              </div>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">View company profile for detailed information about culture, benefits, and reviews.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Company Detail Panel ─────────────────────────────────
const CompanyDetailPanel = ({ company, onClose }: { company: Company; onClose: () => void }) => {
  const [tab, setTab] = useState<'Overview' | 'Jobs' | 'Reviews' | 'About' | 'Benefits' | 'Photos'>('Overview');
  return (
    <div className="flex flex-col h-full">
      {/* Banner */}
      <div className={`h-28 bg-gradient-to-r ${company.bannerColor} relative flex-shrink-0`}>
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 bg-black/20 hover:bg-black/30 rounded-lg text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
        <div className="absolute -bottom-5 left-5">
          <div className={`w-14 h-14 rounded-2xl ${company.logoColor} flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-lg`}>
            {company.logo}
          </div>
        </div>
      </div>
      <div className="px-5 pt-8 pb-4 border-b border-[#E5E7EB]">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-[#0F172A] text-lg">{company.name}</h2>
              {company.verified && <span className="flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200"><CheckCircle className="w-3 h-3" />Verified</span>}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{company.industry} · {company.location}</p>
            <div className="flex items-center gap-1.5 mt-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(company.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
              ))}
              <span className="text-xs text-slate-600 font-medium">({company.reviewCount.toLocaleString()} reviews)</span>
            </div>
          </div>
          <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-2 border border-primary-200 text-primary-700 text-xs font-semibold rounded-xl hover:bg-primary-50 transition-colors">
            <Globe className="w-3.5 h-3.5" />
            Website
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E7EB] overflow-x-auto flex-shrink-0">
        {(['Overview', 'Jobs', 'Reviews', 'About', 'Benefits', 'Photos'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
              tab === t ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t}{t === 'Jobs' ? ` (${company.openJobs})` : t === 'Reviews' ? ` (${(company.reviewCount / 1000).toFixed(1)}K)` : ''}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {tab === 'Overview' && (
          <>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-2">About {company.name}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{company.overview}</p>
              <button className="text-xs text-primary-600 font-medium mt-1.5 flex items-center gap-1">Show more <ChevronDown className="w-3.5 h-3.5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Employees', value: company.size, icon: <Users className="w-3.5 h-3.5 text-slate-400" /> },
                { label: 'Founded', value: company.founded, icon: <Building className="w-3.5 h-3.5 text-slate-400" /> },
                { label: 'Headquarters', value: company.location.split(',')[0], icon: <MapPin className="w-3.5 h-3.5 text-slate-400" /> },
                { label: 'Type', value: company.type, icon: <Briefcase className="w-3.5 h-3.5 text-slate-400" /> },
                { label: 'Industry', value: company.industry, icon: <Globe className="w-3.5 h-3.5 text-slate-400" /> },
                { label: 'CEO', value: company.ceo, icon: <Star className="w-3.5 h-3.5 text-slate-400" /> },
              ].map(f => (
                <div key={f.label} className="flex items-start gap-2">
                  {f.icon}
                  <div>
                    <p className="text-[10px] text-slate-400">{f.label}</p>
                    <p className="text-xs font-semibold text-slate-800">{f.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Highlights */}
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-2">Company Highlights</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 text-center">
                  <p className="text-[10px] text-slate-500 mb-1">Work Culture</p>
                  <p className="text-xs font-bold text-slate-800">{company.culture}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 text-center">
                  <p className="text-[10px] text-slate-500 mb-1">Career Growth</p>
                  <p className="text-xs font-bold text-slate-800">{company.careerGrowth}</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 text-center">
                  <p className="text-[10px] text-slate-500 mb-1">Employee Rating</p>
                  <p className="text-xs font-bold text-slate-800">{company.employeeRating}</p>
                </div>
              </div>
            </div>

            {/* Rating Breakdown */}
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-3">Ratings & Reviews</h4>
              <div className="flex items-center gap-4 mb-3">
                <div className="text-center">
                  <p className="text-4xl font-display font-bold text-slate-900">{company.rating}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className={`w-3 h-3 ${i <= Math.round(company.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />)}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">({company.reviewCount.toLocaleString()} reviews)</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5,4,3,2,1].map(star => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-600 w-4">{star}</span>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                        <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${company.ratingBreakdown[star as keyof typeof company.ratingBreakdown]}%` }} />
                      </div>
                      <span className="text-[10px] text-slate-400 w-6">{company.ratingBreakdown[star as keyof typeof company.ratingBreakdown]}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {company.reviews.map((review, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-4 border border-[#E5E7EB] mb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{review.name}</p>
                      <p className="text-[10px] text-slate-400">{review.role} · {review.date}</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(i => <Star key={i} className={`w-3 h-3 ${i <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />)}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{review.pros}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <button className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-primary-600 transition-colors">
                      <ThumbsUp className="w-3 h-3" />{review.helpful}
                    </button>
                    <button className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-red-500 transition-colors">
                      <ThumbsDown className="w-3 h-3" />{review.unhelpful}
                    </button>
                    <span className="text-[10px] text-slate-400">Was this helpful?</span>
                  </div>
                </div>
              ))}
              {company.reviews.length === 0 && <p className="text-xs text-slate-400">No reviews yet.</p>}
              <button className="text-xs text-primary-600 font-semibold hover:text-primary-700">View All Reviews →</button>
            </div>
          </>
        )}
        {tab === 'Jobs' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">{company.openJobs} open positions at {company.name}</p>
            {jobsData.filter(j => j.company === company.name).map(job => (
              <div key={job.id} className="p-3 border border-[#E5E7EB] rounded-xl hover:border-primary-200 hover:bg-slate-50 transition-all cursor-pointer">
                <p className="text-sm font-bold text-slate-900">{job.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{job.location} · {job.type}</p>
                <p className="text-xs font-semibold text-slate-700 mt-1">{job.salary}</p>
              </div>
            ))}
          </div>
        )}
        {tab === 'About' && (
          <div className="space-y-3 text-xs text-slate-600">
            <p className="leading-relaxed">{company.overview}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────
const FindJobsPage = () => {
  const [activeTab, setActiveTab] = useState<'Jobs' | 'Companies'>('Jobs');
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(jobsData[0]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(companiesData[0]);
  const [savedJobs, setSavedJobs] = useState<string[]>(['job_1', 'job_5']);

  const filteredJobs = jobsData.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase()) ||
    j.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleSave = (id: string) =>
    setSavedJobs(prev => prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]);

  return (
    <div className="space-y-0 -m-6 h-screen flex flex-col">
      {/* Top search bar */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex-shrink-0">
        {/* Tabs */}
        <div className="flex items-center gap-0 border-b border-[#E5E7EB] mb-4 -mx-6 px-6">
          {(['Jobs', 'Companies'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === t ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {t === 'Jobs' ? <Briefcase className="w-4 h-4" /> : <Building className="w-4 h-4" />}
              {t}
            </button>
          ))}
        </div>

        {activeTab === 'Jobs' && (
          <>
            <div className="flex gap-3 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by job title, skill or keyword"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="relative w-52">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter location"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl transition-colors">Search</button>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                <Filter className="w-4 h-4" />Filters
              </button>
              <button className="px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors">Reset</button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {['Job Type', 'Experience Level', 'Salary Range', 'Date Posted'].map(f => (
                <button key={f} className="flex items-center gap-1 px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                  {f}<ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
              <button className="flex items-center gap-1 px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-xs text-slate-600 hover:bg-slate-50">
                ⊕ More Filters
              </button>
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Jobs Tab */}
        {activeTab === 'Jobs' && (
          <>
            {/* Jobs list */}
            <div className="w-[420px] flex-shrink-0 border-r border-[#E5E7EB] flex flex-col overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center justify-between bg-white flex-shrink-0">
                <p className="text-sm font-semibold text-slate-700">{filteredJobs.length} jobs found</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  Sort by:
                  <button className="font-semibold text-slate-700 flex items-center gap-1">Most Relevant<ChevronDown className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    selected={selectedJob?.id === job.id}
                    onSelect={() => setSelectedJob(job)}
                    saved={savedJobs.includes(job.id)}
                    onSave={() => toggleSave(job.id)}
                  />
                ))}
              </div>
              {/* Bottom alert bar */}
              <div className="border-t border-[#E5E7EB] bg-blue-50 px-4 py-3 flex items-center gap-3 flex-shrink-0">
                <span className="text-blue-500 text-base">🔔</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800">Don't miss out on the best opportunities!</p>
                  <p className="text-[10px] text-slate-500">Enable job alerts and we'll notify you when new jobs match your profile.</p>
                </div>
                <button className="flex-shrink-0 px-3 py-1.5 bg-primary-600 text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-1.5">
                  ✦ Create Job Alert
                </button>
              </div>
            </div>

            {/* Job Detail */}
            <div className="flex-1 overflow-hidden">
              {selectedJob ? (
                <JobDetailPanel job={selectedJob} onClose={() => setSelectedJob(null)} />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  <p className="text-sm">Select a job to view details</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Companies Tab */}
        {activeTab === 'Companies' && (
          <>
            {/* Companies list */}
            <div className="w-72 flex-shrink-0 border-r border-[#E5E7EB] flex flex-col overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center justify-between bg-white flex-shrink-0">
                <p className="text-sm font-bold text-slate-900">All Companies</p>
                <button className="text-xs text-primary-600 font-semibold">View All</button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {companiesData.map((co) => (
                  <CompanyCard key={co.id} company={co} selected={selectedCompany?.id === co.id} onSelect={() => setSelectedCompany(co)} />
                ))}
                <div className="px-4 py-3">
                  <button className="text-xs text-primary-600 font-semibold">See more companies →</button>
                </div>
              </div>
            </div>

            {/* Company Detail */}
            <div className="flex-1 overflow-hidden">
              {selectedCompany ? (
                <CompanyDetailPanel company={selectedCompany} onClose={() => setSelectedCompany(null)} />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  <p className="text-sm">Select a company to view details</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FindJobsPage;
