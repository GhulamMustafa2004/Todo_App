const loaderContainer = document.createElement("div");
loaderContainer.id = "loader-container";

const loader = document.createElement("div");
loader.id = "loader";

loaderContainer.appendChild(loader);
document.body.appendChild(loaderContainer);

function loaderShow() {
  loaderContainer.style.display = "flex";
}

function loaderHide() {
  loaderContainer.style.display = "none";
}
