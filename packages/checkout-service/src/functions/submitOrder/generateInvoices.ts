import { Invoice, OrderProduct } from '@shared/types';

function calculateProductTotal(
  product: OrderProduct,
  quantity: number
): number {
  const discountValue =
    ((product.discount || 0) / 100) * product.price * quantity;
  const vatValue = Math.round(product.vatRate * product.price * quantity) / 100;
  return product.price * quantity + vatValue - discountValue;
}

function createInvoice(): Invoice {
  return {
    products: [],
    subTotal: 0,
    vatValue: 0,
    total: 0,
  };
}

export function generateInvoices(products: OrderProduct[]): Invoice[] {
  const invoices: Invoice[] = [];
  let currentInvoice = createInvoice();

  // Sort products by total cost including VAT in descending order.
  products.sort(
    (a, b) => b.price * (1 + b.vatRate / 100) - a.price * (1 + a.vatRate / 100)
  );

  for (const product of products) {
    while (product.quantity > 0) {
      const totalProductCost = calculateProductTotal(product, 1);

      if (product.price > 50000) {
        invoices.push({
          products: [{ ...product, quantity: 1 }],
          subTotal: product.price,
          vatValue: Math.round(product.vatRate * product.price) / 100,
          total: totalProductCost,
        });
        product.quantity -= 1;
      } else {
        if (currentInvoice.total + totalProductCost <= 50000) {
          const existingProduct = currentInvoice.products.find(
            p => p.id === product.id
          );
          if (existingProduct) {
            existingProduct.quantity += 1;
          } else {
            currentInvoice.products.push({ ...product, quantity: 1 });
          }

          currentInvoice.subTotal += product.price;
          currentInvoice.vatValue +=
            Math.round(product.vatRate * product.price) / 100;
          currentInvoice.total += totalProductCost;
          product.quantity -= 1;
        } else {
          invoices.push(currentInvoice);
          currentInvoice = createInvoice();
        }
      }
    }
  }

  if (currentInvoice.products.length > 0) {
    invoices.push(currentInvoice);
  }

  return invoices;
}
