"use client";

import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import {
  User,
  Phone,
  Mail,
  Home,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Printer,
  Loader2,
  FileCheck,
  ShieldCheck,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function ApplyOnlinePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    studentName: "",
    dob: "",
    gender: "Male",
    bloodGroup: "B+",
    gradeApplying: "Grade I",
    academicYear: "2027-2028",
    stream: "",
    fatherName: "",
    fatherPhone: "",
    fatherOccupation: "",
    motherName: "",
    motherPhone: "",
    motherOccupation: "",
    email: "",
    phone: "",
    address: "",
    city: "Mandi",
    state: "Himachal Pradesh",
    pincode: "175001",
    previousSchool: "",
    previousGrade: "",
    previousMarks: "",
    transportRequired: false,
    hostelRequired: false,
    remarks: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const nextStep = () => {
    setError("");
    if (step === 1) {
      if (!formData.studentName || !formData.dob || !formData.gradeApplying) {
        setError("Please fill all required student details.");
        return;
      }
    } else if (step === 2) {
      if (!formData.fatherName || !formData.phone || !formData.email) {
        setError("Please provide parent name, phone, and email.");
        return;
      }
    }
    setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admissions/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setSuccessData(data);
      // Trigger Confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <PageHeader
        badge="Session 2027–2028"
        title="Online Admission Application Form"
        description="Fill out the multi-step form to register your child. Receive an instant Application ID and downloadable acknowledgment slip."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Admissions", href: "/admissions" },
          { label: "Apply Online" },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success View */}
        {successData ? (
          <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8 print:shadow-none print:border-none">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Application Successfully Registered
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-school-primary dark:text-white">
                Welcome to the Cambridge Mandi Family!
              </h2>
              <div className="inline-block bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 px-6 py-2 rounded-2xl">
                <p className="text-xs text-slate-500 dark:text-slate-400">Your Official Application Number:</p>
                <p className="text-xl sm:text-2xl font-black font-mono text-school-primary dark:text-amber-400">
                  {successData.applicationNo}
                </p>
              </div>
            </div>

            {/* Application Summary Box */}
            <div className="bg-slate-50 dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs sm:text-sm">
              <h3 className="font-bold text-school-primary dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                Candidate Summary Receipt
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
                <div><strong>Student Name:</strong> {formData.studentName}</div>
                <div><strong>Grade Applying:</strong> {formData.gradeApplying}</div>
                <div><strong>Date of Birth:</strong> {formData.dob}</div>
                <div><strong>Gender:</strong> {formData.gender}</div>
                <div><strong>Father / Guardian:</strong> {formData.fatherName}</div>
                <div><strong>Phone (WhatsApp):</strong> {formData.phone}</div>
                <div><strong>Email:</strong> {formData.email}</div>
                <div><strong>Academic Session:</strong> {formData.academicYear}</div>
                <div><strong>School Transport:</strong> {formData.transportRequired ? "Yes, Required" : "No"}</div>
                <div><strong>Hostel Facility:</strong> {formData.hostelRequired ? "Yes, Required" : "No"}</div>
              </div>
            </div>

            <div className="text-xs text-slate-500 leading-relaxed text-center max-w-lg mx-auto">
              Please save your Application Number for future reference. Our admissions officer will contact you within 24–48 hours to schedule the student-parent interaction.
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-4 print:hidden">
              <button
                onClick={handlePrint}
                className="inline-flex items-center space-x-2 bg-school-primary hover:bg-school-primary-light text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print Application Receipt</span>
              </button>

              <button
                onClick={() => {
                  setSuccessData(null);
                  setStep(1);
                  setFormData({
                    studentName: "",
                    dob: "",
                    gender: "Male",
                    bloodGroup: "B+",
                    gradeApplying: "Grade I",
                    academicYear: "2025-2026",
                    stream: "",
                    fatherName: "",
                    fatherPhone: "",
                    fatherOccupation: "",
                    motherName: "",
                    motherPhone: "",
                    motherOccupation: "",
                    email: "",
                    phone: "",
                    address: "",
                    city: "Mandi",
                    state: "Himachal Pradesh",
                    pincode: "175001",
                    previousSchool: "",
                    previousGrade: "",
                    previousMarks: "",
                    transportRequired: false,
                    hostelRequired: false,
                    remarks: "",
                  });
                }}
                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs px-6 py-3 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          /* Multi-Step Form */
          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8">
            {/* Progress Stepper */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
              {[
                { num: 1, label: "Student" },
                { num: 2, label: "Parents" },
                { num: 3, label: "Academics" },
                { num: 4, label: "Review" },
              ].map((s) => (
                <div
                  key={s.num}
                  className={`pb-2 border-b-2 transition-all ${
                    step === s.num
                      ? "border-school-secondary text-school-secondary dark:text-amber-400"
                      : step > s.num
                      ? "border-emerald-500 text-emerald-600"
                      : "border-slate-200 dark:border-slate-800 text-slate-400"
                  }`}
                >
                  <span className="block text-sm sm:text-base font-extrabold">{s.num}</span>
                  <span className="hidden sm:inline text-[11px] uppercase tracking-wider">{s.label}</span>
                </div>
              ))}
            </div>

            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs rounded-xl border border-rose-200 dark:border-rose-900">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: Student Information */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h3 className="text-lg font-bold text-school-primary dark:text-white flex items-center space-x-2">
                    <User className="w-5 h-5 text-school-secondary" />
                    <span>Step 1: Student Particulars</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Student Full Name (as per Birth Certificate) *
                      </label>
                      <input
                        type="text"
                        name="studentName"
                        required
                        placeholder="e.g. Aarav Sharma"
                        value={formData.studentName}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-school-secondary"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        name="dob"
                        required
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-school-secondary"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Gender *
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-school-secondary"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Blood Group
                      </label>
                      <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-school-secondary"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Grade / Class Applying For *
                      </label>
                      <select
                        name="gradeApplying"
                        value={formData.gradeApplying}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-school-secondary"
                      >
                        <option value="Nursery / Pre-KG">Nursery / Pre-KG</option>
                        <option value="LKG / KG-1">LKG / KG-1</option>
                        <option value="UKG / KG-2">UKG / KG-2</option>
                        <option value="Grade I">Grade I</option>
                        <option value="Grade II">Grade II</option>
                        <option value="Grade III">Grade III</option>
                        <option value="Grade IV">Grade IV</option>
                        <option value="Grade V">Grade V</option>
                        <option value="Grade VI">Grade VI</option>
                        <option value="Grade VII">Grade VII</option>
                        <option value="Grade VIII">Grade VIII</option>
                        <option value="Grade IX">Grade IX</option>
                        <option value="Grade X">Grade X</option>
                        <option value="Grade XI">Grade XI</option>
                      </select>
                    </div>

                    {formData.gradeApplying === "Grade XI" && (
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Class XI Preferred Stream *
                        </label>
                        <select
                          name="stream"
                          value={formData.stream}
                          onChange={handleChange}
                          className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-school-secondary"
                        >
                          <option value="">Select Stream</option>
                          <option value="Science (Non-Med - PCM + Comp)">Science (Non-Med - PCM + Comp)</option>
                          <option value="Science (Medical - PCB + BioTech)">Science (Medical - PCB + BioTech)</option>
                          <option value="Commerce (Accounts, BST, Eco)">Commerce (Accounts, BST, Eco)</option>
                          <option value="Humanities (Pol Sci, History, Psych)">Humanities (Pol Sci, History, Psych)</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: Parents & Contact Info */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h3 className="text-lg font-bold text-school-primary dark:text-white flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-school-secondary" />
                    <span>Step 2: Parents & Communication Details</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Father's / Guardian's Full Name *
                      </label>
                      <input
                        type="text"
                        name="fatherName"
                        required
                        placeholder="e.g. Sh. Rajesh Sharma"
                        value={formData.fatherName}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Father's Occupation
                      </label>
                      <input
                        type="text"
                        name="fatherOccupation"
                        placeholder="e.g. Civil Engineer / Govt Officer"
                        value={formData.fatherOccupation}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Mother's Full Name *
                      </label>
                      <input
                        type="text"
                        name="motherName"
                        required
                        placeholder="e.g. Smt. Pooja Sharma"
                        value={formData.motherName}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Mother's Occupation
                      </label>
                      <input
                        type="text"
                        name="motherOccupation"
                        placeholder="e.g. Doctor / Teacher / Homemaker"
                        value={formData.motherOccupation}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Primary Phone Number (WhatsApp Enabled) *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="+91 98160..."
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Official Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="parent@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Residential Address in Mandi / Himachal *
                      </label>
                      <textarea
                        rows={2}
                        name="address"
                        placeholder="House No, Ward, Village / Town, District..."
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Academic Background & Facilities */}
              {step === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h3 className="text-lg font-bold text-school-primary dark:text-white flex items-center space-x-2">
                    <GraduationCap className="w-5 h-5 text-school-secondary" />
                    <span>Step 3: Academic Background & Facilities Required</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Previous School Attended (if applicable)
                      </label>
                      <input
                        type="text"
                        name="previousSchool"
                        placeholder="e.g. St. Xavier's Convent, Mandi"
                        value={formData.previousSchool}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Last Class Passed
                      </label>
                      <input
                        type="text"
                        name="previousGrade"
                        placeholder="e.g. Grade 5"
                        value={formData.previousGrade}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Percentage / Grade Obtained
                      </label>
                      <input
                        type="text"
                        name="previousMarks"
                        placeholder="e.g. 94.5% or A1"
                        value={formData.previousMarks}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                      />
                    </div>

                    {/* Facility Checkboxes */}
                    <div className="sm:col-span-2 space-y-3 pt-2">
                      <label className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          name="transportRequired"
                          checked={formData.transportRequired}
                          onChange={handleChange}
                          className="w-4 h-4 text-school-secondary rounded"
                        />
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          School Bus Transport Facility Required (GPS Monitored)
                        </span>
                      </label>

                      <label className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          name="hostelRequired"
                          checked={formData.hostelRequired}
                          onChange={handleChange}
                          className="w-4 h-4 text-school-secondary rounded"
                        />
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          Residential Hostel / Boarding Facility Required
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Review & Submit */}
              {step === 4 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h3 className="text-lg font-bold text-school-primary dark:text-white flex items-center space-x-2">
                    <FileCheck className="w-5 h-5 text-emerald-500" />
                    <span>Step 4: Final Verification & Declaration</span>
                  </h3>

                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div><span className="text-slate-400">Student:</span> <strong>{formData.studentName}</strong></div>
                      <div><span className="text-slate-400">Grade:</span> <strong>{formData.gradeApplying}</strong></div>
                      <div><span className="text-slate-400">Father:</span> <strong>{formData.fatherName}</strong></div>
                      <div><span className="text-slate-400">Phone:</span> <strong>{formData.phone}</strong></div>
                      <div><span className="text-slate-400">Email:</span> <strong>{formData.email}</strong></div>
                      <div><span className="text-slate-400">Transport:</span> <strong>{formData.transportRequired ? "Yes" : "No"}</strong></div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900 text-xs text-blue-950 dark:text-blue-200 flex items-start space-x-2">
                    <ShieldCheck className="w-4 h-4 text-school-secondary flex-shrink-0 mt-0.5" />
                    <span>
                      I hereby declare that the particulars furnished above are true and accurate to the best of my knowledge. I agree to abide by the rules and CBSE code of conduct of Cambridge International School, Mandi.
                    </span>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center space-x-1.5 bg-school-secondary hover:bg-blue-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs px-8 py-3 rounded-xl shadow-lg transition-all"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Submit & Generate Application ID</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
