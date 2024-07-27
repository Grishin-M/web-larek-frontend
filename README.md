# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

** Архитектура проекта и реализация классов сделаны на основе проекта "Оно тебе надо" **  (https://github.com/yandex-praktikum/ono-tebe-nado-oop)<br>

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:

- слой представления, отвечает за отображение данных на странице
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных

---

### Базовый код
#### Класс `Api`
Предоставляет основные возможности для отправки запросов. Конструктор принимает основной адрес сервера и опциональный объект с заголовками запросов.
constructor(url, options) - конструктор, принимающий на вход базовый URL и общие параметры запросов
##### Свойства класса:
- readonly url - основной URL для отправки запросов к API
- protected options - базовые настройки запросов
##### Реализуемые методы:
- get(uri) - выполняет GET-запросы к указанному URI и возвращает Promise с типизированным ответом от сервера
- post(uri, data, method) - отправляет POST-запрос с данными на указанный URI и возвращает Promise с типизированным ответом от сервера
##### Используемые типы данных:
- ApiMethods - тип данных, описывающий возможные методы HTTP-запросов для POST-запросов
```typescript
type ApiMethods = 'POST' | 'PUT' | 'DELETE'
```

#### Класс `EventEmitter`
Брокер событий предоставляет возможность отправлять события и регистрироваться на события, происходящие в системе. Этот класс используется в презентаторе для обработки событий и в слоях приложения для создания событий.
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
constructor - конструктор
##### Свойства класса:
- \_events - приватное свойство, хранящее множество подписчиков для каждого события.

##### Реализуемые методы:
- on - устанавливает обработчик на событие
- off - снимает обработчик с события
- emit - иницирует событие с указанным именем и  данными
- onAll - используется, чтобы слушать все события
- offAll - сбрасывает все обработчики событий
- trigger - делает коллбек триггер, генерирующий событие при вызове

##### Используемые типы данных:
```typescript
type EventName = string | RegExp
```
```typescript
type Subscriber = Function
```
```typescript
interface IEvents {
  on<T extends object>(event: EventName, callback: (data: T) => void): void;
  emit<T extends object>(event: string, data?: T): void;
  trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
```
### Класс `appApi`
 Предназначен для работы с данными с сервера API WebLarek. Он обрабатывает HTTP-запросы и ответы от сервера, наследуя функциональность от базового класса Api. Конструктор принимает на вход базовый URL для API и CDN для изображений.
#### Свойства класса:
 - readonly cdn - URL для загрузки изображений товаров
##### Реализуемые методы:
- products() - получает список всех продуктов с сервера
- productItem(id) - получает информацию о продукте по его `id`
- sendOrder(order) - отправляет информацию о заказе на сервер и получает результат
##### Используемые типы данных:
```typescript
interface IAppApi {
  products(): Promise<IItem[]>;
  productItem(id: string): Promise<IItem>;
  sendOrder(order: IOrder): Promise<IOrderResult>;
}
```
```typescript
interface IItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```
```typescript
interface IOrder extends IPaymentForm, IUser {
  total: number | null;
  items: string[];
}
```
```typescript
interface IOrderResult {
  id: string;
  total: number | null;
}
```
```typescript
type ProductsApiResponse<Type> = {
  total: number,
  items: Type[]
}
```


#### Класс `Component`
Абстрактный класс `Component` предназначен для управления разметкой и используется для создания компонентов пользовательского интерфейса.

##### Реализуемые методы:
- toggleClass(element, className, force?) - переключает класс у элемента
- protected setText(element, value) - устанавливает текстовое содержимое элемента
- setDisabled(element, state) -  устанавливает или удаляет атрибут `disabled`
- protected setHidden(element) - cкрывает элемент
- protected setVisible(element) - делает элемент видимым
- protected setImage(element, src, alt?) - yстанавливает изображение и альтернативный текст для него
- render(data?) - рендер компонента

----

### Класс `Model`
Класс Model — это абстрактный класс, предназначенный для обработки данных и используемый как для их представления, так и для работы с ними.
`constructor(data, events)` - принимает исходные данные модели (data) и объект событий (events) для уведомления об изменениях модели.
##### Реализуемые методы:
- `emitChanges(event, payload?)` - сообщает всем об изменении модели.
##### Используемые типы данных:
- `IEvents` - интерфейс для работы с событиями;
- `T` - обобщенный тип данных, представляющий структуру данных модели.

## Классы для работы с данными
#### Класс `AppData`
Обеспечивает работу с данными в приложении.
`constructor(data)` - конструктор, на вход принимает исходное состояние приложения
##### Свойства класса:
- catalog - массив товаров в каталоге
- shoppingCart - массив товаров в корзине
- order - данные о заказе
- preview  - товар для предпросмотра
- formErrors - ошибки форм
#### Методы:
- setCatalog - весь список товаров в каталоге, получаемый с сервера
- setPreview - предпросмотр товара в модальном окне
- addItemToShoppingCart - добавляет товар в корзину
- clearShoppingCart - очищает корзину
- removeFromShoppingCart - удаляет товар из корзины
- updateShoppingCart - обновление состояния корзины
- clearOrder - очистка данных заказа
- setInfoDeliveryField - заполнение полей формы доставки
- setInfoContactField - заполнение полей формы контакта

##### Используемые типы данных:
```typescript
interface IState {
  catalog: IItem[];
  preview: string | null;
  shoppingCart: IItem[];
  formErrors: FormErrors;
  contact: IUser | null;
  order: IOrder | null;
  payment: IPaymentForm | null;
}
```
```typescript
interface IOrder extends IOrderForm, IContact {
    total: number | null;
    items: string[];
}
```
```typescript
interface IPaymentForm {
  payment: string;
  address: string;
}
```
```typescript
type FormErrors = Partial<Record<keyof IOrder, string>>;
```
```typescript
interface IUser {
  email: string;
  phone: string;
}
```
```typescript
interface ICard extends IItem {
    index?: string;
    btnText?: string;
}
```

#### Класс `Product`
Хранит информацию о продукте.
`constructor(data)` - принимает данные продукта
Конструктор и методы наследуются из класса `Model`.
##### Свойства класса:
- id - идентификатор продукта
- title - название товара
- price - цена товара
- description - описание товара
- category - категория товара
- image - изображение проудкта

##### Используемые типы данных:
```typescript
interface IItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

#### Класс `Page`
Предназначен для управления основными элементами интерфейса страницы: каталогом товаров, счётчиком количества товаров в корзине и модальным окном.
##### Свойства класса:
- protected \_catalog - каталога товаров
- protected \_counter - счетчик количества добавленных в корзину товаров
- protected \_shoppingCart - корзина
- protected \_wrapper - обертка страницы
##### Реализуемые методы:
- counter - устанавливает значение счетчика
- catalog - обновляет каталог
- locked - блокирует прокрутку страницы
##### Используемые типы данных:
```typescript
interface IPage {
  counter: number | null;
  catalog: HTMLElement[];
  locked: boolean;
}
```

#### Класс `Modal`
Наследуется от Component и реализует модальное окно.
##### Свойства класса:
- protected \_сloseButton - кнопка для закрытия модального окна
- protected \_content - контент отображаемый внутри модального окна
##### Реализуемые методы:
- content - заполнение контента модального окна
- open - открытие модального окна
- close - закрытие модального окна
- render - отображение модального окна

#### Класс `Card`
Представляет карточку товара и наследуется от Component.
##### Свойства класса:
- protected \_title - заголовок карточки
- protected \_image - изображение карточки
- protected \_price - цена карточки
- protected \_btn - кнопка карточки
- protected \_btnText - текст кнопки карточки
- protected \c - описание карточки
- protected \_index - идентификатор карточки
- protected \_category - категория карточки
##### Реализуемые методы:
- title - устанавливает заголовок карточки
- image - устанавливает изображение карточки
- price - устанавливает цену карточки
- btnText - устанавливает текст кнопки карточки
- description - устанавливает описание карточки
- index - устанавливает идентификатор карточки
- category - устанавливает категорию карточки
- id - устанавливает идентификатор карточки

#### Класс `ShoppingCart`
Предназначен для управления функциональностью корзины, позволяя добавлять и удалять товары, изменять их количество и рассчитывать общую стоимость
##### Свойства класса:
- protected \_list - список добавленных в корзину товаров
- protected \_total - общая стоимость корзины
- protected \_btn - кнопка "Оформить"
##### Реализуемые методы:
- items - обновляет список добавленных в корзину товаров,
- total - обновляет общую стоимость корзины.
- isDisabled - активация/деактивация кнопки.

#### Класс `Form`
Предназначен для работы с формой, обеспечивая валидацию данных, обработку отправки формы и отображение ошибок.
##### Свойства класса:
- protected \_submit: HTMLElement - кнопка подтверждения формы,
- protected \_error: HTMLElement - сообщение об ошибке.
##### Реализуемые методы:
- isValid - включает и выключает кнопку подтверждения формы взависимости от валидации,
- errors - отображает ошибку валидации,
- render - отрисовывает форму.

#### Класс `Payment`
Класс предназначен для обработки форм оплаты и доставки. Он наследуется от класса Form.
##### Свойства класса:
- protected \_online: HTMLElement - кнопка оплаты онлайн,
- protected \_cash: HTMLElement - кнопка оплаты при получении.
##### Реализуемые методы:
- toggleButton - переключение кнопок способов оплаты,
- address - устанавливает адрес доставки.

#### Класс `Contact`
Аналогичен Payment, предназначенный для сбора номера телефона и электронной почты пользователя. Он также наследуется от класса Form.
##### Реализуемые методы:
- phone - устанавливает номер телефона
- email - устанавливает электронную почту

#### Класс `Success`
Класс представляет успешное сообщение для платёжной операции
##### Свойства:
- protected \_close: HTMLElement - кнопка закрытия
- protected \_total: HTMLElement - общая стоимость корзины
*Методы*:
- total - обновляет общую стоимость корзины
##### Используемые типы данных:
```typescript
interface ISuccess {
  total: number;
}
```
```typescript
interface ISuccessActions {
  onClick: () => void;
}
```
### Слой `Presenter`
##### События:
- `product:change` - изменение массива товаров
- `shoppingCart:open` - открытие модального окна корзины
- `shoppingCart:changed` - изменение товаров в корзине
- `preview:change` - изменение модального окна превью товара
- `modal:open` - открытие модального окна
- `modal:close` - закрытие модального окна
- `card:add` - добавление карточки в корзину
- `card:delete` - удаление карточки из корзины
- `order:submit` - сохранение данных о способе оплаты и адресе доставки
- `contacts:submit` - событие отправка товара на оплату
- `order:complete` - при открытии окна успешной оплаты

---