import { createMachine, interpret, assign } from 'xstate'
import { shallowRef } from 'vue'
import { useMachine as rawUseMachine } from '@xstate/vue'

// @ts-ignore
export const useMachine = (options) => {
  options.predictableActionArguments = true
  const machine = createMachine<CountContext, CountEvent>(options)
  const state = shallowRef(machine.initialState)
  const service = interpret(machine)
    .onTransition((newState) => (state.value = newState))
    .start()

  const send = (event: CountEvent) => service.send(event)

  return { state, send }
}
type CountEvent = { type: 'TOGGLE' }

// 状态机的上下文（扩展状态）
interface CountContext {
  count: number
}

export const useMachine2 = () => {
  const toggleMachine = createMachine<CountContext, CountEvent>({
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
        entry: assign({ count: (ctx) => ctx.count + 1 }),
        on: { TOGGLE: 'inactive' }
      }
    },
    predictableActionArguments: true
  })

  const { state, send } = rawUseMachine(toggleMachine)

  return { state, send }
}
