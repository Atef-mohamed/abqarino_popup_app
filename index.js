
salla.onReady(() => {
    CreateModal();

    getProduct().then(product => {
        renderProduct(product);
    });
    injectStyle();

    CLoseModalButton();
    handleModalPrimaryBtn()
    CopyPromotionCode();
});

// foramt date
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

    modal = document.createElement("salla-modal");
    modal.id = "subscribe-modal";

    modal.innerHTML = `
        <div style="padding:20px; text-align:center; background:${data.bg_color};display:flex; flex-direction:columns; justify-content:center; align-items:center; border-radius:${data.raduis_border}px;">
        <div class="content-top-side"  style="display:flex; text-align:center; justify-content:center; align-items:center;>
        
            <img src="${data.brand_logo}" style="max-width:120px; margin-bottom:15px;" />
            
            <div class="content">
                <p style="color:${data.txt_color}; font-size:18px;">
                    ${data.brand_description}
                </p>
                
                <salla-count-down date="${formatDate(data.discount_time)}" end-of-day="true" boxed="true" labeled="true"></salla-count-down>
            
                <button class="ok-modal-btn" style="background:${data.bg_btn_color}; color:#fff; padding:10px 20px; border:none; border-radius:8px; cursor:pointer;">
                    ${data.txt_btn_ok}
                </button>

                <div class="copy-box">
                    <p>نسخ كود الخصم</p>
                    <div id="copyText">${data.procode_txt}</div>
                    <button id="copyBtn" class="copy-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                        </svg>
                    </button>
                </div>


                <button class="close-modal-btn" style="background:transparent; border:none; text-decoration: underline; cursor:pointer;">
                    ${data.txt_btn_cancel}
                </button>


            </div>
        </div>
           
         <div id="product-card" class="product-card">
                <div class="product-img">
                
                </div>
                <div class="product-content">
                    <h3 class="product-title"></h3>
                    <p class="prices">
                        <span class="sale_price"></span>
                        <span class="discount_price"></span>
                    </p>
                    <div class="product-buttons">
                        <salla-add-product-button width="wide" product-id="">
                            Add to Cart
                        </salla-add-product-button>
                        <button class="cancel-btn" style="background:transparent; border:none; cursor:pointer;">
                            لا,شكرا
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.open();
}

// get product
function getProduct() {

    const productId = window.abqarino_popup_var.dropdown_list;

    return salla.product.getDetails(productId).then(response => {
        return response.data || response;
    });
}

// render product content
function renderProduct(product) {

    const productCard = document.querySelector("#product-card");

    if (!productCard) return;
    // title
    const title = productCard.querySelector(".product-title");
    if (title) {
        title.textContent = product.name;
    }
    // sale price
    const salePrice = productCard.querySelector(".sale_price");
    if (salePrice) {
        salePrice.textContent = product.sale_price + " " + product.currency || "";
    }
    // price_discount
    const discountPrice = productCard.querySelector(".discount_price");
    if (discountPrice && product.regular_price) {
        discountPrice.textContent = product.regular_price + " " + product.currency || "";
    }
    // product image
    const imageContainer = productCard.querySelector(".product-img");
    if (imageContainer && product.image) {
        imageContainer.innerHTML = `
            <img src=${product.image.url} 
                 alt="${product.name}"
                 style="max-width:100%;">
        `;
    }
    // add product to cart
    const addButton = productCard.querySelector("salla-add-product-button");
    if (addButton) {
        addButton.setAttribute("product-id", product.id);
    }
    // cancle product
    const cancelBtn = productCard.querySelector(".cancel-btn");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            productCard.style.display = "none";
        });
    }

}

// close btn button
function CLoseModalButton() {
    // close modal
    const closeModal = document.querySelector(".close-modal-btn");
    const modal = document.querySelector("#subscribe-modal");
    if (closeModal) {
        closeModal.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }
}

// save btn button
function handleModalPrimaryBtn() {
    const data = window.abqarino_popup_var;
    const btn = document.querySelector('.ok-modal-btn');

    btn.addEventListener('click', () => {
        window.location.href = data.btn_link;
    });


}

// promotion code 
function CopyPromotionCode(params) {
    const copyBtn = document.getElementById("copyBtn");
    const copyText = document.getElementById("copyText");

    copyBtn.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(copyText.innerText);

            // Change button state
            copyBtn.classList.add("active");
            copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg> `;

            // Reset after 2 seconds
            setTimeout(() => {
                copyBtn.classList.remove("active");
                copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                    </svg>`;
            }, 2000);

        } catch (err) {
            console.error("Copy failed:", err);
        }
    });

}
// css style
function injectStyle() {
    const data = window.abqarino_popup_var;
    const bgColor = data.bg_color;
    const mainColor = data.bg_btn_color;

    const style = document.createElement("style");

    style.innerHTML = `
        #subscribe-modal {
            background-color:${bgColor};
        }
        .s-count-down-list {
            display: flex;
            align-items: center;
            list-style: none;
            padding: 0;
            gap: 8px;
        }

        .s-count-down-item {
            text-align: center;
            position: relative;
        }

        .s-count-down-item-value {
            background: ${mainColor};
            color: #ffffff;
            padding: 10px 14px;
            border-radius: 8px;
            font-size: 20px;
            font-weight: bold;
            min-width: 40px;
        }
        .s-count-down-item-label {
            font-size: 12px;
            margin-top: 4px;
        }
            
        .product-card {
            display: flex;
            gap: 20px;
            align-items: center;
            margin-bottom: 22px;
            background: #38352c65;
            border-radius: 12px;
            padding: 20px;
            color: #fff;
        }

        .product-card .product-img {
            flex: 0 0 100px; 
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0,0,0,0.7);
        }

        .product-card .product-img img {
            width: 100%;
            height: auto;
            display: block;
        }

        .product-card .product-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 12px;
        }

        .product-card .product-title {
            font-size: 1.25rem;
            font-weight: 700;
            margin: 0;
        }

        .product-card .prices {
            font-size: 1rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .product-card .sale_price {
            color:red;
            font-weight: 700;
            font-size: 1.3rem;
        }

        .product-card .discount_price {
            text-decoration: line-through;
            opacity: 0.5;
            font-size: 1rem;
        }

        .product-card .product-buttons {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .product-card salla-add-product-button {
            background:${mainColor};
            color:#ffffff;
            border-radius: 50px;
            font-weight: bold;
            cursor: pointer;
            user-select: none;
        }
            .product-card button:hover{
                background:transparent;
            }

        .product-card button {
            background: transparent;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 0.9rem;
        }
        .cancel-btn{
            text-decoration: underline;
        }
        .copy-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            padding: 8px 12px;
            border: 1px dashed #3cb646;
            border-radius: 6px;
            background-color: #e3f2fd;

            white-space: nowrap;        
        }
        .copy-box p{
            color:#3cb646;
            text-weight:semibold;
        }
        .copy-btn {
            display: flex;             
            align-items: center;
            width: 25px;
            cursor: pointer;
            border: none;
            background: transparent;
            flex-shrink: 0;            
        }


        .copy-btn.active {
            color: green;
        }

    `;

    document.head.appendChild(style);
}
