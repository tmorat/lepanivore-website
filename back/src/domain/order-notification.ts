import * as os from 'os';
import { Order } from './order';
import { OrderNotificationInterface } from './order-notification.interface';
import { OrderType } from './order-type';
import { ProductWithQuantity } from './product-with-quantity';

export class OrderNotification implements OrderNotificationInterface {
  recipient: string;
  subject: string;
  body: string;

  constructor(order: Order) {
    this.recipient = order.clientEmailAddress;
    this.subject = `Boulangerie Le Panivore : votre commande #${order.id}`;
    this.body = OrderNotification.buildBody(order);
  }

  private static buildBody(order: Order): string {
    const heading: string = `Bonjour,${os.EOL}${os.EOL}Voici le récapitulatif de votre commande :`;
    const orderId: string = `- Numéro de commande: ${order.id}`;
    const name: string = `- Votre nom: ${order.clientName}`;
    const phoneNumber: string = `- Votre numéro de téléphone: ${order.clientPhoneNumber}`;
    const orderType: string = `- Type de commande: ${order.type === OrderType.DELIVERY ? 'Livraison' : 'Cueillette'}`;
    const orderTypeDetails: string = `- ${
      order.type === OrderType.DELIVERY
        ? 'Adresse de livraison : ' + order.deliveryAddress
        : 'Date de cueillette : ' + order.pickUpDate.toISOString().split('T')[0]
    }`;
    const products: string =
      `- Produits :${os.EOL}` +
      order.products
        .map((productWithQuantity: ProductWithQuantity) => {
          return `  - ${productWithQuantity.product.name} (${productWithQuantity.product.price}$) : ${productWithQuantity.quantity}`;
        })
        .join(os.EOL);
    const totalPrice: string = `- Prix total : ${OrderNotification.getTotalPrice(order.products)}$`;
    const thanks: string = "Merci d'avoir commandé et à très bientôt !";

    return `${heading}${os.EOL}${orderId}${os.EOL}${name}${os.EOL}${phoneNumber}${os.EOL}${orderType}${os.EOL}${orderTypeDetails}${os.EOL}${products}${os.EOL}${totalPrice}${os.EOL}${os.EOL}${thanks}`;
  }

  private static getTotalPrice(products: ProductWithQuantity[]): number {
    let totalPrice: number = 0;
    products.forEach((productWithQuantity: ProductWithQuantity) => {
      totalPrice += productWithQuantity.product.price * productWithQuantity.quantity;
    });

    return Math.round((totalPrice + Number.EPSILON) * 100) / 100;
  }
}
