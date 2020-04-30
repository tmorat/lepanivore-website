import { cloneDeep, isEmpty } from 'lodash';
import { ClosingDay } from './closing-day';
import { ClosingPeriodInterface } from './closing-period.interface';
import { NewOrderCommand } from './commands/new-order-command';
import { UpdateOrderCommand } from './commands/update-order-command';
import { DELIVERY_DAY, MAXIMUM_DAY_FOR_DELIVERY_SAME_WEEK, MAXIMUM_HOUR_FOR_DELIVERY_SAME_WEEK } from './delivery-constraints';
import { InvalidOrderError } from './invalid-order.error';
import { OrderType } from './order-type';
import { OrderInterface } from './order.interface';
import { NUMBER_OF_MINIMUM_DAYS_FOR_A_PICK_UP_ORDER } from './pick-up-constraints';
import { Product } from './product';
import { ProductIdWithQuantity, ProductWithQuantity } from './product-with-quantity';
import { ProductInterface } from './product.interface';
import { OrderId } from './type-aliases';

export class Order implements OrderInterface {
  static factory: OrderFactoryInterface = {
    create(command: NewOrderCommand, activeProducts: ProductInterface[], closingPeriods: ClosingPeriodInterface[]): Order {
      return new Order({} as OrderInterface, command, activeProducts, closingPeriods);
    },
    copy(order: OrderInterface): Order {
      return new Order(order, {} as NewOrderCommand, [], []);
    },
  };

  private static EMAIL_REGEX: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  id: OrderId;
  clientName: string;
  clientPhoneNumber: string;
  clientEmailAddress: string;
  products: ProductWithQuantity[];
  type: OrderType;
  pickUpDate?: Date;
  deliveryDate?: Date;
  deliveryAddress?: string;
  note?: string;

  private constructor(order: OrderInterface, command: NewOrderCommand, activeProducts: ProductInterface[], closingPeriods: ClosingPeriodInterface[]) {
    if (!isEmpty(order)) {
      this.copy(order);
    } else {
      this.id = undefined;

      this.bindContactDetails(command);
      this.bindProductSelection(command, activeProducts);
      this.bindOrderTypeSelection(command, closingPeriods);
      this.note = command.note;
    }
  }

  private static assertClientNameIsValid(clientName: string): void {
    if (isEmpty(clientName)) {
      throw new InvalidOrderError('client name must be defined');
    }
  }

  private static assertClientPhoneNumberIsValid(clientPhoneNumber: string): void {
    if (isEmpty(clientPhoneNumber)) {
      throw new InvalidOrderError('client phone number must be defined');
    }
  }

  private static assertClientEmailAddressIsValid(clientEmailAddress: string): void {
    if (isEmpty(clientEmailAddress)) {
      throw new InvalidOrderError('client email address must be defined');
    }
    if (!this.EMAIL_REGEX.test(clientEmailAddress)) {
      throw new InvalidOrderError('invalid client email address');
    }
  }

  private static assertTypeIsValid(type: OrderType): void {
    if (isEmpty(type)) {
      throw new InvalidOrderError('order type must be defined');
    }
    if (!Object.keys(OrderType).includes(type)) {
      throw new InvalidOrderError('unknown order type');
    }
  }

  private static assertProductsAreValid(products: ProductIdWithQuantity[]): void {
    if (isEmpty(products)) {
      throw new InvalidOrderError('an order must have at least one product');
    }

    const numberOfProductsHavingANegativeOrZeroQuantity: number = products.filter(
      (productWithQuantity: ProductIdWithQuantity) => productWithQuantity.quantity < 1
    ).length;
    if (numberOfProductsHavingANegativeOrZeroQuantity > 0) {
      throw new InvalidOrderError('a product quantity must be positive');
    }
  }

  private static assertpickUpDateIsValid(type: OrderType, closingPeriods: ClosingPeriodInterface[], pickUpDate?: Date): void {
    if (type === OrderType.PICK_UP) {
      if (!pickUpDate) {
        throw new InvalidOrderError('a pick-up date must be defined when order type is pick-up');
      }

      if (pickUpDate.getTime() < this.getCurrentDatePlusDays(NUMBER_OF_MINIMUM_DAYS_FOR_A_PICK_UP_ORDER).getTime()) {
        throw new InvalidOrderError('pick-up date has to be at least two days after now');
      }

      if (Object.values(ClosingDay).includes(pickUpDate.getDay())) {
        throw new InvalidOrderError('pick-up date must be between a Tuesday and a Saturday');
      }

      closingPeriods.forEach((closingPeriod: ClosingPeriodInterface) => {
        if (pickUpDate.getTime() >= closingPeriod.start.getTime() && pickUpDate.getTime() <= closingPeriod.end.getTime()) {
          throw new InvalidOrderError('pick-up date must be outside closing periods');
        }
      });
    }
  }

  private static assertDeliveryAddressIsValid(type: OrderType, deliveryAddress?: string): void {
    if (type === OrderType.DELIVERY && isEmpty(deliveryAddress)) {
      throw new InvalidOrderError('a delivery address must be defined when order type is delivery');
    }
  }

  private static assertDeliveryDateIsValid(type: OrderType, closingPeriods: ClosingPeriodInterface[], deliveryDate?: Date): void {
    if (type === OrderType.DELIVERY) {
      if (!deliveryDate) {
        throw new InvalidOrderError('a delivery date must be defined when order type is delivery');
      }
      const now: Date = new Date();

      if (deliveryDate.getTime() < now.getTime()) {
        throw new InvalidOrderError('delivery date has to be in the future');
      }

      closingPeriods.forEach((closingPeriod: ClosingPeriodInterface) => {
        if (deliveryDate.getTime() >= closingPeriod.start.getTime() && deliveryDate.getTime() <= closingPeriod.end.getTime()) {
          throw new InvalidOrderError('delivery date must be outside closing periods');
        }
      });

      if (deliveryDate.getDay() !== DELIVERY_DAY) {
        throw new InvalidOrderError('delivery date has to be a Thursday');
      }

      const numberOfDaysBetweenDeliveryDateAndNow: number = (deliveryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      const isDeliveryDateIsInTheNextSixDays: boolean = numberOfDaysBetweenDeliveryDateAndNow <= 6;
      if (
        isDeliveryDateIsInTheNextSixDays &&
        (now.getDay() > MAXIMUM_DAY_FOR_DELIVERY_SAME_WEEK ||
          (now.getDay() === MAXIMUM_DAY_FOR_DELIVERY_SAME_WEEK && now.getHours() >= MAXIMUM_HOUR_FOR_DELIVERY_SAME_WEEK))
      ) {
        throw new InvalidOrderError('delivery date has to be one of the next available Thursday');
      }
    }
  }

  private static toProductWithQuantity(productIdWithQuantity: ProductIdWithQuantity, activeProducts: ProductInterface[]): ProductWithQuantity {
    const foundProduct: ProductInterface | undefined = activeProducts.find((product: Product) => product.id === productIdWithQuantity.productId);
    if (!foundProduct) {
      throw new InvalidOrderError(`product with id ${productIdWithQuantity.productId} not found`);
    }

    return { product: foundProduct, quantity: productIdWithQuantity.quantity } as ProductWithQuantity;
  }

  private static getCurrentDatePlusDays(numberOfDaysToAdd: number): Date {
    const date: Date = new Date();
    date.setDate(date.getDate() + numberOfDaysToAdd);

    return date;
  }

  updateWith(command: UpdateOrderCommand, activeProducts: ProductInterface[], closingPeriods: ClosingPeriodInterface[]): void {
    if (this.id !== command.orderId) {
      throw new InvalidOrderError('existing order id does not match order id in command');
    }

    this.bindProductSelection(command, activeProducts);
    this.bindOrderTypeSelection(command, closingPeriods);
    this.note = command.note;
  }

  private copy(otherOrder: OrderInterface): void {
    const deepCloneOfOtherOrder: OrderInterface = cloneDeep(otherOrder);
    for (const field in deepCloneOfOtherOrder) {
      if (deepCloneOfOtherOrder.hasOwnProperty(field)) {
        this[field] = deepCloneOfOtherOrder[field];
      }
    }
  }

  private bindContactDetails(command: NewOrderCommand): void {
    Order.assertClientNameIsValid(command.clientName);
    Order.assertClientPhoneNumberIsValid(command.clientPhoneNumber);
    Order.assertClientEmailAddressIsValid(command.clientEmailAddress);

    this.clientName = command.clientName;
    this.clientPhoneNumber = command.clientPhoneNumber;
    this.clientEmailAddress = command.clientEmailAddress;
  }

  private bindProductSelection(command: NewOrderCommand | UpdateOrderCommand, activeProducts: ProductInterface[]): void {
    Order.assertProductsAreValid(command.products);

    this.products = command.products.map((productIdWithQuantity: ProductIdWithQuantity) =>
      Order.toProductWithQuantity(productIdWithQuantity, activeProducts)
    );
  }

  private bindOrderTypeSelection(command: NewOrderCommand | UpdateOrderCommand, closingPeriods: ClosingPeriodInterface[]): void {
    Order.assertTypeIsValid(command.type);
    Order.assertpickUpDateIsValid(command.type, closingPeriods, command.pickUpDate);
    Order.assertDeliveryDateIsValid(command.type, closingPeriods, command.deliveryDate);
    Order.assertDeliveryAddressIsValid(command.type, command.deliveryAddress);

    this.type = command.type;
    if (this.type === OrderType.PICK_UP) {
      this.pickUpDate = command.pickUpDate;
      this.deliveryDate = undefined;
      this.deliveryAddress = undefined;
    } else {
      this.pickUpDate = undefined;
      this.deliveryDate = command.deliveryDate;
      this.deliveryAddress = command.deliveryAddress;
    }
  }
}

export interface OrderFactoryInterface {
  create(command: NewOrderCommand, activeProducts: ProductInterface[], closingPeriods: ClosingPeriodInterface[]): Order;
  copy(order: OrderInterface): Order;
}
