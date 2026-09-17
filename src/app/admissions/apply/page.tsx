"use client";

import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import DynamicFormRenderer from "@/components/common/DynamicFormRenderer";

export default function ApplyOnlinePage() {
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
        <DynamicFormRenderer formSlug="admissions-apply" />
      </div>
    </div>
  );
}
