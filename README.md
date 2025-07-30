# RPT Battery Solutions - Modern Energy Storage Website

A cutting-edge, responsive website for RPT Battery Solutions, showcasing advanced lithium battery energy storage systems with modern design and interactive features.

## 🚀 Features

### Design & User Experience
- **Modern UI/UX**: Clean, professional design with advanced animations and transitions
- **Responsive Design**: Fully optimized for all devices (mobile, tablet, desktop)
- **Dark/Light Themes**: Modern color schemes with gradient backgrounds
- **Interactive Elements**: Hover effects, animations, and dynamic content
- **Progressive Enhancement**: Graceful degradation across all browsers

### Technical Highlights
- **Pure HTML5**: Semantic markup for accessibility and SEO
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Alpine.js**: Lightweight JavaScript framework for reactivity
- **Component-Based**: Modular, reusable components
- **Performance Optimized**: Fast loading times and smooth animations

### Content & Pages
- **Homepage**: Hero section with product showcase and company overview
- **Products**: Comprehensive product catalog with filtering and search
- **About Us**: Company history, mission, values, and team information
- **Contact Pages**: Multiple contact forms and department-specific contacts
- **Interactive Forms**: Real-time validation and user feedback

## 🛠️ Technology Stack

- **HTML5**: Semantic markup and accessibility features
- **CSS**: Tailwind CSS v3.4+ with custom components
- **JavaScript**: Alpine.js v3.13+ for reactivity
- **Build Tools**: Tailwind CLI for CSS compilation
- **Fonts**: Google Fonts (Inter, Poppins, JetBrains Mono)

## 📁 Project Structure

```
rpt-battery-website/
├── src/
│   └── input.css              # Tailwind CSS source file
├── dist/
│   └── output.css             # Compiled CSS file
├── index.html                 # Homepage (English)
├── products.html              # Product catalog page
├── aboutus.html               # About us page
├── contactus.html             # Contact us page
├── contactnow.html            # Quick contact/quote page
├── package.json               # Project dependencies
├── tailwind.config.js         # Tailwind CSS configuration
└── README.md                  # Project documentation
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (#0ea5e9 to #0369a1)
- **Secondary**: Green accent (#22c55e to #15803d)
- **Accent**: Orange highlights (#f97316 to #ea580c)
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Headers**: Bold, large fonts with gradient text effects
- **Body**: Clean, readable typography with proper hierarchy
- **Interactive**: Hover states and focus indicators

### Components
- **Buttons**: Multiple variants (primary, secondary, accent)
- **Cards**: Shadow effects with hover animations
- **Forms**: Modern input fields with validation states
- **Navigation**: Responsive with mobile-friendly menu

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project files**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Development workflow**
   ```bash
   # Watch for CSS changes (development)
   npm run dev
   
   # Build CSS for production
   npm run build
   
   # Serve the website locally
   npm run serve
   ```

4. **Open in browser**
   - Navigate to `http://localhost:8000`
   - Or simply open `index.html` in your browser

### Development Commands

```bash
# Watch mode - automatically rebuilds CSS on changes
npm run dev

# Production build - minified CSS
npm run build

# Local server - serves files on port 8000
npm run serve
```

## 📱 Page Overview

### Homepage (`index.html`)
- Hero section with animated background
- Product showcase with interactive cards
- Company introduction and statistics
- Call-to-action sections
- Footer with comprehensive links

### Products (`products.html`)
- Advanced product filtering and search
- Product comparison tool
- Interactive product cards
- Technical specifications display
- Category-based navigation

### About Us (`aboutus.html`)
- Company story and timeline
- Mission, vision, and values
- Leadership team profiles
- Certifications and awards
- Interactive company journey

### Contact Pages
- **Contact Us** (`contactus.html`): Comprehensive contact information
- **Quick Quote** (`contactnow.html`): Fast quote request form
- Department-specific contact details
- Interactive maps and location info
- FAQ section with accordion interface

## 🎯 Key Features

### Interactive Elements
- **Product Filtering**: Dynamic search and category filters
- **Contact Forms**: Real-time validation with Alpine.js
- **Animations**: Scroll-triggered animations and hover effects
- **Mobile Menu**: Responsive navigation with smooth transitions

### Performance Features
- **Optimized CSS**: Purged CSS for smaller file sizes
- **Lazy Loading**: Images load as needed for faster initial load
- **Modern Fonts**: Web font optimization
- **Semantic HTML**: SEO-friendly markup structure

### Accessibility
- **ARIA Labels**: Screen reader compatibility
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliant color schemes
- **Responsive Design**: Works on all device sizes

## 🔧 Customization

### Colors
Edit `tailwind.config.js` to modify the color palette:

```javascript
colors: {
  primary: { /* your colors */ },
  secondary: { /* your colors */ },
  // ...
}
```

### Components
Modify component styles in `src/input.css`:

```css
@layer components {
  .btn-primary {
    /* your custom button styles */
  }
}
```

### Content
Update content directly in the HTML files or create new pages following the established structure.

## 📊 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Progressive Enhancement**: Graceful degradation for older browsers

## 🔮 Future Enhancements

- **CMS Integration**: Content management system integration
- **Multi-language**: Internationalization support
- **E-commerce**: Product ordering and payment system
- **Blog System**: News and article management
- **Customer Portal**: User accounts and order tracking

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- **Email**: info@rpt-battery.com
- **Website**: www.rpt-battery.com
- **Technical Issues**: Create an issue in the project repository

---

**Built with ❤️ for the future of energy storage**
