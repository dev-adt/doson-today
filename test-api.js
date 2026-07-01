const fetch = (...a) => import('node-fetch').then(({ default: f }) => f(...a));

(async () => {
  try {
    console.log('=== TEST 1: Requesting /api/events ===');
    const res1 = await fetch('http://localhost:3011/api/events');
    const data1 = await res1.json();
    console.log('Total count returned:', data1.data ? data1.data.length : 'null');
    console.log('Events:', data1.data ? data1.data.map(d => ({ id: d.id, title: d.title, status: d.status, interest: d.interest_count })) : 'no data');

    console.log('\n=== TEST 2: Requesting /api/events?limit=3&upcoming=true ===');
    const res2 = await fetch('http://localhost:3011/api/events?limit=3&upcoming=true');
    const data2 = await res2.json();
    console.log('Total count returned:', data2.data ? data2.data.length : 'null');
    console.log('Events:', data2.data ? data2.data.map(d => ({ id: d.id, title: d.title, status: d.status, interest: d.interest_count })) : 'no data');
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
