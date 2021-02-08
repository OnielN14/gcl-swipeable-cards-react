import React from 'react';
import style from './App.module.css';

function getPointerX(evt: TouchEvent | MouseEvent): number {
  return (evt as MouseEvent).pageX || (evt as TouchEvent).touches[0].pageX
}

function App() {
  const [ people, setPeople ] = React.useState([
    'Jamal', 'Komar', 'Badrun', 'Kurniadi', 'Yahya', 'Tatang'
  ])

  const swipeTarget = React.useRef<HTMLElement>()
  const swipeTargetBCR = React.useRef<DOMRect>()
  const startX = React.useRef<number>(0)
  const currentX = React.useRef<number>(0)
  const targetX = React.useRef<number>(0)
  const screenX = React.useRef<number>(0)
  const isDragging = React.useRef(false)

  function onStart (evt: TouchEvent | MouseEvent) {
    if (!(evt.target as HTMLElement).classList.contains(style.Card)) return;

    isDragging.current = true
    swipeTarget.current = evt.target as HTMLElement
    swipeTargetBCR.current = swipeTarget.current.getBoundingClientRect()
    startX.current = getPointerX(evt)
    currentX.current = startX.current

    swipeTarget.current!.style.willChange = 'transform'
  }

  function onMove (evt: TouchEvent | MouseEvent) {
    if (!swipeTarget.current) return

    currentX.current = getPointerX(evt)
  }

  function onEnd (evt: TouchEvent | MouseEvent) {
    if (!swipeTarget.current) return

    targetX.current = 0
    if (Math.abs(screenX.current) > swipeTargetBCR.current!.width * 0.35) {
      targetX.current = screenX.current > 0 ? swipeTargetBCR.current!.width : -swipeTargetBCR.current!.width 
    }

    swipeTarget.current!.style.willChange = ''
    isDragging.current = false
  }
  
  function animationUpdate () {
    requestAnimationFrame(animationUpdate)

    if (!swipeTarget.current) return

    if (isDragging.current) {
      screenX.current = currentX.current - startX.current
    } else {
      screenX.current += (targetX.current - screenX.current) / 10
    }


    swipeTarget.current!.style.transform = `translateX(${screenX.current}px)`
  }

  React.useEffect(() => {

    document.addEventListener('touchstart', onStart)
    document.addEventListener('touchmove', onMove)
    document.addEventListener('touchend', onEnd)

    requestAnimationFrame(animationUpdate)

    return function cleanUp () {
      document.removeEventListener('touchstart', onStart)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onEnd)
    }
  },[ people ])

  return (
    <div className={style.Container}>
      {
        people.map((name, index) => (<div key={index} className={style.Card}>{name}</div>))
      }
    </div>
  );
}

export default App;
