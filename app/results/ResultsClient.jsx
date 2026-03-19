'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ResultsClient() {
  const router = useRouter();
  const [exporting, setExporting] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [validating, setValidating] = useState(false);

  // Mock data from PDF extraction
  const pdfData = {
    fileName: 'รามตำแหน่ง 03.69.pdf',
    totalPages: 50,
    extractedDate: new Date().toLocaleDateString('th-TH'),
    extractedTime: new Date().toLocaleTimeString('th-TH'),
    accuracy: '96-98%',
    processingTime: '8.5s',
    model: 'M430',
    serialNumber: 'CNCHT9L0F6',
  };

  const userData = {
    username: 'Admin',
    department: 'รามตำแหน่ง',
    date: '19/03/2026',
    scanType: 'HP LaserJet M430 Usage Page',
  };

  const extractedData = {
    totalPages: 1438,
    printPages: 526640,
    copyPages: 124532,
    scanPages: 98765,
    faxPages: 12345,
    colorPages: 245632,
    bwPages: 280008,
    a4Pages: 650000,
    a3Pages: 120000,
    errors: 0,
    tonerLevel: '87%',
    drumLevel: '92%',
    fuserTemp: '210°C',
  };

  };

  const handleValidate = async () => {
    setValidating(true);
    try {
      const response = await fetch('/api/validate-serial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serialNumber: pdfData.serialNumber,
          newCount: extractedData.totalPages,
          model: pdfData.model
        })
      });

      const result = await response.json();
      setValidationResult(result);

      if (response.ok) {
        alert('✅ ยอดถูกต้อง!\n\n' + 
          'ยอดเดิม: ' + result.lastCount.toLocaleString() + '\n' +
          'ยอดใหม่: ' + result.newCount.toLocaleString() + '\n' +
          'เพิ่มขึ้น: ' + result.difference.toLocaleString());
      } else {
        alert('❌ ' + result.error + '\n\n' + result.message);
      }
    } catch (error) {
      alert('❌ Error: ' + error.message);
    } finally {
      setValidating(false);
    }
  };

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      // Simulated export
      const data = {
        pdf: pdfData,
        user: userData,
        extracted: extractedData,
      };
      
      const csv = generateCSV(data);
      downloadFile(csv, `${pdfData.fileName.replace('.pdf', '')}_extracted.csv`, 'text/csv');
      
      alert('✅ ส่งออก Excel สำเร็จ!');
    } catch (error) {
      alert('❌ Error: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  const generateCSV = (data) => {
    let csv = 'TIS Service v2.0 - Printer Data Export\n';
    csv += `Generated: ${new Date().toLocaleString('th-TH')}\n\n`;
    
    // PDF Info
    csv += 'PDF Information\n';
    csv += `File Name,${data.pdf.fileName}\n`;
    csv += `Pages,${data.pdf.totalPages}\n`;
    csv += `Model,${data.pdf.model}\n`;
    csv += `Serial Number,${data.pdf.serialNumber}\n`;
    csv += `Accuracy,${data.pdf.accuracy}\n\n`;
    
    // User Info
    csv += 'User Information\n';
    csv += `Username,${data.user.username}\n`;
    csv += `Department,${data.user.department}\n`;
    csv += `Date,${data.user.date}\n\n`;
    
    // Extracted Data
    csv += 'Extracted Data\n';
    csv += 'Metric,Value\n';
    csv += `Total Pages,${data.extracted.totalPages}\n`;
    csv += `Print Pages,${data.extracted.printPages}\n`;
    csv += `Copy Pages,${data.extracted.copyPages}\n`;
    csv += `Scan Pages,${data.extracted.scanPages}\n`;
    csv += `Fax Pages,${data.extracted.faxPages}\n`;
    csv += `Color Pages,${data.extracted.colorPages}\n`;
    csv += `B&W Pages,${data.extracted.bwPages}\n`;
    csv += `A4 Pages,${data.extracted.a4Pages}\n`;
    csv += `A3 Pages,${data.extracted.a3Pages}\n`;
    csv += `Toner Level,${data.extracted.tonerLevel}\n`;
    csv += `Drum Level,${data.extracted.drumLevel}\n`;
    csv += `Errors,${data.extracted.errors}\n`;
    
    return csv;
  };

  const downloadFile = (content, fileName, type) => {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      padding: '2rem',
      fontFamily: 'Segoe UI, system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem' }}>
              🖨️ Printer Usage PDF → Excel
            </h1>
            <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>
              ดึงข้อมูล Usage Page จาก HP Printer ด้วย AI เสร็จสมบูรณ์แล้ว
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
              ✅ Accuracy: <strong>{pdfData.accuracy}</strong>
            </div>
            <button
              onClick={() => router.push('/tis-printer')}
              style={{
                padding: '0.5rem 1rem',
                background: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              ← ย้อนกลับ
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          {/* Left Column */}
          <div>
            {/* PDF Information */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,.1)'
            }}>
              <h2 style={{ marginTop: 0, fontSize: '1.1rem', color: '#333' }}>
                📄 ข้อมูล PDF
              </h2>
              <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem' }}>
                  <strong>ชื่อไฟล์:</strong>
                  <span>{pdfData.fileName}</span>
                  
                  <strong>จำนวนหน้า:</strong>
                  <span>{pdfData.totalPages} หน้า</span>
                  
                  <strong>รุ่นเครื่อง:</strong>
                  <span>{pdfData.model}</span>
                  
                  <strong>Serial Number:</strong>
                  <span>{pdfData.serialNumber}</span>
                  
                  <strong>ความแม่นยำ:</strong>
                  <span style={{ color: '#059669', fontWeight: '600' }}>{pdfData.accuracy}</span>
                  
                  <strong>เวลาประมวลผล:</strong>
                  <span>{pdfData.processingTime}</span>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,.1)'
            }}>
              <h2 style={{ marginTop: 0, fontSize: '1.1rem', color: '#333' }}>
                👤 ข้อมูลผู้ใช้
              </h2>
              <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem' }}>
                  <strong>ชื่อผู้ใช้:</strong>
                  <span>
                    <span style={{ 
                      background: '#3b82f6', 
                      color: '#fff', 
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.85rem'
                    }}>
                      🔑 {userData.username}
                    </span>
                  </span>
                  
                  <strong>แผนก:</strong>
                  <span>{userData.department}</span>
                  
                  <strong>วันที่ดำเนิน:</strong>
                  <span>{userData.date}</span>
                  
                  <strong>ประเภทสแกน:</strong>
                  <span>{userData.scanType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Extracted Data */}
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,.1)'
            }}>
              <h2 style={{ marginTop: 0, fontSize: '1.1rem', color: '#333' }}>
                📊 ข้อมูลที่ดึงมา
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                fontSize: '0.9rem'
              }}>
                <div style={{ background: '#eff6ff', padding: '0.75rem', borderRadius: '6px' }}>
                  <div style={{ color: '#666', fontSize: '0.8rem' }}>Total Pages</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1d4ed8' }}>
                    {extractedData.totalPages.toLocaleString()}
                  </div>
                </div>

                <div style={{ background: '#f0fdf4', padding: '0.75rem', borderRadius: '6px' }}>
                  <div style={{ color: '#666', fontSize: '0.8rem' }}>Print Pages</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#059669' }}>
                    {extractedData.printPages.toLocaleString()}
                  </div>
                </div>

                <div style={{ background: '#fef3c7', padding: '0.75rem', borderRadius: '6px' }}>
                  <div style={{ color: '#666', fontSize: '0.8rem' }}>Copy Pages</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#d97706' }}>
                    {extractedData.copyPages.toLocaleString()}
                  </div>
                </div>

                <div style={{ background: '#fce7f3', padding: '0.75rem', borderRadius: '6px' }}>
                  <div style={{ color: '#666', fontSize: '0.8rem' }}>Scan Pages</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#ec4899' }}>
                    {extractedData.scanPages.toLocaleString()}
                  </div>
                </div>

                <div style={{ background: '#f3e8ff', padding: '0.75rem', borderRadius: '6px' }}>
                  <div style={{ color: '#666', fontSize: '0.8rem' }}>Color Pages</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#9333ea' }}>
                    {extractedData.colorPages.toLocaleString()}
                  </div>
                </div>

                <div style={{ background: '#f5f3ff', padding: '0.75rem', borderRadius: '6px' }}>
                  <div style={{ color: '#666', fontSize: '0.8rem' }}>B&W Pages</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#6366f1' }}>
                    {extractedData.bwPages.toLocaleString()}
                  </div>
                </div>

                <div style={{ background: '#f0f9ff', padding: '0.75rem', borderRadius: '6px' }}>
                  <div style={{ color: '#666', fontSize: '0.8rem' }}>Toner Level</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#0284c7' }}>
                    {extractedData.tonerLevel}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                  <div>
                    <div style={{ color: '#666' }}>Drum Level</div>
                    <div style={{ fontWeight: '600' }}>{extractedData.drumLevel}</div>
                  </div>
                  <div>
                    <div style={{ color: '#666' }}>Fuser Temp</div>
                    <div style={{ fontWeight: '600' }}>{extractedData.fuserTemp}</div>
                  </div>
                  <div>
                    <div style={{ color: '#666' }}>A4 Pages</div>
                    <div style={{ fontWeight: '600' }}>{extractedData.a4Pages.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ color: '#666' }}>A3 Pages</div>
                    <div style={{ fontWeight: '600' }}>{extractedData.a3Pages.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Validation Status */}
        {validationResult && (
          <div style={{
            background: validationResult.valid ? '#f0fdf4' : '#fef2f2',
            border: `2px solid ${validationResult.valid ? '#059669' : '#dc2626'}`,
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{
              margin: '0 0 1rem 0',
              color: validationResult.valid ? '#059669' : '#dc2626',
              fontSize: '1.1rem'
            }}>
              {validationResult.valid ? '✅ ผลการตรวจสอบ: ถูกต้อง' : '❌ ผลการตรวจสอบ: ผิดพลาด'}
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              fontSize: '0.9rem'
            }}>
              <div>
                <div style={{ color: '#666' }}>Serial Number</div>
                <div style={{ fontWeight: '600', fontSize: '1rem' }}>{validationResult.serialNumber}</div>
              </div>
              <div>
                <div style={{ color: '#666' }}>Model</div>
                <div style={{ fontWeight: '600', fontSize: '1rem' }}>{validationResult.model}</div>
              </div>
              {validationResult.lastCount && (
                <>
                  <div>
                    <div style={{ color: '#666' }}>ยอดเดิม</div>
                    <div style={{ fontWeight: '600', fontSize: '1rem' }}>
                      {validationResult.lastCount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#666' }}>ยอดใหม่</div>
                    <div style={{ fontWeight: '600', fontSize: '1rem' }}>
                      {validationResult.newCount.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <div style={{ color: '#666' }}>เพิ่มขึ้น</div>
                    <div style={{
                      fontWeight: '600',
                      fontSize: '1.2rem',
                      color: validationResult.valid ? '#059669' : '#dc2626'
                    }}>
                      {validationResult.difference.toLocaleString()}
                    </div>
                  </div>
                </>
              )}
              {validationResult.error && (
                <div style={{ gridColumn: '1/-1', color: '#dc2626', fontWeight: '600' }}>
                  ❌ {validationResult.error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,.1)',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleValidate}
            disabled={validating}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '1rem',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: validating ? 'not-allowed' : 'pointer',
              opacity: validating ? 0.7 : 1
            }}
          >
            {validating ? '⏳ กำลังตรวจสอบ...' : '✅ ตรวจสอบ Serial & ยอดนับ'}
          </button>

          <button
            onClick={handleExportExcel}
            disabled={exporting}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '1rem',
              background: '#059669',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: exporting ? 'not-allowed' : 'pointer',
              opacity: exporting ? 0.7 : 1
            }}
          >
            {exporting ? '⏳ กำลังส่งออก...' : '📥 ส่งออก Excel'}
          </button>

          <button
            onClick={() => {
              const text = JSON.stringify({ pdf: pdfData, user: userData, data: extractedData }, null, 2);
              downloadFile(text, 'data.json', 'application/json');
              alert('✅ ส่งออก JSON สำเร็จ!');
            }}
            style={{
              flex: 1,
              padding: '1rem',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            📄 ส่งออก JSON
          </button>

          <button
            onClick={() => window.print()}
            style={{
              flex: 1,
              padding: '1rem',
              background: '#8b5cf6',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🖨️ พิมพ์ผล
          </button>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          textAlign: 'center',
          color: '#666',
          fontSize: '0.85rem'
        }}>
          <p>✅ ทำการประมวลผลเรียบร้อย | ได้มา: {pdfData.extractedTime}</p>
          <p>TIS Service v2.0 - Paddle OCR {pdfData.accuracy}</p>
        </div>
      </div>
    </div>
  );
}
