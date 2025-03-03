import tw from 'twin.macro';
import * as monaco from 'monaco-editor';
import { useFoldersStore } from '@/stores/folders';
import type { File } from '@/helpers/foldersHelper';
import { useRef, useState, useEffect, useMemo, useCallback, memo } from 'react';
import { loader } from '@monaco-editor/react';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
// import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'json') {
            return new jsonWorker();
        }
        return new editorWorker();
    },
};

loader.config({ monaco });

interface NewFile extends File { data: string; }

function EditorEditor() {
    const modelRef = useRef<monaco.editor.ITextModel | null>(null);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const { getFileOfType, selectedFiles } = useFoldersStore();
    const [cachedFiles, setCachedFiles] = useState<{ data: string, staticPath: string, ext: string }[]>([]);

    const file = useMemo(() => {
        return (getFileOfType(['.json', '.txt', '.js']) as NewFile | null) || { data: "", ext: ".txt", staticPath: "" };
    }, [selectedFiles]);

    const createEditor = useCallback((data: string, ext: string, model: monaco.editor.ITextModel) => {
        return monaco.editor.create(
            document.getElementById("monaco-editor")!,
            {
                value: data,
                language: ext,
                theme: 'vs-dark',
                automaticLayout: true,
                model
            }
        );
    }, []);

    const createModel = useCallback((data: string, ext: string) => {
        return monaco.editor.createModel(data, ext);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (file && file.staticPath !== "") {
                const isCached = cachedFiles.find((cachedFile) => cachedFile.staticPath === file.staticPath);
                if (!isCached) {
                    const res = await fetch(file.staticPath);
                    file.data = res.ok ? await res.text() : "";
                    setCachedFiles((prevCachedFiles) => [...prevCachedFiles, { data: file.data, staticPath: file.staticPath, ext: file.ext }]);
                }
            }

            editorRef.current?.dispose();
            modelRef.current?.dispose();

            modelRef.current = createModel(file.data ?? '', file.ext.replace('.', ''));
            editorRef.current = createEditor(file.data ?? '', file.ext.replace('.', ''), modelRef.current);

            editorRef.current?.render();
        };

        fetchData();

        return () => {
            editorRef.current?.dispose();
            modelRef.current?.dispose();
        };
    }, [file, selectedFiles, cachedFiles, createEditor, createModel]);

    return (
        <div
            id={"monaco-editor"}
            css={tw`w-full h-full`}
        />
    );
};

export default memo(EditorEditor);