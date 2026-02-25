$(document).ready(function () {
    let feedbackSlider;
    // Check If Product Page
    function isProductPage() {
        return window.location.pathname.includes("/products/");
    }
    // Fetch Quick View Data
    async function fetchQuickViewData(product_handler) {
        //console.time("Fetch Quick View Data");
        try {
            const showMoreSwatch = document.querySelector("#product_Quick_View").getAttribute('sectionId');
            const sectionUrl = `/products/${product_handler}?section_id=${showMoreSwatch}`;
            const response = await axios.get(sectionUrl);
            $(".pdp_quick_view").replaceWith(response.data);
        } catch (error) {
            console.error("Error fetching quick view data:", error.message);
        }
        //console.timeEnd("Fetch Quick View Data");
    }
    async function quickViewOpener() {
        const pdp_MediaData = JSON.parse($(this).attr("pdp_MediaData"));
        const quickTogglebtnHandle = $(this).attr("data-quickviewHandle");
        if (!pdp_MediaData.length) {
            return alert("Media Image is Empty");
        }
        const firstImgPos = parseInt($(this).attr("firstImgPos"), 10) || 0;
        const sliders = "#quick_view_image_slider";
        if (!($("#product_Quick_View").hasClass("quick-view-slide-open"))) {
            $("#product_Quick_View").addClass("quick-view-slide-open");
        }
        $(".hok-quick-view").empty().append(`
            <div id="quickview-spinner-wrapper" class="d-center h-100">
              <span class="quick_view_loader">
                <wbr>
              </span>
            </div>`);
        $(".quickview-overlay").addClass("quickview-overlay-open");
        $("html").addClass("overflow-hidden");

        try {
            // Fetch Quick View Data
            await fetchQuickViewData(quickTogglebtnHandle);
            // Create Swiper Slides
            const $swiperWrapper = $("<div>", { class: "swiper-wrapper" });
            pdp_MediaData.forEach((media) => {
                const $imgContainer = $("<div>", { class: "quick-view-slide swiper-slide" });
                let productMedia;

                if (media.media_type.toLowerCase() === "image") {
                    productMedia = $("<img>", {
                        src: media.src,
                        alt: media.alt,
                        mediaId: media.id,
                        position: media.position,
                        class: "img-fluid asp34 quickMedia",
                    });
                } else if (media.media_type.toLowerCase() === "video") {
                    productMedia = $("<video>", {
                        src: media.sources[0].url,
                        type: media.sources[0].mime_type,
                        poster: media.preview_image.src,
                        alt: media.alt,
                        autoplay: true,
                        loop: true,
                        muted:true, 
                        playsinline:true,
                        mediaId: media.id,
                        position: media.position,
                        class: "img-fluid asp34 quickMedia",
                    });
                   //  
                    productMedia[0].muted = true;
                }

                $imgContainer.append(productMedia);
                $swiperWrapper.append($imgContainer);
            });
            $swiperWrapper.appendTo(sliders);
            // Append Swiper Wrapper
            //$(sliders).empty().append($swiperWrapper);
            // Initialize Swiper
            feedbackSlider = new Swiper(sliders, {
                slidesPerView: 1.4,
                spaceBetween: 13,
                freeMode: true,
                navigation: {
                    prevEl: "#quick_view_image_container .quick-view-prev",
                    nextEl: "#quick_view_image_container .quick-view-next",
                },
                pagination: {
                    el: ".quick-view-slider-pagination",
                    type: "progressbar",
                },
            });
            feedbackSlider.slideTo(firstImgPos - 1, 500, false);
            // Show Quick View
            $(sliders).fadeIn(100);
        } catch (error) {
            console.error("Error initializing Quick View:", error.message);
            $(".quickview-overlay").removeClass("quickview-overlay-open");
            $("html").removeClass("overflow-hidden");
        }
    }

    // Open Quick View
    $("body").on("click", 'button[data-quickviewslide="open"]', quickViewOpener);
    $("body").on("click", "fieldset.swatch-picker.d-flex.align-items-center.gap-2", function () {
        const button = $(this).next('.b-product_promo_tile-buynow').find('button[data-quickviewslide="open"]');
        if (button.length) {
            quickViewOpener.call(button[0]); // Call the function with the button element as `this`
        }
    });



    //Change Swatch For QuickView and Product Page
    function changeSwatch() {
        let $this = $(this),
            productId = $this.attr("productId"),
            optionValue = $this.attr("value"),
            optionIndex = Number($this.attr("index")),
            imagePosition = Number($this.attr("imagePosition")),
            variantName = $this.attr("variantid"),
            varientPrice = parseFloat($this.attr("varientPrice").replace(/,/g, '')),
            rackPrice = parseFloat($this.attr("rackPrice").replace(/,/g, '')),
            isAvailable = String($this.attr("availability")).toLowerCase() === "true",
            sectionParam = $this.attr("section_Id"),
            discountedPercentage = Math.round(
                ((rackPrice - varientPrice) / rackPrice) * 100
            ),
            $container = isProductPage()
                ? $this.closest(".product-details-container")
                : $this.closest(".quick-view-slide-container"),
            $shadeSpan = $container.find(
                isProductPage() ? ".current-shade span" : ".quick-view-current-shade span"
            ),
            $addToBagBtn = $container.find(
                isProductPage() ? ".add-to-bag-btn button" : ".add-quick-bag-btn"
            ),
            $addToNotifier = $container.find(
                isProductPage()
                    ? ".add-to-bag-btn div[notifyBtn]"
                    : ".add-quick-bag-btn-notify"
            ),
            //$addToNotifier = !(isProductPage()) ?  $container.find( ".add-quick-bag-btn-notify"): false,
            $giftButton = isProductPage()
                ? $container.find("input[data-type='hey-paradise-gifts']")
                : false,
            $priceContainer = $container.find(
                isProductPage() ? ".product-prices" : ".quick-view-price"
            ),
            $swatchContainer = $container.find(
                isProductPage() ? ".product-varient-selector" : ".quick-view-shades"
            ),
            dropname = $container
                .find(`.dropdown-shades[value="${optionValue}"]`)
                .html(),
            currentUrl = window.location.href.replace(/\?variant=\d+/, ""),
            modifiedUrl = currentUrl + `?variant=${optionValue}`;
        if (isAvailable) {
            $addToBagBtn.show();
            $addToNotifier.hide();
            //!(isProductPage()) && $addToNotifier.addClass('d-none');
        } else {
            $addToBagBtn.hide();
            $addToNotifier.show();
            //!(isProductPage()) && $addToNotifier.removeClass('d-none');
        }
        if (isProductPage()) {
            $(window).width() >= 992 && vertical_slider.goTo(imagePosition - 1);
            mainSlider.goTo(imagePosition - 1);
            $shadeSpan.text(variantName);
            $addToBagBtn.attr("data-product_id", optionValue);
            $priceContainer.find(".selling-price").text(`₹${varientPrice}`);

            if (rackPrice > varientPrice) {
                $priceContainer.find(".old-price").text(`₹${rackPrice}`);
                $priceContainer.find(".discount").text(`${discountedPercentage}% Off`);
                $priceContainer.find(".old-price, .discount").show();
            } else {
                $priceContainer.find(".old-price, .discount").hide();
            }
            $(`.swatch_available[index="${optionIndex}"]`).prop("checked", true);
            $(".dropdown-selected-shade").html(dropname);
            $giftButton && $giftButton.attr("value", optionValue);
            history.replaceState(null, null, modifiedUrl);
        } else {
            $(`.quick-view-slider`).fadeOut(
                100,
                function () {
                    feedbackSlider.slideTo(imagePosition - 1, 100, true);
                    $(`.quick-view-slider`).fadeIn(100);
                }
            );

            $shadeSpan.text(variantName);
            $addToBagBtn.attr("data-product_id", optionValue);
            $priceContainer.find(".selling-price").text(`₹${varientPrice}`);
            $swatchContainer
                .find(`.swatch_available[variantId="${variantName}"]`)
                .prop("checked", true);
            $swatchContainer
                .find(`.dropdown-selected-shade[section_Id="${sectionParam}"]`)
                .html(dropname);
            if (rackPrice > varientPrice) {
                $priceContainer.find(".old-price").text(`₹${rackPrice}`);
                $priceContainer.find(".discount").text(`${discountedPercentage}% Off`);
                $priceContainer.find(".old-price, .discount").show();
            } else {
                $priceContainer.find(".old-price, .discount").hide();
            }
            //$container.find(".view-product-btn").attr('href', modifiedUrl);
        }
    }
    // Varinat Dropdown
    function forDropMobile(string) {
        $(".product-adding-for-mobile").css({
            display: string,
        });
        $(".dropdown-color-name").css({
            "max-width": "80px",
        });
        $(".dropdown-button").css({
            "border-radius": "50px",
        });
    }

    $("body").on("click", ".dropdown-button", function () {
        if ( $(".dropdown-content").css('display') === 'block') {
            $(".dropdown-content").hide(); // Hides the element
            return $(".shadow-dropdown-icon").removeClass("flip-dropdown-icon");
        }
        
        $(".dropdown-content").show();
        $(".shadow-dropdown-icon").addClass("flip-dropdown-icon");
        if (under992) {
            //add
            $(".product-adding-for-mobile").css({
                display: "block",
            });
            $(".dropdown-color-name").css({
                "max-width": "100%",
                overflow: "hidden",
                "text-overflow": "ellipsis",
            });
            $(".dropdown-button").css({
                "border-radius": "8px",
            });
        }
    });
    $("body").on("change", ".quick_view_swatches :radio", function () {
        changeSwatch.call(this)
    });
    $("body").on("click", ".dropdown-content li", function () {
        changeSwatch.call(this); // Pass the clicked element to the function
        var selectedOption = $(this).html();
        $(".dropdown-selected-shade").html(selectedOption);
        $(".shadow-dropdown-icon").removeClass("flip-dropdown-icon");
        $(".dropdown-content").hide();
        under992 && forDropMobile("flex");
    });

    // For Closing Quick View Slider
    const closeQV = () => {
        $(".quick-view-slide-container").removeClass("quick-view-slide-open");
        $(".quickview-overlay").removeClass("quickview-overlay-open");
        $(".account-auth-container").removeClass("toggle-account-container");
        $(".overlay-container").removeClass("overlay-open");
        $(".filter-container").show();
        $("html").removeClass("overflow-hidden");
    };

    $("body").on("click", ".close_overlay", function () {
        closeQV();
    });

    $("body").on("click", ".quick-view-main-container .add-quick-bag-btn", async function (event) {
        event.preventDefault();
        let productkey = $(event.target).attr("data-product_id");
        await reUseCart(event, "/cart/add.js", productkey, 1);
        closeQV();
    });
});