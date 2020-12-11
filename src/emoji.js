import emoji from 'emojilib';
import Fuse from 'fuse.js';
import { supportedemojis } from './data/supported_emojis';

// List all faces by default, stop on the last faces
const allEmojiFaces = supportedemojis.slice(0, supportedemojis.indexOf('policewoman'));

// List of emojis supported by FB Messenger scraped off https://emojipedia/facebook using src/scripts/get-supported-emoji.py
const supportedEmojiNames = supportedemojis;

// Options for fuzzy searching using fuse.js library
const searchOptions = {
    distance: 0,
    location: 0,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    shouldSort: true,
    threshold: 0.3,
};

const emojis = Object.keys(emoji.lib)
    .map(key => ({ name: key, keywords: [key].concat(emoji.lib[key].keywords), char: emoji.lib[key].char }))
    .filter(emojiItem => supportedEmojiNames.includes(emojiItem.name));

module.exports = {
    emojis,
    popularEmojis: emojis.filter(emojiItem => allEmojiFaces.includes(emojiItem.name))
        .sort((item1, item2) => allEmojiFaces.indexOf(item1.name) - allEmojiFaces.indexOf(item2.name)),
    exactSearchEngine: new Fuse(emojis, { ...searchOptions, keys: ['name'] }),
    fuzzySearchEngine: new Fuse(emojis, { ...searchOptions, keys: [{ name: 'name', weight: 0.9 }, { name: 'keywords', weight: 0.1 }] }),
};
