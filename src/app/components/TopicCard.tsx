'use client';
 
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
 
interface TopicCardProps {
  title: string;
  icon: React.ReactNode;
  gradient: string;
  description: string;
  delay?: number;
  bgColor: string;
  hoverBgColor: string;
  textColor: string;
  borderColor: string;
}
 
export default function TopicCard({
  title,
  icon,
  gradient,
  description,
  delay = 0,
  bgColor,
  hoverBgColor,
  textColor,
  borderColor
}: TopicCardProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
 
  useEffect(() => {
    setHasAnimated(true);
  }, []);
 
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      role="button"
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      className={`group cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400
        ${isHovered ? 'shadow-2xl shadow-white/30' : 'hover:shadow-xl'}`}
      style={{
        background: isHovered ? hoverBgColor : bgColor,
        borderColor: borderColor,
        color: textColor
      }}
      aria-label={`Explore ${title} course`}
    >
      <div className="relative z-10">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 mx-auto transform transition-all duration-300 shadow-2xl
          ${isHovered ? 'scale-110 rotate-6' : 'group-hover:scale-105'}`}
          style={{
            background: `linear-gradient(135deg, ${gradient.split(' ')[1]} 0%, ${gradient.split(' ')[3]} 100%)`,
            boxShadow: isHovered
              ? `0 0 30px ${gradient.split(' ')[1]}, 0 0 60px ${gradient.split(' ')[3]}`
              : `0 0 15px ${gradient.split(' ')[1]}80`
          }}
        >
          <div
            className="transition-all duration-300"
            style={{
              filter: isHovered ? 'brightness(1.8) saturate(1.5)' : 'brightness(1.5) saturate(1.3)',
              transform: isHovered ? 'scale(1.2)' : 'scale(1)'
            }}
          >
            {icon}
          </div>
        </div>
       
        <h3 className="text-lg font-bold text-center mb-2 transition-all duration-300"
          style={{
            textShadow: isHovered ? `0 0 10px ${gradient.split(' ')[1]}80` : 'none'
          }}>
          {title}
        </h3>
       
        <p className="text-sm text-center opacity-90 font-medium">
          {description}
        </p>
       
        <div className="mt-4 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 transform origin-left
            ${isHovered ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}
            style={{
              background: `linear-gradient(to right, ${gradient.split(' ')[1]}, ${gradient.split(' ')[3]})`,
              boxShadow: `0 0 10px ${gradient.split(' ')[1]}`
            }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
}