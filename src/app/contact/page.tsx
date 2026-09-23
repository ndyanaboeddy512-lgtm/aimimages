import React from 'react';
import { getSiteSettings } from '@/lib/data';
import { ContactView } from '@/components/contact-view';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return <ContactView initialSettings={settings} />;
}
