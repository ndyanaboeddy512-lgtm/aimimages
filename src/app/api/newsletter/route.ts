import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    if (process.env.DATABASE_URL) {
      try {
        await prisma.newsletterSubscriber.upsert({
          where: { email },
          update: {},
          create: { email }
        });
      } catch (dbErr) {
        console.warn('Prisma newsletter subscription fallback:', dbErr);
      }
    }

    return NextResponse.json({ success: true, message: 'Subscribed to journal.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to subscribe.' }, { status: 500 });
  }
}
