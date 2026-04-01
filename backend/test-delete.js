// Quick test script for delete promotion
const axios = require('axios');

async function testDelete() {
  try {
    // 1. Get all promotions
    console.log('1️⃣ Getting all promotions...');
    const getResponse = await axios.get('http://localhost:3000/api/promotions');
    console.log('✅ Current promotions:', getResponse.data.data.map(p => `ID:${p.promotion_id} - ${p.title}`));
    
    if (getResponse.data.data.length === 0) {
      console.log('❌ No promotions to delete');
      return;
    }
    
    // 2. Delete first promotion
    const firstPromo = getResponse.data.data[0];
    console.log('\n2️⃣ Deleting promotion:', firstPromo.promotion_id, firstPromo.title);
    
    const deleteResponse = await axios.delete(`http://localhost:3000/api/promotions/${firstPromo.promotion_id}`);
    console.log('✅ Delete response:', deleteResponse.data);
    
    // 3. Get promotions again to verify
    console.log('\n3️⃣ Getting promotions after delete...');
    const afterDelete = await axios.get('http://localhost:3000/api/promotions');
    console.log('✅ Remaining promotions:', afterDelete.data.data.map(p => `ID:${p.promotion_id} - ${p.title}`));
    console.log('\n🎉 Delete test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testDelete();
