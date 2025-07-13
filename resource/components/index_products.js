// index_products.js - 首页推荐产品组件
// 符合CMS系统规范的首页产品展示组件
module.exports = function(siteData, data, util) {
    const { _ } = util;
    
    // 解析data参数
    const params = data ? JSON.parse(data.replace(/'/g, '"')) : {};
    
    // 默认配置
    const config = {
        limit: params.limit || 8,
        category: params.category || null,
        section_title: params.section_title || 'Best Seller',
        section_subtitle: params.section_subtitle || 'Discover Our Most Selling Products',
        show_category_filter: params.show_category_filter !== undefined ? params.show_category_filter : true,
        show_view_all: params.show_view_all !== undefined ? params.show_view_all : true
    };

    // 获取产品数据
    let products = siteData.products || [];
    
    // 如果指定了分类，则过滤产品
    if (config.category) {
        products = products.filter(product => 
            product.product_category_name === config.category ||
            product.product_category_id === config.category
        );
    }

    // 限制产品数量
    products = products.slice(0, config.limit);

    // 获取产品分类数据
    const categories = siteData.product_categorys || [];

    // 模拟产品数据（如果没有真实数据）
    if (products.length === 0) {
        products = [
            {
                id: 1,
                title: 'Brown Living Room Sofa',
                product_category_name: 'Living Room',
                thumb_img_urls: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
                regular_price: 1200,
                sale_price: 1200,
                link: 'product_tpl.html?id=1'
            },
            {
                id: 2,
                title: 'Egyptian Vase',
                product_category_name: 'Home Office',
                thumb_img_urls: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
                regular_price: 400,
                sale_price: 400,
                link: 'product_tpl.html?id=2'
            },
            {
                id: 3,
                title: 'Green Living Room Sofa',
                product_category_name: 'Living Room',
                thumb_img_urls: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
                regular_price: 1840,
                sale_price: 1200,
                link: 'product_tpl.html?id=3'
            },
            {
                id: 4,
                title: 'Modern Emerald Fabric Chair',
                product_category_name: 'Chair',
                thumb_img_urls: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
                regular_price: 860,
                sale_price: 860,
                link: 'product_tpl.html?id=4'
            },
            {
                id: 5,
                title: 'Kitchen Cabinet',
                product_category_name: 'Cabinet',
                thumb_img_urls: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
                regular_price: 1150.25,
                sale_price: 1150.25,
                link: 'product_tpl.html?id=5'
            },
            {
                id: 6,
                title: 'Bedroom Single Chair',
                product_category_name: 'Bedroom',
                thumb_img_urls: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
                regular_price: 504,
                sale_price: 504,
                link: 'product_tpl.html?id=6'
            },
            {
                id: 7,
                title: 'Bathroom Golden Ring Mirror',
                product_category_name: 'Bathroom',
                thumb_img_urls: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
                regular_price: 124.25,
                sale_price: 124.25,
                link: 'product_tpl.html?id=7'
            },
            {
                id: 8,
                title: 'Wall Hanging Cabinet',
                product_category_name: 'Cabinet',
                thumb_img_urls: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
                regular_price: 840,
                sale_price: 840,
                link: 'product_tpl.html?id=8'
            }
        ];
    }

    // 生成HTML
    const html = `
        <section class="py-16 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Section Header -->
                <div class="text-center mb-12">
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">${config.section_title}</h2>
                    <p class="text-lg text-gray-600 max-w-2xl mx-auto">${config.section_subtitle}</p>
                </div>

                ${config.show_category_filter ? `
                <!-- Category Filter -->
                <div class="flex flex-wrap justify-center gap-4 mb-12">
                    <button class="category-filter active px-6 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition" data-category="all">
                        All Products
                    </button>
                    <button class="category-filter px-6 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition" data-category="Living Room">
                        Living Room
                    </button>
                    <button class="category-filter px-6 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition" data-category="Bedroom">
                        Bedroom
                    </button>
                    <button class="category-filter px-6 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition" data-category="Kitchen">
                        Kitchen
                    </button>
                    <button class="category-filter px-6 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition" data-category="Bathroom">
                        Bathroom
                    </button>
                </div>
                ` : ''}

                <!-- Products Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    ${products.map(product => {
                        const isOnSale = product.sale_price < product.regular_price;
                        const imageUrl = Array.isArray(product.thumb_img_urls) ? product.thumb_img_urls[0] : product.thumb_img_urls;
                        
                        return `
                            <div class="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group" data-category="${product.product_category_name}">
                                <div class="relative overflow-hidden">
                                    <img src="${imageUrl}" alt="${product.title}" class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300">
                                    ${isOnSale ? '<div class="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">Sale!</div>' : ''}
                                    <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button class="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition mb-2">
                                            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                            </svg>
                                        </button>
                                        <button class="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition">
                                            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div class="p-6">
                                    <p class="text-sm text-gray-500 mb-2">${product.product_category_name}</p>
                                    <h3 class="text-lg font-semibold text-gray-900 mb-3">${product.title}</h3>
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center space-x-2">
                                            ${isOnSale ? `<span class="text-gray-500 line-through">$${product.regular_price.toFixed(2)}</span>` : ''}
                                            <span class="text-xl font-bold text-gray-900">$${product.sale_price.toFixed(2)}</span>
                                        </div>
                                        <button class="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition">
                                            Add to cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                ${config.show_view_all ? `
                <!-- View All Button -->
                <div class="text-center">
                    <a href="products.html" class="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
                        View All Best Sellers
                    </a>
                </div>
                ` : ''}
            </div>
        </section>

        <script>
            // Category filtering functionality
            document.addEventListener('DOMContentLoaded', function() {
                const categoryButtons = document.querySelectorAll('.category-filter');
                const productCards = document.querySelectorAll('.product-card');

                categoryButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const category = this.dataset.category;
                        
                        // Update active button
                        categoryButtons.forEach(btn => {
                            btn.classList.remove('active', 'bg-gray-900', 'text-white');
                            btn.classList.add('bg-gray-200', 'text-gray-700');
                        });
                        this.classList.add('active', 'bg-gray-900', 'text-white');
                        this.classList.remove('bg-gray-200', 'text-gray-700');

                        // Filter products
                        productCards.forEach(card => {
                            if (category === 'all' || card.dataset.category === category) {
                                card.style.display = 'block';
                            } else {
                                card.style.display = 'none';
                            }
                        });
                    });
                });
            });
        </script>
    `;

    return html;
};