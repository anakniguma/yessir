import { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Ethiopian Yirgacheffe',
    origin: 'Ethiopia',
    category: 'Single Origin',
    price: 22.50,
    description: 'A bright and complex coffee from the birthplace of coffee. Grown at elevations above 1,800m in the Yirgacheffe region, this washed lot delivers an extraordinary cup with floral aromatics and a silky body that lingers on the palate.',
    flavorNotes: ['Jasmine', 'Bergamot', 'Peach', 'Honey'],
    roast: 'Light',
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=600&fit=crop'
  },
  {
    id: 2,
    name: 'Colombian Supremo',
    origin: 'Colombia',
    category: 'Single Origin',
    price: 19.00,
    description: 'Sourced from small farms in the Huila region, this Supremo grade coffee offers a perfectly balanced cup. The high altitude growing conditions create a dense bean with rich sweetness and clean acidity.',
    flavorNotes: ['Caramel', 'Red Apple', 'Milk Chocolate', 'Walnut'],
    roast: 'Medium',
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600&h=600&fit=crop'
  },
  {
    id: 3,
    name: 'Sumatra Mandheling',
    origin: 'Indonesia',
    category: 'Single Origin',
    price: 24.00,
    description: 'A bold and earthy coffee from the volcanic soils of northern Sumatra. Wet-hulled processing gives this coffee its distinctive full body and low acidity, making it perfect for those who prefer a robust cup.',
    flavorNotes: ['Dark Chocolate', 'Cedar', 'Tobacco', 'Brown Sugar'],
    roast: 'Dark',
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=600&h=600&fit=crop'
  },
  {
    id: 4,
    name: 'Artisan Espresso Blend',
    origin: 'Brazil & Guatemala',
    category: 'Blend',
    price: 18.50,
    description: 'Our signature espresso blend combines the nutty sweetness of Brazilian beans with the chocolate complexity of Guatemalan highlands. Designed to perform beautifully as espresso or in milk-based drinks.',
    flavorNotes: ['Hazelnut', 'Dark Chocolate', 'Toffee', 'Dried Fig'],
    roast: 'Medium-Dark',
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&h=600&fit=crop'
  },
  {
    id: 5,
    name: 'Kenya AA Nyeri',
    origin: 'Kenya',
    category: 'Single Origin',
    price: 26.00,
    description: 'From the renowned Nyeri county, this AA grade coffee is a showcase of Kenyan excellence. The SL28 and SL34 varietals produce an intensely vibrant cup with wine-like acidity and juicy fruit character.',
    flavorNotes: ['Blackcurrant', 'Grapefruit', 'Tomato', 'Maple'],
    roast: 'Light',
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop'
  },
  {
    id: 6,
    name: 'Morning Ritual Blend',
    origin: 'Ethiopia & Colombia',
    category: 'Blend',
    price: 16.50,
    description: 'A smooth and approachable blend crafted for your daily ritual. Ethiopian naturals bring berry sweetness while Colombian washed beans add structure and balance. Perfect for filter brewing.',
    flavorNotes: ['Blueberry', 'Cocoa', 'Vanilla', 'Almond'],
    roast: 'Medium',
    weight: '250g',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&h=600&fit=crop'
  }
];

export const categories = ['All', 'Single Origin', 'Blend'];
