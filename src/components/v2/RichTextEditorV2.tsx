import { useEffect, useRef, useState } from "react";



import { ImagePlus, Link2, X } from "lucide-react";

const NOTE_TEMPLATES = [
  {
    id: "simple",
    title: "📝 Simple Trade Note",
    html: `
      <p><b>Setup:</b></p>
      <p></p>
      <p><b>Entry:</b></p>
      <p><b>Stop:</b></p>
      <p><b>Target:</b></p>
      <p><b>Result:</b></p>
    `,
  },
  {
    id: "review",
    title: "📊 Trade Review",
    html: `
      <p><b>Why I took this trade:</b></p>
      <p></p>
      <p><b>Execution quality:</b></p>
      <p></p>
      <p><b>Mistakes:</b></p>
      <ul><li></li></ul>
      <p><b>Lesson:</b></p>
    `,
  },
  {
    id: "emotion",
    title: "🧠 Psychology Check",
    html: `
      <p><b>Before trade:</b></p>
      <p></p>
      <p><b>During trade:</b></p>
      <p></p>
      <p><b>After trade:</b></p>
      <p></p>
    `,
  },
  {
    id: "checklist",
    title: "✅ Checklist",
    html: `
      <ul>
        <li>Setup valid?</li>
        <li>HTF aligned?</li>
        <li>Risk respected?</li>
        <li>Emotion controlled?</li>
      </ul>
    `,
  },
];


/* ======================
   COMMAND
====================== */
document.execCommand("styleWithCSS", false, "true");

function cmd(command: string, value?: string) {
  document.execCommand(command, false, value);
}

function isActive(command: string) {
  try {
    return document.queryCommandState(command);
  } catch {
    return false;
  }
}

/* ======================
   BUTTON
====================== */
function ToolBtn({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`
  h-8 w-8 flex items-center justify-center
  rounded-md transition
  ${active
    ? "bg-slate-200/80 text-slate-900"
    : "bg-transparent text-slate-700 hover:bg-slate-200/60"
  }
`}

    >
      {children}
    </button>
  );
}


/* ======================
   COMPONENT
====================== */

export default function RichTextEditorV2({
  valueHtml,
  onChangeHtml,
  placeholder = "Write your daily log...",
}: {
  valueHtml: string;
  onChangeHtml: (html: string) => void;
  placeholder?: string;
}) {
  

  const ref = useRef<HTMLDivElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [currentTextColor, setCurrentTextColor] = useState<string>("#000000");
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);


  const syncHtml = () => {
    onChangeHtml(ref.current?.innerHTML ?? "");
  };

  const syncSelectionUi = () => {
    setCurrentFontSize(getCurrentFontSize());
    setCurrentTextColor(getCurrentTextColor());
    
  };

  // eski read() yerine:
  const read = () => {
    syncHtml();
    syncSelectionUi();
  };

  const [showTextColor, setShowTextColor] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);

  const fontMenuRef = useRef<HTMLDivElement | null>(null);
const textColorMenuRef = useRef<HTMLDivElement | null>(null);


  const MIN_FONT = 12;
  const MAX_FONT = 24;
  

  

  const [currentFontSize, setCurrentFontSize] = useState<number>(12);

  useEffect(() => {
  function handleMouseDown(e: MouseEvent) {
    const target = e.target as Node;

    if (
      showFontMenu &&
      fontMenuRef.current &&
      !fontMenuRef.current.contains(target)
    ) {
      setShowFontMenu(false);
    }
  }

  document.addEventListener("mousedown", handleMouseDown, true);
  return () => {
    document.removeEventListener("mousedown", handleMouseDown, true);
  };
}, [showFontMenu]);


  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== valueHtml) {
      ref.current.innerHTML = valueHtml || "";
    }
  }, [valueHtml]);

useEffect(() => {
  function handleMouseDown(e: MouseEvent) {
    const target = e.target as Node;

    if (
      showTextColor &&
      textColorMenuRef.current &&
      !textColorMenuRef.current.contains(target)
    ) {
      setShowTextColor(false);
    }
  }

  document.addEventListener("mousedown", handleMouseDown, true);
  return () => {
    document.removeEventListener("mousedown", handleMouseDown, true);
  };
}, [showTextColor]);




  function getBlockElFromSelection(sel: Selection): HTMLElement | null {
    if (!sel.rangeCount) return null;

    const node = sel.anchorNode as any;
    const el: HTMLElement | null =
      node?.nodeType === 1 ? node : node?.parentElement;

    if (!el) return null;

    // Satır gibi davranacak block’u bul (p/div/li/h1…)
    return el.closest("p, div, li, h1, h2, h3, h4, h5, h6") as HTMLElement | null;
  }

  function applyFontSizePx(px: number) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const block = getBlockElFromSelection(sel);

    // Eğer block yoksa (çok nadir) fallback: editor container’a uygula (global olur)
    const target = block ?? ref.current;
    if (!target) return;

    target.style.fontSize = `${px}px`;

    // UI güncelle
    setCurrentFontSize(px);
    setShowFontMenu(false);
    syncHtml();
  }



  
  

  


  

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col h-full min-h-0">


      {/* ======================
    TOOLBAR
====================== */}
<div className="sticky top-0 z-30 flex items-center px-3 py-2 border-b border-slate-200 bg-slate-50">

  {/* GROUP 1 – TEXT (B I U) */}
  <div className="flex items-center gap-1 mr-4">

    <ToolBtn title="Bold" active={isActive("bold")} onClick={() => cmd("bold")}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 5h6a3.5 3.5 0 010 7H7zM7 12h6.5a3.5 3.5 0 010 7H7z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </ToolBtn>

    <ToolBtn title="Italic" active={isActive("italic")} onClick={() => cmd("italic")}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M10 5h6M8 19h6M14 5l-4 14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </ToolBtn>

    <ToolBtn title="Underline" active={isActive("underline")} onClick={() => cmd("underline")}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 4v7a5 5 0 0010 0V4M5 20h14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </ToolBtn>
  </div>

  

  {/* GROUP 2 – ALIGN + LIST + FONT */}
<div className="flex items-center gap-1 mr-4">

  {/* ALIGN LEFT */}
  <ToolBtn
    title="Align left"
    active={isActive("justifyLeft")}
    onClick={() => cmd("justifyLeft")}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 6h14M3 12h10M3 18h14"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  </ToolBtn>

  {/* ALIGN CENTER */}
  <ToolBtn
    title="Align center"
    active={isActive("justifyCenter")}
    onClick={() => cmd("justifyCenter")}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 6h14M7 12h10M5 18h14"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  </ToolBtn>

  {/* ORDERED LIST 1.2.3 */}
  {/* ORDERED LIST */}
<ToolBtn
  title="Numbered list"
  active={isActive("insertOrderedList")}
  onClick={() => cmd("insertOrderedList")}
>
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
  >
    {/* DOTS */}
    <path
      d="M4 6h.01M4 12h.01M4 18h.01"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
    />

    {/* LINES */}
    <path
      d="M9 6h12M9 12h8M9 18h12"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
</ToolBtn>



  {/* FONT SIZE */}
 <div ref={fontMenuRef} className="relative">




    <ToolBtn
      title="Font size"
      active={showFontMenu}
      onClick={() => {
        setShowFontMenu(v => !v);
        setShowTextColor(false);
      }}
    >
      <svg width="6" height="14" viewBox="0 0 6 14" fill="currentColor">
        <circle cx="3" cy="2" r="1.2" />
        <circle cx="3" cy="7" r="1.2" />
        <circle cx="3" cy="12" r="1.2" />
      </svg>
    </ToolBtn>

    {showFontMenu && (
      <div
        className="absolute top-full left-0 mt-2 z-50 w-[120px]
                   rounded-lg border border-slate-200 bg-white shadow-lg p-1"
        onMouseDown={(e) => e.preventDefault()}
      >
        {Array.from({ length: MAX_FONT - MIN_FONT + 1 }, (_, i) => MIN_FONT + i).map(px => (
          <button
            key={px}
            className={`block w-full px-3 py-1 text-left text-[12px] rounded
              hover:bg-slate-100 ${px === currentFontSize ? "bg-slate-100 font-semibold" : ""}`}
            onClick={() => {
              applyFontSizePx(px);
              setCurrentFontSize(px);
              setShowFontMenu(false);
              syncHtml();
            }}
          >
            {px}px
          </button>
        ))}
      </div>
    )}
  </div>

  {/* TEXT COLOR */}
  <div ref={textColorMenuRef} className="relative">

    <ToolBtn
      title="Text color"
      active={showTextColor}
      onClick={() => setShowTextColor(v => !v)}
    >
      <div className="relative flex items-center justify-center">
  <span className="text-[14px] font-medium -translate-y-[3px]">
    A
  </span>

  <span
    className="absolute -bottom-[-2px] h-[3px] w-3 rounded"
    style={{ backgroundColor: currentTextColor }}
  />
</div>

    </ToolBtn>

    {showTextColor && (
      <ColorPalette
        onPick={(c) => {
          cmd("foreColor", c);
          setCurrentTextColor(c);
          setShowTextColor(false);
        }}
      />
    )}
  </div>

</div>

  

  {/* GROUP 3 – MEDIA */}
  <div className="flex items-center gap-1">
    <ToolBtn title="Insert image" onClick={() => fileRef.current?.click()}>
      <ImagePlus size={16} />
    </ToolBtn>

    <ToolBtn
      title="Insert link"
      onClick={() => {
        const url = prompt("Paste link");
        if (url) cmd("createLink", url);
      }}
    >
      <Link2 size={16} />
    </ToolBtn>

    <ToolBtn title="Clear formatting" onClick={() => cmd("removeFormat")}>
      <X size={16} />
    </ToolBtn>
  </div>

  <div className="flex-1" />

  {/* GROUP 4 – HISTORY */}
  <div className="flex items-center gap-1">
    <ToolBtn title="Undo" onClick={() => cmd("undo")}>
      <svg
  width="16"
  height="16"
  viewBox="0 0 24 24"
  fill="none"
  className="-translate-y-[2px]"
>

        <path d="M9 7l-4 4 4 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 11h8a6 6 0 110 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </ToolBtn>

    <ToolBtn title="Redo" onClick={() => cmd("redo")}>
      <svg
  width="16"
  height="16"
  viewBox="0 0 24 24"
  fill="none"
  className="-translate-y-[2px]"
>

        <path d="M15 7l4 4-4 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19 11h-8a6 6 0 100 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </ToolBtn>
    {/* TEMPLATE MENU (3 DOTS) */}
<div className="relative">
  <ToolBtn
    title="Templates"
    active={showTemplateMenu}
    onClick={() => setShowTemplateMenu(v => !v)}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  </ToolBtn>

  {showTemplateMenu && (
    <div
      className="
        absolute right-0 top-full mt-2 z-50
        w-56 rounded-xl border border-slate-200
        bg-white shadow-xl p-1
      "
      onMouseDown={(e) => e.preventDefault()}
    >
      {NOTE_TEMPLATES.map(tpl => (
        <button
          key={tpl.id}
          className="
            w-full text-left px-3 py-2 rounded-lg
            text-[13px] text-slate-700
            hover:bg-slate-100
          "
          onClick={() => {
            ref.current!.innerHTML = tpl.html;
            syncHtml();
            setShowTemplateMenu(false);
          }}
        >
          {tpl.title}
        </button>
      ))}
    </div>
  )}
</div>

  </div>
</div>


      {/* ======================
          EDITOR
      ====================== */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 editor-scroll">

        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onInput={read}
          onKeyUp={read}
          onMouseUp={read}
          className="outline-none text-[13px] text-slate-800 leading-6"
          data-placeholder={placeholder}
        />

      </div>

      <style>{`
  [contenteditable][data-placeholder]:empty:before {
    content: attr(data-placeholder);
    color: #94a3b8;
  }

  /* ===== FORCE ORDERED LIST ===== */
  .editor-scroll ol {
    list-style-type: decimal !important;
    list-style-position: inside;
    padding-left: 0;
    margin-left: 0;
  }

  .editor-scroll ul {
    list-style-type: disc !important;
    list-style-position: inside;
    padding-left: 0;
    margin-left: 0;
  }

  .editor-scroll li {
    margin: 0;
    padding-left: 6px;
  }
    /* ===== CLEAN MODERN SCROLLBAR ===== */
.editor-scroll {
  overflow-y: auto;

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent; /* slate-300 */
}

/* Chrome / Edge / Safari */
.editor-scroll::-webkit-scrollbar {
  width: 6px;
}

.editor-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.editor-scroll::-webkit-scrollbar-thumb {
  background-color: #cbd5e1; /* slate-300 */
  border-radius: 999px;
}

/* hover olunca hafif koyulaşsın */
.editor-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8; /* slate-400 */
}

/* ❌ oklar KESİN YOK */
.editor-scroll::-webkit-scrollbar-button {
  display: none;
  width: 0;
  height: 0;
}
/* Yazı ile scrollbar arası boşluğu azalt */
.editor-scroll {
  padding-right: 8px; /* default 16px → 8px */
}

`}</style>



    </div>
  );
}

/* ======================
   POPUPS
====================== */
function getCurrentFontSize(): number {
  try {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return 13;

    const el = sel.anchorNode?.parentElement;
    if (!el) return 13;

    const size = window.getComputedStyle(el).fontSize;
    return parseInt(size.replace("px", ""), 10);
  } catch {
    return 13;
  }
}





function getCurrentTextColor(): string {
  try {
    const value = document.queryCommandValue("foreColor");
    if (!value) return "#000000";

    // browser bazen rgb döndürür
    if (value.startsWith("rgb")) return value;

    return value;
  } catch {
    return "#000000";
  }
}





function ColorPalette({
  onPick,
}: {
  onPick: (color: string) => void;
}) {
  // ALT → ÜST : açık → koyu
  const columns = [
    ["#ffffff", "#e5e7eb", "#9ca3af", "#4b5563", "#1f2937", "#000000"],
    ["#fff1f2", "#fecaca", "#f87171", "#ef4444", "#dc2626", "#991b1b"],
    ["#fffbeb", "#fde68a", "#fbbf24", "#f59e0b", "#d97706", "#92400e"],
    ["#f0fdf4", "#bbf7d0", "#4ade80", "#22c55e", "#16a34a", "#166534"],
    ["#eff6ff", "#bfdbfe", "#60a5fa", "#3b82f6", "#2563eb", "#1e3a8a"],
    ["#f5f3ff", "#ddd6fe", "#a78bfa", "#8b5cf6", "#7c3aed", "#4c1d95"],
  ];

  return (
    <div
      className="
        absolute top-full left-0 mt-2 z-50
        rounded-lg border border-slate-200 bg-white
        shadow-lg p-2
      "
    >
      <div className="flex gap-[2px]">
        {columns.map((col, i) => (
          <div key={i} className="flex flex-col gap-[2px]">
            {col.map((c) => (
              <button
                key={c}
                onMouseDown={(e) => {
                  e.preventDefault(); // selection kaçmasın
                  onPick(c);
                }}
                className="
                  h-6 w-6
                  rounded-sm
                  border border-slate-200
                "
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}



