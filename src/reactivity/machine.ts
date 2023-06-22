import { createMachine, interpret } from 'xstate'
import { shallowRef } from 'vue'

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