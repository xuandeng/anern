// Focus.js - 轮播图组件
// 符合CMS系统规范的轮播图组件
module.exports = function(siteData, data, util) {
    // 解析data参数
    const params = data ? JSON.parse(data.replace(/'/g, '"')) : {};
    
    // 默认配置
    const config = {
        suggestRatio: params.suggestRatio || '1920 * 600',
        isAuto: params.isAuto !== undefined ? params.isAuto : true,
        imgAutoFit: params.imgAutoFit !== undefined ? params.imgAutoFit : true,
        intervalTime: params.intervalTime || 5000,
        width: params.width || '100%',
        height: params.height || '100vh',
        marginTop: params.marginTop || '',
        btn_color: params.btn_color || '#ffffff',
        swiper_theme_color: params.swiper_theme_color || '#3b82f6',
        items: params.items || [
            {
                src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1958&q=80',
                href: '#',
                sortIndex: 1,
                text1: 'Make Yourself At Home',
                text2: 'Discover Our Beautiful Furniture Collection',
                text3: 'Transform your space with our premium furniture'
            },
            {
                src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1950&q=80',
                href: '#',
                sortIndex: 2,
                text1: 'New Collection',
                text2: 'Perfect Set For Your Living Room',
                text3: 'Comfortable and stylish furniture for modern living'
            },
            {
                src: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1992&q=80',
                href: '#',
                sortIndex: 3,
                text1: 'Sales Up To 50% OFF',
                text2: 'Limited Time Offer',
                text3: 'Don\'t miss out on our biggest sale of the year'
            }
        ]
    };

    // 按sortIndex排序
    config.items.sort((a, b) => a.sortIndex - b.sortIndex);

    // 生成HTML
    const html = `
        <div class="hero-slider relative ${config.marginTop}" style="width: ${config.width}; height: ${config.height};">
            <div class="swiper-container h-full" x-data="heroSlider(${JSON.stringify(config)})">
                <div class="swiper-wrapper">
                    ${config.items.map((item, index) => `
                        <div class="swiper-slide relative flex items-center justify-center bg-cover bg-center bg-gray-800" 
                             style="background-image: url('${item.src}');">
                            <div class="absolute inset-0 bg-black bg-opacity-40"></div>
                            <div class="relative z-10 text-center text-white max-w-4xl px-4">
                                ${item.text1 ? `<h1 class="text-4xl md:text-6xl font-bold mb-4">${item.text1}</h1>` : ''}
                                ${item.text2 ? `<h2 class="text-xl md:text-2xl mb-6">${item.text2}</h2>` : ''}
                                ${item.text3 ? `<p class="text-lg md:text-xl mb-8 max-w-2xl mx-auto">${item.text3}</p>` : ''}
                                ${item.href && item.href !== '#' ? `
                                    <a href="${item.href}" class="inline-block bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
                                        Shop Now
                                    </a>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Navigation buttons -->
                <div class="swiper-button-prev" style="color: ${config.btn_color};"></div>
                <div class="swiper-button-next" style="color: ${config.btn_color};"></div>
                
                <!-- Pagination -->
                <div class="swiper-pagination" style="--swiper-theme-color: ${config.swiper_theme_color};"></div>
                
                <!-- Scroll indicator -->
                <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                    <div class="text-white text-center">
                        <p class="text-sm mb-2">Scroll Down</p>
                        <svg class="w-6 h-6 mx-auto animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <script>
            function heroSlider(config) {
                return {
                    swiper: null,
                    init() {
                        this.$nextTick(() => {
                            // Initialize Swiper
                            this.swiper = new Swiper('.swiper-container', {
                                loop: true,
                                autoplay: config.isAuto ? {
                                    delay: config.intervalTime,
                                    disableOnInteraction: false,
                                } : false,
                                pagination: {
                                    el: '.swiper-pagination',
                                    clickable: true,
                                },
                                navigation: {
                                    nextEl: '.swiper-button-next',
                                    prevEl: '.swiper-button-prev',
                                },
                                effect: 'fade',
                                fadeEffect: {
                                    crossFade: true
                                },
                                speed: 1000,
                            });
                        });
                    },
                    destroy() {
                        if (this.swiper) {
                            this.swiper.destroy();
                        }
                    }
                }
            }
        </script>
    `;

    return html;
};