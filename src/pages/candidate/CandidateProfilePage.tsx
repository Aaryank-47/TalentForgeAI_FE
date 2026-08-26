import React, { useState } from 'react';
import {
  Edit2, Upload, Plus, Trash2, ExternalLink, Eye, Download, RefreshCw,
  MapPin, Mail, Phone, Globe, GraduationCap,
  FileText, CheckCircle, X, Star, Zap, Loader2,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  candidateApi,
  type CandidateSkill,
  type CandidateEducation,
  type CandidateExperience,
  type AddEducationDto,
  type AddExperienceDto,
} from '../../services/api/candidate.api';
import { candidateKeys, authKeys } from '../../constants/queryKeys';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/ui/Modal';
import { ResumeSection } from '../../components/candidate/ResumeSection';
import toast from 'react-hot-toast';

const ProfileRing = ({ pct }: { pct: number }) => {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const filled = (pct / 100) * circ;
  return (
    <svg width="110" height="110" viewBox="0 0 110 110">
      <circle cx="55" cy="55" r={r} fill="none" stroke="#E5E7EB" strokeWidth="7" />
      <circle
        cx="55"
        cy="55"
        r={r}
        fill="none"
        stroke="#22C55E"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circ}`}
        transform="rotate(-90 55 55)"
        style={{ transition: 'stroke-dasharray 0.7s' }}
      />
    </svg>
  );
};

const CandidateProfilePage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Modals state
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [showAddEducationModal, setShowAddEducationModal] = useState(false);
  const [showAddExperienceModal, setShowAddExperienceModal] = useState(false);

  // Editing state
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);

  // Skill form state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillYears, setNewSkillYears] = useState(1);

  // Education form state
  const [educationForm, setEducationForm] = useState<AddEducationDto>({
    collegeName: '',
    degree: '',
    fieldOfStudy: '',
    currentlyStudying: false,
    startDate: '',
    endDate: '',
    gradingSystem: 'CGPA',
    gradeText: '',
  });

  // Experience form state
  const [experienceForm, setExperienceForm] = useState<AddExperienceDto>({
    companyName: '',
    designation: '',
    employmentType: 'FULL_TIME',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
  });

  // Profile Edit form state
  const [editForm, setEditForm] = useState({
    fullName: '',
    headline: '',
    phoneNumber: '',
    currentLocation: '',
    currentCompany: '',
    currentDesignation: '',
    bio: '',
    portfolioUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    websiteUrl: '',
  });

  // Fetch Candidate Profile (GET /candidate/me)
  const {
    data: candidate,
    isLoading: isLoadingProfile,
  } = useQuery({
    queryKey: candidateKeys.me,
    queryFn: () => candidateApi.getCandidateProfile(),
  });

  // Fetch Skills (GET /candidate/skills)
  const {
    data: skillsData,
    isLoading: isLoadingSkills,
  } = useQuery({
    queryKey: candidateKeys.skills,
    queryFn: () => candidateApi.getSkills(),
  });

  // Fetch Educations (GET /candidate/educations)
  const {
    data: educationsData,
    isLoading: isLoadingEducations,
  } = useQuery({
    queryKey: candidateKeys.educations,
    queryFn: () => candidateApi.getEducations(),
  });

  // Fetch Experiences (GET /candidate/experiences)
  const {
    data: experiencesData,
    isLoading: isLoadingExperiences,
  } = useQuery({
    queryKey: candidateKeys.experiences,
    queryFn: () => candidateApi.getExperiences(),
  });

  // Fetch Profile Completion
  const { data: completionData } = useQuery({
    queryKey: candidateKeys.completion,
    queryFn: () => candidateApi.getProfileCompletion(),
  });

  // Update Profile Mutation (PATCH /candidate/me)
  const updateProfileMutation = useMutation({
    mutationFn: (data: typeof editForm) => candidateApi.updateCandidateProfile(data),
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      setShowEditProfileModal(false);
      queryClient.invalidateQueries({ queryKey: candidateKeys.me });
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to update profile');
    },
  });

  // Add Skill Mutation (POST /candidate/skills)
  const addSkillMutation = useMutation({
    mutationFn: (skill: { skillName: string; skillExperience: number }) =>
      candidateApi.addSkills([skill]),
    onSuccess: () => {
      toast.success('Skill added successfully!');
      setNewSkillName('');
      setNewSkillYears(1);
      setShowAddSkillModal(false);
      queryClient.invalidateQueries({ queryKey: candidateKeys.skills });
      queryClient.invalidateQueries({ queryKey: candidateKeys.me });
      queryClient.invalidateQueries({ queryKey: candidateKeys.completion });
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to add skill');
    },
  });

  // Delete Skill Mutation
  const deleteSkillMutation = useMutation({
    mutationFn: (skillId: string) => candidateApi.deleteSkills([skillId]),
    onSuccess: () => {
      toast.success('Skill removed');
      queryClient.invalidateQueries({ queryKey: candidateKeys.skills });
      queryClient.invalidateQueries({ queryKey: candidateKeys.me });
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to remove skill');
    },
  });

  // Add Education Mutation (POST /candidate/educations)
  const addEducationMutation = useMutation({
    mutationFn: (data: AddEducationDto) => candidateApi.addEducation(data),
    onSuccess: () => {
      toast.success('Education added successfully!');
      setShowAddEducationModal(false);
      setEditingEducationId(null);
      setEducationForm({
        collegeName: '',
        degree: '',
        fieldOfStudy: '',
        currentlyStudying: false,
        startDate: '',
        endDate: '',
        gradingSystem: 'CGPA',
        gradeText: '',
      });
      queryClient.invalidateQueries({ queryKey: candidateKeys.educations });
      queryClient.invalidateQueries({ queryKey: candidateKeys.me });
      queryClient.invalidateQueries({ queryKey: candidateKeys.completion });
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to add education');
    },
  });

  // Update Education Mutation (PATCH /candidate/educations/:id)
  const updateEducationMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddEducationDto }) =>
      candidateApi.updateEducation(id, data),
    onSuccess: () => {
      toast.success('Education updated successfully!');
      setShowAddEducationModal(false);
      setEditingEducationId(null);
      queryClient.invalidateQueries({ queryKey: candidateKeys.educations });
      queryClient.invalidateQueries({ queryKey: candidateKeys.me });
      queryClient.invalidateQueries({ queryKey: candidateKeys.completion });
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to update education');
    },
  });

  // Delete Education Mutation (DELETE /candidate/educations/:id)
  const deleteEducationMutation = useMutation({
    mutationFn: (educationId: string) => candidateApi.deleteEducation(educationId),
    onSuccess: () => {
      toast.success('Education deleted');
      queryClient.invalidateQueries({ queryKey: candidateKeys.educations });
      queryClient.invalidateQueries({ queryKey: candidateKeys.me });
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to delete education');
    },
  });

  // Add Experience Mutation (POST /candidate/experiences)
  const addExperienceMutation = useMutation({
    mutationFn: (data: AddExperienceDto) => candidateApi.addExperience(data),
    onSuccess: () => {
      toast.success('Work experience added successfully!');
      setShowAddExperienceModal(false);
      setEditingExperienceId(null);
      setExperienceForm({
        companyName: '',
        designation: '',
        employmentType: 'FULL_TIME',
        description: '',
        location: '',
        startDate: '',
        endDate: '',
        currentlyWorking: false,
      });
      queryClient.invalidateQueries({ queryKey: candidateKeys.experiences });
      queryClient.invalidateQueries({ queryKey: candidateKeys.me });
      queryClient.invalidateQueries({ queryKey: candidateKeys.completion });
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to add experience');
    },
  });

  // Update Experience Mutation (PATCH /candidate/experiences/:id)
  const updateExperienceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddExperienceDto }) =>
      candidateApi.updateExperience(id, data),
    onSuccess: () => {
      toast.success('Experience updated successfully!');
      setShowAddExperienceModal(false);
      setEditingExperienceId(null);
      queryClient.invalidateQueries({ queryKey: candidateKeys.experiences });
      queryClient.invalidateQueries({ queryKey: candidateKeys.me });
      queryClient.invalidateQueries({ queryKey: candidateKeys.completion });
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to update experience');
    },
  });

  // Delete Experience Mutation (DELETE /candidate/experiences/:id)
  const deleteExperienceMutation = useMutation({
    mutationFn: (experienceId: string) => candidateApi.deleteExperience(experienceId),
    onSuccess: () => {
      toast.success('Experience deleted');
      queryClient.invalidateQueries({ queryKey: candidateKeys.experiences });
      queryClient.invalidateQueries({ queryKey: candidateKeys.me });
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to delete experience');
    },
  });

  // Open Edit Experience Modal
  const handleOpenEditExperience = (exp: CandidateExperience) => {
    setEditingExperienceId(exp.id);
    setExperienceForm({
      companyName: exp.companyName,
      designation: exp.designation,
      employmentType: exp.employmentType || 'FULL_TIME',
      description: exp.description || '',
      location: exp.location || '',
      startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
      currentlyWorking: exp.currentlyWorking || !exp.endDate,
    });
    setShowAddExperienceModal(true);
  };

  // Open Edit Education Modal
  const handleOpenEditEducation = (edu: CandidateEducation) => {
    setEditingEducationId(edu.id);
    setEducationForm({
      collegeName: edu.collegeName,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      currentlyStudying: edu.currentlyStudying || !edu.endDate,
      startDate: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : '',
      endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : '',
      gradingSystem: edu.gradingSystem || 'CGPA',
      gradeText: edu.gradeText || '',
      grade: edu.grade || undefined,
    });
    setShowAddEducationModal(true);
  };

  // Open Edit Modal with current values
  const handleOpenEdit = () => {
    setEditForm({
      fullName: candidate?.fullName || user?.fullName || '',
      headline: candidate?.headline || '',
      phoneNumber: candidate?.phoneNumber || '',
      currentLocation: candidate?.currentLocation || '',
      currentCompany: candidate?.currentCompany || '',
      currentDesignation: candidate?.currentDesignation || '',
      bio: candidate?.bio || '',
      portfolioUrl: candidate?.portfolioUrl || '',
      githubUrl: candidate?.githubUrl || '',
      linkedinUrl: candidate?.linkedinUrl || '',
      websiteUrl: candidate?.websiteUrl || '',
    });
    setShowEditProfileModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Record<string, any> = {};
    Object.entries(editForm).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) {
        payload[k] = typeof v === 'string' ? v.trim() : v;
      }
    });
    updateProfileMutation.mutate(payload as typeof editForm);
  };

  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    addSkillMutation.mutate({
      skillName: newSkillName.trim(),
      skillExperience: Number(newSkillYears) || 1,
    });
  };

  const displaySkills: CandidateSkill[] = skillsData || candidate?.skills || [];
  const displayEducations: CandidateEducation[] = educationsData || candidate?.educations || [];
  const displayExperiences: CandidateExperience[] = experiencesData || candidate?.experiences || [];
  const profileName = candidate?.fullName || user?.fullName || 'Candidate';
  const profileCompletion = completionData?.completion ?? candidate?.profileCompletion ?? 60;
  const initials = profileName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'C';

  const links = [
    { icon: Globe, label: 'Portfolio', href: candidate?.portfolioUrl, key: 'portfolio' },
    { icon: Globe, label: 'GitHub', href: candidate?.githubUrl, key: 'github' },
    { icon: Globe, label: 'LinkedIn', href: candidate?.linkedinUrl, key: 'linkedin' },
    { icon: Globe, label: 'Website', href: candidate?.websiteUrl, key: 'website' },
  ].filter(l => Boolean(l.href));

  return (
    <div className="max-w-[1100px] space-y-6">
      {/* Profile Header */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {initials}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-display font-bold text-[#0F172A]">{profileName}</h1>
                <p className="text-slate-500 mt-0.5">
                  {candidate?.headline || candidate?.currentDesignation || 'Candidate'}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                  {candidate?.currentLocation && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {candidate.currentLocation}
                    </span>
                  )}
                  {user?.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      {user.email}
                    </span>
                  )}
                  {candidate?.phoneNumber && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {candidate.phoneNumber}
                    </span>
                  )}
                </div>
                {links.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    {links.map(l => (
                      <a
                        key={l.key}
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-[11px] text-primary-600 hover:text-primary-700 font-medium bg-primary-50 px-2.5 py-1 rounded-full border border-primary-100 transition-colors"
                      >
                        <l.icon className="w-3 h-3" />
                        {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleOpenEdit}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
            </div>
            {candidate?.bio && (
              <p className="text-sm text-slate-600 leading-relaxed mt-3 max-w-2xl">{candidate.bio}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Resume & Auto-Enrichment Flow (POST /resume/upload & BullMQ worker) */}
          <ResumeSection />

          {/* Skills (GET /candidates/skills & POST /skills) */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-bold text-[#0F172A] text-base">Skills</h2>
                <p className="text-xs text-slate-400">Your verified technical competencies</p>
              </div>
              <button
                onClick={() => setShowAddSkillModal(true)}
                className="flex items-center gap-1.5 text-xs text-primary-600 font-semibold hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Skill
              </button>
            </div>

            {isLoadingSkills || isLoadingProfile ? (
              <div className="py-6 flex items-center justify-center text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading skills...
              </div>
            ) : displaySkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {displaySkills.map(skill => (
                  <span
                    key={skill.id || skill.name}
                    className="group flex items-center gap-2 bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl hover:border-primary-300 hover:bg-primary-50/50 transition-colors"
                  >
                    <span>{skill.name}</span>
                    {skill.yearsOfExperience > 0 && (
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({skill.yearsOfExperience}y)
                      </span>
                    )}
                    <button
                      onClick={() => deleteSkillMutation.mutate(skill.id)}
                      disabled={deleteSkillMutation.isPending}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                <p className="text-xs text-slate-400">No skills added yet.</p>
                <button
                  onClick={() => setShowAddSkillModal(true)}
                  className="mt-2 text-xs font-semibold text-primary-600 hover:underline"
                >
                  + Add your first skill
                </button>
              </div>
            )}
          </div>

          {/* Work Experience */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-bold text-[#0F172A] text-base">Work Experience</h2>
                <p className="text-xs text-slate-400">Previous roles, companies, and responsibilities</p>
              </div>
              <button
                onClick={() => {
                  setEditingExperienceId(null);
                  setExperienceForm({
                    companyName: '',
                    designation: '',
                    employmentType: 'FULL_TIME',
                    description: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    currentlyWorking: false,
                  });
                  setShowAddExperienceModal(true);
                }}
                className="flex items-center gap-1.5 text-xs text-primary-600 font-semibold hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Experience
              </button>
            </div>
            {isLoadingExperiences || isLoadingProfile ? (
              <div className="py-6 flex items-center justify-center text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading experiences...
              </div>
            ) : displayExperiences.length > 0 ? (
              <div className="space-y-3">
                {displayExperiences.map(exp => (
                  <div key={exp.id} className="group p-4 rounded-xl border border-slate-200 bg-white hover:border-primary-200 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm">{exp.designation}</h3>
                        <p className="text-xs font-medium text-slate-600 mt-0.5">
                          {exp.companyName} {exp.location ? `· ${exp.location}` : ''}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} –{' '}
                          {exp.currentlyWorking || !exp.endDate
                            ? 'Present'
                            : new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEditExperience(exp)}
                          className="p-1.5 text-slate-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                          title="Edit experience"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteExperienceMutation.mutate(exp.id)}
                          disabled={deleteExperienceMutation.isPending}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete experience"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                <p className="text-xs text-slate-400">No work experience added yet.</p>
                <button
                  onClick={() => {
                    setEditingExperienceId(null);
                    setExperienceForm({
                      companyName: '',
                      designation: '',
                      employmentType: 'FULL_TIME',
                      description: '',
                      location: '',
                      startDate: '',
                      endDate: '',
                      currentlyWorking: false,
                    });
                    setShowAddExperienceModal(true);
                  }}
                  className="mt-2 text-xs font-semibold text-primary-600 hover:underline"
                >
                  + Add your first work experience
                </button>
              </div>
            )}
          </div>

          {/* Education */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-bold text-[#0F172A] text-base">Education</h2>
                <p className="text-xs text-slate-400">Degrees, colleges, and certifications</p>
              </div>
              <button
                onClick={() => {
                  setEditingEducationId(null);
                  setEducationForm({
                    collegeName: '',
                    degree: '',
                    fieldOfStudy: '',
                    currentlyStudying: false,
                    startDate: '',
                    endDate: '',
                    gradingSystem: 'CGPA',
                    gradeText: '',
                  });
                  setShowAddEducationModal(true);
                }}
                className="flex items-center gap-1.5 text-xs text-primary-600 font-semibold hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Education
              </button>
            </div>
            {isLoadingEducations || isLoadingProfile ? (
              <div className="py-6 flex items-center justify-center text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading education...
              </div>
            ) : displayEducations.length > 0 ? (
              <div className="space-y-3">
                {displayEducations.map(edu => (
                  <div key={edu.id} className="group p-4 rounded-xl border border-slate-200 bg-white hover:border-primary-200 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm">{edu.collegeName}</h3>
                        <p className="text-xs font-medium text-slate-600 mt-0.5">
                          {edu.degree} in {edu.fieldOfStudy}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(edu.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} –{' '}
                          {edu.currentlyStudying || !edu.endDate
                            ? 'Present'
                            : new Date(edu.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                          {edu.gradeText ? ` · Grade: ${edu.gradeText}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEditEducation(edu)}
                          className="p-1.5 text-slate-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                          title="Edit education"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteEducationMutation.mutate(edu.id)}
                          disabled={deleteEducationMutation.isPending}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete education"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                <p className="text-xs text-slate-400">No education records added yet.</p>
                <button
                  onClick={() => {
                    setEditingEducationId(null);
                    setEducationForm({
                      collegeName: '',
                      degree: '',
                      fieldOfStudy: '',
                      currentlyStudying: false,
                      startDate: '',
                      endDate: '',
                      gradingSystem: 'CGPA',
                      gradeText: '',
                    });
                    setShowAddEducationModal(true);
                  }}
                  className="mt-2 text-xs font-semibold text-primary-600 hover:underline"
                >
                  + Add education
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Profile Completion Card */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Profile Completion</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-shrink-0">
                <ProfileRing pct={profileCompletion} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xl font-display font-bold text-slate-900">{profileCompletion}%</p>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  {candidate?.headline ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-200 flex-shrink-0" />
                  )}
                  <span className={candidate?.headline ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                    Headline & Title
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {displaySkills.length > 0 ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-200 flex-shrink-0" />
                  )}
                  <span className={displaySkills.length > 0 ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                    Add Key Skills
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {candidate?.currentLocation ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-200 flex-shrink-0" />
                  )}
                  <span className={candidate?.currentLocation ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                    Location Details
                  </span>
                </div>
              </div>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-700">
              <Zap className="w-3.5 h-3.5 inline mr-1 fill-amber-500" />
              A complete profile gets <strong>3x more</strong> interview invitations!
            </div>
          </div>

          {/* Quick Links */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Portfolio & Links</h3>
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 text-xs">
                <span className="font-semibold text-slate-700">LinkedIn:</span>{' '}
                {candidate?.linkedinUrl ? (
                  <a href={candidate.linkedinUrl} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline break-all">
                    {candidate.linkedinUrl}
                  </a>
                ) : (
                  <span className="text-slate-400">Not set</span>
                )}
              </div>
              <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 text-xs">
                <span className="font-semibold text-slate-700">GitHub:</span>{' '}
                {candidate?.githubUrl ? (
                  <a href={candidate.githubUrl} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline break-all">
                    {candidate.githubUrl}
                  </a>
                ) : (
                  <span className="text-slate-400">Not set</span>
                )}
              </div>
              <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 text-xs">
                <span className="font-semibold text-slate-700">Portfolio:</span>{' '}
                {candidate?.portfolioUrl ? (
                  <a href={candidate.portfolioUrl} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline break-all">
                    {candidate.portfolioUrl}
                  </a>
                ) : (
                  <span className="text-slate-400">Not set</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Edit Candidate Profile (PATCH /candidate/me) */}
      <Modal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        title="Edit Candidate Profile"
        maxWidth="max-w-[540px]"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={editForm.fullName}
              onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Headline</label>
            <input
              type="text"
              placeholder="e.g. Senior Frontend Developer | React & Node.js"
              value={editForm.headline}
              onChange={e => setEditForm({ ...editForm, headline: e.target.value })}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={editForm.phoneNumber}
                onChange={e => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. Bangalore, India"
                value={editForm.currentLocation}
                onChange={e => setEditForm({ ...editForm, currentLocation: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Company</label>
              <input
                type="text"
                value={editForm.currentCompany}
                onChange={e => setEditForm({ ...editForm, currentCompany: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Designation</label>
              <input
                type="text"
                value={editForm.currentDesignation}
                onChange={e => setEditForm({ ...editForm, currentDesignation: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Bio</label>
            <textarea
              rows={3}
              value={editForm.bio}
              onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
              placeholder="Tell recruiters about yourself and your expertise..."
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={editForm.linkedinUrl}
                onChange={e => setEditForm({ ...editForm, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub URL</label>
              <input
                type="url"
                value={editForm.githubUrl}
                onChange={e => setEditForm({ ...editForm, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowEditProfileModal(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
            >
              {updateProfileMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save Profile
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Skill (POST /candidate/skills) */}
      <Modal
        isOpen={showAddSkillModal}
        onClose={() => setShowAddSkillModal(false)}
        title="Add Skill"
        maxWidth="max-w-[400px]"
      >
        <form onSubmit={handleAddSkillSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Skill Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. React, Python, AWS, Figma"
              value={newSkillName}
              onChange={e => setNewSkillName(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Years of Experience</label>
            <input
              type="number"
              min="0"
              max="40"
              value={newSkillYears}
              onChange={e => setNewSkillYears(Number(e.target.value))}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddSkillModal(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addSkillMutation.isPending}
              className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
            >
              {addSkillMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Add Skill
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add/Edit Education (POST/PATCH /candidate/educations) */}
      <Modal
        isOpen={showAddEducationModal}
        onClose={() => {
          setShowAddEducationModal(false);
          setEditingEducationId(null);
        }}
        title={editingEducationId ? 'Edit Education' : 'Add Education'}
        maxWidth="max-w-[480px]"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            const payload: AddEducationDto = {
              collegeName: educationForm.collegeName.trim(),
              degree: educationForm.degree.trim(),
              fieldOfStudy: educationForm.fieldOfStudy.trim(),
              currentlyStudying: Boolean(educationForm.currentlyStudying),
              startDate: educationForm.startDate,
              endDate: educationForm.currentlyStudying ? undefined : (educationForm.endDate || undefined),
              gradingSystem: educationForm.gradingSystem,
              gradeText: educationForm.gradeText?.trim() || undefined,
              grade: educationForm.grade || undefined,
            };
            if (editingEducationId) {
              updateEducationMutation.mutate({ id: editingEducationId, data: payload });
            } else {
              addEducationMutation.mutate(payload);
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">College / University *</label>
            <input
              type="text"
              required
              placeholder="e.g. Stanford University"
              value={educationForm.collegeName}
              onChange={e => setEducationForm({ ...educationForm, collegeName: e.target.value })}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Degree *</label>
              <input
                type="text"
                required
                placeholder="e.g. B.Tech, Master's"
                value={educationForm.degree}
                onChange={e => setEducationForm({ ...educationForm, degree: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Field of Study *</label>
              <input
                type="text"
                required
                placeholder="e.g. Computer Science"
                value={educationForm.fieldOfStudy}
                onChange={e => setEducationForm({ ...educationForm, fieldOfStudy: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={educationForm.startDate}
                onChange={e => setEducationForm({ ...educationForm, startDate: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {educationForm.currentlyStudying ? 'End Date (Expected)' : 'End Date *'}
              </label>
              <input
                type="date"
                required={!educationForm.currentlyStudying}
                value={educationForm.endDate || ''}
                onChange={e => setEducationForm({ ...educationForm, endDate: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="currentlyStudying"
              checked={educationForm.currentlyStudying}
              onChange={e => setEducationForm({ ...educationForm, currentlyStudying: e.target.checked })}
              className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="currentlyStudying" className="text-xs text-slate-700 font-medium cursor-pointer">
              I am currently studying here
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Grading System</label>
              <select
                value={educationForm.gradingSystem}
                onChange={e => setEducationForm({ ...educationForm, gradingSystem: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white"
              >
                <option value="CGPA">CGPA</option>
                <option value="PERCENTAGE">Percentage</option>
                <option value="GPA_4">GPA (Scale 4.0)</option>
                <option value="GPA_5">GPA (Scale 5.0)</option>
                <option value="GPA_10">GPA (Scale 10.0)</option>
                <option value="LETTER_GRADE">Letter Grade</option>
                <option value="PASS_FAIL">Pass / Fail</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Grade / Score</label>
              <input
                type="text"
                placeholder="e.g. 8.8 / 10 or 85%"
                value={educationForm.gradeText || ''}
                onChange={e => setEducationForm({ ...educationForm, gradeText: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setShowAddEducationModal(false);
                setEditingEducationId(null);
              }}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addEducationMutation.isPending || updateEducationMutation.isPending}
              className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
            >
              {(addEducationMutation.isPending || updateEducationMutation.isPending) && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              {editingEducationId ? 'Update Education' : 'Add Education'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add/Edit Experience (POST/PATCH /candidate/experiences) */}
      <Modal
        isOpen={showAddExperienceModal}
        onClose={() => {
          setShowAddExperienceModal(false);
          setEditingExperienceId(null);
        }}
        title={editingExperienceId ? 'Edit Work Experience' : 'Add Work Experience'}
        maxWidth="max-w-[500px]"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            const payload: AddExperienceDto = {
              companyName: experienceForm.companyName.trim(),
              designation: experienceForm.designation.trim(),
              employmentType: experienceForm.employmentType,
              description: experienceForm.description.trim(),
              location: experienceForm.location?.trim() || undefined,
              startDate: experienceForm.startDate,
              endDate: experienceForm.currentlyWorking ? undefined : (experienceForm.endDate || undefined),
              currentlyWorking: Boolean(experienceForm.currentlyWorking),
            };
            if (editingExperienceId) {
              updateExperienceMutation.mutate({ id: editingExperienceId, data: payload });
            } else {
              addExperienceMutation.mutate(payload);
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Designation / Role *</label>
            <input
              type="text"
              required
              placeholder="e.g. Software Engineer"
              value={experienceForm.designation}
              onChange={e => setExperienceForm({ ...experienceForm, designation: e.target.value })}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Microsoft"
                value={experienceForm.companyName}
                onChange={e => setExperienceForm({ ...experienceForm, companyName: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Employment Type</label>
              <select
                value={experienceForm.employmentType}
                onChange={e => setExperienceForm({ ...experienceForm, employmentType: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERN">Internship</option>
                <option value="FREELANCE">Freelance</option>
                <option value="TEMPORARY">Temporary</option>
                <option value="APPRENTICESHIP">Apprenticeship</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
            <input
              type="text"
              placeholder="e.g. Seattle, WA / Remote"
              value={experienceForm.location || ''}
              onChange={e => setExperienceForm({ ...experienceForm, location: e.target.value })}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={experienceForm.startDate}
                onChange={e => setExperienceForm({ ...experienceForm, startDate: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {experienceForm.currentlyWorking ? 'End Date (Present)' : 'End Date *'}
              </label>
              <input
                type="date"
                required={!experienceForm.currentlyWorking}
                disabled={experienceForm.currentlyWorking}
                value={experienceForm.endDate || ''}
                onChange={e => setExperienceForm({ ...experienceForm, endDate: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="currentlyWorking"
              checked={experienceForm.currentlyWorking}
              onChange={e => setExperienceForm({ ...experienceForm, currentlyWorking: e.target.checked })}
              className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="currentlyWorking" className="text-xs text-slate-700 font-medium cursor-pointer">
              I currently work here
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Key Responsibilities *</label>
            <textarea
              rows={3}
              required
              placeholder="Describe your achievements, technical stack, and contributions..."
              value={experienceForm.description}
              onChange={e => setExperienceForm({ ...experienceForm, description: e.target.value })}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setShowAddExperienceModal(false);
                setEditingExperienceId(null);
              }}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addExperienceMutation.isPending || updateExperienceMutation.isPending}
              className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
            >
              {(addExperienceMutation.isPending || updateExperienceMutation.isPending) && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              {editingExperienceId ? 'Update Experience' : 'Add Experience'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CandidateProfilePage;

