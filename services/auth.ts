// utils/auth.ts
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import bcrypt from 'bcryptjs';
import 'react-native-get-random-values';
import { getRandomBytes } from 'react-native-get-random-values';

// ----- Configuration bcrypt pour Expo mobile -----
bcrypt.setRandomFallback((len: number) => {
  const array = getRandomBytes(len);         // Uint8Array
  return Array.from(array);                  // Converti en number[]
});

// ----- Clés de stockage -----
const USERS_KEY = 'USERS_DATA';
const LOGGED_USER_KEY = 'LOGGED_USER';

// ----- Types -----
export type StoredUser = {
  email: string;
  password: string; // mot de passe haché
  createdAt: string;
};

export type SafeUser = {
  email: string;
  createdAt: string;
};

export type UserInput = {
  email: string;
  password: string;
};

// ----- Helpers stockage multiplateforme -----
async function setItem(key: string, value: string) {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde :', error);
  }
}

async function getItem(key: string): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
    return null;
  }
}

async function deleteItem(key: string) {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
  }
}

// ----- Gestion des utilisateurs -----
export async function getUsers(): Promise<StoredUser[]> {
  const stored = await getItem(USERS_KEY);
  const users = stored ? (JSON.parse(stored) as StoredUser[]) : [];
  console.log('🔹 Utilisateurs enregistrés :', users);
  return users;
}

export async function saveUser({ email, password }: UserInput): Promise<SafeUser> {
  if (!email || !password) throw new Error('Email et mot de passe requis');

  const users = await getUsers();

  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Un utilisateur avec cet email existe déjà');
  }

  // Hachage sécurisé
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const newUser: StoredUser = {
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await setItem(USERS_KEY, JSON.stringify(users));

  return { email: newUser.email, createdAt: newUser.createdAt };
}

export async function validateUser(email: string, plainPassword: string): Promise<SafeUser | null> {
  const users = await getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;

  const matches = bcrypt.compareSync(plainPassword, user.password);
  return matches ? { email: user.email, createdAt: user.createdAt } : null;
}

// ----- Gestion de la session utilisateur -----
export async function storeLoggedUser(safeUser: SafeUser): Promise<void> {
  await setItem(LOGGED_USER_KEY, JSON.stringify(safeUser));
}

export async function getLoggedUser(): Promise<SafeUser | null> {
  const stored = await getItem(LOGGED_USER_KEY);
  return stored ? (JSON.parse(stored) as SafeUser) : null;
}

export async function clearLoggedUser(): Promise<void> {
  await deleteItem(LOGGED_USER_KEY);
}

// ----- Debug / utilitaires -----
export async function clearUsers(): Promise<void> {
  await deleteItem(USERS_KEY);
}
