import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Exercise {
  id: string
  name: string
  type: string
  duration: number
  intensity: string
  date: Date
  notes?: string
  createdAt: Date
}

interface ExerciseState {
  exercises: Exercise[]
  addExercise: (exercise: Exercise) => void
  removeExercise: (id: string) => void
  updateExercise: (id: string, exercise: Partial<Exercise>) => void
}

export const useExerciseStore = create<ExerciseState>()(
  persist(
    (set) => ({
      exercises: [],
      addExercise: (exercise) =>
        set((state) => ({
          exercises: [...state.exercises, exercise],
        })),
      removeExercise: (id) =>
        set((state) => ({
          exercises: state.exercises.filter((exercise) => exercise.id !== id),
        })),
      updateExercise: (id, updatedExercise) =>
        set((state) => ({
          exercises: state.exercises.map((exercise) =>
            exercise.id === id ? { ...exercise, ...updatedExercise } : exercise,
          ),
        })),
    }),
    {
      name: "exercise-storage",
    },
  ),
)

