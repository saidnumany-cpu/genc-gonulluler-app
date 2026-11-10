import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useAuth } from './auth-context';
import { useMyClaims, useTasks } from './data';
import { categoriesForSkills, type Category, type Claim, type Task } from './types';

interface AppData {
  tasks: Task[];
  tasksLoading: boolean;
  claims: Claim[];
  claimByTask: Record<string, Claim>;
  myCategories: Category[];
  isMatch: (t: Task) => boolean;
}

const Ctx = createContext<AppData | null>(null);

/** Görevleri ve kullanıcının üstlendiği görevleri tek yerden dinler. */
export function AppDataProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth();
  const { tasks, loading } = useTasks(!!user);
  const claims = useMyClaims(user?.uid);
  const value = useMemo<AppData>(() => {
    const myCategories = categoriesForSkills(profile?.skills ?? []);
    const claimByTask = Object.fromEntries(claims.map((c) => [c.taskId, c]));
    return {
      tasks,
      tasksLoading: loading,
      claims,
      claimByTask,
      myCategories,
      isMatch: (t) => myCategories.includes(t.category),
    };
  }, [tasks, loading, claims, profile?.skills]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppData() {
  const v = useContext(Ctx);
  if (!v) throw new Error('AppDataProvider eksik');
  return v;
}
