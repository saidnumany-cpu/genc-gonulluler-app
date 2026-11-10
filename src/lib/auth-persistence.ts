// Web: tarayıcıda oturum varsayılan olarak IndexedDB'de kalıcıdır.
import { getAuth, type Auth } from 'firebase/auth';
import type { FirebaseApp } from 'firebase/app';

export function createAuth(app: FirebaseApp): Auth {
  return getAuth(app);
}
