import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import DynamicFormRenderer from "@/components/common/DynamicFormRenderer";
import { getFormDefault } from "@/lib/formRegistry";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const defaultForm = getFormDefault(slug);
  return {
    title: `${defaultForm.title} | Cambridge International School, Mandi`,
    description: defaultForm.description,
  };
}

export default async function GenericCustomFormPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const defaultForm = getFormDefault(slug);

  let formTitle = defaultForm.title;
  let formBadge = defaultForm.badge;
  let formDesc = defaultForm.description;

  try {
    const dbForm = await prisma.formDefinition.findUnique({
      where: { slug },
    });
    if (dbForm) {
      if (dbForm.title) formTitle = dbForm.title;
      if (dbForm.badge) formBadge = dbForm.badge;
      if (dbForm.description) formDesc = dbForm.description;
    }
  } catch (_) {}

  return (
    <div>
      <PageHeader
        badge={formBadge || "Online Form"}
        title={formTitle}
        description={formDesc}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Forms", href: "/admissions" },
          { label: formTitle },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DynamicFormRenderer formSlug={slug} />
      </div>
    </div>
  );
}
