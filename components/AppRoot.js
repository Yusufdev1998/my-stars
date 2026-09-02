"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import ClassPicker from "@/components/ClassPicker";
import StarBoard from "@/components/StarBoard";
import TeacherAdmin from "@/components/TeacherAdmin";

const LAST_CLASS_KEY = "yulduzlar-last-class";

export default function AppRoot() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTeachers, setShowTeachers] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const me = await api.me();
        setSession(me);
        const res = await api.listClasses();
        setClasses(res.classes);
        const last = typeof window !== "undefined" ? localStorage.getItem(LAST_CLASS_KEY) : null;
        if (last && res.classes.some((c) => c.id === last)) {
          setSelectedId(last);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const logout = async () => {
    try {
      await api.logout();
    } catch {}
    router.push("/login");
    router.refresh();
  };

  const selectClass = (id) => {
    setSelectedId(id);
    try {
      localStorage.setItem(LAST_CLASS_KEY, id);
    } catch {}
  };

  const handleCreated = (created) => {
    setClasses((cs) => [...cs, created]);
    selectClass(created.id);
  };

  const handleDeleted = (id) => {
    setClasses((cs) => cs.filter((c) => c.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
      try {
        localStorage.removeItem(LAST_CLASS_KEY);
      } catch {}
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center text-white"
        style={{ background: "#0a0c26" }}
      >
        <p style={{ color: "#8A85C4" }}>Yuklanmoqda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center text-white px-6 text-center"
        style={{ background: "#0a0c26" }}
      >
        <div>
          <p className="mb-2" style={{ color: "#FF9B9B" }}>{error}</p>
          <p className="text-sm" style={{ color: "#8A85C4" }}>
            MONGODB_URI to&apos;g&apos;ri sozlanganini tekshiring (README.md).
          </p>
        </div>
      </div>
    );
  }

  const selected = classes.find((c) => c.id === selectedId);

  return (
    <>
      {!selected ? (
        <ClassPicker
          classes={classes}
          session={session}
          onSelect={selectClass}
          onCreated={handleCreated}
          onDeleted={handleDeleted}
          onLogout={logout}
          onManageTeachers={() => setShowTeachers(true)}
        />
      ) : (
        <StarBoard
          classId={selected.id}
          className={selected.name}
          onSwitchClass={() => setSelectedId(null)}
        />
      )}
      {showTeachers && <TeacherAdmin onClose={() => setShowTeachers(false)} />}
    </>
  );
}
