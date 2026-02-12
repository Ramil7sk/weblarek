import "./scss/styles.scss";
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
import { GalleryCard, ModalCard } from "./components/views/CardView";

const events = new EventEmitter();
const api = new Api(API_URL);
const apiService = new ApiService(api);

const productsApiModel = new Products(events);
const CartModel = new Cart(events);


const modal = new Modal(
  document.querySelector("#modal-container") as HTMLElement,
  events,
);
const page = new Gallery(
  document.querySelector(".page__wrapper") as HTMLElement,
  events,
);

const header = new Header(
  document.querySelector(".header") as HTMLElement,
  events
)

const productGalleryTemplate = document.querySelector(
  "#card-catalog",
) as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector(
  "#card-preview",
) as HTMLTemplateElement;

events.on("products:changed", () => {
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

events.on("card:open", ({ id }: { id: string }) => {
  const selectedItem = productsApiModel.getProductById(id);
  if (!selectedItem) return;
  productsApiModel.saveSelectedProduct(selectedItem);
});


events.on("basket:changed", () => {
    header.render({counter: CartModel.getItemsCount()} )
});

events.on("card:selected", () => {
  const selectedCard = productsApiModel.getSelectedProduct();
  console.log(selectedCard);

  if (!selectedCard) return;
  const cardContent = new ModalCard(
    cloneTemplate(cardPreviewTemplate),
    events,
  ).render({
    ...selectedCard,
    buttonText: CartModel.hasItem(selectedCard.id)
      ? "Удалить из корзины"
      : "Купить",
  });

  console.log(cardContent);

  modal.render({ content: cardContent });
  modal.open();
});

events.on("selectedCard:basketAction", ({ id }: { id: string }) => {
  const addedItem = productsApiModel.getProductById(id);
  if (!addedItem) return;

  if (!CartModel.hasItem(id)) {
    CartModel.addItem(addedItem);
  } else {
    CartModel.removeItem(addedItem);
  }
});

try {
  const products = await apiService.getProducts();

  productsApiModel.saveProducts(products);
} catch (error) {
  console.error("Ошибка при получении товаров:", error);
}
