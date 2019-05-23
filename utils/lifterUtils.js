import liftNames from '~/utils/liftNameConstants'

export function lifterTopSquat(lifter) {
  if (lifter === null) return null

  var topLift = null
  if (lifter.lifts.squat3.goodlift == 'yes') {
    topLift = lifter.lifts.squat3.weight
  } else if (lifter.lifts.squat2.goodlift == 'yes') {
    topLift = lifter.lifts.squat2.weight
  } else if (lifter.lifts.squat1.goodlift == 'yes') {
    topLift = lifter.lifts.squat1.weight
  }

  return topLift
}

export function lifterTopBench(lifter) {
  if (lifter === null) return null

  var topLift = null
  if (lifter.lifts.bench3.goodlift == 'yes') {
    topLift = lifter.lifts.bench3.weight
  } else if (lifter.lifts.bench2.goodlift == 'yes') {
    topLift = lifter.lifts.bench2.weight
  } else if (lifter.lifts.bench1.goodlift == 'yes') {
    topLift = lifter.lifts.bench1.weight
  }

  return topLift
}

export function lifterTopDeadlift(lifter) {
  if (lifter === null) return null

  var topLift = null
  if (lifter.lifts.deadlift3.goodlift == 'yes') {
    topLift = lifter.lifts.deadlift3.weight
  } else if (lifter.lifts.deadlift2.goodlift == 'yes') {
    topLift = lifter.lifts.deadlift2.weight
  } else if (lifter.lifts.deadlift1.goodlift == 'yes') {
    topLift = lifter.lifts.deadlift1.weight
  }

  return topLift
}

export function lifterSubTotal(lifter) {
  if (lifter === null) return null

  var topSquat = lifterTopSquat(lifter)
  var topBench = lifterTopBench(lifter)

  if (topSquat !== null && topBench !== null) {
    return topSquat + topBench
  }

  return null
}

export function lifterTotal(lifter) {
  if (lifter === null) return null

  var subTotal = lifterSubTotal(lifter)
  var topDeadlift = lifterTopDeadlift(lifter)

  if (subTotal !== null && topDeadlift !== null) {
    return subTotal + topDeadlift
  }

  return null
}

export function lifterWilks(lifter) {
  if (lifter === null || lifter.bodyWeight === 0) {
    return null
  }

  var topSquat = this.lifterTopSquat(lifter)
  var topBench = this.lifterTopBench(lifter)
  var topDeadlift = this.lifterTopDeadlift(lifter)

  if (topSquat === null || topBench === null || topDeadlift === null) {
    return 0
  }

  var a = -216.0475144
  var b = 16.2606339
  var c = -0.002388645
  var d = -0.00113732
  var e = 0.00000701863
  var f = -0.00000001291
  if (lifter.genderMale === false) {
    a = 594.31747775582
    b = -27.23842536447
    c = 0.82112226871
    d = -0.00930733913
    e = 0.00004731582
    f = -0.00000009054
  }

  var coeff =
    500 /
    (a +
      b * lifter.bodyWeight +
      c * Math.pow(lifter.bodyWeight, 2) +
      d * Math.pow(lifter.bodyWeight, 3) +
      e * Math.pow(lifter.bodyWeight, 4) +
      f * Math.pow(lifter.bodyWeight, 5))

  var total = topSquat + topBench + topDeadlift
  var wilks = (coeff * total).toFixed(2)

  return wilks
}

export function sortLiftersByFlight(allLifters, currentFlight, currentLift) {
  let lifters = allLifters
    .filter(x => x.flight == currentFlight)
    .sort((a, b) => {
      if (a === b) return 0
      let weightA
      let weightB
      switch (currentLift) {
        case liftNames.Squat1:
          weightA = a.lifts.squat1
          weightB = b.lifts.squat1
          break
        case liftNames.Squat2:
          weightA = a.lifts.squat2
          weightB = b.lifts.squat2
          break
        case liftNames.Squat3:
          weightA = a.lifts.squat3
          weightB = b.lifts.squat3
          break
        case liftNames.Bench1:
          weightA = a.lifts.bench1
          weightB = b.lifts.bench1
          break
        case liftNames.Bench2:
          weightA = a.lifts.bench2
          weightB = b.lifts.bench2
          break
        case liftNames.Bench3:
          weightA = a.lifts.bench3
          weightB = b.lifts.bench3
          break
        case liftNames.Deadlift1:
          weightA = a.lifts.deadlift1
          weightB = b.lifts.deadlift1
          break
        case liftNames.Deadlift2:
          weightA = a.lifts.deadlift2
          weightB = b.lifts.deadlift2
          break
        case liftNames.Deadlift3:
          weightA = a.lifts.deadlift3
          weightB = b.lifts.deadlift3
          break
        default:
          break
      }

      if (!weightA && !weightB) {
        return 0
      } else if (!weightA) {
        return 1
      } else if (!weightB) {
        return -1
      }
      return weightA.weight < weightB.weight ? -1 : 1
    })

  console.log('fixing lifters')
  lifters.forEach(lifter => {
    if (!lifter.lifts.squat2) {
      lifter.lifts.squat2 = {
        weight: 0,
        goodlift: null
      }
    }
    if (!lifter.lifts.squat3) {
      lifter.lifts.squat3 = {
        weight: 0,
        goodlift: null
      }
    }
    if (!lifter.lifts.bench2) {
      lifter.lifts.bench2 = {
        weight: 0,
        goodlift: null
      }
    }
    if (!lifter.lifts.bench3) {
      lifter.lifts.bench3 = {
        weight: 0,
        goodlift: null
      }
    }
    if (!lifter.lifts.deadlift2) {
      lifter.lifts.deadlift2 = {
        weight: 0,
        goodlift: null
      }
    }
    if (!lifter.lifts.deadlift2) {
      lifter.lifts.deadlift2 = {
        weight: 0,
        goodlift: null
      }
    }
  })

  return lifters
}
