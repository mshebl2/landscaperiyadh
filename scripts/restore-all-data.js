const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mshebl215_db_user:kKdeBcOl34Htwqae@cluster0.epudtja.mongodb.net/?appName=Cluster0';

// 1. Schemas
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

const ServiceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true, default: 'leaf' },
    image: { type: String },
    features: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
}, { timestamps: true });

const BannerSchema = new mongoose.Schema({
    page: { type: String, enum: ['home', 'contact', 'about'], required: true, unique: true },
    image: { type: String, required: true },
}, { timestamps: true });

const HomeSlideSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

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

const TestimonialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true },
    textAr: { type: String },
    approved: { type: Boolean, default: true },
}, { timestamps: true });

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    image: { type: String, required: true },
    author: { type: String, required: true },
    featured: { type: Boolean, default: false },
    slug: { type: String, required: true, unique: true },
    autoSEO: { type: Boolean, default: true },
    autoInternalLinks: { type: Boolean, default: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: [String] },
    manualSEO: {
        title: String,
        description: String,
        keywords: [String],
        ogImage: String,
        canonicalUrl: String,
        noIndex: Boolean,
        noFollow: Boolean,
    },
    manualLinks: { type: Array, default: [] },
    processedContent: { type: String },
    internalLinksApplied: { type: [String], default: [] },
}, { timestamps: true });

const SEOConfigSchema = new mongoose.Schema({
    configKey: { type: String, required: true, unique: true, default: 'global' },
    globalAutoSEO: { type: Boolean, default: true },
    globalAutoInternalLinks: { type: Boolean, default: true },
    maxInternalLinksPerPost: { type: Number, default: 5 },
    defaultMetaKeywordsCount: { type: Number, default: 10 },
    siteName: { type: String, default: 'المحترف لتنسيق الحدائق بالرياض' },
    defaultOGImage: { type: String, default: '' },
    twitterHandle: { type: String, default: '' },
}, { timestamps: true });

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

// 2. Data Definitions
const sampleProjects = [
    {
        title: 'حديقة فيلا فاخرة بحي حطين',
        description: 'تصميم وتنفيذ حديقة فيلا بمساحة 500 متر مربع مع نوافير مائية وممرات حجرية وجلسة خارجية مظللة.',
        image: 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        tags: ['تصميم حدائق', 'فاخر', 'نوافير', 'جلسات خارجية'],
        category: 'تصميم حدائق',
        year: '2024',
        featured: true,
    },
    {
        title: 'تركيب ثيل طبيعي سي 2000 في حي الياسمين',
        description: 'توريد وتركيب ثيل طبيعي ياباني ممتاز مقاوم للحرارة مع شبكة ري أوتوماتيكية متكاملة.',
        image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        tags: ['ثيل طبيعي', 'تركيب', 'شبكات ري'],
        category: 'ثيل طبيعي',
        year: '2024',
        featured: true,
    },
    {
        title: 'عشب صناعي ديكوري لملاعب واستراحات بالرياض',
        description: 'تركيب عشب صناعي عالي الكثافة (40 ملم) مقاوم للأشعة فوق البنفسجية للاستراحات والمسطحات الخارجية.',
        image: 'https://images.pexels.com/photos/209315/pexels-photo-209315.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        tags: ['عشب صناعي', 'استراحات', 'ملاعب'],
        category: 'عشب صناعي',
        year: '2024',
        featured: true,
    },
    {
        title: 'نظام ري ذكي أوتوماتيكي بالتنقيط والرذاذ',
        description: 'تركيب شبكة ري حديثة مع تايمر رقمي وحساسات رطوبة لتوفير استهلاك المياه بنسبة 40%.',
        image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        tags: ['شبكات ري', 'ري ذكي', 'توفير مياه'],
        category: 'شبكات ري',
        year: '2024',
        featured: false,
    },
    {
        title: 'شلال جداري ومصبات مياه مودرن بحي النرجس',
        description: 'تصميم وتنفيذ شلال جداري رخامي مع إضاءات LED مخفية وأحواض زراعية أنيقة.',
        image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        tags: ['شلالات', 'نوافير', 'إضاءات'],
        category: 'شلالات ونوافير',
        year: '2024',
        featured: true,
    },
    {
        title: 'برجولة خشبية ومظلة حدائق عصرية بحي الملقا',
        description: 'تصميم مظلة خشب معالج ضد الشمس والمطر وتجهيز جلسة خارجية فاخرة.',
        image: 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        tags: ['برجولات', 'مظلات', 'خشب معالج'],
        category: 'مظلات وسواتر',
        year: '2024',
        featured: false,
    },
];

const sampleServices = [
    {
        title: 'تصميم وتنسيق الحدائق المنزلية',
        description: 'تصميم ثلاثي الأبعاد وتنسيق حدائق القصور والفلل والاستراحات بأعلى معايير الدقة والجمال.',
        icon: 'tree-pine',
        image: 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        features: ['تصاميم ثلاثية الأبعاد 3D قبل التنفيذ', 'استغلال المساحات بأعلى كفاءة', 'إشراف هندسي متكامل'],
        featured: true,
    },
    {
        title: 'توريد وتركيب الثيل الطبيعي',
        description: 'ثيل طبيعي أمريكي وياباني عالي النضارة وخالٍ من الحشائش مع ضمان كامل على التركيب.',
        icon: 'leaf',
        image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        features: ['توريد من مزارعنا مباشرة', 'تربة زراعية مخصبة معقمة', 'إرشادات ري وعناية مجانية'],
        featured: true,
    },
    {
        title: 'توريد وتركيب العشب الصناعي',
        description: 'أجود أنواع العشب الصناعي المخصص للحدائق والملاعب بارتفاعات وكثافات متنوعة تدوم طويلاً.',
        icon: 'scissors',
        image: 'https://images.pexels.com/photos/209315/pexels-photo-209315.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        features: ['ضمان حتى 7 سنوات ضد تغيير اللون', 'تصريف مياه ممتاز وسهل التنظيف', 'صديق للأطفال والحيوانات الأليفة'],
        featured: true,
    },
    {
        title: 'تصميم وتركيب شبكات الري الحديثة',
        description: 'أنظمة ري أوتوماتيكية ذكية (تنقيط ورذاذ) توفر المياه وتضمن رعاية دورية لجميع النباتات.',
        icon: 'droplets',
        image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        features: ['مؤقتات ري رقمية ذكية', 'صمامات كهربائية ومحابس موثوقة', 'توفير استهلاك المياه'],
        featured: false,
    },
    {
        title: 'تصميم وتركيب الشلالات والنوافير',
        description: 'شلالات جدارية مودرن ونوافير راقية بأحدث التصاميم الحجرية والرخامية وإضاءات خافتة.',
        icon: 'waves',
        image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        features: ['مضخات إيطالية قوية وهادئة', 'إضاءات LED مقاومة للماء', 'عزل مائي متين ومضمون'],
        featured: true,
    },
    {
        title: 'مظلات وسواتر وبرجولات خشبية وحديدية',
        description: 'برجولات وجلسات خارجية تجمع بين الفخامة والخصوصية والحماية التامة من الشمس.',
        icon: 'umbrella',
        image: 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        features: ['خشب معالج ضد الرطوبة والأرضة', 'دهانات حرارية مقاومة للصدأ', 'تصاميم مخصصة حسب المقاس'],
        featured: false,
    },
    {
        title: 'الديكورات الزراعية والممرات الحجرية',
        description: 'أحواض زراعية جاهزة ومبنية، ممرات حجرية مضيئة، وإنارة تجميلية خارجية للحدائق.',
        icon: 'flower',
        image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        features: ['حجر طبيعي ورخام مستورد', 'إنارة ليد ليلية ساحرة', 'نباتات ظل وزهور موسمية'],
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
        title: 'تصميم حدائق فاخرة بالرياض',
        subtitle: 'حدائق قصور وفلل مع برجولات خشبية وشلالات مائية راقية',
        image: 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
        order: 0,
        isActive: true,
    },
    {
        title: 'جلسات خارجية فاخرة',
        subtitle: 'مساحات استرخاء أنيقة مع أثاث خارجي عصري ومظلات متطورة',
        image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
        order: 1,
        isActive: true,
    },
    {
        title: 'شلالات ونوافير مائية مبهرة',
        subtitle: 'عناصر مائية طبيعية ومودرن تضيف لمسة من الفخامة والهدوء',
        image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
        order: 2,
        isActive: true,
    },
    {
        title: 'عشب صناعي وطبيعي احترافي',
        subtitle: 'ثيل طبيعي عالي النقاء وعشب صناعي بكثافة عالية ومظهر جذاب',
        image: 'https://images.pexels.com/photos/209315/pexels-photo-209315.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
        order: 3,
        isActive: true,
    },
    {
        title: 'تقنيات ري ذكية حديثة',
        subtitle: 'أنظمة ري أوتوماتيكية توفر المياه وتعتني بنباتاتك طوال العام',
        image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
        order: 4,
        isActive: true,
    },
];

const samplePageAssets = [
    {
        page: 'about',
        section: 'intro',
        key: 'main-image',
        imageUrl: 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        alt: 'فريق المحترف لتنسيق الحدائق',
        altAr: 'فريق عمل محترف لتنسيق الحدائق بالرياض'
    },
    {
        page: 'about',
        section: 'team',
        key: 'member-1',
        imageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
        alt: 'م. أحمد خالد',
        altAr: 'م. أحمد خالد',
        text: 'كبير مهندسي اللاندسكيب',
        textAr: 'كبير مهندسي اللاندسكيب والتصميم'
    },
    {
        page: 'about',
        section: 'team',
        key: 'member-2',
        imageUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
        alt: 'م. سارة الشهري',
        altAr: 'م. سارة الشهري',
        text: 'أخصائية نباتات وزراعة',
        textAr: 'أخصائية النباتات والبيئة الصحراوية'
    },
    {
        page: 'about',
        section: 'team',
        key: 'member-3',
        imageUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
        alt: 'فهد العتيبي',
        altAr: 'فهد العتيبي',
        text: 'مشرف التنفيذ والجودة',
        textAr: 'مشرف التنفيذ وضمان الجودة'
    },
    {
        page: 'home',
        section: 'why-choose-us',
        key: 'experience',
        imageUrl: 'leaf',
        alt: 'خبرة 15+ سنة',
        altAr: 'خبرة 15+ سنة',
        text: 'رواد في مجال تنسيق الحدائق بالرياض',
        textAr: 'رواد في مجال تنسيق وتصميم الحدائق بالرياض بخبرة طويلة',
        order: 0
    },
    {
        page: 'home',
        section: 'why-choose-us',
        key: 'team',
        imageUrl: 'users',
        alt: 'فريق متخصص',
        altAr: 'فريق متخصص',
        text: 'مهندسون وفنيون خبراء بالتصميم والتنفيذ',
        textAr: 'طاقم عمل هندسي وفني محترف ومدرب بأعلى كفاءة',
        order: 1
    },
    {
        page: 'home',
        section: 'why-choose-us',
        key: 'quality',
        imageUrl: 'star',
        alt: 'جودة استثنائية',
        altAr: 'جودة استثنائية',
        text: 'أفضل المواد والتقنيات مع الضمان المعتمد',
        textAr: 'استخدام خامات ممتازة مقاومة لعوامل الطقس في المملكة',
        order: 2
    },
    {
        page: 'home',
        section: 'why-choose-us',
        key: 'guarantee',
        imageUrl: 'shield-check',
        alt: 'ضمان شامل',
        altAr: 'ضمان شامل ومتابعة دورية',
        text: 'ضمان على النباتات والشبكات والشلالات',
        textAr: 'ضمان شامل وعقود صيانة دورية للمحافظة على بهاء حديقتك',
        order: 3
    },
    {
        page: 'contact',
        section: 'faq',
        key: 'duration',
        imageUrl: 'clock',
        alt: 'كم تستغرق مدة تنفيذ المشروع؟',
        altAr: 'كم تستغرق مدة تنفيذ المشروع؟',
        text: 'تختلف مدة التنفيذ حسب المساحة والتفاصيل، عادة من 3 إلى 7 أيام للحدائق المنزلية.',
        textAr: 'تختلف مدة التنفيذ حسب حجم وتفاصيل المشروع، من 3 إلى 7 أيام لمعظم الحدائق المنزلية.',
        order: 0
    },
    {
        page: 'contact',
        section: 'faq',
        key: 'warranty',
        imageUrl: 'shield-check',
        alt: 'هل تقدمون ضماناً على الأعمال؟',
        altAr: 'هل تقدمون ضماناً على الأعمال والتركيب؟',
        text: 'نعم، نقدم ضماناً شاملاً على العشب الصناعي وشبكات الري والمضخات والمظلات.',
        textAr: 'نعم، نقدم ضماناً شاملاً وموثقاً على الأعمال والمنتجات.',
        order: 1
    },
    {
        page: 'contact',
        section: 'faq',
        key: 'consultation',
        imageUrl: 'message-circle',
        alt: 'هل المعاينة والاستشارة مجانية؟',
        altAr: 'هل المعاينة والاستشارة مجانية بالرياض؟',
        text: 'نعم، نقدم خدمة المعاينة ورفع المقاسات وتقديم الاستشارة مجاناً داخل مدينة الرياض.',
        textAr: 'نعم، يسعدنا زيارة موقعكم ورفع المقاسات وتقديم الاستشارة مجاناً.',
        order: 2
    },
    {
        page: 'contact',
        section: 'faq',
        key: 'location',
        imageUrl: 'map-pin',
        alt: 'ما هي المناطق التي تخدمونها؟',
        altAr: 'ما هي المناطق التي تخدمونها؟',
        text: 'نغطي كافة أحياء مدينة الرياض وضواحيها والخرج والمناطق المجاورة.',
        textAr: 'نغطي كافة أحياء الرياض بالكامل بالإضافة للمناطق المجاورة.',
        order: 3
    }
];

const sampleTestimonials = [
    {
        name: 'عبدالله السبيعي',
        company: 'حي حطين - الرياض',
        location: 'الرياض',
        rating: 5,
        text: 'ما شاء الله تبارك الله، عمل متقن واحترافي لأبعد حد. قاموا بتنسيق حديقة الفيلا وتركيب شلال جداري وشبكة ري ذكية في وقت قياسي وبجودة فاخرة جداً.',
        textAr: 'ما شاء الله تبارك الله، عمل متقن واحترافي لأبعد حد. قاموا بتنسيق حديقة الفيلا وتركيب شلال جداري وشبكة ري ذكية في وقت قياسي وبجودة فاخرة جداً.',
        approved: true,
    },
    {
        name: 'سلطان القحطاني',
        company: 'حي النرجس - الرياض',
        location: 'الرياض',
        rating: 5,
        text: 'تعامل راقي والتزام ممتاز بالمواعيد. العشب الصناعي جودته ممتازة والبرجولة الخشبية أعطت الحديقة فخامة غير طبيعية. أنصح بشدة بالتعامل معهم.',
        textAr: 'تعامل راقي والتزام ممتاز بالمواعيد. العشب الصناعي جودته ممتازة والبرجولة الخشبية أعطت الحديقة فخامة غير طبيعية. أنصح بشدة بالتعامل معهم.',
        approved: true,
    },
    {
        name: 'د. خالد التميمي',
        company: 'حي الملقا - الرياض',
        location: 'الرياض',
        rating: 5,
        text: 'أفضل شركة لاندسكيب تعاملت معها في الرياض. اهتمام بأدق التفاصيل والأسعار مناسبة جداً مقارنة بمستوى التشطيب العالي.',
        textAr: 'أفضل شركة لاندسكيب تعاملت معها في الرياض. اهتمام بأدق التفاصيل والأسعار مناسبة جداً مقارنة بمستوى التشطيب العالي.',
        approved: true,
    },
    {
        name: 'مها الشمري',
        company: 'حي الياسمين - الرياض',
        location: 'الرياض',
        rating: 5,
        text: 'فريق عمل محترم ومهذب، صمموا لي حديقة السطح مع أحواض زراعة وإنارة ليلية ساحرة، أصبحت الجلسة المفضلة للعائلة.',
        textAr: 'فريق عمل محترم ومهذب، صمموا لي حديقة السطح مع أحواض زراعة وإنارة ليلية ساحرة، أصبحت الجلسة المفضلة للعائلة.',
        approved: true,
    }
];

const sampleBlogs = [
    {
        title: 'أهم 7 نصائح لتصميم حدائق منزلية حديثة تناسب طقس الرياض',
        slug: '7-tips-for-modern-garden-design-riyadh',
        excerpt: 'تعرف على أفضل الممارسات لاختيار النباتات المقاومة للحرارة وأنظمة الري الذكية في الرياض.',
        content: `
<h2>مقدمة في تصميم الحدائق بالرياض</h2>
<p>يعتبر تنسيق وتصميم الحدائق المنزلية في مدينة الرياض من أهم العناصر التي تمنح المنزل لمسة من الراحة والانتعاش، خاصة مع طبيعة المناخ الصحراوي. في هذا المقال، نقدم لك أهم النصائح والخطوات للحصول على حديقة أحلامك.</p>

<h3>1. اختيار النباتات المقاومة للجفاف والحرارة</h3>
<p>احرص على زراعة أشجار وشجيرات محلية مثل النخيل، البوانسيانا، الجهنمية، والواشنطونيا، التي تتحمل درجات الحرارة العالية ولا تستهلك كميات مفرطة من المياه.</p>

<h3>2. أنظمة الري الحديثة والأوتوماتيكية</h3>
<p>تركيب شبكات الري بالتنقيط والمؤقتات الذكية يضمن وصول المياه لجذور النباتات في أوقات الصباح الباكر أو المساء، مما يقلل من تبخر المياه بنسبة تصل إلى 50%.</p>

<h3>3. الجمع بين الثيل الطبيعي والعشب الصناعي</h3>
<p>يمكن استغلال العشب الصناعي في الممرات ومناطق الجلوس لتقليل الصيانة، مع تخصيص مساحات معتدلة للثيل الطبيعي والزهور لإضفاء الحيوية والانتعاش.</p>

<h3>4. الشلالات والنوافير المائية</h3>
<p>إضافة الشلالات الجدارية يخلق صوتاً مهدئاً ويساعد في تلطيف حرارة الجو المحيط بالجلسة الخارجية.</p>
        `,
        image: 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        author: 'فريق المحترف لتنسيق الحدائق',
        featured: true,
        metaTitle: 'نصائح تصميم حدائق منزلية في الرياض | المحترف',
        metaDescription: 'دليل شامل لاختيار النباتات وتصميم شبكات الري والشلالات لحديقتك في الرياض.',
        metaKeywords: ['تنسيق حدائق الرياض', 'تصميم حدائق', 'شلالات الرياض', 'عشب صناعي']
    },
    {
        title: 'مقارنة شاملة بين العشب الطبيعي والعشب الصناعي: أيهما تختار لحديقتك؟',
        slug: 'natural-grass-vs-artificial-grass-comparison',
        excerpt: 'مقارنة تفصيلية بين مميزات وعيوب وتكاليف الثيل الطبيعي والعشب الصناعي لحديقتك.',
        content: `
<h2>كيف تختار بين العشب الطبيعي والصناعي؟</h2>
<p>عند التفكير في إنشاء حديقة جديدة، يكون السؤال الأكثر شيوعاً: هل أعتمد على الثيل الطبيعي أم العشب الصناعي؟ إليك المقارنة الشاملة:</p>

<h3>العشب الطبيعي:</h3>
<p><strong>المميزات:</strong> مظهر طبيعي مئة بالمئة، يعطي رائحة منعشة، ويخفض درجة حرارة المكان بشكل طبيعي.</p>
<p><strong>العيوب:</strong> يحتاج لري مستمر وقص دوري وتسميد ومكافحة آفات.</p>

<h3>العشب الصناعي:</h3>
<p><strong>المميزات:</strong> لا يحتاج للماء أو القص، دائم الخضرة طوال العام، ومناسب جداً للمناطق المظللة أو أسطح المنازل والملاعب.</p>
<p><strong>العيوب:</strong> قد يحتفظ بالحرارة تحت أشعة الشمس المباشرة في وقت الظهيرة، ويتطلب اختيار كثافة وجودة عالية.</p>
        `,
        image: 'https://images.pexels.com/photos/209315/pexels-photo-209315.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        author: 'فريق المحترف لتنسيق الحدائق',
        featured: false,
        metaTitle: 'الفرق بين العشب الطبيعي والصناعي | المحترف للحدائق',
        metaDescription: 'تعرف على إيجابيات وسلبيات الثيل الطبيعي والعشب الصناعي لاختيار الأنسب لحديقتك.',
        metaKeywords: ['ثيل طبيعي الرياض', 'عشب صناعي', 'تنسيق حدائق']
    }
];

// 3. Execution Function
async function restoreAllData() {
    console.log('==================================================');
    console.log('🔄 جاري الاتصال بقاعدة البيانات الجديدة واسترجاع كافة البيانات...');
    console.log('==================================================');

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح!');

        const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
        const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
        const Banner = mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
        const HomeSlide = mongoose.models.HomeSlide || mongoose.model('HomeSlide', HomeSlideSchema);
        const PageAsset = mongoose.models.PageAsset || mongoose.model('PageAsset', PageAssetSchema);
        const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
        const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
        const SEOConfig = mongoose.models.SEOConfig || mongoose.model('SEOConfig', SEOConfigSchema);
        const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

        // 1. Restore Projects
        await Project.deleteMany({});
        await Project.insertMany(sampleProjects);
        console.log(`✓ تم استرجاع ${sampleProjects.length} مشروع في معرض الأعمال.`);

        // 2. Restore Services
        await Service.deleteMany({});
        await Service.insertMany(sampleServices);
        console.log(`✓ تم استرجاع ${sampleServices.length} خدمة رئيسية للموقع.`);

        // 3. Restore Banners
        await Banner.deleteMany({});
        await Banner.insertMany(sampleBanners);
        console.log(`✓ تم استرجاع ${sampleBanners.length} بانر للصفحات الرئيسية.`);

        // 4. Restore Home Slides
        await HomeSlide.deleteMany({});
        await HomeSlide.insertMany(sampleHomeSlides);
        console.log(`✓ تم استرجاع ${sampleHomeSlides.length} شريحة عرض رئيسية (Home Slides).`);

        // 5. Restore Page Assets
        await PageAsset.deleteMany({});
        await PageAsset.insertMany(samplePageAssets);
        console.log(`✓ تم استرجاع ${samplePageAssets.length} أصل وعنصر للصفحات والأسئلة الشائعة.`);

        // 6. Restore Testimonials
        await Testimonial.deleteMany({});
        await Testimonial.insertMany(sampleTestimonials);
        console.log(`✓ تم استرجاع ${sampleTestimonials.length} تقييم لعملاء موثقين.`);

        // 7. Restore Blogs
        await Blog.deleteMany({});
        await Blog.insertMany(sampleBlogs);
        console.log(`✓ تم استرجاع ${sampleBlogs.length} مقال احترافي في المدونة.`);

        // 8. Restore SEO Config
        await SEOConfig.findOneAndUpdate(
            { configKey: 'global' },
            {
                configKey: 'global',
                globalAutoSEO: true,
                globalAutoInternalLinks: true,
                siteName: 'المحترف لتنسيق الحدائق بالرياض',
            },
            { upsert: true }
        );
        console.log('✓ تم ضبط وتحديث إعدادات الـ SEO.');

        // 9. Restore Admin Account
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        await Admin.findOneAndUpdate(
            { username: 'admin' },
            { username: 'admin', password: hashedPassword },
            { upsert: true }
        );
        console.log('✓ تم إنشاء حساب لوحة التحكم (Admin): admin / admin123');

        console.log('==================================================');
        console.log('🎉 تم استرجاع كافة بيانات الموقع بنجاح 100%!');
        console.log('==================================================');

    } catch (error) {
        console.error('❌ حدث خطأ أثناء الاسترجاع:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

restoreAllData();
