<script lang="tsx">
import { defineComponent, ref } from 'vue'
import { Modal as Modalraw } from 'bootstrap'

// vue need default
export default () => <div></div>

export const Modal = defineComponent({
    name: 'Modal',
    props: {
        id: String,
        title: String,
        size: String,
        hideFooter: Boolean
    },
    setup(props, { emit, slots }) {
        const saveClick = () => {
            emit('saveChange')
            closeModal()
        }

        let size = ''
        switch (props.size) {
            case 'xl':
                size = 'modal-xl'
                break;
            case 'lg':
                size = 'modal-lg'
                break;
            case 'sm':
                size = 'modal-sm'
                break;
            default:
                break;
        }

        return () => (
            <div
                class="modal fade"
                id={props.id}
                tabindex="-1"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
            >
                <div class={"modal-dialog " + size}>
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
                        {props.hideFooter ? (
                            <div></div>
                        ) : (
                            <div class="modal-footer">
                                <button
                                    type="button"
                                    class="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Close
                                </button>
                                <button type="button" class="btn btn-primary" onClick={saveClick}>
                                    Save changes
                                </button>
                            </div>
                        )}
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

export const closeModal = () => {
    const alreadyOpen = Element.prototype.querySelector.call(
        document.documentElement,
        '.modal.show'
    )
    if (alreadyOpen) {
        Modalraw.getInstance(alreadyOpen)?.hide()
    }
}

export const openModal = (id: string) => {
    const myModal = new Modalraw('#' + id, {
        keyboard: false
    })
    const modalToggle = document.getElementById(id)
    if (modalToggle) {
        myModal.show(modalToggle)
    }
}
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
