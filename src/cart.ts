import type { Product, CartItem } from './types';
import { calcular_desconto } from './wasm/crate_engine.js';

export class CartManager {
  private readonly storageKey = 'algoritmo-doce-cart';
  private items: CartItem[] = [];
  private activeCoupon: string = '';
  private wasmAvailable = true;

  constructor() {
    let savedItems: string | null = null;
    try {
      savedItems = window.localStorage.getItem(this.storageKey);
    } catch {
      return;
    }
    if (!savedItems) return;

    try {
      const parsedItems = JSON.parse(savedItems) as CartItem[];
      this.items = parsedItems.filter(item => item.quantity > 0 && item.product?.id);
    } catch {
      try { window.localStorage.removeItem(this.storageKey); } catch { }
    }
  }

  private save() {
    try {
      window.localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch {
      // O carrinho continua funcionando sem persistência local.
    }
  }

  public setWasmAvailable(isAvailable: boolean) {
    this.wasmAvailable = isAvailable;
  }

  public addItem(product: Product) {
    const existing = this.items.find(item => item.product.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({ product, quantity: 1 });
    }
    this.save();
    this.render();
  }

  public removeItem(productId: string) {
    this.items = this.items.filter(item => item.product.id !== productId);
    this.save();
    this.render();
  }

  public decreaseItem(productId: string) {
    const item = this.items.find(currentItem => currentItem.product.id === productId);
    if (!item) return;

    if (item.quantity === 1) {
      this.removeItem(productId);
      return;
    }

    item.quantity -= 1;
    this.save();
    this.render();
  }

  public updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    const item = this.items.find(i => i.product.id === productId);
    if (item) {
      item.quantity = quantity;
    }
    this.save();
    this.render();
  }

  public applyCoupon(coupon: string) {
    this.activeCoupon = coupon.trim().toUpperCase();
    this.render();
  }

  public getSubtotal(): number {
    return this.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  public getTotal(): number {
    const subtotal = this.getSubtotal();
    if (this.wasmAvailable) {
      try {
        return calcular_desconto(subtotal, this.activeCoupon);
      } catch {
        this.wasmAvailable = false;
      }
    }

    if (this.activeCoupon === 'DEV10') return subtotal * 0.9;
    if (this.activeCoupon === 'GLICOSE20') return subtotal * 0.8;
    return subtotal;
  }

  public getItemCount(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  public getQuantity(productId: string): number {
    return this.items.find(item => item.product.id === productId)?.quantity ?? 0;
  }

  public checkoutWhatsApp(paymentMethod: string): void {
    if (this.items.length === 0) {
      window.alert('Adicione pelo menos um produto ao carrinho.');
      return;
    }

    const order = this.items
      .map(item => {
        const itemTotal = item.product.price * item.quantity;
        return `• ${item.quantity}x ${item.product.name} (R$ ${itemTotal.toFixed(2).replace('.', ',')})`;
      })
      .join('\n');
    const message = `*--- NOVO PEDIDO: ALGORITMO DOCE ---*\n\n*ITENS DO PEDIDO:*\n${order}\n\n*VALOR TOTAL:* R$ ${this.getTotal().toFixed(2).replace('.', ',')}\n*FORMA DE PAGAMENTO:* ${paymentMethod}\n\n_Aguardando confirmação para preparo!_`;
    window.open(`https://wa.me/5511979865999?text=${encodeURIComponent(message)}`, '_blank');
  }

  public render() {
    const cartListContainer = document.getElementById('cart-items-list');
    const badgeCount = document.getElementById('cart-badge');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    const discountRow = document.getElementById('discount-row');
    const discountAmountEl = document.getElementById('discount-amount');

    if (!cartListContainer) return;

    // Atualiza contador do badge
    if (badgeCount) badgeCount.innerText = this.getItemCount().toString();

    // Renderiza lista do carrinho
    if (this.items.length === 0) {
      cartListContainer.innerHTML = `<div class="empty-cart">Seu carrinho está vazio 🍫</div>`;
    } else {
      cartListContainer.innerHTML = this.items.map(item => `
        <div class="cart-item">
          <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-img">
          <div class="cart-item-info">
            <h4>${item.product.name}</h4>
            <span class="cart-item-price">R$ ${item.product.price.toFixed(2)}</span>
          </div>
          <div class="cart-item-actions">
            <button class="btn-qty cart-item-decrease" data-id="${item.product.id}" aria-label="Diminuir ${item.product.name}">-</button>
            <span>${item.quantity}</span>
            <button class="btn-qty cart-item-increase" data-id="${item.product.id}" aria-label="Aumentar ${item.product.name}">+</button>
          </div>
        </div>
      `).join('');
    }

    const subtotal = this.getSubtotal();
    const total = this.getTotal();
    const discount = subtotal - total;

    if (subtotalEl) subtotalEl.innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    if (totalEl) totalEl.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;

    if (discountRow && discountAmountEl) {
      if (discount > 0) {
        discountRow.style.display = 'flex';
        discountAmountEl.innerText = `- R$ ${discount.toFixed(2).replace('.', ',')}`;
      } else {
        discountRow.style.display = 'none';
      }
    }
  }
}