import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

interface IGallery {
  catalog: HTMLElement[]
}

export class Gallery extends Component<IGallery> {
  protected catalogElement:HTMLElement;

  constructor (container:HTMLElement, protected events:EventEmitter) {
    super(container);
    this.catalogElement = ensureElement<HTMLElement>('.gallery', container);
  }

  set catalog (items:HTMLElement[]) {
    this.catalogElement.replaceChildren(...items);
  }
}