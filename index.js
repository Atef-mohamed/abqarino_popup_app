
salla.onReady(() => {
    CreateModal();
    salla.onReady(() => {
        getProduct().then(product => {
            renderProduct(product);
        });
    });
    console.log(getProduct());
    injectStyle();

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

    modal = document.createElement("salla-modal");
    modal.id = "subscribe-modal";

    modal.innerHTML = `
        <div style="padding:20px; text-align:center; background:${data.bg_color};display:flex;  flex-direction:column; justify-content:center; align-items:center; border-radius:${data.raduis_border}px;">
            
            <img src="${data.brand_logo}" style="max-width:120px; margin-bottom:15px;" />

            <p style="color:${data.txt_color}; font-size:18px;">
                ${data.brand_description}
            </p>
            
            <salla-count-down date="${formatDate(data.discount_time)}" end-of-day="true" boxed="true" labeled="true"></salla-count-down>
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
                        <button style="background:transparent; border:none; cursor:pointer;">
                            لا,شكرا
                        </button>
                    </div>
                </div>
            </div>
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
        salePrice.textContent = product.sale_price +" "+ product.currency || "";
    }
    // price_discount
    const discountPrice = productCard.querySelector(".discount_price");
    if (discountPrice && product.regular_price) {
        discountPrice.textContent = product.regular_price +" "+ product.currency || "";
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

    const addButton = productCard.querySelector("salla-add-product-button");
    if (addButton) {
        addButton.setAttribute("product-id", product.id);
    }
}


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
            background: #000;
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
            padding: 10px 25px;
            font-weight: bold;
            cursor: pointer;
            user-select: none;
            text-decoration: none;
        }
            .product-card button:hover{
                background:#ffffff;
            }

        .product-card button {
            background: transparent;
            border: none;
            color: white;
            cursor: pointer;
            text-decoration: underline;
            font-size: 0.9rem;
        }

    `;

    document.head.appendChild(style);
}
