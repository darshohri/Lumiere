import { NextRequest, NextResponse } from 'next/server';
import { tryBackendProxy, goldenRecords } from '../../clinicalStore';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { search } = new URL(req.url);

  const backendRes = await tryBackendProxy(req, `golden-records/${id}`, search);
  if (backendRes) return backendRes;

  const gr = goldenRecords.find(g => g.id === id);
  if (!gr) {
    return NextResponse.json({ detail: 'Golden record not found' }, { status: 404 });
  }

  let body: any = {};
  try { body = await req.json(); } catch {}

  if (body.resolution_status) gr.resolution_status = body.resolution_status;
  if (body.resolved_by) gr.resolved_by = body.resolved_by;
  if (body.notes) gr.notes = body.notes;
  gr.updated_at = new Date().toISOString();

  return NextResponse.json(gr);
}
