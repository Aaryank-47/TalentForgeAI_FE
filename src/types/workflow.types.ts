export type DefaultStageType =
  | 'resume_screening'
  | 'ai_interview'
  | 'assessment'
  | 'technical_interview'
  | 'hr_interview'
  | 'manager_interview'
  | 'offer'
  | 'background_verification'
  | 'document_verification'
  | 'joining'
  | 'hired'
  | 'rejected';

export interface DefaultStageDefinition {
  type: DefaultStageType;
  label: string;
  description: string;
  icon: string;
  color: string;
}

export type AssessmentStageType = 'mcq' | 'dsa' | 'coding' | 'machine_coding' | 'descriptive';

export interface WorkflowStage {
  id: string;
  type: DefaultStageType | 'custom';
  label: string;
  enabled: boolean;
  order: number;
  /** Links to AI Interview Template when type is ai_interview */
  interviewTemplateId?: string;
  /** Custom stage name when type is custom */
  customLabel?: string;
  /** Used when type is assessment to chain multiple assessments */
  assessments?: AssessmentStageType[];
}

export interface HiringWorkflowTemplate {
  id: string;
  name: string;
  description: string;
  stages: WorkflowStage[];
  isDefault?: boolean;
  isArchived?: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
