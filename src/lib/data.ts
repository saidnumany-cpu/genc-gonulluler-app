import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { SEED_TASKS } from './seed';
import type { Claim, Task, UserProfile } from './types';

// ---------- Canlı veri kancaları ----------

export function useTasks(enabled: boolean) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!enabled) return;
    return onSnapshot(
      query(collection(db, 'tasks'), where('active', '==', true)),
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Task, 'id'>) }));
        list.sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
        setTasks(list);
        setLoading(false);
      },
      () => setLoading(false),
    );
  }, [enabled]);
  return { tasks, loading };
}

export function useMyClaims(uid: string | undefined) {
  const [claims, setClaims] = useState<Claim[]>([]);
  useEffect(() => {
    if (!uid) return;
    return onSnapshot(query(collection(db, 'claims'), where('uid', '==', uid)), (snap) =>
      setClaims(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Claim, 'id'>) }))),
    );
  }, [uid]);
  return claims;
}

export function useLeaderboard(n = 5) {
  const [rows, setRows] = useState<UserProfile[]>([]);
  useEffect(
    () =>
      onSnapshot(query(collection(db, 'users'), orderBy('impactTotal', 'desc'), limit(n)), (snap) =>
        setRows(snap.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<UserProfile, 'uid'>) }))),
      ),
    [n],
  );
  return rows;
}

export function usePendingClaims(enabled: boolean) {
  const [claims, setClaims] = useState<Claim[]>([]);
  useEffect(() => {
    if (!enabled) return;
    return onSnapshot(query(collection(db, 'claims'), where('status', '==', 'submitted')), (snap) =>
      setClaims(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Claim, 'id'>) }))),
    );
  }, [enabled]);
  return claims;
}

// ---------- Profil ----------

export async function createProfile(uid: string, name: string) {
  await setDoc(doc(db, 'users', uid), {
    name,
    skills: [],
    impactTotal: 0,
    taskCount: 0,
    createdAt: serverTimestamp(),
  });
}

export async function updateSkills(uid: string, skills: string[]) {
  await updateDoc(doc(db, 'users', uid), { skills });
}

/** Hesabı ve kullanıcıya ait tüm verileri siler. */
export async function deleteAccount(uid: string, claimIds: string[]) {
  const batch = writeBatch(db);
  claimIds.forEach((id) => batch.delete(doc(db, 'claims', id)));
  batch.delete(doc(db, 'users', uid));
  await batch.commit();
}

// ---------- Görev akışı: üstlen → teslim et → kurum onayı ----------

export const claimId = (uid: string, taskId: string) => `${uid}_${taskId}`;

export async function claimTask(user: UserProfile, task: Task) {
  await setDoc(doc(db, 'claims', claimId(user.uid, task.id)), {
    uid: user.uid,
    userName: user.name,
    taskId: task.id,
    taskTitle: task.title,
    org: task.org,
    category: task.category,
    cause: task.cause,
    status: 'claimed',
    createdAt: serverTimestamp(),
  });
}

export async function unclaimTask(uid: string, taskId: string) {
  await deleteDoc(doc(db, 'claims', claimId(uid, taskId)));
}

export async function submitTask(uid: string, taskId: string, link: string) {
  await updateDoc(doc(db, 'claims', claimId(uid, taskId)), {
    status: 'submitted',
    link,
    submittedAt: serverTimestamp(),
  });
}

// ---------- Yönetim (yalnızca role: 'admin') ----------

export async function approveClaim(claim: Claim, impact: number, story: string) {
  const batch = writeBatch(db);
  batch.update(doc(db, 'claims', claim.id), {
    status: 'approved',
    impact,
    story,
    approvedAt: serverTimestamp(),
  });
  batch.update(doc(db, 'users', claim.uid), {
    impactTotal: increment(impact),
    taskCount: increment(1),
  });
  await batch.commit();
}

export async function rejectClaim(claim: Claim) {
  await updateDoc(doc(db, 'claims', claim.id), { status: 'claimed' });
}

export async function addTask(task: Omit<Task, 'id' | 'createdAt'>) {
  await addDoc(collection(db, 'tasks'), { ...task, createdAt: serverTimestamp() });
}

export async function seedTasks() {
  const batch = writeBatch(db);
  SEED_TASKS.forEach((t) => batch.set(doc(collection(db, 'tasks')), { ...t, createdAt: serverTimestamp() }));
  await batch.commit();
}
