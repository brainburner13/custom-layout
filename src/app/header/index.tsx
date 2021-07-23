import React, {
  PureComponent,
} from "react";
import {
  AnyAction,
  Dispatch,
} from "redux";
import { connect } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { RootState } from "../reducers";
import {
  Element,
  addElement,
  elementsOfLayout,
} from "../reducers/layout";

import styles from "./styles.module.css";

type StateProps = {
    elementsLength: number,
};

type DispatchProps = {
    addElement: (element: { element: Element }) => AnyAction;
}

type Props = StateProps & DispatchProps;

class Header extends PureComponent<Props> {
    addNewElement = (element: Element) => {
      const {
        addElement,
      } = this.props;

      addElement({ element });
    }

    render() {
      const element = {
        component: <div>{this.props.elementsLength + 1}</div>,
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
        title: `${this.props.elementsLength + 1}`,
        zIndex: (this.props.elementsLength + 1),
      };

      return (
        <header className={styles.content}>
          <h1
            className={styles.headerTitle}
          >
            Layout demo
          </h1>
          <button
            onClick={() => this.addNewElement(element)}
            className={styles.addButton}
          >
            Add element
          </button>
        </header>
      );
    }
}

const mapStateToProps = (state: RootState): StateProps => {
  const elements = elementsOfLayout(state);

  return {
    elementsLength: elements.length,
  };
};

const mapDispatchToProps = ( dispatch: Dispatch ): DispatchProps => ({
  addElement: (element: { element: Element }) => dispatch(addElement(element)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);