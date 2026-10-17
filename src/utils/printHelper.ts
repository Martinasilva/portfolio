/**
 * Dedicated reliable print utility for web apps and iframes.
 * Provides both standard window.print() and dedicated clean-window printing
 * which bypasses all iframe/SPA style bleed issues.
 */

export function printElementDirectly(elementId: string, docTitle: string = 'Documento Oficial - Martina Morais da Silva') {
  const el = document.getElementById(elementId);
  if (!el) {
    window.print();
    return;
  }

  // Clone content
  const contentHtml = el.innerHTML;

  try {
    const printWin = window.open('', '_blank', 'width=900,height=800,menubar=no,toolbar=no,location=no,status=no');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(`
        <!DOCTYPE html>
        <html lang="pt">
        <head>
          <meta charset="utf-8" />
          <title>${docTitle}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 15mm 15mm 15mm 15mm;
            }
            * {
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: #111827;
              background: #ffffff;
              margin: 0;
              padding: 20px;
              line-height: 1.5;
              font-size: 11pt;
            }
            h1, h2, h3, h4 {
              color: #000000;
              margin-top: 0;
            }
            p {
              margin: 0 0 10px 0;
            }
            .no-print, button, .interactive-controls {
              display: none !important;
            }
            .a4-document-sheet, .print-card {
              box-shadow: none !important;
              border: none !important;
              padding: 0 !important;
              max-width: 100% !important;
              width: 100% !important;
            }
            /* A clean, compact certificate summary layout in the standalone print window. */
            #print-modal-certs-content {
              width: 100% !important;
              max-width: 100% !important;
              color: #111827;
              font-size: 10.5pt;
            }
            #print-modal-certs-content > div,
            #print-modal-certs-content > article {
              background: #ffffff !important;
              color: #111827 !important;
              border: 1px solid #d1d5db !important;
              border-radius: 5px !important;
              box-shadow: none !important;
              padding: 12px 14px !important;
              margin: 0 0 10px 0 !important;
              break-inside: avoid;
              page-break-inside: avoid;
            }
            #print-modal-certs-content h2 {
              font-size: 16pt;
              margin: 0 0 5px 0;
            }
            #print-modal-certs-content h3 {
              font-size: 12pt;
              margin: 3px 0;
            }
            #print-modal-certs-content p {
              margin: 3px 0;
              line-height: 1.4;
            }
            #print-modal-certs-content article > div {
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 7px;
              margin-bottom: 7px;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          ${contentHtml}
          <script>
            window.onload = function() {
              window.focus();
              setTimeout(function() {
                window.print();
              }, 250);
            };
          </script>
        </body>
        </html>
      `);
      printWin.document.close();
      return;
    }
  } catch (err) {
    console.warn('Popup blocked, falling back to window.print()', err);
  }

  // Fallback to window.print()
  window.print();
}

export function downloadPlainText(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
