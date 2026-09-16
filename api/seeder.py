"""
Auto-seeder for local SQLite database when PostgreSQL is not present.
Provides rich demonstration data for the Master Patient Index and Clinical Intelligence platform.
"""

import uuid
import datetime
import hashlib
from models import (
    Base, SourceSystem, FHIRPatient, FHIRObservation, FHIRMedication,
    EntityResolutionCandidate, MasterPatientIndex, MPISourceLink,
    Appointment, AuditLog
)

def sha256_hash(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()

def seed_database(db):
    # Check if already seeded
    if db.query(FHIRPatient).first():
        return

    print("[Seeder] Populating database with realistic clinical demonstration records...")

    # 1. Source Systems
    epic = SourceSystem(
        id=uuid.uuid4(),
        system_name="Epic EHR",
        system_type="EHR",
        base_url="https://epic.hospital.internal/api/v2",
        is_active=True
    )
    labcorp = SourceSystem(
        id=uuid.uuid4(),
        system_name="LabCorp LIS",
        system_type="LIS",
        base_url="https://labcorp.enterprise.com/fhir",
        is_active=True
    )
    pdf_arch = SourceSystem(
        id=uuid.uuid4(),
        system_name="Legacy PDF Archive",
        system_type="PDF",
        base_url=None,
        is_active=True
    )
    voice_sys = SourceSystem(
        id=uuid.uuid4(),
        system_name="Dictation Voice Feed",
        system_type="VOICE",
        base_url=None,
        is_active=True
    )
    db.add_all([epic, labcorp, pdf_arch, voice_sys])
    db.flush()

    # 2. Patients
    p1 = FHIRPatient(
        id=uuid.uuid4(),
        fhir_id="EHR-1001",
        given_name="John",
        family_name="Doe",
        dob=datetime.date(1990, 1, 1),
        gender="male",
        phone="788-293-8477",
        address_line="123 Maple St, Apt 4B",
        city="Springfield",
        state="IL",
        zip="62701",
        ssn_hash=sha256_hash("123-45-6789"),
        name_soundex="J500",
        name_nysiis="JAN",
        created_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=120),
        updated_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=10),
    )

    p2 = FHIRPatient(
        id=uuid.uuid4(),
        fhir_id="LAB-2004",
        given_name="Jon",
        family_name="Doe",
        dob=datetime.date(1990, 1, 1),
        gender="male",
        phone="788-293-8477",
        address_line="123 Maple Street",
        city="Springfield",
        state="IL",
        zip="62701",
        ssn_hash=sha256_hash("123-45-6789"),
        name_soundex="J500",
        name_nysiis="JAN",
        created_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=90),
        updated_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=5),
    )

    p3 = FHIRPatient(
        id=uuid.uuid4(),
        fhir_id="EHR-1002",
        given_name="Sarah",
        family_name="Jenkins",
        dob=datetime.date(1975, 12, 10),
        gender="female",
        phone="617-555-0987",
        address_line="88 Summer St",
        city="Boston",
        state="MA",
        zip="02110",
        ssn_hash=sha256_hash("987-65-4321"),
        name_soundex="S600",
        name_nysiis="SARAN",
        created_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=200),
        updated_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=2),
    )

    p4 = FHIRPatient(
        id=uuid.uuid4(),
        fhir_id="LAB-2008",
        given_name="Sarah",
        family_name="Jenkins-Smythe",
        dob=datetime.date(1975, 12, 10),
        gender="female",
        phone="617-555-0987",
        address_line="88 Summer Street, Suite 3",
        city="Boston",
        state="MA",
        zip="02110",
        ssn_hash=sha256_hash("987-65-4321"),
        name_soundex="S600",
        name_nysiis="SARAN",
        created_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=60),
        updated_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=1),
    )

    p5 = FHIRPatient(
        id=uuid.uuid4(),
        fhir_id="EHR-1003",
        given_name="Robert",
        family_name="Miller",
        dob=datetime.date(1982, 8, 15),
        gender="male",
        phone="415-555-1212",
        address_line="500 Market St",
        city="San Francisco",
        state="CA",
        zip="94105",
        ssn_hash=sha256_hash("456-78-9012"),
        name_soundex="R163",
        name_nysiis="RABART",
        created_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=300),
        updated_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=15),
    )

    p6 = FHIRPatient(
        id=uuid.uuid4(),
        fhir_id="EHR-1004",
        given_name="Eleanor",
        family_name="Vance",
        dob=datetime.date(1968, 3, 22),
        gender="female",
        phone="206-555-4321",
        address_line="742 Evergreen Terrace",
        city="Seattle",
        state="WA",
        zip="98101",
        ssn_hash=sha256_hash("345-67-8901"),
        name_soundex="E456",
        name_nysiis="ELANAR",
        created_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=400),
        updated_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=3),
    )

    p7 = FHIRPatient(
        id=uuid.uuid4(),
        fhir_id="EHR-1005",
        given_name="Michael",
        family_name="Parker",
        dob=datetime.date(1992, 11, 30),
        gender="male",
        phone="303-555-9000",
        address_line="100 High St",
        city="Denver",
        state="CO",
        zip="80202",
        ssn_hash=sha256_hash("234-56-7890"),
        name_soundex="M240",
        name_nysiis="MACAL",
        created_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=150),
        updated_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=20),
    )

    db.add_all([p1, p2, p3, p4, p5, p6, p7])
    db.flush()

    # 3. Observations
    obs = [
        FHIRObservation(
            id=uuid.uuid4(),
            patient_id=p1.id,
            obs_type="Vitals",
            obs_code="BP_SYS",
            obs_value="128",
            obs_unit="mmHg",
            obs_datetime=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=10),
            notes_text="Blood pressure stable under Metformin regimen.",
            embedding_status="DONE"
        ),
        FHIRObservation(
            id=uuid.uuid4(),
            patient_id=p1.id,
            obs_type="Lab",
            obs_code="GLUCOSE",
            obs_value="140",
            obs_unit="mg/dL",
            obs_datetime=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=10),
            notes_text="Fasting glucose elevated. Patient counseling recommended.",
            embedding_status="DONE"
        ),
        FHIRObservation(
            id=uuid.uuid4(),
            patient_id=p3.id,
            obs_type="Lab",
            obs_code="HBA1C",
            obs_value="5.6",
            obs_unit="%",
            obs_datetime=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=2),
            notes_text="Normal glycemic control maintained.",
            embedding_status="DONE"
        ),
        FHIRObservation(
            id=uuid.uuid4(),
            patient_id=p5.id,
            obs_type="Vitals",
            obs_code="HR",
            obs_value="74",
            obs_unit="bpm",
            obs_datetime=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=15),
            notes_text="Resting heart rate normal.",
            embedding_status="DONE"
        ),
    ]
    db.add_all(obs)

    # 4. Medications
    meds = [
        FHIRMedication(
            id=uuid.uuid4(),
            patient_id=p1.id,
            medication_name="Metformin Hydrochloride",
            dosage="500 mg",
            frequency="Twice daily with meals",
            start_date=datetime.date(2022, 5, 1),
            prescriber="Dr. Emily Chen, MD"
        ),
        FHIRMedication(
            id=uuid.uuid4(),
            patient_id=p3.id,
            medication_name="Lisinopril",
            dosage="10 mg",
            frequency="Once daily in morning",
            start_date=datetime.date(2021, 8, 14),
            prescriber="Dr. Mark Goldberg, MD"
        ),
        FHIRMedication(
            id=uuid.uuid4(),
            patient_id=p5.id,
            medication_name="Atorvastatin",
            dosage="20 mg",
            frequency="Once daily at bedtime",
            start_date=datetime.date(2023, 1, 10),
            prescriber="Dr. Emily Chen, MD"
        ),
    ]
    db.add_all(meds)

    # 5. Duplicate Candidates
    cand1 = EntityResolutionCandidate(
        id=uuid.uuid4(),
        record_a_id=p1.id,
        record_b_id=p2.id,
        blocking_key="J500_19900101",
        soundex_score=1.0,
        nysiis_score=1.0,
        dob_match=True,
        ssn_partial_match=True,
        vector_similarity=0.96,
        composite_score=0.97,
        created_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=5),
    )
    cand2 = EntityResolutionCandidate(
        id=uuid.uuid4(),
        record_a_id=p3.id,
        record_b_id=p4.id,
        blocking_key="S600_19751210",
        soundex_score=0.95,
        nysiis_score=0.92,
        dob_match=True,
        ssn_partial_match=True,
        vector_similarity=0.91,
        composite_score=0.94,
        created_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=2),
    )
    db.add_all([cand1, cand2])
    db.flush()

    # 6. Master Patient Index (Golden Records)
    mpi1 = MasterPatientIndex(
        id=uuid.uuid4(),
        golden_patient_id=p1.id,
        confidence_score=0.98,
        resolution_status="CONFIRMED",
        resolved_by="AutoMatch Engine v2",
        resolved_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=5),
        notes="Merged records from Epic EHR and LabCorp based on exact SSN, DOB, and phone alignment.",
        created_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=5),
        updated_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=5),
    )
    mpi2 = MasterPatientIndex(
        id=uuid.uuid4(),
        golden_patient_id=p3.id,
        confidence_score=0.94,
        resolution_status="MANUAL_REVIEW",
        resolved_by=None,
        resolved_at=None,
        notes="Awaiting clinician verification for hyphenated family name match.",
        created_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=2),
        updated_at=datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=2),
    )
    db.add_all([mpi1, mpi2])
    db.flush()

    # Links
    link1 = MPISourceLink(
        id=uuid.uuid4(),
        mpi_id=mpi1.id,
        source_patient_id=p1.id,
        link_weight=1.0
    )
    link2 = MPISourceLink(
        id=uuid.uuid4(),
        mpi_id=mpi1.id,
        source_patient_id=p2.id,
        link_weight=0.97
    )
    link3 = MPISourceLink(
        id=uuid.uuid4(),
        mpi_id=mpi2.id,
        source_patient_id=p3.id,
        link_weight=1.0
    )
    db.add_all([link1, link2, link3])

    # 7. Appointments
    appts = [
        Appointment(
            id=uuid.uuid4(),
            patient_id=p1.id,
            clinician_name="Dr. Emily Chen, MD",
            title="Endocrinology Follow-up",
            appointment_date=datetime.date(2026, 9, 20),
            appointment_time="10:30 AM",
            status="SCHEDULED",
            notes="Quarterly diabetes management check."
        ),
        Appointment(
            id=uuid.uuid4(),
            patient_id=p3.id,
            clinician_name="Dr. Mark Goldberg, MD",
            title="Cardiology Consult",
            appointment_date=datetime.date(2026, 9, 22),
            appointment_time="02:00 PM",
            status="SCHEDULED",
            notes="Blood pressure medication adjustment."
        ),
    ]
    db.add_all(appts)

    # 8. Audit Log
    audit = [
        AuditLog(
            id=uuid.uuid4(),
            action="INSERT",
            table_name="system",
            record_id=uuid.uuid4(),
            performed_by="system",
            new_value={"status": "Database initialized with Master Patient Index pipeline"}
        ),
        AuditLog(
            id=uuid.uuid4(),
            action="MANUAL_REVIEW",
            table_name="master_patient_index",
            record_id=mpi1.id,
            performed_by="AutoMatch Engine v2",
            new_value={"status": "CONFIRMED", "confidence": 0.98}
        ),
    ]
    db.add_all(audit)

    db.commit()
    print("[Seeder] Successfully seeded initial demonstration data!")
