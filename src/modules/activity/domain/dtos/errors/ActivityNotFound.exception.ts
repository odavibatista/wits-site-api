import { HttpException } from '@nestjs/common';

export class ActivityNotFoundException extends HttpException {
  constructor() {
    super('Atividade não encontrada.', 404);
  }
}
