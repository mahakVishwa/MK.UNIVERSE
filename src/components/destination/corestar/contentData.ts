import { InteractiveEntity } from './types';

export interface EducationContent {
  type: 'education';
  category: 'EDUCATION';
  symbol: '✦';
  degree: 'Information Technology';
  institution: 'International Institute of Professional Studies (DAVV), Indore';
  expectedYear: 'Expected 2029';
  metrics: {
    cgpa: 'CGPA — 9.54';
    higherSecondary: 'Higher Secondary — 95.4% (2024)';
    secondary: 'Secondary — 96.4% (2022)';
  };
}

export interface InterestsContent {
  type: 'interests';
  category: 'INTERESTS';
  symbol: '☄';
  items: [
    'Data Analytics',
    'AI / Machine Learning',
    'Web Development'
  ];
}

export interface ExperienceContent {
  type: 'experience';
  category: 'EXPERIENCE';
  symbol: '◈';
  role: 'Frontend Developer Intern';
  company: 'Claiminn';
  meta: '3-month Internship · Remote';
}

export type EntityContentMap = {
  education: EducationContent;
  interests: InterestsContent;
  experience: ExperienceContent;
};

export const CORE_STAR_CONTENT: EntityContentMap = {
  education: {
    type: 'education',
    category: 'EDUCATION',
    symbol: '✦',
    degree: 'Information Technology',
    institution: 'International Institute of Professional Studies (DAVV), Indore',
    expectedYear: 'Expected 2029',
    metrics: {
      cgpa: 'CGPA — 9.54',
      higherSecondary: 'Higher Secondary — 95.4% (2024)',
      secondary: 'Secondary — 96.4% (2022)',
    },
  },
  interests: {
    type: 'interests',
    category: 'INTERESTS',
    symbol: '☄',
    items: [
      'Data Analytics',
      'AI / Machine Learning',
      'Web Development',
    ],
  },
  experience: {
    type: 'experience',
    category: 'EXPERIENCE',
    symbol: '◈',
    role: 'Frontend Developer Intern',
    company: 'Claiminn',
    meta: '3-month Internship · Remote',
  },
};

export const ENTITY_LAYER_ROLES: Record<InteractiveEntity, 'crystal' | 'comet' | 'asteroid'> = {
  education: 'crystal',
  interests: 'comet',
  experience: 'asteroid',
};

export const ROLE_TO_ENTITY: Record<string, InteractiveEntity> = {
  crystal: 'education',
  comet: 'interests',
  asteroid: 'experience',
};

// ============================================================================
// [PLACEHOLDER: Predefined Companion dialogue line for Core Star exploration completion]
// As specified: marked clearly as a placeholder until official copy is supplied.
// ============================================================================
export const CORE_STAR_COMPLETION_DIALOGUE =
  "You've explored every landmark in the Core Star. Ready to journey outward to the next world?";
