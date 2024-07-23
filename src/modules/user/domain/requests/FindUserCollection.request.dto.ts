import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const FindUserCollectionResponseSchema = z.object({
  id: z.number().int().positive().describe('ID do usuário'),
  username: z.string().max(50).describe('Nome do usuário'),
});

export class FindUserCollectionResponseDTO extends createZodDto(
  FindUserCollectionResponseSchema,
) {}

export const MultipleUserCollectionResponseSchema = z.array(
  FindUserCollectionResponseSchema,
);

export class MultipleUserCollectionResponseDTO extends createZodDto(
  MultipleUserCollectionResponseSchema,
) {}
