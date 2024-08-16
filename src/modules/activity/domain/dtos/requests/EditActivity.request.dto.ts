import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const EditActivityRequestSchema = z.object({
  course_id: z.number().int().positive().describe('ID do Curso'),
  question: z.string().max(255).describe('Pergunta'),
  option_1: z.string().max(600).describe('Opção 1'),
  option_2: z.string().max(600).describe('Opção 2'),
  option_3: z.string().max(600).describe('Opção 3'),
  option_4: z.string().max(600).describe('Opção 4'),
  correct_answer: z.string().max(1).describe('Resposta Correta'),
});

export class EditActivityRequestDTO extends createZodDto(
  EditActivityRequestSchema,
) {}

export const EditActivityResponseSchema = z.object({
  course_id: z.number().int().positive().describe('ID do Curso'),
  question: z.string().max(255).describe('Pergunta'),
  option_1: z.string().max(600).describe('Opção 1'),
  option_2: z.string().max(600).describe('Opção 2'),
  option_3: z.string().max(600).describe('Opção 3'),
  option_4: z.string().max(600).describe('Opção 4'),
  correct_answer: z.string().max(1).describe('Resposta Correta'),
  created_at: z.date().describe('Data de Lançamento'),
});

export class EditActivityResponseDTO extends createZodDto(
  EditActivityResponseSchema,
) {}
