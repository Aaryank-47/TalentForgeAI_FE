import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHiring } from '../../context/HiringContext';
import { WorkflowSelector } from '../../components/hiring/WorkflowSelector';
import { getStageLabel } from '../../constants/hiring_mockData';
import {
  ChevronRight, ChevronLeft, Check, Briefcase,
  Plus, X, Eye, Save, Send, MapPin, GitBranch,
} from 'lucide-react';

const steps = [
  { id: 1, label: 'Job Details' },
  { id: 2, label: 'Description' },
  { id: 3, label: 'Requirements' },
  { id: 4, label: 'Hiring Workflow' },
  { id: 5, label: 'Additional' },
  { id: 6, label: 'Review & Publish' },
];

const CreateJobPage = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { workflows, getWorkflow } = useHiring();
  const defaultWorkflow = workflows.find(w => w.isDefault && !w.isArchived);

  const [form, setForm] = useState({
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    employmentType: 'Full-time',
    experienceLevel: '3-5 years',
    openings: '2',
    location: 'Bangalore, India',
    remote: true,
    salaryMin: '80000',
    salaryMax: '120000',
    currency: 'USD',
    description: `We are looking for a Senior Frontend Developer to join our dynamic team and help build amazing user experiences.\n\nResponsibilities:\n• Build responsive and user-friendly web applications\n• Collaborate with designers and backend developers\n• Optimize applications for maximum speed and scalability\n• Write clean, maintainable, and well-documented code`,
    requirements: `• 3-5 years of experience in Frontend development\n• Strong knowledge of React, TypeScript, and modern JavaScript\n• Experience with state management libraries (Redux, Zustand)\n• Familiarity with RESTful APIs and GraphQL\n• Understanding of web performance optimization`,
    benefits: `• Competitive salary and equity\n• Remote-first culture\n• Health insurance\n• Learning & development budget\n• 25 days PTO`,
    skills: ['React', 'TypeScript', 'Frontend', 'JavaScript'],
    deadline: '',
    visibility: 'Public',
    tags: ['React', 'TypeScript', 'Frontend', 'JavaScript'],
    workflowTemplateId: defaultWorkflow?.id ?? '',
  });

  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      setForm(f => ({ ...f, skills: [...f.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (s: string) => setForm(f => ({ ...f, skills: f.skills.filter(x => x !== s) }));

  const selectedWorkflow = form.workflowTemplateId ? getWorkflow(form.workflowTemplateId) : undefined;
  const enabledStages = selectedWorkflow?.stages.filter(s => s.enabled) ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/recruiter/jobs')} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="hover:text-primary-600 cursor-pointer" onClick={() => navigate('/recruiter/jobs')}>Jobs</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-700 font-medium">Create New Job</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary text-sm flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save as Draft
          </button>
          <button className="btn-secondary text-sm flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button className="btn-primary text-sm flex items-center gap-2">
            <Send className="w-4 h-4" />
            Review & Publish
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left: Wizard */}
        <div className="flex-1 min-w-0">
          {/* Step Indicators */}
          <div className="card p-4 mb-5">
            <div className="flex items-center justify-between">
              {steps.map((s, i) => (
                <React.Fragment key={s.id}>
                  <button
                    onClick={() => setStep(s.id)}
                    className="flex items-center gap-2.5 group"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      step > s.id
                        ? 'bg-emerald-500 text-white'
                        : step === s.id
                        ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                    </div>
                    <span className={`text-sm font-medium hidden md:block ${
                      step === s.id ? 'text-primary-700' : step > s.id ? 'text-emerald-600' : 'text-slate-400'
                    }`}>{s.label}</span>
                  </button>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 rounded ${step > s.id ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="card p-6 space-y-6">
            {step === 1 && (
              <>
                <SectionTitle title="Basic Information" subtitle="Tell us about the position" />
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <Label>Job Title *</Label>
                    <input className="input-field mt-1" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Senior Frontend Developer" />
                  </div>
                  <div>
                    <Label>Department *</Label>
                    <select className="input-field mt-1" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                      {['Engineering', 'Design', 'Marketing', 'HR', 'Analytics', 'Sales', 'Finance'].map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Employment Type</Label>
                    <select className="input-field mt-1" value={form.employmentType} onChange={e => setForm(f => ({ ...f, employmentType: e.target.value }))}>
                      {['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Experience Level *</Label>
                    <select className="input-field mt-1" value={form.experienceLevel} onChange={e => setForm(f => ({ ...f, experienceLevel: e.target.value }))}>
                      {['0-1 year', '1-2 years', '2-3 years', '3-5 years', '5-7 years', '7+ years'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Open Positions *</Label>
                    <input className="input-field mt-1" type="number" min="1" value={form.openings} onChange={e => setForm(f => ({ ...f, openings: e.target.value }))} />
                  </div>
                  <div className="col-span-2">
                    <Label>Job Location *</Label>
                    <div className="flex gap-3 mt-1">
                      <input className="input-field flex-1" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="City, Country" />
                      <label className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                        <input type="checkbox" checked={form.remote} onChange={e => setForm(f => ({ ...f, remote: e.target.checked }))} className="accent-primary-600" />
                        <span className="text-sm text-slate-700 font-medium">Remote Job</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label>Salary Range (Optional)</Label>
                    <div className="flex items-center gap-3 mt-1">
                      <input className="input-field" type="number" value={form.salaryMin} onChange={e => setForm(f => ({ ...f, salaryMin: e.target.value }))} placeholder="Min" />
                      <span className="text-slate-400 font-medium">–</span>
                      <input className="input-field" type="number" value={form.salaryMax} onChange={e => setForm(f => ({ ...f, salaryMax: e.target.value }))} placeholder="Max" />
                      <select className="input-field w-28" value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}>
                        {['USD', 'EUR', 'GBP', 'INR'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <SectionTitle title="Job Description" subtitle="Describe the role and responsibilities" />
                <div>
                  <Label>Job Description *</Label>
                  <textarea
                    className="input-field mt-1 h-64 resize-none font-sans text-sm"
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Describe the role..."
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <SectionTitle title="Requirements & Skills" subtitle="What do candidates need?" />
                <div>
                  <Label>Requirements *</Label>
                  <textarea
                    className="input-field mt-1 h-48 resize-none font-sans text-sm"
                    value={form.requirements}
                    onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))}
                    placeholder="List candidate requirements..."
                  />
                </div>
                <div>
                  <Label>Required Skills</Label>
                  <div className="flex flex-wrap gap-2 mt-2 mb-3">
                    {form.skills.map(s => (
                      <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-200">
                        {s}
                        <button onClick={() => removeSkill(s)} className="hover:text-primary-900">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      className="input-field flex-1"
                      value={newSkill}
                      onChange={e => setNewSkill(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addSkill()}
                      placeholder="Add a skill (press Enter)"
                    />
                    <button onClick={addSkill} className="btn-primary flex items-center gap-1.5">
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                </div>
                <div>
                  <Label>Benefits</Label>
                  <textarea
                    className="input-field mt-1 h-32 resize-none font-sans text-sm"
                    value={form.benefits}
                    onChange={e => setForm(f => ({ ...f, benefits: e.target.value }))}
                    placeholder="List benefits..."
                  />
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <SectionTitle
                  title="Select Hiring Workflow"
                  subtitle="This job will inherit the selected workflow template. The job does not own the hiring process."
                />
                <WorkflowSelector
                  selectedId={form.workflowTemplateId || null}
                  onSelect={id => setForm(f => ({ ...f, workflowTemplateId: id }))}
                />
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-slate-500">
                    Need a custom pipeline?{' '}
                    <Link to="/recruiter/workflows" className="text-primary-600 hover:text-primary-700 font-medium">
                      Manage Workflows
                    </Link>
                  </p>
                  <Link to="/recruiter/workflows" className="btn-secondary text-xs flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5" /> Create Workflow
                  </Link>
                </div>
              </>
            )}

            {step === 5 && (
              <>
                <SectionTitle title="Additional Settings" subtitle="Configure application settings" />
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <Label>Application Deadline</Label>
                    <input className="input-field mt-1" type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Visible To</Label>
                    <select className="input-field mt-1" value={form.visibility} onChange={e => setForm(f => ({ ...f, visibility: e.target.value }))}>
                      {['Public', 'Internal Only', 'Unlisted'].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}

            {step === 6 && (
              <>
                <SectionTitle title="Review & Publish" subtitle="Review your job details before publishing" />
                <div className="space-y-4">
                  <ReviewField label="Job Title" value={form.title} />
                  <ReviewField label="Department" value={form.department} />
                  <ReviewField label="Employment Type" value={form.employmentType} />
                  <ReviewField label="Experience Level" value={form.experienceLevel} />
                  <ReviewField label="Location" value={`${form.location}${form.remote ? ' · Remote' : ''}`} />
                  <ReviewField label="Salary" value={`${form.currency} ${form.salaryMin} – ${form.salaryMax}`} />
                  <ReviewField label="Skills" value={form.skills.join(', ')} />
                  <ReviewField label="Hiring Workflow" value={selectedWorkflow?.name ?? 'Not selected'} />
                  {selectedWorkflow && (
                    <div className="flex gap-4">
                      <span className="text-sm font-semibold text-slate-500 w-36 flex-shrink-0">Pipeline</span>
                      <div className="flex flex-wrap gap-1.5">
                        {enabledStages.map((stage, i) => (
                          <React.Fragment key={stage.id}>
                            {i > 0 && <span className="text-slate-300 text-xs">→</span>}
                            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                              {getStageLabel(stage)}
                            </span>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
                  <button className="btn-secondary flex-1 text-sm flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" />
                    Save as Draft
                  </button>
                  <button className="btn-primary flex-1 text-sm flex items-center justify-center gap-2" onClick={() => navigate('/recruiter/jobs')}>
                    <Send className="w-4 h-4" />
                    Publish Job
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
              className="btn-secondary text-sm flex items-center gap-2 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            {step < 6 && (
              <button
                onClick={() => setStep(s => Math.min(6, s + 1))}
                className="btn-primary text-sm flex items-center gap-2"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="w-80 flex-shrink-0">
          <div className="card p-5 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 font-display">Job Preview</h3>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full border border-emerald-200">Active</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-tight">{form.title || 'Job Title'}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{form.department} • {form.employmentType}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                    <MapPin className="w-3 h-3" />
                    <span>{form.location || 'Location'}{form.remote ? ' · Remote' : ''}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E5E7EB] pt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-slate-400">Experience</p>
                  <p className="font-semibold text-slate-700 mt-0.5">{form.experienceLevel}</p>
                </div>
                <div>
                  <p className="text-slate-400">Openings</p>
                  <p className="font-semibold text-slate-700 mt-0.5">{form.openings}</p>
                </div>
                {form.salaryMin && (
                  <>
                    <div className="col-span-2">
                      <p className="text-slate-400">Salary</p>
                      <p className="font-semibold text-slate-700 mt-0.5">${form.salaryMin} – ${form.salaryMax} {form.currency}</p>
                    </div>
                  </>
                )}
              </div>

              {form.skills.length > 0 && (
                <div className="border-t border-[#E5E7EB] pt-3">
                  <p className="text-xs text-slate-400 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {form.skills.map(s => (
                      <span key={s} className="text-[11px] bg-primary-50 text-primary-700 px-2 py-1 rounded-md font-medium border border-primary-100">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedWorkflow && (
                <div className="border-t border-[#E5E7EB] pt-3">
                  <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                    <GitBranch className="w-3 h-3" /> Workflow
                  </p>
                  <p className="text-xs font-semibold text-slate-700">{selectedWorkflow.name}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{enabledStages.length} stages</p>
                </div>
              )}

              <div className="border-t border-[#E5E7EB] pt-3">
                <button
                  className="w-full text-xs text-primary-600 hover:text-primary-700 font-semibold text-center"
                  onClick={() => {}}
                >
                  View Full Preview ↗
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-sm font-semibold text-slate-700">{children}</label>
);

const SectionTitle = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div>
    <h2 className="text-lg font-display font-bold text-[#0F172A]">{title}</h2>
    <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
  </div>
);

const ReviewField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-4">
    <span className="text-sm font-semibold text-slate-500 w-36 flex-shrink-0">{label}</span>
    <span className="text-sm text-slate-900">{value}</span>
  </div>
);

export default CreateJobPage;
