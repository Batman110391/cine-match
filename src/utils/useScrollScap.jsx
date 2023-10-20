import { useRef, useEffect } from "react";
import Tweezer from "tweezer.js";

const Direction = {
  Up: 0,
  Down: 1,
  None: 2,
};

const INTERACTION_TIMEOUT = 150;

function useScrollSnap({
  ref: elementRef,
  duration = 100,
  directionAbility = true,
  directionAbilityUp = false,
  directionAbilityDown = true,
}) {
  const dataRef = useRef({
    currentIndex: 0,
    currentOffset: 0,
    targetOffset: 0,
    timeoutID: 0,
    direction: Direction.None,
    directionStart: 0,
    animation: null,
  });

  const getTargetScrollOffset = (element) => {
    let top = element.offsetTop;
    while (element.offsetParent) {
      element = element.offsetParent;
      top += element.offsetTop;
    }
    return top;
  };

  const getChildElements = () => {
    if (elementRef.current && elementRef.current.children.length > 0) {
      return Array.from(elementRef.current.children);
    } else {
      return [];
    }
  };

  const getElementsInView = () => {
    return getChildElements().filter((element) => {
      const height = element.offsetHeight;
      let top = element.offsetTop;
      while (element.offsetParent) {
        element = element.offsetParent;
        top += element.offsetTop;
      }
      return (
        top < window.scrollY + window.innerHeight &&
        top + height > window.scrollY
      );
    });
  };

  const getElementViewportHeight = (element) => {
    const viewportHeight = window.innerHeight;

    const rect = element.getBoundingClientRect();

    let elementY;
    if (rect.top < 0) {
      elementY = rect.bottom;
    } else if (rect.bottom > viewportHeight) {
      elementY = viewportHeight - rect.top;
    } else {
      elementY = rect.bottom - rect.top;
    }

    return elementY;
  };

  const findSnapTarget = () => {
    const elementsInView = getElementsInView();
    if (elementsInView.length < 1) return;

    dataRef.current.currentOffset = window.scrollY;

    if (dataRef.current.direction === Direction.Up) {
      snapToTarget(elementsInView[0]);
      return;
    } else if (dataRef.current.direction === Direction.Down) {
      snapToTarget(elementsInView[elementsInView.length - 1]);
      return;
    }

    let largestElement;
    let largestHeight = -1;

    for (const element of elementsInView) {
      const elementHeight = getElementViewportHeight(element);
      if (elementHeight > largestHeight) {
        largestElement = element;
        largestHeight = elementHeight;
      }
    }

    if (largestElement) {
      snapToTarget(largestElement);
    }
  };

  const snapToTarget = (target) => {
    if (dataRef.current.animation) {
      dataRef.current.animation.stop();
    }

    const elements = getChildElements();
    for (let i = 0; i < elements.length; ++i) {
      const element = elements[i];
      if (element.isSameNode(target)) {
        dataRef.current.currentIndex = i;
      }
    }

    dataRef.current.targetOffset = getTargetScrollOffset(target);

    // const animation = new Tweezer({
    //   start: 0,
    //   end: 10000,
    //   duration: duration,
    // });

    // animation.on("tick", tickAnimation);
    // animation.on("done", clearAnimation);

    // dataRef.current.animation = animation;
    // animation.begin();
  };

  const tickAnimation = (value) => {
    const scrollTopDelta =
      dataRef.current.targetOffset - dataRef.current.currentOffset;
    const scrollTop =
      dataRef.current.currentOffset + (scrollTopDelta * value) / 10000;
    window.scrollTo({ top: scrollTop, behavior: "smooth" });
  };

  const clearAnimation = () => {
    clearTimeout(dataRef.current.timeoutID);

    if (dataRef.current.animation) {
      dataRef.current.animation.stop();
    }

    dataRef.current = {
      currentIndex: dataRef.current.currentIndex,
      currentOffset: 0,
      targetOffset: 0,
      timeoutID: 0,
      direction: Direction.None,
      directionStart: 0,
      animation: null,
    };
  };

  const handleInteraction = () => {
    dataRef.current.timeoutID = setTimeout(findSnapTarget, INTERACTION_TIMEOUT);
  };

  const handleWheel = (event) => {
    clearAnimation();

    console.log("dataRef.current.direction", dataRef.current.direction);

    if (!directionAbility) {
      event.preventDefault();
      return false;
    }

    if (event.deltaY < 0) {
      if (!directionAbilityUp) {
        event.preventDefault();
        return false;
      }
      dataRef.current.direction = Direction.Up;
    } else if (event.deltaY > 0) {
      dataRef.current.direction = Direction.Down;
    } else {
      dataRef.current.direction = Direction.None;
    }

    handleInteraction();
  };

  const handleTouchStart = (event) => {
    const deltaY = event.touches[0].clientY;

    dataRef.current.directionStart = deltaY;
  };

  const handleTouchMove = (event) => {
    if (!directionAbility) {
      event.preventDefault();
      event.returnValue = false;
      return false;
    }

    const deltaY = event.touches[0].clientY - dataRef.current.directionStart;

    if (deltaY > 0) {
      if (!directionAbilityUp) {
        event.preventDefault();
        event.returnValue = false;
        return false;
      }
      dataRef.current.direction = Direction.Up;
    } else {
      dataRef.current.direction = Direction.Down;
    }

    handleInteraction();
  };

  useEffect(() => {
    clearAnimation();

    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    findSnapTarget();

    return () => {
      clearAnimation();

      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return dataRef?.current || {};
}

export default useScrollSnap;
