import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHiring } from '../../context/HiringContext';
import { getStageLabel } from '../../constants/hiring_mockData';
import { Badge } from '../../components/ui/Badge';
import {
  Plus, GitBranch, Copy, Archive, Star, MoreVertical, Pencil, Search,
} from 'lucide-react';

const tabs = ['Active', 'Archived'] as const;

export default function HiringWorkflowsPage() {
  const navigate = useNavigate();
  const { workflows, createWorkflow, duplicateWorkflow, archiveWorkflow, setDefaultWorkflow } = useHiring();
  const [tab, setTab] = useState<(typeof tabs)[number]>('Active');
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const filtered = workflows.filter(w => {
    const matchesTab = tab === 'Active' ? !w.isArchived : w.isArchived;
    const matchesSearch = w.name.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleCreate = () => {
    if (!newName.trim()) return;
    const wf = createWorkflow(newName.trim(), newDescription.trim());
    setShowCreateModal(false);
    setNewName('');
    setNewDescription('');
    navigate(`/recruiter/workflows/${wf.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#0F172A]">Hiring Workflows</h1>
          <p className="text-sm text-slate-500 mt-1">
            Create reusable hiring pipeline templates. Every job inherits a selected workflow.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Workflow
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="input-field pl-9 text-sm"
            placeholder="Search workflows..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <GitBranch className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">No workflows found</p>
          <p className="text-sm text-slate-500 mt-1">Create your first hiring workflow template to get started.</p>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary text-sm mt-4 inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Workflow
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(workflow => {
            const enabledStages = workflow.stages.filter(s => s.enabled);
            return (
              <div key={workflow.id} className="card p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2.5 bg-primary-50 rounded-xl flex-shrink-0">
                      <GitBranch className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          to={`/recruiter/workflows/${workflow.id}`}
                          className="font-semibold text-slate-900 hover:text-primary-600 transition-colors"
                        >
                          {workflow.name}
                        </Link>
                        {workflow.isDefault && (
                          <Badge variant="info"><Star className="w-3 h-3 mr-0.5 inline" />Default</Badge>
                        )}
                      </div>
                      {workflow.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{workflow.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === workflow.id ? null : workflow.id)}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {menuOpen === workflow.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-[#E5E7EB] shadow-xl z-20 py-1">
                          <button
                            onClick={() => { navigate(`/recruiter/workflows/${workflow.id}`); setMenuOpen(null); }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <Pencil className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => { const dup = duplicateWorkflow(workflow.id); if (dup) navigate(`/recruiter/workflows/${dup.id}`); setMenuOpen(null); }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <Copy className="w-4 h-4" /> Duplicate
                          </button>
                          {!workflow.isDefault && !workflow.isArchived && (
                            <button
                              onClick={() => { setDefaultWorkflow(workflow.id); setMenuOpen(null); }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <Star className="w-4 h-4" /> Set as Default
                            </button>
                          )}
                          {!workflow.isArchived && (
                            <button
                              onClick={() => { archiveWorkflow(workflow.id); setMenuOpen(null); }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Archive className="w-4 h-4" /> Archive
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  {enabledStages.map((stage, i) => (
                    <React.Fragment key={stage.id}>
                      {i > 0 && <span className="text-slate-300 text-xs">→</span>}
                      <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">
                        {getStageLabel(stage)}
                      </span>
                    </React.Fragment>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-slate-400">
                  <span>{enabledStages.length} stages · {workflow.jobCount} jobs</span>
                  <span>Updated {workflow.updatedAt}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-display font-bold text-slate-900">Create Workflow</h2>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Workflow Name *</label>
              <input
                className="input-field"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Software Engineer Hiring Pipeline"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                className="input-field h-20 resize-none text-sm"
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="Describe this hiring pipeline..."
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowCreateModal(false)} className="btn-secondary flex-1 text-sm">Cancel</button>
              <button onClick={handleCreate} disabled={!newName.trim()} className="btn-primary flex-1 text-sm disabled:opacity-40">Create & Configure</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}