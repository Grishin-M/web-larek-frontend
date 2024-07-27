import { IEvents, IPage } from '../types';
import { ensureElement } from '../utils';
import { Component } from './base';

export class Page extends Component<IPage> {
  protected _catalog: HTMLElement;
  protected _counter: HTMLElement;
  protected _shoppingCart: HTMLElement;
  protected _wrapper: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._catalog = ensureElement<HTMLElement>('.gallery');
    this._counter = ensureElement<HTMLElement>('.header__basket-counter');
    this._shoppingCart = ensureElement<HTMLElement>('.header__basket');
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper');

    this._shoppingCart.addEventListener('click', () => {
      this.events.emit('shoppingCart:open');
    });
  }

  set counter(value: number) {
    this.setText(this._counter, String(value));
  }

  set catalog(items: HTMLElement[]) {
    this._catalog.replaceChildren(...items);
  }

  set locked(value: boolean) {
    if (value) {
      this._wrapper.classList.add('page__wrapper_locked');
    } else {
      this._wrapper.classList.remove('page__wrapper_locked');
    }
  }
}