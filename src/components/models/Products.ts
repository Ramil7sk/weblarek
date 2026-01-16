import { IProduct } from "../../types";

export class Products {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;
  saveProducts(products: IProduct[]): void {
    this.products = products;
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
