import type { StickerData } from '@/constants/stickers';

export type EmojiApiCategory =
  | 'all'
  | 'smileys-and-people'
  | 'animals-and-nature'
  | 'food-and-drink'
  | 'activities'
  | 'travel-and-places'
  | 'objects'
  | 'symbols';

type EmojiHubItem = {
  name: string;
  category: string;
  group: string;
  htmlCode: string[];
  unicode: string[];
};

let cachedApiEmojis: StickerData[] = [];

/**
 * Converts unicode codes like ["U+1F600"] into a native emoji string
 */
function unicodeToEmoji(unicodeArray: string[]): string {
  try {
    const codePoints = unicodeArray.map((code) => {
      const cleanHex = code.replace(/^U\+/, '');
      return parseInt(cleanHex, 16);
    });
    return String.fromCodePoint(...codePoints);
  } catch {
    return '✨';
  }
}

/**
 * Fetch emojis from public EmojiHub API
 */
export async function fetchLiveEmojis(
  category: EmojiApiCategory = 'all'
): Promise<StickerData[]> {
  try {
    const url =
      category === 'all'
        ? 'https://emojihub.yurace.pro/api/all'
        : `https://emojihub.yurace.pro/api/all/category/${category}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data: EmojiHubItem[] = await response.json();

    const items: StickerData[] = data.slice(0, 80).map((item, index) => {
      const emojiChar = unicodeToEmoji(item.unicode);
      return {
        id: `api-${item.category}-${index}-${Date.now()}`,
        type: 'emoji',
        text: emojiChar,
        name: item.name
          .split(' ')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' '),
      };
    });

    if (category === 'all') {
      cachedApiEmojis = items;
    }

    return items;
  } catch (error) {
    console.warn('Live Emoji API fetch failed, using fallback:', error);
    // Return cached if available, else empty array
    return cachedApiEmojis;
  }
}

