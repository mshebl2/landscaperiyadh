const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://eslamabdaltif:oneone2@cluster0.k0laen8.mongodb.net/?appName=Cluster0';

// Project Schema (Arabic-only)
const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    galleryImages: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    category: { type: String, required: true },
    year: { type: String, required: true },
    link: { type: String },
    featured: { type: Boolean, default: false },
}, { timestamps: true });

// Service Schema (Arabic-only)
const ServiceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    image: { type: String },
    features: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
}, { timestamps: true });

// Banner Schema
const BannerSchema = new mongoose.Schema({
    page: { type: String, enum: ['home', 'contact', 'about'], required: true, unique: true },
    image: { type: String, required: true },
}, { timestamps: true });

// HomeSlide Schema (Arabic-only)
const HomeSlideSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

// PageAsset Schema (keep bilingual for SEO)
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

// ============================================
// SAMPLE DATA - ARABIC ONLY
// ============================================

const sampleProjects = [
    {
        title: 'حديقة فيلا فاخرة',
        description: 'تصميم حديقة فيلا بمساحة 500 متر مربع مع نوافير وممرات حجرية',
        image: 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        tags: ['تصميم حدائق', 'فاخر', 'نوافير'],
        category: 'تصميم حدائق',
        year: '2024',
        featured: true,
    },
    {
        title: 'تركيب ثيل طبيعي',
        description: 'تركيب ثيل طبيعي عالي الجودة لحديقة منزلية',
        image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        tags: ['ثيل طبيعي', 'تركيب'],
        category: 'ثيل طبيعي',
        year: '2024',
        featured: true,
    },
    {
        title: 'عشب صناعي للملاعب',
        description: 'تركيب عشب صناعي عالي الجودة لملعب كرة قدم',
        image: 'https://images.pexels.com/photos/209315/pexels-photo-209315.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        tags: ['عشب صناعي', 'ملاعب'],
        category: 'عشب صناعي',
        year: '2024',
        featured: false,
    },
    {
        title: 'نظام ري ذكي',
        description: 'تركيب نظام ري أوتوماتيكي موفر للمياه',
        image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        tags: ['شبكات ري', 'نظام ذكي'],
        category: 'شبكات ري',
        year: '2024',
        featured: false,
    },
    {
        title: 'نافورة حديقة',
        description: 'تصميم وتركيب نافورة مياه أنيقة',
        image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        tags: ['نوافير', 'ميزات مائية'],
        category: 'شلالات ونوافير',
        year: '2024',
        featured: true,
    },
    {
        title: 'مظلة خشبية',
        description: 'تركيب مظلة خشبية عصرية لمنطقة الجلوس',
        image: 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        tags: ['مظلات', 'خشبية'],
        category: 'مظلات وسواتر',
        year: '2024',
        featured: false,
    },
];

const sampleServices = [
    {
        title: 'تصميم وتنسيق الحدائق',
        description: 'إبداع تصاميم مميزة تدمج بين الجمال الطبيعي والراحة',
        icon: 'tree-pine',
        image: 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        features: ['تصاميم مخصصة', 'تصور ثلاثي الأبعاد', 'استشارة متخصصة'],
        featured: true,
    },
    {
        title: 'توريد وتركيب الثيل الطبيعي',
        description: 'عشب طبيعي يمنح المكان لمسة انتعاش وحيوية',
        icon: 'leaf',
        image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        features: ['عشب عالي الجودة', 'تركيب احترافي', 'إرشادات الصيانة'],
        featured: true,
    },
    {
        title: 'توريد وتركيب العشب الصناعي',
        description: 'مظهر طبيعي مع سهولة الصيانة وطول العمر',
        icon: 'scissors',
        image: 'https://images.pexels.com/photos/209315/pexels-photo-209315.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        features: ['صيانة منخفضة', 'متين', 'صديق للبيئة'],
        featured: true,
    },
    {
        title: 'تصميم وتركيب شبكات الري',
        description: 'أنظمة ذكية وموفرة للمياه للحفاظ على النباتات',
        icon: 'droplets',
        image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        features: ['ري ذكي', 'توفير المياه', 'تحكم بالوقت'],
        featured: false,
    },
    {
        title: 'تصميم وتركيب الشلالات والنوافير',
        description: 'لمسة فاخرة تزيد من جاذبية المساحة',
        icon: 'waves',
        image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        features: ['تصاميم مخصصة', 'إضاءة LED', 'صيانة منخفضة'],
        featured: true,
    },
    {
        title: 'مظلات وسواتر وغرف زجاجية',
        description: 'حماية وخصوصية مع تصميم أنيق',
        icon: 'umbrella',
        image: 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        features: ['حماية من الأشعة', 'مقاسات مخصصة', 'مواد متينة'],
        featured: false,
    },
    {
        title: 'تصميم وتركيب الديكورات الزراعية',
        description: 'أفكار مبتكرة لزيادة جمال الحديقة',
        icon: 'flower',
        image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        features: ['تصاميم فريدة', 'نباتات طبيعية', 'ترتيبات موسمية'],
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
        title: 'تصميم حدائق فاخرة',
        subtitle: 'حدائق قصور مع برجولات خشبية وشلالات',
        image: 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
        order: 0,
        isActive: true,
    },
    {
        title: 'جلسات خارجية فاخرة',
        subtitle: 'مساحات استرخاء أنيقة مع أثاث عصري',
        image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
        order: 1,
        isActive: true,
    },
    {
        title: 'شلالات ونوافير مبهرة',
        subtitle: 'عناصر مائية تضيف الفخامة والهدوء',
        image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
        order: 2,
        isActive: true,
    },
    {
        title: 'عشب صناعي احترافي',
        subtitle: 'حدائق بمعايير عالمية',
        image: 'https://images.pexels.com/photos/209315/pexels-photo-209315.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
        order: 3,
        isActive: true,
    },
    {
        title: 'تقنيات ذكية حديثة',
        subtitle: 'أنظمة ري ذكية وغرف زجاجية عصرية',
        image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
        order: 4,
        isActive: true,
    },
];

const samplePageAssets = [
    // About Page - Intro
    {
        page: 'about',
        section: 'intro',
        key: 'main-image',
        imageUrl: 'https://www.landscapingkw.com/wp-content/uploads/2022/03/%D8%AA%D8%B5%D9%85%D9%8A%D9%85-%D8%AD%D8%AF%D8%A7%D8%A6%D9%82-%D9%81%D9%84%D9%84-%D8%A8%D8%A7%D9%84%D9%83%D9%88%D9%8A%D8%AA-%D8%AA%D9%86%D8%B3%D9%8A%D9%82-%D8%AD%D8%AF%D8%A7%D8%A6%D9%82-%D9%81%D9%84%D9%84-%D8%A8%D8%A7%D9%84%D9%83%D9%88%D9%8A%D8%AA.jpg',
        alt: 'فريق المحترف للتنسيق',
        altAr: 'فريق عمل محترف لتنسيق الحدائق'
    },
    // About Page - Team
    {
        page: 'about',
        section: 'team',
        key: 'member-1',
        imageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        alt: 'مدير التصميم',
        altAr: 'مدير التصميم',
        text: 'أحمد محمد',
        textAr: 'أحمد محمد'
    },
    {
        page: 'about',
        section: 'team',
        key: 'member-2',
        imageUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        alt: 'مهندسة زراعية',
        altAr: 'مهندسة زراعية',
        text: 'سارة أحمد',
        textAr: 'سارة أحمد'
    },
    {
        page: 'about',
        section: 'team',
        key: 'member-3',
        imageUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        alt: 'مشرف التنفيذ',
        altAr: 'مشرف التنفيذ',
        text: 'محمد علي',
        textAr: 'محمد علي'
    },
    // Home Page - Why Choose Us
    {
        page: 'home',
        section: 'why-choose-us',
        key: 'experience',
        imageUrl: 'leaf',
        alt: 'خبرة 15+ سنة',
        altAr: 'خبرة 15+ سنة',
        text: 'رواد في مجال تنسيق الحدائق بالرياض',
        textAr: 'رواد في مجال تنسيق الحدائق بالرياض',
        order: 0
    },
    {
        page: 'home',
        section: 'why-choose-us',
        key: 'team',
        imageUrl: 'users',
        alt: 'فريق متخصص',
        altAr: 'فريق متخصص',
        text: 'مهندسون وخبراء في التصميم والتنفيذ',
        textAr: 'مهندسون وخبراء في التصميم والتنفيذ',
        order: 1
    },
    {
        page: 'home',
        section: 'why-choose-us',
        key: 'quality',
        imageUrl: 'star',
        alt: 'جودة استثنائية',
        altAr: 'جودة استثنائية',
        text: 'أفضل المواد والتقنيات العالمية',
        textAr: 'أفضل المواد والتقنيات العالمية',
        order: 2
    },
    {
        page: 'home',
        section: 'why-choose-us',
        key: 'guarantee',
        imageUrl: 'shield-check',
        alt: 'ضمان شامل',
        altAr: 'ضمان شامل',
        text: 'ضمان على جميع الأعمال والخدمات',
        textAr: 'ضمان على جميع الأعمال والخدمات',
        order: 3
    },
    // Contact Page - FAQ
    {
        page: 'contact',
        section: 'faq',
        key: 'duration',
        imageUrl: 'clock',
        alt: 'كم تستغرق مدة تنفيذ المشروع؟',
        altAr: 'كم تستغرق مدة تنفيذ المشروع؟',
        text: 'تختلف مدة التنفيذ حسب حجم المشروع، من أسبوع للمشاريع الصغيرة إلى عدة أشهر للمشاريع الكبيرة.',
        textAr: 'تختلف مدة التنفيذ حسب حجم المشروع، من أسبوع للمشاريع الصغيرة إلى عدة أشهر للمشاريع الكبيرة.',
        order: 0
    },
    {
        page: 'contact',
        section: 'faq',
        key: 'warranty',
        imageUrl: 'shield-check',
        alt: 'هل تقدمون ضمان على الأعمال؟',
        altAr: 'هل تقدمون ضمان على الأعمال؟',
        text: 'نعم، نقدم ضمان شامل على جميع أعمالنا لمدة سنة كاملة.',
        textAr: 'نعم، نقدم ضمان شامل على جميع أعمالنا لمدة سنة كاملة.',
        order: 1
    },
    {
        page: 'contact',
        section: 'faq',
        key: 'consultation',
        imageUrl: 'message-circle',
        alt: 'هل الاستشارة مجانية؟',
        altAr: 'هل الاستشارة مجانية؟',
        text: 'نعم، نقدم استشارة مجانية وزيارة الموقع لتقييم المشروع.',
        textAr: 'نعم، نقدم استشارة مجانية وزيارة الموقع لتقييم المشروع.',
        order: 2
    },
    {
        page: 'contact',
        section: 'faq',
        key: 'location',
        imageUrl: 'map-pin',
        alt: 'هل تعملون خارج الرياض؟',
        altAr: 'هل تعملون خارج الرياض؟',
        text: 'نعم، نخدم جميع مناطق المملكة العربية السعودية.',
        textAr: 'نعم، نخدم جميع مناطق المملكة العربية السعودية.',
        order: 3
    }
];

async function seedData() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB');

        const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
        const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
        const Banner = mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
        const HomeSlide = mongoose.models.HomeSlide || mongoose.model('HomeSlide', HomeSlideSchema);
        const PageAsset = mongoose.models.PageAsset || mongoose.model('PageAsset', PageAssetSchema);

        // Drop existing collections to start fresh
        console.log('\n🗑️  Clearing existing data...');

        try {
            await Project.deleteMany({});
            console.log('  ✓ Cleared projects');
        } catch (e) {
            console.log('  → Projects collection not found, skipping...');
        }

        try {
            await Service.deleteMany({});
            console.log('  ✓ Cleared services');
        } catch (e) {
            console.log('  → Services collection not found, skipping...');
        }

        try {
            await HomeSlide.deleteMany({});
            console.log('  ✓ Cleared home slides');
        } catch (e) {
            console.log('  → Home slides collection not found, skipping...');
        }

        // Seed Projects
        console.log('\n📦 Seeding Arabic-only data...');
        await Project.insertMany(sampleProjects);
        console.log(`  ✓ Seeded ${sampleProjects.length} projects (Arabic-only)`);

        // Seed Services
        await Service.insertMany(sampleServices);
        console.log(`  ✓ Seeded ${sampleServices.length} services (Arabic-only)`);

        // Seed Banners (upsert to avoid duplicates)
        for (const banner of sampleBanners) {
            await Banner.findOneAndUpdate(
                { page: banner.page },
                banner,
                { upsert: true, new: true }
            );
        }
        console.log(`  ✓ Seeded/Updated ${sampleBanners.length} banners`);

        // Seed Home Slides
        await HomeSlide.insertMany(sampleHomeSlides);
        console.log(`  ✓ Seeded ${sampleHomeSlides.length} home slides (Arabic-only)`);

        // Seed Page Assets
        for (const asset of samplePageAssets) {
            await PageAsset.findOneAndUpdate(
                { page: asset.page, section: asset.section, key: asset.key },
                asset,
                { upsert: true, new: true }
            );
        }
        console.log(`  ✓ Seeded/Updated ${samplePageAssets.length} page assets`);

        console.log('\n✅ Arabic-only data seeding completed successfully!');
        console.log('\n📋 Summary:');
        console.log('   • Projects: Arabic titles, descriptions, tags, categories');
        console.log('   • Services: Arabic titles, descriptions, features');
        console.log('   • Home Slides: Arabic titles and subtitles');
        console.log('   • Page Assets: Arabic content for all values');

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seedData();
