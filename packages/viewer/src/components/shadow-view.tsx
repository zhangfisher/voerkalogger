import React from "react";
import ReactDOM from "react-dom";

export class ShadowView extends React.Component {
  setRoot = (pdiv) => {
    if (pdiv) {
      const div = document.createElement("div");
      const shadow = div.attachShadow({ mode: "open" });
      pdiv.appendChild(div);
      this.setState({ root: shadow, pdiv, div });
    }
  };

  componentWillUnmount() {
    if (this.state.pdiv && this.state.div) {
      this.state.pdiv.removeChild(this.state.div);
      this.setState({ root: null, div: null });
    }
  }

  render() {
    const { children } = this.props;
    const { root } = this.state;
    return (
      <div ref={this.setRoot}>
        {root && ReactDOM.createPortal(children, root)}
      </div>
    );
  }
}

