import { collegeRouter } from '~/server/api/routers/college';
import { courseRouter } from '~/server/api/routers/course';
import { knowledgePointRouter } from '~/server/api/routers/knowledgePoint';
import { userRouter } from '~/server/api/routers/user';
import { createTRPCRouter } from '~/server/api/trpc';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  college: collegeRouter,
  user: userRouter,
  course: courseRouter,
  knowledgePoint: knowledgePointRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
