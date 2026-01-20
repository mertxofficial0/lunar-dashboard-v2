import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayoutV2 from "./components/v2/AppLayoutV2";

import DashboardV2 from "./components/v2/DashboardV2";
import DailyJournalV2 from "./components/v2/DailyJournalV2";


import "./App.css";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";



import Landing from "./components/Landing";
import LoginScreen from "./components/LoginScreen";
import { Sidebar } from "./components/Sidebar";
import JournalView from "./components/JournalView";
import ProfileView from "./components/ProfileView";

import type { User } from "@supabase/supabase-js";
import type { Trade, NewTrade } from "./types";

import { getTrades, addTrade, deleteTrade } from "./lib/trades";
import { supabase } from "./lib/supabase";

const DESIGN_MODE = true;

/* DB → UI */
const mapDbTradeToTrade = (db: any): Trade => ({
  id: db.id,
  date: db.date,
  pair: db.pair,
  direction: db.direction,
  session: db.session,
  strategy: db.strategy,
  risk: Number(db.risk),
  resultUsd: Number(db.result_usd),
  resultR: Number(db.result_r),
  setupTag: db.setup_tag ?? undefined,
  mood: db.mood ?? undefined,
  screenshotUrl: db.screenshot_url ?? undefined,
  notes: db.notes ?? undefined,
  user_id: db.user_id,
});

type Stage = "loading" | "landing" | "login" | "app";

function App() {
  // 🔥 SADECE TASARIM MODU
  if (DESIGN_MODE) {
  return (
    <Routes>
      <Route element={<AppLayoutV2 />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardV2 />} />
        <Route path="/daily-journal" element={<DailyJournalV2 />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

  /* ----- AŞAĞISI NORMAL APP (ŞİMDİLİK KULLANILMIYOR) ----- */

  const [stage, setStage] = useState<Stage>("loading");
  const [loginMode, setLoginMode] = useState<"login" | "register">("login");
  const [page, setPage] = useState<"dashboard" | "journal" | "profile">("dashboard");
  const [loggingOut, setLoggingOut] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);

  const authTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const journalRef = useRef<HTMLDivElement>(null);

  /* 🔐 AUTH + 4sn SAHTE BEKLEME */
  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;

      const u = data.session?.user ?? null;
      setUser(u);
      setStage(u ? "app" : "landing");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);

      if (authTimer.current) clearTimeout(authTimer.current);

      if (u) {
        authTimer.current = setTimeout(() => {
          setStage("app");
        }, 4000);
      } else {
        setStage("landing");
      }
    });

    return () => {
      isMounted = false;
      if (authTimer.current) clearTimeout(authTimer.current);
      listener?.subscription.unsubscribe();
    };
  }, []);

  /* 📥 TRADES */
  useEffect(() => {
    if (!user) return;

    getTrades(user.id).then(setTrades).catch(console.error);
  }, [user]);

  /* 🔄 REALTIME */
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("trades-realtime")
      .on(
        "postgres_changes",
        { schema: "public", table: "trades", event: "*" },
        (payload) => {
          const n = payload.new as any;
          const o = payload.old as any;
          const uid = n?.user_id ?? o?.user_id;

          if (uid !== user.id) return;

          if (payload.eventType === "INSERT")
            setTrades((p) => [mapDbTradeToTrade(n), ...p]);

          if (payload.eventType === "UPDATE")
            setTrades((p) =>
              p.map((t) => (t.id === n.id ? mapDbTradeToTrade(n) : t))
            );

          if (payload.eventType === "DELETE")
            setTrades((p) => p.filter((t) => t.id !== o.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  /* ➕ / ❌ */
  const handleAddTrade = useCallback(
    async (t: NewTrade) => {
      if (!user) return;
      await addTrade({ ...t, user_id: user.id });
    },
    [user]
  );

  const handleDeleteTrade = useCallback(async (id: string) => {
    setTrades((p) => p.filter((t) => t.id !== id));
    await deleteTrade(id);
  }, []);

  /* 📊 STATS */
  const stats = useMemo(() => {
    const total = trades.length;
    const wins = trades.filter((t) => t.resultUsd > 0).length;
    const losses = trades.filter((t) => t.resultUsd < 0).length;
    const totalUsd = trades.reduce((a, b) => a + b.resultUsd, 0);
    const totalR = trades.reduce((a, b) => a + b.resultR, 0);

    return {
      total,
      wins,
      losses,
      totalUsd,
      totalR,
      winrate: total ? (wins / total) * 100 : 0,
      avgR: total ? totalR / total : 0,
      profitFactor:
        losses === 0
          ? wins
          : Math.abs(
              trades.filter((t) => t.resultUsd > 0).reduce((a, b) => a + b.resultUsd, 0) /
                trades.filter((t) => t.resultUsd < 0).reduce((a, b) => a + b.resultUsd, 0)
            ),
    };
  }, [trades]);

  /* 🚪 LOGOUT (3sn delay + spinner) */
const handleLogout = () => {
  if (loggingOut) return;

  setLoggingOut(true);

  setTimeout(async () => {
    await supabase.auth.signOut(); // ✅ gerçek logout
    setUser(null);
    setLoggingOut(false);
    setStage("landing"); // ✅ login / register ekranı
  }, 3000);
};



  /* 🧠 RENDER */
 

  if (stage === "landing")
    return (
      <Landing
        onLogin={(mode) => {
          setLoginMode(mode ?? "login");
          setStage("login");
        }}
      />
    );

  if (stage === "login")
    return (
      <LoginScreen
        initialMode={loginMode}
        onBack={() => setStage("landing")}
        onSuccess={() => {}}
      />
    );

  /* APP */
  return (
    <div className="flex h-screen w-screen gap-6 px-6 py-6 bg-gradient-to-br from-[#eef2ff] via-[#f5f3ff] to-[#ffe4f5]">
      <Sidebar
  current={page}
  onChange={setPage}
  onLogout={handleLogout}
  loggingOut={loggingOut}
/>


      <main className="flex-1 relative overflow-hidden rounded-[32px] bg-white/12 backdrop-blur-xl border border-white/35 shadow-[0_12px_30px_rgba(15,23,42,0.30)] p-8">

        


        {page === "journal" && (
          <div ref={journalRef} className="absolute inset-0 overflow-y-auto">
            <JournalView
              trades={trades}
              stats={stats}
              onAddTrade={handleAddTrade}
              onDeleteTrade={handleDeleteTrade}
            />
          </div>
        )}
        {page === "profile" && (
  <div className="absolute inset-0 overflow-y-auto">
    <ProfileView />
  </div>
)}

      </main>
    </div>
  );
}

export default React.memo(App);
