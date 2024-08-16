import { createZodDto } from 'nestjs-zod';
import { CreateActivityResponseSchema } from './CreateActivity.request.dto';

export class GetActivityResponseDTO extends createZodDto(
  CreateActivityResponseSchema,
) {}
