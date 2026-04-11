const ADJECTIVES = [
  'Calm',
  'Serene',
  'Gentle',
  'Hopeful',
  'Quiet',
  'Bright',
  'Tender',
  'Kind',
  'Soft',
  'Golden',
  'Warm',
  'Peaceful',
];

const NOUNS = [
  'Cloud',
  'River',
  'Dawn',
  'Breeze',
  'Moon',
  'Harbor',
  'Garden',
  'Willow',
  'Horizon',
  'Feather',
  'Star',
  'Meadow',
];

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function generateAnonymousName() {
  return `${pickRandom(ADJECTIVES)} ${pickRandom(NOUNS)}`;
}
