"use client";

import React, { useState } from "react";
import { MessageCircle, X, Sparkles, Send } from "lucide-react";

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const phoneNumber = "919816099999";

  const handleSend = () => {
    const text = encodeURIComponent(
      message || "Hello Cambridge International School Mandi, I would like to inquire regarding Admissions 2027-28."
    );
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, "_blank");
    setOpen(false);
    setMessage("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Popover Bubble */}
      {open && (
        <div className="mb-3 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">CIS Mandi Admissions</p>
                <p className="text-[10px] text-emerald-100">Typically replies within 15 mins</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 space-y-3 text-xs">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl rounded-tl-none shadow-sm border border-slate-200/60 dark:border-slate-700 text-slate-800 dark:text-slate-200">
              <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                Namaste! Welcome to Cambridge International School, Mandi.
              </p>
              <p className="mt-1 text-slate-600 dark:text-slate-400 text-[11px]">
                How can we assist you today? Feel free to ask about admissions, fee structures, or campus visits.
              </p>
            </div>

            <textarea
              rows={2}
              placeholder="Type your WhatsApp message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-emerald-500"
            />

            <button
              onClick={handleSend}
              className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs shadow-md transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Start WhatsApp Chat</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform ring-4 ring-emerald-400/30 group"
        aria-label="Contact via WhatsApp"
      >
        <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
