import { NextRequest, NextResponse } from 'next/server';
import { tryBackendProxy, sourceSystems } from '../clinicalStore';

export async function GET(req: NextRequest) {
  const backendRes = await tryBackendProxy(req, 'source-systems');
  if (backendRes) return backendRes;

  return NextResponse.json(sourceSystems);
}
