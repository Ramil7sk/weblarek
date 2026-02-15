import './scss/styles.scss';
import { ICustomer } from './components/views/FormView';
import { Products } from './components/models/Products';
import { Buyer } from './components/models/Buyer';
import { Cart } from './components/models/Cart';
import { Api } from './components/base/Api';
import { ApiService } from './components/models/ApiService';
import { API_URL } from './utils/constants';
import { Modal } from './components/views/ModalView';
import { Header } from './components/views/HeaderView';
import { EventEmitter } from './components/base/Events';
import { Gallery } from './components/views/GalleryView';
import { cloneTemplate } from './utils/utils';
import {
  GalleryCard,
  ModalCard,
  BasketCard,
} from './components/views/CardView';
import { Success } from './components/views/SuccessView';
import { CartView } from './components/views/CartView';
import { OrderForm, ContactForm } from './components/views/FormView';
import { IBuyer } from './types';

const events = new EventEmitter();
const api = new Api(API_URL);
const apiService = new ApiService(api);
const BuerModel = new Buyer(events);
const productsApiModel = new Products(events);
const CartModel = new Cart(events);

const productGalleryTemplate = document.querySelector(
  '#card-catalog',
) as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector(
  '#card-preview',
) as HTMLTemplateElement;
const cartTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cartBasketTemplate = document.querySelector(
  '#card-basket',
) as HTMLTemplateElement;
const orderFormTemplate = document.querySelector(
  '#order',
) as HTMLTemplateElement;
const contactFormTemplate = document.querySelector(
  '#contacts',
) as HTMLTemplateElement;
const successTemplate = document.querySelector(
  '#success',
) as HTMLTemplateElement;

const modal = new Modal(
  document.querySelector('#modal-container') as HTMLElement,
  events,
);
const page = new Gallery(
  document.querySelector('.page__wrapper') as HTMLElement,
  events,
);

const header = new Header(
  document.querySelector('.header') as HTMLElement,
  events,
);
const cart = new CartView(cloneTemplate(cartTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderFormTemplate), events);
const contactForm = new ContactForm(cloneTemplate(contactFormTemplate), events);

events.on('products:changed', () => {
  const productsArray = productsApiModel
    .getProducts()
    .map((product) =>
      new GalleryCard(cloneTemplate(productGalleryTemplate), events).render(
        product,
      ),
    );

  page.render({
    catalog: productsArray,
  });
});

events.on('card:open', ({ id }: { id: string }) => {
  const selectedItem = productsApiModel.getProductById(id);
  if (!selectedItem) return;
  productsApiModel.saveSelectedProduct(selectedItem);
});

events.on('basket:changed', () => {
  header.render({ counter: CartModel.getItemsCount() });
  const itemsHTMLArray = CartModel.getItems().map((item, index) => {
    const itemNumber = index + 1;
    return new BasketCard(cloneTemplate(cartBasketTemplate), events).render(
      Object.assign({ ...item, itemNumber }),
    );
  });
  cart.render({
    content: itemsHTMLArray,
    price: CartModel.getTotalPrice(),
  });
});

events.on('card:selected', () => {
  const selectedCard = productsApiModel.getSelectedProduct();

  if (!selectedCard) return;
  const cardContent = new ModalCard(
    cloneTemplate(cardPreviewTemplate),
    events,
  ).render({
    ...selectedCard,
    buttonText: CartModel.hasItem(selectedCard.id)
      ? 'Удалить из корзины'
      : 'Купить',
  });

  modal.render({ content: cardContent });
  modal.open();
});

events.on('selectedCard:basketAction', ({ id }: { id: string }) => {
  const addedItem = productsApiModel.getProductById(id);
  if (!addedItem) return;

  if (!CartModel.hasItem(id)) {
    CartModel.addItem(addedItem);
  } else {
    CartModel.removeItem(addedItem);
  }
});

events.on('basket:submit', () => {
  const formHTML = orderForm.render({
    address: '',
    valid: false,
    errors: [],
  });
  modal.render({
    content: formHTML,
  });
});

events.on('basket:open', () => {
  const itemsHTMLArray = CartModel.getItems().map((item, index) => {
    const itemNumber = index + 1;
    return new BasketCard(cloneTemplate(cartBasketTemplate), events).render(
      Object.assign({ ...item, itemNumber }),
    );
  });

  cart.render({
    content: itemsHTMLArray,
    price: CartModel.getTotalPrice(),
  });

  modal.render({
    content: cart.render(),
  });

  modal.open();
});

// Изменилось одно из полей формы order
events.on(
  /^order\..*:changed/,
  (data: { field: keyof ICustomer; value: string }) => {
    BuerModel.setBuyerData({ [data.field]: data.value });
    const currentErrors = BuerModel.validate();

    const errors = [currentErrors.address, currentErrors.payment].filter(
      Boolean,
    ) as string[];

    orderForm.render({
      valid: errors.length === 0,
      errors,
    });
  },
);

// Изменился способ оплаты
events.on('payment:changed', (buyer: IBuyer) => {
  if (buyer.payment) {
    orderForm.changeButtonState(
      buyer.payment === 'card',
      buyer.payment === 'cash',
    );
  }
});

// Подтверждение формы заказа
events.on('order:submit', () => {
  const formHTML = contactForm.render({
    email: '',
    phone: '',
    valid: false,
    errors: [],
  });
  modal.render({
    content: formHTML,
  });
});

// Изменилось одно из полей формы contacts
events.on(
  /^contacts\..*:changed/,
  (data: { field: keyof ICustomer; value: string }) => {
    BuerModel.setBuyerData({ [data.field]: data.value });

    const currentErrors = BuerModel.validate(); // валидируем всю модель

    // Собираем только нужные ошибки для этой формы
    const errors = [currentErrors.email, currentErrors.phone].filter(
      Boolean,
    ) as string[];

    contactForm.render({
      valid: errors.length === 0,
      errors,
    });
  },
);

events.on('contacts:submit', () => {
  const userData = BuerModel.getBuyerData();

  apiService
    .sendOrder({
      items: CartModel.getItems().map((item) => item.id),
      total: CartModel.getTotalPrice(),
      ...(userData as IBuyer),
    })
    .then((result) => {
      const successHTML = new Success(cloneTemplate(successTemplate), {
        onClick: () => {
          modal.close();
        }
      }).render(result);
      modal.render({content:successHTML})
    });
    header.render({ counter: 0});
    CartModel.clear();
    BuerModel.clear();
    modal.clear();
    orderForm.changeButtonState(false, false);

});

// Получение данных о товарах с сервера
try {
  const products = await apiService.getProducts();

  productsApiModel.saveProducts(products);
} catch (error) {
  console.error('Ошибка при получении товаров:', error);
}
