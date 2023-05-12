import React, { useState} from 'react';
// @ts-ignore
import file from './../verticalAccordion/publications/pdf2.pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import './pdfDisplay.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function PdfDisplay() {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

            function onDocumentLoadSuccess({numPages}: any) {
                setNumPages(numPages);
            }

            function prevPage() {
                setPageNumber(pageNumber - 1)
            }

            function nextPage() {
                setPageNumber(pageNumber + 1)
            }

            return (
                <div className='pdf'>
                    <div className="react-pdf__Page">
                    <Document file={file}
                              onLoadSuccess={onDocumentLoadSuccess}>
                        <Page height={500} width={400} pageNumber={pageNumber}/>
                    </Document>
                    </div>
                    <div className="page-controls">
                        <button disabled={pageNumber <= 1} onClick={prevPage}><FontAwesomeIcon icon={faChevronLeft} /></button>
                        <p>{pageNumber} of {numPages}</p>
                        <button disabled={pageNumber === numPages} onClick={nextPage}><FontAwesomeIcon icon={faChevronRight} /></button>
                    </div>
                </div>
            );
}
export default PdfDisplay;