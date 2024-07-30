import { createZodDto } from 'nestjs-zod';
import { CreateActivityResponseSchema } from './CreateActivity.request.dto';
import { z } from 'zod';

export class FindActivitiesCollectionRequestDTO extends createZodDto(
  CreateActivityResponseSchema,
) {}

export const FindActivitiesCollectionResponseSchema = z.array(
  CreateActivityResponseSchema,
);

export class FindActivitiesCollectionResponseDTO extends createZodDto(
  FindActivitiesCollectionResponseSchema,
) {}
