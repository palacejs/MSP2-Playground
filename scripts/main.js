// Dynamic Button Loading
async function getActiveButtons() {
  try {
    // Try JSON data first
    if (window.dataManager) {
      return await window.dataManager.getActiveButtons();
    }
    return [];
  } catch (error) {
    console.log('Could not load buttons from JSON:', error);
    return [];
  }
}

async function getAllNews() {
  try {
    // Try JSON data first
    if (window.dataManager) {
      return await window.dataManager.getAllNews();
    }
    return [];
  } catch (error) {
    console.log('Could not load news from JSON:', error);
    return [];
  }
}
