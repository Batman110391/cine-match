import { use } from "react";
import { fetchPromise } from "../utils/fetchPromise";

export function Example({ url }) {
  const data = use(fetchPromise(url));

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
