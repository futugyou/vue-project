import { createMachine, createActor, assign } from 'xstate'
import { shallowRef } from 'vue'
import { useMachine as rawUseMachine } from '@xstate/vue'

// @ts-ignore
export const useMachine = (options) => {
    options.predictableActionArguments = true
    const machine = createMachine(options)
    const state = shallowRef(machine.states)
    const service = createActor(machine)
    service.subscribe((newState: any) => (state.value = newState))
    service.start()

    const send = (event: CountEvent) => service.send(event)

    return { state, send }
}
type CountEvent = { type: 'TOGGLE' }

// 状态机的上下文（扩展状态）
interface CountContext {
    count: number
}

export const useMachine2 = () => {
    const toggleMachine = createMachine({
        id: 'toggle',
        initial: 'inactive',
        context: {
            count: 0
        },
        states: {
            inactive: {
                on: { TOGGLE: 'active' }
            },
            active: {
                entry: assign({ count: (ctx: any) => ctx.count + 1 }),
                on: { TOGGLE: 'inactive' }
            }
        },
    })
    const { snapshot, send } = rawUseMachine(toggleMachine)

    return { state: snapshot, send }
}
