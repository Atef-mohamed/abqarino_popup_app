
salla.onReady(() => {
    CreateModal();
})



function CreateModal() {

    const data = window.abqarino_popup_var;

    if (!data) {
        console.log("Popup data not found");
        return;
    }

    const modal = document.createElement("salla-modal");
    modal.id = "subscribe-modal";

    modal.innerHTML = `
        <div style="padding:20px; text-align:center; background:${data.bg_color}; border-radius:${data.raduis_border}px;">
            
            <img src="${data.brand_logo}" style="max-width:120px; margin-bottom:15px;" />

            <p style="color:${data.txt_color}; font-size:18px;">
                ${data.brand_description}
            </p>

            <button style="background:${data.bg_btn_color}; color:#fff; padding:10px 20px; border:none; border-radius:8px; cursor:pointer;">
                ${data.txt_btn_ok}
            </button>

            <br/><br/>

            <button style="background:transparent; border:none; cursor:pointer;">
                ${data.txt_btn_cancel}
            </button>

        </div>
    `;

    document.body.appendChild(modal);

    modal.open();
}
