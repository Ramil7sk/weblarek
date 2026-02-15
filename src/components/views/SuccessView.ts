import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
  protected buttonElement: HTMLButtonElement;
  protected itemsPrice: HTMLElement;

  constructor(
    protected container: HTMLElement,
    actions: ISuccessActions
  ) {
    super(container);
    this.buttonElement = ensureElement('.order-success__close', container)  as HTMLButtonElement;
    this.itemsPrice = ensureElement('.order-success__description', container);

    this.buttonElement.addEventListener('click', actions.onClick);
  }

  set total (value: number) {
    this.itemsPrice.textContent = `Списано ${String(value)} синапсов`;
  }
}