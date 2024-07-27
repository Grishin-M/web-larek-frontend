import { Api } from './base';
import {
  IAppApi,
  IItem,
  ProductsApiResponse,
  IOrder,
  IOrderResult,
} from '../types';

export class appApi extends Api implements IAppApi {
  readonly cdn: string;

  constructor(cdn: string, url: string, options?: RequestInit) {
    super(url, options);
    this.cdn = cdn;
  }

  products(): Promise<IItem[]> {
    return this.get('/product').then((data: ProductsApiResponse<IItem>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image
      }))
    );
  }

  productItem(id: string): Promise<IItem> {
    return this.get(`/product/${id}`).then(
      (item: IItem) => ({
        ...item,
        image: this.cdn + item.image,
      })
    );
  }

  sendOrder(order: IOrder): Promise<IOrderResult> {
    return this.post(`/order`, order).then(
      (data: IOrderResult) => data
    );
  }

}