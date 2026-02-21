
salla.onReady(() => {
    CreateModal();

    injectStyle();

    CLoseModalButton();
    handleModalPrimaryBtn()
    CopyPromotionCode();

    getProduct().then(products => {
        renderProducts(products);
    });
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
        return;
    }

    modal = document.createElement("salla-modal");
    modal.id = "subscribe-modal";

    modal.innerHTML = `
        <div class="modal-h" style="padding:20px; text-align:center; background:${data.bg_color};display:flex; flex-direction:column; justify-content:center; align-items:center; border-radius:${data.raduis_border}px;">
        <div class="content-top-side"  >
            ${data.brand_logo ? `
            <img src="${data.brand_logo}" style="    border-radius: 12px;
                object-fit: cover;
                aspect-ratio: 1 / 1;" />
            `: ``}
            
            <div class="content" style="display: flex;flex-direction: column; ${!data.brand_logo ? 'align-items: center; text-align: center;' : ''}">
                ${data.brand_description ? `
                <p style="color:var(--color-primary); font-size: 33px;font-weight: 700;padding: 20px;">
                    ${data.brand_description}
                </p>
                `: ``}
                ${data.brand_description2 ? `
                <p style="color:var(--color-primary);opacity:0.6; font-size: 16px;padding: 4px;">
                    ${data.brand_description2}
                </p>
                `: ``}

                ${data.discount_time ? `
                    <salla-count-down date="${formatDate(data.discount_time)}" end-of-day="true" boxed="true" labeled="true"></salla-count-down>
                `: ``}
                
                 ${data.procode_txt ? `
                        <div class="copy-box">
                            <p>نسخ كود الخصم</p>
                            <div id="copyText">${data.procode_txt}</div>
                            <button id="copyBtn" class="copy-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                </svg>
                            </button>
                        </div>
                `: ``}

             ${data.txt_btn_ok ? `
                    <button class="ok-modal-btn" style="background: var(--color-primary); color:var(--color-primary-reverse); padding:10px 20px; border:none; border-radius:8px; cursor:pointer;">
                        ${data.txt_btn_ok}
                    </button>
                    `: ``}

                ${data.txt_btn_cancel ? `
                <button class="close-modal-btn" style="background:transparent; border:none; text-decoration: underline; cursor:pointer;">
                    ${data.txt_btn_cancel}
                </button>
                `: ``}

            </div>
        </div>
           ${data.dropdown_list ? `
                <div id="products-container" class="products-container">
                </div>
                `: ``}
        </div>
    `;

    document.body.appendChild(modal);
    modal.open();
}

// get product
function getProduct() {
    const raw = window.abqarino_popup_var.dropdown_list;

    const productIds = Array.isArray(raw) ? raw : JSON.parse(raw);

    const requests = productIds.map(id =>
        salla.product.getDetails(id, ["brand", "category"]).then(response => {
            return response.data || response;
        })
    );

    return Promise.all(requests);
}

// render products
function renderProducts(products) {

    const container = document.querySelector("#products-container");
    if (!container) return;

    container.innerHTML = "";

    if (products.length === 1) {
        container.style.width = "auto";
        container.style.maxWidth = "600px";
        container.style.margin = "20px auto";
    } else {
        container.style.width = "100%";
        container.style.margin = "20px 0";
    }

    if (products.length === 1) {
        products.forEach(product => {

            const productCard = document.createElement("div");
            productCard.classList.add("product-card");

            productCard.innerHTML = `
            <div class="product-img">
                ${product.image ? `
                    <img src="${product.image.url}" 
                         alt="${product.name}"
                         style="max-width:100%;">
                ` : ``}
            </div>

            <div class="product-content">
                <h3 class="product-title">${product.name || ""}</h3>

                <p class="prices">
                    ${product.sale_price ? `
                        <span class="sale_price">
                            ${product.sale_price} ${product.currency || ""}
                        </span>
                    ` : ``}

                    ${product.regular_price ? `
                        <span class="discount_price">
                            ${product.regular_price} ${product.currency || ""}
                        </span>
                    ` : ``}
                    </p>
                    <div class="product-buttons">
                        <salla-add-product-button 
                            product-id="${product.id}">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6 2l1.5 4h9L18 2H6zm-1 6h14l-1.5 12h-11L5 8z"/>
                                </svg>
                        </salla-add-product-button>
                    </div>

            </div>
        `;
            container.appendChild(productCard);
        });
    }
    else {
       //  Slider config
        const sliderConfig = {
            autoHeight: true,
            loop: true,
            keyboard: { enabled: true },
            grabCursor: true,
            speed: 500,
            slidesPerView: 1,
            spaceBetween: 10,

            breakpoints: {
                768: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 10
                }
            }
        };

        // Create slider wrapper
        container.innerHTML = `
        <salla-slider id="products-slider" show-controls="true" slider-config='${JSON.stringify(sliderConfig)}'>
            <div slot="items" class="products-slides"></div>
        </salla-slider>
    `;

        //  Get slides container
        const slidesContainer = container.querySelector(".products-slides");

        // Loop products and add to slider
        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card", "swiper-slide");

            productCard.innerHTML = `
            <div class="product-img">
                ${product.image ? `
                    <img src="${product.image.url}" 
                         alt="${product.name}"
                         style="max-width:100%;">
                ` : ""}
            </div>

            <div class="product-content">
                <h3 class="product-title">${product.name || ""}</h3>

                ${product.brand?.name ? `
                    <p class="brand-name">${product.brand.name}</p>
                ` : ""}
                    <div class="product-content-bottom">
                        <p class="prices">
                            ${product.sale_price ? `
                                <span class="sale_price">
                                    ${product.sale_price} ${product.currency || ""}
                                </span>
                            ` : ""}

                            ${product.regular_price ? `
                                <span class="discount_price">
                                    ${product.regular_price} ${product.currency || ""}
                                </span>
                            ` : ""}
                        
                        </p>
                        <div class="product-buttons">
                            <salla-add-product-button 
                                product-id="${product.id}">
                                    <i class="text-base sicon-shopping-bag"></i>
                            </salla-add-product-button>
                        </div>
                    </div>
            </div>
        `;

            // Cancel button
            const cancelBtn = productCard.querySelector(".cancel-btn");
            if (cancelBtn) {
                cancelBtn.addEventListener("click", () => {
                    productCard.style.display = "none";
                });
            }

            //  Append to slider
            slidesContainer.appendChild(productCard);
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

function handleModalPrimaryBtn() {
    const data = window.abqarino_popup_var;
    const btn = document.querySelector('.ok-modal-btn');

    if (!btn || !data?.btn_link) return;

    btn.addEventListener('click', () => {
        window.location.href = data.btn_link;
    });
}

// promotion code 
function CopyPromotionCode() {
    const copyBtn = document.getElementById("copyBtn");
    const copyText = document.getElementById("copyText");

    copyBtn.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(copyText.innerText);

            // Toast Success
            salla.notify.success("تم نسخ كود الخصم 🎉");

            // Change button state
            copyBtn.classList.add("active");
            copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>`;

            // Reset after 2 seconds
            setTimeout(() => {
                copyBtn.classList.remove("active");
                copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                    </svg>`;
            }, 2000);

        } catch (err) {
            //Toast Error
            salla.notify.error("فشل نسخ الكود ❌");
        }
    });
}


// css style
function injectStyle() {
    const data = window.abqarino_popup_var;
    const bgColor = data.bg_color;

    const style = document.createElement("style");

    style.innerHTML = `
     @media (max-width:768px){
        .modal-h{
            max-height: 90vh;
        }
    }
    .content-top-side{
        display: grid;
        grid-template-columns: ${data.brand_logo ? 'repeat(2, 1fr)' : '1fr'};
        align-items: center;
        gap: ${data.brand_logo ? '90px' : '0px'};
    }
        @media (max-width:768px){
            .content-top-side {
                grid-template-columns: repeat(1, 1fr) !important;
                gap: 0px !important;
            }
        }
        #subscribe-modal  .s-modal-body{
            background-color: ${bgColor};
            overflow: hidden;
        }
        #subscribe-modal   .s-modal-close{
            background-color: ${bgColor};
        }
        #subscribe-modal .s-modal-body {
            max-width: 70% !important;
        }      
        @media (max-width:768px){
         #subscribe-modal .s-modal-body {
            max-width: 100% !important;
        }  
        }     
        #subscribe-modal .s-modal-content {
            overflow: hidden;
            max-width: 100%;
        }
        #subscribe-modal .swiper-slide{
            width:unset !important;
        }
      #subscribe-modal  .products-container {
            overflow: hidden;
        }

     #subscribe-modal   #products-slider {
            width: 100%;
            overflow: hidden;
        }

     #subscribe-modal   .products-slides {
            width: 100%;
        }

      #subscribe-modal  .swiper-pagination {
            position: relative;
            margin-top: 15px;
        }

      #subscribe-modal  .s-count-down-list {
            display: flex;
            align-items: center;
            list-style: none;
            padding: 0;
            gap: 8px;
        }

       #subscribe-modal .s-count-down-item {
            text-align: center;
            position: relative;
            padding:20px;
        }
        
       #subscribe-modal .s-count-down-item-value {
            font-size: 24px;
            font-weight: 700;
        }
        
       #subscribe-modal .s-count-down-item-label {
            font-size:14px;
            margin-top: 4px;
        }
            
      #subscribe-modal .product-card {
            display: flex;
            gap: 20px;
            align-items: center;
            margin-bottom: 22px;
            backdrop-filter: contrast(0.5);
            border-radius: 12px;
            padding: 5px;
            color:var(--color-primary-reverse);
            height: auto;
            box-sizing: border-box;
        }

      #subscribe-modal .product-card .product-img {
            flex: 0 0 95px; 
        }

       #subscribe-modal .product-card .product-img img {
            width: 100%;
            height: auto;
            display: block;
            border-radius:4px;
        }

       #subscribe-modal .product-card .product-content {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
        }

      #subscribe-modal  .product-card .product-title {
            font-size: 1.25rem;
            font-weight: 700;
            margin: 0;
        }

      #subscribe-modal .product-card .prices {
            display: flex;
            align-items: center;
            gap: 10px;
        }

      #subscribe-modal  .product-card .sale_price {
            color: var(--color-primary);
            font-weight: 700;
            font-size: 1rem;
        }

       #subscribe-modal  .product-card .discount_price {
            text-decoration: line-through;
            opacity: 0.5;
            font-size: 0.8rem;
        }

       #subscribe-modal  .product-card .product-buttons {
            display: flex;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap;
        }

       #subscribe-modal  .product-card salla-add-product-button {
            background:var(--color-primary-light);
            font-weight: bold;
            cursor: pointer;
            user-select: none;
            border-radius: 16px;
        }
        
        #subscribe-modal .product-card button:hover {
            background: transparent;
        }

        #subscribe-modal .product-card button {
            background: transparent;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 0.9rem;
        }
        
        #subscribe-modal .cancel-btn {
            text-decoration: underline;
        }
        
        #subscribe-modal .copy-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            align-self: center;
            width: 65%;
            gap: 8px;
            padding: 8px 12px;
            margin: 10px 0;
            border: 1px dashed #3cb646;
            border-radius: 6px;
            white-space: nowrap;        
        }
        #copyText{
            color: #3cb646;
        }
        #copyBtn{
            color: #3cb646;
            
        }
        .copy-box p {
            color: #3cb646;
            font-weight: 600;
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
        #subscribe-modal   .product-content-bottom{
                display: flex;
                gap: 20px;
                flex-wrap: wrap;
            }
    `;

    document.head.appendChild(style);
}
