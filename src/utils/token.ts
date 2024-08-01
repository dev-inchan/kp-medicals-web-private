export function saveToken(token: string) {
  localStorage.setItem('jjj', token);
}
export function getToken() {
  return localStorage.getItem('jjj');
}

export function deleteToken() {
  localStorage.removeItem('jjj');
}
