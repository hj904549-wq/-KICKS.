// ==========================================================
// products-data.js - داده‌های یکپارچه محصولات
// ==========================================================

const PRODUCTS = [
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
        description: "کفش ورزشی نایک با طراحی مدرن و کیفیت بالا. مناسب برای ورزش و استفاده روزمره. دارای کفی نرم و قوس‌دار برای راحتی بیشتر پا."
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
        description: "کفش اسپرت آدیداس با راحتی فوق‌العاده و طراحی شیک. مناسب برای پیاده‌روی و استفاده روزمره. وزن سبک و تنفس‌پذیری بالا."
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
        description: "کفش رسمی پوما مناسب برای محیط‌های کاری و مجلسی. طراحی کلاسیک با کیفیت ساخت بالا و چرم طبیعی."
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
        description: "کفش بسکتبال جردن با طراحی افسانه‌ای و کیفیت بی‌نظیر. مناسب برای بازی‌های حرفه‌ای با ضربه‌گیری عالی و پشتیبانی کامل از قوس پا."
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
        description: "کفش پیاده‌روی نیوبالانس با راحتی فوق‌العاده و طراحی ارگونومیک. مناسب برای پیاده‌روی‌های طولانی و استفاده روزمره."
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
        description: "کفش مجلسی گوچی با طراحی لوکس و کیفیت استثنایی. مناسب برای مهمانی‌ها و مراسم خاص با ظاهری شیک و جذاب."
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
        description: "کفش دویدن نایک با فناوری‌های پیشرفته و طراحی سبک. مناسب برای دوندگان حرفه‌ای با قابلیت ضربه‌گیری عالی."
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
        description: "کفش زنانه آدیداس با طراحی زیبا و راحتی فوق‌العاده. مناسب برای استفاده روزمره و فعالیت‌های سبک ورزشی."
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
        description: "کفش مردانه پوما با طراحی اسپرت و کیفیت مناسب. انتخابی عالی برای استفاده روزمره و فعالیت‌های غیررسمی."
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
        description: "کفش ورزشی جردن با طراحی منحصر‌به‌فرد و کیفیت عالی. مناسب برای ورزش‌های مختلف و استفاده روزمره."
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
        description: "کفش مجلسی ورساچه با طراحی شیک و کیفیت بالا. مناسب برای مراسم رسمی و مجلسی با ظاهری لوکس."
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
        description: "کفش زنانه نیوبالانس با طراحی زیبا و راحتی عالی. مناسب برای استفاده روزمره و پیاده‌روی."
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
        description: "کفش اسپرت نایک با طراحی مدرن و کیفیت بالا. مناسب برای ورزش و استفاده روزمره."
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
        description: "کفش زنانه پوما با طراحی زیبا و کیفیت مناسب. انتخابی عالی برای استفاده روزمره."
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
        description: "کفش رسمی جردن با طراحی شیک و کیفیت بالا. مناسب برای محیط‌های کاری و رسمی."
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
        description: "کفش پیاده‌روی گوچی با طراحی لوکس و کیفیت عالی. مناسب برای استفاده روزمره و پیاده‌روی."
    }
];

// ==========================================================
// توابع کمکی برای کار با محصولات
// ==========================================================

// دریافت محصول با ID
function getProductById(id) {
    return PRODUCTS.find(p => p.id === id);
}

// دریافت محصولات با فیلتر
function getProductsByCategory(category) {
    if (category === 'all') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === category);
}

// دریافت محصولات حراج
function getSaleProducts() {
    return PRODUCTS.filter(p => p.discount > 0 || p.badge === 'sale');
}

// دریافت محصولات جدید
function getNewProducts() {
    return PRODUCTS.filter(p => p.badge === 'new');
}

// دریافت محصولات پرفروش
function getHotProducts() {
    return PRODUCTS.filter(p => p.badge === 'hot');
}

// فرمت کردن قیمت
function formatPrice(price) {
    return price.toLocaleString('fa-IR');
}

// تولید ستاره‌ها بر اساس امتیاز
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