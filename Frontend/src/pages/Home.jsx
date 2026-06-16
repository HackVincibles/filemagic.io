/**
 * Purpose: Beautiful marketing landing page for FileMagic
 */
import { Link } from 'react-router-dom';
import FileHero3D from '../components/FileHero3D';
import {
  FiFile, FiFolder, FiCompass, FiTrendingUp, FiShield,
  FiZap, FiDownload, FiFileText, FiImage, FiMusic,
  FiArchive, FiLock, FiArrowRight, FiStar, FiCheckCircle
} from 'react-icons/fi';

const tools = [
  {
    title: 'Compress Files',
    description: 'Reduce file sizes by up to 90% with our custom compression algorithms.',
    icon: FiArchive,
    color: 'from-primary-500 to-primary-600',
    href: '/upload?op=COMPRESS',
    tag: 'Popular'
  },
  {
    title: 'Decompress Files',
    description: 'Restore your compressed files to their original quality with zero loss.',
    icon: FiDownload,
    color: 'from-indigo-500 to-blue-600',
    href: '/upload?op=DECOMPRESS',
    tag: 'Lossless'
  },
  {
    title: 'Convert Text',
    description: 'Convert between different text formats and encodings seamlessly.',
    icon: FiFileText,
    color: 'from-accent-500 to-pink-600',
    href: '/upload?op=CONVERT',
    tag: 'Text'
  },
  {
    title: 'Image Compression',
    description: 'Optimize images for web without losing visual quality.',
    icon: FiImage,
    color: 'from-orange-500 to-amber-600',
    href: '/upload?op=COMPRESS',
    tag: 'Images'
  },
  {
    title: 'Audio Processing',
    description: 'Compress and optimize audio files for storage and streaming.',
    icon: FiMusic,
    color: 'from-rose-500 to-red-600',
    href: '/upload?op=COMPRESS',
    tag: 'Audio'
  },
  {
    title: 'Batch Processing',
    description: 'Process multiple files at once with our premium plans.',
    icon: FiFolder,
    color: 'from-cyan-500 to-teal-600',
    href: '/pricing',
    tag: 'Premium'
  },
];

const features = [
  {
    title: 'Lightning Fast',
    description: 'Process files in seconds with our optimized Java engine.',
    icon: FiZap,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20'
  },
  {
    title: 'Secure & Private',
    description: 'Your files are processed locally first and never stored without permission.',
    icon: FiLock,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20'
  },
  {
    title: 'Multiple Formats',
    description: 'Support for ZIP, RAR, 7Z, PDF, images, audio, and more.',
    icon: FiFile,
    color: 'text-primary-600',
    bg: 'bg-primary-50 dark:bg-primary-900/20'
  },
  {
    title: 'High Compression',
    description: 'Reduce file sizes by up to 90% using advanced algorithms.',
    icon: FiTrendingUp,
    color: 'text-accent-600',
    bg: 'bg-accent-50 dark:bg-accent-900/20'
  },
  {
    title: 'Cloud Integration',
    description: 'Premium plans with cloud storage and file history.',
    icon: FiCompass,
    color: 'text-fuchsia-600',
    bg: 'bg-fuchsia-50 dark:bg-fuchsia-900/20'
  },
  {
    title: '24/7 Support',
    description: 'Get help anytime with our dedicated support team.',
    icon: FiShield,
    color: 'text-pink-600',
    bg: 'bg-pink-50 dark:bg-pink-900/20'
  }
];

const reviews = [
  {
    name: 'Sarah Johnson',
    role: 'Product Designer',
    avatar: 'S',
    rating: 5,
    text: 'The best file compressor I have ever used! Fast and efficient.'
  },
  {
    name: 'Mike Chen',
    role: 'Software Engineer',
    avatar: 'M',
    rating: 5,
    text: 'Great UI and amazing compression ratios. Highly recommend!'
  },
  {
    name: 'Emily Davis',
    role: 'Content Creator',
    avatar: 'E',
    rating: 5,
    text: 'I use this daily to compress my images. Perfect quality!'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-mist-50 via-white to-accent-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative Background Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary-500/30 to-accent-500/20 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-accent-500/20 to-primary-500/30 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
                Compress, Convert & Manage Files with
                <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent block mt-2">
                  FileMagic
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-6 max-w-xl mx-auto lg:mx-0">
                Watch the magic happen with your files!
              </p>

              {/* "See the Magic" text */}
              <div className="mb-8">
                <p className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold text-lg shadow-lg shadow-primary-500/30 animate-pulse">
                  ✨ See the Magic ✨
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link
                  to="/upload"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold text-lg shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300 hover:-translate-y-1"
                >
                  Start Free
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-primary-200 dark:border-primary-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold text-lg hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                >
                  View Pricing
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="w-5 h-5 text-primary-500" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="w-5 h-5 text-primary-500" />
                  <span>100% free basic</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="w-5 h-5 text-primary-500" />
                  <span>Fast processing</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-primary-100 dark:border-primary-900">
                <FileHero3D />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-white/70 dark:bg-slate-950/70 border-y border-primary-100 dark:border-primary-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-8">
            Trusted by developers and designers worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-80">
            {['TechCorp', 'DesignHub', 'DevStudio', 'CloudBase', 'DataFlow'].map((name, i) => (
              <div key={i} className="text-2xl font-bold text-slate-700 dark:text-slate-300 font-display">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-mist-50/50 to-accent-50/50 dark:from-slate-900 dark:to-purple-950/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-4">
              Our Tools
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Powerful Tools for Every Need
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Everything you need to manage, compress, and convert your files in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, i) => (
              <Link
                key={i}
                to={tool.href}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 border border-primary-100 dark:border-primary-900 hover:border-primary-300 dark:hover:border-primary-800 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${tool.color} text-white`}>
                    {tool.tag}
                  </span>
                </div>

                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {tool.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {tool.description}
                </p>

                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold">
                  Get Started
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Why Choose FileMagic?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Built for performance, security, and ease of use.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-primary-100 dark:border-primary-900 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>

                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-mist-50 to-accent-50 dark:from-slate-900 dark:to-purple-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-primary-100 dark:border-primary-900 shadow-lg">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, j) => (
                    <FiStar key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                <p className="text-slate-700 dark:text-slate-300 mb-6 italic">
                  "{review.text}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{review.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl p-10 md:p-16 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands of users who trust FileMagic for their file management needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/upload"
                className="px-8 py-4 rounded-2xl bg-white text-primary-600 font-semibold text-lg hover:bg-slate-50 transition-colors shadow-lg"
              >
                Start Compressing
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 rounded-2xl bg-white/10 border-2 border-white/50 text-white font-semibold text-lg hover:bg-white/20 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
