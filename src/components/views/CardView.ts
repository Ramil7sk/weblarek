import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";
import { categoryMap } from "../../utils/constants";
import { CDN_URL } from "../../utils/constants";

interface ICard extends IProduct {
  buttonText: string;
  itemNumber: number;
}

type CategoryKey = keyof typeof categoryMap;

export class Card extends Component<ICard> {
  protected itemTitle: HTMLElement;
  protected itemPrice: HTMLElement;
  protected itemId: string = "";

  constructor(
    protected container: HTMLElement,
    protected events: EventEmitter,
  ) {
    super(container);
    this.itemTitle = ensureElement(".card__title", this.container);
    this.itemPrice = ensureElement(".card__price", this.container);
  }

  set id(value: string) {
    this.itemId = value;
  }

  set title(value: string) {
    this.itemTitle.textContent = value;
  }

  set price(value: number | null) {
    if (value === null) {
      this.itemPrice.textContent = "Бесценно";
    } else {
      this.itemPrice.textContent = `${value} синапсов`;
    }
  }
}

export class GalleryCard extends Card {
  protected cardImage: HTMLImageElement;
  protected cardCategory: HTMLElement;

  constructor(
    protected container: HTMLElement,
    protected events: EventEmitter,
  ) {
    super(container, events);
    this.cardImage = ensureElement(".card__image",this.container,) as HTMLImageElement;
    this.cardCategory = ensureElement(".card__category", this.container);

    this.container.addEventListener("click", () =>
      this.events.emit("card:open", { id: this.itemId }),
    );
    
  }

  set image(value: string) {
    if (value) {
      const pngValue = value.replace(/\.\w+$/, ".png");
      this.cardImage.src = `${CDN_URL}${pngValue}`;

      this.cardImage.alt = this.itemTitle.textContent || "";
    }
  }

  set category(value: string) {
    if (this.cardCategory) {
      this.cardCategory.textContent = String(value);
    }

    for (const key in categoryMap) {      
      this.cardCategory.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value,
      );
    }
  }
}

export class ModalCard extends GalleryCard {
  protected cardDescription: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor(protected container: HTMLElement, protected events: EventEmitter) {
    super(container, events);
    this.cardDescription = ensureElement('.card__text', this.container);
    this.cardButton = ensureElement('.card__button', this.container) as HTMLButtonElement;

    this.cardButton.addEventListener('click', () => this.events.emit('selectedCard:basketAction', {id: this.itemId}));
  }

  set buttonText (value: string) {
    this.cardButton.textContent = value;
  }

  set description (value: string) {
    this.cardDescription.textContent = value;
  }

  set price(value: number | null) {
    super.price = value;
    if (value === null) {
      this.cardButton.setAttribute('disabled', 'disabled');
      this.cardButton.textContent = 'Недоступно';
    } else {
      this.cardButton.removeAttribute('disabled');
    }
  }
}