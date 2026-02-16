
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.createElement("salla-modal");
    modal.id = "subscribe-modal";
    document.body.appendChild(modal);

    const button = document.createElement("button");
    button.textContent = "Open Modal";

    button.setAttribute("data-modal-id", "subscribe-modal");

    button.addEventListener("click", function (event) {
        event.preventDefault();

        const modal = document.querySelector("#subscribe-modal");

        if (modal) {
            modal.open();
        } else {
            console.log("Modal not found");
        }
    });
    document.body.appendChild(button);

});
