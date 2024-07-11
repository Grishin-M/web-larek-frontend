export interface IWebLarekAPI {
  getProductList(): Promise<IProduct[]>;
  getProductItem(id: string): Promise<IProduct>;
  sendOrder(order: IOrder): Promise<IOrderResult>;
}

export interface IComponent<NodeType extends HTMLElement, DataType extends object> {
  render(data: DataType): NodeType;
  remove(): this;
  show(): this;
  hide(): this;
  setText(value: string): this;
  setLink(value: string): this;
  setImage(src: string, alt: string): this;
  setValue(value: string): this;
  getValue(): string;
  isValid(): boolean;
  addClass(className: string): this;
  removeClass(className: string): this;
  hasClass(className: string): boolean;
  append(element: HTMLElement): this;
  prepend(element: HTMLElement): this;
  bem(element?: string, modifier?: string): string;
  clone(template: string, data?: DataType, name?: string): any;
  mount(selectorElement: HTMLElement | string, data?: any, name?: string): any;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IModal {
  container: HTMLElement;
  content: HTMLElement;
  closeButton: HTMLButtonElement;
  setContent(): void;
  open(): void;
  close(): void;
}

export interface IForm {
  container: HTMLElement;
  submit: HTMLButtonElement;
  errors: HTMLElement;
  isValid(): boolean;
  setErrors(error: string): void;
  clear(): void;
}

export interface IBasket {
  title: string;
  orderList: HTMLElement[];
  total: string;

  setTitle(title: string): void;
  setOrders(orders: HTMLElement[]): void;
  remove(order: HTMLElement): void;
  getTotal(): string;
  accept(): void;
}

export interface ICardData {
  cardArray: IProduct[]
  getCardInformation(id: string): IProduct;
}

export interface IBasketData {
  total: number;
  setBasketItems(basketItems: IProduct[]): void;
  clear(): void;
}

export interface IOrder {
  items: IProduct[];
  total: number;
  payment: string;
  email: string;
  phone: string;
  address: string;
}

export interface IOrderResult {
  id: string;
  total: number | null;
}
