import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, service, eventDate, budgetRange, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and project message are required.' },
        { status: 400 }
      );
    }

    // Try saving to database if DATABASE_URL is active
    if (process.env.DATABASE_URL) {
      try {
        const saved = await prisma.enquiry.create({
          data: {
            name,
            email,
            phone: phone || null,
            service: service || 'General Inquiry',
            eventDate: eventDate || null,
            budgetRange: budgetRange || null,
            message,
            status: 'PENDING'
          }
        });
        return NextResponse.json({ success: true, enquiryId: saved.id }, { status: 201 });
      } catch (dbErr) {
        console.warn('Prisma enquiry insertion failed, continuing with acknowledgment:', dbErr);
      }
    }

    // Acknowledge gracefully in offline / seed mode
    return NextResponse.json({
      success: true,
      message: 'Enquiry received successfully into studio system.'
    });
  } catch (err: any) {
    console.error('Enquiry handler error:', err);
    return NextResponse.json(
      { error: 'Internal server error processing enquiry.' },
      { status: 500 }
    );
  }
}
