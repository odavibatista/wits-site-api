import { HttpException } from '@nestjs/common';

export class CourseNotFoundException extends HttpException {
  constructor() {
    super('Curso não encontrado.', 404);
  }
}
