// app/api/validate-serial/route.js
import fs from 'fs';
import path from 'path';

// Parse HTML database to extract serial numbers and values
function parseDatabase() {
  try {
    const dbPath = path.join(process.cwd(), 'public/database.html');
    const htmlContent = fs.readFileSync(dbPath, 'utf8');

    // Extract data from HTML - look for table rows with serial data
    const serialRegex = /CNBRT3V[A-Z0-9]{3}|CNCHT[A-Z0-9]{5}/g;
    const serials = htmlContent.match(serialRegex) || [];

    // Mock data for validation - in production, parse from HTML properly
    const database = {
      'CNBRT3V5BF': { model: 'M430', lastCount: 526640, department: 'บริมาราษฎร รามตำแหน่ง' },
      'CNBRT3V62G': { model: 'M430', lastCount: 124532, department: 'บริมาราษฎร ปึกเสบียน' },
      'CNBRT3V64H': { model: 'M430', lastCount: 98765, department: 'บริมาราษฎร อะเริ่งเรา' },
      'CNBRT3V653': { model: 'M430', lastCount: 112345, department: 'บริมาราษฎร ประสวิน' },
      'CNBRT3V65W': { model: 'M430', lastCount: 234567, department: 'บริมาราษฎร วิจานสิเสร์' },
      'CNBRT3V66D': { model: 'M430', lastCount: 345678, department: 'รพ.พระทุเทพแม่บ้าน' },
      'CNBRT3V679': { model: 'M430', lastCount: 456789, department: 'รพ.ศรีธัญญา' },
      'CNCHT9L0F6': { model: 'M430', lastCount: 1438, department: 'ทดสอบ' },
    };

    return database;
  } catch (error) {
    console.error('Error reading database:', error);
    return null;
  }
}

export async function POST(request) {
  try {
    const { serialNumber, newCount, model } = await request.json();

    if (!serialNumber || newCount === undefined) {
      return new Response(JSON.stringify({
        error: 'Serial number and new count are required'
      }), { status: 400 });
    }

    const database = parseDatabase();

    if (!database) {
      return new Response(JSON.stringify({
        error: 'Database not found'
      }), { status: 500 });
    }

    const record = database[serialNumber];

    if (!record) {
      return new Response(JSON.stringify({
        valid: false,
        error: `Serial Number ${serialNumber} ไม่พบในฐานข้อมูล`,
        message: 'Serial Number นี้ไม่ถูกต้อง หรือไม่มีในระบบ'
      }), { status: 400 });
    }

    // Validate new count >= old count
    if (newCount < record.lastCount) {
      return new Response(JSON.stringify({
        valid: false,
        error: `ยอดใหม่ต่ำกว่ายอดเดิม`,
        message: `ยอดเดิม: ${record.lastCount.toLocaleString()} | ยอดใหม่: ${newCount.toLocaleString()}`,
        lastCount: record.lastCount,
        newCount: newCount,
        difference: newCount - record.lastCount
      }), { status: 400 });
    }

    // Validation passed
    const difference = newCount - record.lastCount;
    return new Response(JSON.stringify({
      valid: true,
      message: 'ยอดนับถูกต้อง',
      serialNumber: serialNumber,
      model: record.model,
      department: record.department,
      lastCount: record.lastCount,
      newCount: newCount,
      difference: difference,
      lastUpdated: new Date().toLocaleString('th-TH')
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Server error: ' + error.message
    }), { status: 500 });
  }
}

export async function GET() {
  try {
    const database = parseDatabase();

    if (!database) {
      return new Response(JSON.stringify({
        error: 'Database not found'
      }), { status: 500 });
    }

    return new Response(JSON.stringify({
      success: true,
      totalRecords: Object.keys(database).length,
      database: database
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Server error: ' + error.message
    }), { status: 500 });
  }
}
