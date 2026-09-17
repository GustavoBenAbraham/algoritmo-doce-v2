export interface Product {
  id: string;
  code: string;
  name: string;
  tag: string;
  price: number;
  image: string;
  description: string;
  ingredients: string;
}

export interface Review {
  pr: string;
  stars: string;
  comment: string;
  author: string;
  role: string;
}

export interface FAQItem {
  key: string;
  question: string;
  answer: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}