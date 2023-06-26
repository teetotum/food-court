export interface Meal {
  id: string;
  type: string;
  name: string;
  description: string;
  ingredients: string;
}

export const data: Meal[] = [
  {
    id: "burger_001",
    type: "Burger",
    name: "The Macbeth",
    description: "Feasts you kingly - murders you in your sleep",
    ingredients:
      "minced pork & beef, Cheddar, Stilton, fried egg, pork belly rasher, mushy peas, cucumber, lettuce",
  },
  {
    id: "burger_002",
    type: "Burger",
    name: "Louis XIV",
    description: "Too much of everything - but temperance is not an option",
    ingredients:
      "minced beef, Saint Albray, Roquefort, Reblochon, mushrooms, scallions, garlic, haricots verts (green beans), sage, rocket",
  },
  {
    id: "burger_003",
    type: "Burger",
    name: "Machiavelli",
    description: "More than you bargained for",
    ingredients:
      "minced pork, lardo, Grana Padano, truffles, garlic, tomatoes, basil, rocket, walnuts",
  },
  {
    id: "pasta_001",
    type: "Pasta",
    name: "Putanesca",
    description: "Pasta with a piquant sauce",
    ingredients: "olives, kapers, pepperoni, onions, garlic, sardines",
  },
  {
    id: "pasta_002",
    type: "Pasta",
    name: "Vongole",
    description: "Pasta with cockles",
    ingredients: "cockles, garlic, olive oil",
  },
  {
    id: "roast_001",
    type: "Roast",
    name: "Beef Wellington",
    description: "Beef roast in a coat of mushrooms wrapped in puff pastry",
    ingredients: "beef, mushrooms, puff pastry",
  },
];
