function HamburgerMenu(context) {
    this.context = context;
};
HamburgerMenu.prototype.run = function() {
    this.nav = document.querySelector(this.context);
    this.nav.querySelector("[data-hamburger-button]")
        .addEventListener("click", this.onClick.bind(this));
};
HamburgerMenu.prototype.onClick = function(e) {
    if(e) {
        e.preventDefault();
    }
    document.body.classList.toggle("menu--opened");
    this.nav.classList.toggle("menu--opened");
}

export default HamburgerMenu;