import { useRef, useCallback, useEffect } from 'react'
import debounce from 'lodash.debounce'

export function useLazyEffect(effect, deps = [], wait = 300) {
  const cleanUp = useRef()
  const effectRef = useRef()
  const updatedEffect = useCallback(effect, deps)
  effectRef.current = updatedEffect
  const lazyEffect = useCallback(
    debounce(() => {
      cleanUp.current = effectRef.current?.();
    }, wait),
    [],
  )
  useEffect(lazyEffect, deps)
  useEffect(() => {
    return () => {
      if (cleanUp.current instanceof Function) cleanUp.current()
    }
  }, [])
}