import AsyncStorage from '@react-native-async-storage/async-storage';

export const USERS_KEY = '@users';

export interface User {
  username: string;
  email: string;
  password: string;
}

// Récupérer tous les utilisateurs
export const getUsers = async (): Promise<User[]> => {
  const jsonValue = await AsyncStorage.getItem(USERS_KEY);
  const users = jsonValue ? JSON.parse(jsonValue) : [];
  console.log('getUsers →', users);
  return users;
};

// Ajouter un nouvel utilisateur
export const addUser = async (user: User) => {
  const users = await getUsers();
  users.push(user);
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  console.log('addUser →', user);
};

// Vérifier si un email est déjà enregistré
export const isEmailTaken = async (email: string): Promise<boolean> => {
  const users = await getUsers();
  return users.some(u => u.email === email);
};
