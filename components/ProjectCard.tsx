
import React from 'react';

interface ProjectCardProps {
  title: string;
  desc: string;
  imgUrl: string;
  delay: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ title, desc, imgUrl, delay }) => (
  <div className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-gray-200/50">
    <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
      <img 
        src={imgUrl} 
        alt={title} 
        className="w-full h-full object-cover animate-float-slow transition-transform duration-700 group-hover:scale-105"
        style={{ animationDelay: `${delay}s` }}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
    </div>
    <div className="p-6">
      <h3 className="text-lg font-bold text-charcoal mb-2 group-hover:text-cobalt transition-colors">{title}</h3>
      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{desc}</p>
    </div>
  </div>
);
