export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

let currentUser: AuthUser | null = null;
let authToken: string | null = null;

export const getCurrentUser = () => currentUser;

export const signIn = (user: AuthUser) => {
  currentUser = user;
};

export const signOut = () => {
  currentUser = null;
  authToken = null;
};

export const setToken = (token?: string | null) => {
  authToken = token ?? null;
  console.log("SETTEDTT>>>>>>", token);
};

export const getToken = () => authToken;

export const authHeaders = () => {
  const token = getToken();
  console.log("TOKENNN>>>>>>", token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};


