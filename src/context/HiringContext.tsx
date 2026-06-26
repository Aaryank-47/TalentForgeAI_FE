import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type {
  HiringWorkflowTemplate,
  InterviewQuestion,
  InterviewTemplate,
  QuestionLibraryItem,
  WorkflowStage,
} from '../types/hiring';
import {
  generateId,
  initialInterviewTemplates,
  initialQuestionLibrary,
  initialWorkflowTemplates,
} from '../constants/hiring_mockData';

interface HiringContextValue {
  workflows: HiringWorkflowTemplate[];
  interviewTemplates: InterviewTemplate[];
  questionLibrary: QuestionLibraryItem[];

  getWorkflow: (id: string) => HiringWorkflowTemplate | undefined;
  createWorkflow: (name: string, description?: string) => HiringWorkflowTemplate;
  updateWorkflow: (id: string, updates: Partial<HiringWorkflowTemplate>) => void;
  duplicateWorkflow: (id: string) => HiringWorkflowTemplate | undefined;
  archiveWorkflow: (id: string) => void;
  setDefaultWorkflow: (id: string) => void;
  updateWorkflowStages: (workflowId: string, stages: WorkflowStage[]) => void;

  getInterviewTemplate: (id: string) => InterviewTemplate | undefined;
  createInterviewTemplate: (name: string) => InterviewTemplate;
  updateInterviewTemplate: (id: string, updates: Partial<InterviewTemplate>) => void;
  deleteInterviewTemplate: (id: string) => void;

  addLibraryQuestion: (question: Omit<QuestionLibraryItem, 'id' | 'usageCount' | 'createdAt'>) => QuestionLibraryItem;
  updateLibraryQuestion: (id: string, updates: Partial<QuestionLibraryItem>) => void;
  deleteLibraryQuestion: (id: string) => void;
}

const HiringContext = createContext<HiringContextValue | null>(null);

export function HiringProvider({ children }: { children: React.ReactNode }) {
  const [workflows, setWorkflows] = useState<HiringWorkflowTemplate[]>(initialWorkflowTemplates);
  const [interviewTemplates, setInterviewTemplates] = useState<InterviewTemplate[]>(initialInterviewTemplates);
  const [questionLibrary, setQuestionLibrary] = useState<QuestionLibraryItem[]>(initialQuestionLibrary);

  const getWorkflow = useCallback((id: string) => workflows.find(w => w.id === id), [workflows]);

  const createWorkflow = useCallback((name: string, description = '') => {
    const workflow: HiringWorkflowTemplate = {
      id: generateId('wf'),
      name,
      description,
      stages: [
        { id: generateId('st'), type: 'resume_screening', label: 'Resume Screening', enabled: true, order: 0 },
        { id: generateId('st'), type: 'rejected', label: 'Rejected', enabled: false, order: 1 },
      ],
      isDefault: false,
      isArchived: false,
      jobCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setWorkflows(prev => [...prev, workflow]);
    return workflow;
  }, []);

  const updateWorkflow = useCallback((id: string, updates: Partial<HiringWorkflowTemplate>) => {
    setWorkflows(prev =>
      prev.map(w =>
        w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : w,
      ),
    );
  }, []);

  const duplicateWorkflow = useCallback((id: string) => {
    const source = workflows.find(w => w.id === id);
    if (!source) return undefined;
    const duplicate: HiringWorkflowTemplate = {
      ...source,
      id: generateId('wf'),
      name: `${source.name} (Copy)`,
      isDefault: false,
      isArchived: false,
      jobCount: 0,
      stages: source.stages.map(s => ({ ...s, id: generateId('st') })),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setWorkflows(prev => [...prev, duplicate]);
    return duplicate;
  }, [workflows]);

  const archiveWorkflow = useCallback((id: string) => {
    setWorkflows(prev =>
      prev.map(w => (w.id === id ? { ...w, isArchived: true, isDefault: false } : w)),
    );
  }, []);

  const setDefaultWorkflow = useCallback((id: string) => {
    setWorkflows(prev =>
      prev.map(w => ({ ...w, isDefault: w.id === id && !w.isArchived })),
    );
  }, []);

  const updateWorkflowStages = useCallback((workflowId: string, stages: WorkflowStage[]) => {
    setWorkflows(prev =>
      prev.map(w =>
        w.id === workflowId
          ? { ...w, stages, updatedAt: new Date().toISOString().split('T')[0] }
          : w,
      ),
    );
  }, []);

  const getInterviewTemplate = useCallback(
    (id: string) => interviewTemplates.find(t => t.id === id),
    [interviewTemplates],
  );

  const createInterviewTemplate = useCallback((name: string) => {
    const template: InterviewTemplate = {
      id: generateId('it'),
      name,
      config: {
        name,
        durationMinutes: 25,
        questionCount: 10,
        difficulty: 'medium',
        passingScore: 70,
        deadline: { duration: '48h', expiryAction: 'reject' },
        maxAttempts: 2,
        cameraRequired: true,
        microphoneRequired: true,
        recordingRequired: true,
        randomizeQuestions: true,
        timePerQuestionSeconds: 120,
        retakeAllowed: false,
        enableAiFollowUp: true,
        candidateInstructions: 'Please ensure you are in a quiet environment with good lighting.',
      },
      questionSource: 'manual',
      questions: [],
      libraryQuestionIds: [],
      skills: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      usageCount: 0,
    };
    setInterviewTemplates(prev => [...prev, template]);
    return template;
  }, []);

  const updateInterviewTemplate = useCallback((id: string, updates: Partial<InterviewTemplate>) => {
    setInterviewTemplates(prev =>
      prev.map(t =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : t,
      ),
    );
  }, []);

  const deleteInterviewTemplate = useCallback((id: string) => {
    setInterviewTemplates(prev => prev.filter(t => t.id !== id));
  }, []);

  const addLibraryQuestion = useCallback(
    (question: Omit<QuestionLibraryItem, 'id' | 'usageCount' | 'createdAt'>) => {
      const item: QuestionLibraryItem = {
        ...question,
        id: generateId('ql'),
        usageCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setQuestionLibrary(prev => [...prev, item]);
      return item;
    },
    [],
  );

  const updateLibraryQuestion = useCallback((id: string, updates: Partial<QuestionLibraryItem>) => {
    setQuestionLibrary(prev => prev.map(q => (q.id === id ? { ...q, ...updates } : q)));
  }, []);

  const deleteLibraryQuestion = useCallback((id: string) => {
    setQuestionLibrary(prev => prev.filter(q => q.id !== id));
  }, []);

  const value = useMemo<HiringContextValue>(
    () => ({
      workflows,
      interviewTemplates,
      questionLibrary,
      getWorkflow,
      createWorkflow,
      updateWorkflow,
      duplicateWorkflow,
      archiveWorkflow,
      setDefaultWorkflow,
      updateWorkflowStages,
      getInterviewTemplate,
      createInterviewTemplate,
      updateInterviewTemplate,
      deleteInterviewTemplate,
      addLibraryQuestion,
      updateLibraryQuestion,
      deleteLibraryQuestion,
    }),
    [
      workflows,
      interviewTemplates,
      questionLibrary,
      getWorkflow,
      createWorkflow,
      updateWorkflow,
      duplicateWorkflow,
      archiveWorkflow,
      setDefaultWorkflow,
      updateWorkflowStages,
      getInterviewTemplate,
      createInterviewTemplate,
      updateInterviewTemplate,
      deleteInterviewTemplate,
      addLibraryQuestion,
      updateLibraryQuestion,
      deleteLibraryQuestion,
    ],
  );

  return <HiringContext.Provider value={value}>{children}</HiringContext.Provider>;
}

export function useHiring() {
  const ctx = useContext(HiringContext);
  if (!ctx) throw new Error('useHiring must be used within HiringProvider');
  return ctx;
}

export type { InterviewQuestion };
