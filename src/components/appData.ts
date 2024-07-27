import { Model } from './base';
import {
  IItem,
  IOrder,
  IPaymentForm,
  IUser,
  IState,
  FormErrors,
} from '../types';

export type CatalogChangeEvent = {
  catalog: Product[]
};

export class Product extends Model<IItem> {
  id: string;
  title: string;
  price: number | null;
  description: string;
  category: string;
  image: string;
}

export class AppData extends Model<IState> {
  catalog: IItem[];
  shoppingCart: Product[] = [];
  order: IOrder = {
    payment: 'online',
    address: '',
    email: '',
    phone: '',
    total: 0,
    items: []
  };
  preview: string | null;
  formErrors: FormErrors = {};

  setPreview(item: Product) {
    this.preview = item.id;
    this.emitChanges('preview:change', item);
  }

  setCatalog(items: IItem[]) {
    this.catalog = items;
    this.emitChanges('product:change', { catalog: this.catalog });
  }

  clearOrder() {
    this.order = {
      items: [],
      total: 0,
      address: '',
      email: '',
      phone: '',
      payment: 'online',
    }
  }

  updateShoppingCart() {
    this.emitChanges('shoppingCart:changed', this.shoppingCart);
    this.emitChanges('counter:changed', this.shoppingCart);
  }

  clearShoppingCart() {
    this.shoppingCart = [];
    this.updateShoppingCart();
  }

  addItemToShoppingCart(item: Product) {
    if (this.shoppingCart.indexOf(item) < 0) {
      this.shoppingCart.push(item);
      this.updateShoppingCart();
    }
  }

  removeFromShoppingCart(item: Product) {
    this.shoppingCart = this.shoppingCart.filter((it) => it != item);
    this.updateShoppingCart();
  }

  setInfoDeliveryField(field: keyof IPaymentForm, value: string) {
    this.order[field] = value;
    if (this.validateFormOrder()) {
      this.events.emit('delivery:ready', this.order);
    }
  }

  setInfoContactField(field: keyof IUser, value: string) {
    this.order[field] = value;
    if (this.validateFormUser()) {
      this.events.emit('contact:ready', this.order);
    }
  }

  validateFormOrder() {
    const errors: typeof this.formErrors = {};

    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес'
    }

    if (!this.order.payment) {
      errors.payment = 'Необходимо указать тип оплаты';
    }

    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  validateFormUser() {
    const errors: typeof this.formErrors = {};
    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }

    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }
}