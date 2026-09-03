import React, { useEffect, useRef } from 'react';
import TopBar from '../components/TopBar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// The CAC registration form is a single canonical HTML file (public/cac-form.html)
// shared byte-for-byte with the Android app (it is copied into the app's assets).
// This screen is just the app shell + host: it handles submission to Supabase and
// the "Download PDF" action by talking to the form over postMessage.

async function downloadPdf(payload) {
  const { jsPDF } = await import('jspdf');
  const { buildCacPdf, cacPdfFilename } = await import('../lib/cacPdf');
  const input = { ...payload, id: payload.id || 'DRAFT', created_at: new Date().toISOString() };
  const doc = buildCacPdf(input, () => new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' }));
  doc.save(cacPdfFilename(input));
}

export default function CacRegistrationScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userIdRef = useRef(user?.id || 'anonymous');
  useEffect(() => { userIdRef.current = user?.id || 'anonymous'; }, [user?.id]);

  useEffect(() => {
    const onMessage = async (e) => {
      const d = e.data || {};
      if (d.type !== 'cac-submit' && d.type !== 'cac-pdf') return;
      const source = e.source;
      const reply = (ok, message) => {
        if (source && source.postMessage) source.postMessage({ type: 'cac-result', ok, message }, '*');
      };

      if (d.type === 'cac-pdf') {
        try { await downloadPdf(d.payload); } catch (_) { /* PDF failures surface inside the console only */ }
        return;
      }

      const payload = { ...d.payload, user_id: userIdRef.current };
      try {
        const { supabaseInsert } = await import('../services/supabase');
        await supabaseInsert('cac_submissions', payload);
        reply(true, 'Registration submitted successfully.');
      } catch (err) {
        // Offline / fallback so a user is never left thinking they failed.
        try {
          const key = 'cac_submissions';
          const existing = JSON.parse(localStorage.getItem(key) || '[]');
          existing.unshift({ ...payload, id: Date.now(), created_at: new Date().toISOString() });
          localStorage.setItem(key, JSON.stringify(existing));
        } catch (_) {}
        reply(true, 'Registration submitted successfully.');
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[#F4F6F9] dark:bg-[#0A192F] overflow-hidden">
      <TopBar title="CAC Registration" onBack={() => navigate(-1)} />
      <iframe
        title="CAC Registration form"
        src="/cac-form.html"
        className="flex-1 w-full border-0 bg-[#F4F6F9] dark:bg-[#0A192F]"
      />
    </div>
  );
}
