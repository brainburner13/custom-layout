import React, {
  MutableRefObject,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AnyAction,
  Dispatch,
} from "redux";
import {
  connect,
} from "react-redux";
import { useDrag } from "react-use-gesture";

import { RootState } from "../reducers";
import {
  Element,
  changeElementPosition,
  changeElementSize,
  changeElementZIndex,
  removeElement,
} from "../../app/reducers/layout";

import closeIcon from "../../assets/icons/black-cross.svg";
import styles from "./styles.module.css";

type PassedProps = {
  children: ReactNode,
  initialPosition: {
    x: number,
    y: number,
  },
  minSize: number,
  title: string,
  zIndex: number,
}

type StateProps = {
  elements: Element[],
}

type DispatchProps = {
  changeElementSize: (element: { title: string, size: { width: number, height: number } }) => AnyAction,
  changeElementPosition: (element: { title: string, positions: { x: number[], y: number[] } }) => AnyAction,
  changeElementZIndex: (element: { title: string }) => AnyAction,
  removeElement: (element: { title: string }) => AnyAction,
}

type Props = StateProps & DispatchProps & PassedProps;

const Wrapper = ({
  children,
  elements,
  initialPosition,
  minSize,
  title,
  zIndex,
  changeElementSize,
  changeElementPosition,
  changeElementZIndex,
  removeElement
}: Props) => {
  const resizableElement = useRef() as MutableRefObject<HTMLInputElement>;
  const resizableHandler = useRef() as MutableRefObject<HTMLInputElement>;

  const elementWidth = elements.find((el) => el.title === title)?.size.width;
  const elementHeight = elements.find((el) => el.title === title)?.size.height;

  // Setting the initial positions of the elements
  useEffect(() => {
    if (resizableElement.current) {
      updateElementPosition(
        {
          x: [
            resizableElement.current.getBoundingClientRect().left,
            resizableElement.current.getBoundingClientRect().right,
          ],
          y: [
            resizableElement.current.getBoundingClientRect().top,
            resizableElement.current.getBoundingClientRect().bottom,
          ],
        },
      );
    }
  }, [
  ]);

  const [
    elemPos, setElemPos
  ] = useState({
    x: 100,
    y: 100
  });

  const [
    elemRollUp, setElemRollup
  ] = useState(false);

  const deleteElement = (title: string) => {
    removeElement({ title });
  };

  const upElementZIndex = (title: string) => {
    changeElementZIndex({ title });
  };

  const updateElementPosition = (positions: {x: number[], y: number[]}) => {
    changeElementPosition({
      title,
      positions,
    });
  };

  const onResizeElement = (size : { width: number, height: number }) => {
    changeElementSize({
      title,
      size,
    });
  };

  const trackSticking = (title: string) => {
    const stickingElem: Element | undefined = elements.find((el) => el.title === title);

    const sticking: {[key: string]: number} = {
      x: elemPos.x,
      y: elemPos.y,
    };

    elements.forEach((el) => {
      if (resizableElement.current && stickingElem && (el.title !== stickingElem.title)) {
        const element = {
          rightBorder: el.positions.x[1],
          leftBorder: el.positions.x[0],
          topBorder: el.positions.y[0],
          bottomBorder: el.positions.y[1],
        };

        const currentElement = {
          rightBorder: stickingElem.positions.x[1],
          leftBorder: stickingElem.positions.x[0],
          topBorder: stickingElem.positions.y[0],
          bottomBorder: stickingElem.positions.y[1],
          width: stickingElem.size.width,
          height: stickingElem.size.height,
        };

        if (element.topBorder - currentElement.bottomBorder <= -5 && // Here we check that the elements touch along the axis Y
            element.bottomBorder - currentElement.topBorder >= 5) {
          if ((element.rightBorder - currentElement.leftBorder <= 20 && // If the distance between the sides the elements is less than 20px, then we sticking
               element.rightBorder - currentElement.leftBorder >= -20)) {
            sticking.x = element.rightBorder + 3;
          }

          if ((element.leftBorder - currentElement.rightBorder <= 20 && // If the distance between the sides the elements is less than 20px, then we sticking
               element.leftBorder - currentElement.rightBorder >= -20)) {
            sticking.x = element.leftBorder - currentElement.width - 3;
          }
        }

        if (element.rightBorder - currentElement.leftBorder >= 5 && // Here we check that the elements touch along the axis X
            element.leftBorder - currentElement.rightBorder <= -5) {
          if ((element.topBorder - currentElement.bottomBorder <= 20 && // If the distance between the sides the elements is less than 20px, then we sticking
               element.topBorder - currentElement.bottomBorder >= -20)) {
            sticking.y = element.topBorder - currentElement.height - 1;
          }

          if ((element.bottomBorder - currentElement.topBorder <= 20 && // If the distance between the sides the elements is less than 20px, then we sticking
               element.bottomBorder - currentElement.topBorder >= -20)) {
            sticking.y = element.bottomBorder + 1;
          }
        }

        setElemPos({ // Then all elements has been checked we change current element position
          x: sticking.x, // If we don't found suitable for bonding element, we set a current position value
          y: sticking.y
        });

        updateElementPosition( // After sticking we need to update element positions in store
          {
            x: [
              sticking.x,
              sticking.x + currentElement.width,
            ],
            y: [
              sticking.y,
              sticking.y + currentElement.height,
            ],
          },
        );
      }
    });
  };

  const bindElemPos = useDrag((params) => {
    upElementZIndex(title);

    if (resizableElement.current) {
      updateElementPosition(
        {
          x: [
            resizableElement.current.getBoundingClientRect().left,
            resizableElement.current.getBoundingClientRect().right,
          ],
          y: [
            resizableElement.current.getBoundingClientRect().top,
            resizableElement.current.getBoundingClientRect().bottom,
          ],
        }
      );
    }

    const positions = {
      x: params.offset[0] + initialPosition.x,
      y: params.offset[1] + initialPosition.y,
    };

    if (params.offset[0] + initialPosition.x < 0) { // If we move the element off the left edge of the screen, stop the movement of the element
      positions.x = 1;
    }

    if (params.offset[0] + initialPosition.x + resizableElement.current.clientWidth > window.innerWidth) { // If we move the element off the right edge of the screen, stop the movement of the element
      positions.x = window.innerWidth - resizableElement.current.clientWidth - 3;
    }

    if (params.offset[1] + initialPosition.y < 52) { // If we move the element off the top edge of the screen, stop the movement of the element
      positions.y = 52;
    }

    if (params.offset[1] + initialPosition.x + resizableElement.current.clientHeight > window.innerHeight) { // If we move the element off the bottom edge of the screen, stop the movement of the element
      positions.y = window.innerHeight - resizableElement.current.clientHeight - 1;
    }

    setElemPos({
      x: positions.x,
      y: positions.y,
    });
  });

  const makeResizableDiv = () => {
    if (resizableElement.current && resizableHandler.current) {
      const element = resizableElement.current;
      const resizer = resizableHandler.current;
      let original_width = 0;
      let original_height = 0;
      let original_mouse_x = 0;
      let original_mouse_y = 0;

      const resize = (e: MouseEvent) => {
        const width = original_width + (e.pageX - original_mouse_x);
        const height = original_height + (e.pageY - original_mouse_y);
        const maxWidth = window.innerWidth - resizableElement.current.getBoundingClientRect().left;
        const maxHeight = window.innerHeight - resizableElement.current.getBoundingClientRect().top;

        if (width > minSize && width < maxWidth) {
          element.style.width = width + "px";
        }

        if (height > minSize && height < maxHeight) {
          element.style.height = height + "px";
        }
      };

      const stopResize = () => {
        window.removeEventListener("mousemove", resize);
      };

      resizer.addEventListener("mousedown", (e) => {
        e.preventDefault();
        original_width = parseInt(element.style.width);
        original_height = parseInt(element.style.height);
        original_mouse_x = e.pageX;
        original_mouse_y = e.pageY;
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResize);
      });

      stopResize();
    }
  };

  makeResizableDiv();

  return (
    <div
      style={{
        left: elemPos.x,
        top: elemPos.y,
        width: elementWidth,
        height: elemRollUp ? 28 : elementHeight,
        zIndex: zIndex,
      }}
      ref={resizableElement}
      onMouseDown={() => upElementZIndex(title)}
      className={styles.wrapper}
    >
      <div
        {...bindElemPos()}
        onMouseUp={() => trackSticking(title)}
        className={styles.header}
      >
        <div className={styles.headerTitle}>
          {`Title of ${title} element`}
        </div>
        <div className={styles.buttons}>
          <div
            onClick={() => setElemRollup(!elemRollUp)}
            className={styles.rollUp}>
          </div>
          <button
            onClick={() => deleteElement(title)}
            className={styles.closeButton}
          >
            <img src={closeIcon} alt="close"/>
          </button>
        </div>
      </div>
      {!elemRollUp && (
        <div
          className={styles.content}
        >
          <div>
            {children}
          </div>
          <div
            ref={resizableHandler}
            onClick={() => onResizeElement({
              width: resizableElement.current.clientWidth,
              height: resizableElement.current.clientHeight,
            })}
            className={styles.resizableHandler}
          >
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ( state: RootState ): StateProps => {
  const elements = state.layout.elements;

  return {
    elements,
  };
};

const mapDispatchToProps = ( dispatch: Dispatch ): DispatchProps => ({
  changeElementSize: (element: {title: string, size: {width: number, height: number}}) => dispatch(changeElementSize(element)),
  changeElementPosition: (element: {title: string, positions: {x: number[], y: number[]}}) => dispatch(changeElementPosition(element)),
  changeElementZIndex: (element: { title: string }) => dispatch(changeElementZIndex(element)),
  removeElement: (element: { title: string }) => dispatch(removeElement(element)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper);
