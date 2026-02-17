import "./scss/styles.scss";
import { ICustomer } from "./components/views/FormView";
import { Products } from "./components/models/Products";
import { Buyer } from "./components/models/Buyer";
import { Cart } from "./components/models/Cart";
import { Api } from "./components/base/Api";
import { ApiService } from "./components/models/ApiService";
import { API_URL } from "./utils/constants";
import { Modal } from "./components/views/ModalView";
import { Header } from "./components/views/HeaderView";
import { EventEmitter } from "./components/base/Events";
import { Gallery } from "./components/views/GalleryView";
import { cloneTemplate } from "./utils/utils";
import { GalleryCard, ModalCard, BasketCard } from "./components/views/CardView";
import { Success } from "./components/views/SuccessView";
import { CartView } from "./components/views/CartView";
import { OrderForm, ContactForm } from "./components/views/FormView";
import { IBuyer } from "./types";
import { IProduct } from "./types";

const events = new EventEmitter();
const api = new Api(API_URL);
const apiService = new ApiService(api);
const buerModel = new Buyer(events);
const productsApiModel = new Products(events);
const cartModel = new Cart(events);

const productGalleryTemplate = document.querySelector("#card-catalog") as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector("#card-preview") as HTMLTemplateElement;
const cartTemplate = document.querySelector("#basket") as HTMLTemplateElement;
const cartBasketTemplate = document.querySelector("#card-basket") as HTMLTemplateElement;
const orderFormTemplate = document.querySelector("#order") as HTMLTemplateElement;
const contactFormTemplate = document.querySelector("#contacts") as HTMLTemplateElement;
const successTemplate = document.querySelector("#success") as HTMLTemplateElement;

const modal = new Modal(document.querySelector("#modal-container") as HTMLElement, events);
const page = new Gallery(document.querySelector(".page__wrapper") as HTMLElement, events);
const header = new Header(document.querySelector(".header") as HTMLElement, events);
const cart = new CartView(cloneTemplate(cartTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderFormTemplate), events);
const contactForm = new ContactForm(cloneTemplate(contactFormTemplate), events);

// функция для обновления текста кнопки
function updateModalButton() {
  if (!currentProduct) return;

  modalCard.buttonText = cartModel.hasItem(currentProduct.id)
    ? "Удалить из корзины"
    : "Купить";
}

// добавление карточек на страницу
events.on("products:changed", () => {
  const products = productsApiModel.getProducts();
  const cards = products.map((product) => {
    const card = new GalleryCard(cloneTemplate(productGalleryTemplate), {
      onClick: () => {
        events.emit("card:open", product);
      },
    });
    return card.render(product);
  });
  page.render({ catalog: cards });
});

// выбор карточки товара
events.on("card:open", ({ id }: { id: string }) => {
  const selectedItem = productsApiModel.getProductById(id);
  if (!selectedItem) return;
  productsApiModel.saveSelectedProduct(selectedItem);
});

//выносим modalCard из обработчика
let currentProduct: IProduct | null = null;

const modalCard = new ModalCard(cloneTemplate(cardPreviewTemplate), {
  onClick: () => {
    if (!currentProduct) return;
      events.emit("selectedCard:basketAction", currentProduct);
  },
});

// добавление карточки в модель
events.on("card:selected", () => {
  const selectedCard = productsApiModel.getSelectedProduct();
  if (!selectedCard) return;

  currentProduct = selectedCard;

  updateModalButton();

  const cardContentHTML = modalCard.render({
    ...selectedCard,
    buttonText: cartModel.hasItem(selectedCard.id)
      ? "Удалить из корзины"
      : "Купить",
  });

  modal.render({ content: cardContentHTML });
  modal.open();
});

// добавление и удаление товара из корзины
events.on("selectedCard:basketAction", (selectedCard: IProduct) => {
  if (!selectedCard) return;
  if (!cartModel.hasItem(selectedCard.id)) {
    cartModel.addItem(selectedCard);
  } else {
    cartModel.removeItem(selectedCard);
  }
});

// открытие модального окна с формой заказа
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




// изменение корзины
events.on("basket:changed", () => {
    header.render({ counter: cartModel.getItemsCount() });
    const itemsHTMLArray = cartModel.getItems().map((item, index) => {
      const itemNumber = index + 1;
      return new BasketCard(cloneTemplate(cartBasketTemplate), {
        onClick: () => {
          events.emit("selectedCard:basketAction", item);
        },
      }).render({ ...item, itemNumber });
    });

  updateModalButton();

  cart.render({ content: itemsHTMLArray, price: cartModel.getTotalPrice() });
});

// открытие модального окна с корзиной
events.on("basket:open", () => {
  modal.render({ content: cart.render() });
  modal.open();
});

events.on("buyer:changed", () => {
  const buyer = buerModel.getBuyerData();
  const currentErrors = buerModel.validate();
  const errors = [
    currentErrors.address,
    currentErrors.payment,
    currentErrors.email,
    currentErrors.phone,
  ].filter(Boolean) as string[];

  orderForm.render({ valid: errors.length === 0, errors });
  orderForm.address = buyer.address || "";
  orderForm.changeButtonState(buyer.payment === "card", buyer.payment === "cash");

  contactForm.render({ valid: errors.length === 0, errors });
  contactForm.email = buyer.email || "";
  contactForm.phone = buyer.phone || "";
});


// Изменился способ оплаты
events.on("payment:changed", (buyer: IBuyer) => {
  if (buyer.payment) {
    orderForm.changeButtonState(buyer.payment === "card", buyer.payment === "cash");
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

// Изменилось одно из полей формы order
events.on(
  /^order\..*:changed/,
  (data: { field: keyof ICustomer; value: string }) => {
    buerModel.setBuyerData({ [data.field]: data.value });
    const currentErrors = buerModel.validate();

    const errors = [currentErrors.address, currentErrors.payment].filter(
      Boolean,
    ) as string[];

    orderForm.render({
      valid: errors.length === 0,
      errors,
    });
  },
);

// Изменилось одно из полей формы contacts
events.on(
  /^contacts\..*:changed/,
  (data: { field: keyof ICustomer; value: string }) => {
    buerModel.setBuyerData({ [data.field]: data.value });

    const currentErrors = buerModel.validate(); 
    const errors = [currentErrors.email, currentErrors.phone].filter(
      Boolean,
    ) as string[];

    contactForm.render({
      valid: errors.length === 0,
      errors,
    });
  },
);;


// подтверждение заказа и отправка данных на сервер

const successComponent = new Success(cloneTemplate(successTemplate), {
  onClick: () => modal.close(),
});

events.on("contacts:submit", () => {
  const userData = buerModel.getBuyerData();

  apiService.sendOrder({
    items: cartModel.getItems().map((item) => item.id),
    total: cartModel.getTotalPrice(),
    ...(userData as IBuyer),
  }).then(result => {
    const successHTML = successComponent.render(result);
    modal.render({ content: successHTML });
  });

  header.render({ counter: 0 });
  cartModel.clear();
  buerModel.clear();
  modal.clear();
  orderForm.changeButtonState(false, false);
});



// получение данных о товарах с сервера
try {
  const products = await apiService.getProducts();
  productsApiModel.saveProducts(products);
} catch (error) {
  console.error("Ошибка при получении товаров:", error);
}
