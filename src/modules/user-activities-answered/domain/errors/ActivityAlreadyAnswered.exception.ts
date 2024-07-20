import { HttpException } from '@nestjs/common';

export class ActivityAlreadyAnsweredException extends HttpException {
  constructor() {
    super('Você já respondeu essa atividade.', 403);
  }
}
