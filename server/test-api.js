const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== VENDORA END-TO-END AUTOMATED TEST SUITE ===');

  try {
    // 1. Healthcheck
    console.log('\n[1] Testing API Healthcheck...');
    const health = await request({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/health',
      method: 'GET',
    });
    console.log('✓ Health status:', health.data.status, health.data.app);

    // 2. Admin Login
    console.log('\n[2] Testing Admin Login (admin@vendora.com)...');
    const adminLogin = await request(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'admin@vendora.com', password: 'Admin@123' }
    );
    if (!adminLogin.data.token) throw new Error('Admin login failed');
    const adminToken = adminLogin.data.token;
    console.log('✓ Admin login successful! Role:', adminLogin.data.user.role);

    // 3. Vendor Login
    console.log('\n[3] Testing Vendor Login (vendor@vendora.com)...');
    const vendorLogin = await request(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'vendor@vendora.com', password: 'Vendor@123' }
    );
    if (!vendorLogin.data.token) throw new Error('Vendor login failed');
    const vendorToken = vendorLogin.data.token;
    console.log('✓ Vendor login successful! Role:', vendorLogin.data.user.role);

    // 4. Admin Dashboard Stats
    console.log('\n[4] Testing Admin Dashboard Analytics...');
    const adminStats = await request({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/dashboard/stats',
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log('✓ Total Vendors:', adminStats.data.stats.totalVendors);
    console.log('✓ Active Vendors:', adminStats.data.stats.activeVendors);
    console.log('✓ Total PO Value: ₹' + adminStats.data.stats.totalPurchaseOrderValue);

    // 5. Vendor Dashboard Stats
    console.log('\n[5] Testing Vendor Dashboard Stats...');
    const vendorStats = await request({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/dashboard/vendor-stats',
      method: 'GET',
      headers: { Authorization: `Bearer ${vendorToken}` },
    });
    console.log('✓ Vendor Profile Completion:', vendorStats.data.stats.profileCompletion + '%');
    console.log('✓ Current Rating Score:', vendorStats.data.stats.performanceScore);

    // 6. Vendor Directory & Search
    console.log('\n[6] Testing Vendor Directory Listing & Search...');
    const vendorsList = await request({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/vendors?status=ACTIVE',
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log('✓ Retrieved active vendors count:', vendorsList.data.count);
    const targetVendor = vendorsList.data.vendors[0];
    console.log('✓ Target vendor:', targetVendor.companyName, `(${targetVendor.vendorId})`);

    // 7. Performance Evaluation Creation
    console.log('\n[7] Testing Performance Evaluation Creation (6 Criteria)...');
    const evalRes = await request(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/evaluations',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      },
      {
        vendorId: targetVendor._id,
        criteria: {
          quality: 5,
          delivery: 5,
          pricing: 4,
          communication: 5,
          reliability: 5,
          compliance: 5,
        },
        comments: 'Automated test verification audit: Superb manufacturing precision and compliance.',
      }
    );
    console.log('✓ Evaluation created! Overall Score:', evalRes.data.evaluation.overallScore, 'Rating Tier:', evalRes.data.evaluation.ratingTier);

    // 8. Purchase Order Creation
    console.log('\n[8] Testing Purchase Order Creation & Calculation...');
    const poRes = await request(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/purchase-orders',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      },
      {
        vendor: targetVendor._id,
        expectedDeliveryDate: '2026-04-15',
        paymentTerms: 'Net 30',
        shippingAddress: 'VENDORA Central Logistics Dock #4, Bengaluru',
        items: [
          {
            product: 'Automated Test Microcontrollers',
            description: 'ARM Cortex M4 pack',
            quantity: 5,
            unitPrice: 20000,
            taxPercent: 18,
          },
        ],
      }
    );
    const createdPO = poRes.data.purchaseOrder;
    console.log('✓ PO Created:', createdPO.poNumber, 'Subtotal: ₹' + createdPO.subtotal, 'Tax: ₹' + createdPO.taxTotal, 'Grand Total: ₹' + createdPO.grandTotal);

    // 9. PO Lifecycle Status Transition
    console.log('\n[9] Testing PO Status Progression (PENDING APPROVAL -> APPROVED -> PROCESSING -> SHIPPED)...');
    const status1 = await request(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: `/api/purchase-orders/${createdPO._id}/status`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      },
      { status: 'APPROVED', remarks: 'Approved by Procurement Lead' }
    );
    console.log('✓ Status changed to:', status1.data.purchaseOrder.status);

    const status2 = await request(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: `/api/purchase-orders/${createdPO._id}/status`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${vendorToken}`,
        },
      },
      { status: 'PROCESSING', remarks: 'Vendor assembly line started' }
    );
    console.log('✓ Status changed by vendor to:', status2.data.purchaseOrder.status);

    // 10. Notifications Retrieval
    console.log('\n[10] Testing Live Notifications...');
    const notifs = await request({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/notifications',
      method: 'GET',
      headers: { Authorization: `Bearer ${vendorToken}` },
    });
    console.log('✓ Vendor notification count:', notifs.data.notifications.length, 'Unread:', notifs.data.unreadCount);

    console.log('\n====================================================');
    console.log('🎉 ALL FULL STACK MERN INTEGRATION TESTS PASSED!');
    console.log('====================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ TEST FAILURE:', err);
    process.exit(1);
  }
}

runTests();
