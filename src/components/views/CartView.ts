import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

interface ICart {
  content: HTMLElement[];
  price: number;
}

export class CartView extends Component<ICart> {
  protected cartButton: HTMLButtonElement;
  protected cartContent: HTMLElement;
  protected cartPrice: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: EventEmitter,
  ) {
    super(container);
    this.cartButton = ensureElement(
      ".basket__button",
      this.container,
    ) as HTMLButtonElement;
    this.cartContent = ensureElement(".basket__list", this.container);
    this.cartPrice = ensureElement(".basket__price", this.container);

    this.cartButton.addEventListener("click", () =>
      this.events.emit("basket:submit"),
    );
  }

  set content(items: HTMLElement[]) {
    if (items.length) {
      this.cartContent.replaceChildren(...items);
      this.cartButton.disabled = false;
    } else {
      this.cartButton.disabled = true;
    }
  }

  set price(value: number) {
    this.cartPrice.textContent = `${String(value)} синапсов`;
  }
}
