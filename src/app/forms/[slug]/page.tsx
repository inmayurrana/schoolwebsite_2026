import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import DynamicFormRenderer from "@/components/common/DynamicFormRenderer";
import { getFormDefault } from "@/lib/formRegistry";
import { getCachedFormDefinition } from "@/lib/pageContentCache";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const form = await getCachedFormDefinition(slug);
  return {
    title: `${form.title} | Cambridge International School, Mandi`,
    description: form.description,
  };
}

export default async function GenericCustomFormPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const form = await getCachedFormDefinition(slug);

  return (
    <div>
      <PageHeader
        badge={form.badge || "Online Form"}
        title={form.title}
        description={form.description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Forms", href: "/admissions" },
          { label: form.title },
        ]}
      />

      <div className="w-full max-w-5xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <DynamicFormRenderer initialForm={form} formSlug={slug} />
      </div>
    </div>
  );
}
