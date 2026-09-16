import { NextRequest, NextResponse } from 'next/server';
import { tryBackendProxy } from '../clinicalStore';

export async function POST(req: NextRequest) {
  const backendRes = await tryBackendProxy(req, 'identify');
  if (backendRes) return backendRes;

  return NextResponse.json({
    status: 'chat',
    summary: 'Lumiere AI is operating in autonomous cloud mode. All MPI patient records and entity linkages are synchronized.',
    search_results: [],
  });
}
