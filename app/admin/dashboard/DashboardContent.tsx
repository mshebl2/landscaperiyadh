'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Monitor } from 'lucide-react';

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  galleryImages?: string[];
  tags: string[];
  category: string;
  year: string;
  link?: string;
  featured: boolean;
}

interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  featured: boolean;
}

interface Testimonial {
  _id: string;
  name: string;
  company: string;
  location?: string;
  rating: number;
  text: string;
  textAr?: string;
  approved: boolean;
}

interface Banner {
  _id: string;
  page: 'home' | 'contact' | 'about';
  image: string;
}

interface PageAsset {
  _id: string;
  page: string;
  section: string;
  key: string;
  imageUrl: string;
  alt: string;
  altAr: string;
  text: string;
  textAr: string;
  order: number;
}

interface GalleryImage {
  _id: string;
  image: string;
  alt: string;
  altAr?: string;
  order: number;
}

interface Blog {
  _id: string;
  title: string;
  titleEn?: string;
  titleAr?: string;
  excerpt: string;
  excerptEn?: string;
  excerptAr?: string;
  content: string;
  contentEn?: string;
  contentAr?: string;
  image: string;
  author: string;
  featured: boolean;
}

interface HomeSlide {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  order: number;
  isActive: boolean;
}



interface SEOConfig {
  _id: string;
  globalAutoSEO: boolean;
  globalAutoInternalLinks: boolean;
  maxInternalLinksPerPost: number;
  defaultMetaKeywordsCount: number;
  siteName: string;
  defaultOGImage: string;
  twitterHandle: string;
}

interface LinkMapping {
  _id: string;
  keyword: string;
  url: string;
  priority: number;
  caseSensitive: boolean;
  maxOccurrences: number;
  isActive: boolean;
  description: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Toast Notification Component
function ToastNotification({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const colors = {
    success: 'bg-green-500/20 border-green-500/50 text-green-400',
    error: 'bg-red-500/20 border-red-500/50 text-red-400',
    info: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-lg shadow-lg ${colors[toast.type]}`}
    >
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
}

// Toast Container
function ToastContainer({ toasts, onClose }: { toasts: Toast[]; onClose: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-[10000] flex flex-col gap-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastNotification key={toast.id} toast={toast} onClose={() => onClose(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}


// Page Assets Section Component
function PageAssetsSection({
  pageAssets,
  onUpdate,
  showToast,
}: {
  pageAssets: PageAsset[];
  onUpdate: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}) {
  const [editingAsset, setEditingAsset] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PageAsset>>({});
  const [imageFileId, setImageFileId] = useState('');
  const [uploading, setUploading] = useState(false);

  const adminHeaders = {
    'X-Admin-Request': 'true',
  };

  const handleSave = async (id?: string) => {
    // Basic Validation
    if (!formData.page || !formData.section || !formData.key) {
      showToast('الصفحة والقسم والمعرف حقول مطلوبة', 'error');
      return;
    }

    try {
      const url = id ? `/api/page-assets/${id}` : '/api/page-assets';
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...adminHeaders,
        },
        body: JSON.stringify({
          ...formData,
          imageUrl: imageFileId || formData.imageUrl,
        }),
      });

      if (res.ok) {
        showToast('تم حفظ العنصر بنجاح', 'success');
        setEditingAsset(null);
        setFormData({});
        setImageFileId('');
        onUpdate();
      } else {
        showToast('فشل حفظ العنصر', 'error');
      }
    } catch (error) {
      console.error('Failed to save asset:', error);
      showToast('Failed to save asset', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    try {
      const res = await fetch(`/api/page-assets/${id}`, {
        method: 'DELETE',
        headers: adminHeaders,
      });

      if (res.ok) {
        showToast('تم الحذف بنجاح', 'success');
        onUpdate();
      } else {
        showToast('فشل الحذف', 'error');
      }
    } catch (error) {
      console.error('Failed to delete asset:', error);
      showToast('فشل الحذف', 'error');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: adminHeaders,
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        setImageFileId(result.fileId);
        showToast('Image uploaded successfully', 'success');
      } else {
        showToast('Failed to upload image', 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const openEditForm = (asset: PageAsset) => {
    setEditingAsset(asset._id);
    setFormData(asset);
    setImageFileId(asset.imageUrl);
  };

  const openNewForm = () => {
    setEditingAsset('new');
    setFormData({
      page: 'about',
      section: 'team',
      order: pageAssets.length,
    });
    setImageFileId('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">إدارة محتوى الصفحات</h3>
        <RippleButton
          onClick={openNewForm}
          className="bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black px-4 py-2 rounded-lg font-semibold"
        >
          إضافة عنصر جديد
        </RippleButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pageAssets.map((asset) => (
          <motion.div
            key={asset._id}
            layout
            className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex gap-4 hover:border-[#FFDD00]/30 transition-colors"
          >
            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-900 border border-white/10">
              <img
                src={asset.imageUrl?.startsWith('/') || asset.imageUrl?.startsWith('http') ? asset.imageUrl : `/api/images/${asset.imageUrl}`}
                alt={asset.alt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.jpg';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-white truncate">{asset.key}</h4>
              <p className="text-xs text-[#FFDD00] mb-1 font-mono uppercase">{asset.page} / {asset.section}</p>
              <p className="text-sm text-gray-400 line-clamp-2">{asset.textAr || asset.text}</p>
            </div>
            <div className="flex flex-col gap-2">
              <RippleButton
                onClick={() => openEditForm(asset)}
                className="text-blue-400 hover:text-blue-300 text-sm font-semibold"
              >
                تعديل
              </RippleButton>
              <RippleButton
                onClick={() => handleDelete(asset._id)}
                className="text-red-400 hover:text-red-300 text-sm font-semibold"
              >
                حذف
              </RippleButton>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {editingAsset && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingAsset === 'new' ? 'عنصر جديد' : 'تعديل عنصر'}
                </h3>
                <button onClick={() => setEditingAsset(null)} className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">الصفحة *</label>
                    <input
                      type="text"
                      value={formData.page || ''}
                      onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-[#FFDD00] focus:border-transparent outline-none transition-all"
                      placeholder="e.g. home"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">القسم *</label>
                    <input
                      type="text"
                      value={formData.section || ''}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-[#FFDD00] focus:border-transparent outline-none transition-all"
                      placeholder="e.g. hero"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">المعرف (Unique ID) *</label>
                  <input
                    type="text"
                    value={formData.key || ''}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-[#FFDD00] focus:border-transparent outline-none transition-all"
                    placeholder="e.g. hero_title"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">الصورة</label>
                  <div className="flex items-center gap-4">
                    {imageFileId && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
                        <img
                          src={imageFileId.startsWith('/') || imageFileId.startsWith('http') ? imageFileId : `/api/images/${imageFileId}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FFDD00] file:text-black hover:file:bg-[#FFE640] file:cursor-pointer hover:file:cursor-pointer"
                    />
                  </div>
                  {uploading && <p className="text-sm text-[#FFDD00] mt-1">جاري الرفع...</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">النص البديل (إنجليزي)</label>
                    <input
                      type="text"
                      value={formData.alt || ''}
                      onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-[#FFDD00] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">النص البديل (عربي)</label>
                    <input
                      type="text"
                      value={formData.altAr || ''}
                      onChange={(e) => setFormData({ ...formData, altAr: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white text-right focus:ring-2 focus:ring-[#FFDD00] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">النص (إنجليزي)</label>
                    <textarea
                      value={formData.text || ''}
                      onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-[#FFDD00] focus:border-transparent outline-none transition-all min-h-[80px]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">النص (عربي)</label>
                    <textarea
                      value={formData.textAr || ''}
                      onChange={(e) => setFormData({ ...formData, textAr: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white text-right focus:ring-2 focus:ring-[#FFDD00] focus:border-transparent outline-none transition-all min-h-[80px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">الترتيب</label>
                  <input
                    type="number"
                    value={formData.order || 0}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-[#FFDD00] focus:border-transparent outline-none transition-all"
                  />
                </div>

                <RippleButton
                  onClick={() => handleSave(editingAsset === 'new' ? undefined : editingAsset)}
                  className="w-full bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black font-bold py-3 rounded-xl mt-4 shadow-lg hover:shadow-[#FFDD00]/20"
                >
                  حفظ العنصر
                </RippleButton>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HomeSlidesSection({
  slides,
  onEdit,
  onDelete,
  onAddNew,
}: {
  slides: HomeSlide[];
  onEdit: (slide: any) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}) {
  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {slides.map((slide, index) => (
          <motion.div
            key={slide._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="group bg-gradient-to-r from-gray-900/50 to-gray-900/30 rounded-xl p-4 border border-white/10 hover:border-[#FFDD00]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#FFDD00]/10"
          >
            <div className="flex-1 min-w-0 flex gap-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                <img
                  src={slide.image && !slide.image.startsWith('/') && !slide.image.startsWith('http') ? `/api/images/${slide.image}` : (slide.image || '/placeholder.jpg')}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-white truncate group-hover:text-[#FFDD00] transition-colors">
                    {slide.title}
                  </h3>
                  {!slide.isActive && (
                    <span className="text-xs bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full font-bold">غير مفعل</span>
                  )}
                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">الترتيب: {slide.order}</span>
                </div>
                <p className="text-white/70 text-sm line-clamp-2">{slide.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <RippleButton
                onClick={() => onEdit(slide)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-md hover:shadow-lg min-w-[70px]"
              >
                تعديل
              </RippleButton>
              <RippleButton
                onClick={() => onDelete(slide._id)}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg text-sm font-medium hover:from-red-500 hover:to-red-400 transition-all duration-200 shadow-md hover:shadow-lg min-w-[70px]"
              >
                حذف
              </RippleButton>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: slides.length * 0.03 }}
        className="pt-4 border-t border-white/10"
      >
        <RippleButton
          onClick={onAddNew}
          className="w-full bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-[#FFDD00]/30 transition-all duration-200"
        >
          إضافة شريحة
        </RippleButton>
      </motion.div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();

  const tabNames: Record<string, string> = {
    projects: 'المشاريع',
    services: 'الخدمات',
    banners: 'البنرات',
    gallery: 'معرض الصور',
    'page-assets': 'محتوى الصفحات',
    'home-slides': 'شرائح الرئيسية',
    blogs: 'المدونة',
    'seo-config': 'إعدادات SEO',
    'link-mappings': 'الروابط الداخلية',
  };

  const [activeTab, setActiveTab] = useState<'projects' | 'services' | 'banners' | 'gallery' | 'page-assets' | 'home-slides' | 'blogs' | 'seo-config' | 'link-mappings'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [pageAssets, setPageAssets] = useState<PageAsset[]>([]);
  const [homeSlides, setHomeSlides] = useState<HomeSlide[]>([]);

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [seoConfig, setSeoConfig] = useState<SEOConfig | null>(null);
  const [linkMappings, setLinkMappings] = useState<LinkMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (!auth) {
      router.push('/admin/login');
      return;
    }
    fetchAllData();
  }, [router]);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
      // On desktop, always show sidebar
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      }
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const adminHeaders = {
    'X-Admin-Request': 'true',
  };

  const fetchAllData = async () => {
    try {
      const [projectsRes, servicesRes, testimonialsRes, bannersRes, galleryRes, pageAssetsRes, homeSlidesRes, blogsRes, seoRes, linksRes] = await Promise.all([
        fetch('/api/projects', { headers: adminHeaders }),
        fetch('/api/services', { headers: adminHeaders }),
        fetch('/api/testimonials', { headers: adminHeaders }),
        fetch('/api/banners', { headers: adminHeaders }),
        fetch('/api/gallery', { headers: adminHeaders }),
        fetch('/api/page-assets', { headers: adminHeaders }),
        fetch('/api/home-slides', { headers: adminHeaders }),
        fetch('/api/blogs', { headers: adminHeaders }),
        fetch('/api/seo-config', { headers: adminHeaders }),
        fetch('/api/link-mappings', { headers: adminHeaders }),
      ]);
      setProjects(await projectsRes.json());
      setServices(await servicesRes.json());
      setTestimonials(await testimonialsRes.json());
      setBanners(await bannersRes.json());
      setGalleryImages(await galleryRes.json());
      setPageAssets(await pageAssetsRes.json());
      setHomeSlides(await (await homeSlidesRes.json() as Promise<any>));

      setBlogs(await blogsRes.json());
      setSeoConfig(await seoRes.json());
      setLinkMappings(await linksRes.json());
    } catch (error) {
      console.error('Failed to fetch data:', error);
      showToast('خطأ في تحميل البيانات', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/admin/login');
  };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;

    try {
      const res = await fetch(`/api/${type}/${id}`, {
        method: 'DELETE',
        headers: adminHeaders,
      });
      if (res.ok) {
        showToast('تم الحذف بنجاح', 'success');
        fetchAllData();
      } else {
        showToast('فشل الحذف', 'error');
      }
    } catch (error) {
      console.error('Failed to delete:', error);
      showToast('فشل الحذف', 'error');
    }
  };

  const handleToggleFeatured = async (type: string, id: string, currentValue: boolean) => {
    try {
      const res = await fetch(`/api/${type}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...adminHeaders,
        },
        body: JSON.stringify({ featured: !currentValue }),
      });
      if (res.ok) {
        showToast('تم تحديث العنصر بنجاح', 'success');
        fetchAllData();
      }
    } catch (error) {
      console.error('Failed to update:', error);
      showToast('فشل التحديث', 'error');
    }
  };

  const handleToggleApproved = async (id: string, currentValue: boolean) => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...adminHeaders,
        },
        body: JSON.stringify({ approved: !currentValue }),
      });
      if (res.ok) {
        showToast(currentValue ? 'تم إلغاء الاعتماد' : 'تم الاعتماد بنجاح', 'success');
        fetchAllData();
      }
    } catch (error) {
      console.error('Failed to update:', error);
      showToast('فشل التحديث', 'error');
    }
  };

  const handleSave = async () => {
    try {
      const url = editingItem
        ? `/api/${activeTab}/${editingItem}`
        : `/api/${activeTab}`;
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...adminHeaders,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showToast('تم الحفظ بنجاح', 'success');
        setShowForm(false);
        setEditingItem(null);
        setFormData({});
        fetchAllData();
      } else {
        showToast('فشل الحفظ', 'error');
      }
    } catch (error) {
      console.error('Failed to save:', error);
      showToast('فشل الحفظ', 'error');
    }
  };

  const openNewForm = useCallback(() => {
    setEditingItem(null);
    const initialData: any = {};
    if (activeTab === 'projects') {
      initialData.title = '';
      initialData.titleAr = '';
      initialData.description = '';
      initialData.descriptionAr = '';
      initialData.image = '';
      initialData.galleryImages = [];
      initialData.category = '';
      initialData.categoryAr = '';
      initialData.year = '';
      initialData.link = '';
    } else if (activeTab === 'home-slides') {
      initialData.title = '';
      initialData.titleAr = '';
      initialData.subtitle = '';
      initialData.subtitleAr = '';
      initialData.image = '';
      initialData.order = 0;
      initialData.isActive = true;
    } else if (activeTab === 'services') {
      initialData.title = '';
      initialData.titleAr = '';
      initialData.description = '';
      initialData.descriptionAr = '';
      initialData.icon = '';
    } else if (activeTab === 'blogs') {
      initialData.title = '';
      initialData.excerpt = '';
      initialData.content = '';
      initialData.image = '';
      initialData.author = '';
      initialData.featured = false;
    } else if (activeTab === 'link-mappings') {
      initialData.keyword = '';
      initialData.url = '';
      initialData.priority = 0;
      initialData.caseSensitive = false;
      initialData.maxOccurrences = 1;
      initialData.isActive = true;
      initialData.description = '';
    }
    setFormData(initialData);
    setShowForm(true);
  }, [activeTab]);

  const openEditForm = (item: any) => {
    setEditingItem(item._id);
    setFormData({ ...item });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-[#FFDD00]/30 border-t-[#FFDD00] rounded-full"
          />
          <div className="text-xl">جاري التحميل...</div>
        </motion.div>
      </div>
    );
  }

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="min-h-screen bg-black text-white" dir="rtl">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Mobile Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#111114] border-b border-white/10 p-4 flex items-center justify-between backdrop-blur-lg"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex flex-col gap-1.5 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={{ rotate: isSidebarOpen ? 45 : 0, y: isSidebarOpen ? 8 : 0 }}
            className="w-6 h-0.5 bg-white transition-all duration-300"
          />
          <motion.span
            animate={{ opacity: isSidebarOpen ? 0 : 1 }}
            className="w-6 h-0.5 bg-white transition-all duration-300"
          />
          <motion.span
            animate={{ rotate: isSidebarOpen ? -45 : 0, y: isSidebarOpen ? -8 : 0 }}
            className="w-6 h-0.5 bg-white transition-all duration-300"
          />
        </motion.button>
        <h1 className="text-xl font-bold text-[#FFDD00]">لوحة التحكم</h1>
        <div className="w-10" />
      </motion.div>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isDesktop || isSidebarOpen ? 0 : '100%',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed right-0 top-0 h-full w-64 bg-[#111114] border-l border-white/10 p-6 z-50 shadow-2xl`}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-xl md:text-2xl font-bold text-[#FFDD00]">لوحة التحكم</h1>
        </motion.div>
        <nav className="space-y-2">
          {[
            { id: 'projects', label: 'المشاريع' },
            { id: 'services', label: 'الخدمات' },
            { id: 'banners', label: 'البنرات' },
            // { id: 'gallery', label: 'معرض الصور' }, // Hidden - not needed
            { id: 'page-assets', label: 'محتوى الصفحات' },
            { id: 'home-slides', label: 'شرائح الرئيسية' },
            { id: 'blogs', label: 'المدونة' },
            { id: 'seo-config', label: 'إعدادات SEO' },
            { id: 'link-mappings', label: 'الروابط الداخلية' },
          ].map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveTab(tab.id as any);
                setShowForm(false);
                setEditingItem(null);
                setIsSidebarOpen(false);
              }}
              className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === tab.id
                ? 'bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black font-semibold shadow-lg shadow-[#FFDD00]/30'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute right-0 top-0 bottom-0 w-1 bg-black/20 rounded-l-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </motion.button>
          ))}
        </nav>
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="mt-8 w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
        >
          <span>تسجيل الخروج</span>
        </motion.button>
      </motion.aside>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:mr-64 pt-16 lg:pt-0 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold capitalize bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              {tabNames[activeTab]}
            </h2>
          </motion.div>

          {/* Content Area */}
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="bg-[#111114] rounded-2xl border border-white/10 p-4 md:p-6 overflow-x-auto shadow-xl"
          >
            {activeTab === 'projects' && (
              <ProjectsSection
                projects={projects}
                onEdit={openEditForm}
                onDelete={(id) => handleDelete('projects', id)}
                onAddNew={openNewForm}
              />
            )}

            {activeTab === 'services' && (
              <ServicesSection
                services={services}
                onEdit={openEditForm}
                onDelete={(id) => handleDelete('services', id)}
                onAddNew={openNewForm}
              />
            )}

            {activeTab === 'banners' && (
              <BannersSection banners={banners} onUpdate={fetchAllData} showToast={showToast} />
            )}

            {activeTab === 'gallery' && (
              <GallerySection galleryImages={galleryImages} onUpdate={fetchAllData} showToast={showToast} />
            )}

            {activeTab === 'page-assets' && (
              <PageAssetsSection pageAssets={pageAssets} onUpdate={fetchAllData} showToast={showToast} />
            )}

            {activeTab === 'home-slides' && (
              <HomeSlidesSection
                slides={homeSlides}
                onEdit={openEditForm}
                onDelete={(id) => handleDelete('home-slides', id)}
                onAddNew={openNewForm}
              />
            )}



            {activeTab === 'blogs' && (
              <BlogsSection
                blogs={blogs}
                onEdit={openEditForm}
                onDelete={(id) => handleDelete('blogs', id)}
                onAddNew={openNewForm}
              />
            )}

            {activeTab === 'seo-config' && seoConfig && (
              <SEOConfigSection
                config={seoConfig}
                onUpdate={fetchAllData}
                showToast={showToast}
              />
            )}

            {activeTab === 'link-mappings' && (
              <InternalLinksSection
                mappings={linkMappings}
                onEdit={openEditForm}
                onDelete={(id) => handleDelete('link-mappings', id)}
                onAddNew={openNewForm}
              />
            )}
          </motion.div>
        </div>
      </main>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <FormModal
            key={editingItem || 'new'}
            type={activeTab}
            data={formData}
            onChange={setFormData}
            onSave={handleSave}
            onClose={() => {
              setShowForm(false);
              setEditingItem(null);
              setFormData({});
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Enhanced Button Component with Ripple Effect
function RippleButton({
  children,
  onClick,
  className,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  [key: string]: any;
}) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 600);

    onClick?.();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {children}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30"
          initial={{ width: 0, height: 0, x: ripple.x, y: ripple.y }}
          animate={{ width: 300, height: 300, x: ripple.x - 150, y: ripple.y - 150, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      ))}
    </motion.button>
  );
}

// Projects Section Component
function ProjectsSection({
  projects,
  onEdit,
  onDelete,
  onAddNew,
}: {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}) {
  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {projects.map((project, index) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="group bg-gray-900/40 backdrop-blur-md rounded-2xl p-5 border border-white/5 hover:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-lg font-bold text-white truncate group-hover:text-[#FFDD00] transition-colors tracking-wide">
                  {project.title}
                </h3>
              </div>
              <p className="text-white/60 text-sm line-clamp-2 leading-relaxed mb-4 font-light">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-mono text-[#FFDD00]/80 bg-[#FFDD00]/10 px-2 py-1 rounded-md border border-[#FFDD00]/20">{project.category}</span>
                <span className="text-xs font-mono text-white/40 px-2 py-1">{project.year}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <RippleButton
                onClick={() => onEdit(project)}
                className="px-5 py-2.5 bg-gray-700/50 hover:bg-gray-700 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow hover:shadow-lg border border-white/5 hover:border-white/20"
              >
                تعديل
              </RippleButton>
              <RippleButton
                onClick={() => onDelete(project._id)}
                className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl text-sm font-medium transition-all duration-200 border border-red-500/10 hover:border-red-500/30"
              >
                حذف
              </RippleButton>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: projects.length * 0.03 }}
        className="pt-4 border-t border-white/10"
      >
        <RippleButton
          onClick={onAddNew}
          className="w-full bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-[#FFDD00]/30 transition-all duration-200"
        >
          إضافة جديد
        </RippleButton>
      </motion.div>
    </div>
  );
}

// Services Section Component
function ServicesSection({
  services,
  onEdit,
  onDelete,
  onAddNew,
}: {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}) {
  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {services.map((service, index) => (
          <motion.div
            key={service._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="group bg-gradient-to-r from-gray-900/50 to-gray-900/30 rounded-xl p-4 border border-white/10 hover:border-[#FFDD00]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#FFDD00]/10"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-white truncate group-hover:text-[#FFDD00] transition-colors">
                  {service.title}
                </h3>
              </div>
              <p className="text-white/70 text-sm line-clamp-1">{service.description}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <RippleButton
                onClick={() => onEdit(service)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-md hover:shadow-lg min-w-[70px]"
              >
                تعديل
              </RippleButton>
              <RippleButton
                onClick={() => onDelete(service._id)}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg text-sm font-medium hover:from-red-500 hover:to-red-400 transition-all duration-200 shadow-md hover:shadow-lg min-w-[70px]"
              >
                حذف
              </RippleButton>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: services.length * 0.03 }}
        className="pt-4 border-t border-white/10"
      >
        <RippleButton
          onClick={onAddNew}
          className="w-full bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-[#FFDD00]/30 transition-all duration-200"
        >
          إضافة جديد
        </RippleButton>
      </motion.div>
    </div>
  );
}

// Testimonials Section Component
function TestimonialsSection({
  testimonials,
  onEdit,
  onToggleApproved,
  onDelete,
  onAddNew,
}: {
  testimonials: Testimonial[];
  onEdit: (testimonial: Testimonial) => void;
  onToggleApproved: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}) {
  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="group bg-gradient-to-r from-gray-900/50 to-gray-900/30 rounded-xl p-4 border border-white/10 hover:border-[#FFDD00]/30 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#FFDD00]/10"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between mb-2 gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white group-hover:text-[#FFDD00] transition-colors">
                  {testimonial.name}
                </h3>
                <p className="text-white/70 text-sm">{testimonial.company}</p>
                {testimonial.location && (
                  <p className="text-white/50 text-xs">{testimonial.location}</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                <RippleButton
                  onClick={() => onEdit(testimonial)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-md hover:shadow-lg min-w-[70px]"
                >
                  تعديل
                </RippleButton>
                <RippleButton
                  onClick={() => onToggleApproved(testimonial._id, testimonial.approved)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg min-w-[90px] ${testimonial.approved
                    ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white'
                    : 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white'
                    }`}
                >
                  {testimonial.approved ? 'معتمد' : 'اعتماد'}
                </RippleButton>
                <RippleButton
                  onClick={() => onDelete(testimonial._id)}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg text-sm font-medium hover:from-red-500 hover:to-red-400 transition-all duration-200 shadow-md hover:shadow-lg min-w-[70px]"
                >
                  حذف
                </RippleButton>
              </div>
            </div>
            <p className="text-white/80 text-sm mt-2 break-words">{testimonial.text}</p>
            <div className="flex items-center gap-1 mt-2">
              {[...Array(testimonial.rating)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-[#FFDD00]"
                >
                  ★
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: testimonials.length * 0.03 }}
        className="pt-4 border-t border-white/10"
      >
        <RippleButton
          onClick={onAddNew}
          className="w-full bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-[#FFDD00]/30 transition-all duration-200"
        >
          إضافة رأي جديد
        </RippleButton>
      </motion.div>
    </div>
  );
}

// Banners Section Component
function BannersSection({
  banners,
  onUpdate,
  showToast,
}: {
  banners: Banner[];
  onUpdate: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}) {
  const [editingBanner, setEditingBanner] = useState<string | null>(null);
  const [imageFileId, setImageFileId] = useState('');
  const [uploading, setUploading] = useState(false);

  const adminHeaders = {
    'X-Admin-Request': 'true',
  };

  const handleSaveBanner = async (page: string) => {
    try {
      // Save the full image path, not just the fileId
      const imagePath = imageFileId ? `/api/images/${imageFileId}` : banners.find(b => b.page === page)?.image || '';

      const res = await fetch('/api/banners', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...adminHeaders,
        },
        body: JSON.stringify({ page, image: imagePath }),
      });
      if (res.ok) {
        showToast('تم تحديث البنر بنجاح', 'success');
        setEditingBanner(null);
        setImageFileId('');
        onUpdate();
      } else {
        showToast('فشل تحديث البنر', 'error');
      }
    } catch (error) {
      console.error('Failed to update banner:', error);
      showToast('فشل تحديث البنر', 'error');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: adminHeaders,
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        setImageFileId(result.fileId);
        showToast('Image uploaded successfully', 'success');
      } else {
        showToast('Failed to upload image', 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const bannerPages: Array<{ page: 'home' | 'contact' | 'about'; label: string }> = [
    { page: 'home', label: 'الرئيسية' },
    { page: 'contact', label: 'اتصل بنا' },
    { page: 'about', label: 'من نحن' },
  ];

  return (
    <div className="space-y-6">
      {bannerPages.map(({ page, label }, index) => {
        const banner = banners.find((b) => b.page === page);
        return (
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
            className="bg-gradient-to-r from-gray-900/50 to-gray-900/30 rounded-xl p-6 border border-white/10 hover:border-[#FFDD00]/30 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <h3 className="font-semibold text-white mb-4">{label}</h3>
            {editingBanner === page ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">رفع صورة</label>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="w-full bg-gray-800 border border-white/20 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-[#FFDD00] file:to-[#FFE640] file:text-black hover:file:from-[#FFE640] hover:file:to-[#FFDD00] transition-all duration-200 cursor-pointer disabled:opacity-50"
                    />
                  </motion.div>
                  {uploading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 flex items-center gap-2 text-sm text-white/70"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-[#FFDD00]/30 border-t-[#FFDD00] rounded-full"
                      />
                      جاري الرفع...
                    </motion.div>
                  )}
                </div>
                {(imageFileId || (banner && banner.image)) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-full h-48 rounded-xl overflow-hidden border border-white/20 shadow-lg"
                  >
                    <img
                      src={imageFileId ? `/api/images/${imageFileId}` : (banner?.image && (banner.image.startsWith('/') || banner.image.startsWith('http')) ? banner.image : `/api/images/${banner?.image}`)}
                      alt={label}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}
                <div className="flex gap-2">
                  <RippleButton
                    onClick={() => handleSaveBanner(page)}
                    disabled={(!imageFileId && !banner?.image) || uploading}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black rounded-xl font-semibold hover:from-[#FFE640] hover:to-[#FFDD00] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    حفظ
                  </RippleButton>
                  <RippleButton
                    onClick={() => {
                      setEditingBanner(null);
                      setImageFileId('');
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-xl font-semibold hover:from-gray-600 hover:to-gray-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    إلغاء
                  </RippleButton>
                </div>
              </div>
            ) : (
              <div>
                {banner && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="relative w-full h-48 rounded-xl overflow-hidden border border-white/20 mb-4 shadow-lg"
                  >
                    <img
                      src={banner.image && (banner.image.startsWith('/') || banner.image.startsWith('http')) ? banner.image : `/api/images/${banner.image}`}
                      alt={label}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}
                <RippleButton
                  onClick={() => {
                    setEditingBanner(page);
                    setImageFileId(banner?.image || '');
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {banner ? 'تغيير الصورة' : 'تعيين صورة'}
                </RippleButton>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// Gallery Section Component
function GallerySection({
  galleryImages,
  onUpdate,
  showToast,
}: {
  galleryImages: GalleryImage[];
  onUpdate: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}) {
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [imageFileId, setImageFileId] = useState('');
  const [altText, setAltText] = useState('');
  const [altTextAr, setAltTextAr] = useState('');
  const [order, setOrder] = useState(0);
  const [uploading, setUploading] = useState(false);

  const adminHeaders = {
    'X-Admin-Request': 'true',
  };

  const handleSaveGalleryImage = async (id?: string) => {
    try {
      const url = id ? `/api/gallery/${id}` : '/api/gallery';
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...adminHeaders,
        },
        body: JSON.stringify({
          image: imageFileId,
          alt: altText,
          altAr: altTextAr,
          order: order || 0,
        }),
      });
      if (res.ok) {
        showToast(id ? 'تم تحديث الصورة بنجاح' : 'تم إضافة الصورة بنجاح', 'success');
        setEditingImage(null);
        setImageFileId('');
        setAltText('');
        setAltTextAr('');
        setOrder(0);
        onUpdate();
      } else {
        showToast('فشل حفظ الصورة', 'error');
      }
    } catch (error) {
      console.error('Failed to save gallery image:', error);
      showToast('فشل حفظ الصورة', 'error');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: adminHeaders,
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        setImageFileId(result.fileId);
        showToast('تم رفع الصورة بنجاح', 'success');
      } else {
        showToast('فشل رفع الصورة', 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast('فشل رفع الصورة', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: adminHeaders,
      });
      if (res.ok) {
        showToast('تم الحذف بنجاح', 'success');
        onUpdate();
      } else {
        showToast('فشل الحذف', 'error');
      }
    } catch (error) {
      console.error('Failed to delete:', error);
      showToast('فشل الحذف', 'error');
    }
  };

  const openEditForm = (image: GalleryImage) => {
    setEditingImage(image._id);
    setImageFileId(image.image);
    setAltText(image.alt);
    setAltTextAr(image.altAr || '');
    setOrder(image.order);
  };

  const openNewForm = () => {
    setEditingImage('new');
    setImageFileId('');
    setAltText('');
    setAltTextAr('');
    setOrder(galleryImages.length);
  };

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {galleryImages.map((image, index) => (
          <motion.div
            key={image._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="group bg-gradient-to-r from-gray-900/50 to-gray-900/30 rounded-xl p-4 border border-white/10 hover:border-[#FFDD00]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#FFDD00]/10"
          >
            <div className="flex-1 min-w-0 flex items-center gap-4">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-lg overflow-hidden border border-white/20 flex-shrink-0 shadow-lg">
                <img
                  src={image.image.startsWith('/') || image.image.startsWith('http') ? image.image : `/api/images/${image.image}`}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate group-hover:text-[#FFDD00] transition-colors mb-1">
                  {image.alt}
                </p>
                {image.altAr && (
                  <p className="text-white/70 text-sm truncate mb-1">{image.altAr}</p>
                )}
                <p className="text-white/50 text-xs text-right" dir="ltr">Order: {image.order}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <RippleButton
                onClick={() => openEditForm(image)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-md hover:shadow-lg min-w-[70px]"
              >
                تعديل
              </RippleButton>
              <RippleButton
                onClick={() => handleDelete(image._id)}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg text-sm font-medium hover:from-red-500 hover:to-red-400 transition-all duration-200 shadow-md hover:shadow-lg min-w-[70px]"
              >
                حذف
              </RippleButton>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: galleryImages.length * 0.03 }}
        className="pt-4 border-t border-white/10"
      >
        <RippleButton
          onClick={openNewForm}
          className="w-full bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-[#FFDD00]/30 transition-all duration-200"
        >
          إضافة صورة جديدة
        </RippleButton>
      </motion.div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {editingImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setEditingImage(null);
                setImageFileId('');
                setAltText('');
                setAltTextAr('');
                setOrder(0);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111114] rounded-2xl border border-white/10 p-4 md:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6 gap-4">
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#FFDD00] to-[#FFE640] bg-clip-text text-transparent flex-1">
                  {editingImage === 'new' ? 'إضافة صورة جديدة' : 'تعديل صورة'}
                </h2>
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setEditingImage(null);
                    setImageFileId('');
                    setAltText('');
                    setAltTextAr('');
                    setOrder(0);
                  }}
                  className="text-white/70 hover:text-white text-2xl flex-shrink-0 transition-colors"
                >
                  ×
                </motion.button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">الصورة</label>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="w-full bg-gray-800 border border-white/20 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-[#FFDD00] file:to-[#FFE640] file:text-black hover:file:from-[#FFE640] hover:file:to-[#FFDD00] transition-all duration-200 cursor-pointer disabled:opacity-50"
                    />
                  </motion.div>
                  {uploading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 flex items-center gap-2 text-sm text-white/70"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-[#FFDD00]/30 border-t-[#FFDD00] rounded-full"
                      />
                      جاري الرفع...
                    </motion.div>
                  )}
                </div>
                {(imageFileId || (editingImage !== 'new' && galleryImages.find(img => img._id === editingImage))) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-full h-48 rounded-xl overflow-hidden border border-white/20 shadow-lg"
                  >
                    <img
                      src={imageFileId ? `/api/images/${imageFileId}` : (galleryImages.find(img => img._id === editingImage)?.image.startsWith('/') || galleryImages.find(img => img._id === editingImage)?.image.startsWith('http') ? galleryImages.find(img => img._id === editingImage)?.image : `/api/images/${galleryImages.find(img => img._id === editingImage)?.image}`)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}
                <FormInput
                  label="النص البديل (انجليزي)"
                  value={altText}
                  onChange={(value) => setAltText(value)}
                  required
                />
                <FormInput
                  label="النص البديل (عربي) - اختياري"
                  value={altTextAr}
                  onChange={(value) => setAltTextAr(value)}
                />
                <FormInput
                  label="الترتيب"
                  type="number"
                  value={order.toString()}
                  onChange={(value) => setOrder(parseInt(value) || 0)}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-6">
                <RippleButton
                  onClick={() => handleSaveGalleryImage(editingImage === 'new' ? undefined : editingImage)}
                  disabled={!imageFileId && editingImage === 'new'}
                  className="flex-1 bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black px-6 py-3 rounded-xl font-semibold hover:from-[#FFE640] hover:to-[#FFDD00] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  حفظ
                </RippleButton>
                <RippleButton
                  onClick={() => {
                    setEditingImage(null);
                    setImageFileId('');
                    setAltText('');
                    setAltTextAr('');
                    setOrder(0);
                  }}
                  className="flex-1 bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  إلغاء
                </RippleButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}





// SEO Config Section Component
function SEOConfigSection({
  config,
  onUpdate,
  showToast,
}: {
  config: SEOConfig;
  onUpdate: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}) {
  const [formData, setFormData] = useState<SEOConfig>(config);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(config);
  }, [config]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/seo-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Request': 'true',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showToast('تم تحديث إعدادات SEO بنجاح', 'success');
        onUpdate();
      } else {
        showToast('فشل تحديث الإعدادات', 'error');
      }
    } catch (error) {
      console.error('Failed to update config:', error);
      showToast('فشل تحديث الإعدادات', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof SEOConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-gray-900/50 p-6 rounded-xl border border-white/10 space-y-6">
        <h3 className="text-xl font-bold text-[#FFDD00]">إعدادات الأتمتة العامة</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div>
              <h4 className="font-semibold text-white">توليد بيانات SEO تلقائياً</h4>
              <p className="text-sm text-gray-400">توليد العناوين، الوصف، والكلمات المفتاحية للمقالات الجديدة تلقائياً</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.globalAutoSEO}
                onChange={(e) => updateField('globalAutoSEO', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FFDD00]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFDD00]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
            <div>
              <h4 className="font-semibold text-white">ربط المحتوى الداخلي تلقائياً</h4>
              <p className="text-sm text-gray-400">إضافة روابط داخلية للمقالات تلقائياً بناءً على الكلمات المفتاحية المحددة</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.globalAutoInternalLinks}
                onChange={(e) => updateField('globalAutoInternalLinks', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FFDD00]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFDD00]"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 p-6 rounded-xl border border-white/10 space-y-6">
        <h3 className="text-xl font-bold text-[#FFDD00]">الإعدادات الافتراضية</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="اسم الموقع"
            value={formData.siteName}
            onChange={(val) => updateField('siteName', val)}
          />
          <FormInput
            label="حساب تويتر (@username)"
            value={formData.twitterHandle}
            onChange={(val) => updateField('twitterHandle', val)}
          />
          <FormInput
            label="الحد الأقصى للروابط الداخلية لكل مقال"
            type="number"
            value={formData.maxInternalLinksPerPost.toString()}
            onChange={(val) => updateField('maxInternalLinksPerPost', parseInt(val) || 0)}
          />
          <FormInput
            label="العدد الافتراضي للكلمات المفتاحية"
            type="number"
            value={formData.defaultMetaKeywordsCount.toString()}
            onChange={(val) => updateField('defaultMetaKeywordsCount', parseInt(val) || 0)}
          />
          <div className="md:col-span-2">
            <ImageUploadField
              label="صورة OG الافتراضية"
              value={formData.defaultOGImage || ''}
              onChange={(fileId) => updateField('defaultOGImage', fileId)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <RippleButton
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-[#FFDD00]/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </RippleButton>
      </div>
    </div>
  );
}

// Internal Links Section Component
function InternalLinksSection({
  mappings,
  onEdit,
  onDelete,
  onAddNew,
}: {
  mappings: LinkMapping[];
  onEdit: (mapping: LinkMapping) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-400">
          تحديد الكلمات المفتاحية التي يجب ربطها بروابط محددة تلقائياً في مقالاتك.
        </p>
      </div>

      <AnimatePresence mode="popLayout">
        {mappings.map((mapping, index) => (
          <motion.div
            key={mapping._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className={`group bg-gradient-to-r from-gray-900/50 to-gray-900/30 rounded-xl p-4 border ${mapping.isActive ? 'border-white/10' : 'border-red-900/30'} hover:border-[#FFDD00]/30 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#FFDD00]/10`}
          >
            <div className="flex-1 min-w-0 w-full">
              <div className="flex items-center gap-3 mb-1">
                <span className="bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded text-xs font-mono">
                  {mapping.keyword}
                </span>
                <span className="text-gray-500">→</span>
                <span className="text-green-400 font-mono text-sm truncate">
                  {mapping.url}
                </span>
                {!mapping.isActive && (
                  <span className="bg-red-900/50 text-red-400 px-2 py-0.5 rounded text-xs">
                    غير مفعل
                  </span>
                )}
              </div>
              <p className="text-white/50 text-xs mt-1">
                الأولوية: {mapping.priority} • الحد الأقصى: {mapping.maxOccurrences} • {mapping.caseSensitive ? 'حساس لحالة الأحرف' : 'غير حساس لحالة الأحرف'}
              </p>
              {mapping.description && (
                <p className="text-white/30 text-xs mt-1 italic">{mapping.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
              <RippleButton
                onClick={() => onEdit(mapping)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-md hover:shadow-lg min-w-[70px]"
              >
                تعديل
              </RippleButton>
              <RippleButton
                onClick={() => onDelete(mapping._id)}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg text-sm font-medium hover:from-red-500 hover:to-red-400 transition-all duration-200 shadow-md hover:shadow-lg min-w-[70px]"
              >
                حذف
              </RippleButton>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {mappings.length === 0 && (
        <div className="text-center py-10 text-gray-500 bg-gray-900/30 rounded-xl border border-dashed border-gray-800">
          لا توجد روابط. أنشئ رابطاً للبدء!
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: mappings.length * 0.03 }}
        className="pt-4 border-t border-white/10"
      >
        <RippleButton
          onClick={onAddNew}
          className="w-full bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-[#FFDD00]/30 transition-all duration-200"
        >
          إضافة رابط جديد
        </RippleButton>
      </motion.div>
    </div>
  );
}


// Image Upload Component
function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (fileId: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      if (value.startsWith('/') || value.startsWith('http')) {
        setPreview(value);
      } else {
        setPreview(`/api/images/${value}`);
      }
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const adminHeaders = {
        'X-Admin-Request': 'true',
      };

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: adminHeaders,
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        onChange(result.fileId);
        setPreview(`/api/images/${result.fileId}`);
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm text-white/70 mb-2">{label}</label>
      <div className="space-y-2">
        {preview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full h-48 rounded-xl overflow-hidden border border-white/20 shadow-lg"
          >
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          </motion.div>
        )}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="w-full bg-gray-800 border border-white/20 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-[#FFDD00] file:to-[#FFE640] file:text-black hover:file:from-[#FFE640] hover:file:to-[#FFDD00] transition-all duration-200 cursor-pointer disabled:opacity-50"
          />
        </motion.div>
        {uploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm text-white/70"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-[#FFDD00]/30 border-t-[#FFDD00] rounded-full"
            />
            Uploading...
          </motion.div>
        )}
        {value && !value.startsWith('/') && !value.startsWith('http') && (
          <p className="text-xs text-white/50">Image ID: {value}</p>
        )}
      </div>
    </div>
  );
}

// Gallery Images Upload Component (up to 4 images)
function GalleryImagesUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (images: string[]) => void;
}) {
  const [uploading, setUploading] = useState<number | null>(null);
  const [previews, setPreviews] = useState<(string | null)[]>([]);

  useEffect(() => {
    // Create array with 4 slots, mapping value array to slots
    const previewUrls: (string | null)[] = [];
    for (let i = 0; i < 4; i++) {
      if (i < value.length && value[i]) {
        const imgId = value[i];
        if (imgId.startsWith('/') || imgId.startsWith('http')) {
          previewUrls.push(imgId);
        } else {
          previewUrls.push(`/api/images/${imgId}`);
        }
      } else {
        previewUrls.push(null);
      }
    }
    setPreviews(previewUrls);
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(index);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const adminHeaders = {
        'X-Admin-Request': 'true',
      };

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: adminHeaders,
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        const newImages = [...value];
        // If replacing an existing image at this slot position
        if (index < newImages.length) {
          newImages[index] = result.fileId;
        } else {
          // Adding a new image (append to end)
          newImages.push(result.fileId);
        }
        // Ensure we don't exceed 4 images
        const filtered = newImages.filter(img => img).slice(0, 4);
        onChange(filtered);
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(null);
    }
  };

  const handleRemove = (index: number) => {
    const newImages = [...value];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div>
      <label className="block text-sm text-white/70 mb-2">
        {label} <span className="text-white/50 text-xs">(Max 4 images)</span>
      </label>
      <div className="grid grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            {previews[index] ? (
              <div className="relative group">
                <div className="relative w-full h-32 rounded-xl overflow-hidden border border-white/20 shadow-lg">
                  <img src={previews[index] || ''} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRemove(index)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </motion.button>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, index)}
                  disabled={uploading === index || value.length >= 4}
                  className="w-full bg-gray-800 border border-white/20 rounded-xl px-3 py-2 text-white text-xs file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gradient-to-r file:from-[#FFDD00] file:to-[#FFE640] file:text-black hover:file:from-[#FFE640] hover:file:to-[#FFDD00] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {uploading === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-gray-800/80 rounded-xl"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-[#FFDD00]/30 border-t-[#FFDD00] rounded-full"
                    />
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      {value.length > 0 && (
        <p className="text-xs text-white/50 mt-2">
          {value.length} of 4 images uploaded
        </p>
      )}
    </div>
  );
}

// Available icons for services
const AVAILABLE_ICONS = [
  { name: 'leaf', label: 'ورقة' },
  { name: 'tree-pine', label: 'شجرة صنوبر' },
  { name: 'droplets', label: 'قطرات ماء' },
  { name: 'scissors', label: 'مقص' },
  { name: 'waves', label: 'أمواج' },
  { name: 'umbrella', label: 'مظلة' },
  { name: 'flower', label: 'زهرة' },
  { name: 'wrench', label: 'مفتاح ربط' },
  { name: 'hammer', label: 'مطرقة' },
  { name: 'paint-bucket', label: 'دلو طلاء' },
];

// Icon Selector Component
function IconSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm text-white/70 mb-2">اختر الأيقونة</label>
      <div className="grid grid-cols-5 gap-2">
        {AVAILABLE_ICONS.map((icon) => (
          <motion.button
            key={icon.name}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(icon.name)}
            className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1 ${value === icon.name
              ? 'border-[#FFDD00] bg-[#FFDD00]/10 text-[#FFDD00]'
              : 'border-white/10 bg-gray-800/50 text-white/70 hover:border-white/30'
              }`}
          >
            <span className="text-2xl">
              {icon.name === 'leaf' && '🌿'}
              {icon.name === 'tree-pine' && '🌲'}
              {icon.name === 'droplets' && '💧'}
              {icon.name === 'scissors' && '✂️'}
              {icon.name === 'waves' && '🌊'}
              {icon.name === 'umbrella' && '☂️'}
              {icon.name === 'flower' && '🌸'}
              {icon.name === 'wrench' && '🔧'}
              {icon.name === 'hammer' && '🔨'}
              {icon.name === 'paint-bucket' && '🪣'}
            </span>
            <span className="text-xs truncate w-full text-center">{icon.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// Features Input Component (Dynamic Bullet Points)
function FeaturesInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const [newFeature, setNewFeature] = useState('');

  const addFeature = () => {
    if (newFeature.trim()) {
      onChange([...(value || []), newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const updated = [...(value || [])];
    updated.splice(index, 1);
    onChange(updated);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm text-white/70">{label}</label>

      {/* Existing features */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {(value || []).map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-2 border border-white/10"
            >
              <span className="text-green-500">•</span>
              <span className="flex-1 text-white text-sm">{feature}</span>
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeFeature(index)}
                className="text-red-400 hover:text-red-300 text-lg font-bold"
              >
                ×
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add new feature */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="أضف ميزة جديدة..."
          className="flex-1 bg-gray-800/50 border border-white/20 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#FFDD00] transition-all duration-200"
        />
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addFeature}
          disabled={!newFeature.trim()}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl text-sm font-medium hover:from-green-500 hover:to-green-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          إضافة
        </motion.button>
      </div>
    </div>
  );
}

// Enhanced Form Input Component
// Enhanced Form Input Component - RTL Optimized
function FormInput({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  ...props
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  [key: string]: any;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative group">
      <motion.label
        initial={false}
        animate={{
          y: focused || value ? -8 : 0,
          scale: focused || value ? 0.85 : 1,
          color: focused ? '#FFDD00' : 'rgba(255, 255, 255, 0.6)',
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute right-4 top-3 pointer-events-none origin-right select-none"
      >
        {label}
      </motion.label>
      <motion.input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        className={`w-full bg-gray-900/50 border rounded-xl px-4 pt-6 pb-2 text-white placeholder-transparent focus:outline-none transition-all duration-300 ${focused
          ? 'border-[#FFDD00] shadow-[0_0_20px_-5px_rgba(255,221,0,0.3)] bg-gray-900/80'
          : 'border-white/10 hover:border-white/20 bg-gray-900/30'
          }`}
        {...props}
      />
    </div>
  );
}

// Form Modal Component
function FormModal({
  type,
  data,
  onChange,
  onSave,
  onClose,
}: {
  type: string;
  data: any;
  onChange: (data: any) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111114] rounded-2xl border border-white/10 p-4 md:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex justify-between items-start mb-6 gap-4">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#FFDD00] to-[#FFE640] bg-clip-text text-transparent flex-1">
            {data._id ? 'تعديل' : 'إضافة جديد'}
          </h2>
          <motion.button
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl flex-shrink-0 transition-colors"
          >
            ×
          </motion.button>
        </div>

        <div className="space-y-4">
          {type === 'projects' && (
            <>
              <FormInput
                label="العنوان"
                value={data.title || ''}
                onChange={(value) => updateField('title', value)}
                required
              />
              <div>
                <label className="block text-sm text-white/70 mb-2">الوصف</label>
                <textarea
                  value={data.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={3}
                  className="w-full bg-gray-800/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFDD00] focus:shadow-lg focus:shadow-[#FFDD00]/20 transition-all duration-200"
                  required
                />
              </div>
              <ImageUploadField
                label="الصورة الرئيسية"
                value={data.image || ''}
                onChange={(fileId) => updateField('image', fileId)}
              />
              <GalleryImagesUpload
                label="صور المعرض"
                value={data.galleryImages || []}
                onChange={(images) => updateField('galleryImages', images)}
              />
              <FormInput
                label="التصنيف"
                value={data.category || ''}
                onChange={(value) => updateField('category', value)}
                required
              />
              <FormInput
                label="السنة"
                value={data.year || ''}
                onChange={(value) => updateField('year', value)}
                required
              />
              <FormInput
                label="الرابط (اختياري)"
                value={data.link || ''}
                onChange={(value) => updateField('link', value)}
              />
            </>
          )}

          {type === 'services' && (
            <>
              <FormInput
                label="عنوان الخدمة"
                value={data.title || ''}
                onChange={(value) => updateField('title', value)}
                required
              />
              <div>
                <label className="block text-sm text-white/70 mb-2">وصف الخدمة</label>
                <textarea
                  value={data.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={3}
                  className="w-full bg-gray-800/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFDD00] focus:shadow-lg focus:shadow-[#FFDD00]/20 transition-all duration-200"
                  required
                />
              </div>
              <IconSelector
                value={data.icon || 'leaf'}
                onChange={(value) => updateField('icon', value)}
              />
              <FeaturesInput
                label="مميزات الخدمة (النقاط)"
                value={data.features || []}
                onChange={(value) => updateField('features', value)}
              />
            </>
          )}

          {type === 'blogs' && (
            <>
              <FormInput
                label="عنوان المقال"
                value={data.title || ''}
                onChange={(value) => updateField('title', value)}
                required
              />
              <div>
                <label className="block text-sm text-white/70 mb-2">مقتطف المقال</label>
                <textarea
                  value={data.excerpt || ''}
                  onChange={(e) => updateField('excerpt', e.target.value)}
                  rows={2}
                  className="w-full bg-gray-800/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFDD00] focus:shadow-lg focus:shadow-[#FFDD00]/20 transition-all duration-200"
                  placeholder="وصف مختصر للمقال..."
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">محتوى المقال (يدعم HTML)</label>
                <textarea
                  value={data.content || ''}
                  onChange={(e) => updateField('content', e.target.value)}
                  rows={10}
                  className="w-full bg-gray-800/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFDD00] focus:shadow-lg focus:shadow-[#FFDD00]/20 transition-all duration-200 font-mono text-sm"
                  required
                />
              </div>
              <FormInput
                label="الكاتب"
                value={data.author || ''}
                onChange={(value) => updateField('author', value)}
                required
              />
              <ImageUploadField
                label="صورة الغلاف"
                value={data.image || ''}
                onChange={(fileId) => updateField('image', fileId)}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={data.featured || false}
                  onChange={(e) => updateField('featured', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                />
                <label htmlFor="featured" className="text-white">مقال مميز</label>
              </div>
              <div className="border-t border-white/10 pt-4 mt-4">
                <h3 className="text-lg font-semibold text-[#FFDD00] mb-4">SEO Settings</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 bg-gray-800/30 p-3 rounded-lg border border-white/5">
                    <input
                      type="checkbox"
                      id="autoSEO"
                      checked={data.autoSEO !== false}
                      onChange={(e) => updateField('autoSEO', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                    />
                    <label htmlFor="autoSEO" className="text-white text-sm">Auto-Generate SEO</label>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-800/30 p-3 rounded-lg border border-white/5">
                    <input
                      type="checkbox"
                      id="autoInternalLinks"
                      checked={data.autoInternalLinks !== false}
                      onChange={(e) => updateField('autoInternalLinks', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                    />
                    <label htmlFor="autoInternalLinks" className="text-white text-sm">Auto Internal Links</label>
                  </div>
                </div>

                {!data.autoSEO && (
                  <div className="space-y-3 pl-4 border-l-2 border-white/10">
                    <FormInput
                      label="Meta Title"
                      value={data.manualSEO?.title || data.metaTitle || ''}
                      onChange={(value) => updateField('manualSEO', { ...data.manualSEO, title: value })}
                    />
                    <div>
                      <label className="block text-sm text-white/70 mb-2">Meta Description</label>
                      <textarea
                        value={data.manualSEO?.description || data.metaDescription || ''}
                        onChange={(e) => updateField('manualSEO', { ...data.manualSEO, description: e.target.value })}
                        rows={3}
                        className="w-full bg-gray-800/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFDD00] focus:shadow-lg focus:shadow-[#FFDD00]/20 transition-all duration-200 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {
            type === 'testimonials' && (
              <>
                <FormInput
                  label="Name"
                  value={data.name || ''}
                  onChange={(value) => updateField('name', value)}
                  required
                />
                <FormInput
                  label="Company"
                  value={data.company || ''}
                  onChange={(value) => updateField('company', value)}
                  required
                />
                <FormInput
                  label="Location (optional)"
                  value={data.location || ''}
                  onChange={(value) => updateField('location', value)}
                />
                <div>
                  <label className="block text-sm text-white/70 mb-2">Rating</label>
                  <select
                    value={data.rating || 5}
                    onChange={(e) => updateField('rating', parseInt(e.target.value))}
                    className="w-full bg-gray-800/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFDD00] focus:shadow-lg focus:shadow-[#FFDD00]/20 transition-all duration-200"
                    required
                  >
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Text (English)</label>
                  <textarea
                    value={data.text || ''}
                    onChange={(e) => updateField('text', e.target.value)}
                    rows={4}
                    className="w-full bg-gray-800/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFDD00] focus:shadow-lg focus:shadow-[#FFDD00]/20 transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Text (Arabic) - Optional</label>
                  <textarea
                    value={data.textAr || ''}
                    onChange={(e) => updateField('textAr', e.target.value)}
                    rows={4}
                    className="w-full bg-gray-800/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFDD00] focus:shadow-lg focus:shadow-[#FFDD00]/20 transition-all duration-200"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={data.approved || false}
                    onChange={(e) => updateField('approved', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                  />
                  <label className="text-sm text-white/70">Approved</label>
                </div>
              </>
            )
          }

          {
            type === 'link-mappings' && (
              <>
                <FormInput
                  label="Keyword or Phrase"
                  value={data.keyword || ''}
                  onChange={(value) => updateField('keyword', value)}
                  required
                />
                <FormInput
                  label="Target URL (e.g., /services/concrete-cutting)"
                  value={data.url || ''}
                  onChange={(value) => updateField('url', value)}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Priority (Higher = First)"
                    type="number"
                    value={data.priority?.toString() || '0'}
                    onChange={(value) => updateField('priority', parseInt(value) || 0)}
                  />
                  <FormInput
                    label="Max Occurrences Per Post"
                    type="number"
                    value={data.maxOccurrences?.toString() || '1'}
                    onChange={(value) => updateField('maxOccurrences', parseInt(value) || 1)}
                  />
                </div>
                <FormInput
                  label="Description (Admin Only)"
                  value={data.description || ''}
                  onChange={(value) => updateField('description', value)}
                />
                <div className="flex gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={data.isActive !== false}
                      onChange={(e) => updateField('isActive', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                    />
                    <label htmlFor="isActive" className="text-white">Active</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="caseSensitive"
                      checked={data.caseSensitive || false}
                      onChange={(e) => updateField('caseSensitive', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                    />
                    <label htmlFor="caseSensitive" className="text-white">Case Sensitive</label>
                  </div>
                </div>
              </>
            )
          }

          {
            type === 'home-slides' && (
              <>
                <FormInput
                  label="العنوان"
                  value={data.title || ''}
                  onChange={(value) => updateField('title', value)}
                  required
                />
                <FormInput
                  label="العنوان الفرعي"
                  value={data.subtitle || ''}
                  onChange={(value) => updateField('subtitle', value)}
                  required
                />
                <ImageUploadField
                  label="الصورة"
                  value={data.image || ''}
                  onChange={(fileId) => updateField('image', fileId)}
                />
                <FormInput
                  label="الترتيب"
                  type="number"
                  value={data.order || 0}
                  onChange={(value) => updateField('order', parseInt(value))}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={data.isActive !== false}
                    onChange={(e) => updateField('isActive', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                  />
                  <label htmlFor="isActive" className="text-white">نشط</label>
                </div>
              </>
            )
          }

        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-6">
          <RippleButton
            onClick={onSave}
            className="flex-1 bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black px-6 py-3 rounded-xl font-semibold hover:from-[#FFE640] hover:to-[#FFDD00] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            حفظ
          </RippleButton>
          <RippleButton
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-500 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            إلغاء
          </RippleButton>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Blogs Section Component
function BlogsSection({
  blogs,
  onEdit,
  onDelete,
  onAddNew,
}: {
  blogs: Blog[];
  onEdit: (blog: any) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}) {
  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {blogs.map((blog, index) => (
          <motion.div
            key={blog._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="group bg-gradient-to-r from-gray-900/50 to-gray-900/30 rounded-xl p-4 border border-white/10 hover:border-[#FFDD00]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#FFDD00]/10"
          >
            <div className="flex-1 min-w-0 flex gap-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                <img
                  src={blog.image && !blog.image.startsWith('/') && !blog.image.startsWith('http') ? `/api/images/${blog.image}` : (blog.image || '/placeholder-blog.jpg')}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-white truncate group-hover:text-[#FFDD00] transition-colors">
                    {blog.title}
                  </h3>
                  {blog.featured && (
                    <span className="text-xs bg-[#FFDD00] text-black px-2 py-0.5 rounded-full font-bold">مميز</span>
                  )}
                </div>
                <p className="text-white/70 text-sm line-clamp-2 mb-2">{blog.excerpt}</p>
                <p className="text-white/50 text-xs">بواسطة {blog.author}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <RippleButton
                onClick={() => onEdit(blog)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-md hover:shadow-lg min-w-[70px]"
              >
                تعديل
              </RippleButton>
              <RippleButton
                onClick={() => onDelete(blog._id)}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg text-sm font-medium hover:from-red-500 hover:to-red-400 transition-all duration-200 shadow-md hover:shadow-lg min-w-[70px]"
              >
                حذف
              </RippleButton>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: blogs.length * 0.03 }}
        className="pt-4 border-t border-white/10"
      >
        <RippleButton
          onClick={onAddNew}
          className="w-full bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-[#FFDD00]/30 transition-all duration-200"
        >
          إضافة مقال جديد
        </RippleButton>
      </motion.div>
    </div>
  );
}
