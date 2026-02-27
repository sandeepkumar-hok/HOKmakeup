setTimeout(() => {
    const mainContent = document.getElementById("MainContent");
    const menuItems = document.querySelectorAll(".tmenu_item");
    menuItems.forEach(function (item) {
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === "attributes" && mutation.attributeName === "class") {
                    if (item.classList.contains("tmenu_item_active")) {
                        mainContent.classList.add("menu-active-bg-blur");
                    } else {
                        mainContent.classList.remove("menu-active-bg-blur");
                    }
                }
            });
        });
        observer.observe(item, {
            attributes: true,
            attributeFilter: ["class"]
        });
    });
}, 1000)