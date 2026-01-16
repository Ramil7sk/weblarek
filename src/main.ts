import "./scss/styles.scss";
import { Products } from "./components/models/Products";
import { apiProducts } from "./utils/data";
import { Api } from "./components/base/Api";
import { ApiService } from "./components/models/APIservice";

const productsModel = new Products();
productsModel.saveProducts(apiProducts.items);
console.log("Массив товаров из каталога:", productsModel.getProducts());
console.log("Получение одного товара по id:", productsModel.getProductById("854cef69-976d-4c2a-a18c-2aa45046c390"));
productsModel.saveSelectedProduct(apiProducts.items[0]);
console.log("Выбранный товар:", productsModel.getSelectedProduct());


const api = new Api("https://larek-api.nomoreparties.co/api/weblarek");
const apiService = new ApiService(api);
const productsApiModel = new Products();

try {
  const products = await apiService.getProducts();
  productsApiModel.saveProducts(products);

  console.log(
    "Каталог товаров из модели:",
    JSON.stringify(productsApiModel.getProducts(), null, 2)
  );
} catch (error) {
  console.error('Ошибка при получении товаров:', error);
}
