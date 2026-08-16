import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FileImage,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Shield,
  Zap,
  Layers,
  Heart,
  HelpCircle,
  ChevronRight,
  BookOpen,
  Info,
  Download,
  Flame,
  MousePointer,
  Sparkles
} from 'lucide-react';
import { InfoGuide } from './InfoGuide';
import { Footer } from './Footer';

// Disease details mapped with SaaS style descriptions
const DISEASE_DETAILS = {
  Tomato_Bacterial_spot: {
    name: 'Bacterial Spot',
    severity: 'critical',
    severityText: 'Action Required',
    icon: '🦠',
    description: 'Caused by Xanthomonas bacteria. Causes lesions on foliage and blemishes on fruit, greatly reducing yield.',
    symptoms: 'Small, dark green, greasy spots on leaf margins. Spots turn blackish-brown and develop a distinct yellow halo.',
    treatment: 'Apply copper-based bactericides immediately. Prune and destroy lower diseased branches to reduce soil-splash spread.',
    prevention: 'Avoid overhead watering. Maintain excellent ventilation. Rotate crops with non-solanaceous plants annually.',
    comparison: 'Bacterial spot lesions are smaller and more greasy-looking compared to the concentric target-like rings of Early Blight.',
  },
  Tomato_Early_blight: {
    name: 'Early Blight',
    severity: 'high',
    severityText: 'High Severity',
    icon: '🍂',
    description: 'A common fungal infection caused by Alternaria solani. Flourishes in warm, damp weather conditions.',
    symptoms: 'Concentric target-like rings on older leaves. Leaves yellow and eventually die from the bottom of the plant upwards.',
    treatment: 'Apply fungicides containing chlorothalonil, copper, or mancozeb. Strip lower infected leaves early.',
    prevention: 'Apply thick organic mulch to limit spore splash-back. Water plants at the base. Space plants sufficiently.',
    comparison: 'Unlike Late Blight which causes greasy dark water-soaked spots, Early Blight is defined by dark, dry concentric rings.',
  },
  Tomato_Late_blight: {
    name: 'Late Blight',
    severity: 'critical',
    severityText: 'Critical Threat',
    icon: '⚠️',
    description: 'Caused by Phytophthora infestans. An extremely aggressive pathogen capable of destroying whole fields within days.',
    symptoms: 'Dark brown, water-soaked oily spots on leaves. Fine white fungal fuzz appears on the lower leaf surface in humid air.',
    treatment: 'Fungicides are only effective as a preventive measure. Once established, immediately bag and destroy infected plants.',
    prevention: 'Use certified disease-free seeds. Choose blight-resistant cultivars. Avoid wet leaves overnight.',
    comparison: 'Late Blight is much faster-killing than Early Blight and causes large, dark greasy lesions rather than concentric rings.',
  },
  Tomato_Leaf_Mold: {
    name: 'Leaf Mold',
    severity: 'medium',
    severityText: 'Moderate Risk',
    icon: '🌫️',
    description: 'Fungal infection caused by Passalora fulva. Typically impacts indoor, greenhouse, or high-tunnel crops.',
    symptoms: 'Pale green or yellowish spots on leaf tops; olive-green, velvety mold growth on the corresponding undersides.',
    treatment: 'Spray copper-based fungicides if humidity cannot be managed. Strip lower leaves to encourage dry air flow.',
    prevention: 'Keep greenhouse relative humidity below 85%. Ensure adequate horizontal ventilation using fans.',
    comparison: 'Leaf mold produces yellow spots on top with a velvet-colored growth underneath, distinguishing it from general blights.',
  },
  Tomato__Target_Spot: {
    name: 'Target Spot',
    severity: 'high',
    severityText: 'High Severity',
    icon: '🎯',
    description: 'Fungal disease caused by Corynespora cassiicola. Thrives in warm, highly humid agricultural conditions.',
    symptoms: 'Zonate circular lesions resembling a target. Spots occur on leaves, stems, and eventually raw or ripe fruit.',
    treatment: 'Apply preventive or curative fungicides like azoxystrobin. Prune lower foliage to reduce relative humidity.',
    prevention: 'Remove crop debris post-harvest. Maximize sunshine penetration by pruning weeds and suckers.',
    comparison: 'Target spot lesions look similar to Early Blight but typically do not cause the quick, generalized yellowing of leaves.',
  },
  Tomato_healthy: {
    name: 'Healthy Tomato Leaf',
    severity: 'healthy',
    severityText: 'Optimum Health',
    icon: '✅',
    description: 'No pathogen detected. The leaf exhibits optimal photosynthesis capabilities and uniform structure.',
    symptoms: 'Clean green color, crisp structure, no lesions, fungal dust, or pest stippling.',
    treatment: 'No treatment required. Maintain standard watering and trace mineral fertilization schedules.',
    prevention: 'Continue daily visual scouting. Spray organic neem oil preventatively if surrounding foliage is infected.',
    comparison: 'Exhibits complete absence of necrotic margins, yellow halo borders, or dusty surface spores.',
  },
};

const SEVERITY_STYLES = {
  critical: { text: 'text-rose-600 bg-rose-50 border-rose-200', bar: 'bg-rose-500' },
  high:     { text: 'text-orange-600 bg-orange-50 border-orange-200', bar: 'bg-orange-500' },
  medium:   { text: 'text-yellow-600 bg-yellow-50 border-yellow-200', bar: 'bg-yellow-500' },
  healthy:  { text: 'text-emerald-600 bg-emerald-50 border-emerald-200', bar: 'bg-emerald-500' },
};

export const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = () => {
    setIsDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file) => {
    setData(null);
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  useEffect(() => {
    if (!preview) return;

    const analyzeImage = async () => {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await axios.post(
          process.env.REACT_APP_API_URL || 'http://localhost:8000/predict',
          formData
        );
        if (response.status === 200) {
          setData(response.response || response.data);
        }
      } catch (error) {
        console.error('Error analyzing image:', error);
      } finally {
        setIsLoading(false);
      }
    };

    analyzeImage();
  }, [preview]); // eslint-disable-line

  const triggerSelectFile = () => {
    fileInputRef.current.click();
  };

  const clearUpload = () => {
    setSelectedFile(null);
    setPreview(null);
    setData(null);
  };

  const downloadReport = () => {
    if (!data) return;
    const diseaseName = DISEASE_DETAILS[data.class]?.name || data.class;
    const content = `TomoVision Diagnostic Report\nDate: ${new Date().toLocaleDateString()}\nDiagnosed Disease: ${diseaseName}\nConfidence: ${(parseFloat(data.confidence) * 100).toFixed(2)}%\nSeverity: ${DISEASE_DETAILS[data.class]?.severityText}\n\nRecommended Actions:\n${DISEASE_DETAILS[data.class]?.treatment}\n\nPrevention Plan:\n${DISEASE_DETAILS[data.class]?.prevention}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TomoVision-Report-${diseaseName.replace(/\s+/g, '-')}.txt`;
    link.click();
  };

  // Safe prediction confidence checks
  const confidencePercent = data ? (parseFloat(data.confidence) * 100).toFixed(1) : 0;
  const currentDisease = data ? (DISEASE_DETAILS[data.class] || {
    name: data.class,
    severity: 'medium',
    severityText: 'Diagnosed',
    icon: '🍃',
    description: 'Pathogen detected.',
    symptoms: 'Not specified.',
    treatment: 'Inspect plant.',
    prevention: 'Clean greenhouse tools.',
    comparison: 'Compare with typical blights.'
  }) : null;
  const severity = currentDisease ? currentDisease.severity : 'healthy';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-brand-500 selection:text-white">
      {/* ── STICKY NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🍅</span>
            <div className="leading-tight">
              <span className="block text-slate-900 font-display font-extrabold text-lg tracking-tight">TomoVision</span>
              <span className="block text-[10px] text-brand-600 font-bold uppercase tracking-wider">Precision AgriTech</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-brand-600 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-brand-600 transition-colors">Features</a>
            <a href="#library" className="hover:text-brand-600 transition-colors">Disease Library</a>
            <a href="#about" className="hover:text-brand-600 transition-colors">About</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-xs font-semibold text-brand-700">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              SaaS Engine Live
            </div>
            <a
              href="#demo"
              className="hidden sm:inline-flex items-center justify-center px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-xs font-bold text-white shadow-lg shadow-brand-600/20 transition-all hover:scale-[1.02]"
            >
              Launch Analyzer
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden pt-20 pb-32 bg-slate-900 text-white">
        {/* Farm Background Image with custom overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center mix-blend-overlay opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/60 to-slate-900" />
        
        {/* Floating background gradient light */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-brand-300 tracking-wide mb-6"
          >
            <Sparkles className="w-4 h-4 text-lime-400" /> Deep Learning Crop Diagnostics
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.05]"
          >
            AI-Powered <span className="bg-gradient-to-r from-brand-400 via-brand-300 to-lime-300 bg-clip-text text-transparent">Tomato Disease Detection</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-350 max-w-2xl mx-auto mt-6 leading-relaxed"
          >
            Instantly identify tomato leaf pathogens using advanced computer vision models. Get immediate diagnosis and customized treatment recommendations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <a
              href="#demo"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 font-bold text-sm text-white shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.02]"
            >
              Get Started Free <ChevronRight className="w-4 h-4" />
            </a>
            <a
              href="#library"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 font-bold text-sm text-white border border-slate-700/80 transition-colors"
            >
              Browse Pathogens
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="-mt-16 relative z-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Diagnostic Accuracy', value: '95%+', desc: 'Validated on crop datasets' },
            { label: 'Response Time', value: '<2s', desc: 'Accelerated cloud inference' },
            { label: 'Detectable Pathogens', value: '6 Types', desc: 'Blights, spots, molds' },
            { icon: '🌿', value: 'Precision', desc: 'Precision agriculture SaaS' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all"
            >
              <div className="text-3xl font-display font-extrabold text-slate-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-slate-800 mb-1">{stat.label}</div>
              <div className="text-xs text-slate-500">{stat.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── DEMO / UPLOAD CENTERPIECE ── */}
      <section id="demo" className="py-24 max-w-7xl mx-auto px-6 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-base text-brand-600 font-bold tracking-wide uppercase mb-3">Live Interactive Analyzer</h2>
          <p className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
            Diagnose Leaf Health Instantly
          </p>
          <p className="text-slate-500 mt-3">
            Upload or drag-and-drop a leaf image. Our neural network will classify it and output a complete treatment report.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-premium">
          {/* Card Header */}
          <div className="bg-slate-50 px-8 py-5 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-50 border border-brand-100 text-brand-600">
                🚀
              </span>
              <div>
                <span className="block font-semibold text-sm text-slate-800 leading-none">Diagnostic Console</span>
                <span className="block text-[11px] text-slate-500 mt-1">Status: Ready</span>
              </div>
            </div>
            
            {selectedFile && (
              <button
                onClick={clearUpload}
                className="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 transition-colors"
              >
                Clear Image
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* LEFT SIDE: Image Selection & Scanning */}
            <div className="p-8 border-r border-slate-200/60 flex flex-col justify-center min-h-[380px]">
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                accept="image/*"
                className="hidden"
              />

              {!selectedFile ? (
                <div
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  onClick={triggerSelectFile}
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all duration-300 min-h-[280px] ${
                    isDragActive
                      ? 'border-brand-500 bg-brand-50/40 shadow-glow-sm'
                      : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 mb-4 shadow-sm">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">Upload Tomato Leaf</h3>
                  <p className="text-xs text-slate-500 text-center max-w-[200px] leading-relaxed">
                    Drag and drop file here, or click to browse
                  </p>
                  
                  <div className="mt-6 flex gap-2">
                    <span className="px-2 py-1 bg-slate-200/80 rounded text-[10px] font-semibold text-slate-600">JPG</span>
                    <span className="px-2 py-1 bg-slate-200/80 rounded text-[10px] font-semibold text-slate-600">PNG</span>
                    <span className="px-2 py-1 bg-slate-200/80 rounded text-[10px] font-semibold text-slate-600">WEBP</span>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden shadow-inner bg-slate-900 border border-slate-800 flex items-center justify-center h-full min-h-[280px]">
                  <img
                    src={preview}
                    alt="Upload Preview"
                    className="max-h-[300px] object-contain w-full"
                  />
                  {isLoading && (
                    <>
                      {/* Scanning animation overlay */}
                      <div className="absolute inset-0 bg-brand-500/10 pointer-events-none" />
                      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-400 to-transparent shadow-[0_0_20px_#22c55e] scan-line" />
                    </>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT SIDE: Diagnostic Output / Waiting state */}
            <div className="p-8 bg-slate-50/60 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {!selectedFile && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <div className="text-4xl mb-4">🩺</div>
                    <h3 className="font-bold text-slate-800 text-sm mb-1">Awaiting Leaf Upload</h3>
                    <p className="text-xs text-slate-500 max-w-[260px] mx-auto leading-relaxed">
                      Upload an image on the left. The crop analyzer will automatically run model inference.
                    </p>
                  </motion.div>
                )}

                {isLoading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-brand-500 animate-spin" />
                      <span className="font-semibold text-sm text-slate-800">Processing diagnosis...</span>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        'Analyzing leaf vein patterns...',
                        'Calculating classification weights...',
                        'Retrieving pathogen treatment records...'
                      ].map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-500">
                          <CheckCircle className="w-3.5 h-3.5 text-brand-500" />
                          {step}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {data && !isLoading && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Severity Indicator Banner */}
                    <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${SEVERITY_STYLES[severity]?.text}`}>
                      <span className="text-2xl">{currentDisease.icon}</span>
                      <div>
                        <div className="font-bold text-sm text-slate-900 leading-tight">{currentDisease.name}</div>
                        <div className="text-[11px] font-bold uppercase tracking-wider mt-0.5">{currentDisease.severityText}</div>
                      </div>
                    </div>

                    {/* Confidence Meter */}
                    <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-center text-xs mb-1.5 font-bold tracking-tight">
                        <span className="text-slate-500">Model Confidence</span>
                        <span className="text-slate-900">{confidencePercent}%</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${SEVERITY_STYLES[severity]?.bar}`}
                          style={{ width: `${confidencePercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick Treatment Summary */}
                    <div className="space-y-4 text-xs">
                      <div className="p-3 bg-white border border-slate-200/60 rounded-xl">
                        <div className="font-bold text-slate-900 mb-1 uppercase tracking-wider text-[10px] text-brand-600">Recommended Treatment</div>
                        <p className="text-slate-600 leading-relaxed font-medium">{currentDisease.treatment}</p>
                      </div>
                      <div className="p-3 bg-white border border-slate-200/60 rounded-xl">
                        <div className="font-bold text-slate-900 mb-1 uppercase tracking-wider text-[10px] text-lime-600">Prevention Plan</div>
                        <p className="text-slate-600 leading-relaxed font-medium">{currentDisease.prevention}</p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={downloadReport}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 font-bold text-xs text-white transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Download Report
                      </button>
                      <button
                        onClick={clearUpload}
                        className="inline-flex items-center justify-center w-12 h-12 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors text-slate-500"
                        title="Analyze Another"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <InfoGuide />

      {/* ── CORE FEATURES ── */}
      <section id="features" className="py-24 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-base text-brand-600 font-bold tracking-wide uppercase mb-3">Core Capabilities</h2>
            <p className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
              Enterprise Crop Intelligence
            </p>
            <div className="h-1 w-20 bg-brand-500 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Layers,
                title: 'Deep Learning Classifier',
                desc: 'Utilizes a fine-tuned EfficientNet-B0 backbone capable of extracting precise pathological features from foliage photos.'
              },
              {
                icon: Zap,
                title: 'Sub-Second Inference',
                desc: 'Diagnostic predictions are generated in milliseconds, providing instant agricultural support right in the greenhouse.'
              },
              {
                icon: Shield,
                title: 'Actionable Ag-Advice',
                desc: 'Every diagnosis comes with step-by-step organic/chemical treatment options and robust long-term prevention guidelines.'
              },
              {
                icon: AlertTriangle,
                title: 'Blight Severity Tags',
                desc: 'Identifies critical threats immediately to warn growers and help contain early infection vectors.'
              },
              {
                icon: Heart,
                title: 'High Dataset Integrity',
                desc: 'Trained on verified agricultural plant pathology datasets, minimizing false positive Healthy classifications.'
              },
              {
                icon: BookOpen,
                title: 'Developer Friendly API',
                desc: 'Engineered as a clean microservice backend that integrates easily into existing IoT field hardware.'
              }
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 mb-5 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 font-display">{feat.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PATHOGEN LIBRARY ── */}
      <section id="library" className="py-24 bg-white border-t border-slate-200/60 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-base text-brand-600 font-bold tracking-wide uppercase mb-3">Pathogen Library</h2>
            <p className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
              Foliage Pathogen Library
            </p>
            <div className="h-1 w-20 bg-brand-500 mx-auto mt-4 rounded-full" />
            <p className="text-slate-500 mt-4 leading-relaxed">
              Explore the detailed descriptions and symptoms of tomato leaf conditions supported by our AI model.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(DISEASE_DETAILS).map(([key, item]) => (
              <div
                key={key}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                {/* Pathogen Header */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 font-display text-base leading-tight">{item.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${SEVERITY_STYLES[item.severity]?.bar}`} />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.severityText}</span>
                    </div>
                  </div>
                </div>

                {/* Pathogen Details */}
                <div className="p-6 space-y-4 text-xs">
                  <div>
                    <span className="block font-bold text-[10px] text-brand-600 uppercase tracking-wider mb-1">Diagnostic Info</span>
                    <p className="text-slate-600 leading-relaxed font-medium">{item.description}</p>
                  </div>
                  
                  <div>
                    <span className="block font-bold text-[10px] text-slate-500 uppercase tracking-wider mb-1">Key Symptoms</span>
                    <p className="text-slate-600 leading-relaxed font-medium">{item.symptoms}</p>
                  </div>

                  <div>
                    <span className="block font-bold text-[10px] text-lime-600 uppercase tracking-wider mb-1">Similar Diseases</span>
                    <p className="text-slate-600 leading-relaxed font-medium">{item.comparison}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT SECTION ── */}
      <section id="about" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Background visual decorations */}
        <div className="absolute top-1/2 left-10 w-96 h-96 bg-brand-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-lime-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-8">
          <h2 className="text-base text-brand-400 font-bold tracking-wide uppercase">Enterprise Standard Diagnostic Service</h2>
          <p className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight">
            Accelerating Precision Agriculture with Computer Vision
          </p>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto font-medium">
            TomoVision provides growers, greenhouse managers, and agricultural researchers with immediate leaf pathogen identification. By deploying deep convolutional neural networks directly to our API gateway, we facilitate high-accuracy diagnosis without requiring complex, expensive field equipment.
          </p>
          <div className="flex justify-center gap-6 text-sm font-semibold text-slate-400 pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-brand-400" /> Fully Responsive UI
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-brand-400" /> API Access Keys
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-brand-400" /> Diagnostic Logs
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
};

export default ImageUpload;
