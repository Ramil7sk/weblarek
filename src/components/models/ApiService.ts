import type {
  IApi,
  IProduct,
  TProductsResponse,
  TOrderRequest,
  TOrderResponse,
} from "../../types";

export class ApiService {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProduct[]> {
    return this.api.get<TProductsResponse>("/product").then((res) => res.items);
  }

  sendOrder(order: TOrderRequest): Promise<TOrderResponse> {
    return this.api.post<TOrderResponse>("/order/", order);
  }
}
