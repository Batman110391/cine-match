import React, { useEffect, useRef, useState, useMemo } from "react";

export default function GridListImageVisualizations({ w, gap, children }) {
  const containerRef = useRef(null);
  const [numItems, setNumItems] = useState(0);

  useEffect(() => {
    const updateNumItems = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const calculatedNumItems = Math.floor(containerWidth / (w + gap));
        setNumItems(calculatedNumItems);
      }
    };

    updateNumItems();

    const handleResize = () => {
      updateNumItems();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [w, gap]);

  const lineItems = useMemo(() => React.Children.toArray(children), [children]);

  return (
    <div ref={containerRef} style={{ marginTop: `${gap}px` }}>
      {lineItems
        .reduce((acc, item, index) => {
          const lineIndex = Math.floor(index / numItems);
          if (!acc[lineIndex]) {
            acc[lineIndex] = [];
          }
          acc[lineIndex].push(
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "center",
                flexGrow: 1,
              }}
            >
              {item}
            </div>
          );
          return acc;
        }, [])
        .map((lineItems, index) => (
          <React.Fragment key={index}>
            <div
              style={{
                display: "grid",
                justifyContent: "center",
                gridTemplateColumns: `repeat(${numItems}, 1fr)`,
                gap: `${gap}px`,
                marginBottom: `${gap}px`,
              }}
            >
              {lineItems}
              {lineItems.length < numItems &&
                Array.from({ length: numItems - lineItems.length }).map(
                  (_, i) => (
                    <div
                      key={lineItems.length + i}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        flexGrow: 1,
                        width: `${w}px`,
                      }}
                    />
                  )
                )}
            </div>
          </React.Fragment>
        ))}
    </div>
  );
}
