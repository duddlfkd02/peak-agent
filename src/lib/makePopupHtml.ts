export function makePopupHtml(htmlText: string, selectedLeadName: string) {
  return `
          <html lang="ko">
            <head>
              <meta charset="UTF-8" />
              <title>미리보기</title>
              <style>
                body {
                  margin: 0 auto;
                  padding: 20px;
                  max-width: 900px;
                  font-family: "Noto Sans KR", sans-serif;
                  background-color: #f5f5f5;
                }
                #save-pdf-button {
                  position: fixed;
                  top: 20px;
                  right: 20px;
                  z-index: 1000;
                  padding: 10px 20px;
                  background-color: #4708dc;
                  color: white;
                  border: none;
                  font-size: 16px;
                  cursor: pointer;
                  border-radius: 8px;
                }
              </style>
            </head>
            <body>
              <div id="html-content">${htmlText}</div>
              <button id="save-pdf-button">PDF로 저장하기</button>
  
              <script>
                // html2pdf 스크립트 로드
                const script = document.createElement("script");
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
                script.integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg=="
                script.crossOrigin="anonymous"
                script.referrerPolicy="no-referrer"

                script.onload = async () => {
                  document.getElementById("save-pdf-button").onclick = async () => {
                    const content = document.getElementById("html-content");
  
                    // 이미지 로딩 대기
                    const images = content.querySelectorAll("img");
                    await Promise.all([...images].map(img => {
                      if (img.complete) return Promise.resolve();
                      return new Promise(resolve => {
                        img.onload = resolve;
                        img.onerror = resolve;
                      });
                    }));
  
                    // PDF 생성
                    html2pdf().set({
                      margin:       20,
                      filename:     '기업분석_${selectedLeadName}.pdf',
                      image:        { type: 'jpeg', quality: 0.98 },
                      html2canvas:  { scale: 2 },
                      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
                    }).from(content).save();
                  };
                };
                document.body.appendChild(script);
              </script>
            </body>
          </html>
        `;
}
