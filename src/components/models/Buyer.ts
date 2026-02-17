import { IBuyer } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  private buyer: IBuyer = { payment: "", email: "", phone: "", address: "" };

  constructor(protected events: IEvents) {}

  // Метод для обновления данных покупателя
  setBuyerData(data: Partial<IBuyer>): void {
    this.buyer = { ...this.buyer, ...data };
    this.events.emit("buyer:changed", this.buyer);
  }

  getBuyerData(): IBuyer {
    return this.buyer;
  }

  // Очистка модели
  clear(): void {
    this.buyer = { payment: "", email: "", phone: "", address: "" };
    this.events.emit("buyer:changed", this.buyer);
  }

  // Валидация модели
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
