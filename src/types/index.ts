export interface IAppApi {
  products(): Promise<IItem[]>;
  productItem(id: string): Promise<IItem>;
  sendOrder(order: IOrder): Promise<IOrderResult>;
}

export interface IItem {
  id: string;
  image: string;
  category: string;
  title: string;
  description: string;
  price: number | null;
}

export interface IOrderResult {
  id: string;
  total: number | null;
}

export type ApiMethods = 'POST' | 'PUT' | 'DELETE';

export type ProductsApiResponse<Type> = {
  total: number,
  items: Type[]
};

export type EventName = string | RegExp;
export type Subscriber = Function;
export type EmitterEvent = {
  eventName: string,
  data: unknown
};

export interface IEvents {
  on<T extends object>(event: EventName, callback: (data: T) => void): void;
  emit<T extends object>(event: string, data?: T): void;
  trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

export interface IFormState {
  isValid: boolean;
  errors: string[];
}

export interface IModalData {
  content: HTMLElement;
}

export interface IShoppingCart {
  items: HTMLElement[];
  total: number;
}

export interface ISuccess {
  total: number;
}

export interface ISuccessActions {
  onClick: () => void;
}

export interface IState {
  catalog: IItem[];
  preview: string | null;
  shoppingCart: IItem[];
  formErrors: FormErrors;
  contact: IUser | null;
  order: IOrder | null;
  payment: IPaymentForm | null;
}

export interface IOrder extends IPaymentForm, IUser {
  total: number | null;
  items: string[];
}

export interface IPaymentForm {
  payment: string;
  address: string;
}

export interface IUser {
  email: string;
  phone: string;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface ICard extends IItem {
  index?: string;
  btnText?: string;
}

export interface IActions {
  onClick: (event: MouseEvent) => void;
}

export interface IPage {
  counter: number | null;
  catalog: HTMLElement[];
  locked: boolean;
}