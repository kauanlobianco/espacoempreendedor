import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '@/common/decorators/current-user.decorator';
import { COURSES, getCourseBySlug } from './content/course-content';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  listCourses() {
    return COURSES.map(({ slug, title, description, passingScore, modules, quiz }) => ({
      slug,
      title,
      description,
      passingScore,
      totalModules: modules.length,
      totalQuestions: quiz.length,
    }));
  }

  async getCourse(actor: AuthUser, slug: string) {
    const course = getCourseBySlug(slug);
    if (!course) throw new NotFoundException('Curso não encontrado');

    const progressRecords = await this.prisma.courseModuleProgress.findMany({
      where: { studentId: actor.id, courseSlug: slug },
    });

    const progressMap = new Map(progressRecords.map((p) => [p.moduleSlug, p]));

    const bestAttempt = await this.prisma.courseQuizAttempt.findFirst({
      where: { studentId: actor.id, courseSlug: slug, passed: true },
      orderBy: { score: 'desc' },
    });

    const attemptCount = await this.prisma.courseQuizAttempt.count({
      where: { studentId: actor.id, courseSlug: slug },
    });

    const completedModules = progressRecords.filter((p) => p.status === 'COMPLETED').length;

    const modules = course.modules.map((m) => {
      const prog = progressMap.get(m.slug);
      return {
        slug: m.slug,
        order: m.order,
        title: m.title,
        description: m.description,
        objective: m.objective,
        videoUrl: m.videoUrl,
        status: prog?.status ?? 'NOT_STARTED',
        completedAt: prog?.completedAt ?? null,
      };
    });

    return {
      slug: course.slug,
      title: course.title,
      description: course.description,
      passingScore: course.passingScore,
      totalQuestions: course.quiz.length,
      totalModules: course.modules.length,
      completedModules,
      quizPassed: Boolean(bestAttempt),
      bestScore: bestAttempt?.score ?? null,
      attemptCount,
      modules,
    };
  }

  async getModule(actor: AuthUser, courseSlug: string, moduleSlug: string) {
    const course = getCourseBySlug(courseSlug);
    if (!course) throw new NotFoundException('Curso não encontrado');

    const mod = course.modules.find((m) => m.slug === moduleSlug);
    if (!mod) throw new NotFoundException('Módulo não encontrado');

    const progress = await this.prisma.courseModuleProgress.findUnique({
      where: { studentId_courseSlug_moduleSlug: { studentId: actor.id, courseSlug, moduleSlug } },
    });

    if (!progress || progress.status === 'NOT_STARTED') {
      await this.prisma.courseModuleProgress.upsert({
        where: { studentId_courseSlug_moduleSlug: { studentId: actor.id, courseSlug, moduleSlug } },
        create: { studentId: actor.id, courseSlug, moduleSlug, status: 'IN_PROGRESS' },
        update: { status: 'IN_PROGRESS' },
      });
    }

    const prevMod = course.modules.find((m) => m.order === mod.order - 1);
    const nextMod = course.modules.find((m) => m.order === mod.order + 1);

    return {
      ...mod,
      status: progress?.status ?? 'IN_PROGRESS',
      completedAt: progress?.completedAt ?? null,
      prev: prevMod ? { slug: prevMod.slug, title: prevMod.title } : null,
      next: nextMod ? { slug: nextMod.slug, title: nextMod.title } : null,
      isLastModule: !nextMod,
    };
  }

  async completeModule(actor: AuthUser, courseSlug: string, moduleSlug: string) {
    const course = getCourseBySlug(courseSlug);
    if (!course) throw new NotFoundException('Curso não encontrado');
    if (!course.modules.find((m) => m.slug === moduleSlug))
      throw new NotFoundException('Módulo não encontrado');

    await this.prisma.courseModuleProgress.upsert({
      where: { studentId_courseSlug_moduleSlug: { studentId: actor.id, courseSlug, moduleSlug } },
      create: { studentId: actor.id, courseSlug, moduleSlug, status: 'COMPLETED', completedAt: new Date() },
      update: { status: 'COMPLETED', completedAt: new Date() },
    });

    return { ok: true };
  }

  async getQuiz(courseSlug: string) {
    const course = getCourseBySlug(courseSlug);
    if (!course) throw new NotFoundException('Curso não encontrado');

    return course.quiz.map(({ id, question, options }) => ({ id, question, options }));
  }

  async submitQuiz(actor: AuthUser, dto: SubmitQuizDto) {
    const course = getCourseBySlug(dto.courseSlug);
    if (!course) throw new NotFoundException('Curso não encontrado');

    if (dto.answers.length !== course.quiz.length) {
      throw new BadRequestException('Número de respostas incorreto');
    }

    const correctCount = course.quiz.reduce((acc, q, i) => {
      return acc + (q.correctIndex === dto.answers[i] ? 1 : 0);
    }, 0);

    const passed = correctCount >= course.passingScore;

    const attempt = await this.prisma.courseQuizAttempt.create({
      data: {
        studentId: actor.id,
        courseSlug: dto.courseSlug,
        score: correctCount,
        totalQuestions: course.quiz.length,
        passed,
        answers: dto.answers,
      },
    });

    const feedback = course.quiz.map((q, i) => ({
      id: q.id,
      question: q.question,
      chosen: dto.answers[i],
      correct: q.correctIndex,
      isCorrect: q.correctIndex === dto.answers[i],
      explanation: q.explanation,
    }));

    return {
      attemptId: attempt.id,
      score: correctCount,
      total: course.quiz.length,
      passed,
      passingScore: course.passingScore,
      feedback,
    };
  }

  async getCertificate(actor: AuthUser, courseSlug: string) {
    const course = getCourseBySlug(courseSlug);
    if (!course) throw new NotFoundException('Curso não encontrado');

    const bestAttempt = await this.prisma.courseQuizAttempt.findFirst({
      where: { studentId: actor.id, courseSlug, passed: true },
      orderBy: { score: 'desc' },
    });

    if (!bestAttempt) throw new BadRequestException('Curso não concluído');

    const user = await this.prisma.user.findUnique({
      where: { id: actor.id },
      select: { fullName: true },
    });

    return {
      studentName: user?.fullName ?? '',
      courseTitle: course.title,
      courseSlug,
      score: bestAttempt.score,
      total: bestAttempt.totalQuestions,
      completedAt: bestAttempt.attemptedAt,
    };
  }
}
