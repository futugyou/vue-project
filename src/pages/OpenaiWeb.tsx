/** @jsxRuntime classic */
/** @jsx jsxCustomEvent */
import jsxCustomEvent from '@micro-zoe/micro-app/polyfill/jsx-custom-event'
import { useState } from 'react'

const OpenaiWeb = () => {
  const [microAppData, changeMicroAppData] = useState({ msg: '来自基座的数据' })

  function handleCreate() {
    console.log('openai-web 创建了')
  }

  function handleBeforeMount() {
    console.log('openai-web 即将被渲染')
  }

  function handleMount() {
    console.log('openai-web 已经渲染完成')

    setTimeout(() => {
      changeMicroAppData({ msg: '来自基座的新数据' })
    }, 2000)
  }

  function handleUnmount() {
    console.log('openai-web 卸载了')
  }

  function handleError() {
    console.log('openai-web 加载出错了')
  }

  function handleDataChange(e: CustomEvent) {
    console.log('来自子应用 openai-web 的数据:', e.detail.data)
  }

  return (
    <micro-app
      name='openai-web'
      url={`${import.meta.env.REACT_APP_OPENAI_SERVER}`}
      baseroute='/openai'
      data={microAppData}
      onCreated={handleCreate}
      onBeforemount={handleBeforeMount}
      onMounted={handleMount}
      onUnmount={handleUnmount}
      onError={handleError}
      onDataChange={handleDataChange}
    ></micro-app>
  )
}

export default OpenaiWeb