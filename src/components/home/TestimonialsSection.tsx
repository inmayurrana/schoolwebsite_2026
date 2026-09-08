"use client";

import React, { useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  relation: string;
  content: string;
  rating: number;
  avatar: string;
  badge: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Dr. Sandeep Kaundal",
    role: "Senior Consultant Neurosurgeon",
    relation: "Parent of Aarav Kaundal (Grade X)",
    content: "Sending our son to Cambridge International School Mandi was the best decision for his overall intellectual growth. The balance between rigorous CBSE academics, robotics, and sports is exceptional. The teachers know each student personally.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80",
    badge: "Parent Review",
  },
  {
    name: "Meenakshi Sen",
    role: "HP Administrative Services (HPAS)",
    relation: "Parent of Priyanshi Sen (Grade VII)",
    content: "The serene Himalayan campus environment combined with high-tech 4K smart classrooms and caring hostel wardens gave us complete peace of mind. My daughter has blossomed in public speaking and national Olympiads.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    badge: "Parent Review",
  },
  {
    name: "Rohan Jamwal",
    role: "Software Engineer at Google (Alumnus Batch 2020)",
    relation: "B.Tech Computer Science, IIT Roorkee",
    content: "The STEM and coding foundation I received at CIS Mandi under the robotics lab guidance directly shaped my engineering journey. The faculty instilled in us the confidence to think globally and solve hard problems.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    badge: "Proud Alumnus",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => {
    setCurrent((curr) => (curr === 0 ? testimonials.length - 1 : curr - 1));
  };

  const next = () => {
    setCurrent((curr) => (curr === testimonials.length - 1 ? 0 : curr + 1));
  };

  const t = testimonials[current];

  return (
    <section className="py-20 lg:py-28 bg-[#f0f7ff]/40 dark:bg-[#051329] relative w-full overflow-hidden">
      {/* Ambient Floating Glass Orbs */}
      <div className="glass-orb-purple -top-20 left-10 opacity-30" />
      <div className="glass-orb-gold -bottom-20 right-10 opacity-30" />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-1.5 glass-badge-gold px-4 py-1.5 rounded-full text-amber-500 font-bold text-xs uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Parent & Alumni Voices</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-school-primary dark:text-white">
            Trusted by Discerning Parents & Inspiring Alumni
          </h2>
        </div>

        {/* Carousel Glass Card */}
        <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <Quote className="w-20 h-20 text-school-secondary/15 absolute top-6 right-8 pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center space-x-1">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 italic leading-relaxed">
              "{t.content}"
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-slate-200/60 dark:border-white/10">
              <div className="flex items-center space-x-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow-md"
                />
                <div>
                  <h4 className="font-bold text-base text-school-primary dark:text-white">
                    {t.name}
                  </h4>
                  <p className="text-xs font-semibold text-school-secondary">{t.role}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.relation}</p>
                </div>
              </div>

              {/* Navigation Arrows with Glass Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={prev}
                  className="p-2.5 rounded-xl glass-btn text-slate-700 dark:text-slate-200 cursor-pointer"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="p-2.5 rounded-xl glass-btn text-slate-700 dark:text-slate-200 cursor-pointer"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
