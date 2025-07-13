// 页面动画控制器
class PageAnimations {
    constructor() {
        this.init();
    }

    init() {
        // 页面加载完成后初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeAnimations();
            });
        } else {
            this.initializeAnimations();
        }
    }

    initializeAnimations() {
        this.setupPageLoader();
        this.setupScrollAnimations();
        this.setupScrollProgress();
        this.setupPageTransitions();
        this.setupCounterAnimations();
        this.setupTypewriter();
        this.setupParallax();
        this.setupFormAnimations();
        this.setupImageLazyLoading();
    }

    // 页面加载动画
    setupPageLoader() {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 1000);
        }
    }

    // 滚动触发动画
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    target.classList.add('animate');
                    
                    // 为子元素添加延迟动画
                    const children = target.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-up, .fade-in-down, .scale-in, .rotate-in');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        // 观察所有需要动画的元素
        const animatedElements = document.querySelectorAll(
            '.fade-in, .fade-in-left, .fade-in-right, .fade-in-up, .fade-in-down, .scale-in, .rotate-in'
        );
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // 滚动进度条
    setupScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) {
            // 如果没有进度条，创建一个
            const progress = document.createElement('div');
            progress.className = 'scroll-progress';
            document.body.appendChild(progress);
        }

        const updateProgress = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            
            const progressBar = document.querySelector('.scroll-progress');
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
        };

        window.addEventListener('scroll', updateProgress);
        updateProgress();
    }

    // 页面过渡动画
    setupPageTransitions() {
        const links = document.querySelectorAll('a[href^="/"]:not([href*="#"]), a[href$=".html"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href !== '#' && !href.startsWith('#')) {
                    e.preventDefault();
                    this.navigateWithTransition(href);
                }
            });
        });
    }

    navigateWithTransition(href) {
        // 创建过渡元素
        const transition = document.createElement('div');
        transition.className = 'page-transition';
        document.body.appendChild(transition);

        // 触发过渡动画
        setTimeout(() => {
            transition.classList.add('active');
        }, 10);

        // 在动画完成后跳转
        setTimeout(() => {
            window.location.href = href;
        }, 300);
    }

    // 数字滚动动画
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.counter');
        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target) || 0;
                    const duration = parseInt(counter.dataset.duration) || 2000;
                    
                    this.animateCounter(counter, target, duration);
                    observer.unobserve(counter);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(element, target, duration) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);

            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }

    // 打字机效果
    setupTypewriter() {
        const typewriters = document.querySelectorAll('.typewriter');
        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const text = element.textContent;
                    const speed = parseInt(element.dataset.speed) || 50;
                    
                    element.textContent = '';
                    this.typeText(element, text, speed);
                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        typewriters.forEach(typewriter => {
            observer.observe(typewriter);
        });
    }

    typeText(element, text, speed) {
        let index = 0;
        const timer = setInterval(() => {
            element.textContent += text[index];
            index++;

            if (index >= text.length) {
                clearInterval(timer);
                element.classList.remove('typewriter');
            }
        }, speed);
    }

    // 视差滚动效果
    setupParallax() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        const updateParallax = () => {
            const scrollTop = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.speed) || 0.5;
                const yPos = -(scrollTop * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        };

        window.addEventListener('scroll', updateParallax);
        updateParallax();
    }

    // 表单动画
    setupFormAnimations() {
        const inputs = document.querySelectorAll('.form-input');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
            
            // 检查初始值
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
    }

    // 图片懒加载
    setupImageLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('fade-in');
                    
                    img.onload = () => {
                        img.classList.add('animate');
                    };
                    
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// 工具函数
class AnimationUtils {
    // 添加动画类
    static addAnimation(element, animationClass) {
        element.classList.add(animationClass);
    }

    // 移除动画类
    static removeAnimation(element, animationClass) {
        element.classList.remove(animationClass);
    }

    // 切换动画类
    static toggleAnimation(element, animationClass) {
        element.classList.toggle(animationClass);
    }

    // 批量添加动画
    static addBatchAnimation(elements, animationClass, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add(animationClass);
            }, index * delay);
        });
    }

    // 摇摆动画
    static shake(element) {
        element.classList.add('shake');
        setTimeout(() => {
            element.classList.remove('shake');
        }, 500);
    }

    // 脉冲动画
    static pulse(element) {
        element.classList.add('pulse');
        setTimeout(() => {
            element.classList.remove('pulse');
        }, 2000);
    }

    // 弹跳动画
    static bounce(element) {
        element.classList.add('bounce-in');
        setTimeout(() => {
            element.classList.remove('bounce-in');
        }, 800);
    }
}

// 特殊效果
class SpecialEffects {
    // 粒子效果
    static createParticles(container, count = 50) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: white;
                border-radius: 50%;
                animation: float ${Math.random() * 3 + 2}s ease-in-out infinite;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.5 + 0.3};
            `;
            container.appendChild(particle);
        }
    }

    // 光标跟随效果
    static setupCursorFollower() {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-follower';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease-out;
        `;
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });

        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'scale(0.8)';
        });

        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'scale(1)';
        });
    }

    // 滚动触发粒子效果
    static setupScrollParticles() {
        window.addEventListener('scroll', () => {
            if (Math.random() < 0.1) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: 6px;
                    height: 6px;
                    background: linear-gradient(45deg, #667eea, #764ba2);
                    border-radius: 50%;
                    right: 20px;
                    top: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    animation: particleFloat 2s ease-out forwards;
                `;
                document.body.appendChild(particle);

                setTimeout(() => {
                    particle.remove();
                }, 2000);
            }
        });
    }
}

// 初始化动画系统
const pageAnimations = new PageAnimations();

// 添加必要的CSS动画
const additionalStyles = `
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    @keyframes particleFloat {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-100px) scale(0); opacity: 0; }
    }
    
    .particle {
        animation: float 3s ease-in-out infinite;
    }
`;

// 将样式添加到页面
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// 导出工具类供其他脚本使用
window.AnimationUtils = AnimationUtils;
window.SpecialEffects = SpecialEffects;

// 页面卸载时的过渡效果
window.addEventListener('beforeunload', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease-out';
});

// 移动端优化
if (window.innerWidth <= 768) {
    // 在移动设备上禁用某些动画以提高性能
    document.body.classList.add('mobile-optimized');
}

// 性能监控
const performanceMonitor = {
    fps: 0,
    lastTime: performance.now(),
    
    update() {
        const now = performance.now();
        this.fps = 1000 / (now - this.lastTime);
        this.lastTime = now;
        
        // 如果FPS过低，减少动画效果
        if (this.fps < 30) {
            document.body.classList.add('low-performance');
        } else {
            document.body.classList.remove('low-performance');
        }
    }
};

// 定期检查性能
setInterval(() => {
    performanceMonitor.update();
}, 1000);