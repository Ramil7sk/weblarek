import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";
import { IBuyer } from "../../types";

interface IForm {
  valid: boolean;
  errors: string[];
}

export interface ICustomer {
  email: string;
  phone: string;
  payment: "online" | "cash" | "";
  address: string;
}

export class Form<T> extends Component<IForm> {
  protected buttonElement: HTMLButtonElement;
  protected errorElement: HTMLElement;

  constructor(
    protected container: HTMLFormElement,
    protected events: EventEmitter,
  ) {
    super(container);
    this.buttonElement = ensureElement(
      ".button order__button",
      this.container,
    ) as HTMLButtonElement;
    this.errorElement = ensureElement(
      ".form__errors",
      this.container,
    ) as HTMLSpanElement;

    this.container.addEventListener("input", (evt: Event) => {
      const target = evt.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      this.onInputChange(field, value);
    });

    this.buttonElement.addEventListener("click", (evt: Event) => {
      evt.preventDefault();
      this.events.emit(`${this.container.name}:submit`);
    });
  }

  onInputChange(field: keyof T, value: string) {
    this.events.emit(`${this.container.name}.${String(field)}:changed`, {
      field,
      value,
    });
  }
}
