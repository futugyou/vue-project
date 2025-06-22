
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const googleClientId = import.meta.env.VUE_APP_GOOGLE_CLIENT_ID
  const googleAppId = import.meta.env.VUE_APP_GOOGLE_APP_ID
  
  const showPicker = ref(false);
  const authenticatedToken = ref<string | null>(null);
  const selectedFiles = ref<any[]>([]);
  
  /**
   * Handles the 'picker:authenticated' event.
   * This event fires when the Drive Picker successfully obtains an OAuth token.
   */
  const handlePickerAuthenticated = (event: CustomEvent<{ token: string }>) => {
    console.log('Picker Authenticated. Token:', event.detail.token)
    // Store the token if you need it for other Google API calls
    authenticatedToken.value = event.detail.token
  }
  
  /**
   * Handles the 'picker:canceled' event.
   * Fired when the user closes the picker without making a selection.
   */
  const handlePickerCanceled = () => {
    console.log('Picker Cancelled');
    showPicker.value = false; // Hide the picker
  }
  
  /**
   * Handles the 'picker:picked' event.
   * Fired when the user selects files from the picker.
   */
  const handlePickerPicked = (event: CustomEvent<{ action: string; docs: any[] }>) => {
    console.log('Picker Picked:', event.detail)
    if (event.detail.action === 'picked') {
      selectedFiles.value = event.detail.docs
      showPicker.value = false // Hide the picker after selection
    }
  }
  </script>
  
  <template>
    <div>
      <h2>Google Drive Picker (Simplified Auth)</h2>
      <p>The picker will handle authentication once it's visible.</p>
  
      <button @click="showPicker = true" :disabled="showPicker">Open Drive Picker</button>
  
      <drive-picker
        v-if="showPicker"
        prompt="" 
        :client-id="googleClientId"
        :app-id="googleAppId"
        @picker:authenticated="handlePickerAuthenticated"
        @picker:canceled="handlePickerCanceled"
        @picker:picked="handlePickerPicked"
      >
        <drive-picker-docs-view></drive-picker-docs-view>
      </drive-picker>
  
      <div v-if="authenticatedToken">
        <h3>Authenticated Token (for reference):</h3>
        <p>{{ authenticatedToken }}</p>
      </div>
  
      <div v-if="selectedFiles.length > 0">
        <h3>Selected Files:</h3>
        <ul>
          <li v-for="file in selectedFiles" :key="file.id">
            {{ file.name }} ({{ file.url }})
          </li>
        </ul>
      </div>
    </div>
  </template>
  

  <style scoped>
  /* Add some basic styling if needed */
  div {
    margin-top: 20px;
  }
  
  button {
    padding: 10px 15px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
  
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  </style>