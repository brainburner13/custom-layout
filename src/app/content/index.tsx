import React from "react";
import { connect } from "react-redux";

import Wrapper from "../../app/wrapper";
import { RootState } from "../../app/reducers";
import {
  elementsOfLayout,
  Element,
} from "../../app/reducers/layout";

type PassedProps = {
};

type StateProps = {
  elements?: Element[],
};

type Props = StateProps & PassedProps;

class Content extends React.PureComponent<Props> {
  renderElements = (elements: Element[]) => {
    return elements.map((element) => {
      const {
        component,
        key,
        title,
        zIndex,
      } = element;

      return (
        <Wrapper
          initialPosition={{
            x: 100,
            y: 100
          }}
          key={key}
          minSize={230}
          title={title}
          zIndex={zIndex}
        >
          {component}
        </Wrapper>
      );
    });
  };

  render() {
    const {
      elements,
    } = this.props;

    if (!elements) return null;

    return (
      <div>
        {this.renderElements(elements)}
      </div>
    );
  }
}

const mapStateToProps = ( state: RootState ): StateProps => {
  const elements = elementsOfLayout(state);

  return {
    elements,
  };
};

export default connect(mapStateToProps, null)(Content);
