import type { ImageSource } from 'expo-image';

export type StickerData =
  | { id: string; type: 'image'; source: ImageSource; name: string }
  | { id: string; type: 'emoji'; text: string; name: string };

export const IMAGE_STICKERS: StickerData[] = [
  { id: 'img-1', type: 'image', source: require('@/assets/images/emoji1.png'), name: 'Cute Jelly' },
  { id: 'img-2', type: 'image', source: require('@/assets/images/emoji2.png'), name: 'Winking Sun' },
  { id: 'img-3', type: 'image', source: require('@/assets/images/emoji3.png'), name: 'Happy Star' },
  { id: 'img-4', type: 'image', source: require('@/assets/images/emoji4.png'), name: 'Cool Glasses' },
  { id: 'img-5', type: 'image', source: require('@/assets/images/emoji5.png'), name: 'Love Cat' },
  { id: 'img-6', type: 'image', source: require('@/assets/images/emoji6.png'), name: 'Party Ghost' },
];

export const EMOJI_STICKERS: StickerData[] = [
  { id: 'em-1', type: 'emoji', text: '🔥', name: 'Fire' },
  { id: 'em-2', type: 'emoji', text: '⭐', name: 'Star' },
  { id: 'em-3', type: 'emoji', text: '🎉', name: 'Party' },
  { id: 'em-4', type: 'emoji', text: '😎', name: 'Cool' },
  { id: 'em-5', type: 'emoji', text: '🚀', name: 'Rocket' },
  { id: 'em-6', type: 'emoji', text: '❤️', name: 'Heart' },
  { id: 'em-7', type: 'emoji', text: '👑', name: 'Crown' },
  { id: 'em-8', type: 'emoji', text: '⚡', name: 'Thunder' },
  { id: 'em-9', type: 'emoji', text: '💎', name: 'Diamond' },
  { id: 'em-10', type: 'emoji', text: '🏆', name: 'Trophy' },
  { id: 'em-11', type: 'emoji', text: '🌸', name: 'Blossom' },
  { id: 'em-12', type: 'emoji', text: '🐶', name: 'Dog' },
  { id: 'em-13', type: 'emoji', text: '👾', name: 'Alien' },
  { id: 'em-14', type: 'emoji', text: '🍕', name: 'Pizza' },
  { id: 'em-15', type: 'emoji', text: '🥳', name: 'Celebrate' },
  { id: 'em-16', type: 'emoji', text: '✨', name: 'Sparkles' },
];

export const BADGE_STICKERS: StickerData[] = [
  { id: 'bdg-1', type: 'emoji', text: '💯', name: '100' },
  { id: 'bdg-2', type: 'emoji', text: '⚡️', name: 'Fast' },
  { id: 'bdg-3', type: 'emoji', text: '🎯', name: 'Target' },
  { id: 'bdg-4', type: 'emoji', text: '💥', name: 'Boom' },
  { id: 'bdg-5', type: 'emoji', text: '💫', name: 'Dizzy' },
  { id: 'bdg-6', type: 'emoji', text: '🌟', name: 'Glow' },
  { id: 'bdg-7', type: 'emoji', text: '🪄', name: 'Magic' },
  { id: 'bdg-8', type: 'emoji', text: '🎨', name: 'Art' },
];

