// ========================================
// مدیریت منوی موبایل (بدون کشویی)
// ========================================
document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ KICKS - منو بارگذاری شد!");

  // ===== فقط منوی موبایل =====
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      navMenu.classList.toggle("active");

      const icon = this.querySelector("i");
      if (icon) {
        icon.className = navMenu.classList.contains("active")
          ? "ri-close-line"
          : "ri-menu-line";
      }
    });
  }

  // بستن منو با کلیک روی لینک‌ها (در موبایل)
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 992 && navMenu) {
        navMenu.classList.remove("active");
        const icon = mobileToggle?.querySelector("i");
        if (icon) {
          icon.className = "ri-menu-line";
        }
      }
    });
  });

  // بستن منو با تغییر سایز
  window.addEventListener("resize", function () {
    if (window.innerWidth > 992 && navMenu) {
      navMenu.classList.remove("active");
      const icon = mobileToggle?.querySelector("i");
      if (icon) {
        icon.className = "ri-menu-line";
      }
    }
  });

  console.log("✅ KICKS - منوی موبایل آماده است!");
});

// ==========================================================
// سیستم سبد خرید یکپارچه - نسخه نهایی
// ==========================================================
(function () {
  "use strict";

  const TAX_RATE = 0.09;
  const SHIPPING_COST = 150000;
  const FREE_SHIPPING_THRESHOLD = 5000000;

  // ==========================================================
  // ✅ تبدیل اعداد فارسی به انگلیسی
  // ==========================================================
  function toEnglishNumber(str) {
    if (!str) return "0";
    const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    const englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let result = String(str);
    for (let i = 0; i < 10; i++) {
      result = result.replaceAll(persianNumbers[i], englishNumbers[i]);
    }
    return result;
  }

  // ==========================================================
  // ✅ تبدیل قیمت به عدد (پشتیبانی از فارسی و انگلیسی)
  // ==========================================================
  function parsePrice(priceStr) {
    if (!priceStr) return 0;
    if (typeof priceStr === "number") return priceStr;

    let cleaned = String(priceStr);
    cleaned = toEnglishNumber(cleaned);
    cleaned = cleaned.replace(/[^0-9]/g, "");

    const result = parseInt(cleaned, 10);
    return isNaN(result) ? 0 : result;
  }

  function formatPrice(price) {
    return price.toLocaleString("fa-IR");
  }

  // ==========================================================
  // ✅ داده‌ها - یکسان برای همه صفحات
  // ==========================================================
  let cart = JSON.parse(localStorage.getItem("kicks_cart")) || [];
  let favorites = JSON.parse(localStorage.getItem("kicks_favorites")) || [];

  // ==========================================================
  // ✅ تابع محاسبه مجموع
  // ==========================================================
  function calculateTotals() {
    let subtotal = 0;

    cart.forEach((item) => {
      // قیمت رو به عدد تبدیل کن
      let price = parsePrice(item.price);
      // اگر priceRaw موجود بود از اون استفاده کن
      if (item.priceRaw && typeof item.priceRaw === "number") {
        price = item.priceRaw;
      }
      const quantity = item.quantity || 1;
      const itemTotal = price * quantity;
      subtotal += itemTotal;

      console.log(
        `📦 ${item.name}: ${formatPrice(price)} × ${quantity} = ${formatPrice(itemTotal)}`,
      );
    });

    const tax = Math.round(subtotal * TAX_RATE);
    const shipping =
      subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
    const total = subtotal + tax + shipping;

    console.log(`💰 قیمت کالاها: ${formatPrice(subtotal)}`);
    console.log(`🧾 مالیات: ${formatPrice(tax)}`);
    console.log(
      `🚚 ارسال: ${shipping === 0 ? "رایگان" : formatPrice(shipping)}`,
    );
    console.log(`💳 مجموع: ${formatPrice(total)}`);

    return {
      subtotal: subtotal,
      tax: tax,
      shipping: shipping,
      total: total,
      itemCount: cart.reduce((sum, item) => sum + (item.quantity || 1), 0),
    };
  }

  // ==========================================================
  // ✅ نمایش مودال سبد خرید
  // ==========================================================
  function showCartModal() {
    const existingOverlay = document.querySelector(".cart-overlay");
    if (existingOverlay) {
      existingOverlay.remove();
    }

    const overlay = document.createElement("div");
    overlay.className = "cart-overlay";
    const totals = calculateTotals();

    let itemsHTML = "";
    if (cart.length === 0) {
      itemsHTML = `
                <div class="cart-empty">
                    <i class="ri-shopping-cart-line"></i>
                    <p>سبد خرید شما خالی است 🛒</p>
                    <p style="font-size:14px;color:var(--text-muted);margin-top:8px;">
                        برای خرید محصولات به فروشگاه بروید
                    </p>
                </div>
            `;
    } else {
      itemsHTML = cart
        .map((item, index) => {
          // قیمت رو به عدد تبدیل کن
          let price = parsePrice(item.price);
          if (item.priceRaw && typeof item.priceRaw === "number") {
            price = item.priceRaw;
          }
          const quantity = item.quantity || 1;
          const itemTotal = price * quantity;

          return `
                    <div class="cart-item" data-index="${index}">
                        <div class="cart-item-image">
                            <img loading="lazy" src="${item.image || "./assets/shoe-1.jpeg"}" alt="${item.name}">
                        </div>
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">${formatPrice(price)} تومان</div>
                            <div class="cart-item-controls">
                                <button class="quantity-btn" data-action="decrease" data-index="${index}">
                                    <i class="ri-subtract-line"></i>
                                </button>
                                <span class="quantity-display">${quantity}</span>
                                <button class="quantity-btn" data-action="increase" data-index="${index}">
                                    <i class="ri-add-line"></i>
                                </button>
                                <span style="color:var(--color-primary-accent);font-weight:700;margin-right:12px;">
                                    ${formatPrice(itemTotal)} تومان
                                </span>
                            </div>
                        </div>
                        <button class="cart-item-remove" data-index="${index}">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    </div>
                `;
        })
        .join("");
    }

    overlay.innerHTML = `
            <div class="cart-modal">
                <div class="cart-header">
                    <h2>
                        <i class="ri-shopping-cart-2-line"></i>
                        سبد خرید
                        ${cart.length > 0 ? `<span style="font-size:14px;color:var(--text-muted);font-weight:400;">(${totals.itemCount} آیتم)</span>` : ""}
                    </h2>
                    <button class="cart-close">
                        <i class="ri-close-line"></i>
                    </button>
                </div>

                <div class="cart-items">
                    ${itemsHTML}
                </div>

                ${
                  cart.length > 0
                    ? `
                    <div class="cart-summary">
                        <div class="summary-row">
                            <span class="label"><i class="ri-shopping-bag-3-line"></i> قیمت کالاها</span>
                            <span class="value">${formatPrice(totals.subtotal)} تومان</span>
                        </div>
                        <div class="summary-row">
                            <span class="label"><i class="ri-tax-line"></i> مالیات (۹٪)</span>
                            <span class="value tax-text">${formatPrice(totals.tax)} تومان</span>
                        </div>
                        <div class="summary-row">
                            <span class="label"><i class="ri-truck-line"></i> هزینه ارسال</span>
                            <span class="value ${totals.shipping === 0 ? "discount-text" : ""}">
                                ${totals.shipping === 0 ? "رایگان 🎉" : formatPrice(totals.shipping) + " تومان"}
                            </span>
                        </div>
                        <div style="border-top: 2px solid var(--border-primary);margin:12px 0;"></div>
                        <div class="summary-row total">
                            <span class="label"><i class="ri-price-tag-3-line"></i> مبلغ قابل پرداخت</span>
                            <span class="value highlight">${formatPrice(totals.total)} تومان</span>
                        </div>
                        <button class="checkout-btn">
                            <i class="ri-shopping-cart-line"></i>
                            تسویه حساب
                            <span style="font-size:14px;opacity:0.8;">(${formatPrice(totals.total)} تومان)</span>
                        </button>
                    </div>
                `
                    : ""
                }
            </div>
        `;

    document.body.appendChild(overlay);

    // رویدادهای مودال
    overlay.querySelector(".cart-close").addEventListener("click", () => {
      overlay.remove();
    });

    overlay.addEventListener("click", function (e) {
      if (e.target === this) {
        this.remove();
      }
    });

    overlay.querySelectorAll(".quantity-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const index = parseInt(this.dataset.index);
        const action = this.dataset.action;
        const currentQty = cart[index].quantity || 1;

        if (action === "increase") {
          updateQuantity(index, currentQty + 1);
        } else if (action === "decrease") {
          updateQuantity(index, currentQty - 1);
        }

        overlay.remove();
        showCartModal();
      });
    });

    overlay.querySelectorAll(".cart-item-remove").forEach((btn) => {
      btn.addEventListener("click", function () {
        const index = parseInt(this.dataset.index);
        removeFromCart(index);
        overlay.remove();
        showCartModal();
      });
    });

    const checkoutBtn = overlay.querySelector(".checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", function () {
        if (cart.length === 0) {
          showNotification("سبد خرید شما خالی است!");
          return;
        }

        const totals = calculateTotals();
        showNotification(`
                    ✅ سفارش شما با موفقیت ثبت شد!
                    مبلغ کل: ${formatPrice(totals.total)} تومان
                `);

        cart = [];
        localStorage.setItem("kicks_cart", JSON.stringify(cart));
        updateAllBadges();
        overlay.remove();
      });
    }
  }

  // ==========================================================
  // ✅ توابع اصلی
  // ==========================================================
  function showNotification(message, type = "success") {
    const existing = document.querySelector(".notification-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "notification-toast";

    const icon =
      type === "success" ? "ri-checkbox-circle-fill" : "ri-heart-fill";
    const color =
      type === "success"
        ? "linear-gradient(135deg, #7F63E9, #C084FC)"
        : "linear-gradient(135deg, #ff4757, #ff6b81)";

    toast.innerHTML = `<i class="${icon}"></i><span>${message}</span>`;
    document.body.appendChild(toast);

    toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 99999;
            padding: 16px 24px;
            border-radius: 14px;
            background: ${color};
            color: white;
            font-family: 'Vazirmatn', sans-serif;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 10px 40px rgba(127, 99, 233, 0.4);
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            direction: rtl;
            max-width: 400px;
        `;

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(30px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function updateAllBadges() {
    const cartBadges = document.querySelectorAll(".cart-badge");
    const totalItems = cart.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0,
    );
    cartBadges.forEach((badge) => {
      badge.textContent = totalItems;
    });

    const favBadges = document.querySelectorAll(".favorites-badge");
    favBadges.forEach((badge) => {
      badge.textContent = favorites.length;
    });
  }

  function updateFavoriteButtons() {
    const favButtons = document.querySelectorAll(
      ".action-btn.favorite-btn, .favorite-btn",
    );
    favButtons.forEach((btn) => {
      const productName = btn.dataset.productName;
      const isFavorite = favorites.some((item) => item.name === productName);
      const icon = btn.querySelector("i");

      if (isFavorite) {
        if (icon) icon.className = "ri-heart-fill";
        btn.classList.add("active");
        btn.style.color = "#ff4757";
        btn.style.background = "rgba(255, 71, 87, 0.2)";
      } else {
        if (icon) icon.className = "ri-heart-line";
        btn.classList.remove("active");
        btn.style.color = "white";
        btn.style.background = "rgba(10, 12, 18, 0.8)";
      }
    });
  }

  // ==========================================================
  // ✅ افزودن به سبد خرید - ذخیره قیمت به صورت عدد خام
  // ==========================================================
  function addToCart(productName, price, image) {
    // قیمت رو به عدد تبدیل کن
    const numericPrice = parsePrice(price);

    const existingItem = cart.find((item) => item.name === productName);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
      // اگر priceRaw نداشت، مقداردهی کن
      if (!existingItem.priceRaw || typeof existingItem.priceRaw !== "number") {
        existingItem.priceRaw = numericPrice;
      }
    } else {
      cart.push({
        id: Date.now(),
        name: productName,
        price: formatPrice(numericPrice), // نمایشی
        priceRaw: numericPrice, // عدد خام برای محاسبات
        image: image || "./assets/shoe-1.jpeg",
        quantity: 1,
      });
    }

    localStorage.setItem("kicks_cart", JSON.stringify(cart));
    updateAllBadges();
    showNotification(`${productName} به سبد خرید اضافه شد! 🛒`);

    console.log("✅ آیتم اضافه شد:", {
      name: productName,
      price: numericPrice,
      priceRaw: numericPrice,
    });
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("kicks_cart", JSON.stringify(cart));
    updateAllBadges();
  }

  function updateQuantity(index, newQuantity) {
    if (newQuantity <= 0) {
      removeFromCart(index);
    } else {
      cart[index].quantity = newQuantity;
      localStorage.setItem("kicks_cart", JSON.stringify(cart));
      updateAllBadges();
    }
  }

  function toggleFavorite(productName, price, image) {
    const index = favorites.findIndex((item) => item.name === productName);

    if (index > -1) {
      favorites.splice(index, 1);
      showNotification(`${productName} از علاقه‌مندی‌ها حذف شد! 💔`, "remove");
    } else {
      favorites.push({
        id: Date.now(),
        name: productName,
        price: price,
        image: image || "./assets/shoe-1.jpeg",
      });
      showNotification(
        `${productName} به علاقه‌مندی‌ها اضافه شد! ❤️`,
        "favorite",
      );
    }

    localStorage.setItem("kicks_favorites", JSON.stringify(favorites));
    updateAllBadges();
    updateFavoriteButtons();
  }

  function showFavoritesModal() {
    const existingOverlay = document.querySelector(".cart-overlay");
    if (existingOverlay) {
      existingOverlay.remove();
    }

    const overlay = document.createElement("div");
    overlay.className = "cart-overlay";

    let itemsHTML = "";
    if (favorites.length === 0) {
      itemsHTML = `
                <div class="cart-empty">
                    <i class="ri-heart-line"></i>
                    <p>لیست علاقه‌مندی‌های شما خالی است ❤️</p>
                    <p style="font-size:14px;color:var(--text-muted);margin-top:8px;">
                        محصولات مورد علاقه خود را ذخیره کنید
                    </p>
                </div>
            `;
    } else {
      itemsHTML = favorites
        .map(
          (item, index) => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img loading="lazy" src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${formatPrice(parsePrice(item.price))} تومان</div>
                    </div>
                    <button class="cart-item-remove" data-index="${index}">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </div>
            `,
        )
        .join("");
    }

    overlay.innerHTML = `
            <div class="cart-modal">
                <div class="cart-header">
                    <h2>
                        <i class="ri-heart-fill" style="color:#ff4757;"></i>
                        علاقه‌مندی‌ها
                        ${favorites.length > 0 ? `<span style="font-size:14px;color:var(--text-muted);font-weight:400;">(${favorites.length} آیتم)</span>` : ""}
                    </h2>
                    <button class="cart-close">
                        <i class="ri-close-line"></i>
                    </button>
                </div>

                <div class="cart-items">
                    ${itemsHTML}
                </div>
            </div>
        `;

    document.body.appendChild(overlay);

    overlay.querySelector(".cart-close").addEventListener("click", () => {
      overlay.remove();
    });

    overlay.addEventListener("click", function (e) {
      if (e.target === this) {
        this.remove();
      }
    });

    overlay.querySelectorAll(".cart-item-remove").forEach((btn) => {
      btn.addEventListener("click", function () {
        const index = parseInt(this.dataset.index);
        favorites.splice(index, 1);
        localStorage.setItem("kicks_favorites", JSON.stringify(favorites));
        updateAllBadges();
        updateFavoriteButtons();
        overlay.remove();
        showFavoritesModal();
      });
    });
  }

  // ===== رویدادهای کلیک =====
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".add-to-cart, .add-to-cart-btn");
    if (btn) {
      e.preventDefault();
      e.stopPropagation();

      const card = btn.closest(".product-card");
      const name =
        btn.dataset.productName ||
        card?.querySelector(".product-name")?.textContent?.trim() ||
        "محصول";

      // ✅ دریافت قیمت از data-price یا متن داخل span.price
      let price = btn.dataset.productPrice;
      if (!price || price === "۰") {
        const priceEl = card?.querySelector(".price, .current");
        if (priceEl) {
          price = priceEl.textContent?.trim() || priceEl.dataset.price || "۰";
        }
      }

      const image =
        btn.dataset.productImage ||
        card?.querySelector(".product-image img")?.src ||
        "";

      console.log("💰 افزودن به سبد:", { name, price, image });

      addToCart(name, price, image);

      btn.classList.add("added");
      btn.innerHTML = '<i class="ri-check-line"></i> اضافه شد!';

      setTimeout(() => {
        btn.classList.remove("added");
        btn.innerHTML = '<i class="ri-shopping-cart-line"></i> افزودن به سبد';
      }, 1500);
    }
  });

  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".favorite-btn");
    if (btn) {
      e.preventDefault();
      e.stopPropagation();

      const card = btn.closest(".product-card");
      const name =
        btn.dataset.productName ||
        card?.querySelector(".product-name")?.textContent?.trim() ||
        "محصول";
      const price = btn.dataset.productPrice || "۰";
      const image =
        btn.dataset.productImage ||
        card?.querySelector(".product-image img")?.src ||
        "";

      toggleFavorite(name, price, image);

      const icon = btn.querySelector("i");
      const isFav = favorites.some((item) => item.name === name);
      if (isFav) {
        if (icon) icon.className = "ri-heart-fill";
        btn.classList.add("favorited");
        btn.style.color = "#ff4757";
      } else {
        if (icon) icon.className = "ri-heart-line";
        btn.classList.remove("favorited");
        btn.style.color = "";
      }
    }
  });

  const cartBtn = document.getElementById("cartBtn");
  if (cartBtn) {
    cartBtn.addEventListener("click", function (e) {
      e.preventDefault();
      showCartModal();
    });
  }

  const favoritesBtn = document.getElementById("favoritesBtn");
  if (favoritesBtn) {
    favoritesBtn.addEventListener("click", function (e) {
      e.preventDefault();
      showFavoritesModal();
    });
  }

  // ===== مقداردهی اولیه =====
  // ✅ تصحیح و بازسازی آیتم‌های سبد
  cart = cart.map((item) => {
    // اگر priceRaw نداره یا عدد نیست، از price بساز
    if (
      !item.priceRaw ||
      typeof item.priceRaw !== "number" ||
      isNaN(item.priceRaw)
    ) {
      item.priceRaw = parsePrice(item.price);
    }
    if (!item.quantity) {
      item.quantity = 1;
    }
    return item;
  });
  localStorage.setItem("kicks_cart", JSON.stringify(cart));

  updateAllBadges();
  updateFavoriteButtons();

  console.log("✅ KICKS - سبد خرید یکپارچه فعال شد!");
  console.log(
    `🛒 تعداد اقلام سبد: ${cart.reduce((sum, i) => sum + (i.quantity || 1), 0)}`,
  );
  console.log(
    `📦 آیتم‌های سبد:`,
    cart.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      price: i.price,
      priceRaw: i.priceRaw,
      total: (i.priceRaw || 0) * (i.quantity || 1),
    })),
  );
})();

// ==========================================================
// تنظیمات اسلایدر Swiper - صفحه اصلی (products-swiper)
// ==========================================================
document.addEventListener("DOMContentLoaded", function () {
  if (typeof Swiper !== "undefined") {
    const swiperEl = document.querySelector(".products-swiper");
    if (swiperEl && !swiperEl.swiper) {
      new Swiper(".products-swiper", {
        slidesPerView: 1,
        spaceBetween: 15,
        loop: true,
        grabCursor: true,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          320: { slidesPerView: 1, spaceBetween: 10 },
          640: { slidesPerView: 2, spaceBetween: 15 },
          1024: { slidesPerView: 3, spaceBetween: 20 },
          1200: { slidesPerView: 4, spaceBetween: 20 },
        },
      });
      console.log("✅ KICKS - اسلایدر محصولات صفحه اصلی راه‌اندازی شد!");
    }
  }
});

// ==========================================================
// اسلایدر فلش (flash-swiper) - فقط در صفحه محصولات
// ==========================================================
// این بخش در فایل allproducts.html با داده‌های محصولات اجرا می‌شود
// و در اینجا فقط یک بار اسلایدر را مقداردهی می‌کنیم

// ==========================================================
// بخش نظرات مشتریان
// ==========================================================
document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".feedbacks-container");
  if (!container) return;

  const cards = container.querySelectorAll(".feed-block");

  cards.forEach((card) => {
    const cornerTop = document.createElement("div");
    cornerTop.className = "corner-effect";
    card.appendChild(cornerTop);

    const cornerBottom = document.createElement("div");
    cornerBottom.className = "corner-effect-bottom";
    card.appendChild(cornerBottom);
  });

  cards.forEach((card, index) => {
    card.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const corners = {
        "top-right": { x: rect.width, y: 0 },
        "top-left": { x: 0, y: 0 },
        "bottom-right": { x: rect.width, y: rect.height },
        "bottom-left": { x: 0, y: rect.height },
      };

      let nearestCorner = "top-right";
      let minDist = Infinity;

      for (const [name, corner] of Object.entries(corners)) {
        const dist = Math.sqrt(
          Math.pow(x - corner.x, 2) + Math.pow(y - corner.y, 2),
        );
        if (dist < minDist) {
          minDist = dist;
          nearestCorner = name;
        }
      }

      const cornerEls = this.querySelectorAll(
        ".corner-effect, .corner-effect-bottom",
      );
      cornerEls.forEach((el) => (el.style.opacity = "0"));

      const intensity = Math.min(1, 1 - minDist / 300);

      if (nearestCorner === "top-right") {
        this.querySelector(".corner-effect").style.opacity = "0.9";
        this.style.borderColor = `rgba(127, 99, 233, ${intensity})`;
      } else if (nearestCorner === "bottom-left") {
        this.querySelector(".corner-effect-bottom").style.opacity = "0.9";
        this.style.borderColor = `rgba(192, 132, 252, ${intensity})`;
      } else if (nearestCorner === "top-left") {
        this.style.borderColor = `rgba(127, 99, 233, ${intensity})`;
        this.style.borderTopColor = "var(--color-primary)";
        this.style.borderLeftColor = "var(--color-primary)";
      } else if (nearestCorner === "bottom-right") {
        this.style.borderColor = `rgba(192, 132, 252, ${intensity})`;
        this.style.borderBottomColor = "var(--color-primary-accent)";
        this.style.borderRightColor = "var(--color-primary-accent)";
      }

      cards.forEach((c, i) => {
        if (i !== index) {
          const dist = Math.abs(i - index);
          if (dist <= 2) {
            const angle = (i - index) * 3;
            const scale = 1 - Math.abs(angle) / 150;
            c.style.transform = `perspective(800px) rotateY(${angle}deg) scale(${scale})`;
            c.style.borderColor = `rgba(127, 99, 233, ${0.3 - dist * 0.1})`;
            c.style.opacity = 1 - dist * 0.1;
          }
        }
      });
    });

    card.addEventListener("mouseleave", function () {
      this.style.borderColor = "transparent";
      this.style.borderTopColor = "transparent";
      this.style.borderBottomColor = "transparent";
      this.style.borderRightColor = "transparent";
      this.style.borderLeftColor = "transparent";

      const corners = this.querySelectorAll(
        ".corner-effect, .corner-effect-bottom",
      );
      corners.forEach((el) => (el.style.opacity = "0"));

      cards.forEach((c) => {
        c.style.transform = "";
        c.style.borderColor = "";
        c.style.borderTopColor = "";
        c.style.borderBottomColor = "";
        c.style.borderRightColor = "";
        c.style.borderLeftColor = "";
        c.style.opacity = "1";
      });
    });
  });

  console.log("✅ بخش نظرات مشتریان با موفقیت بارگذاری شد!");
});

// ==========================================================
// فرم تماس
// ==========================================================
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const steps = document.querySelectorAll(".step");
  const progressSteps = document.querySelectorAll(".progress-step");
  const contactReason = document.getElementById("contactReason");
  const salesConditional = document.getElementById("salesConditional");
  const brandEl = document.getElementById("brand");
  const sizeEl = document.getElementById("shoeSize");
  const usageEl = document.getElementById("usage");
  const estimatedPrice = document.getElementById("estimatedPrice");
  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const message = document.getElementById("message");
  const submitBtn = document.getElementById("submitBtn");
  const successMsg = document.getElementById("successMessage");
  const resetBtn = document.getElementById("resetFormBtn");

  function getCurrentStep() {
    for (let i = 0; i < steps.length; i++) {
      if (steps[i].classList.contains("active")) return i + 1;
    }
    return 1;
  }

  function goToStep(stepNumber) {
    steps.forEach((s, idx) => {
      s.classList.remove("active");
      progressSteps[idx].classList.remove("active", "done");
    });

    const targetStep = document.querySelector(
      `.step[data-step="${stepNumber}"]`,
    );
    if (targetStep) targetStep.classList.add("active");

    progressSteps.forEach((ps, idx) => {
      const psNum = idx + 1;
      if (psNum === stepNumber) {
        ps.classList.add("active");
      } else if (psNum < stepNumber) {
        ps.classList.add("done");
      }
    });

    if (stepNumber === 3) {
      updateSummary();
    }
  }

  if (contactReason) {
    contactReason.addEventListener("change", function () {
      if (this.value === "sales") {
        if (salesConditional) salesConditional.style.display = "block";
      } else {
        if (salesConditional) salesConditional.style.display = "none";
      }
      const reasonError = document.getElementById("reasonError");
      if (reasonError) reasonError.style.display = "none";
      this.classList.remove("error");
    });
  }

  function updateEstimate() {
    if (!brandEl || !sizeEl || !usageEl || !estimatedPrice) return;

    const brand = brandEl.value;
    const size = parseInt(sizeEl.value) || 40;
    const usage = usageEl.value;

    let basePrice = 0;
    switch (brand) {
      case "nike":
        basePrice = 2800000;
        break;
      case "adidas":
        basePrice = 3200000;
        break;
      case "puma":
        basePrice = 2200000;
        break;
      case "gucci":
        basePrice = 5800000;
        break;
      default:
        basePrice = 1800000;
    }

    let sizeFactor = 1;
    if (size >= 44) sizeFactor = 1.1;
    else if (size <= 38) sizeFactor = 0.95;

    let usageFactor = 1;
    if (usage === "sport") usageFactor = 1.15;
    else if (usage === "formal") usageFactor = 1.25;

    const finalPrice = Math.round(basePrice * sizeFactor * usageFactor);
    estimatedPrice.textContent = finalPrice.toLocaleString("fa-IR");
  }

  if (brandEl) brandEl.addEventListener("change", updateEstimate);
  if (sizeEl) sizeEl.addEventListener("change", updateEstimate);
  if (usageEl) usageEl.addEventListener("change", updateEstimate);
  updateEstimate();

  document.querySelectorAll(".next-step").forEach((btn) => {
    btn.addEventListener("click", function () {
      const currentStep = getCurrentStep();
      const nextStep = parseInt(this.dataset.next);
      if (!validateStep(currentStep)) return;
      goToStep(nextStep);
    });
  });

  document.querySelectorAll(".prev-step").forEach((btn) => {
    btn.addEventListener("click", function () {
      const prevStep = parseInt(this.dataset.prev);
      goToStep(prevStep);
    });
  });

  function validateStep(step) {
    let isValid = true;

    if (step === 1 && contactReason) {
      const reason = contactReason.value;
      const reasonError = document.getElementById("reasonError");
      if (!reason) {
        if (reasonError) reasonError.style.display = "block";
        contactReason.classList.add("error");
        isValid = false;
      } else {
        if (reasonError) reasonError.style.display = "none";
        contactReason.classList.remove("error");
      }
    }

    if (step === 2) {
      const nameError = document.getElementById("nameError");
      const emailError = document.getElementById("emailError");
      const phoneError = document.getElementById("phoneError");

      if (fullName) {
        const name = fullName.value.trim();
        if (!name || name.length < 2) {
          if (nameError) nameError.style.display = "block";
          fullName.classList.add("error");
          isValid = false;
        } else {
          if (nameError) nameError.style.display = "none";
          fullName.classList.remove("error");
        }
      }

      if (email) {
        const emailVal = email.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailVal || !emailRegex.test(emailVal)) {
          if (emailError) emailError.style.display = "block";
          email.classList.add("error");
          isValid = false;
        } else {
          if (emailError) emailError.style.display = "none";
          email.classList.remove("error");
        }
      }

      if (phone) {
        const phoneVal = phone.value.trim();
        if (phoneVal) {
          const phoneRegex = /^09[0-9]{9}$/;
          if (!phoneRegex.test(phoneVal)) {
            if (phoneError) phoneError.style.display = "block";
            phone.classList.add("error");
            isValid = false;
          } else {
            if (phoneError) phoneError.style.display = "none";
            phone.classList.remove("error");
          }
        }
      }
    }

    if (step === 3 && message) {
      const msg = message.value.trim();
      const messageError = document.getElementById("messageError");
      if (!msg || msg.length < 5) {
        if (messageError) messageError.style.display = "block";
        message.classList.add("error");
        isValid = false;
      } else {
        if (messageError) messageError.style.display = "none";
        message.classList.remove("error");
      }
    }

    return isValid;
  }

  function updateSummary() {
    const summaryReason = document.getElementById("summaryReason");
    const summaryName = document.getElementById("summaryName");
    const summaryEmail = document.getElementById("summaryEmail");

    if (summaryReason && contactReason) {
      summaryReason.textContent =
        contactReason.options[contactReason.selectedIndex]?.text || "-";
    }
    if (summaryName && fullName) {
      summaryName.textContent = fullName.value.trim() || "-";
    }
    if (summaryEmail && email) {
      summaryEmail.textContent = email.value.trim() || "-";
    }
  }

  [fullName, email, phone, message].forEach((field) => {
    if (!field) return;
    field.addEventListener("blur", function () {
      const step = getCurrentStep();
      if (
        (step === 2 && ["fullName", "email", "phone"].includes(this.id)) ||
        (step === 3 && this.id === "message")
      ) {
        validateStep(step);
      }
    });

    field.addEventListener("input", function () {
      this.classList.remove("error");
      const errorEl = this.parentElement.querySelector(".error-message");
      if (errorEl) errorEl.style.display = "none";
    });
  });

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!validateStep(3)) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<i class="ri-loader-4-line" style="animation: spin 1s linear infinite;"></i> در حال ارسال...';
      }

      const style = document.createElement("style");
      style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
      document.head.appendChild(style);

      setTimeout(() => {
        if (form) form.style.display = "none";
        const progressWrap = document.querySelector(".progress-wrap");
        if (progressWrap) progressWrap.style.display = "none";
        if (successMsg) successMsg.style.display = "block";
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="ri-send-plane-fill"></i> ارسال پیام';
        }
      }, 1800);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (form) form.style.display = "block";
      const progressWrap = document.querySelector(".progress-wrap");
      if (progressWrap) progressWrap.style.display = "flex";
      if (successMsg) successMsg.style.display = "none";
      if (form) form.reset();
      goToStep(1);
      updateEstimate();
      if (salesConditional) salesConditional.style.display = "none";
    });
  }

  if (contactReason && contactReason.value === "sales") {
    if (salesConditional) salesConditional.style.display = "block";
  }

  console.log("✅ فرم تماس KICKS با موفقیت بارگذاری شد!");
});

// ==========================================================
// more-info.js
// ==========================================================
document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ more-info.js - بارگذاری شد!");

  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(
      ".value-card, .team-card, .testimonial-card, .timeline-item",
    )
    .forEach((el) => {
      observer.observe(el);
    });

  const statNumbers = document.querySelectorAll(".stat-number");

  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target);
          if (!target) return;

          let current = 0;
          const increment = Math.ceil(target / 60);
          const stepTime = Math.floor(2000 / 60);

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            if (target % 1 !== 0) {
              el.textContent = current.toFixed(1);
            } else {
              el.textContent = current.toLocaleString("en");
            }
            if (el.dataset.target === "98") {
              el.textContent = current + "%";
            }
          }, stepTime);

          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 },
  );

  statNumbers.forEach((el) => counterObserver.observe(el));

  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const input = this.querySelector("input");
      if (input.value.trim()) {
        alert("✅ با موفقیت در خبرنامه عضو شدید!");
        input.value = "";
      } else {
        alert("⚠️ لطفاً ایمیل خود را وارد کنید.");
      }
    });
  }

  console.log("✅ more-info.js - تمام بخش‌ها فعال شد!");
});

// ==========================================================
// بخش محصولات فیلتر (برای allproducts.html)
// ==========================================================
document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  console.log("✅ صفحه محصولات بارگذاری شد!");

  const allProducts = [
    {
      id: 1,
      name: "کفش ورزشی نایک",
      category: "sport",
      brand: "nike",
      price: 2450000,
      oldPrice: 3200000,
      discount: 23,
      rating: 4.5,
      reviews: 124,
      image: "./assets/shoe-3.jpeg",
      badge: "sale",
      badgeText: "حراج",
    },
    {
      id: 2,
      name: "کفش اسپرت آدیداس",
      category: "sport",
      brand: "adidas",
      price: 3100000,
      oldPrice: 3800000,
      discount: 18,
      rating: 4.8,
      reviews: 89,
      image: "./assets/shoe-2.jpeg",
      badge: "new",
      badgeText: "جدید",
    },
    {
      id: 3,
      name: "کفش رسمی پوما",
      category: "men",
      brand: "puma",
      price: 1850000,
      oldPrice: null,
      discount: 0,
      rating: 4.2,
      reviews: 67,
      image: "./assets/shoe-1.jpeg",
      badge: null,
      badgeText: "",
    },
    {
      id: 4,
      name: "کفش بسکتبال جردن",
      category: "sport",
      brand: "jordan",
      price: 4200000,
      oldPrice: 5500000,
      discount: 24,
      rating: 4.9,
      reviews: 256,
      image: "./assets/shoe-4.jpeg",
      badge: "hot",
      badgeText: "پرفروش",
    },
    {
      id: 5,
      name: "کفش پیاده‌روی نیوبالانس",
      category: "women",
      brand: "newbalance",
      price: 2200000,
      oldPrice: 2800000,
      discount: 21,
      rating: 4.6,
      reviews: 143,
      image: "./assets/shoe-5.jpeg",
      badge: null,
      badgeText: "",
    },
    {
      id: 6,
      name: "کفش مجلسی گوچی",
      category: "formal",
      brand: "gucci",
      price: 5800000,
      oldPrice: 7200000,
      discount: 19,
      rating: 4.0,
      reviews: 34,
      image: "./assets/shoe-6.jpeg",
      badge: "sale",
      badgeText: "حراج",
    },
    {
      id: 7,
      name: "کفش دویدن نایک",
      category: "sport",
      brand: "nike",
      price: 3600000,
      oldPrice: null,
      discount: 0,
      rating: 4.7,
      reviews: 92,
      image: "./assets/shoe-3.jpeg",
      badge: "new",
      badgeText: "جدید",
    },
    {
      id: 8,
      name: "کفش زنانه آدیداس",
      category: "women",
      brand: "adidas",
      price: 2750000,
      oldPrice: 3400000,
      discount: 19,
      rating: 4.4,
      reviews: 78,
      image: "./assets/shoe-2.jpeg",
      badge: null,
      badgeText: "",
    },
    {
      id: 9,
      name: "کفش مردانه پوما",
      category: "men",
      brand: "puma",
      price: 1650000,
      oldPrice: null,
      discount: 0,
      rating: 4.1,
      reviews: 56,
      image: "./assets/shoe-1.jpeg",
      badge: null,
      badgeText: "",
    },
    {
      id: 10,
      name: "کفش ورزشی جردن",
      category: "sport",
      brand: "jordan",
      price: 3850000,
      oldPrice: 4900000,
      discount: 21,
      rating: 4.8,
      reviews: 187,
      image: "./assets/shoe-4.jpeg",
      badge: "hot",
      badgeText: "پرفروش",
    },
    {
      id: 11,
      name: "کفش مجلسی ورساچه",
      category: "formal",
      brand: "gucci",
      price: 4200000,
      oldPrice: 5600000,
      discount: 25,
      rating: 4.3,
      reviews: 42,
      image: "./assets/shoe-6.jpeg",
      badge: "sale",
      badgeText: "حراج",
    },
    {
      id: 12,
      name: "کفش زنانه نیوبالانس",
      category: "women",
      brand: "newbalance",
      price: 2450000,
      oldPrice: null,
      discount: 0,
      rating: 4.5,
      reviews: 103,
      image: "./assets/shoe-5.jpeg",
      badge: null,
      badgeText: "",
    },
    {
      id: 13,
      name: "کفش اسپرت نایک",
      category: "sport",
      brand: "nike",
      price: 2900000,
      oldPrice: 3600000,
      discount: 19,
      rating: 4.6,
      reviews: 134,
      image: "./assets/shoe-3.jpeg",
      badge: "hot",
      badgeText: "پرفروش",
    },
    {
      id: 14,
      name: "کفش زنانه پوما",
      category: "women",
      brand: "puma",
      price: 1950000,
      oldPrice: null,
      discount: 0,
      rating: 4.0,
      reviews: 45,
      image: "./assets/shoe-1.jpeg",
      badge: null,
      badgeText: "",
    },
    {
      id: 15,
      name: "کفش رسمی جردن",
      category: "men",
      brand: "jordan",
      price: 3500000,
      oldPrice: 4300000,
      discount: 18,
      rating: 4.4,
      reviews: 67,
      image: "./assets/shoe-4.jpeg",
      badge: "new",
      badgeText: "جدید",
    },
    {
      id: 16,
      name: "کفش پیاده‌روی گوچی",
      category: "formal",
      brand: "gucci",
      price: 6200000,
      oldPrice: 7800000,
      discount: 20,
      rating: 4.2,
      reviews: 28,
      image: "./assets/shoe-6.jpeg",
      badge: "sale",
      badgeText: "حراج",
    },
  ];

  let currentFilter = "all";
  let currentBrand = "all";
  let currentSort = "popular";
  let currentSearch = "";
  let maxPrice = 8000000;
  let currentPage = 1;
  const itemsPerPage = 8;

  const visibleCount = document.getElementById("visibleCount");
  const totalCount = document.getElementById("totalCount");
  const searchInput = document.getElementById("searchInput");
  const priceRange = document.getElementById("priceRange");
  const priceLabel = document.getElementById("priceLabel");

  function formatPrice(price) {
    return price.toLocaleString("fa-IR");
  }

  function getFilteredProducts() {
    const result = allProducts.filter((p) => {
      if (currentFilter === "sale") {
        const isSale = p.discount > 0 || p.badge === "sale";
        if (!isSale) return false;
      } else if (currentFilter !== "all" && p.category !== currentFilter) {
        return false;
      }

      if (currentBrand !== "all" && p.brand !== currentBrand) return false;
      if (p.price > maxPrice) return false;

      if (currentSearch) {
        const searchLower = currentSearch.toLowerCase().trim();
        const nameLower = p.name.toLowerCase();
        if (!nameLower.includes(searchLower)) return false;
      }

      return true;
    });

    console.log(
      `🔍 فیلتر: ${currentFilter}, برند: ${currentBrand}, تعداد: ${result.length}`,
    );
    return result;
  }

  function sortProducts(products) {
    const sorted = [...products];
    switch (currentSort) {
      case "popular":
        sorted.sort((a, b) => b.reviews - a.reviews);
        break;
      case "newest":
        sorted.sort((a, b) => b.id - a.id);
        break;
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
    }
    return sorted;
  }

  function createProductCard(product) {
    const hasDiscount = product.discount > 0;
    const badgeHtml = product.badge
      ? `<span class="product-badge ${product.badge}">${product.badgeText}</span>`
      : "";
    const oldPriceHtml = product.oldPrice
      ? `<span class="old">${formatPrice(product.oldPrice)}</span>`
      : "";
    const discountHtml = hasDiscount
      ? `<span class="discount-percent">-${product.discount}%</span>`
      : "";

    const favorites = JSON.parse(localStorage.getItem("kicks_favorites")) || [];
    const isFav = favorites.some((item) => item.name === product.name)
      ? "favorited"
      : "";

    let starsHtml = "";
    const fullStars = Math.floor(product.rating);
    const halfStar = product.rating % 1 >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) starsHtml += '<i class="ri-star-fill"></i>';
      else if (i === fullStars && halfStar)
        starsHtml += '<i class="ri-star-half-fill"></i>';
      else starsHtml += '<i class="ri-star-line"></i>';
    }

    return `
            <div class="product-card" data-id="${product.id}">
                ${badgeHtml}
                <div class="product-image" onclick="location.href='product-detail.html?id=${product.id}'">
                    <img loading="lazy" src="${product.image}" alt="${product.name}" loading="lazy" />
                    <div class="product-actions">
                        <button class="favorite-btn ${isFav}" data-product-name="${product.name}" data-product-price="${product.price}" data-product-image="${product.image}">
                            <i class="${isFav ? "ri-heart-fill" : "ri-heart-line"}"></i>
                        </button>
                        <button onclick="location.href='product-detail.html?id=${product.id}'"><i class="ri-eye-line"></i></button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-name" onclick="location.href='product-detail.html?id=${product.id}'">${product.name}</h3>
                    <div class="product-rating">
                        ${starsHtml}
                        <span>(${product.reviews})</span>
                    </div>
                    <div class="product-price">
                        <span class="current">${formatPrice(product.price)}</span>
                        ${oldPriceHtml}
                        ${discountHtml}
                    </div>
                    <button class="add-to-cart-btn" data-product-name="${product.name}" data-product-price="${product.price}" data-product-image="${product.image}">
                        <i class="ri-shopping-cart-line"></i> افزودن به سبد
                    </button>
                </div>
            </div>
        `;
  }

  function renderProducts() {
    let filtered = getFilteredProducts();
    const total = filtered.length;
    filtered = sortProducts(filtered);

    const start = (currentPage - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, total);
    const pageItems = filtered.slice(start, end);

    if (visibleCount) visibleCount.textContent = pageItems.length;
    if (totalCount) totalCount.textContent = allProducts.length;

    if (pageItems.length === 0) {
      grid.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted);">
                    <i class="ri-search-line" style="font-size:48px;display:block;margin-bottom:16px;opacity:0.3;"></i>
                    <h3 style="font-size:1.2rem;margin-bottom:8px;">محصولی یافت نشد</h3>
                    <p>سعی کنید فیلترهای دیگری را امتحان کنید.</p>
                </div>
            `;
    } else {
      grid.innerHTML = pageItems.map((p) => createProductCard(p)).join("");
    }

    updatePagination(total);
  }

  function updatePagination(total) {
    const totalPages = Math.ceil(total / itemsPerPage);
    const pagination = document.getElementById("pagination");
    if (!pagination) return;

    if (totalPages <= 1) {
      pagination.style.display = "none";
      return;
    }
    pagination.style.display = "flex";

    const prevBtn = document.createElement("button");
    prevBtn.className = "page-btn prev-next";
    prevBtn.textContent = "‹";
    prevBtn.id = "prevPage";

    const nextBtn = document.createElement("button");
    nextBtn.className = "page-btn prev-next";
    nextBtn.textContent = "›";
    nextBtn.id = "nextPage";

    pagination.innerHTML = "";
    pagination.appendChild(prevBtn);

    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      const firstBtn = document.createElement("button");
      firstBtn.className = "page-btn";
      firstBtn.dataset.page = "1";
      firstBtn.textContent = "۱";
      firstBtn.addEventListener("click", function () {
        currentPage = parseInt(this.dataset.page);
        renderProducts();
      });
      pagination.appendChild(firstBtn);
      if (startPage > 2) {
        const dots = document.createElement("span");
        dots.textContent = "…";
        dots.style.cssText = "color:var(--text-muted);padding:0 4px;";
        pagination.appendChild(dots);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const btn = document.createElement("button");
      btn.className = "page-btn" + (i === currentPage ? " active" : "");
      btn.dataset.page = i;
      btn.textContent = i;
      btn.addEventListener("click", function () {
        currentPage = parseInt(this.dataset.page);
        renderProducts();
      });
      pagination.appendChild(btn);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const dots = document.createElement("span");
        dots.textContent = "…";
        dots.style.cssText = "color:var(--text-muted);padding:0 4px;";
        pagination.appendChild(dots);
      }
      const lastBtn = document.createElement("button");
      lastBtn.className = "page-btn";
      lastBtn.dataset.page = totalPages;
      lastBtn.textContent = totalPages;
      lastBtn.addEventListener("click", function () {
        currentPage = parseInt(this.dataset.page);
        renderProducts();
      });
      pagination.appendChild(lastBtn);
    }

    pagination.appendChild(nextBtn);

    prevBtn.addEventListener("click", function () {
      if (currentPage > 1) {
        currentPage--;
        renderProducts();
      }
    });

    nextBtn.addEventListener("click", function () {
      if (currentPage < totalPages) {
        currentPage++;
        renderProducts();
      }
    });
  }

  // رویدادهای فیلتر
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      currentFilter = this.dataset.filter;
      currentPage = 1;
      renderProducts();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      currentSearch = this.value.trim();
      currentPage = 1;
      renderProducts();
    });
  }

  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", function () {
      if (searchInput) {
        currentSearch = searchInput.value.trim();
        currentPage = 1;
        renderProducts();
      }
    });
  }

  const brandFilter = document.getElementById("brandFilter");
  if (brandFilter) {
    brandFilter.addEventListener("change", function () {
      currentBrand = this.value;
      currentPage = 1;
      renderProducts();
    });
  }

  const sortFilter = document.getElementById("sortFilter");
  if (sortFilter) {
    sortFilter.addEventListener("change", function () {
      currentSort = this.value;
      renderProducts();
    });
  }

  if (priceRange) {
    priceRange.addEventListener("input", function () {
      maxPrice = parseInt(this.value);
      if (priceLabel) priceLabel.textContent = formatPrice(maxPrice);
      currentPage = 1;
      renderProducts();
    });
  }

  const resetFilterBtn = document.getElementById("resetFilterBtn");
  if (resetFilterBtn) {
    resetFilterBtn.addEventListener("click", function () {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
      if (allBtn) allBtn.classList.add("active");
      currentFilter = "all";

      if (brandFilter) {
        brandFilter.value = "all";
        currentBrand = "all";
      }

      if (sortFilter) {
        sortFilter.value = "popular";
        currentSort = "popular";
      }

      if (searchInput) {
        searchInput.value = "";
        currentSearch = "";
      }

      if (priceRange) {
        priceRange.value = "8000000";
        maxPrice = 8000000;
        if (priceLabel) priceLabel.textContent = "۸,۰۰۰,۰۰۰";
      }

      currentPage = 1;
      renderProducts();
    });
  }

  // ==========================================================
// اسلایدر فلش - فقط یک بار مقداردهی می‌شود
// ==========================================================
function initFlashSwiper() {
  const wrapper = document.getElementById("flashWrapper");
  if (!wrapper) return;

  // اگر اسلایدر قبلاً مقداردهی شده، دوباره انجام نده
  const swiperEl = document.querySelector(".flash-swiper");
  if (swiperEl && swiperEl.swiper) {
    console.log("⚠️ اسلایدر فلش قبلاً مقداردهی شده است");
    return;
  }

  const flashProducts = allProducts.filter(
    (p) => p.discount > 0 || p.badge === "sale",
  );

  if (flashProducts.length === 0) {
    wrapper.innerHTML = `
              <div class="swiper-slide" style="text-align:center;padding:40px;color:var(--text-muted);">
                  <i class="ri-flashlight-line" style="font-size:48px;display:block;margin-bottom:16px;opacity:0.3;"></i>
                  <p>هیچ محصول حراجی وجود ندارد</p>
              </div>
          `;
    return;
  }

  wrapper.innerHTML = flashProducts
    .map(
      (product) => `
          <div class="swiper-slide">
              <div class="product-card" data-product-id="${product.id}">
                  <span class="product-badge sale">${product.discount}% تخفیف</span>
                  <div class="product-image" onclick="location.href='product-detail.html?id=${product.id}'">
                      <img loading="lazy" src="${product.image}" alt="${product.name}" />
                      <div class="product-actions">
                          <button class="favorite-btn" data-product-name="${product.name}" data-product-price="${product.price}" data-product-image="${product.image}">
                              <i class="ri-heart-line"></i>
                          </button>
                          <button onclick="event.stopPropagation();location.href='product-detail.html?id=${product.id}'"><i class="ri-eye-line"></i></button>
                      </div>
                  </div>
                  <div class="product-info">
                      <h3 class="product-name" onclick="location.href='product-detail.html?id=${product.id}'">${product.name}</h3>
                      <div class="product-price">
                          <span class="current">${formatPrice(product.price)}</span>
                          <span class="old">${formatPrice(product.oldPrice)}</span>
                          <span class="discount-percent">-${product.discount}%</span>
                      </div>
                      <!-- حذف onclick از این دکمه و استفاده از کلاس add-to-cart-btn -->
                      <button class="add-to-cart-btn" data-product-name="${product.name}" data-product-price="${product.price}" data-product-image="${product.image}">
                          <i class="ri-shopping-cart-line"></i> افزودن به سبد
                      </button>
                  </div>
              </div>
          </div>
      `,
    )
    .join("");

  // مقداردهی اسلایدر
  if (typeof Swiper !== "undefined") {
    if (swiperEl && !swiperEl.swiper) {
      new Swiper(".flash-swiper", {
        slidesPerView: 1,
        spaceBetween: 15,
        loop: flashProducts.length > 3,
        grabCursor: true,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          320: { slidesPerView: 1, spaceBetween: 10 },
          640: { slidesPerView: 2, spaceBetween: 15 },
          1024: { slidesPerView: 3, spaceBetween: 20 },
          1200: { slidesPerView: 4, spaceBetween: 20 },
        },
      });
      console.log("✅ اسلایدر فلش راه‌اندازی شد!");
    }
  }
}

  // ==========================================================
  // تایمر
  // ==========================================================
(function() {
  'use strict';
  
  const END_TIME_KEY = 'kicks_flash_end_time';
  const DURATION_SECONDS = 12 * 3600 + 30 * 60; // 12:30:00
  
  let timeLeft;
  let timerInterval;
  let isStarted = false;
  
  function padZero(num) {
    return String(num).padStart(2, '0');
  }
  
  function getEndTime() {
    const stored = localStorage.getItem(END_TIME_KEY);
    if (stored) {
      const endTime = parseInt(stored, 10);
      const now = Math.floor(Date.now() / 1000);
      if (endTime > now && endTime - now <= DURATION_SECONDS) {
        return endTime;
      }
    }
    const newEndTime = Math.floor(Date.now() / 1000) + DURATION_SECONDS;
    localStorage.setItem(END_TIME_KEY, String(newEndTime));
    return newEndTime;
  }
  
  function updateTimerDisplay() {
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (!hoursEl || !minutesEl || !secondsEl) {
      return;
    }
    
    if (timeLeft <= 0) {
      // زمان تمام شد، ریست کن
      localStorage.removeItem(END_TIME_KEY);
      const newEndTime = Math.floor(Date.now() / 1000) + DURATION_SECONDS;
      localStorage.setItem(END_TIME_KEY, String(newEndTime));
      timeLeft = DURATION_SECONDS;
    }
    
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    
    hoursEl.textContent = padZero(hours);
    minutesEl.textContent = padZero(minutes);
    secondsEl.textContent = padZero(seconds);
    
    if (timeLeft > 0) {
      timeLeft--;
    }
  }
  
  function startTimer() {
    // اگر قبلاً شروع شده، دوباره شروع نکن
    if (isStarted) {
      return;
    }
    
    // تایمر قبلی رو پاک کن
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    
    // چک کن که المنت‌های تایمر وجود دارند
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (!hoursEl || !minutesEl || !secondsEl) {
      console.log('⏰ المنت‌های تایمر پیدا نشدند');
      return;
    }
    
    // محاسبه زمان باقی‌مانده
    const endTime = getEndTime();
    const now = Math.floor(Date.now() / 1000);
    timeLeft = Math.max(0, endTime - now);
    
    if (timeLeft <= 0) {
      localStorage.removeItem(END_TIME_KEY);
      const newEndTime = Math.floor(Date.now() / 1000) + DURATION_SECONDS;
      localStorage.setItem(END_TIME_KEY, String(newEndTime));
      timeLeft = DURATION_SECONDS;
    }
    
    // نمایش اولیه
    updateTimerDisplay();
    
    // شروع تایمر
    isStarted = true;
    timerInterval = setInterval(updateTimerDisplay, 1000);
    console.log('✅ تایمر فلش‌سیل شروع شد! زمان باقی‌مانده:', timeLeft + ' ثانیه');
  }
  
  // ===== اجرا =====
  // وقتی صفحه کامل بارگذاری شد، تایمر رو شروع کن
  if (document.readyState === 'complete') {
    setTimeout(startTimer, 100);
  } else {
    document.addEventListener('readystatechange', function() {
      if (document.readyState === 'complete') {
        setTimeout(startTimer, 100);
      }
    });
  }
  
  // برای اطمینان، بعد از ۱ ثانیه هم دوباره چک کن
  setTimeout(function() {
    const hoursEl = document.getElementById('hours');
    if (hoursEl && !isStarted) {
      startTimer();
    }
  }, 1000);
  
  console.log('✅ سیستم تایمر فلش‌سیل بارگذاری شد!');
})();

  // ==========================================================
  // اجرا
  // ==========================================================
  renderProducts();
  initFlashSwiper();
  // اضافه کردن به انتهای فایل app.js (قبل از خط آخر که تمام می‌شود)

  
// ==========================================================
// اصلاح تایمر فلش‌سیل - با ذخیره زمان در localStorage
// ==========================================================
(function() {
    'use strict';
    
    // زمان پایان فروش ویژه (به ثانیه)
    const END_TIME_KEY = 'kicks_flash_end_time';
    const DURATION_SECONDS = 12 * 3600 + 30 * 60; // 12 ساعت و 30 دقیقه
    
    let timeLeft;
    let timerInterval;
    
    function getEndTime() {
        const stored = localStorage.getItem(END_TIME_KEY);
        if (stored) {
            const endTime = parseInt(stored, 10);
            const now = Math.floor(Date.now() / 1000);
            if (endTime > now) {
                return endTime;
            }
        }
        // اگر زمان ذخیره شده منقضی شده یا وجود ندارد، زمان جدید تنظیم کن
        const newEndTime = Math.floor(Date.now() / 1000) + DURATION_SECONDS;
        localStorage.setItem(END_TIME_KEY, String(newEndTime));
        return newEndTime;
    }
    
    function updateTimerDisplay() {
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (!hoursEl || !minutesEl || !secondsEl) return;
        
        if (timeLeft <= 0) {
            // زمان تمام شد، ریست کن
            localStorage.removeItem(END_TIME_KEY);
            const newEndTime = Math.floor(Date.now() / 1000) + DURATION_SECONDS;
            localStorage.setItem(END_TIME_KEY, String(newEndTime));
            timeLeft = DURATION_SECONDS;
        }
        
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
        
        if (timeLeft > 0) {
            timeLeft--;
        }
    }
    
    function initFlashTimer() {
        const endTime = getEndTime();
        const now = Math.floor(Date.now() / 1000);
        timeLeft = Math.max(0, endTime - now);
        
        // نمایش اولیه
        updateTimerDisplay();
        
        // تایمر را پاک کن اگر قبلاً وجود داشته
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        timerInterval = setInterval(updateTimerDisplay, 1000);
    }
    
    // اجرا در زمان بارگذاری صفحه
    if (document.getElementById('flashTimer')) {
        initFlashTimer();
    }
    
    console.log('✅ تایمر فلش‌سیل با ذخیره‌سازی localStorage فعال شد!');
})();
  console.log("✅ همه بخش‌های صفحه محصولات فعال شد!");
});


// ==========================================================
// اضافه کردن توابع برای product-detail.html
// ==========================================================

// تابع دریافت اطلاعات محصول با ID
function getProductById(id) {
    const products = [
        // داده‌های محصولات (همانند allproducts.html)
    ];
    return products.find(p => p.id === id);
}

// تابع نمایش پیام خطا در product-detail
function showProductError(message) {
    const container = document.getElementById('productDetail');
    if (container) {
        container.innerHTML = `
            <div class="error-state">
                <i class="ri-error-warning-line"></i>
                <h2>${message}</h2>
                <p>لطفاً از طریق صفحه محصولات، محصول مورد نظر را انتخاب کنید.</p>
                <a href="allproducts.html" class="btn-primary">بازگشت به محصولات</a>
            </div>
        `;
    }
}

// ==========================================================
// بهبود تابع addToCart - بررسی قیمت
// ==========================================================
function addToCart(productName, price, image) {
    // تبدیل قیمت به عدد
    const numericPrice = parsePrice(price);
    
    if (isNaN(numericPrice) || numericPrice === 0) {
        showNotification('خطا در افزودن محصول به سبد خرید!');
        return;
    }
    
    // ... ادامه کد موجود
}

// ==========================================================
// هدایت به صفحه جزئیات محصول با data-product-id
// ==========================================================
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.view-detail-btn');
    if (btn) {
        const productId = btn.dataset.productId;
        if (productId) {
            window.location.href = `product-detail.html?id=${productId}`;
        }
    }
});