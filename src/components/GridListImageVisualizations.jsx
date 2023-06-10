import React, { useEffect, useRef, useState } from "react";

export default function GridListImageVisualizations({ w, gap, children }) {
  const containerRef = useRef(null);
  const [numItems, setNumItems] = useState(0);

  useEffect(() => {
    const updateNumItems = () => {
      const containerWidth = containerRef.current.offsetWidth;
      const calculatedNumItems = Math.floor(containerWidth / w);
      setNumItems(calculatedNumItems);
    };

    if (containerRef.current) {
      updateNumItems();
    }

    window.addEventListener("resize", updateNumItems);

    return () => {
      window.removeEventListener("resize", updateNumItems);
    };
  }, [containerRef]);

  const lineItems = React.Children.toArray(children);
  const lines = [];
  let currentLine = [];

  lineItems.forEach((item, index) => {
    currentLine.push(
      <div
        key={index}
        style={{
          marginBottom: `${gap}px`,
        }}
      >
        {item}
      </div>
    );

    if (
      currentLine.length === numItems ||
      (index === lineItems.length - 1 && currentLine.length > 0)
    ) {
      const shouldGrow = currentLine.length === numItems;
      const missingItems = numItems - currentLine.length;

      const line = (
        <div
          key={lines.length}
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: `${gap}px`,
          }}
        >
          {currentLine.map((lineItem, lineIndex) => (
            <div
              key={lineIndex}
              style={{
                display: "flex",
                justifyContent: "center",
                flexGrow: 1,
              }}
            >
              {lineItem}
            </div>
          ))}
          {!shouldGrow &&
            missingItems > 0 &&
            Array.from({ length: missingItems }).map((_, i) => (
              <div
                key={currentLine.length + i}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexGrow: 1,
                  width: `${w}px`,
                }}
              />
            ))}
        </div>
      );

      lines.push(line);
      currentLine = [];
    }
  });

  return (
    <div ref={containerRef} style={{ marginTop: `${gap}px` }}>
      {lines}
    </div>
  );
}
