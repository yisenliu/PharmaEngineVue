// indications development stage
let stages
let indicationsCurrentStages
let stagesPos = []
let singleStageWidth = 0
const getStageWidth = () => {
  return stagesPos[1] - stagesPos[0]
}
export const deployStages = () => {
  const indicationLeft = app.domRect('.IDS__indication').offsetLeft
  stages.forEach((el, index) => {
    const offsetLeft = app.domRect(el).left
    stagesPos[index] = offsetLeft
  })
  singleStageWidth = getStageWidth()
  indicationsCurrentStages.forEach(el => {
    const phase = {
      from: parseInt(el.dataset.stages.split('-')[0]),
      end: el.dataset.stages.split('-')[1]
        ? parseInt(el.dataset.stages.split('-')[1])
        : parseInt(el.dataset.stages.split('-')[0])
    }
    const offsetLeft = stagesPos[phase.from]
    const phaseWidth = (phase.end - phase.from + 1) * singleStageWidth

    el.closest('.IDS__indication').style.cssText = ` --progressBar-width: ${
      offsetLeft - indicationLeft + phaseWidth + 1
    }px`
    el.style.cssText = `--offsetLeft: ${offsetLeft - indicationLeft}px; width:${
      phaseWidth + 1
    }px`
  })
}

// indications current stages waypoints
export const deployIndicationsCurrentStages = () => {
  const indications = document.querySelectorAll('.IDS__indication')
  indications.forEach(el => {
    new Waypoint.Inview({
      element: el,
      group: 'indications',
      enter() {
        el.addClass('active')
      }
    })
  })
}

// init()
export const initStages = () => {
  stages = document.querySelectorAll('.IDS__stages li')
  indicationsCurrentStages = document.querySelectorAll(
    '.IDS__indication__currentStage'
  )
}

// deployStages()
app.addToWindowOnResize(deployStages)
