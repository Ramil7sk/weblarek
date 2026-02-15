import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected contentElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(
    protected container: HTMLElement,
    protected events: EventEmitter,
  ) {
    super(container);
    this.contentElement = ensureElement(".modal__content", this.container);
    this.closeButton = ensureElement(
      ".modal__close",
      this.container,
    ) as HTMLButtonElement;

    this.closeButton.addEventListener("click", this.close.bind(this));
    this.container.addEventListener("click", this.close.bind(this));
    this.contentElement.addEventListener("click", (event) =>
      event.stopPropagation(),
    );
  }

  set content(item: HTMLElement) {
    this.contentElement.replaceChildren(item);
  }

  open() {
    this.container.classList.add("modal_active");
  }

  clear() {
    this.contentElement.replaceChildren();
  }
  close() {
    this.container.classList.remove("modal_active");
    this.clear();
  }
}
