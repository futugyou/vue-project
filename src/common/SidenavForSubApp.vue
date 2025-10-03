<script setup lang="ts">
import { shallowRef, watch } from 'vue'

import Sidenav from '@/common/Sidenav.vue'
import IconECSService from '@/icons/ECSService.vue'
import IconSSM from '@/icons/SSM.vue'
import IconIAMUser from '@/icons/IAMUser.vue'
import IconS3Bucket from '@/icons/S3Bucket.vue'
import IconHome from '@/icons/Home.vue'
import IconPdf from '@/icons/Pdf.vue'
import IconOrc from '@/icons/Scan.vue'
import IconTranslate from '@/icons/Translate.vue'

const SidenavItems = [{
    route: "/",
    label: "Home",
    icon: IconHome,
}, {
    route: "/pdf",
    label: "Pdf",
    icon: IconPdf,
}, {
    route: "/ocr",
    label: "Ocr",
    icon: IconOrc,
}, {
    route: "/translate",
    label: "Translate",
    icon: IconTranslate,
}, {
    route: "/account",
    label: "Account",
    icon: IconIAMUser,
}, {
    route: "/parameter",
    label: "Parameter",
    icon: IconSSM,
}, {
    route: "/ecs",
    label: "Ecs Service",
    icon: IconECSService,
}, {
    route: "/s3",
    label: "S3Bucket",
    icon: IconS3Bucket,
},
]

</script>

<template>
    <Sidenav class="subappsidebar" :items="SidenavItems" />
</template>

<style scoped></style>
