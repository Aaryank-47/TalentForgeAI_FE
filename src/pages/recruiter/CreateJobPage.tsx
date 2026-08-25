import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { WorkflowSelector } from '../../components/hiring/WorkflowSelector';
import { workflowApi } from '../../services/api/workflow.api';
import { jobApi, type CreateJobPayload, type EmploymentType, type WorkplaceType, type SalaryPeriod } from '../../services/api/job.api';
import { jobKeys, workflowKeys } from '../../constants/queryKeys';
import {
  ChevronRight, ChevronLeft, Check, Briefcase,
  Plus, X, Save, Send, MapPin, GitBranch, Loader2, AlertCircle, Calendar, DollarSign,
} from 'lucide-react';

const steps = [
  { id: 1, label: 'Role Basics', shortLabel: 'Basics' },
  { id: 2, label: 'Job Description', shortLabel: 'Description' },
  { id: 3, label: 'Skills & Perks', shortLabel: 'Skills & Perks' },
  { id: 4, label: 'Hiring Workflow', shortLabel: 'Workflow' },
  { id: 5, label: 'Review & Publish', shortLabel: 'Review' },
];

const defaultForm = {
  title: '',
  employmentType: 'FULL_TIME' as EmploymentType,
  workplaceType: 'ONSITE' as WorkplaceType,
  vacancies: '1',
  location: '',
  minExperience: 0,
  maxExperience: 3,
  minimumSalary: '',
  maximumSalary: '',
  salaryPeriod: 'YEARLY' as SalaryPeriod,
  hideSalary: false,
  currency: 'USD',
  description: '',
  skills: [] as string[],
  benefits: '',
  applicationDeadline: '',
  workflowId: '',
};

type JobFormState = typeof defaultForm;

const CreateJobPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('editId');

  const queryClient = useQueryClient();
  const { user } = useAuth();
  const companyId = user?.companyId || user?.companies?.[0]?.companyId;
  const draftStorageKey = `tf_job_draft_${companyId || 'default'}_${editId || 'new'}`;

  // Fetch ACTIVE workflows for this company
  const { data: workflows = [], isLoading: isLoadingWorkflows } = useQuery({
    queryKey: workflowKeys.list(companyId || '', 'ACTIVE'),
    queryFn: () => (companyId ? workflowApi.getWorkflows(companyId, 'ACTIVE') : Promise.resolve([])),
    enabled: Boolean(companyId),
  });

  const defaultWorkflow = workflows.find(w => w.isDefault && w.status === 'ACTIVE') || workflows[0];

  const isInitializedRef = useRef(false);
  const currentEditIdRef = useRef<string | null>(null);

  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<JobFormState>(defaultForm);
  const [newSkill, setNewSkill] = useState('');

  // 1. Fetch Existing Job if editId is present
  const { data: existingJob, isLoading: isLoadingExistingJob } = useQuery({
    queryKey: jobKeys.detail(companyId || '', editId || ''),
    queryFn: () => (companyId && editId ? jobApi.getJobDetails(companyId, editId) : Promise.resolve(null)),
    enabled: Boolean(companyId && editId),
  });

  // Track changes in editId to re-initialize
  useEffect(() => {
    if (currentEditIdRef.current !== editId) {
      isInitializedRef.current = false;
      currentEditIdRef.current = editId;
    }
  }, [editId]);

  // Pre-populate if in edit mode or restore session draft
  useEffect(() => {
    if (editId) {
      if (existingJob && !isInitializedRef.current) {
        const rawWorkplace = existingJob.workplaceType as string;
        const wpType: WorkplaceType = (rawWorkplace === 'ON_SITE' ? 'ONSITE' : existingJob.workplaceType) || 'ONSITE';

        // Check if there is an in-memory session draft for this job
        const savedSession = sessionStorage.getItem(draftStorageKey);
        let sessionData: any = null;
        try {
          if (savedSession) sessionData = JSON.parse(savedSession);
        } catch {}

        if (sessionData?.form && sessionData?.form?.title) {
          setForm(sessionData.form);
          if (typeof sessionData.step === 'number') setStep(sessionData.step);
        } else {
          setForm({
            title: existingJob.title || '',
            employmentType: existingJob.employmentType || 'FULL_TIME',
            workplaceType: wpType,
            vacancies: String(existingJob.vacancies ?? 1),
            location: wpType === 'REMOTE' ? '' : (existingJob.location || ''),
            minExperience: existingJob.minExperience ?? 0,
            maxExperience: existingJob.maxExperience ?? 3,
            minimumSalary: existingJob.minimumSalary ? String(existingJob.minimumSalary) : '',
            maximumSalary: existingJob.maximumSalary ? String(existingJob.maximumSalary) : '',
            salaryPeriod: existingJob.salaryPeriod || 'YEARLY',
            hideSalary: existingJob.hideSalary ?? false,
            currency: 'USD',
            description: existingJob.description || '',
            skills: existingJob.skills?.map((s: any) => s.name) || [],
            benefits: existingJob.benefits?.map((b: any) => b.benefit).join('\n') || '',
            applicationDeadline: existingJob.applicationDeadline ? existingJob.applicationDeadline.split('T')[0] : '',
            workflowId: existingJob.workflowId || defaultWorkflow?.id || '',
          });
        }
        isInitializedRef.current = true;
      }
    } else {
      // New job creation
      if (!isInitializedRef.current) {
        const savedSession = sessionStorage.getItem(draftStorageKey);
        let sessionData: any = null;
        try {
          if (savedSession) sessionData = JSON.parse(savedSession);
        } catch {}

        if (sessionData?.form) {
          setForm(sessionData.form);
          if (typeof sessionData.step === 'number') setStep(sessionData.step);
        } else if (defaultWorkflow && !form.workflowId) {
          setForm(f => ({ ...f, workflowId: defaultWorkflow.id }));
        }
        isInitializedRef.current = true;
      }
    }
  }, [existingJob, defaultWorkflow, editId, draftStorageKey]);

  const isPublishedJob = existingJob?.status === 'PUBLISHED';

  // Auto-save form inputs and current step to session storage (only after initialization)
  useEffect(() => {
    if (isInitializedRef.current && !isPublishedJob) {
      try {
        sessionStorage.setItem(
          draftStorageKey,
          JSON.stringify({ form, step, savedAt: Date.now() })
        );
      } catch {}
    }
  }, [form, step, draftStorageKey, isPublishedJob]);

  // 2. Create or Update Job Mutation
  const saveJobMutation = useMutation({
    mutationFn: async (publish: boolean) => {
      if (!companyId) throw new Error('Company ID missing');
      if (isPublishedJob) throw new Error('Published jobs cannot be edited');
      if (!form.title.trim()) throw new Error('Job title is required');
      if (!form.description.trim()) throw new Error('Job description is required');
      if (!form.workflowId) throw new Error('Please select a hiring workflow');
      if (form.workplaceType !== 'REMOTE' && !form.location.trim()) {
        throw new Error('Location is required for On-site and Hybrid jobs');
      }

      const payload: CreateJobPayload = {
        title: form.title.trim(),
        description: form.description.trim(),
        employmentType: form.employmentType,
        workplaceType: form.workplaceType,
        vacancies: Number(form.vacancies) || 1,
        location: form.workplaceType === 'REMOTE' ? undefined : (form.location.trim() || undefined),
        minExperience: Number(form.minExperience) || 0,
        maxExperience: Number(form.maxExperience) || 0,
        minimumSalary: form.minimumSalary ? Number(form.minimumSalary) : undefined,
        maximumSalary: form.maximumSalary ? Number(form.maximumSalary) : undefined,
        salaryPeriod: form.salaryPeriod,
        hideSalary: form.hideSalary,
        applicationDeadline: form.applicationDeadline ? new Date(form.applicationDeadline).toISOString() : undefined,
        skills: form.skills.length > 0 ? form.skills : ['General'],
        benefits: form.benefits.trim() ? form.benefits.split('\n').filter(b => b.trim().length > 0) : [],
        workflowId: form.workflowId,
        status: publish ? 'PUBLISHED' : 'DRAFT',
      };

      if (editId) {
        await jobApi.updateJobDetails(companyId, editId, payload);
        if (publish) {
          await jobApi.updateJobStatus(companyId, editId, 'PUBLISHED');
        }
        return;
      }
      return jobApi.createJob(companyId, payload);
    },
    onSuccess: (_, publish) => {
      try {
        sessionStorage.removeItem(draftStorageKey);
      } catch {}

      toast.success(
        publish
          ? (editId ? 'Job updated & published successfully!' : 'Job published successfully!')
          : (editId ? 'Draft updated successfully!' : 'Draft saved successfully!')
      );
      queryClient.invalidateQueries({ queryKey: jobKeys.list(companyId || '') });
      navigate('/recruiter/jobs');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to save job');
    },
  });

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      setForm(f => ({ ...f, skills: [...f.skills, trimmed] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }));
  };

  const selectedWorkflow = workflows.find(w => w.id === form.workflowId)
    || (existingJob?.workflowId === form.workflowId && existingJob?.workflow ? existingJob.workflow : undefined)
    || defaultWorkflow;

  const workflowStages = selectedWorkflow?.stages ?? [];

  if (editId && isLoadingExistingJob) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          <p className="text-sm font-medium text-slate-500">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
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
              <span className="text-slate-700 font-medium">{editId ? (isPublishedJob ? 'View Job Details' : 'Edit Job Draft') : 'Create New Job'}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1 font-display">
              {editId ? (isPublishedJob ? 'Job Details' : 'Edit Job Draft') : 'Create New Job'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isPublishedJob ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Check className="w-3.5 h-3.5" /> Published (Locked)
            </span>
          ) : (
            <>
              <button
                type="button"
                onClick={() => saveJobMutation.mutate(false)}
                disabled={saveJobMutation.isPending}
                className="btn-secondary text-sm flex items-center gap-2 border border-slate-300 hover:bg-slate-50"
              >
                {saveJobMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 text-slate-600" />
                )}
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => saveJobMutation.mutate(true)}
                disabled={saveJobMutation.isPending}
                className="btn-primary text-sm flex items-center gap-2"
              >
                {saveJobMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Publish Job
              </button>
            </>
          )}
        </div>
      </div>

      {isPublishedJob && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-amber-800 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold">This job has already been published and cannot be edited.</p>
            <p className="text-xs text-amber-700 mt-0.5">Published jobs are visible to candidates and permanently locked from direct edits.</p>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Left: Wizard Form */}
        <div className="flex-1 min-w-0">
          {/* Modern Responsive Step Navigation */}
          <div className="card p-3.5 mb-5 shadow-xs border border-slate-200/80 bg-white">
            {/* Header progress info */}
            <div className="flex items-center justify-between px-1 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100">
                  Step {step} of {steps.length}
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  {steps[step - 1]?.label}
                </span>
              </div>
              <span className="text-xs font-medium text-slate-400">
                {Math.round((step / steps.length) * 100)}% Completed
              </span>
            </div>

            {/* Progress line */}
            <div className="w-full bg-slate-100 h-1 rounded-full mb-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${(step / steps.length) * 100}%` }}
              />
            </div>

            {/* Step Grid Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {steps.map((s) => {
                const isCompleted = step > s.id;
                const isCurrent = step === s.id;

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStep(s.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                      isCurrent
                        ? 'bg-primary-50 text-primary-900 border border-primary-300 shadow-xs ring-2 ring-primary-500/20'
                        : isCompleted
                        ? 'bg-emerald-50/70 text-emerald-900 hover:bg-emerald-100/70 border border-emerald-200'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                        isCurrent
                          ? 'bg-primary-600 text-white shadow-xs'
                          : isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : s.id}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold truncate leading-tight">
                        {s.shortLabel}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="card p-6 space-y-6">
            {/* Step 1: Role Basics */}
            {step === 1 && (
              <>
                <SectionTitle title="Role & Basics" subtitle="Enter the core details of the position" />
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <Label>Job Title *</Label>
                    <input
                      className="input-field mt-1"
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. Senior Frontend Engineer"
                    />
                  </div>

                  <div>
                    <Label>Employment Type *</Label>
                    <select
                      className="input-field mt-1"
                      value={form.employmentType}
                      onChange={e => setForm(f => ({ ...f, employmentType: e.target.value as EmploymentType }))}
                    >
                      <option value="FULL_TIME">Full-time</option>
                      <option value="PART_TIME">Part-time</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="INTERNSHIP">Internship</option>
                      <option value="TEMPORARY">Temporary</option>
                      <option value="APPRENTICESHIP">Apprenticeship</option>
                    </select>
                  </div>

                  <div>
                    <Label>Open Vacancies *</Label>
                    <input
                      className="input-field mt-1"
                      type="number"
                      min="1"
                      value={form.vacancies}
                      onChange={e => setForm(f => ({ ...f, vacancies: e.target.value }))}
                      placeholder="1"
                    />
                  </div>

                  <div>
                    <Label>Workplace Type *</Label>
                    <select
                      className="input-field mt-1"
                      value={form.workplaceType}
                      onChange={e => {
                        const val = e.target.value as WorkplaceType;
                        setForm(f => ({
                          ...f,
                          workplaceType: val,
                          location: val === 'REMOTE' ? '' : f.location,
                        }));
                      }}
                    >
                      <option value="ONSITE">On-site (Office)</option>
                      <option value="HYBRID">Hybrid</option>
                      <option value="REMOTE">Remote</option>
                    </select>
                  </div>

                  <div>
                    <Label>Job Location {form.workplaceType === 'REMOTE' ? '(Remote / Anywhere)' : '*'}</Label>
                    <input
                      className={`input-field mt-1 ${form.workplaceType === 'REMOTE' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''}`}
                      value={form.workplaceType === 'REMOTE' ? 'Remote (No office location required)' : form.location}
                      onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                      disabled={form.workplaceType === 'REMOTE'}
                      placeholder={form.workplaceType === 'REMOTE' ? 'Remote (No office location required)' : 'City, Country (e.g. Bangalore, India)'}
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Experience Range (Years)</Label>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex-1">
                        <input
                          className="input-field"
                          type="number"
                          min="0"
                          value={form.minExperience}
                          onChange={e => setForm(f => ({ ...f, minExperience: Number(e.target.value) }))}
                          placeholder="Min (e.g. 0)"
                        />
                      </div>
                      <span className="text-slate-400 font-medium">–</span>
                      <div className="flex-1">
                        <input
                          className="input-field"
                          type="number"
                          min="0"
                          value={form.maxExperience}
                          onChange={e => setForm(f => ({ ...f, maxExperience: Number(e.target.value) }))}
                          placeholder="Max (e.g. 3)"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <Label>Compensation (Optional)</Label>
                    <div className="flex items-center gap-3 mt-1">
                      <input
                        className="input-field flex-1"
                        type="number"
                        min="0"
                        value={form.minimumSalary}
                        onChange={e => setForm(f => ({ ...f, minimumSalary: e.target.value }))}
                        placeholder="Min Salary"
                      />
                      <span className="text-slate-400 font-medium">–</span>
                      <input
                        className="input-field flex-1"
                        type="number"
                        min="0"
                        value={form.maximumSalary}
                        onChange={e => setForm(f => ({ ...f, maximumSalary: e.target.value }))}
                        placeholder="Max Salary"
                      />
                      <select
                        className="input-field w-32"
                        value={form.salaryPeriod}
                        onChange={e => setForm(f => ({ ...f, salaryPeriod: e.target.value as SalaryPeriod }))}
                      >
                        <option value="YEARLY">Yearly</option>
                        <option value="MONTHLY">Monthly</option>
                        <option value="HOURLY">Hourly</option>
                      </select>
                    </div>
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.hideSalary}
                        onChange={e => setForm(f => ({ ...f, hideSalary: e.target.checked }))}
                        className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-xs text-slate-600">Hide salary from public job listing</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Job Description */}
            {step === 2 && (
              <>
                <SectionTitle
                  title="Job Description"
                  subtitle="Provide a comprehensive description of the role, responsibilities, and requirements"
                />
                <div>
                  <Label>Job Description & Requirements *</Label>
                  <textarea
                    className="input-field mt-1 h-80 resize-none font-sans text-sm leading-relaxed"
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Provide an overview of the position, day-to-day responsibilities, qualifications, and candidate requirements..."
                  />
                  <p className="text-xs text-slate-400 mt-1.5">
                    Tip: Clearly outline responsibilities, qualification criteria, and day-to-day expectations to attract the best candidates.
                  </p>
                </div>
              </>
            )}

            {/* Step 3: Skills & Perks */}
            {step === 3 && (
              <>
                <SectionTitle title="Skills & Benefits" subtitle="Specify required technologies and perks offered" />
                <div>
                  <Label>Required Skills *</Label>
                  <div className="flex flex-wrap gap-2 mt-2 mb-3">
                    {form.skills.map(s => (
                      <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-200">
                        {s}
                        <button type="button" onClick={() => removeSkill(s)} className="hover:text-primary-900">
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
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      placeholder="Add a skill (e.g. React, TypeScript, Node.js) and press Enter"
                    />
                    <button type="button" onClick={addSkill} className="btn-primary flex items-center gap-1.5">
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <Label>Benefits & Perks (One per line)</Label>
                  <textarea
                    className="input-field mt-1 h-36 resize-none font-sans text-sm leading-relaxed"
                    value={form.benefits}
                    onChange={e => setForm(f => ({ ...f, benefits: e.target.value }))}
                    placeholder="Flexible Working Hours&#10;Health & Dental Insurance&#10;Annual Performance Bonus&#10;Learning & Development Budget&#10;Paid Time Off"
                  />
                </div>
              </>
            )}

            {/* Step 4: Hiring Workflow */}
            {step === 4 && (
              <>
                <SectionTitle
                  title="Hiring Workflow & Schedule"
                  subtitle="Select the candidate assessment pipeline and application timeline"
                />

                <div className="space-y-4">
                  <div>
                    <Label>Hiring Workflow *</Label>
                    <div className="mt-2">
                      <WorkflowSelector
                        selectedId={form.workflowId || null}
                        onSelect={id => setForm(f => ({ ...f, workflowId: id }))}
                        workflows={workflows}
                        isLoading={isLoadingWorkflows}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
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

                  <div className="pt-4 border-t border-slate-100">
                    <Label>Application Deadline (Optional)</Label>
                    <div className="mt-1 relative max-w-sm">
                      <input
                        className="input-field"
                        type="date"
                        value={form.applicationDeadline}
                        onChange={e => setForm(f => ({ ...f, applicationDeadline: e.target.value }))}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Applications will automatically close after this date if specified.</p>
                  </div>
                </div>
              </>
            )}

            {/* Step 5: Review & Publish */}
            {step === 5 && (
              <>
                <SectionTitle title="Review & Publish" subtitle="Review your job details before saving or publishing" />
                <div className="space-y-4">
                  <ReviewField label="Job Title" value={form.title || 'Not provided'} />
                  <ReviewField
                    label="Employment Type"
                    value={
                      form.employmentType === 'FULL_TIME' ? 'Full-time'
                      : form.employmentType === 'PART_TIME' ? 'Part-time'
                      : form.employmentType === 'CONTRACT' ? 'Contract'
                      : form.employmentType === 'INTERNSHIP' ? 'Internship'
                      : form.employmentType === 'TEMPORARY' ? 'Temporary'
                      : 'Apprenticeship'
                    }
                  />
                  <ReviewField
                    label="Workplace"
                    value={
                      form.workplaceType === 'ONSITE' ? 'On-site'
                      : form.workplaceType === 'HYBRID' ? 'Hybrid'
                      : 'Remote'
                    }
                  />
                  <ReviewField
                    label="Location"
                    value={form.workplaceType === 'REMOTE' ? 'Remote (Anywhere)' : (form.location || 'Not specified')}
                  />
                  <ReviewField label="Vacancies" value={form.vacancies || '1'} />
                  <ReviewField label="Experience" value={`${form.minExperience} – ${form.maxExperience} years`} />
                  <ReviewField
                    label="Salary"
                    value={
                      form.hideSalary
                        ? 'Hidden from listing'
                        : (form.minimumSalary || form.maximumSalary)
                        ? `$${form.minimumSalary || '0'} – $${form.maximumSalary || '0'} (${form.salaryPeriod.toLowerCase()})`
                        : 'Not specified'
                    }
                  />
                  <ReviewField
                    label="Skills"
                    value={form.skills.length > 0 ? form.skills.join(', ') : 'None specified'}
                  />
                  <ReviewField
                    label="Deadline"
                    value={form.applicationDeadline ? new Date(form.applicationDeadline).toLocaleDateString() : 'No deadline'}
                  />
                  <ReviewField label="Hiring Workflow" value={selectedWorkflow?.name ?? 'Not selected'} />

                  {selectedWorkflow && (
                    <div className="flex gap-4">
                      <span className="text-sm font-semibold text-slate-500 w-36 flex-shrink-0">Pipeline</span>
                      <div className="flex flex-wrap gap-1.5">
                        {workflowStages.map((stage, i) => (
                          <React.Fragment key={stage.id}>
                            {i > 0 && <span className="text-slate-300 text-xs">→</span>}
                            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                              {stage.stageLibrary?.name || 'Stage'}
                            </span>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
                  {isPublishedJob ? (
                    <div className="flex-1 py-2.5 px-4 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold text-center border border-emerald-200">
                      ✓ Published & Active
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => saveJobMutation.mutate(false)}
                        disabled={saveJobMutation.isPending}
                        className="btn-secondary flex-1 text-sm flex items-center justify-center gap-2 border border-slate-300"
                      >
                        {saveJobMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 text-slate-600" />
                        )}
                        Save Draft
                      </button>
                      <button
                        type="button"
                        onClick={() => saveJobMutation.mutate(true)}
                        disabled={saveJobMutation.isPending}
                        className="btn-primary flex-1 text-sm flex items-center justify-center gap-2"
                      >
                        {saveJobMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        Publish Job
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
              className="btn-secondary text-sm flex items-center gap-2 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            {step < steps.length && (
              <button
                type="button"
                onClick={() => setStep(s => Math.min(steps.length, s + 1))}
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
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${isPublishedJob ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {isPublishedJob ? 'Published' : 'Draft'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-tight">{form.title || 'Job Title'}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {form.employmentType === 'FULL_TIME' ? 'Full-time' : form.employmentType}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                    <MapPin className="w-3 h-3" />
                    <span>
                      {form.workplaceType === 'REMOTE'
                        ? 'Remote'
                        : `${form.location || 'Location'} · ${form.workplaceType === 'HYBRID' ? 'Hybrid' : 'On-site'}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E5E7EB] pt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-slate-400">Experience</p>
                  <p className="font-semibold text-slate-700 mt-0.5">{form.minExperience}–{form.maxExperience} yrs</p>
                </div>
                <div>
                  <p className="text-slate-400">Openings</p>
                  <p className="font-semibold text-slate-700 mt-0.5">{form.vacancies || 1}</p>
                </div>
                {(form.minimumSalary || form.maximumSalary) && !form.hideSalary && (
                  <div className="col-span-2">
                    <p className="text-slate-400">Salary</p>
                    <p className="font-semibold text-slate-700 mt-0.5">
                      ${form.minimumSalary || 0} – ${form.maximumSalary || 0} ({form.salaryPeriod.toLowerCase()})
                    </p>
                  </div>
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
                  <p className="text-[10px] text-slate-400 mt-1">{workflowStages.length} stages</p>
                </div>
              )}

              <div className="border-t border-[#E5E7EB] pt-3">
                <button
                  type="button"
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
