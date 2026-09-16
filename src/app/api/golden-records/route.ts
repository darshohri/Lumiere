import { NextRequest, NextResponse } from 'next/server';
import { tryBackendProxy, goldenRecords } from '../clinicalStore';

export async function GET(req: NextRequest) {
  const { search } = new URL(req.url);
  const backendRes = await tryBackendProxy(req, 'golden-records', search);
  if (backendRes) return backendRes;

  return NextResponse.json(goldenRecords);
}
