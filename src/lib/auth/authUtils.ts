import type { StoredUser, AuthSession } from './types';

const USERS_KEY = 'pf_users';
const SESSION_KEY = 'pf_session';
const AUTH_COOKIE_NAME = 'auth_session';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function getStoredUsers(): StoredUser[] {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? (JSON.parse(raw) as StoredUser[]) : [];
}

function saveStoredUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return getStoredUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  );
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<StoredUser> {
  if (findUserByEmail(email)) {
    throw new Error('An account with this email already exists');
  }
  const passwordHash = await hashPassword(password);
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  const users = getStoredUsers();
  users.push(user);
  saveStoredUsers(users);
  return user;
}

export async function verifyCredentials(
  email: string,
  password: string,
): Promise<StoredUser> {
  const user = findUserByEmail(email);
  if (!user) throw new Error('Invalid email or password');

  const hash = await hashPassword(password);
  if (hash !== user.passwordHash) throw new Error('Invalid email or password');

  return user;
}

export function getSession(): AuthSession | null {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as AuthSession) : null;
}

export function saveSession(session: AuthSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  // Set cookie so middleware can detect auth state on the server
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
}
