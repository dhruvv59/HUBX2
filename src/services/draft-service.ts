import { PaperConfig } from "@/types/generate-paper";

const STORAGE_KEY = "hubx_drafts";

// Helper to interact with sessionStorage safely
const getStore = (): Record<string, PaperConfig> => {
    if (typeof window === "undefined") return {};
    try {
        const item = sessionStorage.getItem(STORAGE_KEY);
        return item ? JSON.parse(item) : {};
    } catch {
        return {};
    }
};

const setStore = (store: Record<string, PaperConfig>) => {
    if (typeof window === "undefined") return;
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch { }
};

// Simulate a managed service call
export const saveDraft = async (config: PaperConfig): Promise<string> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));

    const draftId = "draft_" + Math.random().toString(36).substr(2, 9);
    const store = getStore();
    store[draftId] = config;
    setStore(store);
    return draftId;
};

export const getDraft = async (draftId: string): Promise<PaperConfig | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));

    const store = getStore();
    return store[draftId] || null;
};

export const addQuestionToDraft = async (draftId: string, question: any): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const store = getStore();
    const draft = store[draftId];
    if (draft) {
        if (!draft.questions) draft.questions = [];
        draft.questions.push(question);
        store[draftId] = draft;
        setStore(store);
    }
};

export const removeQuestionFromDraft = async (draftId: string, questionId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const store = getStore();
    const draft = store[draftId];
    if (draft && draft.questions) {
        draft.questions = draft.questions.filter(q => q.id !== questionId);
        store[draftId] = draft;
        setStore(store);
    }
};
