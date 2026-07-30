import { ZodError } from "zod";

import {
  jsonError,
  jsonOk,
  logActivity,
  requireAdmin,
  zodErrorResponse,
} from "@/lib/admin";
import { revalidateSettings } from "@/lib/revalidate";
import { settingsSchema } from "@/lib/validations";
import { SiteSettings } from "@/models/SiteSettings";

export async function GET() {
  const result = await requireAdmin();
  if (result.error) return result.error;

  let settings = await SiteSettings.findOne().lean();
  if (!settings) {
    const created = await SiteSettings.create({});
    settings = created.toObject();
  }
  return jsonOk(settings);
}

export async function PUT(request: Request) {
  const result = await requireAdmin();
  if (result.error) return result.error;

  try {
    const data = settingsSchema.parse(await request.json());
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(data);
    } else {
      settings.set(data);
      await settings.save();
    }

    await logActivity({
      session: result.session,
      action: "update",
      entityType: "settings",
      entityId: String(settings._id),
      summary: "Updated site settings",
      request,
    });

    revalidateSettings();
    return jsonOk(settings, "Settings saved");
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    return jsonError("Failed to update settings", 500);
  }
}
