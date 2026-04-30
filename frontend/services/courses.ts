import { api } from "@/lib/api/client";
import type {
  CourseSummary,
  CourseDetail,
  CourseModuleDetail,
  QuizQuestion,
  QuizResult,
  CourseCertificate,
} from "@/types/api";

export const coursesService = {
  async list() {
    const { data } = await api.get<CourseSummary[]>("/courses");
    return data;
  },
  async getCourse(slug: string) {
    const { data } = await api.get<CourseDetail>(`/courses/${slug}`);
    return data;
  },
  async getModule(courseSlug: string, moduleSlug: string) {
    const { data } = await api.get<CourseModuleDetail>(
      `/courses/${courseSlug}/modules/${moduleSlug}`,
    );
    return data;
  },
  async completeModule(courseSlug: string, moduleSlug: string) {
    await api.post(`/courses/${courseSlug}/modules/${moduleSlug}/complete`);
  },
  async getQuiz(courseSlug: string) {
    const { data } = await api.get<QuizQuestion[]>(`/courses/${courseSlug}/quiz`);
    return data;
  },
  async submitQuiz(courseSlug: string, answers: number[]) {
    const { data } = await api.post<QuizResult>("/courses/quiz/submit", {
      courseSlug,
      answers,
    });
    return data;
  },
  async getCertificate(courseSlug: string) {
    const { data } = await api.get<CourseCertificate>(`/courses/${courseSlug}/certificate`);
    return data;
  },
};
