export function fetchPromise(
  url,
  options = {},
  numRetries = 0,
  retryDelay = 300
) {
  const controller = new AbortController();
  let retries = 0;

  const fetchRequest = () => {
    const credentials = "same-origin";

    return fetch(url, {
      signal: controller.signal,
      ...options,
      credentials,
    }).then((res) => {
      if (res.status === 200) {
        return res.json();
      }
      return Promise.reject(res);
    });
  };

  const handleError = (e) => {
    if (e.name === "AbortError") {
      return Promise.reject(new Error("Request aborted"));
    }

    if (retries < numRetries) {
      retries++;
      console.warn(
        `Fetch failed. Retrying in ${retryDelay}ms... (${retries}/${numRetries})`
      );
      return new Promise((resolve) => setTimeout(resolve, retryDelay)).then(
        fetchRequest
      );
    }

    console.error("Error: ", e);
    controller.abort();
    return Promise.reject(e);
  };

  return fetchRequest()
    .catch(handleError)
    .finally(() => {
      if (controller.signal.aborted) return;
    });
}
