import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');

    let projects = await getProjects();

    if (category && category !== 'All') {
      projects = projects.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (type === 'video') {
      projects = projects.filter((p) => p.isVideo);
    } else if (type === 'photo') {
      projects = projects.filter((p) => !p.isVideo);
    }

    return NextResponse.json({ projects, total: projects.length });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to retrieve projects' }, { status: 500 });
  }
}
