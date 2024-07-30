import { useRef, useState, useEffect } from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
// @ts-ignore
import { registerLanguage } from "monaco-editor/esm/vs/basic-languages/_.contribution";

registerLanguage({
    id: "glsl",
    extensions: [".frag"],
    aliases: ["GLSL Shading Language", "GLSL", "glsl"],
    loader: () => import("../glsl"),
});

export type EditorParams = {
    className?: string;
    code?: string;
    onSave?: (content: string) => void;
};

const Editor = ({ className = "", code = "", onSave }: EditorParams) => {
    const [editor, setEditor] =
        useState<monaco.editor.IStandaloneCodeEditor | null>(null);
    const monacoEl = useRef(null);

    useEffect(() => {
        if (monacoEl) {
            setEditor((editor) => {
                if (editor) return editor;

                return monaco.editor.create(monacoEl.current!, {
                    value: code,
                    language: "glsl",
                    theme: "vs-dark",
                    renderWhitespace: "all",
                    fontSize: 16,
                    automaticLayout: true,
                    fontLigatures: true,
                    scrollBeyondLastLine: false,
                });
            });
        }

        return () => editor?.dispose();
    }, [code, editor]);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.key === "s" && e.ctrlKey) || (e.key === "s" && e.metaKey)) {
                e.preventDefault();
                if (onSave) onSave(editor?.getValue() || "");
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [onSave, editor]);

    return <div className={className} ref={monacoEl}></div>;
};

export default Editor;