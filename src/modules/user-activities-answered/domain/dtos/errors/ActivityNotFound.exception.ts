import { HttpException } from '@nestjs/common';

export class ActivityNotFoundException extends HttpException {
  constructor() {
    super('A atividade pela qual você buscou não existe.', 404);
  }
}
