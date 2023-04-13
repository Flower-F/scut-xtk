import { faker } from '@faker-js/faker/locale/zh_CN';
import { DifficultyType, ExerciseType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const EXERCISE_AMOUNT = 60;

async function run() {
  const exerciseListData = new Array(EXERCISE_AMOUNT).fill(null).map(() => {
    const randomExerciseNumber = faker.datatype.number({ min: 1, max: Object.keys(ExerciseType).length - 1 });

    let type: ExerciseType = 'COMPLETION_QUESTION';
    if (randomExerciseNumber === 1) {
      type = 'COMPLETION_QUESTION';
    } else if (randomExerciseNumber === 2) {
      type = 'CHOICE_QUESTION';
    } else if (randomExerciseNumber === 3) {
      type = 'BIG_QUESTION';
    }

    const randomDifficultyNumber = faker.datatype.number({ min: 1, max: Object.keys(DifficultyType).length - 1 });
    let difficulty: DifficultyType = 'EASY';
    if (randomDifficultyNumber === 1) {
      difficulty = 'EASY';
    } else if (randomDifficultyNumber === 2) {
      difficulty = 'MEDIUM';
    } else if (randomDifficultyNumber === 3) {
      difficulty = 'HARD';
    }

    const hasAnalysis = faker.datatype.number({ min: 0, max: 1 });

    return {
      type,
      difficulty,
      question: faker.lorem.paragraph(faker.datatype.number({ min: 1, max: 4 })),
      answer: faker.lorem.paragraph(faker.datatype.number({ min: 1, max: 8 })),
      analysis: hasAnalysis ? faker.lorem.paragraph(faker.datatype.number({ min: 1, max: 4 })) : null,
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

  const createExerciseList = exerciseListData.map((exercise) => {
    return prisma.exercise.create({
      data: exercise,
    });
  });

  const exerciseList = await prisma.$transaction(createExerciseList);

  for (const exercise of exerciseList) {
    if (exercise.type !== 'CHOICE_QUESTION') {
      continue;
    }

    const options = [];
    const optionLength = faker.datatype.number({ min: 1, max: 5 });
    for (let i = 0; i < optionLength; i++) {
      options.push({
        content: faker.lorem.sentence(),
        exercise: {
          connect: {
            id: exercise.id,
          },
        },
      });
    }

    const createOptions = options.map((option) => prisma.option.create({ data: option }));
    await prisma.$transaction(createOptions);
  }

  await prisma.$disconnect();
}

void run();
