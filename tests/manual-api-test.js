/**
 * API Test Script
 * Tests all endpoints of the refactored backend
 */

const baseURL = 'http://localhost:3000';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}`),
};

/**
 * Test runner
 */
const runTests = async () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log('🧪 Testing Landing Page Backend API');
  console.log(`${'='.repeat(60)}\n`);

  let passedTests = 0;
  let failedTests = 0;

  // Test 1: Root endpoint
  log.section('Test 1: GET / (Root endpoint)');
  try {
    const response = await fetch(baseURL);
    const text = await response.text();
    
    if (response.status === 200 && text === 'Landing page backend is running') {
      log.success(`Status: ${response.status}`);
      log.success(`Response: "${text}"`);
      passedTests++;
    } else {
      log.error(`Expected 200 and specific text, got ${response.status}`);
      failedTests++;
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
    failedTests++;
  }

  // Test 2: Health check
  log.section('Test 2: GET /health (Health check)');
  try {
    const response = await fetch(`${baseURL}/health`);
    const data = await response.json();
    
    if (response.status === 200 && data.status === 'success') {
      log.success(`Status: ${response.status}`);
      log.success(`Message: ${data.message}`);
      log.success(`Uptime: ${Math.floor(data.uptime)}s`);
      passedTests++;
    } else {
      log.error(`Health check failed`);
      failedTests++;
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
    failedTests++;
  }

  // Test 3: Database health check
  log.section('Test 3: GET /health/db (Database health)');
  try {
    const response = await fetch(`${baseURL}/health/db`);
    const data = await response.json();
    
    if (response.status === 200 && data.status === 'success') {
      log.success(`Status: ${response.status}`);
      log.success(`Message: ${data.message}`);
      log.success(`DB Timestamp: ${data.timestamp}`);
      passedTests++;
    } else {
      log.error(`Database health check failed`);
      failedTests++;
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
    failedTests++;
  }

  // Test 4: Create contact (valid data) - New API endpoint
  log.section('Test 4: POST /api/contact (Valid data)');
  try {
    const response = await fetch(`${baseURL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: 'This is a test message from the professional backend API test script',
      }),
    });
    const data = await response.json();
    
    if (response.status === 201 && data.status === 'success') {
      log.success(`Status: ${response.status}`);
      log.success(`Contact ID: ${data.data.id}`);
      log.success(`Name: ${data.data.name}`);
      log.success(`Email: ${data.data.email}`);
      passedTests++;
    } else {
      log.error(`Failed to create contact: ${JSON.stringify(data)}`);
      failedTests++;
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
    failedTests++;
  }

  // Test 5: Create contact (legacy endpoint)
  log.section('Test 5: POST /contact (Legacy endpoint)');
  try {
    const response = await fetch(`${baseURL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        message: 'Testing legacy endpoint for backward compatibility',
      }),
    });
    const data = await response.json();
    
    if (response.status === 201 && data.status === 'success') {
      log.success(`Status: ${response.status}`);
      log.success(`Legacy endpoint works!`);
      passedTests++;
    } else {
      log.error(`Legacy endpoint failed: ${JSON.stringify(data)}`);
      failedTests++;
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
    failedTests++;
  }

  // Test 6: Validation - Missing fields
  log.section('Test 6: POST /api/contact (Missing fields)');
  try {
    const response = await fetch(`${baseURL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        // message is missing
      }),
    });
    const data = await response.json();
    
    if (response.status === 400 && data.status === 'fail') {
      log.success(`Status: ${response.status} (Expected error)`);
      log.success(`Error message: ${data.message}`);
      passedTests++;
    } else {
      log.error(`Expected 400 error, got ${response.status}`);
      failedTests++;
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
    failedTests++;
  }

  // Test 7: Validation - Invalid email
  log.section('Test 7: POST /api/contact (Invalid email)');
  try {
    const response = await fetch(`${baseURL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'invalid-email',
        message: 'This should fail validation',
      }),
    });
    const data = await response.json();
    
    if (response.status === 400 && data.status === 'fail') {
      log.success(`Status: ${response.status} (Expected error)`);
      log.success(`Error message: ${data.message}`);
      passedTests++;
    } else {
      log.error(`Expected 400 error, got ${response.status}`);
      failedTests++;
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
    failedTests++;
  }

  // Test 8: Validation - Short message
  log.section('Test 8: POST /api/contact (Message too short)');
  try {
    const response = await fetch(`${baseURL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Short',
      }),
    });
    const data = await response.json();
    
    if (response.status === 400 && data.status === 'fail') {
      log.success(`Status: ${response.status} (Expected error)`);
      log.success(`Error message: ${data.message}`);
      passedTests++;
    } else {
      log.error(`Expected 400 error, got ${response.status}`);
      failedTests++;
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
    failedTests++;
  }

  // Test 9: 404 Not Found
  log.section('Test 9: GET /nonexistent (404 handling)');
  try {
    const response = await fetch(`${baseURL}/nonexistent`);
    const data = await response.json();
    
    if (response.status === 404) {
      log.success(`Status: ${response.status} (Expected)`);
      log.success(`Error message: ${data.message}`);
      passedTests++;
    } else {
      log.error(`Expected 404, got ${response.status}`);
      failedTests++;
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
    failedTests++;
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 Test Summary');
  console.log(`${'='.repeat(60)}`);
  console.log(`${colors.green}✓ Passed: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}✗ Failed: ${failedTests}${colors.reset}`);
  console.log(`Total: ${passedTests + failedTests}`);
  console.log(`Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);
  console.log(`${'='.repeat(60)}\n`);

  if (failedTests === 0) {
    console.log(`${colors.green}🎉 All tests passed!${colors.reset}\n`);
  } else {
    console.log(`${colors.yellow}⚠️  Some tests failed. Please check the errors above.${colors.reset}\n`);
  }
};

// Run tests
runTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
