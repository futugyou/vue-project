import { createMachine, interpret, assign } from 'xstate'
import { shallowRef } from 'vue'
import { useMachine as rawUseMachine } from "@xstate/vue"

export const useMachine = (options: any) => {
    options.predictableActionArguments = true
    const machine = createMachine(options)
    const state = shallowRef(machine.initialState)
    const service = interpret(machine)
        .onTransition((newState) => (state.value = newState))
        .start()
    const send = (event: any) => service.send(event)

    return [state, send]
}

export const useMachine2 = () => {
    const toggleMachine = createMachine({
        id: "toggle",
        initial: "inactive",
        context: {
            count: 0,
        },
        states: {
            inactive: {
                on: { TOGGLE: "active" },
            },
            active: {
                entry: assign({ count: (ctx) => ctx.count + 1 }),
                on: { TOGGLE: "inactive" },
            },
        },
        predictableActionArguments: true,
    }) 

    const { state, send } = rawUseMachine(toggleMachine);

    return [state, send]
}