import { prisma } from "@/lib/prisma";
import { getFormDefault, FormDefinitionRecord } from "@/lib/formRegistry";

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();
const DEFAULT_TTL_MS = 1000 * 60 * 15; // 15 minutes ultra-fast in-memory cache

/**
 * High-performance cached query for Page Content
 * Returns in < 0.05ms on cache hit
 */
export async function getCachedPageContent(slug: string) {
  const now = Date.now();
  const cacheKey = `page:${slug}`;
  const cached = memoryCache.get(cacheKey);

  if (cached && cached.expiry > now) {
    return cached.data;
  }

  try {
    const page = await prisma.pageContent.findUnique({
      where: { slug },
    });

    memoryCache.set(cacheKey, {
      data: page,
      expiry: now + DEFAULT_TTL_MS,
    });

    return page;
  } catch (error) {
    console.error(`Error querying pageContent for [${slug}]:`, error);
    return null;
  }
}

/**
 * High-performance cached query for Page Visibility Map
 */
export async function getCachedVisibility() {
  const now = Date.now();
  const cacheKey = "pages:visibility";
  const cached = memoryCache.get(cacheKey);

  if (cached && cached.expiry > now) {
    return cached.data;
  }

  try {
    const pages = await prisma.pageContent.findMany({
      select: {
        slug: true,
        pageName: true,
        isPublished: true,
      },
    });

    const visibilityMap: Record<string, boolean> = {};
    pages.forEach((p) => {
      visibilityMap[p.slug] = p.isPublished;
    });

    const result = { visibility: visibilityMap, pages };

    memoryCache.set(cacheKey, {
      data: result,
      expiry: now + DEFAULT_TTL_MS,
    });

    return result;
  } catch (error) {
    console.error("Error querying pages visibility:", error);
    return { visibility: {}, pages: [] };
  }
}

/**
 * High-performance cached query for Form Definition
 * Returns in < 0.05ms on cache hit, eliminating client-side loading spinners and API waterfalls
 */
export async function getCachedFormDefinition(slug: string): Promise<FormDefinitionRecord> {
  const now = Date.now();
  const cacheKey = `form:${slug}`;
  const cached = memoryCache.get(cacheKey);

  if (cached && cached.expiry > now) {
    return cached.data;
  }

  const defaultForm = getFormDefault(slug);

  try {
    let dbForm: any = null;
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

    if (!dbForm) {
      memoryCache.set(cacheKey, { data: defaultForm, expiry: now + DEFAULT_TTL_MS });
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
      if (dbForm.settingsJson) parsedSettings = { ...defaultForm.settings, ...JSON.parse(dbForm.settingsJson) };
    } catch (_) {}

    const form: FormDefinitionRecord = {
      slug: dbForm.slug || slug,
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

    memoryCache.set(cacheKey, { data: form, expiry: now + DEFAULT_TTL_MS });
    return form;
  } catch (error) {
    console.error(`Error querying formDefinition for [${slug}]:`, error);
    return defaultForm;
  }
}

/**
 * Instant cache invalidation triggered whenever an admin saves a form
 */
export function invalidateFormCache(slug?: string) {
  if (slug) {
    memoryCache.delete(`form:${slug}`);
  } else {
    for (const key of memoryCache.keys()) {
      if (key.startsWith("form:")) {
        memoryCache.delete(key);
      }
    }
  }
}

/**
 * Instant cache invalidation triggered whenever an admin saves a page
 */
export function invalidatePageCache(slug?: string) {
  if (slug) {
    memoryCache.delete(`page:${slug}`);
  } else {
    for (const key of memoryCache.keys()) {
      if (key.startsWith("page:")) {
        memoryCache.delete(key);
      }
    }
  }
  memoryCache.delete("pages:visibility");
}
