export type Problem = {
  _id: string;
  slug: string;
  title: string;
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  timeLimit: number;
  memoryLimit: number;
  editorial?: string;
  createdAt: string;
};

export type ProblemsResponse = {
  success: boolean;
  count: number;
  problems: Problem[];
};