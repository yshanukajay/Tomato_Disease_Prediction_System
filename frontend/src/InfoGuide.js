import React from 'react';
import { motion } from 'framer-motion';
import { Camera, UploadCloud, Cpu, Award } from 'lucide-react';

const steps = [
  {
    icon: Camera,
    title: 'Capture Image',
    description: 'Take a clear, close-up photograph of the affected tomato leaf under good lighting conditions.',
  },
  {
    icon: UploadCloud,
    title: 'Upload Photo',
    description: 'Drag and drop your image directly onto our secure dashboard analyzer or browse local storage.',
  },
  {
    icon: Cpu,
    title: 'AI Analysis',
    description: 'Our proprietary deep learning neural network scans the image for visual signs of pathogens.',
  },
  {
    icon: Award,
    title: 'Receive Diagnosis',
    description: 'View an instant prediction breakdown with severity tags, symptoms, and treatment plans.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export const InfoGuide = () => {
  return (
    <div id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-base text-brand-600 font-bold tracking-wide uppercase mb-3">Simple Process</h2>
          <p className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
            How It Works
          </p>
          <div className="h-1 w-20 bg-brand-500 mx-auto mt-4 rounded-full" />
          <p className="text-slate-500 mt-4 leading-relaxed">
            Diagnose plant disease in four easy steps using our modern, cloud-based platform.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 relative"
        >
          {/* Connecting Line for Desktop */}
          <div className="hidden md:block absolute top-1/2 left-[12.5%] right-[12.5%] h-0.5 bg-slate-100 -translate-y-8 z-0" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className="relative bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-card-hover transition-all z-10 flex flex-col items-center text-center group hover:-translate-y-1"
              >
                {/* Step Indicator */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center border-4 border-white shadow-sm group-hover:bg-brand-600 group-hover:scale-110 transition-all">
                  {index + 1}
                </div>

                <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 mb-6 shadow-sm group-hover:bg-brand-500 group-hover:text-white transition-all duration-300 mt-2">
                  <Icon className="w-8 h-8" />
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2 font-display">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default InfoGuide;
