import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { recordAuditLog, recordSettingRevision } from '@/lib/audit';
import { normalizeSettings } from '@/lib/data';

export async function GET() {
  try {
    await requireAuth();

    const settings = await prisma.siteSetting.findMany({
      orderBy: { category: 'asc' },
    });

    const defaults: Record<string, any> = {
      brand_name: 'Aim Images HD',
      brand_tagline: 'Where Light Meets Timeless Storytelling',
      hero_headline: 'Where Light Meets Timeless Storytelling',
      hero_subheadline: 'Aim Images HD crafts breathtaking wedding documentaries, high-fashion editorial campaigns, and cinematic commercial films across the globe.',
      booking_status: 'Bookings Open',
      contact_phone: '+256 764 709 563',
      contact_whatsapp: '+256 764 709 563',
      contact_email: 'aimugimages@gmail.com',
      studio_address: 'Rugarama Road, Kabale, Uganda',
      google_maps_url: 'https://maps.google.com/?q=Rugarama+Road,+Kabale,+Uganda',
      instagram_url: 'https://instagram.com/aimimages',
      youtube_url: 'https://youtube.com/@aimimages',
      vimeo_url: 'https://vimeo.com/aimimages',
      seo_title: 'Aim Images HD | Luxury Wedding Cinema & Haute Couture Photography',
      seo_description: 'Aim Images HD is an internationally recognized visual media studio based in Kabale, Uganda, crafting high-end wedding documentaries and editorial campaigns worldwide.',
    };

    const rawMap: Record<string, any> = {};
    for (const s of settings) {
      rawMap[s.key] = s.value;
    }
    const settingsMap = normalizeSettings(rawMap, defaults);

    return NextResponse.json({ settings, settingsMap });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth('ADMIN');
    const body = await req.json();
    const { key, value, category, label, description, changeReason } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value are required.' }, { status: 400 });
    }

    const existing = await prisma.siteSetting.findUnique({ where: { key } });

    const updated = await prisma.siteSetting.upsert({
      where: { key },
      update: {
        value,
        label: label !== undefined ? label : existing?.label,
        description: description !== undefined ? description : existing?.description,
        updatedById: session.id,
      },
      create: {
        key,
        category: category || 'GENERAL',
        label: label || key,
        description: description || '',
        value,
        updatedById: session.id,
      },
    });

    // Save snapshot revision
    await recordSettingRevision({
      settingId: updated.id,
      value,
      changeReason: changeReason || 'Updated in admin dashboard',
      actor: session,
    });

    // Record audit log
    await recordAuditLog({
      action: 'SETTINGS_CHANGE',
      entityType: 'SiteSetting',
      entityId: updated.id,
      entityTitle: updated.label || updated.key,
      beforeValues: existing?.value,
      afterValues: updated.value,
      actor: session,
      metadata: { key: updated.key, category: updated.category },
    });

    return NextResponse.json({ success: true, setting: updated });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || 'Failed to save setting' }, { status: 500 });
  }
}
