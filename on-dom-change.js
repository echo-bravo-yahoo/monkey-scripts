// Written by Nathaniel Hutchins (https://github.com/MynockSpit), used with permission and gratitude.

// To use this, add the following line to your script:
// @require      https://raw.githubusercontent.com/echo-bravo-yahoo/monkey-scripts/main/on-dom-change.js

/**
 * Register a mutation observer that runs (by default) on node additions and removals.
 *
 * @param {Function} fn   The thing you want to do when the dom changes.
 * @param {Number} [throttle]   The minimum amount of time between calls to your observer. Lower numbers are more resource intensive, but more responsive. Higher numbers are more efficient, but may produce noticeable "jumps". 500 is probably good.
 * @param {MutationObserverInit} [observeConfig]   Configure your observer. (https://developer.mozilla.org/en-US/docs/Web/API/MutationObserverInit)
 */
async function onDomChange(fn, delay = 500, observeConfig = { childList: true, subtree: true }) {
  function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms))}

  // A pretty standard throttle except in one respect -- it collects all mutations
  // for each intermediate call and sends them all to the function when the time comes.
  function throttle(fn, ms) {
    let lastFired = 0
    let nextFireTimer = null
    let mutationList = [] // an array of ...args (e.g. [argsFromCall1, argsFromCall2])

    function makeTimer(ms) {
      return setTimeout(() => {
        fn(mutationList)

        // clear this timeout
        mutationList = [] // clear the args again
        lastFired = performance.now()
        clearTimeout()
        nextFireTimer = null
      }, ms)
    }

    return (thisMutationList) => {
      let timeSince = performance.now() - lastFired
      mutationList = mutationList.concat(thisMutationList)

      if (timeSince > ms & !nextFireTimer) {
        // if it's been longer than the delay, fire w/ 0 delay
        nextFireTimer = makeTimer(0)
      } else if (timeSince < ms && !nextFireTimer) {
        // if it's been sooner than the delay, queue a fire when it should come up
        let timeUntilNextFire = ms - timeSince
        nextFireTimer = makeTimer(timeUntilNextFire)
      }
    }
  }

  // a simple (for now) function that makes sure stuff actually changed
  function ignoreUnchanged(fn) {
    let previousHtml = document.body.innerHTML
    return mutations => {
      if (previousHtml !== document.body.innerHTML) {
        previousHtml = document.body.innerHTML
        // console.debug('fn', fn.name)
        // let start = performance.now()
        let result = fn(mutations)
        // let end = performance.now()
        // console.debug(`fn ${fn.name || '?'} took ${end - start} ms`)
        return result
      }
    }
  }

  // wait for both document and document.body to be available
  while (!(document && document.body && document.body.innerHTML)) {
    await wait(50)
  }

  ;(new MutationObserver(throttle(ignoreUnchanged(fn), delay)))
    .observe(document.body, observeConfig)
}
