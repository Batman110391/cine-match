import { Suspense, useState } from "react";
import { Example } from "./components/Example";
import ErrorBoundary from "./utils/ErrorBoundary";

const URLS = {
  USERS: "https://jsonplaceholder.typicode.com/users",
  POSTS: "https://jsonplaceholder.typicode.com/posts",
  COMMENTS: "https://jsonplaceholder.typicode.com/comments",
};

export default function App() {
  const [url, setUrl] = useState(URLS.USERS);

  return (
    <>
      <div>
        <label>
          <input
            type="radio"
            checked={url === URLS.USERS}
            onChange={() => setUrl(URLS.USERS)}
          />
          Users
        </label>
        <label>
          <input
            type="radio"
            checked={url === URLS.POSTS}
            onChange={() => setUrl(URLS.POSTS)}
          />
          Posts
        </label>
        <label>
          <input
            type="radio"
            checked={url === URLS.COMMENTS}
            onChange={() => setUrl(URLS.COMMENTS)}
          />
          Comments
        </label>
      </div>
      <ErrorBoundary fallback={<div>Error...</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <Example url={url} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
