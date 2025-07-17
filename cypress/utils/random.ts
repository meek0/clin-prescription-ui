/* eslint-disable @typescript-eslint/no-explicit-any */

// Fonction pour générer un numéro de RAMQ valide aléatoire
export const generateRandomRamq = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const firstLetter = letters.charAt(Math.floor(Math.random() * letters.length));
  const namePart = firstLetter + letters.charAt(Math.floor(Math.random() * letters.length)) + letters.charAt(Math.floor(Math.random() * letters.length)) + letters.charAt(Math.floor(Math.random() * letters.length));
  
  const year = Math.floor(Math.random() * (99 - 50 + 1)) + 50;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;

  const datePart = `${year.toString().padStart(2, '0')}${(month).toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
  
  const lastDigits = Math.floor(Math.random() * 100).toString().padStart(2, '0');

  return `${namePart} ${datePart} ${lastDigits}`;
};

// Fonction pour générer un numéro de dossier aléatoire de 8 chiffres
export const generateRandomDossier = (): string => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};