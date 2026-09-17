import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_FORM_REGISTRY, FormDefinitionRecord, getFormDefault } from "@/lib/formRegistry";

export async function GET() {
  try {
    let dbForms: any[] = [];
    try {
      if ((prisma as any).formDefinition) {
        dbForms = await (prisma as any).formDefinition.findMany({
          orderBy: { createdAt: "desc" },
        });
      } else {
        dbForms = (await prisma.$queryRawUnsafe(`SELECT * FROM FormDefinition ORDER BY createdAt DESC`)) as any[];
      }
    } catch (e) {
      dbForms = [];
    }

    const dbMap: Record<string, any> = {};
    (dbForms || []).forEach((f) => {
      dbMap[f.slug] = f;
    });

    // Merge default registry forms with DB forms
    const allSlugs = Array.from(
      new Set([...Object.keys(DEFAULT_FORM_REGISTRY), ...Object.keys(dbMap)])
    );

    const mergedForms: FormDefinitionRecord[] = allSlugs.map((slug) => {
      const defaultForm = getFormDefault(slug);
      const dbForm = dbMap[slug];

      if (!dbForm) {
        return defaultForm;
      }

      let parsedSteps = defaultForm.steps;
      try {
        if (dbForm.stepsJson) parsedSteps = JSON.parse(dbForm.stepsJson);
      } catch (_) {}

      let parsedFields = defaultForm.fields;
      try {
        if (dbForm.fieldsJson) {
          const fromDb = JSON.parse(dbForm.fieldsJson);
          if (Array.isArray(fromDb) && fromDb.length > 0) {
            const existingNames = new Set(fromDb.map((f: any) => f.name || f.id));
            const missingDefaults = defaultForm.fields.filter(
              (df) => !existingNames.has(df.name) && !existingNames.has(df.id)
            );
            const defaultMap = new Map(defaultForm.fields.map((df) => [df.name, df]));
            const upgraded = fromDb.map((f: any) => {
              const def = defaultMap.get(f.name);
              if (def && (def.type === "document" || def.type === "image") && f.type === "text") {
                return { ...f, type: def.type, accept: def.accept, maxSizeMB: def.maxSizeMB };
              }
              return f;
            });
            parsedFields = [...upgraded, ...missingDefaults];
          }
        }
      } catch (_) {}

      let parsedSettings = defaultForm.settings;
      try {
        if (dbForm.settingsJson) parsedSettings = JSON.parse(dbForm.settingsJson);
      } catch (_) {}

      return {
        slug,
        title: dbForm.title || defaultForm.title,
        badge: dbForm.badge || defaultForm.badge,
        description: dbForm.description || defaultForm.description,
        category: (dbForm.category as any) || defaultForm.category,
        steps: parsedSteps,
        fields: parsedFields,
        settings: parsedSettings,
        isActive: dbForm.isActive !== undefined ? Boolean(dbForm.isActive) : true,
        submissionsCount: dbForm.submissionsCount || 0,
      };
    });

    return NextResponse.json({ forms: mergedForms });
  } catch (error: any) {
    console.error("Forms list GET error:", error);
    return NextResponse.json(
      { forms: Object.values(DEFAULT_FORM_REGISTRY) }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, title, badge, description, category, steps, fields, settings, isActive } = body;

    if (!slug || !title) {
      return NextResponse.json({ error: "Slug and title are required" }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9_-]/g, "-");
    const stepsJson = typeof steps === "object" ? JSON.stringify(steps) : "[]";
    const fieldsJson = typeof fields === "object" ? JSON.stringify(fields) : "[]";
    const settingsJson = typeof settings === "object" ? JSON.stringify(settings) : "{}";
    const id = `form_${Date.now()}`;
    const activeVal = isActive !== undefined ? (isActive ? 1 : 0) : 1;
    const now = new Date().toISOString();

    try {
      if ((prisma as any).formDefinition) {
        await (prisma as any).formDefinition.create({
          data: {
            slug: cleanSlug,
            title,
            badge: badge || "Custom Form",
            description: description || "",
            category: category || "CUSTOM",
            stepsJson,
            fieldsJson,
            settingsJson,
            isActive: Boolean(activeVal),
            updatedBy: "Admin",
          },
        });
      } else {
        await prisma.$queryRawUnsafe(
          `INSERT INTO FormDefinition (id, slug, title, badge, description, category, stepsJson, fieldsJson, settingsJson, isActive, submissionsCount, updatedBy, updatedAt, createdAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'Admin', ?, ?)`,
          id,
          cleanSlug,
          title,
          badge || "Custom Form",
          description || "",
          category || "CUSTOM",
          stepsJson,
          fieldsJson,
          settingsJson,
          activeVal,
          now,
          now
        );
      }
    } catch (e: any) {
      console.error("Create form SQL error:", e);
    }

    return NextResponse.json({ success: true, slug: cleanSlug });
  } catch (error: any) {
    console.error("Create form POST error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create form" },
      { status: 500 }
    );
  }
}
