import { Fragment, memo, useEffect, useMemo, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import printJS from 'print-js';
import tw, { styled } from 'twin.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileImport } from '@fortawesome/free-solid-svg-icons';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

type Props = { source: string, name: string };

declare global {
    interface Window {
        chrome: any;
    }
}

const ActionButton = styled.button<{ $forceHover?: boolean }>`
    ${tw`p-2 bg-white/10 flex justify-center items-center rounded-full cursor-pointer`}


    &:hover{
        ${tw`bg-white/20`}
    }

    &:active{
        ${tw`bg-white/50`}
    }

    &:disabled {
        ${tw`bg-black/50 text-white`}
    }
`;

function PDFViewer({ source: src, name }: Props) {
    const source = useMemo(() => ({ url: src }), [src]);
    const pageRefs = useRef<HTMLDivElement[]>([]);
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);

    const printDoc = async () => {
        printJS({
            printable: source,
            type: "pdf",
        })
    }

    const downloadDoc = async () => {
        const link = document.createElement("a");

        link.href = source.url;
        link.download = name;

        link.click();
    }

    const jumpToPage = (page: number) => {
        if(typeof window !== 'undefined') {
            // Chrome based browsers doesnt fire scrollIntoView at all when its set to smooth 
            switch (typeof window.chrome) {
                case 'undefined':
                    pageRefs.current[page].scrollIntoView({ behavior: 'smooth' });
                    break;
            
                default:
                    pageRefs.current[page].scrollIntoView({ behavior: 'instant' });
                    break;
            }
        }
        setPageNumber(page);
    };

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    return (
        <div
            css={tw`h-full w-full bg-secondary overflow-y-auto text-white`}
        >
            <div css={tw`h-[50px] w-full bg-primary border-b border-b-white/10 flex justify-between items-center p-3`}>
                <div css={tw`capitalize`}>
                    {name.split('.')[0]}
                </div>

                <div
                    css={tw`flex space-x-2 items-center`}
                >
                    {numPages && Array.from(Array(numPages).keys()).map(x => x + 1).map((i) => (
                        <Fragment
                            key={i}
                        >
                            <ActionButton
                                onClick={() => jumpToPage(i)}
                                disabled={pageNumber === i}
                                css={tw`h-[25px]`}
                            >
                                {i}
                            </ActionButton>
                            {i !== numPages && (
                                <span>/</span>
                            )}
                        </Fragment>
                    ))}
                </div>

                <div
                    css={tw`flex space-x-2`}
                >
                    <ActionButton
                        onClick={downloadDoc}
                    >
                        <FontAwesomeIcon icon={faDownload} />
                    </ActionButton>
                    <ActionButton
                        onClick={printDoc}
                    >
                        <FontAwesomeIcon icon={faFileImport} />
                    </ActionButton>
                </div>
            </div>

            <div css={tw`flex justify-center`}>
                <Document
                    file={source}
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    {numPages && (
                        Array.from(Array(numPages).keys()).map(x => x + 1).map((i) => (
                            <div
                                key={i}
                                ref={(element) => {
                                    if (pageRefs.current && element) pageRefs.current[i] = element;
                                }}
                            >
                                <Page pageNumber={i} />
                                <div css={tw`h-[5px] bg-secondary`}></div>
                            </div>
                        ))
                    )}
                </Document>
            </div>
        </div>
    );
}

export default memo(PDFViewer);