'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PLACEHOLDER_KEYS, resolvePageAssetImage } from '@/lib/pageAssets';

interface Project {
  _id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  image: string;
  galleryImages?: string[];
  tags: string[];
  tagsAr: string[];
  category: string;
  categoryAr: string;
  year: string;
  link?: string;
  featured: boolean;
}

const Portfolio = () => {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectPlaceholder, setProjectPlaceholder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const [projectsRes, placeholdersRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/page-assets?page=global&section=placeholders'),
        ]);
        if (!projectsRes.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await projectsRes.json();
        setProjects(data);

        if (placeholdersRes.ok) {
          const placeholders = await placeholdersRes.json();
          setProjectPlaceholder(resolvePageAssetImage(placeholders, PLACEHOLDER_KEYS.portfolio));
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(isRTL ? 'فشل في تحميل المشاريع' : 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [isRTL]);

  // Extract unique categories from projects
  const categories = [
    { id: 'all', name: isRTL ? 'جميع الأعمال' : 'All Projects', nameAr: 'جميع الأعمال' },
    ...Array.from(new Set(projects.map(p => p.category))).map(cat => {
      const project = projects.find(p => p.category === cat);
      return {
        id: cat,
        name: isRTL ? (project?.categoryAr || cat) : cat,
        nameAr: project?.categoryAr || cat
      };
    })
  ];

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  const openModal = (project: Project) => {
    setSelectedImage(project);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (!selectedImage) return;
    const currentIndex = filteredProjects.findIndex(p => p._id === selectedImage._id);
    const nextIndex = (currentIndex + 1) % filteredProjects.length;
    setSelectedImage(filteredProjects[nextIndex]);
  };

  const prevImage = () => {
    if (!selectedImage) return;
    const currentIndex = filteredProjects.findIndex(p => p._id === selectedImage._id);
    const prevIndex = (currentIndex - 1 + filteredProjects.length) % filteredProjects.length;
    setSelectedImage(filteredProjects[prevIndex]);
  };

  // Helper function to get image URL (supports GridFS)
  const getImageUrl = (imageId?: string | null) => {
    if (!imageId) return '';
    // If it's already a URL, return as is
    if (imageId.startsWith('http://') || imageId.startsWith('https://') || imageId.startsWith('/')) {
      return imageId;
    }
    // Otherwise, assume it's a GridFS ID
    return `/api/images/${imageId}`;
  };

  if (loading) {
    return (
      <section id="portfolio" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="portfolio" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section id="portfolio" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {isRTL ? 'معرض الأعمال' : 'Portfolio'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {isRTL ? 'لا توجد مشاريع حالياً' : 'No projects available'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-20 bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {isRTL ? 'معرض الأعمال' : 'Portfolio'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {isRTL
              ? 'استعرض مجموعة من أفضل مشاريعنا المنفذة بأعلى معايير الجودة والإبداع'
              : 'Browse our best projects executed with the highest standards of quality and creativity'}
          </p>
        </div>

        {/* Filter Buttons */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${selectedCategory === category.id
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const projectImageSrc = getImageUrl(project.image) || projectPlaceholder || '';
            return (
            <div
              key={project._id}
              className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              onClick={() => openModal(project)}
            >
              <div className="relative overflow-hidden">
                {projectImageSrc ? (
                  <img
                    src={projectImageSrc}
                    alt={isRTL ? project.titleAr : project.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      if (!projectPlaceholder) {
                        return;
                      }
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = projectPlaceholder;
                    }}
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className={`absolute bottom-4 ${isRTL ? 'right-4 left-4' : 'left-4 right-4'} text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                  <h3 className="text-lg font-bold mb-1">
                    {isRTL ? project.titleAr : project.title}
                  </h3>
                  <p className="text-sm text-gray-200">
                    {isRTL ? project.descriptionAr : project.description}
                  </p>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={closeModal}
                className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} text-white hover:text-gray-300 z-10`}
              >
                <X className="w-8 h-8" />
              </button>

              <button
                onClick={isRTL ? nextImage : prevImage}
                className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10`}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <button
                onClick={isRTL ? prevImage : nextImage}
                className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10`}
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              {(getImageUrl(selectedImage.image) || projectPlaceholder) ? (
                <img
                  src={getImageUrl(selectedImage.image) || projectPlaceholder || ''}
                  alt={isRTL ? selectedImage.titleAr : selectedImage.title}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  onError={(e) => {
                    if (!projectPlaceholder) {
                      return;
                    }
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = projectPlaceholder;
                  }}
                />
              ) : (
                <div className="w-[90vw] h-[60vh] bg-gray-200 rounded-lg" />
              )}

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-6 rounded-b-lg">
                <h3 className="text-2xl font-bold mb-2">
                  {isRTL ? selectedImage.titleAr : selectedImage.title}
                </h3>
                <p className="text-gray-200">
                  {isRTL ? selectedImage.descriptionAr : selectedImage.description}
                </p>
                {(isRTL ? selectedImage.tagsAr : selectedImage.tags)?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {(isRTL ? selectedImage.tagsAr : selectedImage.tags).map((tag, idx) => (
                      <span key={idx} className="bg-green-600/80 px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
