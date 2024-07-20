import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const FindCoursesResponseSchema = z.object({
  id_course: z.number().int().positive().describe('ID do Curso'),
  course_name: z.string().max(50).describe('Nome do usuário'),
  points_worth: z
    .number()
    .int()
    .positive()
    .describe('Total de Pontos do Curso'),
  total_of_activities: z
    .number()
    .int()
    .positive()
    .describe('Total de Atividades no Curso'),
  created_at: z.date().describe('Data de Lançamento'),
});

export class FindCoursesResponseDTO extends createZodDto(
  FindCoursesResponseSchema,
) {}

export const FindIndividualCourseResponseSchema = z.object({
  id_course: z.number().int().positive().describe('ID do Curso'),
  course_name: z.string().max(50).describe('Nome do usuário'),
  points_worth: z
    .number()
    .int()
    .positive()
    .describe('Total de Pontos do Curso'),
  activities: z.array(
    z.object({
      id_activity: z.number().int().positive().describe('ID da Atividade'),
      question: z.string().max(255).describe('Pergunta da Atividade'),
      option_1: z.string().max(255).describe('Alternativa 1'),
      option_2: z.string().max(255).describe('Alternativa 2'),
      option_3: z.string().max(255).describe('Alternativa 3'),
      option_4: z.string().max(255).describe('Alternativa 4'),
      correct_answer: z.string().describe('Alternativa Correta'),
    }),
  ),
  user_concluded_course: z.boolean().describe('Usuário Concluiu o Curso'),
  concluded_at: z.date().nullable().describe('Data de Conclusão'),
  created_at: z.date().describe('Data de Criação'),
});

export class FindIndividualCourseResponseDTO extends createZodDto(
  FindIndividualCourseResponseSchema,
) {}
