# Food assets

Transparent PNGs generated from Outbite `outbite-food-images/raw/` (cream studio back knocked out):

| File | Use |
|------|-----|
| `combo_meal_burger.png` | YOU PICKED / before meal |
| `burger_beef.png` | IMPROVED burger |
| `side_fries.png` | IMPROVED fries |
| `beverage.png` | IMPROVED drink |
| `chickfila-spicy-deluxe-before.png` | Spicy chicken sandwich + waffle fries + lemonade |
| `chickfila-nuggets-after.png` | Grilled nuggets + salad + diet lemonade |
| `wendys-baconator-before.png` | Baconator + fries + Coke |
| `wendys-baconator-after.png` | Baconator + small fries + water |
| `chipotle-burrito-before.png` | Chicken burrito |
| `chipotle-chicken-bowl-after.png` | Extra-chicken bowl + half rice |
| `burgerking-whopper-before.png` | Whopper + large fries + soda |
| `burgerking-whopper-after.png` | Whopper + medium fries + unsweet tea |

Loaded via Remotion `<Img src={staticFile("food/...")} />` in `FoodComparison.tsx`.

Every intent in `scripts/lib/intents.mjs` must point to meal-specific assets.
Never reuse the generic burger combo for chicken, bowls, pizza, or other foods.
