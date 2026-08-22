import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth, type CompanyMemberRole } from '../../context/AuthContext';
import { authApi } from '../../services/api/auth.api';
import { companyKeys } from '../../constants/queryKeys';
import { Building, User, ArrowRight, Sparkles, LogOut, Bot, GraduationCap, Shield, Loader2, Plus } from 'lucide-react';
import jobportal from '../../assets/jobportal_logo2.jpg';

const SelectCompanyPage: React.FC = () => {
  const { user, setSelectedCompany, logout } = useAuth();
  const navigate = useNavigate();

  const { data: companies, isLoading } = useQuery({
    queryKey: companyKeys.my,
    queryFn: () => authApi.getMyCompanies(),
    enabled: user?.role === 'EMPLOYER',
  });

  const handleSelectCompany = (companyId: string, role: CompanyMemberRole) => {
    setSelectedCompany(companyId, role);
    navigate('/recruiter/dashboard', { replace: true });
  };

  const handleSelectCandidate = () => {
    navigate('/candidate/home', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F0F4FA] font-sans flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.45]" style={{ background: 'radial-gradient(circle, #E0E7FF 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.45]" style={{ background: 'radial-gradient(circle, #DBEAFE 0%, transparent 70%)' }} />
      </div>

      <div className="relative max-w-[850px] w-full bg-white rounded-[24px] shadow-2xl shadow-slate-300/80 border border-slate-200/50 p-6 sm:p-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#2563EB] to-[#3B82F6] p-2.5 rounded-[12px] shadow-md shadow-blue-200/50">
              <img src={jobportal} className="h-6 w-6" alt="TalentForge" />
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight text-[#0F172A]">TalentForge <span className="text-[#2563EB]">AI</span></span>
              <p className="text-[12px] text-slate-500">Logged in as {user?.email}</p>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-[13px] font-semibold text-slate-500 hover:text-red-600 transition-colors bg-slate-50 hover:bg-red-50 px-4 py-2 rounded-lg border border-slate-100"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="mb-6 text-center sm:text-left">
          <h2 className="text-[24px] font-display font-extrabold text-[#0F172A] mb-1">
            Welcome back{user?.fullName ? `, ${user.fullName}` : ''}! Choose how to proceed
          </h2>
          <p className="text-[14px] text-slate-500">
            Select a company you represent or switch to candidate mode.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Recruiter / Companies list */}
          <div className="flex flex-col h-full bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
            <h3 className="text-[14px] font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              Recruiter Organizations
            </h3>
            
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center py-8 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                <span className="text-sm">Loading your organizations…</span>
              </div>
            ) : companies && companies.length > 0 ? (
              <div className="space-y-3 flex-1">
                {companies.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectCompany(item.companyId, item.role)}
                    className="w-full text-left bg-white border border-slate-200/70 hover:border-blue-500 rounded-xl p-3.5 transition-all hover:shadow-md group relative overflow-hidden"
                  >
                    <div className="flex items-center gap-3">
                      {item.company.logo ? (
                        <img src={item.company.logo} className="w-10 h-10 rounded-lg object-cover border border-slate-100" alt={item.company.companyName} />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100">
                          {item.company.companyName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[14px] font-bold text-[#0F172A] truncate group-hover:text-blue-600 transition-colors">
                            {item.company.companyName}
                          </h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 capitalize">
                            {item.role.replace('_', ' ').toLowerCase()}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {item.company.headquarters || 'Remote'} {item.company.companySize ? `• ${item.company.companySize}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                <p className="text-sm text-slate-500 mb-3">No organizations linked to this account yet.</p>
                <button
                  onClick={() => navigate('/recruiter/dashboard', { replace: true })}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg"
                >
                  <Plus className="w-3.5 h-3.5" /> Continue to Recruiter Dashboard
                </button>
              </div>
            )}
          </div>

          {/* Candidate choice */}
          <div className="flex flex-col justify-between bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 relative overflow-hidden shadow-lg shadow-blue-200">
            <div className="absolute top-[-20%] right-[-10%] w-[200px] h-[200px] bg-white/[0.08] rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 text-white text-[11px] font-semibold mb-6 border border-white/25 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" /> For Job Seekers
              </div>
              
              <h3 className="text-[20px] font-display font-extrabold mb-2">
                Continue as a Candidate
              </h3>
              
              <p className="text-blue-100/90 text-[13px] leading-relaxed mb-6">
                Take AI mock interviews, track your active job applications, submit machine coding assessments, and chat with recruiters.
              </p>
              
              <div className="space-y-2.5 mb-6">
                {[
                  { icon: <Bot className="w-4 h-4 text-blue-200" />, text: 'Unlock AI interview rooms' },
                  { icon: <GraduationCap className="w-4 h-4 text-blue-200" />, text: 'Track application pipelines' },
                  { icon: <Shield className="w-4 h-4 text-blue-200" />, text: 'Secure online assessments' }
                ].map((f, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-[12px] text-blue-50">
                    {f.icon}
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSelectCandidate}
              className="relative z-10 w-full bg-white hover:bg-blue-50 text-[#2563EB] hover:text-blue-700 font-bold text-[14px] py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group"
            >
              <span>Continue as a Candidate</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SelectCompanyPage;
