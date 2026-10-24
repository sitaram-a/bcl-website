import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function RichTextEditor({ value, onChange }) {
  const containerRef = useRef(null);
  const quillInstance = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!quillInstance.current) {
      quillInstance.current = new Quill(containerRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ color: [] }, { background: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image", "video"],
            ["clean"],
          ],
        },
      });

      quillInstance.current.on("text-change", () => {
        if (quillInstance.current) {
          onChange(quillInstance.current.root.innerHTML);
        }
      });
    }

    if (quillInstance.current && value !== quillInstance.current.root.innerHTML) {
      if (document.activeElement !== containerRef.current) {
        quillInstance.current.root.innerHTML = value || "";
      }
    }
  }, [value, onChange]);

  return (
    <div className="quill-wrapper">
      <div ref={containerRef} style={{ minHeight: "220px", background: "#ffffff", color: "#0f172a" }} />
    </div>
  );
}