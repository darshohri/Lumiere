import { NextRequest, NextResponse } from 'next/server';
import { tryBackendProxy, duplicates } from '../../clinicalStore';

export async function GET(req: NextRequest) {
  const { search } = new URL(req.url);
  const backendRes = await tryBackendProxy(req, 'duplicates/stats', search);
  if (backendRes) return backendRes;

  return NextResponse.json({
    total: duplicates.length,
    high_confidence: 1,
    needs_review: 1,
  });
}
