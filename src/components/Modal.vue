<script lang="tsx">
import { defineComponent, ref } from 'vue'

// vue need default
export default () => <div></div>

export const Modal = defineComponent({
    name: 'Modal',
    props: {
        id: String,
        title: String
    },
    setup(props, { slots }) {
        return () => (
            <div
                class="modal fade"
                id={props.id}
                tabindex="-1"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
            >
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5">{props.title}</h1>
                            <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                            ></button>
                        </div>
                        <div class="modal-body">{slots.default && slots.default()}</div>
                        {/* <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                            <button type="button" class="btn btn-primary">
                                Save changes
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>
        )
    }
})

export const ModalButton = defineComponent({
    name: 'ModalButton',
    props: {
        targetId: String,
        title: String
    },
    setup(props, { slots }) {
        return () => (
            <button
                type="button"
                class="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target={props.targetId}
            >
                {props.title}
            </button>
        )
    }
})
</script>
<!-- 
<script lang="ts" setup>
defineProps({
    id: String,
    title: String,
}) 
</script>

<template>
    <div class="modal fade" :id="id" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">{{ title }}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <slot></slot>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
            </div>
        </div>
    </div>
</template>
 -->
