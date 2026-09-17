import type { Product, Review, FAQItem } from './types';

const asset = (fileName: string) => `${import.meta.env.DEV ? '/' : import.meta.env.BASE_URL}assets/${fileName}`;

export const PRODUCTS: Product[] = [
  {
    id: 'brigadeiro',
    code: 'PRODUCT_001',
    name: 'BRIGADEIRO',
    tag: 'Gourmet',
    price: 5.00,
    image: asset('brigadeiro.jpg'),
    description: 'O clássico indispensável para acompanhar qualquer maratona de código.',
    ingredients: 'Leite condensado, creme de leite, cacau em pó 50% e granulado nobre.'
  },
  {
    id: 'pacoca',
    code: 'PRODUCT_002',
    name: 'PAÇOCA',
    tag: 'Gourmet',
    price: 5.00,
    image: asset('pacoca.jpg'),
    description: 'Sabor marcante de amendoim com textura suave e artesanal.',
    ingredients: 'Leite condensado, creme de leite, paçoca artesanal e amendoim xerem.'
  },
  {
    id: 'beijinho',
    code: 'PRODUCT_003',
    name: 'BEIJINHO',
    tag: 'Gourmet',
    price: 5.00,
    image: asset('beijinho.jpg'),
    description: 'Doce tradicional de coco com o toque especial do cravo.',
    ingredients: 'Leite condensado, creme de leite, coco ralado úmido e cravo da índia.'
  },
  {
    id: 'bichoDePe',
    code: 'PRODUCT_004',
    name: 'BICHO DE PÉ',
    tag: 'Gourmet',
    price: 5.00,
    image: asset('bicho-de-pe.jpg'),
    description: 'Sabor frutado e cor vibrante de morango artesanal.',
    ingredients: 'Leite condensado, creme de leite e composto lácteo sabor morango.'
  }
];

export const REVIEWS: Review[] = [
  {
    pr: 'PR #102 MERGED',
    stars: '★★★★★',
    comment: 'Glicose 100% aprovada! Salva minhas noites de programação antes das entregas.',
    author: '@dev_lucas',
    role: 'Fullstack Engineer'
  },
  {
    pr: 'PR #089 MERGED',
    stars: '★★★★★',
    comment: 'O brigadeiro de paçoca é simplesmente perfeito. Código sem bugs e brigadeiro sem defeitos!',
    author: '@mariana.tech',
    role: 'Frontend Developer'
  },
  {
    pr: 'PR #117 MERGED',
    stars: '★★★★★',
    comment: 'Pedido aprovado em produção! O beijinho chegou impecável e salvou minha pausa entre dois deploys.',
    author: '@rafa.dev',
    role: 'Backend Engineer'
  },
  {
    pr: 'PR #124 MERGED',
    stars: '★★★★★',
    comment: 'O bicho de pé tem a mesma qualidade de um código bem testado: consistente, elegante e impossível de esquecer.',
    author: '@ana.codes',
    role: 'Software Developer'
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    key: 'shelfLife',
    question: 'Qual a validade dos doces?',
    answer: 'Até 5 dias em temperatura ambiente fresca ou até 10 dias sob refrigeração.'
  },
  {
    key: 'deliveryArea',
    question: 'Como funciona a entrega?',
    answer: 'Entregamos via delivery nas regiões próximas ou por retirada combinada no WhatsApp.'
  },
  {
    key: 'customOrders',
    question: 'Fazem encomendas para festas?',
    answer: 'Sim! Aceitamos encomendas corporativas e para eventos com condições especiais via WhatsApp.'
  }
];

export const ABOUT_TEXT = {
  title: 'SOBRE_NÓS ()',
  paragraphs: [
    'A Algoritmo Doce nasceu da união entre a paixão pela tecnologia e a arte da confeitaria artesanal.',
    'O que começou como um projeto paralelo enquanto eu estudava programação se transformou na minha principal fonte de renda e na realização de um sonho.'
  ]
};