import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const FindTopScoresResponseSchema = z.object({
  id: z.number().int().positive().describe('ID do usuário'),
  username: z.string().max(50).describe('Nome do usuário'),
  score: z.number().int().positive().describe('Pontuação do usuário'),
});

export class FindTopScoresResponseDTO extends createZodDto(FindTopScoresResponseSchema) {}

export const MultipleTopScoresResponseSchema = z.array(FindTopScoresResponseSchema);

export class MultipleTopScoresResponseDTO extends createZodDto(MultipleTopScoresResponseSchema) {}