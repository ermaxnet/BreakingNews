import HamburgerMenu from "./common/menu";
import moment from "moment";
import "styles.scss";

moment.locale("ru");

const menu = new HamburgerMenu(".navigation");
window.addEventListener("load", menu.run.bind(menu));