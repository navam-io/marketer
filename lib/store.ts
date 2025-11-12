import { create } from 'zustand';

interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Task {
  id: string;
  campaignId?: string;
  sourceId?: string;
  platform?: string;
  status: string;
  content?: string;
  outputJson?: string;
  scheduledAt?: Date;
  postedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface AppState {
  // Selected campaign for the Kanban board
  selectedCampaignId: string | null;
  setSelectedCampaignId: (id: string | null) => void;

  // UI state
  isCreateCampaignOpen: boolean;
  setIsCreateCampaignOpen: (open: boolean) => void;

  isCreateTaskOpen: boolean;
  setIsCreateTaskOpen: (open: boolean) => void;

  isGenerateContentOpen: boolean;
  setIsGenerateContentOpen: (open: boolean) => void;

  editingTaskId: string | null;
  setEditingTaskId: (id: string | null) => void;

  // Drag and drop state
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedCampaignId: null,
  setSelectedCampaignId: (id) => set({ selectedCampaignId: id }),

  isCreateCampaignOpen: false,
  setIsCreateCampaignOpen: (open) => set({ isCreateCampaignOpen: open }),

  isCreateTaskOpen: false,
  setIsCreateTaskOpen: (open) => set({ isCreateTaskOpen: open }),

  isGenerateContentOpen: false,
  setIsGenerateContentOpen: (open) => set({ isGenerateContentOpen: open }),

  editingTaskId: null,
  setEditingTaskId: (id) => set({ editingTaskId: id }),

  isDragging: false,
  setIsDragging: (dragging) => set({ isDragging: dragging })
}));
