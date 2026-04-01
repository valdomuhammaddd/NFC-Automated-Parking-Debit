/**
 * SIMPLIFIED DELETE FOR TESTING
 * Copy this into ManagePromotionsScreen.tsx to replace handleDelete
 */

const handleDeleteSimple = async (promo: Promotion) => {
  try {
    // 1. Log what we're deleting
    console.log('🗑️ [SIMPLE DELETE] Starting...');
    console.log('🗑️ Promo object:', JSON.stringify(promo, null, 2));
    console.log('🗑️ ID to delete:', promo.id, typeof promo.id);
    
    // 2. Convert to number
    const idNumber = parseInt(promo.id);
    if (isNaN(idNumber)) {
      throw new Error(`Invalid ID: ${promo.id}`);
    }
    console.log('🗑️ Converted to number:', idNumber);
    
    // 3. Call API
    console.log('🗑️ Calling API DELETE /api/promotions/' + idNumber);
    const response = await MarkirAPI.deletePromotion(idNumber);
    console.log('✅ API Response:', JSON.stringify(response, null, 2));
    
    // 4. Reload list
    console.log('🔄 Reloading promotions...');
    await loadPromotions();
    
    // 5. Show success
    console.log('✅ Delete completed!');
    Alert.alert('Success', `Deleted: ${promo.title}`);
    
  } catch (error: any) {
    console.error('❌ [SIMPLE DELETE] Error:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Full error:', JSON.stringify(error, null, 2));
    Alert.alert('Error', `Failed: ${error.message}\n\nCheck console for details`);
  }
};

// To use: Replace the delete button onPress with:
// onPress={() => handleDeleteSimple(promo)}
// (Remove the Alert.alert confirmation temporarily)
