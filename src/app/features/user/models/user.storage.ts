export const USER_KEY = 'chat_user';

export function saveUserName(name: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(USER_KEY, name);
  }
}

export function getUserName(): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem(USER_KEY);
  }
  return null;
}
