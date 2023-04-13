import { faker } from '@faker-js/faker/locale/zh_CN';
import { PrismaClient, type DifficultyType, type ExerciseType } from '@prisma/client';
import random from 'lodash.random';

const prisma = new PrismaClient();

const EXERCISE_AMOUNT = 60;

async function run() {
  const exerciseList = new Array(EXERCISE_AMOUNT).fill(null).map(() => {
    const randomExerciseNumber = random(1, 3);

    let type: ExerciseType = 'COMPLETION_QUESTION';
    if (randomExerciseNumber === 1) {
      type = 'COMPLETION_QUESTION';
    } else if (randomExerciseNumber === 2) {
      type = 'CHOICE_QUESTION';
    } else if (randomExerciseNumber === 3) {
      type = 'BIG_QUESTION';
    }

    const randomDifficultyNumber = random(1, 3);
    let difficulty: DifficultyType = 'EASY';
    if (randomDifficultyNumber === 1) {
      difficulty = 'EASY';
    } else if (randomExerciseNumber === 2) {
      difficulty = 'MEDIUM';
    } else if (randomExerciseNumber === 3) {
      difficulty = 'HARD';
    }

    const hasAnalysis = random(0, 1);

    return {
      type,
      difficulty,
      question: faker.lorem.sentence(random(1, 4)),
      answer: faker.lorem.paragraph(random(1, 8)),
      analysis: hasAnalysis ? faker.lorem.paragraph(random(1, 4)) : null,
      knowledgePoint: {
        connect: {
          id: 'clgc3zpyf0002sphsnllscdvb',
        },
      },
      user: {
        connect: {
          id: 'clg22p4io0002spv92q3pyvx2',
        },
      },
    };
  });

  const createExerciseList = exerciseList.map((exercise) => {
    return prisma.exercise.create({
      data: exercise,
    });
  });

  await prisma.$transaction(createExerciseList);
  await prisma.$disconnect();
}

void run();
