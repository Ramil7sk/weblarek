import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Products {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(protected events: IEvents) {};

  saveProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit('items:changed');
  }
  getProducts(): IProduct[] {
    return this.products;
  }
  getProductById(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }
  saveSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
  }
  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
