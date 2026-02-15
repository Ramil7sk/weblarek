import { IBuyer } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  private buyer: Partial<IBuyer> = {};

  constructor(protected events: IEvents) {}

  setBuyerData(data: Partial<IBuyer>): void {
    this.buyer = { ...this.buyer, ...data };
    this.events.emit("payment:changed", this.buyer);
  }
  getBuyerData(): Partial<IBuyer> {
    return this.buyer;
  }
  clear(): void {
    this.buyer = {};
  }
  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this.buyer.payment) {
      errors.payment = "Не выбран вид оплаты";
    }

    if (!this.buyer.email) {
      errors.email = "Укажите email";
    }

    if (!this.buyer.phone) {
      errors.phone = "Укажите телефон";
    }

    if (!this.buyer.address) {
      errors.address = "Укажите адрес";
    }

    return errors;
  }
}
