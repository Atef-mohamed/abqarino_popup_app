
salla.onReady(() => {
    CreateModal();
});

function formatDate(date) {
    let d;
    if (typeof date === "number") {
        if (date < 10000000000) {
            d = new Date(date * 1000);
        } else {
            d = new Date(date);
        }
    } else if (typeof date === "string") {
        d = new Date(date);
    } else {
        d = new Date(date);
    }
    const formatted = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    return formatted;
}


function CreateModal() {

    const data = window.abqarino_popup_var;

    if (!data) {
        console.log("Popup data not found");
        return;
    }

    const modal = document.createElement("salla-modal");
    modal.id = "subscribe-modal";

    modal.innerHTML = `
        <div style="padding:20px; text-align:center; background:${data.bg_color};display:flex;  flex-direction:column; justify-content:center; align-items:center; border-radius:${data.raduis_border}px;">
            
            <img src="${data.brand_logo}" style="max-width:120px; margin-bottom:15px;" />

            <p style="color:${data.txt_color}; font-size:18px;">
                ${data.brand_description}
            </p>
            
            <salla-count-down date="${formatDate(data.discount_time)}" end-of-day="true" boxed="true" labeled="true"></salla-count-down>

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

