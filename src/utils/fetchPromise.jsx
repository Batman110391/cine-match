export function fetchPromise(url, options = {}) {
  const controller = new AbortController();

  return fetch(url, { signal: controller.signal, ...options })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
      return Promise.reject(res);
    })
    .catch((e) => {
      if (e.name === "AbortError") return;

      console.error("Error: ", e);

      controller.abort();
    })
    .finally(() => {
      if (controller.signal.aborted) return;
    });
}
