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
    <main
      style={{ padding: 24, fontFamily: "monospace" }}
      className="bg-neutral-800 min-h-screen flex flex-col gap-3 justify-start items-start"
    >
      <h1 className="text-4xl font-bold">Backend Dev Test Page</h1>
      <div className="w-full flex flex-col gap-2 flex-wrap">
        {/* Login/Logout */}
        <div className="size-fit flex flex-col gap-3 border border-white rounded-xl p-4 items-start ">
          {!session ? (
            <>
              <p className="text-sm italic text-neutral-500">Not logged in</p>
              <div className="flex gap-3 items-center justify-around">
                <button
                  className="border border-neutral-400 rounded-3xl px-2 py-1 cursor-pointer hover:bg-neutral-400 hover:text-neutral-800 transition duration-300 ease-in-out"
                  onClick={() =>
                    signIn("credentials", {
                      email: "admin@test.com",
                      password: "password123",
                      callbackUrl: "/dev",
                    })
                  }
                >
                  Admin-Login
                </button>
                <button
                  className="border border-neutral-400 rounded-3xl px-2 py-1 cursor-pointer hover:bg-neutral-400 hover:text-neutral-800 transition duration-300 ease-in-out"
                  onClick={() =>
                    signIn("credentials", {
                      email: "patient@patient.com",
                      password: "password123",
                      callbackUrl: "/dev",
                    })
                  }
                >
                  Patient-Login
                </button>
                <button
                  className="border border-neutral-400 rounded-3xl px-2 py-1 cursor-pointer hover:bg-neutral-400 hover:text-neutral-800 transition duration-300 ease-in-out"
                  onClick={() =>
                    signIn("credentials", {
                      email: "doctor@doctor.com",
                      password: "password123",
                      callbackUrl: "/dev",
                    })
                  }
                >
                  Doctor-Login
                </button>
              </div>
            </>
          ) : (
            <>
              <p>
                Logged in as <b>{session.user.email}</b> ({session.user.role})
              </p>
              <button
                className="border border-red-400 rounded-lg px-2 py-1 cursor-pointer hover:bg-red-400/70 hover:text-neutral-800 transition duration-300 ease-in-out"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Appointment */}
        <div className="w-1/2 flex gap-3">
          <div className="border border-white rounded-lg px-3 py-1 w-full grid grid-cols-2 space-y-12 py-6 relative">
            <div className="flex flex-col gap-4 items-start">
              <h2 className="text-lg mt-4 underline underline-offset-4">
                Doctor Availability
              </h2>
              <input
                className="min-w-56 w-fit border-b border-neutral-400 px-2 py-1 cursor-pointer hover:bg-neutral-400 hover:text-neutral-800 transition duration-300 ease-in-out"
                placeholder="Doctor ID"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
              />
              <input
                className="min-w-56 w-fit border border-neutral-400 rounded px-2 py-4 cursor-pointer hover:bg-neutral-400 hover:text-neutral-800 transition duration-300 ease-in-out"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <button
                className="border border-neutral-400 rounded px-2 py-1 cursor-pointer hover:bg-neutral-400 hover:text-neutral-800 transition duration-300 ease-in-out"
                onClick={fetchAvailability}
              >
                Fetch Availability
              </button>
            </div>

            <div className="flex flex-col gap-4 items-start">
              <h2 className="text-lg mt-4 underline underline-offset-4">
                Book Appointment
              </h2>
              <input
                className="min-w-56 w-fit border-b border-neutral-400 px-2 py-1 cursor-pointer hover:bg-neutral-400 hover:text-neutral-800 transition duration-300 ease-in-out"
                placeholder="Slot ISO time"
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
              />
              <button
                className="border border-neutral-400 rounded px-2 py-1 cursor-pointer hover:bg-neutral-400 hover:text-neutral-800 transition duration-300 ease-in-out"
                onClick={bookAppointment}
              >
                Book
              </button>
            </div>

            <div className="flex flex-col gap-4 items-start">
              <h2 className="text-lg mt-4 underline underline-offset-4">
                Reschedule / Cancel
              </h2>
              <input
                className="min-w-56 w-fit border-b border-neutral-400 px-2 py-1 cursor-pointer hover:bg-neutral-400 hover:text-neutral-800 transition duration-300 ease-in-out"
                placeholder="Appointment ID"
                value={appointmentId}
                onChange={(e) => setAppointmentId(e.target.value)}
              />
              <input
                className="min-w-56 w-fit border border-neutral-400 rounded px-2 py-4 cursor-pointer hover:bg-neutral-400 hover:text-neutral-800 transition duration-300 ease-in-out"
                type="datetime-local"
                placeholder="New time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
              <div className="flex gap-4">
                <button
                  className="border border-neutral-400 rounded px-2 py-1 cursor-pointer hover:bg-neutral-400 hover:text-neutral-800 transition duration-300 ease-in-out"
                  onClick={() => rescheduleAppointment(appointmentId, newTime)}
                >
                  Reschedule
                </button>
                <button
                  className="border border-red-400 rounded-lg px-2 py-1 cursor-pointer hover:bg-red-400/70 hover:text-neutral-800 transition duration-300 ease-in-out"
                  onClick={() => cancelAppointment(appointmentId)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pharmacy */}
        <div className="w-1/2 border border-white rounded px-3 pb-12 pt-4 h-fit">
          <h2 className="text-xl my-8 underline underline-offset-4">
            Pharmacy / Medicines
          </h2>
          <input
            className="min-w-56 w-fit border-b border-neutral-400 px-2 py-1 cursor-pointer hover:bg-neutral-400 hover:text-neutral-800 transition duration-300 ease-in-out"
            placeholder="Search medicine"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-4 mt-4">
            <button
              className="min-w-36 w-fit border border-neutral-400 rounded-3xl px-2 py-1 cursor-pointer hover:bg-neutral-400 hover:text-neutral-800 transition duration-300 ease-in-out"
              onClick={async () => {
                const res = await fetch(
                  `/api/pharmacy/medicines?query=${search}`,
                );
                const data = await res.json();
                setLog(data);
              }}
            >
              Search Medicines
            </button>

            <button
              className="min-w-36 w-fit border border-neutral-400 rounded-3xl px-2 py-1 cursor-pointer hover:bg-neutral-400 hover:text-neutral-800 transition duration-300 ease-in-out"
              onClick={async () => {
                const res = await fetch("/api/pharmacy/medicines");
                const data = await res.json();
                setLog(data);
              }}
            >
              List All Medicines
            </button>
          </div>

          <h2 className="text-xl my-8 underline underline-offset-4">
            Admin Dashboard
          </h2>
          <div className="flex gap-2">
            <button
              className="min-w-36 w-fit border border-neutral-400 rounded-3xl px-2 py-1 cursor-pointer hover:bg-neutral-400 hover:text-neutral-800 transition duration-300 ease-in-out"
              onClick={async () => {
                const res = await fetch("/api/admin/stats");
                setLog(await res.json());
              }}
            >
              Admin Stats
            </button>

            <button
              className="min-w-36 w-fit border border-neutral-400 rounded-3xl px-2 py-1 cursor-pointer hover:bg-neutral-400 hover:text-neutral-800 transition duration-300 ease-in-out"
              onClick={async () => {
                const res = await fetch("/api/admin/appointments");
                setLog(await res.json());
              }}
            >
              All Appointments
            </button>

            <button
              className="min-w-36 w-fit border border-neutral-400 rounded-3xl px-2 py-1 cursor-pointer hover:bg-neutral-400 hover:text-neutral-800 transition duration-300 ease-in-out"
              onClick={async () => {
                const res = await fetch("/api/admin/patients");
                setLog(await res.json());
              }}
            >
              All Patients
            </button>

            <button
              className="min-w-36 w-fit border border-neutral-400 rounded-3xl px-2 py-1 cursor-pointer hover:bg-neutral-400 hover:text-neutral-800 transition duration-300 ease-in-out"
              onClick={async () => {
                const res = await fetch("/api/admin/medicines");
                setLog(await res.json());
              }}
            >
              All Medicines
            </button>
          </div>
        </div>

        {/* Patient */}
        <div className="w-1/2 border border-white rounded px-3 pb-12 pt-4 h-fit">
          <h2 className="text-xl my-8 underline underline-offset-4">
            Patient Portal
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <button
              className="min-w-56 w-fit border border-neutral-400 rounded-3xl px-2 py-1 cursor-pointer hover:bg-neutral-400 hover:text-neutral-800 transition duration-300 ease-in-out"
              onClick={async () => {
                const res = await fetch("/api/patients/visits");
                const data = await res.json();
                setLog(data);
              }}
            >
              View Visits
            </button>

            <button
              className="min-w-56 w-fit border border-neutral-400 rounded-3xl px-2 py-1 cursor-pointer hover:bg-neutral-400 hover:text-neutral-800 transition duration-300 ease-in-out"
              onClick={async () => {
                const res = await fetch("/api/patients/prescriptions");
                const data = await res.json();
                setLog(data);
              }}
            >
              View Prescriptions
            </button>

            <button
              className="min-w-56 w-fit border border-neutral-400 rounded-3xl px-2 py-1 cursor-pointer hover:bg-neutral-400 hover:text-neutral-800 transition duration-300 ease-in-out"
              onClick={async () => {
                const res = await fetch("/api/patients/lab");
                const data = await res.json();
                setLog(data);
              }}
            >
              View Labs
            </button>

            <button
              className="min-w-56 w-fit border border-neutral-400 rounded-3xl px-2 py-1 cursor-pointer hover:bg-neutral-400 hover:text-neutral-800 transition duration-300 ease-in-out"
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

        {/* Doctor */}
        <div className="w-1/2 border border-white rounded px-3 pb-12 pt-4 h-fit">
          <button
            className="border border-neutral-400 rounded-3xl px-2 py-1 cursor-pointer hover:bg-neutral-400 hover:text-neutral-800 transition duration-300 ease-in-out"
            onClick={async () => {
              const res = await fetch("/api/appointments");
              setLog(await res.json());
            }}
          >
            Show my appointments[Doc pov]
          </button>
        </div>

        <div className="flex flex-col w-full">
          <h2>API Response</h2>
          <pre style={{ background: "#111", color: "#0f0", padding: 16 }}>
            {JSON.stringify(log, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}
