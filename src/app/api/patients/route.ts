import { NextRequest, NextResponse } from 'next/server';
import { tryBackendProxy, searchPatients, createPatientRecord } from '../clinicalStore';

export async function GET(req: NextRequest) {
  const { search, searchParams } = new URL(req.url);

  // Try Python backend first
  const backendRes = await tryBackendProxy(req, 'patients', search);
  if (backendRes) return backendRes;

  // Fallback to built-in store
  const q = searchParams.get('q');
  const phone = searchParams.get('phone');
  const gov_id = searchParams.get('gov_id');
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  const results = searchPatients({ q, phone, gov_id, limit });
  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  // Read body text first
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: 'Invalid JSON request body' }, { status: 400 });
  }

  // Try Python backend first
  const BACKEND_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8002';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${BACKEND_URL}/api/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    // If backend returns 404, 502, 503, 504 -> backend not available, fall back
    if (res.status !== 404 && res.status !== 502 && res.status !== 503 && res.status !== 504) {
      const resText = await res.text();
      return new NextResponse(resText, {
        status: res.status,
        headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
      });
    }
  } catch {
    // Backend offline, proceed to fallback
  }

  // Fallback in-memory patient creation
  const outcome = createPatientRecord(body);
  if (outcome.error) {
    return NextResponse.json({ detail: outcome.error }, { status: outcome.status || 400 });
  }

  return NextResponse.json(outcome.patient, { status: 201 });
}
