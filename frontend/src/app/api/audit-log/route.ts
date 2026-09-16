import { NextRequest, NextResponse } from 'next/server';
import { tryBackendProxy, auditLog } from '../clinicalStore';

export async function GET(req: NextRequest) {
  const backendRes = await tryBackendProxy(req, 'audit-log');
  if (backendRes) return backendRes;

  return NextResponse.json(auditLog);
}
