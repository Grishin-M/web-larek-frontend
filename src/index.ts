import './scss/styles.scss';
import { EventEmitter } from './components/base';
import { Modal, Success, ShoppingCart } from './components/common';
import {
  AppData,
  CatalogChangeEvent,
  Product,
  appApi,
  Payment,
  Contact,
  Card,
  Page,
} from './components';
import {
  API_URL,
  CDN_URL,
  PaymentMethods,
  cloneTemplate,
  ensureElement,
} from './utils';
import { IOrder, IPaymentForm, IUser } from './types';

const events = new EventEmitter();
const api = new appApi(CDN_URL, API_URL);

const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardShoppingCartTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const shoppingCartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const appData = new AppData({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const shoppingCart = new ShoppingCart(cloneTemplate(shoppingCartTemplate), events);
const delivery = new Payment(cloneTemplate(orderTemplate), events, {
  onClick: (event: Event) => events.emit('payment:toggle', event.target),
});
const contact = new Contact(cloneTemplate(contactsTemplate), events);

api.products()
  .then(appData.setCatalog.bind(appData))
  .catch(error => {
    console.log(error);
  });

events.on<CatalogChangeEvent>('product:change', () => {
  page.catalog = appData.catalog.map((item) => {
    const card = new Card(cloneTemplate(catalogTemplate), {
      onClick: () => events.emit('preview:select', item),
    });
    return card.render({
      title: item.title,
      image: item.image,
      category: item.category,
      price: item.price,
    });
  });
});



events.on('preview:change', (item: Product) => {
  const card = new Card(cloneTemplate(previewTemplate), {
    onClick: () => {
      events.emit('card:toggle', item);
      card.btnText = (appData.shoppingCart.indexOf(item) < 0) ? 'Купить' : 'Удалить из корзины'
    }
  });
  modal.render({
    content: card.render({
      title: item.title,
      description: item.description,
      image: item.image,
      price: item.price,
      category: item.category,
      btnText: (appData.shoppingCart.indexOf(item) < 0) ? 'Купить' : 'Удалить из корзины'
    })
  })
})

events.on('order:open', () => {
  const { payment, address } = appData.order
  modal.render({
    content: delivery.render({
      payment: payment,
      address: address,
      isValid: address.length && true,
      errors: [appData.formErrors.address],
    })
  })
  appData.order.items = appData.shoppingCart.map((item) => item.id);
})

events.on('formErrors:change', (errors: Partial<IOrder>) => {
  const { payment, address, email, phone } = errors;
  delivery.isValid = !payment && !address;
  contact.isValid = !email && !phone;
  delivery.errors = Object.values({ payment, address })
    .filter(i => !!i).join('; ');
  contact.errors = Object.values({ phone, email })
    .filter(i => !!i).join('; ');
});

events.on('contacts:submit', () => {
  api
    .sendOrder(appData.order)
    .then((result) => {
      appData.clearShoppingCart();
      appData.clearOrder();

      const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => {
          modal.close();
        },
      });
      success.total = result.total.toString();

      modal.render({
        content: success.render({}),
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

events.on('shoppingCart:open', () => {
  modal.render({
    content: shoppingCart.render({})
  })
})

events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
});

events.on('delivery:ready', () => {
  delivery.isValid = true;
})

events.on('contact:ready', () => {
  contact.isValid = true;
})

events.on('counter:changed', () => {
  page.counter = appData.shoppingCart.length;
})

events.on('payment:toggle', (target: HTMLElement) => {
  if (!target.classList.contains('button_alt-active')) {
    delivery.toggleButton();
    appData.order.payment = PaymentMethods[target.getAttribute('name')];
  }
})

events.on('shoppingCart:changed', (items: Product[]) => {
  shoppingCart.items = items.map((item, index) => {
    const card = new Card(cloneTemplate(cardShoppingCartTemplate), {
      onClick: () => {
        events.emit('card:delete', item)
      }
    });
    return card.render({
      index: (index + 1).toString(),
      title: item.title,
      price: item.price,
    })
  })
  const total = items.reduce((total, item) => total + item.price, 0)
  shoppingCart.total = total
  appData.order.total = total;
  const disabled = total === 0;
  shoppingCart.isDisabled(disabled);
})

events.on('card:toggle', (item: Product) => {
  if (appData.shoppingCart.indexOf(item) < 0) {
    events.emit('card:add', item);
  } else {
    events.emit('card:delete', item);
  }
});

events.on('card:delete', (item: Product) => appData.removeFromShoppingCart(item));

events.on('card:add', (item: Product) => appData.addItemToShoppingCart(item));

events.on('preview:select', (item: Product) => appData.setPreview(item));

events.on('order:submit', () => {
  const { phone, email } = appData.order
  const { email: isErrorEmail, phone: isErrorPhone } = appData.formErrors
  modal.render({
    content: contact.render({
      email: email,
      phone: phone,
      isValid: appData.order.email.length && appData.order.phone && true,
      errors: isErrorEmail ? [isErrorEmail] : isErrorPhone ? [isErrorPhone] : [],
    }),
  });
});

events.on(
  /^order\..*:change/,
  (data: { field: keyof IPaymentForm; value: string }) => {
    appData.setInfoDeliveryField(data.field, data.value);
  }
);

events.on(
  /^contacts\..*:change/,
  (data: { field: keyof IUser; value: string }) => {
    appData.setInfoContactField(data.field, data.value);
  }
);