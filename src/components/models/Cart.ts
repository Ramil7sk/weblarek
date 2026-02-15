import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Cart {
  private items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this.items;
  }
  addItem(item: IProduct): void {
    this.items.push(item);
    this.events.emit("basket:changed");
  }
  removeItem(product: IProduct): void {
    this.items = this.items.filter((item) => item.id !== product.id);
    this.events.emit("basket:changed");
  }
  clear(): void {
    this.items = [];
  }
  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }
  getItemsCount(): number {
    return this.items.length;
  }
  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
