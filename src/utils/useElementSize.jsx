import { useCallback, useState, useLayoutEffect } from "react";

function useElementSize() {
  const [ref, setRef] = useState(null);
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  const handleSize = useCallback(() => {
    setSize({
      width: ref?.offsetWidth || 0,
      height: ref?.offsetHeight || 0,
    });
  }, [ref]);

  useLayoutEffect(() => {
    handleSize();
  }, []);

  useLayoutEffect(() => {
    if (!ref) return;
    handleSize();

    function handleResize() {
      handleSize();
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [ref]);

  return [setRef, size];
}

export default useElementSize;
