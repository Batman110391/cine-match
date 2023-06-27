import React from "react";

export function NaiveAutoSizer({ children, ...rest }) {
  const ref = React.useRef();

  const size = useNaiveAutoSizer(ref);

  return (
    <div
      ref={ref}
      {...rest}
      data-width={size?.width}
      data-height={size?.height}
      style={{
        ...rest.style,
        flex: "1 1 0px",
        alignSelf: "stretch",
      }}
    >
      {size == null ? null : children(size)}
    </div>
  );
}

function useNaiveAutoSizer(ref) {
  const [size, setSize] = React.useState(null);

  React.useLayoutEffect(() => {
    let ignore = false;
    let rafId = null;

    update();

    function update() {
      if (!ignore) {
        rafId = requestAnimationFrame(update);

        const node = ref.current;

        if (node) {
          const width = node.offsetWidth;
          const height = node.offsetHeight;

          setSize((size) =>
            size?.width === width && size?.height === height
              ? size
              : { width, height }
          );
        }
      }
    }

    return () => {
      ignore = true;
      cancelAnimationFrame(rafId);
    };
  }, [ref]);

  return size;
}
