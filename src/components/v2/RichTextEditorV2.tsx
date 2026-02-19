import { useEffect, useRef, useState } from "react";


import InfoIcon from "../../icons/InfoIcon";


import { ImagePlus, Link2, X } from "lucide-react";




/* ======================
   COMMAND
====================== */
document.execCommand("styleWithCSS", false, "true");

function cmd(command: string, value?: string) {
  document.execCommand(command, false, value);
}

const NOTE_TEMPLATES = [
  /* ======================
     📓 TRADER DAILY NOTE
  ====================== */
  {
    id: "simple-trader-note",
    title: "Trader Daily Note",
    html: `
<p><span style="background-color:#FEF08A;"><b>🟡 Market Plan</b></span></p>
<p>• Market context, bias, key levels, important news</p>
<p></p>

<p><span style="background-color:#DBEAFE;"><b>🔵 Trades</b></span></p>
<p>• Trades taken / skipped</p>
<p>• Entry – Stop – Target (brief)</p>
<p></p>

<p><span style="background-color:#DCFCE7;"><b>🟢 What I Did Well</b></span></p>
<p>• Things I executed correctly</p>
<p></p>

<p><span style="background-color:#FEE2E2;"><b>🔴 Mistakes</b></span></p>
<p>• Errors, rule breaks, emotional decisions</p>
<p></p>

<p><span style="background-color:#EDE9FE;"><b>🟣 Notes & Lessons</b></span></p>
<p>• Key takeaway from today</p>
<p></p>
`
  },

  /* ======================
     🧠 TRADING PSYCHOLOGY
  ====================== */
  {
    id: "trading-psychology",
    title: "Trading Psychology",
    html: `
<p><span style="background-color:#FEF08A;"><b>🟡 Before Trading</b></span></p>
<p>• Mood before session (calm, stressed, confident, tired)</p>
<p>• Sleep quality & energy level</p>
<p>• Expectations for the session</p>
<p></p>

<p><span style="background-color:#DBEAFE;"><b>🔵 During Trading</b></span></p>
<p>• Emotional state during trades</p>
<p>• Fear, FOMO, revenge trading?</p>
<p>• Did I follow my rules?</p>
<p></p>

<p><span style="background-color:#FEE2E2;"><b>🔴 Emotional Triggers</b></span></p>
<p>• What triggered emotions?</p>
<p>• Specific moment or trade</p>
<p></p>

<p><span style="background-color:#DCFCE7;"><b>🟢 Emotional Control</b></span></p>
<p>• How did I respond to stress or losses?</p>
<p>• Did I pause or stop when needed?</p>
<p></p>

<p><span style="background-color:#EDE9FE;"><b>🟣 Psychology Lesson</b></span></p>
<p>• One mental lesson</p>
<p>• One adjustment for next session</p>
<p></p>
`
  },

  /* ======================
     🌅 PRE-MARKET REVIEW
  ====================== */
  {
    id: "pre-market-review",
    title: "Pre-Market Review",
    html: `
<p><span style="background-color:#FEF08A;"><b>🟡 Market Context</b></span></p>
<p>• Overall market condition (trend / range / volatility)</p>
<p>• HTF bias</p>
<p></p>

<p><span style="background-color:#DBEAFE;"><b>🔵 Key Levels</b></span></p>
<p>• Important support / resistance</p>
<p>• Liquidity zones</p>
<p></p>

<p><span style="background-color:#DCFCE7;"><b>🟢 Trade Scenarios</b></span></p>
<p>• A+ setups I’m waiting for</p>
<p>• Conditions to enter a trade</p>
<p></p>

<p><span style="background-color:#FEE2E2;"><b>🔴 Risk Rules</b></span></p>
<p>• Max risk per trade</p>
<p>• Max trades for the session</p>
<p></p>

<p><span style="background-color:#EDE9FE;"><b>🟣 Mental Intention</b></span></p>
<p>• How I want to behave today</p>
<p>• One rule I must respect</p>
<p></p>
`
  },

  /* ======================
     🌙 POST-MARKET REVIEW
  ====================== */
  {
    id: "post-market-review",
    title: "Post-Market Review",
    html: `
<p><span style="background-color:#DBEAFE;"><b>🔵 Session Summary</b></span></p>
<p>• Trades taken vs planned</p>
<p>• Execution quality</p>
<p></p>

<p><span style="background-color:#DCFCE7;"><b>🟢 What Went Well</b></span></p>
<p>• Good decisions</p>
<p>• Rules respected</p>
<p></p>

<p><span style="background-color:#FEE2E2;"><b>🔴 What Went Wrong</b></span></p>
<p>• Mistakes or rule breaks</p>
<p>• Emotional reactions</p>
<p></p>

<p><span style="background-color:#FEF08A;"><b>🟡 Performance Check</b></span></p>
<p>• Was I disciplined?</p>
<p>• Was risk respected?</p>
<p></p>

<p><span style="background-color:#EDE9FE;"><b>🟣 Improvement Plan</b></span></p>
<p>• One thing to improve next session</p>
<p>• One thing to avoid</p>
<p></p>
`
  }
];








function isActive(command: string) {
  try {
    return document.queryCommandState(command);
  } catch {
    return false;
  }
}
function isHighlightActive() {
  try {
    const value = document.queryCommandValue("hiliteColor");
    if (!value) return false;

    // browser bazen rgb döndürür
    return (
      value === "#FEF08A" ||
      value === "rgb(254, 240, 138)"
    );
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
  cursor-pointer
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
const [highlightActive, setHighlightActive] = useState(false);
function toggleHighlight() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const parent = range.startContainer.parentElement;
  if (!parent) return;

  const bg = window.getComputedStyle(parent).backgroundColor;
  const isActive = bg === "rgb(254, 240, 138)";

  if (isActive) {
    document.execCommand("removeFormat");
    setHighlightActive(false);
  } else {
    document.execCommand("hiliteColor", false, "#FEF08A");
    setHighlightActive(true);
  }
}


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
  
const [showLinkBox, setShowLinkBox] = useState(false);
const [showLinkWarning, setShowLinkWarning] = useState(false);
const [linkUrl, setLinkUrl] = useState("");

const savedRangeRef = useRef<Range | null>(null);
const templateMenuRef = useRef<HTMLDivElement | null>(null);
const templateBtnRef = useRef<HTMLDivElement | null>(null);
const linkPopupRef = useRef<HTMLDivElement | null>(null);
const [confirmLink, setConfirmLink] = useState<string | null>(null);

  

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
  function handleClickOutside(e: MouseEvent) {
    const target = e.target as Node;

    if (
  showTemplateMenu &&
  templateMenuRef.current &&
  !templateMenuRef.current.contains(target) &&
  templateBtnRef.current &&
  !templateBtnRef.current.contains(target)
) {
  setShowTemplateMenu(false);
}

  }

  document.addEventListener("mousedown", handleClickOutside, true);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside, true);
  };
}, [showTemplateMenu]);

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
useEffect(() => {
  function handleClickOutside(e: MouseEvent) {
    const target = e.target as Node;

    if (
      showLinkBox &&
      linkPopupRef.current &&
      !linkPopupRef.current.contains(target)
    ) {
      setShowLinkBox(false);
      setLinkUrl("");
    }
  }

  document.addEventListener("mousedown", handleClickOutside, true);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside, true);
  };
}, [showLinkBox]);




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
      <span className="text-[14px] font-medium -translate-y-[3px]">A</span>
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

{/* BRUSH / HIGHLIGHT */}
<ToolBtn
  title="Highlight"
  active={highlightActive}
  onClick={toggleHighlight}
>
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M3 17l6-6 4 4-6 6H3v-4z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 7l3-3 3 3-3 3-3-3z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</ToolBtn>


</div>

  

  {/* GROUP 3 – MEDIA */}
  <div className="flex items-center gap-1">
    <ToolBtn title="Insert image" onClick={() => fileRef.current?.click()}>
      <ImagePlus size={16} />
      <input
  ref={fileRef}
  type="file"
  accept="image/*"
  className="hidden"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
  if (!ref.current) return;

  // 1️⃣ editöre focus ver
  ref.current.focus();

  // 2️⃣ imleci NOTUN SONUNA AL
  const range = document.createRange();
  range.selectNodeContents(ref.current);
  range.collapse(false);

  const sel = window.getSelection();
  if (sel) {
    sel.removeAllRanges();
    sel.addRange(range);
  }

  // 3️⃣ görseli ekle
  document.execCommand("insertImage", false, reader.result as string);

  syncHtml();
};

    reader.readAsDataURL(file);

    // aynı dosyayı tekrar seçebilmek için
    e.target.value = "";
  }}
/>

    </ToolBtn>

    <ToolBtn
  title="Insert link"
  onClick={() => {
    const sel = window.getSelection();

    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      setShowLinkWarning(true);
      setTimeout(() => setShowLinkWarning(false), 1500);
      return;
    }

    // ✅ SELECTION'I KAYDET
    savedRangeRef.current = sel.getRangeAt(0).cloneRange();

    setShowLinkWarning(false);
    setShowLinkBox(true);
    setLinkUrl("");
  }}
>
  <Link2 size={16} />
</ToolBtn>

{showLinkWarning && (
  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50">
    <div
      className="
        flex items-center gap-2
        px-3 py-2
        rounded-lg
        border border-slate-200
        bg-white
        shadow-md
      "
    >
      <InfoIcon size={14} />
      <span className="text-[12px] text-slate-700">
        Lütfen metin seçin.
      </span>
    </div>
  </div>
)}


{showLinkBox && (
  <div
  ref={linkPopupRef}
  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50"
  >
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white shadow-lg">
      <input
        type="text"
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        placeholder="https://example.com"
        className="w-48 px-2 py-1 text-[13px] border border-slate-200 rounded outline-none focus:ring-2 focus:ring-violet-200"
        autoFocus
      />

      <button
  className="cursor-pointer px-2 py-1 text-[12px] rounded bg-violet-600 text-white hover:bg-violet-700"
  onClick={() => {
    if (!linkUrl || !savedRangeRef.current) return;

    // 🔁 SELECTION'I GERİ YÜKLE
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }

    // 🔗 LINK OLUŞTUR
    document.execCommand("createLink", false, linkUrl);

    // (opsiyonel) yeni sekmede açılsın
    const a = savedRangeRef.current.startContainer.parentElement?.closest("a");
    if (a) a.setAttribute("target", "_blank");

    setShowLinkBox(false);
    setLinkUrl("");
    savedRangeRef.current = null;

    syncHtml();
  }}
>
  Ekle
</button>


      <button
        className="cursor-pointer px-2 py-1 text-[12px] rounded text-slate-600 hover:bg-slate-100"
        onClick={() => {
          setShowLinkBox(false);
          setLinkUrl("");
        }}
      >
        İptal
      </button>
    </div>
  </div>
)}



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
<div className="relative" ref={templateBtnRef}>
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
  ref={templateMenuRef}
  className="
    absolute right-0 top-full mt-2 z-50
    w-52 rounded-lg border border-slate-200
    bg-white shadow-lg py-1
  "
  onMouseDown={(e) => e.preventDefault()}
>

    {NOTE_TEMPLATES.map((tpl) => (
      <button
        key={tpl.id}
        className="
          group
          w-full text-left
          px-3 py-2
          text-[13px]
          text-slate-700
          flex items-center justify-between
          hover:bg-slate-100
          transition
        "
        onClick={() => {
          ref.current!.innerHTML = tpl.html;
          syncHtml();
          setShowTemplateMenu(false);
        }}
      >
        <span className="group-hover:text-slate-900">
          {tpl.title}
        </span>

        
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
      <div
  className="flex-1 min-h-0 overflow-y-auto p-4 editor-scroll cursor-text"
  onMouseDown={(e) => {
  if (ref.current && e.target === e.currentTarget) {
-   e.preventDefault();
    ref.current.focus();
  }
}}


>


        <div
  ref={ref}
  contentEditable
  suppressContentEditableWarning
  onInput={read}
  onKeyUp={read}
  onMouseUp={() => {
    read();
    setHighlightActive(isHighlightActive());
  }}
  onClick={(e) => {
  const target = e.target as HTMLElement;

  if (target.tagName === "A") {
    e.preventDefault();
    e.stopPropagation();

    const href = (target as HTMLAnchorElement).href;
    if (href) {
      setConfirmLink(href);
    }
  }
}}

  className="outline-none text-[13px] text-slate-800 leading-6 min-h-full block"

  data-placeholder={placeholder}
/>


      </div>
{confirmLink && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center">
    {/* backdrop */}
    <div
      className="absolute inset-0 bg-black/30"
      onClick={() => setConfirmLink(null)}
    />

    {/* popup */}
    <div className="relative z-10 w-[360px] rounded-xl bg-white border border-slate-200 shadow-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <InfoIcon size={15} />
        <span className="text-[13px] font-semibold text-slate-800">
          External Link
        </span>
      </div>

      <p className="text-[13px] font-medium text-slate-600 mb-4">
        This link will open an external page.  
        Do you want to continue?
      </p>

      <div className="flex justify-end gap-2">
        <button
          className="px-3 py-1.5 text-[12px] rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
          onClick={() => setConfirmLink(null)}
        >
          Cancel
        </button>

        <button
          className="px-3 py-1.5 text-[12px] rounded-md bg-violet-600 text-white hover:bg-violet-700 cursor-pointer"
          onClick={() => {
            window.open(confirmLink, "_blank");
            setConfirmLink(null);
          }}
        >
          Open link
        </button>
      </div>
    </div>
  </div>
)}

      <style>{`
      /* ===== LINK STYLE (ZORUNLU) ===== */
.editor-scroll a {
  color: #7c3aed;              /* violet-600 */
  text-decoration: underline;
  cursor: pointer;
}

.editor-scroll a:hover {
  color: #6d28d9;              /* violet-700 */
}

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
+ cursor-pointer
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



