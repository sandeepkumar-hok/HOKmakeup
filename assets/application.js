//Cart Fetch
const fetchCart = (data) => {
  const { items, sections } = data,
    $cartWrapper = $(sections["main-cart-drawer"]).find(
      ".b-mini_cart-container"
    );
  $(".b-mini_cart-container").replaceWith($cartWrapper);
};

// Curreny Formatter Pipe
function changeToCurrency(amount) {
  return Number(amount / 100).toLocaleString(void 0, {
    minimumFractionDigits: 2,
  });
}

// Prevent Event Form
const onSubmit = (event) => {
  event.preventDefault();
};

//Initialize variables
let newSlide = document.querySelector(".b-mini_cart-popover"),
  openedSlider = document.querySelector(".h-hamburger"),
  navv = document.querySelector(".h-hamburger-navigation_content"),
  addVariants = document.getElementById("b-show-more"),
  showMoreSwatch = document.querySelector(".b-swatch_colors-wrapper"),
  overlayBg = document.getElementById("bg_dark"),
  bgLoader = document.querySelector(".bg-loader"),
  under992 =
    $(window).width() <= 992 &&
    window.location.href.indexOf("www.hokmakeup.com/products/") > -1;
var feedbackSlider,
  size = window.matchMedia("(max-width: 700px)"),
  maccor = "m-accordion-expanded",
  productFirstVariant = document.querySelectorAll(".b-add_to_bagId");

// Openeing Cart Slider
// const cartSlide = () => {
//   $("#toastifies").hide(),
//     //$(".b-mini_cart-container").load(location.href + " .b-mini_cart-container"),
//     newSlide.classList.contains("show_Slider")
//       ? (newSlide.classList.remove("show_Slider"),
//         $("#bg_dark").removeClass("cartOverlay"))
//       : ((newSlide.className += " show_Slider"),
//         $("#bg_dark").addClass("cartOverlay"));
// };

// Closing Cart Slider
const closeSlider = () => {
  overlayBg.classList.remove("overlay", "newOverlay", "cartOverlay"),
    // openedSlider.classList.contains("m-hamburger_opened") &&
    // openedSlider.classList.remove("m-hamburger_opened"),
    newSlide.classList.contains("show_Slider") &&
      newSlide.classList.remove("show_Slider");
  // document.getElementById("headerSection").classList.contains("m-search_opened") &&
  // $("#headerSection").removeClass("m-search_opened"),
  // (window.location.href.toString().includes("collections") ||
  //     window.location.href.toString().includes("search?q=")) &&
  // document.getElementById("main-filter").classList.contains("m-refinements") &&
  // $("#main-filter").removeClass("m-refinements"),
  // $("#klkl").removeClass("actived"),
  // $("#djgjkfs").removeClass("sjdkdsdklsds"),
  // $("#djgjkfjs").removeClass("sflkgjf");
};
function updateCartBubble(cartCount) {
  const bubble = document.querySelector('.b-mini_cart-quantity_number');
  if (!bubble) return;

  if (Number(cartCount) > 0) {
    bubble.classList.remove('toggle-bubble');
    bubble.style.display = 'flex';
  } else {
    bubble.classList.add('toggle-bubble');
    bubble.style.display = 'none';
  }
}
// Adding Sku in Cart
const reUseCart = async (event, method, variant_id, qty) => {
  let is_cart_reccommend = $(event.currentTarget).is("[data-add]");
  const $target = $(event.currentTarget);
  if (is_cart_reccommend) {
    // Toggle visibility of icons
    $target.find('svg[data-icon="add"]').hide(); // Hide "add" icon
    $target.find('svg[data-icon="loader"]').show(); // Show "loader" icon
  } else {
    if (window.location.pathname === "/pages/dr-paw-paw") {
      $(event.target).text("+");
    } else {
      $(event.target).text("Adding To Bag...");
    }
  }
  const formData = JSON.stringify({
    id: variant_id,
    quantity: qty || 1,
    sections: "main-cart-drawer",
  });
  await axios
    .post(method, formData, {
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      if (is_cart_reccommend) {
        // Toggle visibility of icons
        $target.find('svg[data-icon="add"]').show(); // Show "add" icon
        $target.find('svg[data-icon="loader"]').hide(); // Hide "loader" icon
      } else {
        if (window.location.pathname === "/pages/dr-paw-paw") {
          $(event.target).text("+");
        } else {
          $(event.target).text("Add To Bag");
        }
      }
      $.ajax({
        type: "GET",
        url: "/cart.js",
        dataType: "json",
        success: function (cart) {
          $(".cartIconQty").text(cart.item_count);
           updateCartBubble(cart.item_count);
        },
        error: function (error) {
          console.error("Error fetching cart information:", error);
        },
      }),
        fetchCart(res.data),
        $(".b-mini_cart-popover").hasClass("show_Slider") ||
          ($("#toastifies").fadeIn(100),
          setTimeout(() => {
            $("#toastifies").fadeOut(100);
          }, 3000));
    })
    .catch((error) => {
      if (is_cart_reccommend) {
        // Toggle visibility of icons
        $target.find('svg[data-icon="add"]').show(); // Show "add" icon
        $target.find('svg[data-icon="loader"]').hide(); // Hide "loader" icon
      } else {
        $(event.target).text("Add To Bag");
      }
      console.error("Error:", error);
    });
};

// removing Cart Line Item from Cart
const removeItem = async (event, variant_id) => {
  $(".bg-loader").removeClass("d-none");
  const formData = JSON.stringify({
    id: `${variant_id}`,
    quantity: 0,
    sections: "main-cart-drawer",
  });
  await axios
    .post("/cart/change.js", formData, {
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      $.ajax({
        type: "GET",
        url: "/cart.js",
        dataType: "json",
        success: function (cart) {
          $(".cartIconQty").text(cart.item_count);
           updateCartBubble(cart.item_count);
        },
        error: function (error) {
          console.error("Error fetching cart information:", error);
        },
      }),
        fetchCart(res.data),
        $(".bg-loader").addClass("d-none");
    })
    .catch((error) => {
      $(".bg-loader").addClass("d-none"), console.error("Error:", error);
    });
};

//Opening Details
$("body").on(
  "click",
  ".b-nav-back_button, .b-nav-item_2.h-hamburger-item_2",
  function () {
    $(this).closest("details").removeAttr("open");
  }
); 


// Updating Quantity of Product SKU
$("body").on("click", ".qtybox .btnqty", function () {
  var qty = parseInt($(this).parent(".qtybox").find(".quantity-input").val()),
    inventoryQty = parseInt(
      $(this).parent(".qtybox").find(".quantity-input").attr("inventory")
    );
  $(this).hasClass("qtyplus")
    ? qty == inventoryQty
      ? $(".b-qty_selector-error").show("fast")
      : qty++
    : qty > 1 &&
      (qty == inventoryQty && $(".b-qty_selector-error").hide("fast"), qty--),
    (qty = isNaN(qty) ? 1 : qty),
    $(this).parent(".qtybox").find(".quantity-input").val(qty),
    $(".quantity-input").attr("value", qty);
});
// Open Slider
const openSlider = () => {
  openedSlider.classList.add("m-hamburger_opened"),
    $("#bg_dark").addClass("cartOverlay"),
    navv.classList.remove("hideElem");
};

// Opening Navigation Search
const navSearchBar = () => {
  $("#headerSection").hasClass("m-search_opened")
    ? ($("#headerSection").removeClass("m-search_opened"),
      $("#bg_dark").removeClass("overlay"),
      clearSearch())
    : ($("#headerSection").addClass("m-search_opened"),
      size && $("#bg_dark").addClass("overlay"),
      $("#Search").focus());
};

//Adding Product Cart by Default
const addtocart = async (index, event) => {
  event.preventDefault();
  let prokey = productFirstVariant[index].value;
  reUseCart(event, "/cart/add.js", prokey, 1);
};

//Adding Product Cart by using Quantity
const addToBag = async (event) => {
  let productKey = $("#b-add_to_bag-button").attr("product_variantId"),
    quant = $(".quantity-input").val();
  reUseCart(event, "/cart/add.js", productKey, quant);
};

//Adding Product Cart
$("body").on("click", "#main-product-handle-btn", async function (event) {
  let quant = Number(
      $("#main-product-handle").find("#main-product-handle-qty").val()
    ),
    productKey = Number($(this).attr("product_variantId"));
  await reUseCart(event, "/cart/add.js", productKey, quant);
});

// Adding Product from Product Pockets
$("body").on(
  "click",
  ".b-add_to_bag-button.button-cta.atc.pocket",
  async function (event) {
    event.preventDefault();
    let productkey = $(event.target).attr("cartid");
    await reUseCart(event, "/cart/add.js", productkey, 1);
  }
);

// Using openSlider Function
$("body").on("click", "#handle-open-slider", openSlider);

// Using navSearchBar Function
$("body").on(
  "click",
  "#handle-search-open, #handle-search-close",
  navSearchBar
);

// View Product Details from Glass Cards
$("body").on("click", ".view-glass-product", async function () {
  $(this).hide(100), $(this).next(".glass-product-overlay").addClass("active");
});
// Close Product Details from Glass Cards
$("body").on("click", ".handle_product_overlay", async function () {
  $(this)
    .parents(".glass-product-overlay")
    .prev(".view-glass-product")
    .show(100),
    $(this).parents(".glass-product-overlay").removeClass("active");
});

// Load More Functionality For Collection and Search Page
$("body").on("click", ".js-load-more", function () {
  var $this = $(this),
    totalPages = parseInt($("[data-all-pages]").val()),
    currentPage = parseInt($("[data-this-page]").val()),
    datacollurl = $("[data-coll-url]").val();
  $this.attr("disabled", !0),
    $this.find("[load-more-text]").addClass("hide"),
    $this.find("[loader]").removeClass("hide");
  var nextUrl = $("[data-next-link]").val(),
    current_page_new = currentPage + 1,
    next_coll = currentPage + 2;
  $("#skeleton").show(),
    $this.hide(),
    $.ajax({
      url: nextUrl,
      type: "GET",
      dataType: "html",
      success: function (responseHTML) {
        window.location.pathname.includes("/collections/")
          ? $("[data-next-link]").val(`${datacollurl}?page=${next_coll}`)
          : $("[data-next-link]").val(
              `/search?page=${next_coll}&q=${datacollurl}`
            ),
          $("[data-this-page]").val(current_page_new),
          $(".grid-loader").append($(responseHTML).find(".grid-loader").html());
      },
      complete: function () {
        current_page_new < totalPages &&
          ($this.attr("disabled", !1),
          $this.find("[load-more-text]").removeClass("hide"),
          $this.find("[loader]").addClass("hide")),
          current_page_new >= totalPages &&
            $this
              .find(".js-load-more")
              .text("No More Products Left")
              .removeClass("hide"),
          $("#skeleton").hide(),
          $this.show();
      },
    });
});

// Open Forget Model
// const forgotModal = () => {
//     $(".m-checkout_login").hasClass("tingle-modal--visible")
//       ? $(".m-checkout_login").removeClass("tingle-modal--visible")
//       : $(".m-checkout_login").addClass("tingle-modal--visible");
//   };

//Accordion Toggle control
$("body").on("click", ".b-accordion-control", function () {
  const expandAccordion = "m-accordion-expanded",
    closestAccordion = $(this).closest(".b-accordion.m-full");
  $(this).toggleClass(expandAccordion),
    closestAccordion
      .find(".b-accordion-container")
      .toggleClass(expandAccordion),
    closestAccordion.find(".b-accordion-item").toggleClass(expandAccordion);
});

//Opening Gifts on Cart Drawer
$("body").on("click", ".is-gift-criteria-opened", function () {
  $(".transparent-overlay").toggleClass("main-index");
  $("#available-gift-offers").toggleClass("show-offer");
});

// Toggle Accordion (Bad Code- Will Optimized Later)
const showAccordion = (sectionRef, macc = "m-accordion-expanded") =>
    $(`#${sectionRef}1`).hasClass(macc)
      ? ($(`#${sectionRef}1`).removeClass(macc),
        $(`#${sectionRef}2`).removeClass(macc),
        $(`#${sectionRef}3`).removeClass(macc))
      : ($(`#${sectionRef}1`).addClass(macc),
        $(`#${sectionRef}2`).addClass(macc),
        $(`#${sectionRef}3`).addClass(macc)),
  filter = () => {
    $("#main-filter").hasClass("m-refinements")
      ? ($("#main-filter").removeClass("m-refinements"),
        $("#bg_dark").removeClass("cartOverlay"))
      : ($("#main-filter").addClass("m-refinements"),
        $("#bg_dark").addClass("cartOverlay"));
  };
let showAccor = document.querySelectorAll("#showAccor"),
  footAccorId = document.querySelectorAll("#footAccor");
function footAccor(i) {
  if (!showAccor[i].classList.contains(maccor))
    return (
      footAccorId[i].classList.add(maccor), showAccor[i].classList.add(maccor)
    );
  showAccor[i].classList.remove(maccor),
    footAccorId[i].classList.remove(maccor);
}
