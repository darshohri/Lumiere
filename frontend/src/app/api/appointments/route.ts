import { NextRequest, NextResponse } from 'next/server';
import { tryBackendProxy, appointments, AppointmentRecord } from '../clinicalStore';

export async function GET(req: NextRequest) {
  const { search } = new URL(req.url);
  const backendRes = await tryBackendProxy(req, 'appointments', search);
  if (backendRes) return backendRes;

  return NextResponse.json(appointments);
}

export async function POST(req: NextRequest) {
  let body: any = {};
  try { body = await req.json(); } catch {}

  const BACKEND_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8002';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`${BACKEND_URL}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.status !== 404 && res.status !== 502 && res.status !== 503) {
      const text = await res.text();
      return new NextResponse(text, { status: res.status, headers: { 'Content-Type': 'application/json' } });
    }
  } catch {}

  const newAppt: AppointmentRecord = {
    id: crypto.randomUUID(),
    patient_id: body.patient_id || '',
    clinician_name: body.clinician_name || 'Dr. Evelyn Reed',
    title: body.title || 'General Consultation',
    appointment_date: body.appointment_date || new Date().toISOString().split('T')[0],
    appointment_time: body.appointment_time || '10:00 AM',
    status: body.status || 'SCHEDULED',
    notes: body.notes || '',
    created_at: new Date().toISOString(),
  };

  appointments.unshift(newAppt);
  return NextResponse.json(newAppt, { status: 201 });
}
