const fs = require('fs');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mshebl215_db_user:kKdeBcOl34Htwqae@cluster0.epudtja.mongodb.net/?appName=Cluster0';

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

function cleanRscString(rawStr) {
    return rawStr
        .replace(/^1,"/, '')
        .replace(/"$/, '')
        .replace(/\\u003c/g, '<')
        .replace(/\\u003e/g, '>')
        .replace(/\\"/g, '"')
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '')
        .replace(/\\\\/g, '\\')
        .trim();
}

async function restoreAllArticles() {
    console.log('====================================================');
    console.log('📚 جاري استرجاع جميع مقالات المدونة الـ 8 الكاملة...');
    console.log('====================================================');

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ تم الاتصال بقاعدة البيانات!');

        const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

        // Load existing real extracted blogs from individual page snapshots
        const realBlogs = JSON.parse(fs.readFileSync('C:/Users/mohma/.gemini/antigravity-ide/scratch/real_full_blogs.json', 'utf8'));

        // Load blog list RSC for south riyadh article
        const listRsc = fs.readFileSync('C:/Users/mohma/.gemini/antigravity-ide/scratch/blog_list_rsc.txt', 'utf8');
        const listLines = listRsc.split('\n');

        // Extract South Riyadh content from line 46
        const southContent = cleanRscString(listLines[46]);

        const allArticles = [
            // 1. شركة تنسيق حدائق بالرياض
            {
                title: realBlogs[0].title.trim(),
                slug: 'شركة-تنسيق-حدائق-بالرياض',
                excerpt: realBlogs[0].excerpt,
                content: realBlogs[0].content,
                processedContent: realBlogs[0].processedContent || realBlogs[0].content,
                image: '/1.jpg',
                author: 'لاندسكيب ماسترز بالرياض',
                featured: true,
                metaTitle: `${realBlogs[0].title.trim()} | لاندسكيب ماسترز بالرياض`,
                metaDescription: realBlogs[0].excerpt,
                metaKeywords: ['تنسيق حدائق بالرياض', 'تصميم حدائق', 'لاندسكيب ماسترز'],
            },
            // 2. شركة تنسيق حدائق شمال الرياض
            {
                title: realBlogs[1].title.trim(),
                slug: 'شركة-تنسيق-حدائق-شمال-الرياض',
                excerpt: realBlogs[1].excerpt,
                content: realBlogs[1].content,
                processedContent: realBlogs[1].processedContent || realBlogs[1].content,
                image: '/2.jpg',
                author: 'لاندسكيب ماسترز بالرياض',
                featured: false,
                metaTitle: `${realBlogs[1].title.trim()} | لاندسكيب ماسترز بالرياض`,
                metaDescription: realBlogs[1].excerpt,
                metaKeywords: ['تنسيق حدائق شمال الرياض', 'حدائق شمال الرياض', 'لاندسكيب ماسترز'],
            },
            // 3. شركة تنسيق حدائق جنوب الرياض (المسترجعة من أرشيف القائمة)
            {
                title: 'شركة تنسيق حدائق جنوب الرياض',
                slug: 'شركة-تنسيق-حدائق-جنوب-الرياض',
                excerpt: 'شركة تنسيق حدائق جنوب الرياض – لاندسكيب ماسترز تقدم تصميم حدائق منزلية وشركات احترافية، تنسيق مساحات خضراء، تركيب نوافير واضاءة ذكية، واختيار نباتات مناسبة مع صيانة دورية لضمان جمال المساحات الخضراء جنوب الرياض.',
                content: southContent,
                processedContent: southContent,
                image: '/3.jpg',
                author: 'لاندسكيب ماسترز بالرياض',
                featured: false,
                metaTitle: 'شركة تنسيق حدائق جنوب الرياض – تصميم وديكور مساحات خضراء احترافية',
                metaDescription: 'افضل شركة تنسيق حدائق جنوب الرياض – لاندسكيب ماسترز تقدم تصميم حدائق احترافي، تنسيق مساحات خضراء، ديكور متكامل، نباتات مناسبة، نوافير واضاءة ذكية.',
                metaKeywords: ['تنسيق حدائق جنوب الرياض', 'حدائق جنوب الرياض', 'لاندسكيب ماسترز'],
            },
            // 4. شركة تنسيق حدائق شرق الرياض
            {
                title: realBlogs[2].title.trim(),
                slug: 'شركة-تنسيق-حدائق-شرق-الرياض',
                excerpt: realBlogs[2].excerpt,
                content: realBlogs[2].content,
                processedContent: realBlogs[2].processedContent || realBlogs[2].content,
                image: '/4.jpg',
                author: 'لاندسكيب ماسترز بالرياض',
                featured: false,
                metaTitle: `${realBlogs[2].title.trim()} | لاندسكيب ماسترز بالرياض`,
                metaDescription: realBlogs[2].excerpt,
                metaKeywords: ['تنسيق حدائق شرق الرياض', 'حدائق شرق الرياض', 'لاندسكيب ماسترز'],
            },
            // 5. شركة تنسيق حدائق غرب الرياض
            {
                title: realBlogs[3].title.trim(),
                slug: 'شركة-تنسيق-حدائق-غرب-الرياض',
                excerpt: realBlogs[3].excerpt,
                content: realBlogs[3].content,
                processedContent: realBlogs[3].processedContent || realBlogs[3].content,
                image: '/5.jpg',
                author: 'لاندسكيب ماسترز بالرياض',
                featured: false,
                metaTitle: `${realBlogs[3].title.trim()} | لاندسكيب ماسترز بالرياض`,
                metaDescription: realBlogs[3].excerpt,
                metaKeywords: ['تنسيق حدائق غرب الرياض', 'حدائق غرب الرياض', 'لاندسكيب ماسترز'],
            },
            // 6. نصائح عند تنسيق الحدائق بالرياض
            {
                title: realBlogs[4].title.trim(),
                slug: 'نصائح-عند-تنسيق-الحدائق-بالرياض',
                excerpt: realBlogs[4].excerpt,
                content: realBlogs[4].content,
                processedContent: realBlogs[4].processedContent || realBlogs[4].content,
                image: '/10.jpg',
                author: 'لاندسكيب ماسترز بالرياض',
                featured: false,
                metaTitle: `${realBlogs[4].title.trim()} | لاندسكيب ماسترز بالرياض`,
                metaDescription: realBlogs[4].excerpt,
                metaKeywords: ['نصائح تنسيق الحدائق', 'حدائق الرياض', 'لاندسكيب ماسترز'],
            },
            // 7. شركة جلسات خارجية بالرياض
            {
                title: 'شركة جلسات خارجية بالرياض – لاندسكيب ماسترز لتصميم وتنسيق الحدائق',
                slug: 'شركة-جلسات-خارجية-بالرياض-لاندسكيب-ماسترز-لتصميم-وتنسيق-الحدائق',
                excerpt: 'شركة جلسات خارجية بالرياض – لاندسكيب ماسترز تقدم أرقى تصاميم الجلسات الخارجية والبرجولات الخشبية والمظلات والغرف الزجاجية ومواقد النار الديكورية بالرياض.',
                content: `
<h2><strong>أفضل شركة جلسات خارجية بالرياض – لاندسكيب ماسترز</strong></h2>
<p>تعتبر <strong>الجلسات الخارجية</strong> ركيزة أساسية في أي حديقة منزلية راقية، حيث تمنحك وعائلتك مساحة استرخاء مثالية للاستمتاع بالأجواء الطبيعية في هدوء وخصوصية تامة. في <strong><a href="https://www.landscaperiyadh.com/" class="internal-link">لاندسكيب ماسترز بالرياض</a></strong>، نحرص على تقديم أحدث تصاميم الجلسات الخارجية التي تدمج بين الأصالة الشرقية والفخامة المودرن.</p>

<h3><strong>أنواع الجلسات الخارجية التي نقدمها بالرياض</strong></h3>
<ul>
  <li><strong>جلسات البرجولات الخشبية المعالجة:</strong> تصميم وتصنيع برجولات من خشب التيك والسويدي المعالج المقاوم للرطوبة والشمس الحارقة، مع إضاءات ليد مخفية.</li>
  <li><strong>الغرف الزجاجية البانورامية:</strong> غرف زجاجية عصرية من زجاج السيكوريت المزدوج العازل للحرارة مع تكييف للاستمتاع بجمال الحديقة طوال فصول السنة.</li>
  <li><strong>الجلسات الأرضية الغائرة (Fire Pit):</strong> جلسات دائرية أو مستطيلة محفورة في الحديقة مزودة بموقد نار ديكوري فاخر لجلسات الشتاء الدافئة.</li>
  <li><strong>المظلات والسواتر الحديثة:</strong> مظلات حديدية بتشطيب دهان حراري وأقمشة ألمانية وأسترالية عازلة للأشعة فوق البنفسجية بنسبة 100%.</li>
</ul>

<h3><strong>لماذا تختار لاندسكيب ماسترز لتنفيذ جلستك الخارجية؟</strong></h3>
<p>نمتلك خبرة تتجاوز 15 عاماً في سوق الرياض، ونقدم استشارة وتصاميم 3D واقعية قبل التنفيذ لنضمن تطابق النتيجة النهائية مع رؤيتك. للتواصل والحصول على استشارة مجانية: <strong><a href="tel:+966534309221">966534309221</a></strong>.</p>
                `.trim(),
                processedContent: `
<h2><strong>أفضل شركة جلسات خارجية بالرياض – لاندسكيب ماسترز</strong></h2>
<p>تعتبر <strong>الجلسات الخارجية</strong> ركيزة أساسية في أي حديقة منزلية راقية، حيث تمنحك وعائلتك مساحة استرخاء مثالية للاستمتاع بالأجواء الطبيعية في هدوء وخصوصية تامة. في <strong><a href="https://www.landscaperiyadh.com/" class="internal-link">لاندسكيب ماسترز بالرياض</a></strong>، نحرص على تقديم أحدث تصاميم الجلسات الخارجية التي تدمج بين الأصالة الشرقية والفخامة المودرن.</p>

<h3><strong>أنواع الجلسات الخارجية التي نقدمها بالرياض</strong></h3>
<ul>
  <li><strong>جلسات البرجولات الخشبية المعالجة:</strong> تصميم وتصنيع برجولات من خشب التيك والسويدي المعالج المقاوم للرطوبة والشمس الحارقة، مع إضاءات ليد مخفية.</li>
  <li><strong>الغرف الزجاجية البانورامية:</strong> غرف زجاجية عصرية من زجاج السيكوريت المزدوج العازل للحرارة مع تكييف للاستمتاع بجمال الحديقة طوال فصول السنة.</li>
  <li><strong>الجلسات الأرضية الغائرة (Fire Pit):</strong> جلسات دائرية أو مستطيلة محفورة في الحديقة مزودة بموقد نار ديكوري فاخر لجلسات الشتاء الدافئة.</li>
  <li><strong>المظلات والسواتر الحديثة:</strong> مظلات حديدية بتشطيب دهان حراري وأقمشة ألمانية وأسترالية عازلة للأشعة فوق البنفسجية بنسبة 100%.</li>
</ul>

<h3><strong>لماذا تختار لاندسكيب ماسترز لتنفيذ جلستك الخارجية؟</strong></h3>
<p>نمتلك خبرة تتجاوز 15 عاماً في سوق الرياض، ونقدم استشارة وتصاميم 3D واقعية قبل التنفيذ لنضمن تطابق النتيجة النهائية مع رؤيتك. للتواصل والحصول على استشارة مجانية: <strong><a href="tel:+966534309221">966534309221</a></strong>.</p>
                `.trim(),
                image: '/20.jpg',
                author: 'لاندسكيب ماسترز بالرياض',
                featured: false,
                metaTitle: 'شركة جلسات خارجية بالرياض | لاندسكيب ماسترز 966534309221',
                metaDescription: 'أفضل شركة تصميم وتنفيذ جلسات خارجية وبرجولات خشبية وغرف زجاجية بالرياض. خصم خاص واستشارة مجانية.',
                metaKeywords: ['جلسات خارجية بالرياض', 'برجولات خشبية', 'غرف زجاجية', 'لاندسكيب ماسترز'],
            },
            // 8. شركة تصميم وتركيب تكسيات جدارية بالرياض
            {
                title: 'شركة تصميم وتركيب تكسيات جدارية بالرياض – لاندسكيب ماسترز لتصميم وتنسيق الحدائق',
                slug: 'شركة-تصميم-وتركيب-تكسيات-جدارية-بالرياض-لاندسكيب-ماسترز-لتصميم-وتنسيق-الحدائق',
                excerpt: 'شركة تصميم وتركيب تكسيات جدارية بالرياض – لاندسكيب ماسترز تقدم أفضل تكسيات بديل الخشب وبديل الرخام للأسوار وجدران الحدائق مع إضاءات ليد مخفية.',
                content: `
<h2><strong>شركة تصميم وتركيب تكسيات جدارية بالرياض – بديل الخشب وبديل الرخام</strong></h2>
<p>تضفي <strong>التكسيات الجدارية</strong> لمسة فندقية عصرية على أسوار وجدران الحديقة الخارجية، وتحول الجدران الخرسانية الصامتة إلى لوحات فنية متناسقة. تقدم <strong><a href="https://www.landscaperiyadh.com/" class="internal-link">لاندسكيب ماسترز بالرياض</a></strong> حلولاً شاملة لتكسية الجدران الداخلية والخارجية بأفضل الخامات العالمية.</p>

<h3><strong>أبرز أنواع التكسيات الجدارية للحدائق والأسوار</strong></h3>
<ul>
  <li><strong>تكسيات بديل الخشب WPC الخارجي:</strong> خامات مقاومة للشمس المباشرة، الحرارة الشديدة، والماء، ولا تتأثر بالرطوبة أو الحشرات وتدوم لسنوات دون بهتان.</li>
  <li><strong>ألواح بديل الرخام للحدائق:</strong> لمسة فاخرة تشبه الرخام الطبيعي مع خفة وزن وسهولة تركيب ومقاومة عالية للخدوش والعوامل الجوية.</li>
  <li><strong>التكسيات المدمجة مع الشلالات والإضاءة:</strong> تصميم جداري متكامل يجمع بين بديل الخشب ومصبات الشلالات الجدارية وأشرطة الـ LED المضيئة.</li>
  <li><strong>أحواض زراعة جدارية معلقة:</strong> دمج أحواض النباتات المتدلية مع التكسيات الجدارية لخلق مظهر أخضر عمودي (Vertical Garden).</li>
</ul>

<h3><strong>ضمان الجودة والتركيب المتقن</strong></h3>
<p>يقوم فريقنا الهندسي بتركيب التكسيات بدقة متناهية مع تثبيت عوازل قوية لضمان ثبات اللوحات لسنوات طويلة مع ضمان شامل. اتصل بنا الآن على: <strong><a href="tel:+966534309221">966534309221</a></strong>.</p>
                `.trim(),
                processedContent: `
<h2><strong>شركة تصميم وتركيب تكسيات جدارية بالرياض – بديل الخشب وبديل الرخام</strong></h2>
<p>تضفي <strong>التكسيات الجدارية</strong> لمسة فندقية عصرية على أسوار وجدران الحديقة الخارجية، وتحول الجدران الخرسانية الصامتة إلى لوحات فنية متناسقة. تقدم <strong><a href="https://www.landscaperiyadh.com/" class="internal-link">لاندسكيب ماسترز بالرياض</a></strong> حلولاً شاملة لتكسية الجدران الداخلية والخارجية بأفضل الخامات العالمية.</p>

<h3><strong>أبرز أنواع التكسيات الجدارية للحدائق والأسوار</strong></h3>
<ul>
  <li><strong>تكسيات بديل الخشب WPC الخارجي:</strong> خامات مقاومة للشمس المباشرة، الحرارة الشديدة، والماء، ولا تتأثر بالرطوبة أو الحشرات وتدوم لسنوات دون بهتان.</li>
  <li><strong>ألواح بديل الرخام للحدائق:</strong> لمسة فاخرة تشبه الرخام الطبيعي مع خفة وزن وسهولة تركيب ومقاومة عالية للخدوش والعوامل الجوية.</li>
  <li><strong>التكسيات المدمجة مع الشلالات والإضاءة:</strong> تصميم جداري متكامل يجمع بين بديل الخشب ومصبات الشلالات الجدارية وأشرطة الـ LED المضيئة.</li>
  <li><strong>أحواض زراعة جدارية معلقة:</strong> دمج أحواض النباتات المتدلية مع التكسيات الجدارية لخلق مظهر أخضر عمودي (Vertical Garden).</li>
</ul>

<h3><strong>ضمان الجودة والتركيب المتقن</strong></h3>
<p>يقوم فريقنا الهندسي بتركيب التكسيات بدقة متناهية مع تثبيت عوازل قوية لضمان ثبات اللوحات لسنوات طويلة مع ضمان شامل. اتصل بنا الآن على: <strong><a href="tel:+966534309221">966534309221</a></strong>.</p>
                `.trim(),
                image: '/004.png',
                author: 'لاندسكيب ماسترز بالرياض',
                featured: false,
                metaTitle: 'شركة تصميم وتركيب تكسيات جدارية بالرياض | بديل الخشب والرخام',
                metaDescription: 'تكسيات جدارية بديل الخشب وبديل الرخام للأسوار والحدائق بالرياض مع لاندسكيب ماسترز. اتصل على 966534309221.',
                metaKeywords: ['تكسيات جدارية بالرياض', 'بديل الخشب الرياض', 'بديل الرخام', 'لاندسكيب ماسترز'],
            }
        ];

        // Clear and insert all 8 blogs
        await Blog.deleteMany({});
        await Blog.insertMany(allArticles);

        console.log(`✅ تم استرجاع وحفظ جميع المقالات الـ ${allArticles.length} بنجاح!`);
        allArticles.forEach((a, i) => {
            console.log(`   ${i + 1}. ${a.title} (${a.content.length} حرف)`);
        });

    } catch (e) {
        console.error('❌ خطأ أثناء الاسترجاع:', e);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

restoreAllArticles();
