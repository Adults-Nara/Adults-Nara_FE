import { UserBanStatus } from '@/models/users.model';
import { create } from 'zustand';

// 다이얼로그 종류 정의
type UserType = 'VIEWER' | 'UPLOADER' | 'content' | null;
type DialogType = 'deactivate' | 'reason' | 'activate' | 'delete' | null;

interface DialogData {
  name?: string;
  reason?: string;
  onConfirm?: (text?: string, period?: UserBanStatus) => void;
}

interface DialogStore {
  UserType: UserType;
  DialogType: DialogType;
  isOpen: boolean;
  data: DialogData;
  openDialog: (
    UserType: UserType,
    DialogType: DialogType,
    data?: DialogData,
  ) => void;
  closeDialog: () => void;
}

export const useDialogStore = create<DialogStore>((set) => ({
  UserType: null,
  DialogType: null,
  isOpen: false,
  data: {},
  openDialog: (UserType, DialogType, data = {}) =>
    set({ isOpen: true, UserType, DialogType, data }),
  closeDialog: () =>
    set({ isOpen: false, UserType: null, DialogType: null, data: {} }),
}));
