import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFormDefault, FormDefinitionRecord } from "@/lib/formRegistry";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const defaultForm = getFormDefault(slug);

    let dbForm: any = null;
    try {
      if ((prisma as any).formDefinition) {
        dbForm = await (prisma as any).formDefinition.findUnique({
          where: { slug },
        });
      } else {
        const rows = (await prisma.$queryRawUnsafe(
          `SELECT * FROM FormDefinition WHERE slug = ? LIMIT 1`,
          slug
        )) as any[];
        dbForm = rows && rows.length > 0 ? rows[0] : null;
      }
    } catch (e) {
      dbForm = null;
    }

    if (!dbForm) {
      const response = NextResponse.json({ form: defaultForm });
      response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
      return response;
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
          // Append any newly added default template fields if they don't exist in DB
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

    const form: FormDefinitionRecord = {
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

    const response = NextResponse.json({ form });
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    return response;
  } catch (error: any) {
    console.error("Form GET by slug error:", error);
    return NextResponse.json(
      { form: getFormDefault("admissions-apply") }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();

    const { title, badge, description, category, steps, fields, settings, isActive } = body;

    const stepsJson = typeof steps === "object" ? JSON.stringify(steps) : (body.stepsJson || "[]");
    const fieldsJson = typeof fields === "object" ? JSON.stringify(fields) : (body.fieldsJson || "[]");
    const settingsJson = typeof settings === "object" ? JSON.stringify(settings) : (body.settingsJson || "{}");
    const activeVal = isActive !== undefined ? (isActive ? 1 : 0) : 1;
    const now = new Date().toISOString();

    try {
      if ((prisma as any).formDefinition) {
        await (prisma as any).formDefinition.upsert({
          where: { slug },
          update: {
            title: title || slug,
            badge: badge || "Online Form",
            description: description || "",
            category: category || "GENERAL",
            stepsJson,
            fieldsJson,
            settingsJson,
            isActive: Boolean(activeVal),
            updatedBy: "Admin",
          },
          create: {
            slug,
            title: title || slug,
            badge: badge || "Online Form",
            description: description || "",
            category: category || "GENERAL",
            stepsJson,
            fieldsJson,
            settingsJson,
            isActive: Boolean(activeVal),
            updatedBy: "Admin",
          },
        });
      } else {
        const existing = (await prisma.$queryRawUnsafe(
          `SELECT id FROM FormDefinition WHERE slug = ? LIMIT 1`,
          slug
        )) as any[];

        if (existing && existing.length > 0) {
          await prisma.$queryRawUnsafe(
            `UPDATE FormDefinition 
             SET title = ?, badge = ?, description = ?, category = ?, stepsJson = ?, fieldsJson = ?, settingsJson = ?, isActive = ?, updatedAt = ?, updatedBy = 'Admin' 
             WHERE slug = ?`,
            title || slug,
            badge || "Online Form",
            description || "",
            category || "GENERAL",
            stepsJson,
            fieldsJson,
            settingsJson,
            activeVal,
            now,
            slug
          );
        } else {
          const id = `form_${Date.now()}`;
          await prisma.$queryRawUnsafe(
            `INSERT INTO FormDefinition (id, slug, title, badge, description, category, stepsJson, fieldsJson, settingsJson, isActive, submissionsCount, updatedBy, updatedAt, createdAt) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'Admin', ?, ?)`,
            id,
            slug,
            title || slug,
            badge || "Online Form",
            description || "",
            category || "GENERAL",
            stepsJson,
            fieldsJson,
            settingsJson,
            activeVal,
            now,
            now
          );
        }
      }
    } catch (e: any) {
      console.error("Form PUT DB error:", e);
    }

    // Record Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          userName: "Admin",
          action: "UPDATE_FORM_DEFINITION",
          entity: "FormDefinition",
          entityId: slug,
          details: `Updated form fields & settings for "${title || slug}" (${fields?.length || 0} fields, ${steps?.length || 0} steps)`,
        },
      });
    } catch (_) {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Form PUT error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update form" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Reset or delete record
    try {
      if ((prisma as any).formDefinition) {
        await (prisma as any).formDefinition.deleteMany({ where: { slug } });
      } else {
        await prisma.$queryRawUnsafe(`DELETE FROM FormDefinition WHERE slug = ?`, slug);
      }
    } catch (e) {
      console.error("Form delete error:", e);
    }

    return NextResponse.json({ success: true, message: `Deleted form ${slug}` });
  } catch (error: any) {
    console.error("Form DELETE error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete form" },
      { status: 500 }
    );
  }
}
