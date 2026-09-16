import { NextRequest, NextResponse } from 'next/server';
import { tryBackendProxy, patients } from '../../clinicalStore';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { search } = new URL(req.url);

  // Try backend first
  const backendRes = await tryBackendProxy(req, `patients/${id}`, search);
  if (backendRes) return backendRes;

  // Fallback
  const pt = patients.find(p => p.id === id || p.fhir_id === id);
  if (!pt) {
    return NextResponse.json({ detail: 'Patient not found' }, { status: 404 });
  }

  return NextResponse.json({
    ...pt,
    observations: [],
    medications: [],
    mpi_links: [],
  });
}
