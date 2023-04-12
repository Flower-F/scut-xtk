import { type DifficultyType, type ExerciseType } from '@prisma/client';

export const exerciseTypeMapping: Record<keyof typeof ExerciseType, string> = {
  CHOICE_QUESTION: '选择题',
  COMPLETION_QUESTION: '填空题',
  BIG_QUESTION: '大题',
  ALL_QUESTION: '所有',
};

export const exerciseTypeWithoutAllMapping: Record<keyof typeof ExerciseType, string | null> = {
  CHOICE_QUESTION: '选择题',
  COMPLETION_QUESTION: '填空题',
  BIG_QUESTION: '大题',
  ALL_QUESTION: null,
};

export const difficultyTypeMapping: Record<keyof typeof DifficultyType, string> = {
  HARD: '困难',
  MEDIUM: '中等',
  EASY: '简单',
  ANY: '所有',
};

export const difficultyWithoutAllMapping: Record<keyof typeof DifficultyType, string | null> = {
  HARD: '困难',
  MEDIUM: '中等',
  EASY: '简单',
  ANY: null,
};
