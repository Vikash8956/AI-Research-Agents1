"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiBell, FiKey, FiSave, FiTrash2 } from "react-icons/fi";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import toast from "react-hot-toast";

const INTERESTS = ["Machine Learning", "NLP", "Computer Vision", "Bioinformatics", "Quantum Computing", "Robotics", "Climate Science", "Materials Science", "Neuroscience", "Physics"];

export default function SettingsPage() {
  const { user, fetchProfile } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [interests, setInterests] = useState<string[]>([]);
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const toggleInterest = (i: string) => setInterests((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/profile", { name, researchInterests: interests, notificationsEnabled: notifications });
      await fetchProfile();
      toast.success("Settings saved!");
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: FiUser },
    { id: "notifications", label: "Notifications", icon: FiBell },
    { id: "api", label: "API Keys", icon: FiKey },
    { id: "danger", label: "Danger Zone", icon: FiTrash2 },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Settings</h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Manage your account, preferences, and integrations</p>
      </motion.div>

      <div style={{ display: "flex", gap: 24 }}>
        {/* Tab list */}
        <div style={{ width: 180, flexShrink: 0 }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", marginBottom: 4, background: activeTab === t.id ? "rgba(79,70,229,0.2)" : "transparent", border: `1px solid ${activeTab === t.id ? "rgba(79,70,229,0.3)" : "transparent"}`, borderRadius: 10, color: activeTab === t.id ? "#a5b4fc" : "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer", textAlign: "left" }}>
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, padding: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16 }}>
          {activeTab === "profile" && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 20 }}>Profile Information</h3>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>Full Name</label>
                <div style={{ position: "relative" }}>
                  <FiUser style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)" }} size={15} />
                  <input value={name} onChange={(e) => setName(e.target.value)}
                    style={{ width: "100%", padding: "11px 11px 11px 38px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>Email</label>
                <div style={{ position: "relative" }}>
                  <FiMail style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)" }} size={15} />
                  <input value={user?.email || ""} readOnly
                    style={{ width: "100%", padding: "11px 11px 11px 38px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "rgba(255,255,255,0.5)", fontSize: 14, outline: "none", boxSizing: "border-box", cursor: "not-allowed" }} />
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 12 }}>Research Interests</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {INTERESTS.map((i) => (
                    <button key={i} onClick={() => toggleInterest(i)}
                      style={{ padding: "6px 14px", background: interests.includes(i) ? "rgba(79,70,229,0.25)" : "rgba(255,255,255,0.04)", border: `1px solid ${interests.includes(i) ? "rgba(79,70,229,0.5)" : "rgba(255,255,255,0.08)"}`, borderRadius: 20, color: interests.includes(i) ? "#a5b4fc" : "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer" }}>
                      {i}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={save} disabled={saving}
                style={{ padding: "10px 24px", background: "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                <FiSave size={14} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 20 }}>Notification Preferences</h3>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>Email Notifications</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Receive updates about your research activity</div>
                </div>
                <button onClick={() => setNotifications(!notifications)}
                  style={{ width: 48, height: 26, background: notifications ? "#4F46E5" : "rgba(255,255,255,0.1)", borderRadius: 13, border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                  <div style={{ position: "absolute", width: 20, height: 20, background: "#fff", borderRadius: "50%", top: 3, left: notifications ? 25 : 3, transition: "left 0.2s" }} />
                </button>
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 8 }}>API Configuration</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 20, lineHeight: 1.7 }}>Configure your IBM watsonx.ai credentials in the <code style={{ background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>.env</code> file on the backend server.</p>
              {[
                { label: "IBM watsonx.ai API Key", key: "IBM_WATSONX_API_KEY", hint: "Found in IBM Cloud → Manage → Access" },
                { label: "IBM Project ID", key: "IBM_WATSONX_PROJECT_ID", hint: "Found in watsonx.ai project settings" },
                { label: "MongoDB URI", key: "MONGO_URI", hint: "MongoDB Atlas → Connect → Drivers" },
              ].map((item) => (
                <div key={item.key} style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>{item.label}</label>
                  <input readOnly value={`Set in backend .env as ${item.key}`}
                    style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, color: "rgba(255,255,255,0.4)", fontSize: 12, outline: "none", fontFamily: "monospace", boxSizing: "border-box" }} />
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{item.hint}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "danger" && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#EF4444", marginBottom: 8 }}>Danger Zone</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>These actions are irreversible. Please be certain.</p>
              <div style={{ padding: 20, border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Delete Account</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Permanently delete your account and all data</div>
                </div>
                <button onClick={() => toast.error("Contact support to delete account")}
                  style={{ padding: "8px 18px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, color: "#EF4444", fontSize: 13, cursor: "pointer" }}>
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
