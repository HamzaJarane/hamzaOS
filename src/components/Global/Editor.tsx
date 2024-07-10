import { useRef, useState, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import EditorJson from '@/assets/json/EditorTheme.json';
import tw, { styled } from 'twin.macro';

const EditorContainer = styled.div`
    ${tw`w-full h-full`}
`;

type Props = {
    data: string,
    language: string,
};

export default function Editor({ data: value, language }: Props) {
    const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
    const monacoEl = useRef(null);

    useEffect(() => {
        if (monacoEl && !editor) {
            setEditor((editor) => {
                if (editor) return editor;

                // We dont need to give it a type since vite already 
                // converts json format into javascript object
                monaco.editor.defineTheme('dracula', EditorJson as any);
                monaco.editor.setTheme('dracula');

                return monaco.editor.create(monacoEl.current!, { value, language, theme: "dracula", automaticLayout: true });
            });
        }
        return () => editor?.dispose();
    }, [monacoEl.current]);

    return (
        <EditorContainer ref={monacoEl} />
    );
};