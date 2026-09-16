import { NextRequest, NextResponse } from 'next/server';
import { tryBackendProxy } from '../../clinicalStore';

export async function GET(req: NextRequest) {
  const { search } = new URL(req.url);
  const backendRes = await tryBackendProxy(req, 'golden-records/stats', search);
  if (backendRes) return backendRes;

  return NextResponse.json({
    AUTO_MATCHED: 1,
    MANUAL_REVIEW: 1,
    CONFIRMED: 0,
    REJECTED: 0,
  });
}
