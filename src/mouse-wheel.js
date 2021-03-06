import { select, event } from 'd3-selection'

const wheelDeltaMode = { pixel: 0, line: 1, page: 2 }
const wheelEventType = discoverWheelEventType()

export function createMouseWheel () {
  function mouseWheel (s) {
    s.each(mouseWheelEach)
  }

  return mouseWheel

  function mouseWheelEach (d, i) {
    const target = select(this).select('.zambezi-grid-body')
              .on(wheelEventType, onWheel)

    function onWheel () {
      const freeRows = d.rows.free
      const actualHeight = freeRows.actualHeight
      const measuredHeight = freeRows.measuredHeight
      const minScroll = 0
      const maxScroll = measuredHeight - actualHeight
      const scroll = Math.max(minScroll, Math.min(d.scroll.top - wheelDelta(), maxScroll))
      const isInternalGridScroll = scroll > minScroll && scroll < maxScroll
      const scrollEvent = { top: scroll, left: d.scroll.left }

      if (isInternalGridScroll) event.preventDefault()

      target.dispatch('grid-scroll', { bubbles: true, detail: scrollEvent })
          .dispatch('redraw', { bubbles: true })

      function wheelDelta () {
        return (
          event.deltaY *
          (event.deltaMode === wheelDeltaMode.line ? -40 : -1) ||
          event.wheelDeltaY ||
          event.wheelDelta ||
          0
        )
      }
    }
  }
}

function discoverWheelEventType () {
  return (
    'onwheel' in document.createElement('div') ? 'wheel'  // Modern browsers
  : document.onmousewheel !== undefined ? 'mousewheel'    // Webkit and IE
  : 'DOMMouseScroll'                                      // default (old Firefox)
  )
}
