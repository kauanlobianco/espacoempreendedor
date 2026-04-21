import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { FirstAccessDto } from './dto/first-access.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterStudentDto } from './dto/register-student.dto';

const STUDENT_PENDING_PASSWORD = '__STUDENT_PENDING_FIRST_ACCESS__';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly audit: AuditService,
  ) {}

  async register(dto: RegisterDto) {
    if (dto.role === UserRole.ADMIN) {
      throw new BadRequestException('Admin não pode ser criado por este endpoint');
    }

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('E-mail já cadastrado');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        fullName: dto.fullName,
        role: dto.role,
        ...(dto.role === UserRole.STUDENT && {
          studentProfile: {
            create: {
              enrollment: dto.enrollment,
              course: dto.course,
              semester: dto.semester,
            },
          },
        }),
        ...(dto.role === UserRole.PROFESSOR && {
          professorProfile: {
            create: { department: dto.department, title: dto.title },
          },
        }),
      },
    });

    await this.audit.log({
      action: 'USER_CREATED',
      actorId: user.id,
      entity: 'User',
      entityId: user.id,
      metadata: { role: user.role },
    });

    return this.issueToken(user.id, user.email, user.role);
  }

  async registerStudent(dto: RegisterStudentDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('E-mail já cadastrado');

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: STUDENT_PENDING_PASSWORD,
        fullName: dto.fullName,
        role: UserRole.STUDENT,
        active: false,
        studentProfile: {
          create: {
            enrollment: dto.enrollment,
            cpf: dto.cpf,
            course: dto.course ?? null,
          },
        },
      },
    });

    await this.audit.log({
      action: 'USER_CREATED',
      entity: 'User',
      entityId: user.id,
      metadata: { role: user.role, pending: true },
    });

    return {
      message: 'Cadastro enviado. Aguarde a aprovação de um professor para acessar o sistema.',
    };
  }

  async firstAccess(dto: FirstAccessDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { studentProfile: true },
    });

    if (!user || user.role !== UserRole.STUDENT || !user.studentProfile) {
      throw new UnauthorizedException('Aluno não encontrado para primeiro acesso');
    }

    if (!user.active) {
      throw new ForbiddenException('Seu cadastro ainda aguarda aprovação do professor');
    }

    if (user.passwordHash !== STUDENT_PENDING_PASSWORD) {
      throw new BadRequestException('Primeiro acesso já concluído. Use seu login normal');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    await this.audit.log({
      action: 'USER_LOGIN',
      actorId: user.id,
      entity: 'User',
      entityId: user.id,
      metadata: { firstAccess: true },
    });

    return this.issueToken(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.active) throw new UnauthorizedException('Credenciais inválidas');

    if (user.role === UserRole.STUDENT && user.passwordHash === STUDENT_PENDING_PASSWORD) {
      throw new UnauthorizedException(
        'Primeiro acesso pendente. Defina sua senha na opção de primeiro acesso',
      );
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciais inválidas');

    await this.audit.log({
      action: 'USER_LOGIN',
      actorId: user.id,
      entity: 'User',
      entityId: user.id,
    });

    return this.issueToken(user.id, user.email, user.role);
  }

  private issueToken(sub: string, email: string, role: UserRole) {
    const accessToken = this.jwt.sign({ sub, email, role });
    return {
      accessToken,
      user: { id: sub, email, role },
    };
  }
}
