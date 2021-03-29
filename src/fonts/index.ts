import types from '../types';
import fiveByEight from './src/fiveByEight';
import fiveBySeven from './src/fiveBySeven';
import atascii from './src/atascii';

export default {
  fiveByEight,
  fiveBySeven,
  atascii
} as Record<string, types.font>;
