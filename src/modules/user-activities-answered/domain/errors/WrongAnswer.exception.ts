import { HttpException } from '@nestjs/common';

export class WrongAnswerException extends HttpException {
  constructor() {
    super('Resposta incorreta.', 422);
  }
}
