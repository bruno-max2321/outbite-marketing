/**
 * Unique meal intents for mass TikTok variants.
 * Timing ALWAYS comes from speakingMap.mjs (0718 plate lip/gesture truth).
 * Scripts may differ per chain but MUST keep the same speaker sequence +
 * roughly the same syllable budget per line window.
 *
 * Retention framework (locked to 6 turns):
 * 1) Result-first hook with exact full calorie delta
 * 2) Short craving objection that names Outbite
 * 3) Exact order + before/after calories
 * 4) A-ha that restates the delta
 * 5) Clear product mechanism (data → swaps → order to say)
 * 6) Explicit download CTA
 */
import { BEAT_WINDOWS, LINE_WINDOWS } from "./speakingMap.mjs";

export { BEAT_WINDOWS, LINE_WINDOWS };

/** @returns {{speaker:string,text:string}[]} */
function script(texts) {
  if (texts.length !== LINE_WINDOWS.length) {
    throw new Error(
      `Script length ${texts.length} != LINE_WINDOWS ${LINE_WINDOWS.length}`,
    );
  }
  return LINE_WINDOWS.map((line, i) => ({
    speaker: line.speaker,
    text: texts[i],
  }));
}

export const INTENTS = [
  {
    id: "mcdonalds-big-mac",
    chain: "McDonald's",
    label: "Big Mac Meal",
    visual: {
      before: ["food/combo_meal_burger.png"],
      after: ["food/burger_beef.png", "food/side_fries.png", "food/beverage.png"],
    },
    baseline: {
      name: "Big Mac Meal",
      calories: 1280,
      protein: 29,
      items: ["Big Mac", "Large Fries", "Coke"],
    },
    optimized: {
      name: "Big Mac · Med Fries · Diet Coke",
      calories: 870,
      protein: 29,
      items: ["Big Mac", "Medium Fries", "Diet Coke"],
    },
    swaps: [
      { hook: "SWAP 1 · FRIES", delta: 210, rightName: "Medium Fries instead", rightCal: 1070 },
      { hook: "SWAP 2 · DRINK", delta: 200, rightName: "Diet Coke swap", rightCal: 870 },
      { hook: "FULL UPGRADE", delta: 410, rightName: "Big Mac · Med Fries · Diet Coke", rightCal: 870 },
    ],
    saved: 410,
    voices: {
      outbite: "en-US-AndrewMultilingualNeural",
      impulse: "en-US-BrianMultilingualNeural",
    },
    script: script([
      "Cut four hundred ten calories at McDonald's and keep the Big Mac. Here's the order.",
      "I still get the Big Mac?",
      "Big Mac, medium fries, Diet Coke. Twelve eighty down to eight seventy.",
      "Same burger, four hundred ten less? Bro, how?",
      "I use Outbite. It finds the lowest calorie swaps that still taste good, then gives you the exact order.",
      "I'm downloading Outbite before lunch.",
    ]),
  },
  {
    id: "chickfila-spicy-deluxe",
    chain: "Chick-fil-A",
    label: "Spicy Deluxe Meal",
    visual: {
      before: ["food/chickfila-spicy-deluxe-before.png"],
      after: ["food/chickfila-nuggets-after.png"],
    },
    baseline: {
      name: "Spicy Deluxe Meal",
      calories: 1190,
      protein: 38,
      items: ["Spicy Deluxe", "Waffle Fries", "Lemonade"],
    },
    optimized: {
      name: "Grilled Nuggets · Salad · Diet Lemonade",
      calories: 210,
      protein: 32,
      items: ["Grilled Nuggets 8ct", "Side Salad", "Diet Lemonade"],
    },
    swaps: [
      { hook: "SWAP 1 · SANDWICH", delta: 420, rightName: "Grilled Nuggets instead", rightCal: 770 },
      { hook: "SWAP 2 · SIDE", delta: 340, rightName: "Side Salad swap", rightCal: 430 },
      { hook: "FULL UPGRADE", delta: 980, rightName: "Grilled Nuggets · Salad · Diet Lemonade", rightCal: 210 },
    ],
    saved: 980,
    voices: {
      outbite: "en-US-AndrewMultilingualNeural",
      impulse: "en-US-BrianMultilingualNeural",
    },
    script: script([
      "Cut nine hundred eighty calories at Chick-fil-A. Here's the better order.",
      "Nine eighty? What am I getting?",
      "Nuggets, salad, diet lemonade. Eleven ninety down to two ten.",
      "That still sounds good. How do you know this stuff?",
      "I use Outbite. It finds the lowest calorie swaps that still taste good, then gives you the exact order.",
      "I'm downloading Outbite right now.",
    ]),
  },
  {
    id: "wendys-baconator",
    chain: "Wendy's",
    label: "Baconator Combo",
    visual: {
      before: ["food/wendys-baconator-before.png"],
      after: ["food/wendys-baconator-after.png"],
    },
    baseline: {
      name: "Baconator Combo",
      calories: 1420,
      protein: 52,
      items: ["Baconator", "Medium Fries", "Coke"],
    },
    optimized: {
      name: "Baconator · Small Fries · Water",
      calories: 1090,
      protein: 52,
      items: ["Baconator", "Small Fries", "Water"],
    },
    swaps: [
      { hook: "SWAP 1 · FRIES", delta: 230, rightName: "Small Fries instead", rightCal: 1190 },
      { hook: "SWAP 2 · DRINK", delta: 100, rightName: "Water instead of Coke", rightCal: 1090 },
      { hook: "FULL UPGRADE", delta: 330, rightName: "Baconator · Small Fries · Water", rightCal: 1090 },
    ],
    saved: 330,
    voices: {
      outbite: "en-US-AndrewMultilingualNeural",
      impulse: "en-US-BrianMultilingualNeural",
    },
    script: script([
      "Cut three hundred thirty calories at Wendy's and keep the Baconator. Just fix the sides.",
      "I still get the Baconator?",
      "Baconator, small fries, water. Fourteen twenty to ten ninety.",
      "Same burger, three hundred thirty less? How?",
      "I use Outbite. It finds the lowest calorie swaps that still taste good, then gives you the exact order.",
      "I'm downloading Outbite tonight.",
    ]),
  },
  {
    id: "chipotle-chicken-burrito",
    chain: "Chipotle",
    label: "Chicken Burrito",
    visual: {
      before: ["food/chipotle-burrito-before.png"],
      after: ["food/chipotle-chicken-bowl-after.png"],
    },
    baseline: {
      name: "Chicken Burrito",
      calories: 1050,
      protein: 46,
      items: ["Chicken", "Rice", "Tortilla", "Sour Cream"],
    },
    optimized: {
      name: "Chicken Bowl · Half Rice · Extra Chicken",
      calories: 720,
      protein: 52,
      items: ["Chicken Bowl", "Half Rice", "Extra Chicken", "No Sour Cream"],
    },
    swaps: [
      { hook: "SWAP 1 · BOWL", delta: 210, rightName: "Bowl instead of tortilla", rightCal: 840 },
      { hook: "SWAP 2 · RICE", delta: 120, rightName: "Half rice · no sour cream", rightCal: 720 },
      { hook: "FULL UPGRADE", delta: 330, rightName: "Chicken Bowl · Half Rice · Extra Chicken", rightCal: 720 },
    ],
    saved: 330,
    voices: {
      outbite: "en-US-AndrewMultilingualNeural",
      impulse: "en-US-BrianMultilingualNeural",
    },
    script: script([
      "Cut three hundred thirty calories at Chipotle and get more protein. Build this instead.",
      "A bowl? Is it still filling?",
      "Chicken bowl, half rice, extra chicken. Ten fifty down to seven twenty.",
      "Three hundred thirty less, more protein? How?",
      "I use Outbite. It finds the lowest calorie swaps that still taste good, then gives you the exact order.",
      "I'm downloading Outbite for Chipotle.",
    ]),
  },
  {
    id: "burgerking-whopper",
    chain: "Burger King",
    label: "Whopper Meal",
    visual: {
      before: ["food/burgerking-whopper-before.png"],
      after: ["food/burgerking-whopper-after.png"],
    },
    baseline: {
      name: "Whopper Meal",
      calories: 1310,
      protein: 32,
      items: ["Whopper", "Large Fries", "Sprite"],
    },
    optimized: {
      name: "Whopper · Med Fries · Unsweet Tea",
      calories: 920,
      protein: 32,
      items: ["Whopper", "Medium Fries", "Unsweet Tea"],
    },
    swaps: [
      { hook: "SWAP 1 · FRIES", delta: 210, rightName: "Medium Fries instead", rightCal: 1100 },
      { hook: "SWAP 2 · DRINK", delta: 180, rightName: "Unsweet Tea swap", rightCal: 920 },
      { hook: "FULL UPGRADE", delta: 390, rightName: "Whopper · Med Fries · Unsweet Tea", rightCal: 920 },
    ],
    saved: 390,
    voices: {
      outbite: "en-US-AndrewMultilingualNeural",
      impulse: "en-US-BrianMultilingualNeural",
    },
    script: script([
      "Cut three hundred ninety calories at Burger King and keep the Whopper. Here's the order.",
      "I still get the Whopper?",
      "Whopper, medium fries, tea. Thirteen ten down to nine twenty.",
      "Same Whopper, three hundred ninety less? How?",
      "I use Outbite. It finds the lowest calorie swaps that still taste good, then gives you the exact order.",
      "I'm downloading Outbite right now.",
    ]),
  },
];
