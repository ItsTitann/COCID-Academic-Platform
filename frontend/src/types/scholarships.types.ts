export type AcademicLevel = 'UNDERGRADUATE' | 'MASTER' | 'DOCTORATE' | 'ALL';

export interface StudentAcademicProfile {
  gpa: number;
  academicLevel: AcademicLevel;
  studyField: string;
  researchInterests: string[];
  languages: string[];
  socioeconomicLevel?: string;
}

export interface ScholarshipOpportunity {
  id: string;
  title: string;
  institution: string;
  academicLevel: AcademicLevel;
  country: string;
  matchScore: number;
  coverage: string;
  deadline: string;
  requirements: string[];
  applicationUrl: string;
}
