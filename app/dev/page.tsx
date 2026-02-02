"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function DevPage() {
  const { data: session } = useSession();

  const [log, setLog] = useState<any>(null);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  const [newTime, setNewTime] = useState("");
  const [search, setSearch] = useState("");

  async function seedDoctor() {
    const res = await fetch("/api/dev/seed-doctor", {
      method: "POST",
    });
    const data = await res.json();
    setLog(data);
  }

  async function fetchAvailability() {
    const res = await fetch(
      `/api/appointments/availability?doctorId=${doctorId}&date=${date}`,
    );
    const data = await res.json();
    setLog(data);
  }

  // book
  async function bookAppointment() {
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorId,
        scheduledAt: slot,
        consultation: "VIDEO",
        patientId: "a9b97998-8715-4e0b-bd81-e8d49f603155",
      }),
    });
    const data = await res.json();
    setLog(data);
  }

  // Cancel
  async function cancelAppointment(id: string) {
    const res = await fetch("/api/appointments/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId: id }),
    });
    const data = await res.json();
    setLog(data);
  }

  // Reschedule
  async function rescheduleAppointment(id: string, newTime: string) {
    const res = await fetch("/api/appointments/reschedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointmentId: id, newScheduledAt: newTime }),
    });
    const data = await res.json();
    setLog(data);
  }

  return (
    <main style={{ padding: 24, fontFamily: "monospace" }}>
      <h1>🧪 Backend Dev Test Page</h1>

      {!session ? (
        <>
          <p>Not logged in</p>
          <button
            onClick={() =>
              signIn("credentials", {
                email: "admin@test.com",
                password: "password123",
                callbackUrl: "/dev",
              })
            }
          >
            AdminLogin
          </button>
          <button
            onClick={() =>
              signIn("credentials", {
                email: "patient@patient.com",
                password: "password123",
                callbackUrl: "/dev",
              })
            }
          >
            PatientLogin
          </button>
        </>
      ) : (
        <>
          <p>
            Logged in as <b>{session.user.email}</b> ({session.user.role})
          </p>
          <button onClick={() => signOut()}>Logout</button>
        </>
      )}

      <hr />

      <div className="flex w-full gap-3">
        <div className="left-sec">
          <h2>Doctor Availability</h2>
          <input
            placeholder="Doctor ID"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button onClick={fetchAvailability}>Fetch Availability</button>

          <hr />

          <h2>Book Appointment</h2>
          <input
            placeholder="Slot ISO time"
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
          />
          <button onClick={bookAppointment}>Book</button>

          <hr />
          <h2>Reschedule / Cancel</h2>
          <input
            placeholder="Appointment ID"
            value={appointmentId}
            onChange={(e) => setAppointmentId(e.target.value)}
          />
          <input
            type="datetime-local"
            placeholder="New time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
          />
          <button onClick={() => rescheduleAppointment(appointmentId, newTime)}>
            Reschedule
          </button>
          <button onClick={() => cancelAppointment(appointmentId)}>
            Cancel
          </button>
          <hr />
        </div>

        <div className="right-sec">
          <h2>Patient Portal</h2>
          <button
            onClick={async () => {
              const res = await fetch("/api/patients/visits");
              const data = await res.json();
              setLog(data);
            }}
          >
            View Visits
          </button>

          <button
            onClick={async () => {
              const res = await fetch("/api/patients/prescriptions");
              const data = await res.json();
              setLog(data);
            }}
          >
            View Prescriptions
          </button>

          <button
            onClick={async () => {
              const res = await fetch("/api/patients/lab");
              const data = await res.json();
              setLog(data);
            }}
          >
            View Labs
          </button>

          <button
            onClick={async () => {
              const res = await fetch("/api/patients/medications");
              const data = await res.json();
              setLog(data);
            }}
          >
            View Medications
          </button>
        </div>
      </div>

      <h2>Pharmacy / Medicines</h2>
      <input
        placeholder="Search medicine"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        onClick={async () => {
          const res = await fetch(`/api/pharmacy/medicines?query=${search}`);
          const data = await res.json();
          setLog(data);
        }}
      >
        Search Medicines
      </button>

      <button
        onClick={async () => {
          const res = await fetch("/api/pharmacy/medicines");
          const data = await res.json();
          setLog(data);
        }}
      >
        List All Medicines
      </button>

      <h2>API Response</h2>
      <pre style={{ background: "#111", color: "#0f0", padding: 16 }}>
        {JSON.stringify(log, null, 2)}
      </pre>
    </main>
  );
}
