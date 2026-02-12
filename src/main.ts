import "./scss/styles.scss";
import { Products } from "./components/models/Products";
import { Buyer } from "./components/models/Buyer";
import { Cart } from "./components/models/Cart";
import { Api } from "./components/base/Api";
import { ApiService } from "./components/models/ApiService";
import { API_URL } from "./utils/constants";
import { Modal } from "./components/views/ModalView";
import { EventEmitter } from "./components/base/Events";
import { Gallery } from "./components/views/GalleryView";
import { cloneTemplate } from "./utils/utils";
import { GalleryCard } from "./components/views/CardView";

const events = new EventEmitter();
const api = new Api(API_URL);
const apiService = new ApiService(api);

const productsApiModel = new Products(events);
const cartApiModel = new Cart();

const modal = new Modal(document.querySelector('#modal-container') as HTMLElement, events);
const page = new Gallery(document.querySelector('.page__wrapper') as HTMLElement, events);

const productGalleryTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;

events.on('items:changed', () =>{
  const productsArray = productsApiModel.getProducts().map((product) => 
    
    new GalleryCard(cloneTemplate(productGalleryTemplate), events).render(product)
  )

  page.render({
    catalog: productsArray
  })
})

try {
  const products = await apiService.getProducts();
  
  productsApiModel.saveProducts(products);
} catch (error) {
  console.error('Ошибка при получении товаров:', error);
}

