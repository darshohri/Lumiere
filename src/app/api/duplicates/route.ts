import { NextRequest, NextResponse } from 'next/server';
import { tryBackendProxy, duplicates } from '../clinicalStore';

export async function GET(req: NextRequest) {
  const { search } = new URL(req.url);
  const backendRes = await tryBackendProxy(req, 'duplicates', search);
  if (backendRes) return backendRes;

  return NextResponse.json(duplicates);
}
