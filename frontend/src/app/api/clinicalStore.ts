import { NextRequest, NextResponse } from 'next/server';

export interface PatientRecord {
  id: string;
  fhir_id: string;
  family_name: string;
  given_name: string;
  dob: string;
  gender: string;
  phone: string;
  address_line: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  created_at: string;
  updated_at: string;
}

export interface AppointmentRecord {
  id: string;
  patient_id: string;
  clinician_name: string | null;
  title: string | null;
  appointment_date: string | null;
  appointment_time: string | null;
  status: string | null;
  notes?: string | null;
  created_at: string;
}

export const patients: PatientRecord[] = [
  { id: '382ad62f-6017-45a1-b6e0-bc97060aa37d', fhir_id: 'EHR-1001', family_name: 'Doe', given_name: 'John', dob: '1990-01-01', gender: 'male', phone: '788-293-8477', address_line: '123 Maple St, Apt 4B', city: 'Springfield', state: 'IL', zip: '62701', created_at: '2026-05-19T06:34:06Z', updated_at: '2026-09-06T06:34:06Z' },
  { id: '46b9e2a0-de0d-4400-a67a-01e50c145022', fhir_id: 'LAB-2004', family_name: 'Doe', given_name: 'Jon', dob: '1990-01-01', gender: 'male', phone: '788-293-8477', address_line: '123 Maple Street', city: 'Springfield', state: 'IL', zip: '62701', created_at: '2026-06-18T06:34:06Z', updated_at: '2026-09-11T06:34:06Z' },
  { id: '1df3e46e-5607-4bc8-b1f7-55c632242696', fhir_id: 'EHR-1002', family_name: 'Jenkins', given_name: 'Sarah', dob: '1975-12-10', gender: 'female', phone: '617-555-0987', address_line: '88 Summer St', city: 'Boston', state: 'MA', zip: '02110', created_at: '2026-02-28T06:34:06Z', updated_at: '2026-09-14T06:34:06Z' },
  { id: '5e135a14-4e35-437e-ac46-e2a9209b9e07', fhir_id: 'LAB-2008', family_name: 'Jenkins-Smythe', given_name: 'Sarah', dob: '1975-12-10', gender: 'female', phone: '617-555-0987', address_line: '88 Summer Street, Suite 3', city: 'Boston', state: 'MA', zip: '02110', created_at: '2026-07-18T06:34:06Z', updated_at: '2026-09-15T06:34:06Z' },
  { id: '131a9063-b746-451b-92f9-f22e567f67e6', fhir_id: 'EHR-1003', family_name: 'Miller', given_name: 'Robert', dob: '1982-08-15', gender: 'male', phone: '415-555-1212', address_line: '500 Market St', city: 'San Francisco', state: 'CA', zip: '94105', created_at: '2025-11-20T06:34:06Z', updated_at: '2026-09-01T06:34:06Z' },
  { id: 'c9b6425f-898d-4b18-823e-80937c475707', fhir_id: 'EHR-1005', family_name: 'Parker', given_name: 'Michael', dob: '1992-11-30', gender: 'male', phone: '303-555-9000', address_line: '100 High St', city: 'Denver', state: 'CO', zip: '80202', created_at: '2026-04-19T06:34:06Z', updated_at: '2026-08-27T06:34:06Z' },
  { id: 'bfe66108-4052-4878-93f7-2c1f60fcd383', fhir_id: 'EHR-1004', family_name: 'Vance', given_name: 'Eleanor', dob: '1968-03-22', gender: 'female', phone: '206-555-4321', address_line: '742 Evergreen Terrace', city: 'Seattle', state: 'WA', zip: '98101', created_at: '2025-08-12T06:34:06Z', updated_at: '2026-09-13T06:34:06Z' },
];

export const appointments: AppointmentRecord[] = [
  { id: 'a101-1111-2222-3333', patient_id: '382ad62f-6017-45a1-b6e0-bc97060aa37d', clinician_name: 'Dr. Evelyn Reed', title: 'Routine Endocrine Follow-up', appointment_date: '2026-09-20', appointment_time: '10:00 AM', status: 'SCHEDULED', notes: 'Review HbA1c labs and titration of Metformin.', created_at: '2026-09-10T10:00:00Z' },
  { id: 'a102-1111-2222-3333', patient_id: '1df3e46e-5607-4bc8-b1f7-55c632242696', clinician_name: 'Dr. Marcus Vance', title: 'Cardiology Consultation', appointment_date: '2026-09-22', appointment_time: '02:30 PM', status: 'SCHEDULED', notes: 'Echo review for mild systolic murmur.', created_at: '2026-09-11T14:30:00Z' },
];

export const duplicates = [
  { id: 'c101-2222-3333-4444', record_a_id: '382ad62f-6017-45a1-b6e0-bc97060aa37d', record_b_id: '46b9e2a0-de0d-4400-a67a-01e50c145022', blocking_key: 'DOE-1990', soundex_score: 1.0, nysiis_score: 1.0, dob_match: true, ssn_partial_match: true, vector_similarity: 0.94, composite_score: 0.96, created_at: '2026-09-10T12:00:00Z', record_a: patients[0], record_b: patients[1] },
  { id: 'c102-2222-3333-4444', record_a_id: '1df3e46e-5607-4bc8-b1f7-55c632242696', record_b_id: '5e135a14-4e35-437e-ac46-e2a9209b9e07', blocking_key: 'JENKINS-1975', soundex_score: 0.88, nysiis_score: 0.85, dob_match: true, ssn_partial_match: true, vector_similarity: 0.89, composite_score: 0.87, created_at: '2026-09-12T15:00:00Z', record_a: patients[2], record_b: patients[3] },
];

export const goldenRecords = [
  { id: 'g101-3333-4444-5555', golden_patient_id: '382ad62f-6017-45a1-b6e0-bc97060aa37d', confidence_score: 0.96, resolution_status: 'AUTO_MATCHED', resolved_by: 'ML_AUTO_ENGINE', resolved_at: '2026-09-10T12:05:00Z', notes: 'Deterministic match on SSN hash and phone number.', created_at: '2026-09-10T12:05:00Z', updated_at: '2026-09-10T12:05:00Z', patient_name: 'John Doe', patient_dob: '1990-01-01', patient_gender: 'male', source_links: [{ id: 'sl-1', mpi_id: 'g101-3333-4444-5555', source_patient_id: '382ad62f-6017-45a1-b6e0-bc97060aa37d', link_weight: 1.0, created_at: '2026-09-10T12:05:00Z' }, { id: 'sl-2', mpi_id: 'g101-3333-4444-5555', source_patient_id: '46b9e2a0-de0d-4400-a67a-01e50c145022', link_weight: 0.96, created_at: '2026-09-10T12:05:00Z' }] },
  { id: 'g102-3333-4444-5555', golden_patient_id: '1df3e46e-5607-4bc8-b1f7-55c632242696', confidence_score: 0.87, resolution_status: 'MANUAL_REVIEW', resolved_by: null, resolved_at: null, notes: 'Pending clinician confirmation on surname hyphenation.', created_at: '2026-09-12T15:05:00Z', updated_at: '2026-09-12T15:05:00Z', patient_name: 'Sarah Jenkins', patient_dob: '1975-12-10', patient_gender: 'female', source_links: [{ id: 'sl-3', mpi_id: 'g102-3333-4444-5555', source_patient_id: '1df3e46e-5607-4bc8-b1f7-55c632242696', link_weight: 0.87, created_at: '2026-09-12T15:05:00Z' }] },
];

export const sourceSystems = [
  { id: 'ss-1', system_name: 'Epic EHR', system_type: 'EHR', base_url: 'https://epic.hospital.internal/api/v2', is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 'ss-2', system_name: 'LabCorp LIS', system_type: 'LIS', base_url: 'https://labcorp.enterprise.com/fhir', is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 'ss-3', system_name: 'Legacy PDF Archive', system_type: 'PDF', base_url: null, is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 'ss-4', system_name: 'Dictation Voice Feed', system_type: 'VOICE', base_url: null, is_active: true, created_at: '2026-01-01T00:00:00Z' },
];

export const auditLog = [
  { id: 'aud-1', table_name: 'master_patient_index', record_id: 'g101-3333-4444-5555', action: 'INSERT', performed_by: 'ML_AUTO_ENGINE', created_at: '2026-09-10T12:05:00Z' },
  { id: 'aud-2', table_name: 'entity_resolution_candidates', record_id: 'c101-2222-3333-4444', action: 'INSERT', performed_by: 'BLOCKING_PIPELINE', created_at: '2026-09-10T12:00:00Z' },
];

export async function tryBackendProxy(req: Request, subPath: string, search: string = ''): Promise<Response | null> {
  const BACKEND_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8002';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const targetUrl = `${BACKEND_URL}/api/${subPath}${search}`;
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    const ct = req.headers.get('content-type');
    if (ct) headers['Content-Type'] = ct;

    let body: string | undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      try { body = await req.clone().text(); } catch { /* empty */ }
    }

    const res = await fetch(targetUrl, { method: req.method, headers, body, signal: controller.signal });
    clearTimeout(timeoutId);

    // If backend returns 404, 502, 503, or 504 -> treat as unhandled by backend and fall back to local store
    if (res.status === 404 || res.status === 502 || res.status === 503 || res.status === 504) {
      return null;
    }

    const resBody = await res.text();
    return new NextResponse(resBody, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
    });
  } catch {
    return null; // Backend unreachable
  }
}

export function searchPatients(params: {
  q?: string | null;
  phone?: string | null;
  gov_id?: string | null;
  limit?: number;
}): PatientRecord[] {
  let result = [...patients];

  if (params.q) {
    const qLower = params.q.toLowerCase().trim();
    result = result.filter(p =>
      `${p.given_name} ${p.family_name}`.toLowerCase().includes(qLower) ||
      p.fhir_id.toLowerCase().includes(qLower) ||
      p.phone.includes(qLower)
    );
  }

  if (params.phone) {
    result = result.filter(p => p.phone.includes(params.phone!));
  }

  if (params.gov_id) {
    result = result.filter(p => p.fhir_id.toLowerCase().includes(params.gov_id!.toLowerCase()));
  }

  if (params.limit && params.limit > 0) {
    result = result.slice(0, params.limit);
  }

  return result;
}

export function createPatientRecord(body: any): { patient?: PatientRecord; error?: string; status?: number } {
  const givenName = (body.given_name || '').trim();
  const familyName = (body.family_name || '').trim();
  const rawGovId = (body.gov_id || '').trim();

  if (!givenName || !familyName) {
    return { error: 'First name and last name are required.', status: 400 };
  }

  const fhirId = rawGovId || `EHR-${crypto.randomUUID().substring(0, 6).toUpperCase()}`;

  if (rawGovId) {
    const existing = patients.find(p => p.fhir_id.toLowerCase() === rawGovId.toLowerCase());
    if (existing) {
      return {
        error: `Patient with Gov / FHIR ID '${rawGovId}' already exists (${existing.given_name} ${existing.family_name}).`,
        status: 400,
      };
    }
  }

  const newPatient: PatientRecord = {
    id: crypto.randomUUID(),
    fhir_id: fhirId,
    given_name: givenName,
    family_name: familyName,
    dob: body.dob || '2000-01-01',
    gender: body.gender || 'M',
    phone: (body.phone || '').trim(),
    address_line: body.address_line?.trim() || null,
    city: body.city?.trim() || null,
    state: body.state?.trim() || null,
    zip: body.zip?.trim() || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  patients.unshift(newPatient);
  return { patient: newPatient };
}
