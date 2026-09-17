import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import DynamicFormRenderer from "@/components/common/DynamicFormRenderer";
import { getCachedFormDefinition } from "@/lib/pageContentCache";

export const metadata = {
  title: "Online Admission Application Form | Cambridge International School, Mandi",
  description:
    "Fill out the multi-step online admission form to register your child. Receive an instant Application ID and downloadable acknowledgment slip.",
};

export default async function ApplyOnlinePage() {
  const form = await getCachedFormDefinition("admissions-apply");

  return (
    <div>
      <PageHeader
        badge={form.badge || "Session 2027–2028"}
        title={form.title || "Online Admission Application Form"}
        description={
          form.description ||
          "Fill out the multi-step form to register your child. Receive an instant Application ID and downloadable acknowledgment slip."
        }
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Admissions", href: "/admissions" },
          { label: "Apply Online" },
        ]}
      />

      <div className="w-full max-w-5xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <DynamicFormRenderer initialForm={form} formSlug="admissions-apply" />
      </div>
    </div>
  );
}
