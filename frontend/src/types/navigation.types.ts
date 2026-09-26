import type { ReactNode } from 'react';

export interface NavItem {
  title: string;
  path: string;
  icon: ReactNode;
  badge?: string;
  description?: string;
}

export interface ModuleCardInfo {
  id: 'similarity' | 'lsm' | 'scholarships';
  title: string;
  description: string;
  path: string;
  iconName: string;
  status: 'active' | 'beta' | 'maintenance';
}
