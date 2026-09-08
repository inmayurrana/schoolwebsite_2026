import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const defaultDisclosureData = {
  schoolName: "CAMBRIDGE INTERNATIONAL SCHOOL, LUNAPANI,MANDI",
  affiliationNo: "630270",
  schoolCode: "41824",
  address: "CAMBRIDGE INTERNATIONAL SCHOOL, LUNAPANI,TEHSIL BALH,DISTTMANDI,H.P, MANDI , HIMACHAL PRADESH - 175021",
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

export async function GET() {
  try {
    let disclosure = await prisma.mandatoryDisclosure.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (!disclosure) {
      disclosure = await prisma.mandatoryDisclosure.create({
        data: {
          schoolName: defaultDisclosureData.schoolName,
          affiliationNo: defaultDisclosureData.affiliationNo,
          schoolCode: defaultDisclosureData.schoolCode,
          address: defaultDisclosureData.address,
          principalName: defaultDisclosureData.principalName,
          principalQualification: defaultDisclosureData.principalQualification,
          schoolEmail: defaultDisclosureData.schoolEmail,
          contactDetails: defaultDisclosureData.contactDetails,
          documentsJson: JSON.stringify(defaultDisclosureData.documents),
          academicResultsJson: JSON.stringify(defaultDisclosureData.academicResults),
          staffInfoJson: JSON.stringify(defaultDisclosureData.staffInfo),
          infrastructureJson: JSON.stringify(defaultDisclosureData.infrastructure),
          updatedBy: "System Seed",
        },
      });
    }

    return NextResponse.json({
      disclosure: {
        ...disclosure,
        documents: JSON.parse(disclosure.documentsJson || "[]"),
        academicResults: JSON.parse(disclosure.academicResultsJson || "{}"),
        staffInfo: JSON.parse(disclosure.staffInfoJson || "{}"),
        infrastructure: JSON.parse(disclosure.infrastructureJson || "{}"),
      },
    });
  } catch (error: any) {
    console.error("Mandatory Disclosure GET error:", error);
    return NextResponse.json({ error: "Failed to fetch mandatory disclosure" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const existing = await prisma.mandatoryDisclosure.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    const payload = {
      schoolName: data.schoolName || defaultDisclosureData.schoolName,
      affiliationNo: data.affiliationNo || defaultDisclosureData.affiliationNo,
      schoolCode: data.schoolCode || defaultDisclosureData.schoolCode,
      address: data.address || defaultDisclosureData.address,
      principalName: data.principalName || defaultDisclosureData.principalName,
      principalQualification: data.principalQualification || defaultDisclosureData.principalQualification,
      schoolEmail: data.schoolEmail || defaultDisclosureData.schoolEmail,
      contactDetails: data.contactDetails || defaultDisclosureData.contactDetails,
      documentsJson: typeof data.documents === "object" ? JSON.stringify(data.documents) : data.documentsJson,
      academicResultsJson: typeof data.academicResults === "object" ? JSON.stringify(data.academicResults) : data.academicResultsJson,
      staffInfoJson: typeof data.staffInfo === "object" ? JSON.stringify(data.staffInfo) : data.staffInfoJson,
      infrastructureJson: typeof data.infrastructure === "object" ? JSON.stringify(data.infrastructure) : data.infrastructureJson,
      updatedBy: auth.name || "Admin",
    };

    let result;
    if (existing) {
      result = await prisma.mandatoryDisclosure.update({
        where: { id: existing.id },
        data: payload,
      });
    } else {
      result = await prisma.mandatoryDisclosure.create({
        data: payload,
      });
    }

    // Record audit log entry in database
    await prisma.auditLog.create({
      data: {
        userId: auth.id,
        userName: auth.name || "Administrator",
        action: "DISCLOSURE_UPDATE",
        entity: "MandatoryDisclosure",
        entityId: result.id,
        details: `Saved CBSE Mandatory Public Disclosure details and statutory documents in database.`,
      },
    });

    return NextResponse.json({ success: true, disclosure: result });
  } catch (error: any) {
    console.error("Mandatory Disclosure POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to update disclosure" }, { status: 500 });
  }
}
