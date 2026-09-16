import { NextRequest, NextResponse } from 'next/server';
import { tryBackendProxy } from '../clinicalStore';

export async function POST(req: NextRequest) {
  const backendRes = await tryBackendProxy(req, 'resolve-merge');
  if (backendRes) return backendRes;

  return NextResponse.json({
    status: 'ok',
    message: 'Merge resolution confirmed and recorded.',
  });
}
