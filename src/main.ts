import './style.css';
import { PRODUCTS, REVIEWS, FAQ_ITEMS } from './products';
import { CartManager } from './cart';
import initWasm from './wasm/crate_engine.js';

// Instância do carrinho
const cart = new CartManager();

function initMatrixBackground() {
  const canvas = document.getElementById('matrix-background') as HTMLCanvasElement | null;
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  const characters = ['🍫', '🍬', '🍭', '🧁', '🍩', '🍪'];
  const fontSize = 20;
  let columns = 0;
  let drops: number[] = [];
  let animationFrame = 0;
  let isRunning = true;

  const resize = () => {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.floor(window.innerWidth * pixelRatio);
    canvas.height = Math.floor(window.innerHeight * pixelRatio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    columns = Math.ceil(window.innerWidth / fontSize);
    drops = Array.from({ length: columns }, () => Math.random() * -40);
  };

  const draw = () => {
    if (!isRunning) return;
    context.fillStyle = 'rgba(13, 17, 23, 0.12)';
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);
    context.font = `${fontSize}px ${getComputedStyle(document.documentElement).getPropertyValue('--font-code') || 'monospace'}`;

    drops.forEach((drop, column) => {
      const character = characters[Math.floor(Math.random() * characters.length)];
      const x = column * fontSize;
      const y = drop * fontSize;
      context.fillStyle = Math.random() > 0.93 ? '#fff1a8' : 'rgba(255, 196, 112, 0.68)';
      context.fillText(character, x, y);

      if (y > window.innerHeight && Math.random() > 0.975) {
        drops[column] = 0;
      } else {
        drops[column] += 0.45;
      }
    });

    animationFrame = window.requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    isRunning = document.visibilityState === 'visible';
    if (isRunning) {
      window.cancelAnimationFrame(animationFrame);
      draw();
    }
  });
  draw();
}

function typeWriter() {
  const element = document.getElementById('typing-text');
  const text = 'Brigadeiros gourmet artesanais.';
  let index = 0;

  if (!element) return;
  const writeNextCharacter = () => {
    if (index < text.length) {
      element.textContent += text.charAt(index++);
      window.setTimeout(writeNextCharacter, 75);
    }
  };
  writeNextCharacter();
}

function checkStoreStatus() {
  const badge = document.getElementById('status-badge');
  const statusText = document.getElementById('status-text');
  if (!badge || !statusText) return;

  const hour = new Date().getHours();
  const isOpen = hour >= 9 && hour < 21;
  badge.className = `status-badge ${isOpen ? 'online' : 'offline'}`;
  statusText.textContent = isOpen
    ? 'ONLINE | Cozinha Rodando'
    : 'OFFLINE | Faça seu Agendamento';
}

// Renderizar Produtos
function renderProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  container.innerHTML = PRODUCTS.map(product => `
    <div class="product-card" id="card-${product.id}">
      <div class="product-img-placeholder">
        <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">
      </div>
      <span class="product-id">${product.code}</span>
      <h3 class="product-name">${product.name}</h3>
      <p class="product-description">${product.description}</p>
      <p class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')} / un</p>
      
      <div class="qty-controls">
        <button class="btn-qty" data-id="${product.id}" data-action="minus" aria-label="Diminuir quantidade de ${product.name}">-</button>
        <span id="qty-${product.id}">0</span>
        <button class="btn-qty" data-id="${product.id}" data-action="plus" aria-label="Aumentar quantidade de ${product.name}">+</button>
      </div>
    </div>
  `).join('');

  // Eventos dos botões de quantidade
  container.querySelectorAll('.btn-qty').forEach(button => {
    button.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLButtonElement;
      const id = target.getAttribute('data-id');
      const action = target.getAttribute('data-action');
      const product = PRODUCTS.find(p => p.id === id);

      if (product) {
        if (action === 'plus') {
          cart.addItem(product);
        } else {
          cart.decreaseItem(product.id);
        }
        updateUI();
      }
    });
  });
}

// Renderizar Ingredientes e FAQ (API Docs)
function renderDocs() {
  const ingredientsContainer = document.getElementById('ingredients-list');
  if (ingredientsContainer) {
    ingredientsContainer.innerHTML = PRODUCTS.map(p => `
      <li><strong>${p.name}:</strong> ${p.ingredients}</li>
    `).join('');
  }

  const faqContainer = document.getElementById('faq-list');
  if (faqContainer) {
    faqContainer.innerHTML = FAQ_ITEMS.map(item => `
      <details class="faq-item">
        <summary>${item.question}</summary>
        <p>${item.answer}</p>
      </details>
    `).join('');
  }
}

// Renderizar Code Reviews (Depoimentos)
function renderReviews() {
  const container = document.getElementById('reviews-list');
  if (!container) return;

  container.innerHTML = REVIEWS.map(rev => `
    <article class="review-card">
      <div class="review-top">
        <span class="review-pr">${rev.pr}</span>
        <span class="review-stars">${rev.stars}</span>
      </div>
      <p class="review-comment">"${rev.comment}"</p>
      <div class="review-author">
        <span class="author-user">${rev.author}</span>
        <span class="author-role">${rev.role}</span>
      </div>
    </article>
  `).join('');
}

function renderRecommendation() {
  const select = document.getElementById('select-estresse') as HTMLSelectElement | null;
  const result = document.getElementById('resultado-recomendacao');
  if (!select || !result) return;

  const recommendations: Record<string, { productId: string; title: string; message: string }> = {
    baixo: {
      productId: 'beijinho',
      title: 'Modo zen ativado',
      message: 'Um beijinho suave para acompanhar um dia leve e sem sustos.'
    },
    medio: {
      productId: 'pacoca',
      title: 'Pausa estratégica recomendada',
      message: 'A paçoca traz sabor marcante para manter o foco sem perder o ritmo.'
    },
    alto: {
      productId: 'brigadeiro',
      title: 'Reforço de energia carregado',
      message: 'O brigadeiro é o clássico confiável para atravessar uma entrega apertada.'
    },
    critico: {
      productId: 'bichoDePe',
      title: 'Protocolo de emergência doce',
      message: 'O bicho de pé chega com sabor frutado e cor vibrante para virar o humor.'
    }
  };

  const recommendation = recommendations[select.value];
  const product = PRODUCTS.find(item => item.id === recommendation.productId);
  if (!product) return;

  result.innerHTML = `
    <div class="recommendation-box">
      <img src="${product.image}" alt="${product.name}" class="recommendation-image">
      <div class="recommendation-copy">
        <span class="recommendation-label">${recommendation.title}</span>
        <h3>${product.name}</h3>
        <p>${recommendation.message}</p>
        <span class="recommendation-price">R$ ${product.price.toFixed(2).replace('.', ',')} / un</span>
        <button class="btn-recommendation" data-product-id="${product.id}">Adicionar ao carrinho</button>
      </div>
    </div>
  `;
}

function bindAssistant() {
  const result = document.getElementById('resultado-recomendacao');
  document.getElementById('select-estresse')?.addEventListener('change', () => {
    renderRecommendation();
    result?.focus({ preventScroll: true });
  });
  document.getElementById('resultado-recomendacao')?.addEventListener('click', event => {
    const target = event.target as HTMLElement;
    const productId = target.getAttribute('data-product-id');
    if (!productId) return;

    const product = PRODUCTS.find(item => item.id === productId);
    if (product) {
      cart.addItem(product);
      target.textContent = 'Adicionado ✓';
    }
  });

  renderRecommendation();
}

function bindTerminal() {
  const input = document.getElementById('terminal-input') as HTMLInputElement | null;
  const output = document.getElementById('terminal-output');
  if (!input || !output) return;

  const writeOutput = (message: string) => {
    output.innerHTML = message;
  };

  input.addEventListener('keydown', event => {
    if (event.key !== 'Enter') return;

    const command = input.value.trim().toLowerCase();
    input.value = '';

    switch (command) {
      case 'ajuda':
      case 'help':
        writeOutput('Comandos disponíveis: <strong>cardapio</strong>, <strong>status</strong>, <strong>cupom</strong>, <strong>pedir</strong> e <strong>limpar</strong>.');
        break;
      case 'cardapio':
      case 'cardápio':
        writeOutput(PRODUCTS.map(product => `${product.name} - R$ ${product.price.toFixed(2).replace('.', ',')}`).join('<br>'));
        break;
      case 'status': {
        const hour = new Date().getHours();
        const isOpen = hour >= 9 && hour < 21;
        writeOutput(isOpen ? 'STATUS: cozinha online. Pedidos disponíveis até 21h.' : 'STATUS: cozinha offline. Faça seu agendamento pelo WhatsApp.');
        break;
      }
      case 'matirx':
      case 'matrix':
        writeOutput('Wake up, Neo... 🍫 A colher foi escolhida.');
        break;
      case 'cafe':
      case 'café':
        writeOutput('Hmm, não trabalhamos mais com isso rs ☕');
        break;
      case 'cupom':
        cart.applyCoupon('DEV10');
        writeOutput('Cupom <strong>DEV10</strong> aplicado. Desconto de 10% ativado no carrinho.');
        break;
      case 'pedir': {
        const paymentMethod = (document.getElementById('payment-method') as HTMLSelectElement | null)?.value || 'Pix';
        if (cart.getItemCount() === 0) {
          writeOutput('Seu carrinho está vazio. Adicione um doce antes de executar o pedido.');
        } else {
          cart.checkoutWhatsApp(paymentMethod);
          writeOutput('Pedido preparado. Abrindo o WhatsApp...');
        }
        break;
      }
      case 'limpar':
      case 'clear':
        writeOutput('Terminal pronto. Digite <strong>ajuda</strong> para começar.');
        break;
      case '':
        break;
      default:
        writeOutput('Comando não encontrado. Digite <strong>ajuda</strong>.');
    }
  });
}

// Atualizar Quantidades e Total
function updateUI() {
  PRODUCTS.forEach(p => {
    const qtyElem = document.getElementById(`qty-${p.id}`);
    if (qtyElem) {
      qtyElem.textContent = cart.getQuantity(p.id).toString();
    }
  });

  const totalElem = document.getElementById('cart-total');
  if (totalElem) {
    totalElem.textContent = `R$ ${cart.getTotal().toFixed(2).replace('.', ',')}`;
  }
}

function setCartOpen(isOpen: boolean) {
  const drawer = document.getElementById('cart-drawer');
  drawer?.classList.toggle('open', isOpen);
  drawer?.setAttribute('aria-hidden', String(!isOpen));
  document.getElementById('cart-overlay')?.classList.toggle('open', isOpen);
  document.body.classList.toggle('cart-open', isOpen);
  if (isOpen) {
    window.requestAnimationFrame(() => document.getElementById('btn-close-cart')?.focus());
  }
}

function bindCartControls() {
  document.getElementById('btn-open-cart')?.addEventListener('click', () => setCartOpen(true));
  document.getElementById('btn-close-cart')?.addEventListener('click', () => setCartOpen(false));
  document.getElementById('cart-overlay')?.addEventListener('click', () => setCartOpen(false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setCartOpen(false);
  });

  document.getElementById('cart-items-list')?.addEventListener('click', event => {
    const target = event.target as HTMLElement;
    const productId = target.getAttribute('data-id');
    if (!productId) return;

    if (target.classList.contains('cart-item-decrease')) {
      cart.decreaseItem(productId);
    } else if (target.classList.contains('cart-item-increase')) {
      const product = PRODUCTS.find(item => item.id === productId);
      if (product) cart.addItem(product);
    }
  });
}

// Evento de envio via WhatsApp
document.querySelector('.btn-checkout')?.addEventListener('click', () => {
  const paymentMethod = (document.getElementById('payment-method') as HTMLSelectElement)?.value || 'Pix';
  cart.checkoutWhatsApp(paymentMethod);
});

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
  initMatrixBackground();
  try {
    await initWasm();
  } catch {
    cart.setWasmAvailable(false);
  }
  typeWriter();
  checkStoreStatus();
  renderProducts();
  renderDocs();
  renderReviews();
  bindAssistant();
  bindTerminal();
  bindCartControls();
  updateUI();
});