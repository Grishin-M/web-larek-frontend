import { Component, EventEmitter } from '../base';
import { createElement, ensureElement } from '../../utils';
import { IShoppingCart } from '../../types';

export class ShoppingCart extends Component<IShoppingCart> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = this.container.querySelector('.basket__price');
    this._button = this.container.querySelector('.basket__button');

    if (this._button) {
      this._button.addEventListener('click', () => {
        events.emit('order:open');
      });
    }

    this.items = [];
    this._button.disabled = true;
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this._list.replaceChildren(...items);
    } else {
      this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
        textContent: 'Корзина пуста'
      }));
    }
  }

  set total(total: number) {
    this.setText(this._total, `${total.toString()} синапсов`);
  }


  isDisabled(disabled: boolean) {
    this._button.disabled = disabled;
  }
}