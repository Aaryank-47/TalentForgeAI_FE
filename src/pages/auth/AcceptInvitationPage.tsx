import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Building, CheckCircle, XCircle, AlertCircle, Loader2, ArrowRight, ShieldCheck, Mail, Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import { companyApi } from '../../services/api/company.api';
import { companyKeys, authKeys } from '../../constants/queryKeys';
import { useAuth } from '../../context/AuthContext';

export const AcceptInvitationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isInitialized } = useAuth();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Fetch invitation preview
  const {
    data: invitation,
    isLoading: isInvitationLoading,
    isError,
    error,
  } = useQuery({
    queryKey: companyKeys.invitation(token),
    queryFn: () => companyApi.getInvitation(token),
    enabled: !!token && isInitialized,
    retry: false,
  });

  // Accept or Reject mutation
  const respondMutation = useMutation({
    mutationFn: ({ action }: { action: 'accept' | 'reject' }) =>
      companyApi.acceptOrRejectInvitation(action, token),
    onSuccess: (_, variables) => {
      if (variables.action === 'accept') {
        toast.success(`You have joined ${invitation?.companyName || 'the organization'}!`);
        setStatusMessage('accepted');
        queryClient.invalidateQueries({ queryKey: authKeys.me });
        queryClient.invalidateQueries({ queryKey: companyKeys.my });
        setTimeout(() => {
          navigate('/recruiter/dashboard');
        }, 1800);
      } else {
        toast.success('Invitation declined.');
        setStatusMessage('rejected');
      }
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to process invitation.');
    },
  });

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
          <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Invalid Invitation Link</h2>
          <p className="text-sm text-slate-500 mb-6">
            The link you followed is missing the required invitation token. Please check your invitation email.
          </p>
          <Link
            to="/login"
            className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-2.5"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!isInitialized || isInvitationLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-9 h-9 animate-spin text-primary-600" />
          <p className="text-sm text-slate-600 font-medium">Verifying invitation details...</p>
        </div>
      </div>
    );
  }

  if (isError || !invitation) {
    const errorMsg = (error as any)?.message || 'This invitation has expired or is no longer valid.';
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
          <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Invitation Expired or Invalid</h2>
          <p className="text-sm text-slate-500 mb-6">{errorMsg}</p>
          <Link
            to="/"
            className="btn-secondary inline-flex items-center gap-2 text-sm px-6 py-2.5"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (statusMessage === 'accepted') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Welcome to {invitation.companyName}!</h2>
          <p className="text-sm text-slate-500 mb-6">
            Your invitation was accepted successfully. Redirecting you to your recruiter workspace dashboard...
          </p>
          <Link
            to="/recruiter/dashboard"
            className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-2.5"
          >
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (statusMessage === 'rejected') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
          <div className="w-14 h-14 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Invitation Declined</h2>
          <p className="text-sm text-slate-500 mb-6">
            You have declined the invitation to join {invitation.companyName}.
          </p>
          <Link
            to="/"
            className="btn-secondary inline-flex items-center gap-2 text-sm px-6 py-2.5"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const isEmailMatching = !isAuthenticated || (user?.email?.toLowerCase() === invitation.inviteeEmail.toLowerCase());

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-primary-600 to-indigo-700 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            {invitation.companyLogo ? (
              <img
                src={invitation.companyLogo}
                alt={invitation.companyName}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-white/20 shadow-lg bg-white mb-3"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-white text-primary-600 flex items-center justify-center text-2xl font-bold border-4 border-white/20 shadow-lg mb-3">
                {invitation.companyName.charAt(0).toUpperCase()}
              </div>
            )}
            <h1 className="text-2xl font-bold font-display leading-tight">{invitation.companyName}</h1>
            <p className="text-primary-100 text-xs mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Verified Team Invitation
            </p>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-base font-semibold text-slate-800">
              You've been invited to join as <span className="text-primary-600 font-bold capitalize">{invitation.role.toLowerCase()}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Invitation issued for <span className="font-medium text-slate-700">{invitation.inviteeEmail}</span>
            </p>
          </div>

          {!isEmailMatching && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Logged in as {user?.email}</p>
                <p className="mt-0.5 text-amber-700">
                  This invitation was sent to <strong>{invitation.inviteeEmail}</strong>. Please switch accounts or log in with the invited email.
                </p>
              </div>
            </div>
          )}

          {!isAuthenticated && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Account Login Required</p>
                <p className="mt-0.5 text-blue-700">
                  Please log in to accept this invitation with your TalentForge account.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => respondMutation.mutate({ action: 'reject' })}
                  disabled={respondMutation.isPending}
                  className="flex-1 px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Decline
                </button>
                <button
                  type="button"
                  onClick={() => respondMutation.mutate({ action: 'accept' })}
                  disabled={respondMutation.isPending || !isEmailMatching}
                  className="flex-1 btn-primary text-xs py-2.5 font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {respondMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Accept Invitation
                </button>
              </>
            ) : (
              <Link
                to={`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`}
                className="w-full btn-primary text-xs py-2.5 font-bold text-center block"
              >
                Log In to Accept
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitationPage;
