import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StudentProfile } from "@/types/user";

interface StudentState {
  students: StudentProfile[];
  activeStudent: StudentProfile | null;
  isLoading: boolean;
  setStudents: (students: StudentProfile[]) => void;
  addStudent: (student: StudentProfile) => void;
  updateStudent: (id: string, updates: Partial<StudentProfile>) => void;
  removeStudent: (id: string) => void;
  setActiveStudent: (student: StudentProfile | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useStudentStore = create<StudentState>()(
  persist(
    (set) => ({
      students: [],
      activeStudent: null,
      isLoading: false,
      setStudents: (students) => set({ students }),
      addStudent: (student) =>
        set((state) => ({ students: [...state.students, student] })),
      updateStudent: (id, updates) =>
        set((state) => ({
          students: state.students.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
          activeStudent:
            state.activeStudent?.id === id
              ? { ...state.activeStudent, ...updates }
              : state.activeStudent,
        })),
      removeStudent: (id) =>
        set((state) => ({
          students: state.students.filter((s) => s.id !== id),
          activeStudent:
            state.activeStudent?.id === id ? null : state.activeStudent,
        })),
      setActiveStudent: (student) => set({ activeStudent: student }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "summer-quest-students",
      partialize: (state) => ({
        students: state.students,
        activeStudent: state.activeStudent,
      }),
    }
  )
);
