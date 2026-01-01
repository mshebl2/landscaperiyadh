const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://eslamabdaltif:oneone2@cluster0.k0laen8.mongodb.net/?appName=Cluster0';

// Project Schema
const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    titleAr: { type: String, required: true },
    description: { type: String, required: true },
    descriptionAr: { type: String, required: true },
    image: { type: String, required: true },
    galleryImages: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    tagsAr: { type: [String], default: [] },
    category: { type: String, required: true },
    categoryAr: { type: String, required: true },
    year: { type: String, required: true },
    link: { type: String },
    featured: { type: Boolean, default: false },
}, { timestamps: true });

// Service Schema
const ServiceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    titleAr: { type: String, required: true },
    description: { type: String, required: true },
    descriptionAr: { type: String, required: true },
    icon: { type: String, required: true },
    image: { type: String },
    features: { type: [String], default: [] },
    featuresAr: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
}, { timestamps: true });

// Banner Schema
const BannerSchema = new mongoose.Schema({
    page: { type: String, enum: ['home', 'contact', 'about'], required: true, unique: true },
    image: { type: String, required: true },
}, { timestamps: true });

// HomeSlide Schema
const HomeSlideSchema = new mongoose.Schema({
    title: { type: String, required: true },
    titleAr: { type: String, required: true },
    subtitle: { type: String, required: true },
    subtitleAr: { type: String, required: true },
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

// PageAsset Schema
const PageAssetSchema = new mongoose.Schema({
    page: { type: String, required: true },
    section: { type: String, required: true },
    key: { type: String, required: true },
    imageUrl: { type: String, required: true },
    alt: String,
    altAr: String,
    text: String,
    textAr: String,
    order: { type: Number, default: 0 }
}, { timestamps: true });

PageAssetSchema.index({ page: 1, section: 1, key: 1 }, { unique: true });

const samplePageAssets = [
    // About Page - Intro
    {
        page: 'about',
        section: 'intro',
        key: 'main-image',
        imageUrl: 'https://www.landscapingkw.com/wp-content/uploads/2022/03/%D8%AA%D8%B5%D9%85%D9%8A%D9%85-%D8%AD%D8%AF%D8%A7%D8%A6%D9%82-%D9%81%D9%84%D9%84-%D8%A8%D8%A7%D9%84%D9%83%D9%88%D9%8A%D8%AA-%D8%AA%D9%86%D8%B3%D9%8A%D9%82-%D8%AD%D8%AF%D8%A7%D8%A6%D9%82-%D9%81%D9%84%D9%84-%D8%A8%D8%A7%D9%84%D9%83%D9%88%D9%8A%D8%AA.jpg',
        alt: 'Landscaping Professional Team',
        altAr: 'فريق عمل محترف لتنسيق الحدائق'
    },
    // About Page - Team
    {
        page: 'about',
        section: 'team',
        key: 'member-1',
        imageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        alt: 'Design Manager',
        altAr: 'مدير التصميم',
        text: 'Ahmed Mohamed',
        textAr: 'أحمد محمد'
    },
    {
        page: 'about',
        section: 'team',
        key: 'member-2',
        imageUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        alt: 'Agricultural Engineer',
        altAr: 'مهندسة زراعية',
        text: 'Sara Ahmed',
        textAr: 'سارة أحمد'
    },
    {
        page: 'about',
        section: 'team',
        key: 'member-3',
        imageUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        alt: 'Execution Supervisor',
        altAr: 'مشرف التنفيذ',
        text: 'Mohamed Ali',
        textAr: 'محمد علي'
    },
    // Home Page - Why Choose Us
    {
        page: 'home',
        section: 'why-choose-us',
        key: 'experience',
        imageUrl: 'leaf',
        alt: '15+ Years Experience',
        altAr: 'خبرة 15+ سنة',
        text: 'Leaders in landscaping in Riyadh',
        textAr: 'رواد في مجال تنسيق الحدائق بالرياض',
        order: 0
    },
    {
        page: 'home',
        section: 'why-choose-us',
        key: 'team',
        imageUrl: 'users',
        alt: 'Specialized Team',
        altAr: 'فريق متخصص',
        text: 'Engineers and experts in design and execution',
        textAr: 'مهندسون وخبراء في التصميم والتنفيذ',
        order: 1
    },
    {
        page: 'home',
        section: 'why-choose-us',
        key: 'quality',
        imageUrl: 'star',
        alt: 'Exceptional Quality',
        altAr: 'جودة استثنائية',
        text: 'Best international materials and techniques',
        textAr: 'أفضل المواد والتقنيات العالمية',
        order: 2
    },
    {
        page: 'home',
        section: 'why-choose-us',
        key: 'guarantee',
        imageUrl: 'shield-check',
        alt: 'Comprehensive Warranty',
        altAr: 'ضمان شامل',
        text: 'Warranty on all works and services',
        textAr: 'ضمان على جميع الأعمال والخدمات',
        order: 3
    },
    // Contact Page - FAQ
    {
        page: 'contact',
        section: 'faq',
        key: 'duration',
        imageUrl: 'clock',
        alt: 'How long does the project take?',
        altAr: 'كم تستغرق مدة تنفيذ المشروع؟',
        text: 'Duration varies by project size, from a week for small projects to several months for large ones.',
        textAr: 'تختلف مدة التنفيذ حسب حجم المشروع، من أسبوع للمشاريع الصغيرة إلى عدة أشهر للمشاريع الكبيرة.',
        order: 0
    },
    {
        page: 'contact',
        section: 'faq',
        key: 'warranty',
        imageUrl: 'shield-check',
        alt: 'Do you provide warranty?',
        altAr: 'هل تقدمون ضمان على الأعمال؟',
        text: 'Yes, we provide a comprehensive warranty on all our works for a full year.',
        textAr: 'نعم، نقدم ضمان شامل على جميع أعمالنا لمدة سنة كاملة.',
        order: 1
    },
    {
        page: 'contact',
        section: 'faq',
        key: 'consultation',
        imageUrl: 'message-circle',
        alt: 'Is consultation free?',
        altAr: 'هل الاستشارة مجانية؟',
        text: 'Yes, we provide free consultation and site visit to evaluate the project.',
        textAr: 'نعم، نقدم استشارة مجانية وزيارة الموقع لتقييم المشروع.',
        order: 2
    },
    {
        page: 'contact',
        section: 'faq',
        key: 'location',
        imageUrl: 'map-pin',
        alt: 'Do you work outside Riyadh?',
        altAr: 'هل تعملون خارج الرياض؟',
        text: 'Yes, we serve all regions of Saudi Arabia.',
        textAr: 'نعم، نخدم جميع مناطق المملكة العربية السعودية.',
        order: 3
    }
];

async function seedData() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
        const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
        const Banner = mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
        const HomeSlide = mongoose.models.HomeSlide || mongoose.model('HomeSlide', HomeSlideSchema);
        const PageAsset = mongoose.models.PageAsset || mongoose.model('PageAsset', PageAssetSchema);

        // Check if data already exists
        const projectCount = await Project.countDocuments();
        const serviceCount = await Service.countDocuments();
        const bannerCount = await Banner.countDocuments();
        const homeSlideCount = await HomeSlide.countDocuments();
        const pageAssetCount = await PageAsset.countDocuments();

        console.log(`Current counts - Projects: ${projectCount}, Services: ${serviceCount}, Banners: ${bannerCount}, Home Slides: ${homeSlideCount}, Page Assets: ${pageAssetCount}`);

        // Seed Projects
        if (projectCount === 0) {
            await Project.insertMany(sampleProjects);
            console.log(`✓ Seeded ${sampleProjects.length} projects`);
        } else {
            console.log('→ Projects already exist, skipping...');
        }

        // Seed Services
        if (serviceCount === 0) {
            await Service.insertMany(sampleServices);
            console.log(`✓ Seeded ${sampleServices.length} services`);
        } else {
            console.log('→ Services already exist, skipping...');
        }

        // Seed Banners (upsert to avoid duplicates)
        for (const banner of sampleBanners) {
            await Banner.findOneAndUpdate(
                { page: banner.page },
                banner,
                { upsert: true, new: true }
            );
        }
        console.log(`✓ Seeded/Updated ${sampleBanners.length} banners`);

        // Seed Home Slides
        if (homeSlideCount === 0) {
            await HomeSlide.insertMany(sampleHomeSlides);
            console.log(`✓ Seeded ${sampleHomeSlides.length} home slides`);
        } else {
            console.log('→ Home slides already exist, skipping...');
        }

        // Seed Page Assets
        for (const asset of samplePageAssets) {
            await PageAsset.findOneAndUpdate(
                { page: asset.page, section: asset.section, key: asset.key },
                asset,
                { upsert: true, new: true }
            );
        }
        console.log(`✓ Seeded/Updated ${samplePageAssets.length} page assets`);

        console.log('\n✅ Data seeding completed successfully!');
        console.log('\nYou can now view:');
        console.log('- Projects in the Portfolio section');
        console.log('- Services in the Services section');
        console.log('- Banners as background images');
        console.log('- Home Slides in the homepage slider');
        console.log('- Dynamic Page Assets in About Us section');

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}
const sampleProjects = [
    {
        title: 'Luxury Villa Garden',
        titleAr: 'حديقة فيلا فاخرة',
        description: 'A luxurious villa garden design with fountains and stone pathways spanning 500 square meters',
        descriptionAr: 'تصميم حديقة فيلا بمساحة 500 متر مربع مع نوافير وممرات حجرية',
        image: 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        tags: ['Garden Design', 'Luxury', 'Fountains'],
        tagsAr: ['تصميم حدائق', 'فاخر', 'نوافير'],
        category: 'garden-design',
        categoryAr: 'تصميم حدائق',
        year: '2024',
        featured: true,
    },
    {
        title: 'Natural Grass Installation',
        titleAr: 'تركيب ثيل طبيعي',
        description: 'High-quality natural grass installation for a home garden',
        descriptionAr: 'تركيب ثيل طبيعي عالي الجودة لحديقة منزلية',
        image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        tags: ['Natural Grass', 'Installation'],
        tagsAr: ['ثيل طبيعي', 'تركيب'],
        category: 'natural-grass',
        categoryAr: 'ثيل طبيعي',
        year: '2024',
        featured: true,
    },
    {
        title: 'Stadium Artificial Grass',
        titleAr: 'عشب صناعي للملاعب',
        description: 'High-quality artificial grass installation for a football field',
        descriptionAr: 'تركيب عشب صناعي عالي الجودة لملعب كرة قدم',
        image: 'https://images.pexels.com/photos/209315/pexels-photo-209315.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        tags: ['Artificial Grass', 'Stadium'],
        tagsAr: ['عشب صناعي', 'ملاعب'],
        category: 'artificial-grass',
        categoryAr: 'عشب صناعي',
        year: '2024',
        featured: false,
    },
    {
        title: 'Smart Irrigation System',
        titleAr: 'نظام ري ذكي',
        description: 'Installation of an automatic water-saving irrigation system',
        descriptionAr: 'تركيب نظام ري أوتوماتيكي موفر للمياه',
        image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        tags: ['Irrigation', 'Smart System'],
        tagsAr: ['شبكات ري', 'نظام ذكي'],
        category: 'irrigation',
        categoryAr: 'شبكات ري',
        year: '2024',
        featured: false,
    },
    {
        title: 'Garden Fountain',
        titleAr: 'نافورة حديقة',
        description: 'Design and installation of an elegant water fountain',
        descriptionAr: 'تصميم وتركيب نافورة مياه أنيقة',
        image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        tags: ['Fountains', 'Water Features'],
        tagsAr: ['نوافير', 'ميزات مائية'],
        category: 'fountains',
        categoryAr: 'شلالات ونوافير',
        year: '2024',
        featured: true,
    },
    {
        title: 'Wooden Shade',
        titleAr: 'مظلة خشبية',
        description: 'Installation of a modern wooden shade for seating area',
        descriptionAr: 'تركيب مظلة خشبية عصرية لمنطقة الجلوس',
        image: 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        tags: ['Shades', 'Wooden'],
        tagsAr: ['مظلات', 'خشبية'],
        category: 'shades',
        categoryAr: 'مظلات وسواتر',
        year: '2024',
        featured: false,
    },
];

const sampleServices = [
    {
        title: 'Garden Design and Landscaping',
        titleAr: 'تصميم وتنسيق الحدائق',
        description: 'Creative designs that blend natural beauty with comfort',
        descriptionAr: 'إبداع تصاميم مميزة تدمج بين الجمال الطبيعي والراحة',
        icon: 'tree-pine',
        image: 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        features: ['Custom designs', '3D visualization', 'Expert consultation'],
        featuresAr: ['تصاميم مخصصة', 'تصور ثلاثي الأبعاد', 'استشارة متخصصة'],
        featured: true,
    },
    {
        title: 'Natural Grass Supply and Installation',
        titleAr: 'توريد وتركيب الثيل الطبيعي',
        description: 'Natural grass that gives the place a touch of freshness and vitality',
        descriptionAr: 'عشب طبيعي يمنح المكان لمسة انتعاش وحيوية',
        icon: 'leaf',
        image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        features: ['Premium quality grass', 'Professional installation', 'Maintenance guidance'],
        featuresAr: ['عشب عالي الجودة', 'تركيب احترافي', 'إرشادات الصيانة'],
        featured: true,
    },
    {
        title: 'Artificial Grass Supply and Installation',
        titleAr: 'توريد وتركيب العشب الصناعي',
        description: 'Natural look with easy maintenance and long life',
        descriptionAr: 'مظهر طبيعي مع سهولة الصيانة وطول العمر',
        icon: 'scissors',
        image: 'https://images.pexels.com/photos/209315/pexels-photo-209315.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        features: ['Low maintenance', 'Durable', 'Eco-friendly'],
        featuresAr: ['صيانة منخفضة', 'متين', 'صديق للبيئة'],
        featured: true,
    },
    {
        title: 'Irrigation Network Design and Installation',
        titleAr: 'تصميم وتركيب شبكات الري',
        description: 'Smart and water-saving systems to preserve plants',
        descriptionAr: 'أنظمة ذكية وموفرة للمياه للحفاظ على النباتات',
        icon: 'droplets',
        image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        features: ['Smart irrigation', 'Water saving', 'Timer controlled'],
        featuresAr: ['ري ذكي', 'توفير المياه', 'تحكم بالوقت'],
        featured: false,
    },
    {
        title: 'Waterfalls and Fountains Design',
        titleAr: 'تصميم وتركيب الشلالات والنوافير',
        description: 'A luxurious touch that adds to the attractiveness of the space',
        descriptionAr: 'لمسة فاخرة تزيد من جاذبية المساحة',
        icon: 'waves',
        image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        features: ['Custom designs', 'LED lighting', 'Low maintenance'],
        featuresAr: ['تصاميم مخصصة', 'إضاءة LED', 'صيانة منخفضة'],
        featured: true,
    },
    {
        title: 'Shades, Screens and Glass Rooms',
        titleAr: 'مظلات وسواتر وغرف زجاجية',
        description: 'Protection and privacy with elegant design',
        descriptionAr: 'حماية وخصوصية مع تصميم أنيق',
        icon: 'umbrella',
        image: 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        features: ['UV protection', 'Custom sizes', 'Durable materials'],
        featuresAr: ['حماية من الأشعة', 'مقاسات مخصصة', 'مواد متينة'],
        featured: false,
    },
    {
        title: 'Agricultural Decorations Design',
        titleAr: 'تصميم وتركيب الديكورات الزراعية',
        description: 'Innovative ideas to increase the beauty of the garden',
        descriptionAr: 'أفكار مبتكرة لزيادة جمال الحديقة',
        icon: 'flower',
        image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        features: ['Unique designs', 'Natural plants', 'Seasonal arrangements'],
        featuresAr: ['تصاميم فريدة', 'نباتات طبيعية', 'ترتيبات موسمية'],
        featured: false,
    },
];

const sampleBanners = [
    {
        page: 'home',
        image: 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    },
    {
        page: 'about',
        image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    },
    {
        page: 'contact',
        image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
    },
];

const sampleHomeSlides = [
    {
        title: 'Luxury Garden Design',
        titleAr: 'تصميم حدائق فاخرة',
        subtitle: 'Palace gardens with wooden pergolas and waterfalls',
        subtitleAr: 'حدائق قصور مع برجولات خشبية وشلالات',
        image: 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
        order: 0,
        isActive: true,
    },
    {
        title: 'Luxury Outdoor Seating',
        titleAr: 'جلسات خارجية فاخرة',
        subtitle: 'Elegant relaxation spaces with modern furniture',
        subtitleAr: 'مساحات استرخاء أنيقة مع أثاث عصري',
        image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
        order: 1,
        isActive: true,
    },
    {
        title: 'Stunning Waterfalls and Fountains',
        titleAr: 'شلالات ونوافير مبهرة',
        subtitle: 'Water features that add luxury and tranquility',
        subtitleAr: 'عناصر مائية تضيف الفخامة والهدوء',
        image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
        order: 2,
        isActive: true,
    },
    {
        title: 'Professional Artificial Grass',
        titleAr: 'عشب صناعي احترافي',
        subtitle: 'Gardens with international standards',
        subtitleAr: 'حدائق بمعايير عالمية',
        image: 'https://images.pexels.com/photos/209315/pexels-photo-209315.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
        order: 3,
        isActive: true,
    },
    {
        title: 'Modern Smart Technologies',
        titleAr: 'تقنيات ذكية حديثة',
        subtitle: 'Smart irrigation systems and modern glass rooms',
        subtitleAr: 'أنظمة ري ذكية وغرف زجاجية عصرية',
        image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
        order: 4,
        isActive: true,
    },
];


seedData();
