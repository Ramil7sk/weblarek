import './scss/styles.scss';
import { Products } from './components/models/Products';
import { apiProducts } from './utils/data';

const productsModel = new Products();
productsModel.saveProducts(apiProducts.items); 
console.log('Массив товаров из каталога:' , productsModel.getProducts())
