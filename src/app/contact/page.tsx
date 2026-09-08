"use client";

import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  ExternalLink,
  Loader2,
  ShieldCheck,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    inquiryType: "GENERAL",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to send message");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        badge="Connect With Us"
        title="Contact Cambridge Mandi & Visit Us"
        description="We welcome prospective parents, students, and visitors. Reach out for admissions, campus tours, or administrative support."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact Us" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Contact Directory & Campus Details */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold text-school-secondary uppercase tracking-wider">
                Direct Directory
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-school-primary dark:text-white mt-1">
                Campus Location & Helplines
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <div className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start space-x-3.5">
                <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-school-primary dark:text-white">Campus Address</h4>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Cambridge International School, Near Victoria Bridge, Gutkar / Mandi Bypass, Mandi, Himachal Pradesh - 175001, India
                  </p>
                </div>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start space-x-3.5">
                <Phone className="w-5 h-5 text-school-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-school-primary dark:text-white">Admissions & Reception</h4>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    +91 1905 223456 / +91 98160 99999
                  </p>
                </div>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start space-x-3.5">
                <Mail className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-school-primary dark:text-white">Official Email</h4>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    info@cismandi.edu.in | admissions@cismandi.edu.in
                  </p>
                </div>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start space-x-3.5">
                <Clock className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-school-primary dark:text-white">Visiting & Office Hours</h4>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Monday to Saturday: 8:00 AM – 4:00 PM (Closed on Sundays & National Holidays)
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp Direct */}
            <div className="bg-emerald-50 dark:bg-emerald-950/60 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-8 h-8 text-emerald-600" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Instant WhatsApp Helpline</p>
                  <p className="text-[11px] text-slate-500">Fast replies from Admissions Desk</p>
                </div>
              </div>
              <a
                href="https://wa.me/919816099999?text=Hello%20Cambridge%20Mandi,%20I%20would%20like%20to%20inquire%20about%20Admissions."
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition-colors"
              >
                Chat Now
              </a>
            </div>
          </div>

          {/* Right: Interactive Contact Form */}
          <div className="lg:col-span-7 glass-card p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <h3 className="text-2xl font-bold text-school-primary dark:text-white">
              Send an Online Inquiry
            </h3>

            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                  Message Dispatched Successfully!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                  Thank you for reaching out to Cambridge International School Mandi. Our administrative office will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-school-primary text-white font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-school-primary-light transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-rose-50 text-rose-600 text-xs rounded-xl border border-rose-200">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Sen"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-school-secondary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98160..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-school-secondary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="parent@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-school-secondary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-school-secondary"
                    >
                      <option value="GENERAL">General Inquiry</option>
                      <option value="ADMISSION">Admission & Eligibility</option>
                      <option value="VISIT">Campus Tour Booking</option>
                      <option value="HOSTEL">Boarding / Hostel</option>
                      <option value="TRANSPORT">Bus Transport Route</option>
                      <option value="FEE">Fees & Scholarship</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Brief subject of your query"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-school-secondary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Your Message / Detailed Questions *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-school-secondary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-school-secondary to-blue-700 hover:from-blue-600 hover:to-school-primary text-white font-bold py-3.5 rounded-xl text-xs shadow-lg transition-all"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Inquiry Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Embedded Google Maps Placeholder / Directions Frame */}
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-school-secondary" />
              <h3 className="font-bold text-base text-school-primary dark:text-white">
                Interactive Map & Directions (Mandi, HP)
              </h3>
            </div>
            <a
              href="https://maps.google.com/?q=Cambridge+International+School+Mandi+Himachal+Pradesh"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 text-xs font-bold text-school-secondary hover:underline"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="w-full h-80 rounded-2xl overflow-hidden relative bg-slate-900 flex items-center justify-center border border-slate-800">
            <iframe
              title="CIS Mandi Location Map"
              src="https://maps.google.com/maps?q=Mandi+Himachal+Pradesh+India&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-500"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
