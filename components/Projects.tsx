'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import RotatingButton from '@/components/RotatingButton';
import { getImageUrl } from '@/lib/imageUtils';
import SkeletonLoader from '@/components/SkeletonLoader';

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
  year: string;
  link?: string;
  featured: boolean;
}

// Arabic category names for filtering
const categories = [
  { id: 'all', name: 'الكل' },
  { id: 'تصميم حدائق', name: 'تصميم حدائق' },
  { id: 'ثيل طبيعي', name: 'ثيل طبيعي' },
  { id: 'عشب صناعي', name: 'عشب صناعي' },
  { id: 'شبكات ري', name: 'شبكات ري' },
  { id: 'شلالات ونوافير', name: 'شلالات ونوافير' },
  { id: 'مظلات وسواتر', name: 'مظلات وسواتر' },
] as const;
type CategoryId = typeof categories[number]['id'];

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') {
      return projects;
    }
    return projects.filter((project) => project.category === selectedCategory);
  }, [selectedCategory, projects]);

  return (
    <main className="min-h-screen bg-black text-white pt-20">
      {/* Hero/Intro Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-10 overflow-hidden safe-area-left safe-area-right">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
        <div className="relative z-10 max-w-[min(1400px,95vw)] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="w-12 h-px bg-white/80 mb-4" />
            <h4 className="text-sm md:text-base font-semibold text-white/85 uppercase tracking-wider mb-8">
              أحدث مشاريعنا
            </h4>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[clamp(2rem,7vw,4.375rem)] font-bold mb-4 sm:mb-5 md:mb-6 text-overflow-safe"
          >
            معرض أعمالنا
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base sm:text-lg text-white/85 max-w-[min(48rem,90vw)] text-overflow-safe"
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)' }}
          >
            استعرض مجموعة من أفضل مشاريعنا المنفذة بأعلى معايير الجودة والإبداع
          </motion.p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-6 sm:py-8 px-4 sm:px-6 md:px-8 lg:px-10 bg-black border-y border-white/20 safe-area-left safe-area-right">
        <div className="max-w-[min(1400px,95vw)] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {categories.map((category) => (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <RotatingButton
                  text={category.name}
                  width={140}
                  height={48}
                  borderRadius={24}
                  fontSize={16}
                  fontWeight={600}
                  letterSpacing={0}
                  isActive={selectedCategory === category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  useGradient={true}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-10 bg-black safe-area-left safe-area-right">
        <div className="max-w-[min(1400px,95vw)] mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonLoader variant="project" count={6} />
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="wait">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{
                      y: -8,
                      scale: 1.02,
                      borderColor: 'rgba(255, 221, 0, 0.5)',
                      boxShadow: '0 20px 40px rgba(255, 221, 0, 0.2)'
                    }}
                    className="group relative bg-[#111114] rounded-3xl overflow-hidden border border-white/30 transition-all duration-300 ease-out flex flex-col cursor-default"
                  >
                    {/* Project Image */}
                    <div className="relative w-full h-64 overflow-hidden">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full h-full"
                      >
                        <Image
                          src={getImageUrl(project.image)}
                          alt={project.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-all duration-500"
                        />
                      </motion.div>
                      {/* Year Badge */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 + 0.2 }}
                        whileHover={{ scale: 1.1 }}
                        className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-transform duration-300 z-10"
                      >
                        {project.year}
                      </motion.div>
                    </div>

                    {/* Project Info */}
                    <div className="p-6 flex-1 flex flex-col">
                      <motion.h3
                        className="text-xl font-bold text-white mb-2 line-clamp-1 transition-colors duration-300"
                        whileHover={{ color: '#FFDD00' }}
                      >
                        {project.title}
                      </motion.h3>
                      <p className="text-sm text-white/85 mb-4 line-clamp-2 flex-1 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag, tagIndex) => (
                          <motion.span
                            key={tagIndex}
                            whileHover={{
                              scale: 1.1,
                              backgroundColor: 'rgba(255, 221, 0, 0.1)',
                              borderColor: 'rgba(255, 221, 0, 0.3)',
                              color: '#FFDD00'
                            }}
                            transition={{ duration: 0.2 }}
                            className="px-3 py-1 bg-gray-800/60 text-white/85 text-xs font-semibold rounded-full uppercase tracking-wider border border-white/20 transition-all duration-200 cursor-default"
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>

                      {/* Action Button */}
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Link
                          href={`/projects/${project._id}`}
                          className="group w-full bg-[#FFDD00] hover:bg-[#e6c700] text-black px-6 py-3 rounded-xl font-semibold text-sm uppercase transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <span>استكشف</span>
                          <motion.svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.2 }}
                          >
                            <path
                              d="M6 12L10 8L6 4"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </motion.svg>
                        </Link>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-white/85 mb-6">
                لا توجد مشاريع في هذه الفئة حالياً
              </p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="bg-[#FFDD00] hover:bg-[#e6c700] text-black px-6 py-3 rounded-xl font-semibold uppercase transition-colors"
              >
                عرض كل المشاريع
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
