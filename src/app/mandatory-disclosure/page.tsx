"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import {
  ShieldCheck,
  Download,
  FileText,
  ExternalLink,
  Printer,
  Building2,
  Users,
  GraduationCap,
  Video,
} from "lucide-react";

interface DocItem {
  slNo: number;
  title: string;
  docUrl: string;
}

interface DisclosureData {
  schoolName: string;
  affiliationNo: string;
  schoolCode: string;
  address: string;
  principalName: string;
  principalQualification: string;
  schoolEmail: string;
  contactDetails: string;
  documents: DocItem[];
  academicResults: {
    documents: DocItem[];
    classXResults: any[];
    classXIIResults: any[];
  };
  staffInfo: {
    principal: string;
    totalTeachers: string;
    pgt: string;
    tgt: string;
    prt: string;
    pet: string;
    teacherSectionRatio: string;
    specialEducator: string;
    counsellor: string;
  };
  infrastructure: {
    campusAreaSqMtr: string;
    builtUpAreaSqMtr: string;
    classroomsCount: string;
    laboratoriesCount: string;
    internetFacility: string;
    girlsToilets: string;
    boysToilets: string;
    inspectionVideoUrl: string;
  };
}

const fallbackDisclosure: DisclosureData = {
  schoolName: "CAMBRIDGE INTERNATIONAL SCHOOL, LUNAPANI,MANDI",
  affiliationNo: "630270",
  schoolCode: "41824",
  address:
    "CAMBRIDGE INTERNATIONAL SCHOOL, LUNAPANI,TEHSIL BALH,DISTTMANDI,H.P, MANDI , HIMACHAL PRADESH - 175021",
  principalName: "Priyanka Jamwal",
  principalQualification: "BSc. (Hons), MSc. BEd",
  schoolEmail: "41824@cbseshiksha.in",
  contactDetails: "9805039389",
  documents: [
    {
      slNo: 1,
      title: "COPIES OF AFFILIATION/UPGRADATION LETTER AND RECENT EXTENSIONOF AFFILIATION, IF ANY",
      docUrl: "/sample-documents/CBSE_Mandatory_Disclosure_CIS_Mandi.pdf",
    },
    {
      slNo: 2,
      title: "COPIES OF SOCIETIES/TRUST/COMPANY REGISTRATION/RENEWAL CERTIFICATE, AS APPLICABLE",
      docUrl: "/sample-documents/CBSE_Mandatory_Disclosure_CIS_Mandi.pdf",
    },
    {
      slNo: 3,
      title: "COPY OF NO OBJECTION CERTIFICATE (NOC) ISSUED, IF APPLICABLE, BYTHE STATE GOVT./UT",
      docUrl: "/sample-documents/CBSE_Mandatory_Disclosure_CIS_Mandi.pdf",
    },
    {
      slNo: 4,
      title: "COPIES OF RECOGNITION CERTIFICATE UNDER RTE ACT, 2009, AND IT'SRENEWAL IF APPLICABLE",
      docUrl: "/sample-documents/CBSE_Mandatory_Disclosure_CIS_Mandi.pdf",
    },
    {
      slNo: 5,
      title: "COPY OF VALID BUILDING SAFETY CERTIFICATE AS PER THE NATIONAL BUILDING CODE",
      docUrl: "/sample-documents/CBSE_Mandatory_Disclosure_CIS_Mandi.pdf",
    },
    {
      slNo: 6,
      title: "COPY OF VALID FIRE SAFETY CERTIFICATE ISSUED BY THE COMPETENT AUTHORITY",
      docUrl: "/sample-documents/CBSE_Mandatory_Disclosure_CIS_Mandi.pdf",
    },
    {
      slNo: 7,
      title: "COPY OF THE DEO CERTIFICATE SUBMITTED BY THE SCHOOL FOR AFFILIATION/UPGRADATION/EXTENSION OF AFFILIATION OR SELF CERTIFICATION BY SCHOOL",
      docUrl: "/sample-documents/CBSE_Mandatory_Disclosure_CIS_Mandi.pdf",
    },
    {
      slNo: 8,
      title: "COPIES OF VALID WATER, HEALTH AND SANITATION CERTIFICATES",
      docUrl: "/sample-documents/CBSE_Mandatory_Disclosure_CIS_Mandi.pdf",
    },
  ],
  academicResults: {
    documents: [
      { slNo: 1, title: "FEE STRUCTURE OF THE SCHOOL", docUrl: "/sample-documents/CIS_Mandi_Fee_Structure_2025_2026.pdf" },
      { slNo: 2, title: "ANNUAL ACADEMIC CALENDAR", docUrl: "/sample-documents/CIS_Mandi_Academic_Calendar_2025_2026.pdf" },
      { slNo: 3, title: "LIST OF SCHOOL MANAGEMENT COMMITTEE (SMC)", docUrl: "/sample-documents/CBSE_Mandatory_Disclosure_CIS_Mandi.pdf" },
      { slNo: 4, title: "LIST OF PARENTS TEACHERS ASSOCIATION (PTA) MEMBERS", docUrl: "/sample-documents/CBSE_Mandatory_Disclosure_CIS_Mandi.pdf" },
    ],
    classXResults: [
      { year: "2023-2024", registered: 114, passed: 114, passPct: "100%", remarks: "District Rank 1, 42 Distinctions" },
      { year: "2022-2023", registered: 102, passed: 102, passPct: "100%", remarks: "State Rank 3, 38 Distinctions" },
      { year: "2021-2022", registered: 95, passed: 95, passPct: "100%", remarks: "100% First Divisions" },
    ],
    classXIIResults: [
      { year: "2023-2024", registered: 98, passed: 98, passPct: "100%", remarks: "District Topper 99.2%, 18 JEE/NEET Selections" },
      { year: "2022-2023", registered: 86, passed: 86, passPct: "100%", remarks: "District Rank 1, 14 IIT/AIIMS Selections" },
      { year: "2021-2022", registered: 78, passed: 78, passPct: "100%", remarks: "100% Pass Percentage" },
    ],
  },
  staffInfo: {
    principal: "Priyanka Jamwal (BSc. Hons, MSc. BEd)",
    totalTeachers: "58",
    pgt: "14",
    tgt: "22",
    prt: "18",
    pet: "4",
    teacherSectionRatio: "1.5 : 1",
    specialEducator: "1 (Full-Time Certified RCI Registered)",
    counsellor: "1 (M.A. Clinical Psychology, Certified Wellness Coach)",
  },
  infrastructure: {
    campusAreaSqMtr: "40,468 Sq. Mtrs (10 Acres)",
    builtUpAreaSqMtr: "12,500 Sq. Mtrs",
    classroomsCount: "48 Classrooms (600 Sq. Ft each with 4K Smart Panels)",
    laboratoriesCount: "8 Labs (Physics, Chemistry, Biology, STEM Robotics, 2 Computer Labs, Mathematics Lab, Language Lab)",
    internetFacility: "YES (1 Gbps Fiber Leased Line with 100% Wi-Fi Coverage)",
    girlsToilets: "24 Units with Sanitary Pad Vending & Incinerators",
    boysToilets: "28 Units with Automated Sensors",
    inspectionVideoUrl: "https://youtu.be/slAltokCyL0",
  },
};

export default function MandatoryDisclosurePage() {
  const [data, setData] = useState<DisclosureData>(fallbackDisclosure);

  useEffect(() => {
    async function loadDisclosure() {
      try {
        const res = await fetch("/api/mandatory-disclosure");
        const json = await res.json();
        if (json.disclosure) {
          setData(json.disclosure);
        }
      } catch (err) {
        // fallback
      }
    }
    loadDisclosure();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const generalInfoList = [
    { sl: 1, info: "NAME OF THE SCHOOL", details: data.schoolName },
    { sl: 2, info: "AFFILIATION NO.(IF APPLICABLE)", details: data.affiliationNo },
    { sl: 3, info: "SCHOOL CODE (IF APPLICABLE)", details: data.schoolCode },
    { sl: 4, info: "COMPLETE ADDRESS WITH PIN CODE", details: data.address },
    { sl: 5, info: "PRINCIPAL NAME", details: data.principalName },
    { sl: 6, info: "PRINCIPAL QUALIFICATION", details: data.principalQualification },
    { sl: 7, info: "SCHOOL EMAIL ID", details: data.schoolEmail },
    { sl: 8, info: "CONTACT DETAILS (LANDLINE/MOBILE)", details: data.contactDetails },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100">
      <PageHeader
        badge="CBSE Statutory Compliance"
        title="APPENDIX - IX MANDATORY PUBLIC DISCLOSURE"
        description="Statutory public disclosures under CBSE SARAS & Affiliation Bye-Laws for Cambridge International School, Lunapani, Mandi."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Mandatory Public Disclosure" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-12 space-y-12">
        {/* Official Header Badge and Print Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm print:hidden">
          <div className="space-y-1 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-black text-school-primary dark:text-white font-heading underline decoration-blue-500 underline-offset-8">
              APPENDIX -IX MANDATORY PUBLIC DISCLOSURE
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              CBSE Affiliation No: <span className="font-bold text-school-secondary">{data.affiliationNo}</span> | School Code: <span className="font-bold text-amber-500">{data.schoolCode}</span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs px-5 py-2.5 rounded-xl shadow hover:scale-105 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Disclosure</span>
            </button>
          </div>
        </div>

        {/* SECTION A: GENERAL INFORMATION */}
        <div className="space-y-4">
          <h2 className="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400 uppercase tracking-wide flex items-center space-x-2">
            <Building2 className="w-4 h-4" />
            <span>A : GENERAL INFORMATION :</span>
          </h2>

          <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase text-[11px] font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3.5 w-20 text-center">SL NO.</th>
                  <th className="p-3.5 w-1/3">INFORMATION</th>
                  <th className="p-3.5">DETAILS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                {generalInfoList.map((row) => (
                  <tr key={row.sl} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 text-center font-mono font-bold text-slate-500">{row.sl}</td>
                    <td className="p-3.5 font-bold text-slate-700 dark:text-slate-300">{row.info}</td>
                    <td className="p-3.5 font-semibold text-school-primary dark:text-amber-300">{row.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION B: DOCUMENTS AND INFORMATION */}
        <div className="space-y-4">
          <h2 className="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400 uppercase tracking-wide flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>B : DOCUMENTS AND INFORMATION:</span>
          </h2>

          <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase text-[11px] font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3.5 w-20 text-center">SL NO.</th>
                  <th className="p-3.5">DOCUMENTS/INFORMATION</th>
                  <th className="p-3.5 w-64 text-right sm:text-left">LINKS OF UPLOADED DOCUMENTS ON YOUR SCHOOL'S WEBSITE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                {data.documents.map((doc, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 text-center font-mono font-bold text-slate-500">{idx + 1}</td>
                    <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">{doc.title}</td>
                    <td className="p-3.5 text-right sm:text-left">
                      {doc.docUrl ? (
                        <a
                          href={doc.docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-4 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-400/80 hover:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-all cursor-pointer shadow-sm"
                        >
                          Click here
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Document Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION C: RESULT AND ACADEMICS */}
        <div className="space-y-6">
          <h2 className="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400 uppercase tracking-wide flex items-center space-x-2">
            <GraduationCap className="w-4 h-4" />
            <span>C : RESULT AND ACADEMICS:</span>
          </h2>

          {/* C.1 Documents */}
          <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase text-[11px] font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3.5 w-20 text-center">SL NO.</th>
                  <th className="p-3.5">DOCUMENTS/INFORMATION</th>
                  <th className="p-3.5 w-64 text-right sm:text-left">LINKS OF UPLOADED DOCUMENTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                {data.academicResults.documents.map((acadDoc, aIdx) => (
                  <tr key={aIdx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 text-center font-mono font-bold text-slate-500">{aIdx + 1}</td>
                    <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">{acadDoc.title}</td>
                    <td className="p-3.5 text-right sm:text-left">
                      {acadDoc.docUrl ? (
                        <a
                          href={acadDoc.docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-4 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-400/80 hover:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-all cursor-pointer shadow-sm"
                        >
                          Click here
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Document Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* C.2 Class X & XII Board Results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-xs sm:text-sm text-school-primary dark:text-white uppercase">
                LAST THREE-YEAR RESULT OF THE BOARD EXAMINATION (CLASS X)
              </h3>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-2">YEAR</th>
                    <th className="p-2 text-center">REGISTERED</th>
                    <th className="p-2 text-center">PASSED</th>
                    <th className="p-2 text-center">PASS %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {data.academicResults.classXResults.map((r, rIdx) => (
                    <tr key={rIdx}>
                      <td className="p-2 font-bold text-school-secondary">{r.year}</td>
                      <td className="p-2 text-center">{r.registered}</td>
                      <td className="p-2 text-center">{r.passed}</td>
                      <td className="p-2 text-center font-bold text-emerald-600 dark:text-emerald-400">{r.passPct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-xs sm:text-sm text-school-primary dark:text-white uppercase">
                LAST THREE-YEAR RESULT OF THE BOARD EXAMINATION (CLASS XII)
              </h3>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-2">YEAR</th>
                    <th className="p-2 text-center">REGISTERED</th>
                    <th className="p-2 text-center">PASSED</th>
                    <th className="p-2 text-center">PASS %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {data.academicResults.classXIIResults.map((r, rIdx) => (
                    <tr key={rIdx}>
                      <td className="p-2 font-bold text-school-secondary">{r.year}</td>
                      <td className="p-2 text-center">{r.registered}</td>
                      <td className="p-2 text-center">{r.passed}</td>
                      <td className="p-2 text-center font-bold text-emerald-600 dark:text-emerald-400">{r.passPct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SECTION D: STAFF (TEACHING) */}
        <div className="space-y-4">
          <h2 className="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400 uppercase tracking-wide flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>D : STAFF (TEACHING) :</span>
          </h2>

          <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase text-[11px] font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3.5 w-20 text-center">SL NO.</th>
                  <th className="p-3.5 w-1/3">INFORMATION</th>
                  <th className="p-3.5">DETAILS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                <tr>
                  <td className="p-3.5 text-center font-mono font-bold text-slate-500">1</td>
                  <td className="p-3.5 font-bold">PRINCIPAL</td>
                  <td className="p-3.5 font-semibold text-school-primary dark:text-amber-300">{data.staffInfo.principal}</td>
                </tr>
                <tr>
                  <td className="p-3.5 text-center font-mono font-bold text-slate-500">2</td>
                  <td className="p-3.5 font-bold">TOTAL NO. OF TEACHERS</td>
                  <td className="p-3.5 font-bold text-school-secondary">{data.staffInfo.totalTeachers} (PGT: {data.staffInfo.pgt}, TGT: {data.staffInfo.tgt}, PRT: {data.staffInfo.prt}, PET: {data.staffInfo.pet})</td>
                </tr>
                <tr>
                  <td className="p-3.5 text-center font-mono font-bold text-slate-500">3</td>
                  <td className="p-3.5 font-bold">TEACHERS SECTION RATIO</td>
                  <td className="p-3.5 font-semibold">{data.staffInfo.teacherSectionRatio}</td>
                </tr>
                <tr>
                  <td className="p-3.5 text-center font-mono font-bold text-slate-500">4</td>
                  <td className="p-3.5 font-bold">DETAILS OF SPECIAL EDUCATOR</td>
                  <td className="p-3.5 font-semibold">{data.staffInfo.specialEducator}</td>
                </tr>
                <tr>
                  <td className="p-3.5 text-center font-mono font-bold text-slate-500">5</td>
                  <td className="p-3.5 font-bold">DETAILS OF COUNSELLOR AND WELLNESS TEACHER</td>
                  <td className="p-3.5 font-semibold">{data.staffInfo.counsellor}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION E: SCHOOL INFRASTRUCTURE */}
        <div className="space-y-4">
          <h2 className="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400 uppercase tracking-wide flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4" />
            <span>E : SCHOOL INFRASTRUCTURE:</span>
          </h2>

          <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase text-[11px] font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3.5 w-20 text-center">SL NO.</th>
                  <th className="p-3.5 w-1/3">INFORMATION</th>
                  <th className="p-3.5">DETAILS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                <tr>
                  <td className="p-3.5 text-center font-mono font-bold text-slate-500">1</td>
                  <td className="p-3.5 font-bold">TOTAL CAMPUS AREA OF THE SCHOOL (IN SQ MTR)</td>
                  <td className="p-3.5 font-semibold text-school-primary dark:text-amber-300">{data.infrastructure.campusAreaSqMtr}</td>
                </tr>
                <tr>
                  <td className="p-3.5 text-center font-mono font-bold text-slate-500">2</td>
                  <td className="p-3.5 font-bold">NO. AND SIZE OF THE CLASS ROOMS (IN SQ FT/MTR)</td>
                  <td className="p-3.5 font-semibold">{data.infrastructure.classroomsCount}</td>
                </tr>
                <tr>
                  <td className="p-3.5 text-center font-mono font-bold text-slate-500">3</td>
                  <td className="p-3.5 font-bold">NO. AND SIZE OF LABORATORIES INCLUDING COMPUTER LABS (IN SQ MTR)</td>
                  <td className="p-3.5 font-semibold">{data.infrastructure.laboratoriesCount}</td>
                </tr>
                <tr>
                  <td className="p-3.5 text-center font-mono font-bold text-slate-500">4</td>
                  <td className="p-3.5 font-bold">INTERNET FACILITY (Y/N)</td>
                  <td className="p-3.5 font-semibold">{data.infrastructure.internetFacility}</td>
                </tr>
                <tr>
                  <td className="p-3.5 text-center font-mono font-bold text-slate-500">5</td>
                  <td className="p-3.5 font-bold">NO. OF GIRLS TOILETS</td>
                  <td className="p-3.5 font-semibold">{data.infrastructure.girlsToilets}</td>
                </tr>
                <tr>
                  <td className="p-3.5 text-center font-mono font-bold text-slate-500">6</td>
                  <td className="p-3.5 font-bold">NO. OF BOYS TOILETS</td>
                  <td className="p-3.5 font-semibold">{data.infrastructure.boysToilets}</td>
                </tr>
                <tr>
                  <td className="p-3.5 text-center font-mono font-bold text-slate-500">7</td>
                  <td className="p-3.5 font-bold">LINK OF YOUTUBE VIDEO OF THE INSPECTION OF SCHOOL COVERING THE INFRASTRUCTURE OF THE SCHOOL</td>
                  <td className="p-3.5">
                    {data.infrastructure.inspectionVideoUrl ? (
                      <a
                        href={data.infrastructure.inspectionVideoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-red-600/10 text-red-600 dark:text-red-400 border border-red-500/30 text-xs font-bold hover:bg-red-600 hover:text-white transition-colors"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Watch Inspection Video</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Video link pending</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
