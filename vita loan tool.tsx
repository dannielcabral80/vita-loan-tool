import { useState, useEffect } from "react";

// ─── Vita' la Pizza — Programa de Préstamos / Employee Loan Program ───
// Built by Danniel Cabral with Claude.
// Interest-free loans repaid via fixed payroll deductions.

const T = {
  es: {
    brand: "Vita' la Pizza",
    program: "Programa de Préstamos sin Interés",
    tagline: "Cada pago completa una porción.",
    setupTitle: "Configura el préstamo",
    amount: "Monto del préstamo (RD$)",
    payment: "Cuota fija por período (RD$)",
    frequency: "Frecuencia de pago",
    weekly: "Semanal",
    biweekly: "Quincenal",
    start: "Comenzar",
    invalid: "Escribe un monto y una cuota mayores que cero. La cuota no puede ser mayor que el préstamo.",
    progress: "Progreso del préstamo",
    paid: "Pagado",
    remaining: "Restante",
    paymentsLeft: "Cuotas restantes",
    payoff: "Fecha estimada de pago total",
    registerPayment: "Registrar pago de RD$",
    lastPartial: "Última cuota (parcial): RD$",
    history: "Historial de pagos",
    noPayments: "Aún no hay pagos registrados. Registra el primero cuando se haga la deducción.",
    paymentN: "Pago",
    completed: "🎉 ¡Préstamo pagado por completo! Libre de deudas.",
    newLoan: "Nuevo préstamo",
    tipsTitle: "Consejo de finanzas",
    nextTip: "Otro consejo",
    undo: "Deshacer último pago",
    of: "de",
    weeks: "semanas",
    fortnights: "quincenas",
    savedNote: "Los datos se guardan en este dispositivo automáticamente.",
    tips: [
      "Paga primero las deudas con interés más alto. Un préstamo sin interés, como este, siempre debe ser el último en preocuparte.",
      "Antes de pedir prestado, pregunta: ¿cuánto pagaré en TOTAL? Si no te lo dicen claro, es una mala señal.",
      "Guarda algo cada quincena, aunque sea poco. RD$200 cada quincena son más de RD$5,000 al año.",
      "Un prestamista informal que cobra 10% semanal duplica tu deuda en menos de 2 meses. Evítalos siempre que puedas.",
      "Apunta tus gastos por una semana. Saber a dónde va tu dinero es el primer paso para controlarlo.",
      "Crea un fondo de emergencia pequeño. Así la próxima urgencia no te obliga a pedir prestado.",
      "Si te sobra dinero un mes, adelanta una cuota. Terminar antes te libera más rápido.",
    ],
  },
  en: {
    brand: "Vita' la Pizza",
    program: "Interest-Free Loan Program",
    tagline: "Every payment completes a slice.",
    setupTitle: "Set up the loan",
    amount: "Loan amount (RD$)",
    payment: "Fixed payment per period (RD$)",
    frequency: "Payment frequency",
    weekly: "Weekly",
    biweekly: "Biweekly",
    start: "Start",
    invalid: "Enter an amount and a payment greater than zero. The payment can't be larger than the loan.",
    progress: "Loan progress",
    paid: "Paid",
    remaining: "Remaining",
    paymentsLeft: "Payments left",
    payoff: "Estimated payoff date",
    registerPayment: "Record payment of RD$",
    lastPartial: "Final payment (partial): RD$",
    history: "Payment history",
    noPayments: "No payments recorded yet. Record the first one when the deduction is made.",
    paymentN: "Payment",
    completed: "🎉 Loan fully paid! Debt-free.",
    newLoan: "New loan",
    tipsTitle: "Finance tip",
    nextTip: "Another tip",
    undo: "Undo last payment",
    of: "of",
    weeks: "weeks",
    fortnights: "fortnights",
    savedNote: "Data is saved automatically on this device.",
    tips: [
      "Pay off the highest-interest debt first. An interest-free loan like this one should always be your last worry.",
      "Before borrowing, ask: how much will I pay in TOTAL? If the answer isn't clear, that's a red flag.",
      "Save something every payday, even a little. RD$200 each fortnight is over RD$5,000 a year.",
      "An informal lender charging 10% weekly doubles your debt in under 2 months. Avoid them whenever possible.",
      "Track your spending for one week. Knowing where your money goes is the first step to controlling it.",
      "Build a small emergency fund so the next urgent expense doesn't force you to borrow.",
      "If you have extra money one month, pay a payment early. Finishing sooner frees you faster.",
    ],
  },
};

const fmt = (n) =>
  new Intl.NumberFormat("es-DO", { maximumFractionDigits: 0 }).format(Math.round(n));

// ── Pizza progress: SVG pie of N slices, filled = payments made ──
function PizzaProgress({ total, done }) {
  const cx = 100, cy = 100, r = 84;
  const slices = [];
  for (let i = 0; i < total; i++) {
    const a0 = (i / total) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((i + 1) / total) * 2 * Math.PI - Math.PI / 2;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const large = 1 / total > 0.5 ? 1 : 0;
    slices.push(
      <path
        key={i}
        d={`M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`}
        fill={i < done ? "#E8A13D" : "#F5EBDD"}
        stroke="#B3541E"
        strokeWidth="1.5"
        style={{ transition: "fill 0.5s ease" }}
      />
    );
  }
  // pepperoni on filled slices
  const dots = [];
  for (let i = 0; i < done; i++) {
    const mid = ((i + 0.5) / total) * 2 * Math.PI - Math.PI / 2;
    dots.push(
      <circle
        key={"d" + i}
        cx={cx + r * 0.55 * Math.cos(mid)}
        cy={cy + r * 0.55 * Math.sin(mid)}
        r={Math.min(7, 60 / total + 3)}
        fill="#C93A2B"
      />
    );
  }
  return (
    <svg viewBox="0 0 200 200" style={{ width: "100%", maxWidth: 230 }} role="img" aria-label={`${done} / ${total}`}>
      <circle cx={cx} cy={cy} r={r + 6} fill="#B3541E" opacity="0.25" />
      <circle cx={cx} cy={cy} r={r + 3} fill="#D9913F" opacity="0.35" />
      {slices}
      {dots}
    </svg>
  );
}

export default function VitaLoanTool() {
  const [lang, setLang] = useState("es");
  const [loan, setLoan] = useState(null); // {amount, payment, frequency, startDate, paymentsMade:[{date, amount}]}
  const [form, setForm] = useState({ amount: "", payment: "", frequency: "biweekly" });
  const [error, setError] = useState("");
  const [tipIdx, setTipIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const t = T[lang];

  // ── load saved state ──
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("vita-loan");
        if (res && res.value) setLoan(JSON.parse(res.value));
      } catch (e) {
        /* first run — nothing saved yet */
      }
      try {
        const l = await window.storage.get("vita-lang");
        if (l && l.value) setLang(l.value);
      } catch (e) {}
      setLoaded(true);
    })();
  }, []);

  const save = async (next) => {
    setLoan(next);
    try {
      if (next === null) await window.storage.delete("vita-loan");
      else await window.storage.set("vita-loan", JSON.stringify(next));
    } catch (e) {
      console.error("storage", e);
    }
  };

  const switchLang = async (l) => {
    setLang(l);
    try { await window.storage.set("vita-lang", l); } catch (e) {}
  };

  const startLoan = () => {
    const amount = parseFloat(form.amount);
    const payment = parseFloat(form.payment);
    if (!amount || !payment || amount <= 0 || payment <= 0 || payment > amount) {
      setError(t.invalid);
      return;
    }
    setError("");
    save({
      amount,
      payment,
      frequency: form.frequency,
      startDate: new Date().toISOString(),
      paymentsMade: [],
    });
  };

  if (!loaded) return null;

  // ── derived values ──
  let body;
  if (!loan) {
    body = (
      <div style={card}>
        <h2 style={h2}>{t.setupTitle}</h2>
        <label style={label}>{t.amount}</label>
        <input
          style={input} type="number" inputMode="numeric" value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="15000"
        />
        <label style={label}>{t.payment}</label>
        <input
          style={input} type="number" inputMode="numeric" value={form.payment}
          onChange={(e) => setForm({ ...form, payment: e.target.value })} placeholder="1000"
        />
        <label style={label}>{t.frequency}</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["weekly", "biweekly"].map((f) => (
            <button
              key={f}
              onClick={() => setForm({ ...form, frequency: f })}
              style={{ ...chip, ...(form.frequency === f ? chipOn : {}) }}
            >
              {f === "weekly" ? t.weekly : t.biweekly}
            </button>
          ))}
        </div>
        {error && <p style={{ color: "#C93A2B", fontSize: 14, marginBottom: 12 }}>{error}</p>}
        <button style={cta} onClick={startLoan}>{t.start}</button>
      </div>
    );
  } else {
    const totalPayments = Math.ceil(loan.amount / loan.payment);
    const made = loan.paymentsMade.length;
    const paidSum = loan.paymentsMade.reduce((s, p) => s + p.amount, 0);
    const remaining = Math.max(0, loan.amount - paidSum);
    const nextPayment = Math.min(loan.payment, remaining);
    const isDone = remaining <= 0;
    const periodDays = loan.frequency === "weekly" ? 7 : 15;
    const paymentsLeft = Math.ceil(remaining / loan.payment);
    const payoffDate = new Date(Date.now() + paymentsLeft * periodDays * 86400000);
    const payoffStr = payoffDate.toLocaleDateString(lang === "es" ? "es-DO" : "en-US", {
      day: "numeric", month: "long", year: "numeric",
    });

    const recordPayment = () => {
      save({
        ...loan,
        paymentsMade: [...loan.paymentsMade, { date: new Date().toISOString(), amount: nextPayment }],
      });
    };
    const undo = () => {
      save({ ...loan, paymentsMade: loan.paymentsMade.slice(0, -1) });
    };

    body = (
      <>
        <div style={{ ...card, textAlign: "center" }}>
          <h2 style={h2}>{t.progress}</h2>
          <PizzaProgress total={totalPayments} done={made} />
          <p style={{ fontFamily: display, fontSize: 26, margin: "6px 0 2px", color: "#1E4D3B" }}>
            {made} {t.of} {totalPayments}
          </p>
          <p style={{ fontSize: 13, color: "#6B7263", margin: 0 }}>
            {loan.frequency === "weekly" ? t.weeks : t.fortnights}
          </p>

          <div style={statRow}>
            <div style={stat}>
              <span style={statLabel}>{t.paid}</span>
              <span style={{ ...statValue, color: "#1E4D3B" }}>RD${fmt(paidSum)}</span>
            </div>
            <div style={stat}>
              <span style={statLabel}>{t.remaining}</span>
              <span style={{ ...statValue, color: "#C93A2B" }}>RD${fmt(remaining)}</span>
            </div>
          </div>
          <div style={statRow}>
            <div style={stat}>
              <span style={statLabel}>{t.paymentsLeft}</span>
              <span style={statValue}>{paymentsLeft}</span>
            </div>
            <div style={stat}>
              <span style={statLabel}>{t.payoff}</span>
              <span style={{ ...statValue, fontSize: 15 }}>{isDone ? "—" : payoffStr}</span>
            </div>
          </div>

          {isDone ? (
            <p style={{ fontFamily: display, fontSize: 20, color: "#1E4D3B", marginTop: 16 }}>{t.completed}</p>
          ) : (
            <button style={{ ...cta, marginTop: 16 }} onClick={recordPayment}>
              {nextPayment < loan.payment ? `${t.lastPartial}${fmt(nextPayment)}` : `${t.registerPayment}${fmt(nextPayment)}`}
            </button>
          )}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 12 }}>
            {made > 0 && !isDone && (
              <button style={ghost} onClick={undo}>{t.undo}</button>
            )}
            <button style={ghost} onClick={() => save(null)}>{t.newLoan}</button>
          </div>
        </div>

        <div style={card}>
          <h2 style={h2}>{t.history}</h2>
          {made === 0 ? (
            <p style={{ color: "#6B7263", fontSize: 14 }}>{t.noPayments}</p>
          ) : (
            <div>
              {loan.paymentsMade.map((p, i) => (
                <div key={i} style={histRow}>
                  <span style={{ fontWeight: 600 }}>
                    {t.paymentN} {i + 1}
                  </span>
                  <span style={{ color: "#6B7263", fontSize: 13 }}>
                    {new Date(p.date).toLocaleDateString(lang === "es" ? "es-DO" : "en-US")}
                  </span>
                  <span style={{ color: "#1E4D3B", fontWeight: 700 }}>RD${fmt(p.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <div style={page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;600;700&display=swap');`}</style>
      <header style={header}>
        <div>
          <h1 style={{ fontFamily: display, fontSize: 30, margin: 0, color: "#FAF6EF", letterSpacing: "-0.5px" }}>
            {t.brand} <span style={{ fontSize: 22 }}>🍕</span>
          </h1>
          <p style={{ margin: "2px 0 0", color: "#CFE3D6", fontSize: 14 }}>{t.program}</p>
          <p style={{ margin: "6px 0 0", color: "#E8A13D", fontSize: 13, fontStyle: "italic" }}>{t.tagline}</p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["es", "en"].map((l) => (
            <button
              key={l}
              onClick={() => switchLang(l)}
              style={{ ...langBtn, ...(lang === l ? langOn : {}) }}
              aria-pressed={lang === l}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 40px" }}>
        {body}

        <div style={{ ...card, background: "#1E4D3B" }}>
          <h2 style={{ ...h2, color: "#E8A13D" }}>💡 {t.tipsTitle}</h2>
          <p style={{ color: "#FAF6EF", fontSize: 15, lineHeight: 1.55, minHeight: 66 }}>
            {t.tips[tipIdx % t.tips.length]}
          </p>
          <button
            style={{ ...ghost, borderColor: "#CFE3D6", color: "#CFE3D6" }}
            onClick={() => setTipIdx(tipIdx + 1)}
          >
            {t.nextTip}
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#9AA294", marginTop: 8 }}>{t.savedNote}</p>
      </main>
    </div>
  );
}

// ─── styles ───
const display = "'Fraunces', Georgia, serif";
const body = "'Inter', system-ui, sans-serif";

const page = { minHeight: "100vh", background: "#FAF6EF", fontFamily: body, color: "#22271F" };
const header = {
  background: "#1E4D3B",
  padding: "22px 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
};
const card = {
  background: "#FFFFFF",
  border: "1px solid #E7E0D2",
  borderRadius: 16,
  padding: 20,
  marginBottom: 16,
  boxShadow: "0 1px 3px rgba(30,77,59,0.08)",
};
const h2 = { fontFamily: display, fontSize: 20, margin: "0 0 14px", color: "#22271F" };
const label = { display: "block", fontSize: 13, fontWeight: 600, color: "#6B7263", margin: "10px 0 4px" };
const input = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  fontSize: 17,
  border: "1.5px solid #E7E0D2",
  borderRadius: 10,
  background: "#FAF6EF",
  fontFamily: body,
};
const chip = {
  flex: 1,
  padding: "10px 0",
  borderRadius: 10,
  border: "1.5px solid #E7E0D2",
  background: "#FAF6EF",
  fontSize: 15,
  fontWeight: 600,
  color: "#6B7263",
  cursor: "pointer",
};
const chipOn = { background: "#1E4D3B", borderColor: "#1E4D3B", color: "#FAF6EF" };
const cta = {
  width: "100%",
  padding: "14px 0",
  borderRadius: 12,
  border: "none",
  background: "#C93A2B",
  color: "#FFF",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: body,
};
const ghost = {
  padding: "8px 14px",
  borderRadius: 10,
  border: "1.5px solid #B9C4B3",
  background: "transparent",
  color: "#1E4D3B",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};
const statRow = { display: "flex", gap: 10, marginTop: 14 };
const stat = {
  flex: 1,
  background: "#FAF6EF",
  borderRadius: 12,
  padding: "10px 8px",
  display: "flex",
  flexDirection: "column",
  gap: 2,
};
const statLabel = { fontSize: 12, color: "#6B7263", fontWeight: 600 };
const statValue = { fontSize: 19, fontWeight: 700, fontFamily: display };
const langBtn = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "1.5px solid #CFE3D6",
  background: "transparent",
  color: "#CFE3D6",
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
};
const langOn = { background: "#E8A13D", borderColor: "#E8A13D", color: "#22271F" };
const histRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 0",
  borderBottom: "1px solid #F0EBDE",
  fontSize: 14,
};
