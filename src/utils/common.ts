import { DifficultyType, ExerciseType } from '@prisma/client';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function standardDifficulty(difficulty: string | null): DifficultyType {
  if (!difficulty) {
    return 'ANY';
  }

  if (Object.values(DifficultyType).some((item) => difficulty === item)) {
    return difficulty as DifficultyType;
  }

  return 'ANY';
}

export function standardType(type: string | null): ExerciseType {
  if (!type) {
    return 'ALL_QUESTION';
  }

  if (Object.values(ExerciseType).some((item) => type === item)) {
    return type as ExerciseType;
  }

  return 'ALL_QUESTION';
}
