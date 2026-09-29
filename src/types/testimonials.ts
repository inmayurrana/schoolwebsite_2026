export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  relation: string;
  content: string;
  rating: number;
  avatar: string;
  badge: string;
  isActive?: boolean;
}

export interface TestimonialsConfig {
  badge: string;
  title: string;
  subtitle?: string;
  cardStyle: "glass" | "navy" | "clean" | "aurora";
  ambientGlow: "purple-gold" | "blue-cyan" | "emerald-amber" | "none";
  starColor: "amber" | "yellow" | "emerald";
  quoteIconStyle: "subtle" | "solid" | "none";
  autoplay: boolean;
  autoplaySpeed: number; // in seconds
}

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "voice-1",
    name: "Dr. Sandeep Kaundal",
    role: "Senior Consultant Neurosurgeon",
    relation: "Parent of Aarav Kaundal (Grade X)",
    content: "Sending our son to Cambridge International School Mandi was the best decision for his overall intellectual growth. The balance between rigorous CBSE academics, robotics, and sports is exceptional. The teachers know each student personally.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80",
    badge: "Parent Review",
    isActive: true,
  },
  {
    id: "voice-2",
    name: "Meenakshi Sen",
    role: "HP Administrative Services (HPAS)",
    relation: "Parent of Priyanshi Sen (Grade VII)",
    content: "The serene Himalayan campus environment combined with high-tech 4K smart classrooms and caring hostel wardens gave us complete peace of mind. My daughter has blossomed in public speaking and national Olympiads.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    badge: "Parent Review",
    isActive: true,
  },
  {
    id: "voice-3",
    name: "Rohan Jamwal",
    role: "Software Engineer at Google (Alumnus Batch 2020)",
    relation: "B.Tech Computer Science, IIT Roorkee",
    content: "The STEM and coding foundation I received at CIS Mandi under the robotics lab guidance directly shaped my engineering journey. The faculty instilled in us the confidence to think globally and solve hard problems.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    badge: "Proud Alumnus",
    isActive: true,
  },
];

export const DEFAULT_CONFIG: TestimonialsConfig = {
  badge: "Parent & Alumni Voices",
  title: "Trusted by Discerning Parents & Inspiring Alumni",
  subtitle: "Authentic feedback and reflections from our proud parent community and distinguished alumni.",
  cardStyle: "glass",
  ambientGlow: "purple-gold",
  starColor: "amber",
  quoteIconStyle: "subtle",
  autoplay: true,
  autoplaySpeed: 6,
};
