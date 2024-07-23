import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const CreateCourseRequestSchema = z.object({
  course_name: z.string().max(50).describe('Nome do Curso'),
  points_worth: z
    .number()
    .int()
    .positive()
    .describe('Total de Pontos do Curso'),
});

export class CreateCourseRequestDTO extends createZodDto(
  CreateCourseRequestSchema,
) {}

export const CreateCourseResponseSchema = z.object({
  id_course: z.number().int().positive().describe('ID do Curso'),
  course_name: z.string().max(50).describe('Nome do Curso'),
  points_worth: z
    .number()
    .int()
    .positive()
    .describe('Total de Pontos do Curso'),
  created_at: z.date().describe('Data de Lançamento'),
});

export class CreateCourseResponseDTO extends createZodDto(
  CreateCourseResponseSchema,
) {}
