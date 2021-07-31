import React from "react";
import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

import { RootState } from "../reducers";

export interface LayoutState {
  elements: Element[];
}

export type Element = {
  component: JSX.Element,
  key: string,
  positions: {
    x: number[],
    y: number[],
  },
  size: {
    width: number,
    height: number,
  },
  title: string,
  zIndex: number,
};

const initialState: LayoutState = {
  elements: [
    {
      component: <div>1</div>,
      key: uuidv4(),
      positions: {
        x: [
          0, 0
        ],
        y: [
          0, 0
        ],
      },
      size: {
        width: 300,
        height: 200,
      },
      title: "one",
      zIndex: 1,
    },
    {
      component: <div>2</div>,
      key: uuidv4(),
      positions: {
        x: [
          0, 0
        ],
        y: [
          0, 0
        ],
      },
      size: {
        width: 300,
        height: 200,
      },
      title: "two",
      zIndex: 2,
    },
    {
      component: <div>3</div>,
      key: uuidv4(),
      positions: {
        x: [
          0, 0
        ],
        y: [
          0, 0
        ],
      },
      size: {
        width: 300,
        height: 200,
      },
      title: "three",
      zIndex: 3,
    },
    {
      component: <div>4</div>,
      key: uuidv4(),
      positions: {
        x: [
          0, 0
        ],
        y: [
          0, 0
        ],
      },
      size: {
        width: 300,
        height: 200,
      },
      title: "four",
      zIndex: 4,
    },
    {
      component: <div>5</div>,
      key: uuidv4(),
      positions: {
        x: [
          0, 0
        ],
        y: [
          0, 0
        ],
      },
      size: {
        width: 300,
        height: 200,
      },
      title: "five",
      zIndex: 5,
    },
  ],
};

export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    changeElementZIndex: (state: LayoutState, action: PayloadAction<{ title: string }>) => {
      const touchedElementIndex = state.elements.findIndex(e => e.title === action.payload.title);
      const touchedElement = state.elements[touchedElementIndex];
      const totalElements = state.elements.length;

      state.elements.map((e) => {
        let zIndex = 1;

        if (e.title === touchedElement.title) {
          e.zIndex = totalElements + 1;
        } else if (e.title !== touchedElement.title && e.zIndex === totalElements + 1) {
          e.zIndex -= zIndex;
        }

        zIndex += 1;

        return e;
      });
    },
    removeElement: (state: LayoutState, action: PayloadAction<{ title: string }>) => {
      const touchedElementIndex = state.elements.findIndex(e => e.title === action.payload.title);
      state.elements.splice(touchedElementIndex, 1);
    },
    addElement: (state: LayoutState, action: PayloadAction<{ element: Element }>) => {
      state.elements.push(action.payload.element);
    },
    changeElementPosition: (state: LayoutState, action: PayloadAction<{title: string, positions: {x: number[], y: number[]}}>) => {
      const touchedElementIndex = state.elements.findIndex(e => e.title === action.payload.title);
      const touchedElementPositions = state.elements[touchedElementIndex].positions;
      touchedElementPositions.x = action.payload.positions.x;
      touchedElementPositions.y = action.payload.positions.y;
    },
    changeElementSize: (state: LayoutState, action: PayloadAction<{title: string, size: {width: number, height: number}}>) => {
      const resizableElement = state.elements.findIndex(e => e.title === action.payload.title);
      state.elements[resizableElement].size = action.payload.size;
      state.elements[resizableElement].positions.x = [
        state.elements[resizableElement].positions.x[0],
        state.elements[resizableElement].positions.x[0] + action.payload.size.width,
      ];
      state.elements[resizableElement].positions.y = [
        state.elements[resizableElement].positions.y[0],
        state.elements[resizableElement].positions.y[0] + action.payload.size.height,
      ];
    }
  },
});

export const {
  addElement,
  removeElement,
  changeElementZIndex,
  changeElementPosition,
  changeElementSize,
} = layoutSlice.actions;

export const elementsOfLayout = (state: RootState) => state.layout.elements;

export default layoutSlice.reducer;
