<script lang="ts" setup>

import Moveable, { OnRotate, OnDrag, OnScale } from "vue3-moveable"

defineProps({
    selector: String
})

const onDrag = (e: OnDrag) => {
    e.target.style.transform = e.transform;
}

const onScale = (e: OnScale) => {
    e.target.style.transform = e.drag.transform
}

const onRotate = (e: OnRotate) => {
    e.target.style.transform = e.drag.transform
}

</script>
    
<template>
    <Moveable :target="[selector]" :draggable="true" :throttleDrag="1" :edgeDraggable="false" :startDragRotate="0"
        :throttleDragRotate="0" @drag="onDrag" @rotate="onRotate" @scale="onScale" />
</template>
  
<style scoped>  div[data-able-draggable] {
      --moveable-color: transparent;
  }

  div[data-able-draggable] div.moveable-control {
      border-color: transparent !important;
  }
</style>