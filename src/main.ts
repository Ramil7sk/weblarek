import "./scss/styles.scss";
import { Products } from "./components/models/Products";
import { Buyer } from "./components/models/Buyer";
import { Cart } from "./components/models/Cart";
import { apiProducts } from "./utils/data";
import { Api } from "./components/base/Api";
import { ApiService } from "./components/models/ApiService";
import { API_URL } from "./utils/constants";

// const productsModel = new Products();
// productsModel.saveProducts(apiProducts.items);
// console.log("Массив товаров из каталога:", productsModel.getProducts());
// console.log("Получение одного товара по id:", productsModel.getProductById("854cef69-976d-4c2a-a18c-2aa45046c390"));
// productsModel.saveSelectedProduct(apiProducts.items[0]);
// console.log("Выбранный товар:", productsModel.getSelectedProduct());

// const buyerModel = new Buyer();
// buyerModel.setBuyerData({
// });
// console.log("Данные о покупателе :", buyerModel.getBuyerData());
// console.log("Валидация заполнения данных о покупателе", buyerModel.validate());
// buyerModel.setBuyerData({
//   payment: 'card',
//   email: 'test@test.com',
//   phone: '88888888',
//   address: 'Rostov'
// })
// console.log("Получаем данные о покупателе полсле заполнения всех необходимых полей: ", buyerModel.getBuyerData());
// buyerModel.clear();
// console.log('Проверяем данные о покупателе после очистки данных: ', buyerModel.getBuyerData());

// const cartModel = new Cart();
// cartModel.addItem({
//   id: '001',
//   title: 'Товар 1',
//   description: 'лучший товар',
//   image: './img/pic-1.jpg',
//   category: 'топ товары',
//   price: 1000
// });
// cartModel.addItem({
//   id: '002',
//   title: 'Товар 2',
//   description: 'лучший товар',
//   image: './img/pic-2.jpg',
//   category: 'топ товары',
//   price: null
// });
// cartModel.addItem({
//   id: '003',
//   title: 'Товар 3',
//   description: 'лучший товар',
//   image: './img/pic-3.jpg',
//   category: 'топ товары',
//   price: 500
// });
// console.log("Получаем товары из корзины: ", cartModel.getItems());
// cartModel.removeItem({
//   id: '002',
//   title: 'Товар 2',
//   description: 'лучший товар',
//   image: './img/pic-2.jpg',
//   category: 'топ товары',
//   price: null
// })
// console.log("Удалили Товар 2 из корзины: ", cartModel.getItems());
// console.log("Получаем общую сумму товаров в корзине: ", cartModel.getTotalPrice());
// console.log("Получаем количество товаров в корзине: ", cartModel.getItemsCount());
// console.log("Проверяем наличие Товара 3 в корзине по id: ", cartModel.hasItem('003'));
// console.log("Проверяем наличие Товара 2 в корзине по id: ", cartModel.hasItem('002'));
// cartModel.clear();
// console.log("Товары в корзине после очистки: ", cartModel.getItems());

const api = new Api(API_URL);
const apiService = new ApiService(api);
const productsApiModel = new Products();
const cartApiModel = new Cart();

try {
  const products = await apiService.getProducts();
  productsApiModel.saveProducts(products);
  console.log(
    "Каталог товаров из модели:",
    JSON.stringify(productsApiModel.getProducts(), null, 2)
  );

  console.log(
    "Товары в корзине",
    JSON.stringify(cartApiModel.getItems(), null, 2)
  );

} catch (error) {
  console.error('Ошибка при получении товаров:', error);
}
