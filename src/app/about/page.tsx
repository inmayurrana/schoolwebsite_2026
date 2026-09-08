import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  Globe,
  HeartHandshake,
  CheckCircle2,
  TreePine,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

export const metadata = {
  title: "About Us | Cambridge International School, Mandi",
  description: "Learn about Cambridge International School Mandi, our heritage, Himalayan campus, and commitment to holistic global education.",
};

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        badge="About Cambridge Mandi"
        title="Nurturing Global Innovators with Himalayan Roots"
        description="Founded with the vision to provide benchmark international schooling in Himachal Pradesh, Cambridge International School Mandi has grown into the region's most sought-after center for academic and co-curricular excellence."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      {/* Main Content */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-school-secondary uppercase tracking-wider">
              Our Heritage & Philosophy
            </span>
            <h2 className="text-3xl font-extrabold text-school-primary dark:text-white">
              An Inspiring Himalayan Learning Sanctuary
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Situated in the historic and scenic town of Mandi (known as the 'Varanasi of the Hills'), <strong>Cambridge International School Mandi</strong> spans a verdant 10-acre campus surrounded by pine-clad mountains and the tranquil Beas river valley.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Our pedagogical philosophy is built on the premise that every student is endowed with unique potential. By synthesizing the rigor of the <strong>Central Board of Secondary Education (CBSE Affiliation No. 630198)</strong> with progressive Cambridge inquiry methodologies, we foster critical thinking, STEM innovation, artistic expression, and moral character.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-2xl font-black text-school-secondary">2014</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Year of Inception</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-2xl font-black text-amber-500">10 Acres</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Lush Campus</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80"
                alt="CIS Mandi Campus"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-school-primary/80 via-transparent to-transparent flex items-end p-6">
                <p className="text-white text-sm font-semibold">
                  Main Academic Block & Shivalik Mountain Backdrop
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-school-primary dark:text-white">
              The 4 Pillars of Cambridge Education
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Our holistic model creates balanced, empathetic, and intellectually curious young adults.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-school-secondary flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-school-primary dark:text-white">Global Mindset</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Nurturing multilingualism, global current affairs awareness, and intercultural respect.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-school-primary dark:text-white">Academic Rigor</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Consistent 100% CBSE Board pass records and top selections in JEE Advanced, NEET, and Olympiads.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-school-primary dark:text-white">Moral Values</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Instilling integrity, environmental stewardship, empathy, and social service through active clubs.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-school-primary dark:text-white">STEM & Creativity</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                State-of-the-art Robotics, 3D printing, AI lab, pottery, classical music, and theater arts.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links to Sub-pages */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/about/mission-vision"
            className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-school-primary hover:text-white transition-all group flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-slate-400 group-hover:text-amber-300 font-semibold">Core Philosophy</p>
              <h4 className="font-bold text-sm text-school-primary dark:text-white group-hover:text-white mt-1">
                Mission & Vision →
              </h4>
            </div>
          </Link>

          <Link
            href="/about/chairman-message"
            className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-school-primary hover:text-white transition-all group flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-slate-400 group-hover:text-amber-300 font-semibold">Guiding Words</p>
              <h4 className="font-bold text-sm text-school-primary dark:text-white group-hover:text-white mt-1">
                Chairman's Message →
              </h4>
            </div>
          </Link>

          <Link
            href="/about/principal-message"
            className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-school-primary hover:text-white transition-all group flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-slate-400 group-hover:text-amber-300 font-semibold">Academic Leadership</p>
              <h4 className="font-bold text-sm text-school-primary dark:text-white group-hover:text-white mt-1">
                Principal's Desk →
              </h4>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
