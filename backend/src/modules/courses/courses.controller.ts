import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '@/common/decorators/current-user.decorator';
import { CoursesService } from './courses.service';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@ApiTags('courses')
@ApiBearerAuth()
@Roles(UserRole.STUDENT)
@Controller('courses')
export class CoursesController {
  constructor(private readonly service: CoursesService) {}

  @Get()
  list() {
    return this.service.listCourses();
  }

  @Get(':courseSlug')
  getCourse(@CurrentUser() user: AuthUser, @Param('courseSlug') courseSlug: string) {
    return this.service.getCourse(user, courseSlug);
  }

  @Get(':courseSlug/modules/:moduleSlug')
  getModule(
    @CurrentUser() user: AuthUser,
    @Param('courseSlug') courseSlug: string,
    @Param('moduleSlug') moduleSlug: string,
  ) {
    return this.service.getModule(user, courseSlug, moduleSlug);
  }

  @Post(':courseSlug/modules/:moduleSlug/complete')
  completeModule(
    @CurrentUser() user: AuthUser,
    @Param('courseSlug') courseSlug: string,
    @Param('moduleSlug') moduleSlug: string,
  ) {
    return this.service.completeModule(user, courseSlug, moduleSlug);
  }

  @Get(':courseSlug/quiz')
  getQuiz(@Param('courseSlug') courseSlug: string) {
    return this.service.getQuiz(courseSlug);
  }

  @Post('quiz/submit')
  submitQuiz(@CurrentUser() user: AuthUser, @Body() dto: SubmitQuizDto) {
    return this.service.submitQuiz(user, dto);
  }

  @Get(':courseSlug/certificate')
  getCertificate(@CurrentUser() user: AuthUser, @Param('courseSlug') courseSlug: string) {
    return this.service.getCertificate(user, courseSlug);
  }
}
