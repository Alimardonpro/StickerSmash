import type { ImageSource } from 'expo-image';

export type StickerData =
  | { id: string; type: 'image'; source: ImageSource; name: string }
  | { id: string; type: 'emoji'; text: string; name: string };

export const IMAGE_STICKERS: StickerData[] = [
  { id: 'stk-butterfly', type: 'image', source: require('@/assets/images/stickers/butterfly.png'), name: 'Butterfly' },
  { id: 'stk-sparkles', type: 'image', source: require('@/assets/images/stickers/sparkles.png'), name: 'Sparkles' },
  { id: 'stk-crown', type: 'image', source: require('@/assets/images/stickers/crown.png'), name: 'Crown' },
  { id: 'stk-cherry', type: 'image', source: require('@/assets/images/stickers/cherry-blossom.png'), name: 'Blossom' },
  { id: 'stk-heart', type: 'image', source: require('@/assets/images/stickers/sparkling-heart.png'), name: 'Heart' },
  { id: 'stk-hearts-smile', type: 'image', source: require('@/assets/images/stickers/hearts-smile.png'), name: 'In Love' },
  { id: 'stk-cool-smile', type: 'image', source: require('@/assets/images/stickers/cool-smile.png'), name: 'Cool' },
  { id: 'stk-party-smile', type: 'image', source: require('@/assets/images/stickers/party-smile.png'), name: 'Party' },
  { id: 'stk-star', type: 'image', source: require('@/assets/images/stickers/star.png'), name: 'Glow Star' },
  { id: 'stk-ribbon', type: 'image', source: require('@/assets/images/stickers/ribbon.png'), name: 'Ribbon' },
  { id: 'stk-teddy', type: 'image', source: require('@/assets/images/stickers/teddy.png'), name: 'Teddy Bear' },
  { id: 'stk-rose', type: 'image', source: require('@/assets/images/stickers/rose.png'), name: 'Red Rose' },
  { id: 'stk-fire', type: 'image', source: require('@/assets/images/stickers/fire.png'), name: 'Fire Flame' },
  { id: 'stk-rainbow', type: 'image', source: require('@/assets/images/stickers/rainbow.png'), name: 'Rainbow' },
  { id: 'stk-cat', type: 'image', source: require('@/assets/images/stickers/cat.png'), name: 'Cute Cat' },
  { id: 'stk-wand', type: 'image', source: require('@/assets/images/stickers/wand.png'), name: 'Magic Wand' },
  { id: 'stk-crystal', type: 'image', source: require('@/assets/images/stickers/crystal.png'), name: 'Crystal Ball' },
  { id: 'stk-camera', type: 'image', source: require('@/assets/images/stickers/camera.png'), name: 'Camera' },
  { id: 'stk-sun', type: 'image', source: require('@/assets/images/stickers/sun.png'), name: 'Golden Sun' },
  { id: 'stk-unicorn', type: 'image', source: require('@/assets/images/stickers/unicorn.png'), name: 'Unicorn' },
];

export const EMOJI_STICKERS: StickerData[] = [
  // Aesthetic & Cute
  { id: 'em-1', type: 'emoji', text: '🦋', name: 'Butterfly' },
  { id: 'em-2', type: 'emoji', text: '✨', name: 'Sparkles' },
  { id: 'em-3', type: 'emoji', text: '🌸', name: 'Blossom' },
  { id: 'em-4', type: 'emoji', text: '💖', name: 'Sparkling Heart' },
  { id: 'em-5', type: 'emoji', text: '🥰', name: 'Hearts Smile' },
  { id: 'em-6', type: 'emoji', text: '👑', name: 'Crown' },
  { id: 'em-7', type: 'emoji', text: '🎀', name: 'Ribbon' },
  { id: 'em-8', type: 'emoji', text: '🍓', name: 'Strawberry' },
  { id: 'em-9', type: 'emoji', text: '⭐', name: 'Star' },
  { id: 'em-10', type: 'emoji', text: '😎', name: 'Cool' },
  { id: 'em-11', type: 'emoji', text: '🥳', name: 'Celebrate' },
  { id: 'em-12', type: 'emoji', text: '💎', name: 'Diamond' },
  { id: 'em-13', type: 'emoji', text: '🫧', name: 'Bubbles' },
  { id: 'em-14', type: 'emoji', text: '🕊️', name: 'Dove' },
  { id: 'em-15', type: 'emoji', text: '🔥', name: 'Fire' },
  { id: 'em-16', type: 'emoji', text: '🍕', name: 'Pizza' },

  // Expressions
  { id: 'em-17', type: 'emoji', text: '😍', name: 'Heart Eyes' },
  { id: 'em-18', type: 'emoji', text: '🤩', name: 'Star Struck' },
  { id: 'em-19', type: 'emoji', text: '😇', name: 'Angel' },
  { id: 'em-20', type: 'emoji', text: '😜', name: 'Winking' },
  { id: 'em-21', type: 'emoji', text: '🤗', name: 'Hug' },
  { id: 'em-22', type: 'emoji', text: '🤫', name: 'Secret' },
  { id: 'em-23', type: 'emoji', text: '🤭', name: 'Giggle' },
  { id: 'em-24', type: 'emoji', text: '🥺', name: 'Pleading' },

  // Nature & Animals
  { id: 'em-25', type: 'emoji', text: '🌷', name: 'Tulip' },
  { id: 'em-26', type: 'emoji', text: '🌻', name: 'Sunflower' },
  { id: 'em-27', type: 'emoji', text: '🌺', name: 'Hibiscus' },
  { id: 'em-28', type: 'emoji', text: '🍀', name: 'Clover' },
  { id: 'em-29', type: 'emoji', text: '🌙', name: 'Moon' },
  { id: 'em-30', type: 'emoji', text: '🌈', name: 'Rainbow' },
  { id: 'em-31', type: 'emoji', text: '🐱', name: 'Cat' },
  { id: 'em-32', type: 'emoji', text: '🐶', name: 'Dog' },
  { id: 'em-33', type: 'emoji', text: '🐰', name: 'Rabbit' },
  { id: 'em-34', type: 'emoji', text: '🐼', name: 'Panda' },
  { id: 'em-35', type: 'emoji', text: '🦊', name: 'Fox' },
  { id: 'em-36', type: 'emoji', text: '🦄', name: 'Unicorn' },

  // Celebrations & Cool
  { id: 'em-37', type: 'emoji', text: '🎈', name: 'Balloon' },
  { id: 'em-38', type: 'emoji', text: '🎊', name: 'Confetti' },
  { id: 'em-39', type: 'emoji', text: '🎁', name: 'Gift' },
  { id: 'em-40', type: 'emoji', text: '🧁', name: 'Cupcake' },
  { id: 'em-41', type: 'emoji', text: '🍩', name: 'Donut' },
  { id: 'em-42', type: 'emoji', text: '🍭', name: 'Lollipop' },
  { id: 'em-43', type: 'emoji', text: '🍿', name: 'Popcorn' },
  { id: 'em-44', type: 'emoji', text: '☕', name: 'Coffee' },
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
  { id: 'bdg-9', type: 'emoji', text: '🏆', name: 'Trophy' },
  { id: 'bdg-10', type: 'emoji', text: '🥇', name: 'Gold' },
  { id: 'bdg-11', type: 'emoji', text: '🚀', name: 'Rocket' },
  { id: 'bdg-12', type: 'emoji', text: '🪐', name: 'Saturn' },
  { id: 'bdg-13', type: 'emoji', text: '🔮', name: 'Mystic' },
  { id: 'bdg-14', type: 'emoji', text: '🧿', name: 'Amulet' },
  { id: 'bdg-15', type: 'emoji', text: '❤️‍🔥', name: 'Heart On Fire' },
  { id: 'bdg-16', type: 'emoji', text: '🪩', name: 'Disco Ball' },
];
