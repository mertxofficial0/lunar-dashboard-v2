import { useEffect, useRef } from "react";


function cmd(command: string, value?: string) {
  // execCommand eski ama hala çoğu browser’da çalışıyor (basit journal için yeterli)
  document.execCommand(command, false, value);
}

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

  // dışarıdan gelen html’i editor’a bas
  useEffect(() => {
    if (!ref.current) return;
    if (ref.current.innerHTML !== valueHtml) {
      ref.current.innerHTML = valueHtml || "";
    }
  }, [valueHtml]);

  const read = () => {
    const html = ref.current?.innerHTML ?? "";
    onChangeHtml(html);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-1 px-2 py-2 border-b border-slate-200 bg-slate-50">
        <ToolbarBtn label="B" onClick={() => cmd("bold")} />
        <ToolbarBtn label="I" onClick={() => cmd("italic")} />
        <ToolbarBtn label="U" onClick={() => cmd("underline")} />
        <Divider />
        <ToolbarBtn label="H1" onClick={() => cmd("formatBlock", "h2")} />
        <ToolbarBtn label="H2" onClick={() => cmd("formatBlock", "h3")} />
        <ToolbarBtn label="P" onClick={() => cmd("formatBlock", "p")} />
        <Divider />
        <ToolbarBtn label="• List" onClick={() => cmd("insertUnorderedList")} />
        <ToolbarBtn label="1. List" onClick={() => cmd("insertOrderedList")} />
        <Divider />
        <ToolbarBtn
          label="Link"
          onClick={() => {
            const url = prompt("Paste link URL:");
            if (url) cmd("createLink", url);
          }}
        />
        <ToolbarBtn label="Unlink" onClick={() => cmd("unlink")} />
        <Divider />
        <ToolbarBtn label="Clear" onClick={() => cmd("removeFormat")} />
      </div>

      {/* EDITOR */}
      <div className="p-3">
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onInput={read}
          className="
            min-h-[420px]
            outline-none
            text-[13px] text-slate-800
            leading-6
          "
          data-placeholder={placeholder}
        />

        {/* placeholder efekti */}
        <style>{`
          [contenteditable][data-placeholder]:empty:before {
            content: attr(data-placeholder);
            color: #94a3b8;
          }
          [contenteditable] h2 { font-size: 16px; font-weight: 800; margin: 14px 0 8px; }
          [contenteditable] h3 { font-size: 14px; font-weight: 800; margin: 12px 0 6px; }
          [contenteditable] ul { list-style: disc; padding-left: 18px; }
          [contenteditable] ol { list-style: decimal; padding-left: 18px; }
          [contenteditable] a { color: #7c3aed; text-decoration: underline; }
          [contenteditable] b, [contenteditable] strong { font-weight: 800; }
        `}</style>
      </div>
    </div>
  );
}

function ToolbarBtn({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()} // focus kaymasın
      onClick={onClick}
      className="
        h-8 px-2 rounded-lg
        border border-slate-200 bg-white
        text-[12px] font-semibold text-slate-700
        hover:bg-slate-50
      "
    >
      {label}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-6 bg-slate-200 mx-1" />;
}
