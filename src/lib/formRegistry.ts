export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "date"
  | "select"
  | "radio"
  | "checkbox"
  | "textarea"
  | "file"
  | "image"
  | "document"
  | "heading";

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  defaultValue?: string | boolean;
  required?: boolean;
  helperText?: string;
  width?: "full" | "half" | "third";
  options?: FormFieldOption[];
  stepId?: string;
  icon?: string;
  validationRegex?: string;
  enabled?: boolean;
  disabled?: boolean;
  sortOrder?: number;
  accept?: string;
  maxSizeMB?: number;
  uploadButtonText?: string;
}

export interface FormStep {
  id: string;
  stepNumber: number;
  title: string;
  subtitle?: string;
  icon?: string;
}

export interface FormSettings {
  submitButtonText: string;
  prevButtonText?: string;
  nextButtonText?: string;
  successTitle: string;
  successMessage: string;
  successBadge?: string;
  receiptPrefix?: string;
  isMultiStep?: boolean;
  enablePrinting?: boolean;
  enableConfetti?: boolean;
  notificationEmail?: string;
  redirectUrl?: string;
  allowAttachments?: boolean;
}

export interface FormDefinitionRecord {
  slug: string;
  title: string;
  badge: string;
  description: string;
  category: "ADMISSION" | "CAREERS" | "CONTACT" | "GENERAL" | "CUSTOM";
  steps: FormStep[];
  fields: FormField[];
  settings: FormSettings;
  isActive: boolean;
  submissionsCount?: number;
}

export const DEFAULT_FORM_REGISTRY: Record<string, FormDefinitionRecord> = {
  // 1. ONLINE ADMISSION FORM
  "admissions-apply": {
    slug: "admissions-apply",
    title: "Online Admission Application Form",
    badge: "Session 2027–2028",
    description:
      "Fill out the multi-step form to register your child. Receive an instant Application ID and downloadable acknowledgment slip.",
    category: "ADMISSION",
    steps: [
      { id: "step_student", stepNumber: 1, title: "Student Particulars", subtitle: "Candidate details & academic grade", icon: "User" },
      { id: "step_parents", stepNumber: 2, title: "Parent & Contact Info", subtitle: "Guardian details & address", icon: "Home" },
      { id: "step_academics", stepNumber: 3, title: "Previous Schooling", subtitle: "Academic history & transport", icon: "GraduationCap" },
      { id: "step_review", stepNumber: 4, title: "Review & Submit", subtitle: "Verify details & generate receipt", icon: "FileCheck" },
    ],
    fields: [
      // STEP 1: STUDENT
      {
        id: "f_student_name",
        name: "studentName",
        label: "Student Full Name (as per Birth Certificate)",
        type: "text",
        placeholder: "e.g. Aarav Sharma",
        required: true,
        width: "full",
        stepId: "step_student",
        icon: "User",
      },
      {
        id: "f_dob",
        name: "dob",
        label: "Date of Birth",
        type: "date",
        required: true,
        width: "half",
        stepId: "step_student",
        icon: "Calendar",
      },
      {
        id: "f_gender",
        name: "gender",
        label: "Gender",
        type: "select",
        required: true,
        width: "half",
        stepId: "step_student",
        defaultValue: "Male",
        options: [
          { label: "Male", value: "Male" },
          { label: "Female", value: "Female" },
          { label: "Other", value: "Other" },
        ],
      },
      {
        id: "f_blood_group",
        name: "bloodGroup",
        label: "Blood Group",
        type: "select",
        required: false,
        width: "half",
        stepId: "step_student",
        defaultValue: "B+",
        options: [
          { label: "A+", value: "A+" },
          { label: "A-", value: "A-" },
          { label: "B+", value: "B+" },
          { label: "B-", value: "B-" },
          { label: "O+", value: "O+" },
          { label: "O-", value: "O-" },
          { label: "AB+", value: "AB+" },
          { label: "AB-", value: "AB-" },
        ],
      },
      {
        id: "f_grade_applying",
        name: "gradeApplying",
        label: "Grade / Class Applying For",
        type: "select",
        required: true,
        width: "half",
        stepId: "step_student",
        defaultValue: "Grade I",
        options: [
          { label: "Nursery (Early Years)", value: "Nursery" },
          { label: "LKG (Kindergarten 1)", value: "LKG" },
          { label: "UKG (Kindergarten 2)", value: "UKG" },
          { label: "Grade I", value: "Grade I" },
          { label: "Grade II", value: "Grade II" },
          { label: "Grade III", value: "Grade III" },
          { label: "Grade IV", value: "Grade IV" },
          { label: "Grade V", value: "Grade V" },
          { label: "Grade VI", value: "Grade VI" },
          { label: "Grade VII", value: "Grade VII" },
          { label: "Grade VIII", value: "Grade VIII" },
          { label: "Grade IX", value: "Grade IX" },
          { label: "Grade X", value: "Grade X" },
          { label: "Grade XI", value: "Grade XI" },
          { label: "Grade XII", value: "Grade XII" },
        ],
      },
      {
        id: "f_academic_year",
        name: "academicYear",
        label: "Academic Session",
        type: "select",
        required: true,
        width: "half",
        stepId: "step_student",
        defaultValue: "2027-2028",
        options: [
          { label: "2027–2028 (Admissions Open)", value: "2027-2028" },
          { label: "2026–2027 (Mid-Term Transfer)", value: "2026-2027" },
        ],
      },
      {
        id: "f_stream",
        name: "stream",
        label: "Senior Secondary Stream (Grades 11 & 12 only)",
        type: "select",
        required: false,
        width: "half",
        stepId: "step_student",
        defaultValue: "",
        options: [
          { label: "Not Applicable (Pre-Primary to Grade 10)", value: "" },
          { label: "Science: Medical (PCB + AI)", value: "Medical" },
          { label: "Science: Non-Medical (PCM + Robotics)", value: "Non-Medical" },
          { label: "Commerce (Accountancy, Economics, Maths)", value: "Commerce" },
          { label: "Humanities / Liberal Arts (Pol. Sci, Psychology)", value: "Humanities" },
        ],
      },
      {
        id: "f_student_photo",
        name: "studentPhoto",
        label: "Student Passport Size Photograph",
        type: "image",
        required: false,
        width: "half",
        stepId: "step_student",
        icon: "Camera",
        accept: "image/*,.jpg,.jpeg,.png,.webp",
        maxSizeMB: 5,
        helperText: "Upload student's recent color passport size photo (JPG, PNG up to 5MB)",
      },

      // STEP 2: PARENTS & ADDRESS
      {
        id: "f_father_name",
        name: "fatherName",
        label: "Father's Full Name",
        type: "text",
        placeholder: "e.g. Sh. Rajesh Sharma",
        required: true,
        width: "half",
        stepId: "step_parents",
        icon: "User",
      },
      {
        id: "f_father_phone",
        name: "fatherPhone",
        label: "Father's Mobile Phone",
        type: "tel",
        placeholder: "e.g. 98160-XXXXX",
        required: true,
        width: "half",
        stepId: "step_parents",
        icon: "Phone",
      },
      {
        id: "f_father_occ",
        name: "fatherOccupation",
        label: "Father's Occupation / Designation",
        type: "text",
        placeholder: "e.g. Senior Civil Engineer / Business",
        required: false,
        width: "half",
        stepId: "step_parents",
      },
      {
        id: "f_mother_name",
        name: "motherName",
        label: "Mother's Full Name",
        type: "text",
        placeholder: "e.g. Smt. Sunita Sharma",
        required: true,
        width: "half",
        stepId: "step_parents",
        icon: "User",
      },
      {
        id: "f_mother_phone",
        name: "motherPhone",
        label: "Mother's Mobile Phone",
        type: "tel",
        placeholder: "e.g. 94180-XXXXX",
        required: false,
        width: "half",
        stepId: "step_parents",
        icon: "Phone",
      },
      {
        id: "f_mother_occ",
        name: "motherOccupation",
        label: "Mother's Occupation / Designation",
        type: "text",
        placeholder: "e.g. Doctor / Homemaker / Educator",
        required: false,
        width: "half",
        stepId: "step_parents",
      },
      {
        id: "f_email",
        name: "email",
        label: "Primary Communication Email Address",
        type: "email",
        placeholder: "e.g. parents@example.com",
        required: true,
        width: "half",
        stepId: "step_parents",
        icon: "Mail",
      },
      {
        id: "f_phone",
        name: "phone",
        label: "WhatsApp & SMS Emergency Contact",
        type: "tel",
        placeholder: "e.g. 98050-XXXXX",
        required: true,
        width: "half",
        stepId: "step_parents",
        icon: "Phone",
      },
      {
        id: "f_address",
        name: "address",
        label: "Permanent Residential Address",
        type: "textarea",
        placeholder: "House No, Street, Landmark, Village / Colony...",
        required: true,
        width: "full",
        stepId: "step_parents",
        icon: "Home",
      },
      {
        id: "f_city",
        name: "city",
        label: "City / Town",
        type: "text",
        placeholder: "Mandi",
        defaultValue: "Mandi",
        required: true,
        width: "third",
        stepId: "step_parents",
      },
      {
        id: "f_state",
        name: "state",
        label: "State",
        type: "text",
        placeholder: "Himachal Pradesh",
        defaultValue: "Himachal Pradesh",
        required: true,
        width: "third",
        stepId: "step_parents",
      },
      {
        id: "f_pincode",
        name: "pincode",
        label: "PIN Code",
        type: "text",
        placeholder: "175001",
        defaultValue: "175001",
        required: true,
        width: "third",
        stepId: "step_parents",
      },

      // STEP 3: ACADEMICS & TRANSPORT
      {
        id: "f_prev_school",
        name: "previousSchool",
        label: "Previous School Attended (if any)",
        type: "text",
        placeholder: "e.g. St. Xavier's / DAV Public School",
        required: false,
        width: "half",
        stepId: "step_academics",
        icon: "GraduationCap",
      },
      {
        id: "f_prev_grade",
        name: "previousGrade",
        label: "Last Grade / Class Passed",
        type: "text",
        placeholder: "e.g. Grade V",
        required: false,
        width: "half",
        stepId: "step_academics",
      },
      {
        id: "f_prev_marks",
        name: "previousMarks",
        label: "Marks / Percentage / CGPA Obtained",
        type: "text",
        placeholder: "e.g. 92.4% or Grade A+",
        required: false,
        width: "half",
        stepId: "step_academics",
      },
      {
        id: "f_transport",
        name: "transportRequired",
        label: "School Bus Transport Service Required",
        type: "checkbox",
        defaultValue: false,
        required: false,
        width: "half",
        stepId: "step_academics",
      },
      {
        id: "f_hostel",
        name: "hostelRequired",
        label: "Residential Boarding Hostel Accommodation Required",
        type: "checkbox",
        defaultValue: false,
        required: false,
        width: "half",
        stepId: "step_academics",
        helperText: "Full boarding facility with air-conditioned dorms, dining, and supervised study",
      },
      {
        id: "f_birth_cert_doc",
        name: "birthCertificateDoc",
        label: "Birth Certificate / Previous School TC (PDF or Scanned Copy)",
        type: "document",
        required: false,
        width: "half",
        stepId: "step_academics",
        icon: "FileText",
        accept: ".pdf,.jpg,.jpeg,.png",
        maxSizeMB: 10,
        helperText: "Upload scanned copy of Government Birth Certificate or Transfer Certificate (PDF/Image up to 10MB)",
      },
      {
        id: "f_remarks",
        name: "remarks",
        label: "Special Medical Notes / Achievements / Co-Curricular Talents",
        type: "textarea",
        placeholder: "Mention any national sports laurels, musical instruments played, or allergies/dietary requirements...",
        required: false,
        width: "full",
        stepId: "step_academics",
      },
    ],
    settings: {
      submitButtonText: "Submit Admission Application",
      prevButtonText: "← Back",
      nextButtonText: "Next Step →",
      successTitle: "Welcome to Cambridge International School, Mandi!",
      successBadge: "Application Registered Successfully",
      successMessage:
        "Your admission application has been recorded in the central admissions portal. Our Admissions Registrar will contact you within 24–48 hours for the campus interaction schedule.",
      receiptPrefix: "CIS-ADM-2027",
      isMultiStep: true,
      enablePrinting: true,
      enableConfetti: true,
      notificationEmail: "admissions@cismandi.edu.in",
    },
    isActive: true,
  },

  // 2. CAREERS / EDUCATOR FORM
  "careers-apply": {
    slug: "careers-apply",
    title: "Careers & Educator Application Form",
    badge: "Faculty Recruitment 2026–27",
    description:
      "Join our passionate community of Cambridge & CBSE educators. Submit your credentials to apply for open teaching and administrative roles.",
    category: "CAREERS",
    steps: [
      { id: "step_candidate", stepNumber: 1, title: "Applicant Details", subtitle: "Name, contacts & current role", icon: "User" },
      { id: "step_experience", stepNumber: 2, title: "Qualifications & Experience", subtitle: "Degrees, CTC & notice period", icon: "Briefcase" },
      { id: "step_statement", stepNumber: 3, title: "Cover Letter & Resume", subtitle: "Teaching ethos & CV attachment", icon: "FileText" },
    ],
    fields: [
      {
        id: "f_app_name",
        name: "applicantName",
        label: "Full Name of Candidate",
        type: "text",
        placeholder: "e.g. Dr. Priya Verma",
        required: true,
        width: "full",
        stepId: "step_candidate",
        icon: "User",
      },
      {
        id: "f_app_email",
        name: "email",
        label: "Email Address",
        type: "email",
        placeholder: "e.g. priya.verma@example.com",
        required: true,
        width: "half",
        stepId: "step_candidate",
        icon: "Mail",
      },
      {
        id: "f_app_phone",
        name: "phone",
        label: "Mobile Contact Number",
        type: "tel",
        placeholder: "e.g. 98160-XXXXX",
        required: true,
        width: "half",
        stepId: "step_candidate",
        icon: "Phone",
      },
      {
        id: "f_app_photo",
        name: "applicantPhoto",
        label: "Passport Size Photograph / Headshot",
        type: "image",
        required: false,
        width: "half",
        stepId: "step_candidate",
        icon: "Camera",
        accept: "image/*,.jpg,.jpeg,.png,.webp",
        maxSizeMB: 5,
        helperText: "Upload recent formal passport color photo (JPG, PNG up to 5MB)",
      },
      {
        id: "f_app_position",
        name: "positionApplied",
        label: "Department / Subject Position",
        type: "select",
        required: true,
        width: "half",
        stepId: "step_candidate",
        defaultValue: "PGT Mathematics",
        options: [
          { label: "PGT Mathematics", value: "PGT Mathematics" },
          { label: "PGT Physics & STEM", value: "PGT Physics & STEM" },
          { label: "PGT Chemistry", value: "PGT Chemistry" },
          { label: "PGT Biology", value: "PGT Biology" },
          { label: "PGT Computer Science & AI", value: "PGT Computer Science & AI" },
          { label: "TGT English & Social Sciences", value: "TGT English & Social Sciences" },
          { label: "PRT Primary All Subjects", value: "PRT Primary All Subjects" },
          { label: "Early Years Montessori Coordinator", value: "Early Years Montessori Coordinator" },
          { label: "Robotics & Innovation Lab Mentor", value: "Robotics & Innovation Lab Mentor" },
          { label: "Physical Education / Swimming Coach", value: "Physical Education / Swimming Coach" },
          { label: "Administrative / Front Desk Officer", value: "Administrative / Front Desk Officer" },
        ],
      },
      {
        id: "f_app_qualification",
        name: "qualification",
        label: "Highest Educational Qualification",
        type: "text",
        placeholder: "e.g. MSc Mathematics, B.Ed, CTET Qualified",
        required: true,
        width: "half",
        stepId: "step_experience",
        icon: "GraduationCap",
      },
      {
        id: "f_app_experience",
        name: "experience",
        label: "Total Years of Relevant Teaching Experience",
        type: "select",
        required: true,
        width: "half",
        stepId: "step_experience",
        defaultValue: "3-5 Years",
        options: [
          { label: "Fresher / Less than 1 Year", value: "0-1 Year" },
          { label: "1 to 3 Years", value: "1-3 Years" },
          { label: "3 to 5 Years", value: "3-5 Years" },
          { label: "5 to 10 Years", value: "5-10 Years" },
          { label: "10+ Years (Senior Faculty)", value: "10+ Years" },
        ],
      },
      {
        id: "f_app_current_ctc",
        name: "currentCtc",
        label: "Current Annual CTC (INR)",
        type: "text",
        placeholder: "e.g. ₹6,50,000 P.A.",
        required: false,
        width: "half",
        stepId: "step_experience",
      },
      {
        id: "f_app_expected_ctc",
        name: "expectedCtc",
        label: "Expected Annual CTC (INR)",
        type: "text",
        placeholder: "e.g. ₹8,000,000 P.A.",
        required: false,
        width: "half",
        stepId: "step_experience",
      },
      {
        id: "f_app_cover",
        name: "coverLetter",
        label: "Cover Note / Statement of Teaching Philosophy",
        type: "textarea",
        placeholder: "Why do you wish to join CIS Mandi? Outline your pedagogical strengths...",
        required: false,
        width: "full",
        stepId: "step_statement",
      },
      {
        id: "f_app_resume",
        name: "resumeUrl",
        label: "Upload Curriculum Vitae (CV) / Resume Document",
        type: "document",
        placeholder: "Upload PDF / Word document or paste link",
        required: true,
        width: "full",
        stepId: "step_statement",
        icon: "FileText",
        accept: ".pdf,.doc,.docx",
        maxSizeMB: 10,
        helperText: "Upload your CV/Resume in PDF or Word format (Max 10MB) or provide link",
      },
    ],
    settings: {
      submitButtonText: "Submit Job Application",
      prevButtonText: "← Previous",
      nextButtonText: "Continue →",
      successTitle: "Application Received!",
      successBadge: "HR Application Logged",
      successMessage:
        "Thank you for your interest in Cambridge International School Mandi. Our HR Dean will review your profile and reach out for the preliminary interview round.",
      receiptPrefix: "CIS-CAREER",
      isMultiStep: true,
      enablePrinting: false,
      enableConfetti: true,
      notificationEmail: "hr@cismandi.edu.in",
    },
    isActive: true,
  },

  // 3. CONTACT & GENERAL INQUIRY FORM
  "contact-inquiry": {
    slug: "contact-inquiry",
    title: "General Inquiries & Campus Visit Request",
    badge: "Get in Touch",
    description: "Have a question or want to schedule a personalized Himalayan campus tour? Send us a message.",
    category: "CONTACT",
    steps: [
      { id: "step_inquiry", stepNumber: 1, title: "Inquiry Details", subtitle: "Your query & contact info", icon: "Mail" },
    ],
    fields: [
      {
        id: "f_inq_name",
        name: "name",
        label: "Your Full Name",
        type: "text",
        placeholder: "e.g. Smt. Neha Kapoor",
        required: true,
        width: "half",
        stepId: "step_inquiry",
        icon: "User",
      },
      {
        id: "f_inq_email",
        name: "email",
        label: "Email Address",
        type: "email",
        placeholder: "e.g. neha@example.com",
        required: true,
        width: "half",
        stepId: "step_inquiry",
        icon: "Mail",
      },
      {
        id: "f_inq_phone",
        name: "phone",
        label: "Contact Mobile Phone",
        type: "tel",
        placeholder: "e.g. 98160-XXXXX",
        required: true,
        width: "half",
        stepId: "step_inquiry",
        icon: "Phone",
      },
      {
        id: "f_inq_type",
        name: "inquiryType",
        label: "Inquiry Nature / Topic",
        type: "select",
        required: true,
        width: "half",
        stepId: "step_inquiry",
        defaultValue: "ADMISSION",
        options: [
          { label: "New Admission Inquiry (2027-28)", value: "ADMISSION" },
          { label: "Book a Campus Visit & Tour", value: "VISIT" },
          { label: "Fees Structure & Scholarships", value: "FEE" },
          { label: "Transport & Bus Routes", value: "TRANSPORT" },
          { label: "Boarding Hostel Facilities", value: "HOSTEL" },
          { label: "General Information", value: "GENERAL" },
        ],
      },
      {
        id: "f_inq_subject",
        name: "subject",
        label: "Subject / Brief Headline",
        type: "text",
        placeholder: "e.g. Admission query for Grade 6 & Bus Route from Ner Chowk",
        required: true,
        width: "full",
        stepId: "step_inquiry",
      },
      {
        id: "f_inq_message",
        name: "message",
        label: "Your Message or Question",
        type: "textarea",
        placeholder: "Type your query in detail...",
        required: true,
        width: "full",
        stepId: "step_inquiry",
      },
    ],
    settings: {
      submitButtonText: "Send Inquiry Message",
      successTitle: "Thank You for Contacting Us!",
      successBadge: "Inquiry Logged",
      successMessage:
        "We have received your message. Our helpdesk team at Mandi campus will respond within 24 business hours.",
      receiptPrefix: "CIS-INQ",
      isMultiStep: false,
      enablePrinting: false,
      enableConfetti: true,
      notificationEmail: "info@cismandi.edu.in",
    },
    isActive: true,
  },

  // 4. TRANSFER CERTIFICATE (TC) REQUEST FORM
  "tc-request": {
    slug: "tc-request",
    title: "Transfer Certificate (TC) & Clearance Application",
    badge: "Student Clearance",
    description: "Official form for parents requesting School Leaving / Transfer Certificate under CBSE guidelines.",
    category: "GENERAL",
    steps: [
      { id: "step_tc", stepNumber: 1, title: "TC Application Details", subtitle: "Scholar details & reasons", icon: "FileText" },
    ],
    fields: [
      {
        id: "f_tc_student_name",
        name: "studentName",
        label: "Student Full Name",
        type: "text",
        placeholder: "e.g. Ananya Thakur",
        required: true,
        width: "half",
        stepId: "step_tc",
      },
      {
        id: "f_tc_admission_no",
        name: "admissionNo",
        label: "Admission / Scholar Registration Number",
        type: "text",
        placeholder: "e.g. CIS/2021/0492",
        required: true,
        width: "half",
        stepId: "step_tc",
      },
      {
        id: "f_tc_class",
        name: "classSection",
        label: "Current Class & Section",
        type: "text",
        placeholder: "e.g. Grade 8 - Section B",
        required: true,
        width: "half",
        stepId: "step_tc",
      },
      {
        id: "f_tc_parent_phone",
        name: "phone",
        label: "Parent Registered Mobile Number",
        type: "tel",
        placeholder: "e.g. 98160-XXXXX",
        required: true,
        width: "half",
        stepId: "step_tc",
      },
      {
        id: "f_tc_reason",
        name: "reason",
        label: "Reason for TC Request",
        type: "select",
        required: true,
        width: "full",
        stepId: "step_tc",
        defaultValue: "Parent Job Transfer",
        options: [
          { label: "Parent Job Transfer to another City", value: "Parent Job Transfer" },
          { label: "Relocation to another State / Country", value: "Relocation" },
          { label: "Admission to Higher Secondary Stream elsewhere", value: "Higher Secondary Stream" },
          { label: "Personal / Family Reasons", value: "Personal Reasons" },
        ],
      },
      {
        id: "f_tc_dues",
        name: "duesCleared",
        label: "Have all library books and lab dues been surrendered?",
        type: "select",
        required: true,
        width: "half",
        stepId: "step_tc",
        defaultValue: "Yes",
        options: [
          { label: "Yes, all dues cleared", value: "Yes" },
          { label: "In Process with Accounts Desk", value: "In Process" },
        ],
      },
    ],
    settings: {
      submitButtonText: "Submit TC Application",
      successTitle: "TC Application Logged",
      successBadge: "Clearance Request Pending",
      successMessage:
        "Your TC request has been forwarded to the Principal's Desk and Accounts department. Official TC will be prepared within 7 working days following standard CBSE clearance verification.",
      receiptPrefix: "CIS-TC",
      isMultiStep: false,
      enablePrinting: true,
      enableConfetti: false,
      notificationEmail: "office@cismandi.edu.in",
    },
    isActive: true,
  },
};

export function getFormDefault(slug: string): FormDefinitionRecord {
  if (DEFAULT_FORM_REGISTRY[slug]) {
    return JSON.parse(JSON.stringify(DEFAULT_FORM_REGISTRY[slug]));
  }

  // Generic custom form fallback
  const cleanTitle = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    slug,
    title: cleanTitle || "Custom Form",
    badge: "Custom School Form",
    description: "Please fill out this form with accurate information.",
    category: "CUSTOM",
    steps: [{ id: "step_1", stepNumber: 1, title: "Form Information", subtitle: "Please provide requested details" }],
    fields: [
      {
        id: `f_${Date.now()}_1`,
        name: "fullName",
        label: "Full Name",
        type: "text",
        placeholder: "Enter full name...",
        required: true,
        width: "full",
        stepId: "step_1",
      },
      {
        id: `f_${Date.now()}_2`,
        name: "email",
        label: "Email Address",
        type: "email",
        placeholder: "Enter email...",
        required: true,
        width: "half",
        stepId: "step_1",
      },
      {
        id: `f_${Date.now()}_3`,
        name: "phone",
        label: "Contact Phone Number",
        type: "tel",
        placeholder: "Enter phone...",
        required: true,
        width: "half",
        stepId: "step_1",
      },
      {
        id: `f_${Date.now()}_4`,
        name: "message",
        label: "Detailed Message / Notes",
        type: "textarea",
        placeholder: "Enter remarks...",
        required: false,
        width: "full",
        stepId: "step_1",
      },
    ],
    settings: {
      submitButtonText: "Submit Form",
      successTitle: "Submission Successful!",
      successBadge: "Form Submitted",
      successMessage: "Thank you for submitting this form. We have safely recorded your details.",
      receiptPrefix: "CIS-FORM",
      isMultiStep: false,
      enablePrinting: true,
      enableConfetti: true,
    },
    isActive: true,
  };
}
