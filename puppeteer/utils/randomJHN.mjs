// Utility to get a random element from an array or string
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Exported function to generate a random JHN
export default function generateRandomJHN() {
  // Générer les 4 premiers caractères
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const part1 = Array.from({ length: 4 }, () => getRandomElement(chars)).join('');

  // Générer deux chiffres (00 à 99)
  const part2 = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, '0');

  // Générer le mois correspondant à la 3e partie
  const part3Options = [
    ...Array.from({ length: 9 }, (_, i) => `0${i + 1}`), // 01 à 09
    ...['10', '11', '12', '60', '61', '62'], // Ajout des valeurs de `[16][012]`
    ...['51', '52', '53', '54', '55', '56', '57', '58', '59'], // `[05][1-9]`
  ];
  const part3 = getRandomElement(part3Options);

  // Générer une date valide (01 à 31)
  const part4Options = [
    ...Array.from({ length: 9 }, (_, i) => `0${i + 1}`), // 01 à 09
    ...Array.from({ length: 20 }, (_, i) => (i + 10).toString()), // 10 à 29
    ...['30', '31'], // 30 et 31
  ];
  const part4 = getRandomElement(part4Options);

  // Générer les deux derniers chiffres
  const part5 = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, '0');

  // Combiner toutes les parties
  return `${part1}${part2}${part3}${part4}${part5}`;
}
