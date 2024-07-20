import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const AnswerQuestionRequestSchema = z.object({
  answer: z.string().max(1).describe('Resposta inserida pelo usuário'),
});

export class AnswerQuestionRequestDTO extends createZodDto(
  AnswerQuestionRequestSchema,
) {}

export const AnswerQuestionResponseSchema = z.object({
    true: z.boolean().describe('Resposta correta'),
})

export class AnswerQuestionResponseDTO extends createZodDto(
    AnswerQuestionResponseSchema,
) {}