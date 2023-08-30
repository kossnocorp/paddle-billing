import type { Paddle } from "../types";
import type { PaddleAPI } from "./types";

export function listProducts<
  PriceData extends Paddle.CustomData,
  ProductData extends Paddle.CustomData,
  Include extends PaddleAPI.QueryProductsListInclude | undefined
>(
  key: string,
  query?: PaddleAPI.QueryProductsList<Include>
): Promise<PaddleAPI.ResponseProductsList<PriceData, ProductData, Include>> {
  return paddleFetch({
    method: "GET",
    path: "products",
    key,
  });
}

interface PaddleFetchProps {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  key: string;
  sandbox?: boolean | undefined;
}

async function paddleFetch(props: PaddleFetchProps) {
  const response = await fetch(
    (props.sandbox ? sandboxAPIURL : apiURL) + props.path,
    {
      method: props.method,
      headers: {
        Authorization: `Bearer ${props.key}`,
      },
    }
  );
  return response.json();
}

const apiURL = `https://api.paddle.com/`;

const sandboxAPIURL = `https://sandbox-api.paddle.com/`;
