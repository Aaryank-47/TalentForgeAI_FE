import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CompanyMemberRole } from '../../context/AuthContext';

export type WorkspaceType = 'CANDIDATE' | 'COMPANY';

export interface Workspace {
  type: WorkspaceType;
  id: string; // candidateProfileId OR companyId
  name: string; // Candidate name OR Company name
  slug?: string;
  role?: CompanyMemberRole;
  logo?: string | null;
  location?: string | null;
}

export interface WorkspaceState {
  currentWorkspace: Workspace | null;
  availableWorkspaces: Workspace[];
}

const LAST_WORKSPACE_KEY = 'tf:last_workspace';

// Helper to safely load remembered workspace metadata from localStorage
function getSavedWorkspace(): Workspace | null {
  try {
    const raw = localStorage.getItem(LAST_WORKSPACE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Workspace;
  } catch {
    return null;
  }
}

const initialState: WorkspaceState = {
  currentWorkspace: getSavedWorkspace(),
  availableWorkspaces: [],
};

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setWorkspace: (state, action: PayloadAction<Workspace | null>) => {
      state.currentWorkspace = action.payload;
      try {
        if (action.payload) {
          localStorage.setItem(LAST_WORKSPACE_KEY, JSON.stringify(action.payload));
        } else {
          localStorage.removeItem(LAST_WORKSPACE_KEY);
        }
      } catch {
        // localStorage errors ignored safely
      }
    },
    setAvailableWorkspaces: (state, action: PayloadAction<Workspace[]>) => {
      state.availableWorkspaces = action.payload;
      
      // If current workspace is no longer in available list, auto-reconcile or clear
      if (state.currentWorkspace && action.payload.length > 0) {
        const stillValid = action.payload.some(
          (w) => w.type === state.currentWorkspace?.type && w.id === state.currentWorkspace?.id
        );
        if (!stillValid) {
          state.currentWorkspace = null;
          try {
            localStorage.removeItem(LAST_WORKSPACE_KEY);
          } catch {}
        }
      }
    },
    clearWorkspace: (state) => {
      state.currentWorkspace = null;
      state.availableWorkspaces = [];
      try {
        localStorage.removeItem(LAST_WORKSPACE_KEY);
      } catch {}
    },
  },
});

export const { setWorkspace, setAvailableWorkspaces, clearWorkspace } = workspaceSlice.actions;

export default workspaceSlice.reducer;
