<script lang="ts" setup>
import { reactive, ref, computed, onMounted, watch, watchEffect } from 'vue'

const message = ref("")
const checked = ref(false)
const checkedNames = ref<string[]>([])
const picked = ref("")
const selected = ref<string[]>([])
const options = ref([
    { text: 'One', value: 'A' },
    { text: 'Two', value: 'B' },
    { text: 'Three', value: 'C' }
])
</script>

<template>
    <div class="vueapp-container">
        <div class="vueapp-layer">
            <h2>Text</h2>
            <p>Message is: {{ message }}</p>
            <input v-model="message" placeholder="edit me" />
        </div>
        <div class="vueapp-layer">
            <h2>Multiline</h2>
            <span>Multiline message is:</span>
            <p style="white-space: pre-line;">{{ message }}</p>
            <textarea v-model="message" placeholder="add multiple lines"></textarea>
        </div>
        <div class="vueapp-layer">
            <h2>Checkbox</h2>
            <input type="checkbox" id="checkbox" v-model="checked" />
            <label for="checkbox">{{ checked }}</label>
        </div>
        <div class="vueapp-layer">
            <h2>Checkbox 2</h2>
            <div>Checked names: {{ checkedNames }}</div>

            <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
            <label for="jack">Jack</label>

            <input type="checkbox" id="john" value="John" v-model="checkedNames">
            <label for="john">John</label>

            <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
            <label for="mike">Mike</label>
        </div>
        <div class="vueapp-layer">
            <h2>Radio</h2>
            <div>Picked: {{ picked }}</div>

            <input type="radio" id="one" value="One" v-model="picked" />
            <label for="one">One</label>

            <input type="radio" id="two" value="Two" v-model="picked" />
            <label for="two">Two</label>
        </div>
        <div class="vueapp-layer">
            <h2>Select</h2>
            <div>Selected: {{ selected }}</div>

            <select v-model="selected" multiple>
                <option disabled value="">Please select one</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
            </select>

            <select v-model="selected" multiple>
                <option disabled value="">Please select one</option>
                <option v-for="option in options" :value="option.value">
                    {{ option.text }}
                </option>
            </select>
        </div>
    </div>
</template>

<style>

</style>