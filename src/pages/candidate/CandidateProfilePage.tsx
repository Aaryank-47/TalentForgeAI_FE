import { useState } from 'react';
import {
  Edit2, Upload, Plus, Trash2, ExternalLink, Eye, Download, RefreshCw,
  MapPin, Mail, Phone, Globe, GraduationCap,
  FileText, CheckCircle, X, Star, Zap,
} from 'lucide-react';
import { profileData } from '../../constants/candidate_mockData';

const ProfileRing = ({ pct }: { pct: number }) => {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const filled = (pct / 100) * circ;
  return (
    <svg width="110" height="110" viewBox="0 0 110 110">
      <circle cx="55" cy="55" r={r} fill="none" stroke="#E5E7EB" strokeWidth="7" />
      <circle cx="55" cy="55" r={r} fill="none" stroke="#22C55E" strokeWidth="7" strokeLinecap="round"
        strokeDasharray={`${filled} ${circ}`} transform="rotate(-90 55 55)"
        style={{ transition: 'stroke-dasharray 0.7s' }} />
    </svg>
  );
};

const CandidateProfilePage = () => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const profile = profileData;

  const links = [
    { icon: Globe, label: 'Portfolio', href: profile.portfolio, key: 'portfolio' },
    { icon: Globe, label: 'GitHub', href: profile.github, key: 'github' },
    { icon: Globe, label: 'LinkedIn', href: profile.linkedin, key: 'linkedin' },
  ];

  const accountSettings = [
    { label: 'Personal Information', desc: 'Update your name, email, phone' },
    { label: 'Password & Security', desc: 'Change password and 2FA settings' },
    { label: 'Email Preferences', desc: 'Manage email notifications' },
    { label: 'Notification Settings', desc: 'Control push and in-app alerts' },
    { label: 'Privacy Controls', desc: 'Manage data and visibility' },
    { label: 'Deactivate Account', desc: 'Temporarily disable your account', danger: true },
  ];

  return (
    <div className="max-w-[1100px] space-y-6">
      {/* Profile Header */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${profile.avatarColor} flex items-center justify-center text-white text-3xl font-bold shadow-lg`}>
              {profile.initials}
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-md hover:bg-primary-700 transition-colors">
              <Upload className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-display font-bold text-[#0F172A]">{profile.name}</h1>
                <p className="text-slate-500 mt-0.5">{profile.title}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{profile.location}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{profile.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{profile.phone}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {links.map(l => (
                    <a key={l.key} href={l.href} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 text-[11px] text-primary-600 hover:text-primary-700 font-medium bg-primary-50 px-2.5 py-1 rounded-full border border-primary-100 transition-colors">
                      <l.icon className="w-3 h-3" />{l.label}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-4 py-2 border border-[#E5E7EB] text-slate-700 font-medium text-sm rounded-xl hover:bg-slate-50 transition-colors">
                  <Eye className="w-4 h-4" />View Public Profile
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl transition-colors">
                  <Edit2 className="w-4 h-4" />Edit Profile
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mt-3 max-w-2xl">{profile.bio}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Skills */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-[#0F172A] text-base">Skills</h2>
              <button className="flex items-center gap-1.5 text-xs text-primary-600 font-semibold hover:text-primary-700">
                <Plus className="w-3.5 h-3.5" />Add Skill
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map(skill => (
                <span key={skill} className="group flex items-center gap-1.5 bg-primary-50 text-primary-700 border border-primary-100 text-sm font-medium px-3 py-1.5 rounded-full hover:border-primary-300 transition-colors cursor-default">
                  {skill}
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity text-primary-400 hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Work Experience */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-[#0F172A] text-base">Work Experience</h2>
              <button className="flex items-center gap-1.5 text-xs text-primary-600 font-semibold hover:text-primary-700">
                <Plus className="w-3.5 h-3.5" />Add Experience
              </button>
            </div>
            <div className="space-y-5">
              {profile.experience.map((exp, i) => (
                <div key={exp.id} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                    {exp.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{exp.role}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{exp.company} · {exp.location}</p>
                        <p className="text-xs text-primary-600 font-medium mt-0.5">{exp.duration}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-2">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-[#0F172A] text-base">Education</h2>
              <button className="flex items-center gap-1.5 text-xs text-primary-600 font-semibold hover:text-primary-700">
                <Plus className="w-3.5 h-3.5" />Add Education
              </button>
            </div>
            <div className="space-y-4">
              {profile.education.map((edu) => (
                <div key={edu.id} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{edu.institution}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{edu.degree}</p>
                        <p className="text-xs text-primary-600 font-medium mt-0.5">{edu.duration} · {edu.grade}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Links */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-[#0F172A] text-base">Portfolio & Links</h2>
              <button className="flex items-center gap-1.5 text-xs text-primary-600 font-semibold hover:text-primary-700">
                <Plus className="w-3.5 h-3.5" />Add Link
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Globe, label: 'Portfolio', url: profile.portfolio, color: 'bg-blue-50 text-blue-600' },
                { icon: Globe, label: 'GitHub', url: profile.github, color: 'bg-slate-100 text-slate-700' },
                { icon: Globe, label: 'LinkedIn', url: profile.linkedin, color: 'bg-blue-100 text-blue-700' },
                { icon: Globe, label: 'Website', url: profile.website, color: 'bg-emerald-50 text-emerald-700' },
              ].map(l => (
                <a key={l.label} href={l.url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#E5E7EB] hover:border-primary-200 hover:bg-slate-50 transition-all group">
                  <div className={`w-8 h-8 ${l.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <l.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900">{l.label}</p>
                    <p className="text-[10px] text-slate-400 truncate">{l.url.replace('https://', '')}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-primary-500 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Profile Completion Card */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Profile Completion</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-shrink-0">
                <ProfileRing pct={profile.profileCompletion} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xl font-display font-bold text-slate-900">{profile.profileCompletion}%</p>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {profile.completionChecklist.map(item => (
                  <div key={item.label} className="flex items-center gap-2 text-xs">
                    {item.done ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-200 flex-shrink-0" />
                    )}
                    <span className={item.done ? 'text-slate-700 font-medium' : 'text-slate-400'}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-700">
              <Zap className="w-3.5 h-3.5 inline mr-1 fill-amber-500" />
              A complete profile gets <strong>3x more</strong> job opportunities!
            </div>
          </div>

          {/* Resume Manager */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Resume</h3>
            </div>
            {profile.resume ? (
              <div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-[#E5E7EB] mb-3">
                  <div className="w-10 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{profile.resume.name}</p>
                    <p className="text-[10px] text-slate-400">{profile.resume.size} · Uploaded {profile.resume.uploaded}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button className="flex items-center justify-center gap-1 py-2 text-xs font-medium border border-[#E5E7EB] rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                    <Eye className="w-3.5 h-3.5" />Preview
                  </button>
                  <button className="flex items-center justify-center gap-1 py-2 text-xs font-medium border border-[#E5E7EB] rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                    <Download className="w-3.5 h-3.5" />Download
                  </button>
                  <button className="flex items-center justify-center gap-1 py-2 text-xs font-medium border border-primary-200 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />Replace
                  </button>
                </div>
              </div>
            ) : (
              <button className="w-full py-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-primary-300 hover:text-primary-500 transition-colors text-xs font-medium flex flex-col items-center gap-2">
                <Upload className="w-6 h-6" />
                Upload Resume (PDF, DOC)
              </button>
            )}
          </div>

          {/* Account Settings */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Account Settings</h3>
            <div className="space-y-1">
              {accountSettings.map(s => (
                <button key={s.label} className={`w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group ${s.danger ? 'hover:bg-red-50' : ''}`}>
                  <div>
                    <p className={`text-xs font-semibold ${s.danger ? 'text-red-600' : 'text-slate-800'}`}>{s.label}</p>
                    <p className="text-[10px] text-slate-400">{s.desc}</p>
                  </div>
                  <Star className={`w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 transition-colors ${s.danger ? 'hidden' : ''}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfilePage;
