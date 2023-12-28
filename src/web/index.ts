import type { Paddle as Core } from "../types.js";
import type { PaddleWeb as Web } from "./types.js";

export type * from "./types.js";

/**
 * @private
 *
 * Promise to loading the script.
 */
let promise: Promise<Web.Global<any>> | undefined;

/**
 * The Paddle script URL.
 */
export const scriptURL = "https://cdn.paddle.com/paddle/v2/paddle.js";

/**
 * Appends and loads the Paddle script.
 */
export function loadScript<Def extends Core.CustomDataDef>(): Promise<
  Web.Global<Def>
> {
  if (promise) return promise;

  return (promise = new Promise((resolve) => {
    const domLoaded = ["complete", "interactive"].includes(document.readyState);

    function callback() {
      const script = document.createElement("script");
      script.src = scriptURL;
      script.onload = () => resolve((window as Web.WindowWithPaddle).Paddle);
      document.body.appendChild(script);
    }

    if (domLoaded) callback();
    else document.addEventListener("DOMContentLoaded", callback);
  }));
}
