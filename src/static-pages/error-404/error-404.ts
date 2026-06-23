import { Component } from "../../utils/base-component";
import errorHtml from "./error-404.html?raw";
import styles from "./error-404.css?inline";

// static-pages/error-404.ts
class PageError404 extends Component {
  static html = errorHtml;
  static styles = styles;
}
if (!customElements.get("page-error-404")) {
  customElements.define("page-error-404", PageError404);
}

export default PageError404;
