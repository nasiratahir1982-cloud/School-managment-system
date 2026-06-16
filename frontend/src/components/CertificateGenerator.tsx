// @ts-nocheck
import html2pdf from 'html2pdf.js';

interface CertificateProps {
  studentName: string;
  courseName: string;
  issueDate: string;
  issuerName: string;
  schoolName: string;
  themeColor: string;
  logoUrl?: string;
}

export const generateCertificatePDF = (props: CertificateProps) => {
  const container = document.createElement('div');
  container.style.width = '1122px'; // A4 landscape width at 96dpi
  container.style.height = '793px'; // A4 landscape height
  container.style.padding = '40px';
  container.style.backgroundColor = '#f8fafc';
  container.style.display = 'flex';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'center';

  const logoHtml = props.logoUrl 
    ? `<img src="${props.logoUrl}" style="height: 80px; width: auto; margin-bottom: 20px;" />` 
    : `<div style="height: 80px; width: 80px; border-radius: 50%; background-color: ${props.themeColor}; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 30px; font-weight: bold;">${props.schoolName.charAt(0)}</div>`;

  container.innerHTML = `
    <div style="width: 100%; height: 100%; border: 15px solid ${props.themeColor}; padding: 10px; box-sizing: border-box; background: white; position: relative;">
      <div style="border: 2px solid ${props.themeColor}; height: 100%; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; text-align: center; position: relative;">
        
        <!-- Corner Ornaments -->
        <div style="position: absolute; top: -2px; left: -2px; width: 50px; height: 50px; border-top: 5px solid ${props.themeColor}; border-left: 5px solid ${props.themeColor};"></div>
        <div style="position: absolute; top: -2px; right: -2px; width: 50px; height: 50px; border-top: 5px solid ${props.themeColor}; border-right: 5px solid ${props.themeColor};"></div>
        <div style="position: absolute; bottom: -2px; left: -2px; width: 50px; height: 50px; border-bottom: 5px solid ${props.themeColor}; border-left: 5px solid ${props.themeColor};"></div>
        <div style="position: absolute; bottom: -2px; right: -2px; width: 50px; height: 50px; border-bottom: 5px solid ${props.themeColor}; border-right: 5px solid ${props.themeColor};"></div>

        ${logoHtml}

        <h1 style="color: ${props.themeColor}; font-family: serif; font-size: 48px; font-weight: bold; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 4px;">Certificate of Achievement</h1>
        <p style="color: #64748b; font-size: 18px; margin-bottom: 40px; text-transform: uppercase; letter-spacing: 2px;">This is proudly presented to</p>

        <h2 style="font-size: 56px; font-family: 'Great Vibes', cursive, serif; font-weight: normal; color: #0f172a; margin: 0 0 40px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; width: 80%; display: inline-block;">
          <i>${props.studentName}</i>
        </h2>

        <p style="color: #475569; font-size: 20px; max-width: 800px; line-height: 1.6; margin-bottom: 60px;">
          For successfully completing the rigorous requirements and demonstrating exceptional proficiency in <br/>
          <strong style="color: ${props.themeColor}; font-size: 24px;">${props.courseName}</strong>
        </p>

        <div style="display: flex; justify-content: space-between; width: 80%; margin-top: auto;">
          <div style="text-align: center;">
            <div style="border-bottom: 1px solid #94a3b8; width: 200px; margin-bottom: 10px; padding-bottom: 5px; font-weight: bold; color: #334155;">
              ${props.issueDate}
            </div>
            <div style="color: #64748b; font-size: 14px; text-transform: uppercase;">Date of Issue</div>
          </div>

          <div style="width: 100px; height: 100px; border-radius: 50%; border: 3px dashed ${props.themeColor}; display: flex; align-items: center; justify-content: center; transform: rotate(-15deg);">
            <div style="color: ${props.themeColor}; font-size: 14px; font-weight: bold; text-align: center; text-transform: uppercase;">Official<br/>Seal</div>
          </div>

          <div style="text-align: center;">
            <div style="border-bottom: 1px solid #94a3b8; width: 200px; margin-bottom: 10px; padding-bottom: 5px; font-weight: bold; font-family: cursive; color: #334155;">
              ${props.issuerName}
            </div>
            <div style="color: #64748b; font-size: 14px; text-transform: uppercase;">Authorized Signature</div>
          </div>
        </div>

      </div>
    </div>
  `;

  const opt = {
    margin:       0,
    filename:     `${props.studentName.replace(/\s+/g, '_')}_${props.courseName.replace(/\s+/g, '_')}_Certificate.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
  };

  html2pdf().set(opt).from(container).save();
};
