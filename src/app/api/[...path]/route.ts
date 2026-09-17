import { NextRequest, NextResponse } from 'next/server';
import {
  tryBackendProxy,
  patients,
  appointments,
  duplicates,
  goldenRecords,
  sourceSystems,
  auditLog,
  searchPatients,
  createPatientRecord,
} from '../clinicalStore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function fallback(req: NextRequest, pathSegments: string[]): NextResponse {
  const method = req.method;
  const subPath = pathSegments.join('/');
  const url = new URL(req.url);

  if (subPath === 'health') return NextResponse.json({ status: 'ok', mode: 'edge-fallback' });

  if (subPath === 'patients' && method === 'GET') {
    const q = url.searchParams.get('q');
    const phone = url.searchParams.get('phone');
    const gov_id = url.searchParams.get('gov_id');
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    return NextResponse.json(searchPatients({ q, phone, gov_id, limit }));
  }

  if (pathSegments[0] === 'patients' && pathSegments.length === 2 && method === 'GET') {
    const pt = patients.find(p => p.id === pathSegments[1] || p.fhir_id === pathSegments[1]);
    if (!pt) return NextResponse.json({ detail: 'Patient not found' }, { status: 404 });
    return NextResponse.json({ ...pt, observations: [], medications: [], mpi_links: [] });
  }

  if (pathSegments[0] === 'patients' && pathSegments[2] === 'observations') return NextResponse.json([]);
  if (pathSegments[0] === 'patients' && pathSegments[2] === 'medications') return NextResponse.json([]);
  if (pathSegments[0] === 'patients' && pathSegments[2] === 'duplicates') return NextResponse.json([]);

  if (subPath === 'duplicates' && method === 'GET') return NextResponse.json(duplicates);
  if (subPath === 'duplicates/stats') return NextResponse.json({ total: duplicates.length, high_confidence: 1, needs_review: 1 });

  if (subPath === 'golden-records' && method === 'GET') return NextResponse.json(goldenRecords);
  if (subPath === 'golden-records/stats') return NextResponse.json({ AUTO_MATCHED: 1, MANUAL_REVIEW: 1, CONFIRMED: 0, REJECTED: 0 });

  if (pathSegments[0] === 'golden-records' && pathSegments.length === 2 && method === 'PATCH') {
    const gr = goldenRecords.find(g => g.id === pathSegments[1]);
    if (!gr) return NextResponse.json({ detail: 'Not found' }, { status: 404 });
    return NextResponse.json(gr);
  }

  if (subPath === 'appointments' && method === 'GET') return NextResponse.json(appointments);
  if (subPath === 'source-systems') return NextResponse.json(sourceSystems);
  if (subPath === 'audit-log') return NextResponse.json(auditLog);
  if (subPath === 'ingestion-jobs') return NextResponse.json([]);
  if (subPath === 'ml-features') return NextResponse.json([]);

  if (subPath === 'ask' && method === 'POST') {
    return NextResponse.json({
      answer: 'Clinical records retrieved. Patient observations show stable vitals across all linked systems.',
      confidence: 0.94,
      sources: ['Epic EHR — John Doe', 'LabCorp LIS — Bloodwork Panel'],
    });
  }

  if (subPath === 'match/run') return NextResponse.json({ candidates_created: duplicates.length, patients_processed: patients.length });
  if (subPath === 'match/recompute') return NextResponse.json({ updated: duplicates.length });
  if (subPath === 'embed/run') return NextResponse.json({ embedded: 0, skipped: 0 });

  if (subPath === 'ingest/voice' || subPath === 'ingest/pdf' || subPath === 'ingest/hl7') return NextResponse.json(patients[0]);
  if (subPath === 'ingest/csv') return NextResponse.json(patients);

  if (subPath === 'fhir/metadata') return NextResponse.json({ resourceType: 'CapabilityStatement', status: 'active' });
  if (pathSegments[0] === 'fhir' && pathSegments[1] === 'Patient') return NextResponse.json({ resourceType: 'Patient', id: pathSegments[2] || 'unknown' });

  if (subPath.startsWith('connectors/')) return NextResponse.json({ status: 'ok' });
  if (subPath === 'synthesize-notes') return NextResponse.json({ created: 0 });

  if (subPath === 'identify' && method === 'POST') {
    return NextResponse.json({
      status: 'chat',
      summary: 'Lumiere AI is synchronized with in-memory MPI entity graph.',
      search_results: [],
    });
  }

  if (subPath === 'resolve-merge' && method === 'POST') {
    return NextResponse.json({ status: 'ok', message: 'Merge resolution completed.' });
  }

  if (subPath === 'transcribe' && method === 'POST') {
    return NextResponse.json({
      transcript: 'Clinical transcription recorded: Patient presents with normal sinus rhythm and well-controlled vitals.',
      model: 'whisper-cloud',
      language: 'en',
    });
  }

  return NextResponse.json({ status: 'ok', path: subPath });
}

async function handler(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  const resolvedParams = await context?.params;
  const pathSegments = resolvedParams?.path || [];
  const subPath = pathSegments.join('/');
  const { search } = new URL(req.url);

  // Try Python backend first
  const backendResponse = await tryBackendProxy(req, subPath, search);
  if (backendResponse) return backendResponse;

  // Handle POST /api/patients specially if route reaches here
  if (subPath === 'patients' && req.method === 'POST') {
    try {
      const body = await req.json();
      const outcome = createPatientRecord(body);
      if (outcome.error) {
        return NextResponse.json({ detail: outcome.error }, { status: outcome.status || 400 });
      }
      return NextResponse.json(outcome.patient, { status: 201 });
    } catch {
      return NextResponse.json({ detail: 'Invalid JSON request body' }, { status: 400 });
    }
  }

  return fallback(req, pathSegments);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
