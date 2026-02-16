
salla.onReady(() => {
    CreateModal();
})



function CreateModal() {
    const modal = document.createElement("salla-modal");
    modal.id = "subscribe-modal";
    document.body.appendChild(modal);

    const button = document.createElement("button");
    button.textContent = "Open Modal";
    button.setAttribute("data-modal-id", "subscribe-modal");

    modal.open();
    document.body.appendChild(button);
}