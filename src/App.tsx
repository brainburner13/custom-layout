import React from "react";

import Header from "./app/header";
import Content from "./app/content";

class App extends React.PureComponent {
  render() {
    return (
      <div>
        <Header/>
        <Content/>
      </div>
    );
  }
}

export default App;
