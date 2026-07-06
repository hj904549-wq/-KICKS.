// ==========================================================
// product-detail.js - اسکریپت صفحه جزئیات محصول
// ==========================================================

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('productDetail');
    
    // دریافت ID از URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    console.log('🔍 Product ID from URL:', productId);
    
    if (!productId || isNaN(productId)) {
        container.innerHTML = `
            <div class="error-state">
                <i class="ri-error-warning-line"></i>
                <h2>محصولی یافت نشد</h2>
                <p>لطفاً از طریق صفحه محصولات، محصول مورد نظر خود را انتخاب کنید.</p>
                <a href="allproducts.html" class="btn-primary">بازگشت به محصولات</a>
            </div>
        `;
        return;
    }
    
    // بررسی وجود PRODUCTS
    if (typeof PRODUCTS === 'undefined') {
        console.error('❌ PRODUCTS تعریف نشده است!');
        container.innerHTML = `
            <div class="error-state">
                <i class="ri-error-warning-line"></i>
                <h2>خطا در بارگذاری محصولات</h2>
                <p>داده‌های محصولات به درستی بارگذاری نشدند. لطفاً صفحه را مجدداً بارگذاری کنید.</p>
                <a href="allproducts.html" class="btn-primary">بازگشت به محصولات</a>
            </div>
        `;
        return;
    }
    
    // پیدا کردن محصول با ID
    const product = PRODUCTS.find(p => p.id === productId);
    
    console.log('🔍 محصول پیدا شده:', product);
    
    if (!product) {
        container.innerHTML = `
            <div class="error-state">
                <i class="ri-error-warning-line"></i>
                <h2>محصول مورد نظر یافت نشد</h2>
                <p>محصول با شناسه ${productId} در فروشگاه موجود نیست.</p>
                <a href="allproducts.html" class="btn-primary">مشاهده محصولات</a>
            </div>
        `;
        return;
    }
    
    // تغییر عنوان صفحه
    document.title = `${product.name} | KICKS`;
    
    // تولید ستاره‌ها
    function getStarsHtml(rating) {
        let html = '';
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                html += '<i class="ri-star-fill"></i>';
            } else if (i === fullStars && halfStar) {
                html += '<i class="ri-star-half-fill"></i>';
            } else {
                html += '<i class="ri-star-line"></i>';
            }
        }
        return html;
    }
    
    // فرمت قیمت
    function formatPrice(price) {
        return price.toLocaleString('fa-IR');
    }
    
    const starsHtml = getStarsHtml(product.rating);
    const oldPriceHtml = product.oldPrice ? 
        `<span class="old-price">${formatPrice(product.oldPrice)} تومان</span>` : '';
    const discountHtml = product.discount > 0 ? 
        `<span class="discount-badge">-${product.discount}%</span>` : '';
    const badgeHtml = product.badge ? 
        `<span class="product-badge ${product.badge}">${product.badgeText}</span>` : '';
    
    container.innerHTML = `
        <div class="product-detail-grid">
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.name}" />
                ${badgeHtml}
            </div>
            <div class="product-detail-info">
                <div class="breadcrumb">
                    <a href="index.html">خانه</a>
                    <i class="ri-arrow-left-s-line"></i>
                    <a href="allproducts.html">محصولات</a>
                    <i class="ri-arrow-left-s-line"></i>
                    <span>${product.name}</span>
                </div>
                
                <h1 class="product-detail-title">${product.name}</h1>
                
                <div class="product-detail-rating">
                    ${starsHtml}
                    <span>(${product.reviews} نظر)</span>
                </div>
                
                <div class="product-detail-price">
                    <span class="current-price">${formatPrice(product.price)} تومان</span>
                    ${oldPriceHtml}
                    ${discountHtml}
                </div>
                
                <div class="product-detail-description">
                    <h3>توضیحات محصول</h3>
                    <p>${product.description || 'این محصول با بهترین کیفیت و مواد اولیه تولید شده است.'}</p>
                </div>
                
                <div class="product-detail-features">
                    <div class="feature-item">
                        <i class="ri-checkbox-circle-fill"></i>
                        <span>کیفیت تضمینی</span>
                    </div>
                    <div class="feature-item">
                        <i class="ri-checkbox-circle-fill"></i>
                        <span>گارانتی اصالت کالا</span>
                    </div>
                    <div class="feature-item">
                        <i class="ri-checkbox-circle-fill"></i>
                        <span>ارسال رایگان</span>
                    </div>
                    <div class="feature-item">
                        <i class="ri-checkbox-circle-fill"></i>
                        <span>پشتیبانی ۲۴ ساعته</span>
                    </div>
                </div>
                
                <div class="product-detail-actions">
                    <button class="add-to-cart-btn" 
                            data-product-name="${product.name}" 
                            data-product-price="${product.price}" 
                            data-product-image="${product.image}">
                        <i class="ri-shopping-cart-line"></i>
                        افزودن به سبد خرید
                    </button>
                    <button class="favorite-btn" 
                            data-product-name="${product.name}" 
                            data-product-price="${product.price}" 
                            data-product-image="${product.image}">
                        <i class="ri-heart-line"></i>
                        علاقه‌مندی
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // رویداد افزودن به سبد خرید
    const addToCartBtn = container.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', function() {
        const name = this.dataset.productName;
        const price = this.dataset.productPrice;
        const image = this.dataset.productImage;
        if (typeof addToCart === 'function') {
            addToCart(name, price, image);
        } else {
            // اگر تابع addToCart در دسترس نبود، مستقیماً به localStorage اضافه کن
            let cart = JSON.parse(localStorage.getItem('kicks_cart')) || [];
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1;
            } else {
                cart.push({
                    id: Date.now(),
                    name: name,
                    price: price,
                    image: image || './assets/shoe-1.jpeg',
                    quantity: 1
                });
            }
            localStorage.setItem('kicks_cart', JSON.stringify(cart));
            // به‌روزرسانی نشان سبد خرید
            const badges = document.querySelectorAll('.cart-badge');
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            badges.forEach(b => b.textContent = totalItems);
            
            // نمایش نوتیفیکیشن
            const toast = document.createElement('div');
            toast.className = 'notification-toast';
            toast.innerHTML = `<i class="ri-checkbox-circle-fill"></i><span>${name} به سبد خرید اضافه شد! 🛒</span>`;
            document.body.appendChild(toast);
            setTimeout(() => { toast.remove(); }, 3000);
        }
    });
    
    // رویداد علاقه‌مندی
    const favoriteBtn = container.querySelector('.favorite-btn');
    const favorites = JSON.parse(localStorage.getItem('kicks_favorites')) || [];
    const isFav = favorites.some(item => item.name === product.name);
    if (isFav) {
        favoriteBtn.classList.add('active');
        favoriteBtn.querySelector('i').className = 'ri-heart-fill';
    }
    
    favoriteBtn.addEventListener('click', function() {
        const name = this.dataset.productName;
        const price = this.dataset.productPrice;
        const image = this.dataset.productImage;
        
        let favorites = JSON.parse(localStorage.getItem('kicks_favorites')) || [];
        const index = favorites.findIndex(item => item.name === name);
        
        if (index > -1) {
            favorites.splice(index, 1);
            this.classList.remove('active');
            this.querySelector('i').className = 'ri-heart-line';
            // نمایش نوتیفیکیشن
            const toast = document.createElement('div');
            toast.className = 'notification-toast';
            toast.style.background = 'linear-gradient(135deg, #ff4757, #ff6b81)';
            toast.innerHTML = `<i class="ri-heart-fill"></i><span>${name} از علاقه‌مندی‌ها حذف شد! 💔</span>`;
            document.body.appendChild(toast);
            setTimeout(() => { toast.remove(); }, 3000);
        } else {
            favorites.push({
                id: Date.now(),
                name: name,
                price: price,
                image: image || './assets/shoe-1.jpeg'
            });
            this.classList.add('active');
            this.querySelector('i').className = 'ri-heart-fill';
            // نمایش نوتیفیکیشن
            const toast = document.createElement('div');
            toast.className = 'notification-toast';
            toast.innerHTML = `<i class="ri-heart-fill"></i><span>${name} به علاقه‌مندی‌ها اضافه شد! ❤️</span>`;
            document.body.appendChild(toast);
            setTimeout(() => { toast.remove(); }, 3000);
        }
        
        localStorage.setItem('kicks_favorites', JSON.stringify(favorites));
        
        // به‌روزرسانی نشان علاقه‌مندی‌ها
        const favBadges = document.querySelectorAll('.favorites-badge');
        favBadges.forEach(b => b.textContent = favorites.length);
    });
    
    console.log(`✅ محصول "${product.name}" با ID ${product.id} بارگذاری شد!`);
});