// Styles
import 'vuetify/styles'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

// Composables
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import { VDateInput } from 'vuetify/labs/VDateInput'
import * as directives from 'vuetify/directives'
import { aliases, md } from 'vuetify/iconsets/md'
import { md3 } from 'vuetify/blueprints'

export default createVuetify({
    theme: {
        defaultTheme: 'light',
    },
    blueprint: md3,
    components: {
        ...components,
        VDateInput,
    },
    directives,
    icons: {
        defaultSet: 'md',
        aliases,
        sets: {
            md,
        },
    },
    defaults: {
        global: {
            density: "compact",
            hideDetails: true,
        },
        VBtn: { variant: 'outlined' },
        VSelect: { variant: 'outlined', centerAffix: true },
        VCheckbox: { color: "red" },
        VTable: { density: "comfortable" },
    },
})
