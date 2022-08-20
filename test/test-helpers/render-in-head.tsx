import { render } from "@testing-library/react";

const renderInHead = (component: JSX.Element) =>
  render(component, {
    container: document.head
  });
export default renderInHead;
