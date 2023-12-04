
<script lang="ts" setup>
import { ref, PropType, computed } from 'vue'

import DPFViewer from '@/components/DPFViewer.vue'
import Button from '@/components/Button.vue'

const right = ref("")
const showTranslate = ref(false)
</script>

<template>
    <div class="viewer-content">
        <div class="viewer-container">
            <DPFViewer>
            </DPFViewer>
        </div>
        <div class="tran-contr">
            <Button Text="O" @click="showTranslate = !showTranslate"> </Button>
        </div>
        <div class="translate-container" v-if="showTranslate">
            <div>
                <Button Text="Translate">
                </Button>
            </div>
            <div class="text-container">
                <textarea v-model="right" placeholder=""></textarea>
            </div>
        </div>
    </div>
</template>
  
<style scoped>
.viewer-content {
    height: 100%;
    width: 100%;
    display: flex;
    grid-gap: 5px;
    padding: 0;
    margin: 0;
    overflow: hidden;
    flex-direction: row;
    position: relative;
}

.viewer-container {
    flex: 2;
}

.tran-contr {
    position: absolute;
    right: 10px;
    top: 0;
}

.translate-container {
    display: flex;
    flex-direction: column;
    grid-gap: 10px;
    flex: 1;
}

.text-container {
    flex-grow: 1;
}
</style>