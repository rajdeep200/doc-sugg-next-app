"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfViewer() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setPageNumber((prev) => Math.min(prev + 1, numPages));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start px-4 py-6 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-4 sm:mb-6">
        📄 View Document
      </h1>

      <div className="flex gap-3 sm:gap-4 mb-4">
        <button
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
          className="bg-purple-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded hover:bg-purple-700 disabled:opacity-50 transition"
        >
          Prev
        </button>
        <button
          onClick={goToNextPage}
          disabled={pageNumber >= numPages}
          className="bg-purple-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded hover:bg-purple-700 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>

      <div className="w-full max-w-full sm:max-w-2xl md:max-w-3xl bg-white p-2 sm:p-4 rounded shadow overflow-x-auto">
        <Document file="/sample2.pdf" onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} scale={scale} />
        </Document>
      </div>

      <p className="text-gray-600 mt-4 text-sm sm:text-base">
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
}
