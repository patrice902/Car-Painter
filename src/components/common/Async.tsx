import React from "react";

import ScreenLoader from "./ScreenLoader";

interface AsyncComponentState {
  component: React.FC | null;
}

export interface AsyncComponentType {
  default: React.FC;
}

export const asyncComponent = (
  importComponent: () => Promise<AsyncComponentType>
) => {
  class AsyncComponent extends React.Component<unknown, AsyncComponentState> {
    constructor(props: unknown) {
      super(props);

      this.state = {
        component: null,
      };
    }

    async componentDidMount() {
      const { default: component } = await importComponent();

      this.setState({
        component,
      });
    }

    render() {
      const C = this.state.component;

      return C ? <C {...this.props} /> : <ScreenLoader />;
    }
  }

  return AsyncComponent;
};

export default asyncComponent;
