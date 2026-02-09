import React, { useState, useEffect, useCallback, useRef } from 'react'

// ============================================================
// SPIRIT MATH — A Spirited Away Math Adventure for Neeks
// ============================================================

// ---- Image assets ----
const NEEKS_IMAGES = [
  '/neeks-sunglasses.jpg',
  '/neeks-pasta.jpg',
  '/neeks-mall.jpg',
  '/neeks-astronaut.jpg',
]

const SPIRITED_IMAGES = {
  chihiroHappy: '/chihiro-happy.jpg',
  chihiroPoster: '/chihiro-poster.jpg',
  chihiroTrain: '/chihiro-noface-train.webp',
  chihiroOcean: '/chihiro-noface-ocean.jpg',
  chihiroLanterns: '/chihiro-lanterns-dark.jpg',
  chihiroWindow: '/chihiro-window.jpg',
  chihiroStairs: '/chihiro-running-stairs.jpg',
  chihiroRidingHaku: '/chihiro-riding-haku.jpg',
  hakuSunset: '/haku-bridge-sunset.jpg',
  hakuDragonArt: '/haku-dragon-art.jpg',
  nofaceOffering: '/noface-offering.jpg',
  nofaceRain: '/noface-rain.jpg',
  nofaceSootPin: '/noface-soot-haku-pin.jpg',
  yubaba: '/yubaba-closeup.jpg',
  yubabaYelling: '/yubaba-yelling.jpg',
  kamaji: '/kamaji-boilerman.jpg',
  bathhouse: '/bathhouse-roof.jpg',
}

// ---- Math question generation ----
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateMultiplicationProblem(grade, difficulty) {
  let a, b
  if (grade === '5th') {
    if (difficulty === 'easy') {
      a = randInt(2, 9); b = randInt(2, 9)
    } else if (difficulty === 'medium') {
      a = randInt(11, 25); b = randInt(2, 9)
    } else {
      a = randInt(12, 35); b = randInt(11, 25)
    }
  } else {
    if (difficulty === 'easy') {
      a = randInt(20, 60); b = randInt(3, 9)
    } else if (difficulty === 'medium') {
      a = randInt(15, 50); b = randInt(11, 30)
    } else {
      const useTriple = Math.random() > 0.5
      if (useTriple) {
        a = randInt(100, 300); b = randInt(3, 9)
      } else {
        a = randInt(30, 80); b = randInt(20, 50)
      }
    }
  }
  const answer = a * b
  const question = `${a} × ${b}`
  const explanation = generateMultExplanation(a, b, answer)
  const choices = generateMultChoices(a, b, answer)
  return { question, correctAnswer: answer, choices, explanation, type: 'multiplication', a, b }
}

function generateMultExplanation(a, b, answer) {
  if (a <= 12 && b <= 12) {
    return `${a} × ${b} = ${answer}. That's ${a} groups of ${b}!`
  }
  if (a <= 12 || b <= 12) {
    const big = Math.max(a, b)
    const small = Math.min(a, b)
    const tens = Math.floor(big / 10) * 10
    const ones = big % 10
    if (ones === 0) {
      return `${a} × ${b} = ${answer}. Think: ${small} × ${tens} = ${small * tens}.`
    }
    return `${a} × ${b} = ${answer}. Break it down: ${small} × ${tens} = ${small * tens}, plus ${small} × ${ones} = ${small * ones}. So ${small * tens} + ${small * ones} = ${answer}.`
  }
  const tens1 = Math.floor(a / 10) * 10
  const ones1 = a % 10
  return `${a} × ${b} = ${answer}. Break ${a} into ${tens1} + ${ones1}: (${tens1} × ${b}) + (${ones1} × ${b}) = ${tens1 * b} + ${ones1 * b} = ${answer}.`
}

function generateMultChoices(a, b, answer) {
  const wrong = new Set()
  // Common mistakes
  wrong.add(answer + b)
  wrong.add(answer - b)
  wrong.add(answer + a)
  wrong.add(answer - a)
  wrong.add(a * (b + 1))
  wrong.add(a * (b - 1))
  wrong.add((a + 1) * b)
  wrong.add((a - 1) * b)
  // Digit swap mistakes
  if (answer >= 100) {
    const s = String(answer)
    wrong.add(parseInt(s[0] + s[2] + s[1]))
  }
  // Near misses
  wrong.add(answer + randInt(1, 5))
  wrong.add(answer - randInt(1, 5))
  wrong.add(answer + 10)
  wrong.add(answer - 10)

  // Filter out invalid
  const validWrong = [...wrong].filter(w => w > 0 && w !== answer && w !== 0)
  const selected = shuffle(validWrong).slice(0, 3)
  while (selected.length < 3) {
    const w = answer + randInt(-20, 20)
    if (w > 0 && w !== answer && !selected.includes(w)) selected.push(w)
  }
  return shuffle([answer, ...selected])
}

function generateDivisionProblem(grade, difficulty) {
  let dividend, divisor, answer, displayAnswer, isDecimal = false, remainder = 0

  if (grade === '5th') {
    if (difficulty === 'easy') {
      divisor = randInt(2, 9)
      answer = randInt(2, 12)
      dividend = divisor * answer
      displayAnswer = answer
    } else if (difficulty === 'medium') {
      divisor = randInt(3, 15)
      answer = randInt(8, 25)
      dividend = divisor * answer
      displayAnswer = answer
    } else {
      divisor = randInt(3, 9)
      const quotient = randInt(8, 20)
      remainder = randInt(1, divisor - 1)
      dividend = divisor * quotient + remainder
      displayAnswer = `${quotient}R${remainder}`
      answer = displayAnswer
    }
  } else {
    if (difficulty === 'easy') {
      divisor = randInt(10, 18)
      const quotient = randInt(10, 25)
      dividend = divisor * quotient
      answer = quotient
      displayAnswer = quotient
    } else if (difficulty === 'medium') {
      divisor = randInt(4, 12)
      const quotient = randInt(15, 30)
      remainder = randInt(1, divisor - 1)
      dividend = divisor * quotient + remainder
      const decimal = Math.round((dividend / divisor) * 1000) / 1000
      answer = decimal
      displayAnswer = decimal
      isDecimal = true
    } else {
      divisor = randInt(4, 16)
      const quotient = randInt(10, 30)
      remainder = randInt(1, divisor - 1)
      dividend = divisor * quotient + remainder
      const decimal = Math.round((dividend / divisor) * 100) / 100
      answer = decimal
      displayAnswer = decimal
      isDecimal = true
    }
  }

  const question = `${dividend} ÷ ${divisor}`
  const explanation = generateDivExplanation(dividend, divisor, displayAnswer, isDecimal, remainder)
  const choices = generateDivChoices(displayAnswer, divisor, isDecimal, dividend)
  return { question, correctAnswer: displayAnswer, choices, explanation, type: 'division', dividend, divisor }
}

function generateDivExplanation(dividend, divisor, answer, isDecimal, remainder) {
  if (!isDecimal && remainder === 0) {
    return `${dividend} ÷ ${divisor} = ${answer}. Because ${divisor} × ${answer} = ${dividend}.`
  }
  if (typeof answer === 'string' && answer.includes('R')) {
    const [q, r] = answer.split('R').map(Number)
    return `${dividend} ÷ ${divisor} = ${q} remainder ${r}. Because ${divisor} × ${q} = ${divisor * q}, and ${dividend} - ${divisor * q} = ${r}.`
  }
  if (isDecimal) {
    const whole = Math.floor(dividend / divisor)
    const rem = dividend - whole * divisor
    return `${dividend} ÷ ${divisor} = ${answer}. The whole part is ${whole} (since ${divisor} × ${whole} = ${divisor * whole}), with ${rem} left over. ${rem}/${divisor} = ${Math.round((rem / divisor) * 1000) / 1000}.`
  }
  return `${dividend} ÷ ${divisor} = ${answer}.`
}

function generateDivChoices(answer, divisor, isDecimal, dividend) {
  const wrong = new Set()

  if (typeof answer === 'string' && answer.includes('R')) {
    const [q, r] = answer.split('R').map(Number)
    wrong.add(`${q + 1}R${r}`)
    wrong.add(`${q - 1}R${r}`)
    wrong.add(`${q}R${r + 1 > divisor - 1 ? r - 1 : r + 1}`)
    wrong.add(`${q + 1}R${Math.max(0, r - 1)}`)
    wrong.add(`${q - 1}R${Math.min(divisor - 1, r + 1)}`)
    wrong.add(`${q + 2}R${r}`)
    const validWrong = [...wrong].filter(w => {
      const [wq, wr] = w.split('R').map(Number)
      return wq > 0 && wr >= 0 && wr < divisor && w !== answer
    })
    const selected = shuffle(validWrong).slice(0, 3)
    while (selected.length < 3) {
      const wq = q + randInt(-3, 3)
      const wr = randInt(0, divisor - 1)
      const w = `${wq}R${wr}`
      if (wq > 0 && w !== answer && !selected.includes(w)) selected.push(w)
    }
    return shuffle([answer, ...selected])
  }

  if (isDecimal) {
    const numAns = Number(answer)
    wrong.add(Math.round((numAns + 1) * 100) / 100)
    wrong.add(Math.round((numAns - 1) * 100) / 100)
    wrong.add(Math.round((numAns + 0.5) * 100) / 100)
    wrong.add(Math.round((numAns - 0.5) * 100) / 100)
    wrong.add(Math.floor(numAns))
    wrong.add(Math.ceil(numAns))
    wrong.add(Math.round((numAns + 0.125) * 1000) / 1000)
    wrong.add(Math.round((dividend / (divisor + 1)) * 100) / 100)
    wrong.add(Math.round((dividend / (divisor - 1)) * 100) / 100)
    const validWrong = [...wrong].filter(w => w > 0 && w !== numAns)
    const selected = shuffle(validWrong).slice(0, 3)
    while (selected.length < 3) {
      const w = Math.round((numAns + (Math.random() * 4 - 2)) * 100) / 100
      if (w > 0 && w !== numAns && !selected.includes(w)) selected.push(w)
    }
    return shuffle([answer, ...selected])
  }

  const numAns = Number(answer)
  wrong.add(numAns + 1)
  wrong.add(numAns - 1)
  wrong.add(numAns + 2)
  wrong.add(numAns - 2)
  wrong.add(Math.round(dividend / (divisor + 1)))
  wrong.add(Math.round(dividend / (divisor - 1)))
  wrong.add(numAns + divisor)
  const validWrong = [...wrong].filter(w => w > 0 && w !== numAns)
  const selected = shuffle(validWrong).slice(0, 3)
  while (selected.length < 3) {
    const w = numAns + randInt(-5, 5)
    if (w > 0 && w !== numAns && !selected.includes(w)) selected.push(w)
  }
  return shuffle([answer, ...selected])
}

function generateQuestion(mode, grade, difficulty) {
  if (mode === 'mixed') {
    return Math.random() > 0.5
      ? generateMultiplicationProblem(grade, difficulty)
      : generateDivisionProblem(grade, difficulty)
  }
  if (mode === 'multiplication') return generateMultiplicationProblem(grade, difficulty)
  return generateDivisionProblem(grade, difficulty)
}

// ---- Soot Sprite Component ----
function SootSprite({ x, y, size = 24, mood = 'neutral', delay = 0 }) {
  const moodClass = mood === 'happy' ? 'soot-happy' : mood === 'sad' ? 'soot-sad' : ''
  return (
    <div
      className={`soot-sprite ${moodClass}`}
      style={{
        left: x, bottom: y, width: size, height: size,
        animationDelay: `${delay}s`,
      }}
    >
      <div className="soot-eyes">
        <div className="soot-eye" />
        <div className="soot-eye" />
      </div>
    </div>
  )
}

// ---- Konpeito (star candy) burst ----
function KonpeitoBurst({ active }) {
  if (!active) return null
  const colors = ['#ff6b9d', '#c44dff', '#4dc9f6', '#f7e84e', '#ff9f43', '#2ecc71']
  return (
    <div className="konpeito-burst">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="konpeito-star"
          style={{
            '--angle': `${i * 30}deg`,
            '--distance': `${60 + Math.random() * 40}px`,
            '--color': colors[i % colors.length],
            animationDelay: `${Math.random() * 0.2}s`,
          }}
        />
      ))}
    </div>
  )
}

// ---- Coin animation ----
function FlyingCoin({ active }) {
  if (!active) return null
  return <div className="flying-coin">🪙</div>
}

// ---- Water waves ----
function WaterWaves() {
  return (
    <div className="water-container">
      <div className="wave wave-1" />
      <div className="wave wave-2" />
      <div className="wave wave-3" />
    </div>
  )
}

// ---- Floating lanterns ----
function FloatingLanterns({ count = 6 }) {
  return (
    <div className="lanterns-container">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="lantern"
          style={{
            left: `${10 + (i * 80 / count)}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          🏮
        </div>
      ))}
    </div>
  )
}

// ---- Train component ----
function Train({ progress }) {
  // progress: 0 to 1 (0 = far away, 1 = arrived)
  const translateX = 120 - (progress * 130) // starts off-screen right, ends left
  return (
    <div className="train-track">
      <div
        className="train"
        style={{ transform: `translateX(${translateX}%)` }}
      >
        🚂
      </div>
    </div>
  )
}

// ---- No-Face creep ----
function NoFaceCreep({ urgency }) {
  // urgency: 0 (calm) to 1 (very close)
  const opacity = 0.1 + urgency * 0.7
  const scale = 0.3 + urgency * 0.7
  return (
    <div
      className="noface-creep"
      style={{
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <img src="/noface-rain.jpg" alt="" className="noface-creep-img" />
    </div>
  )
}

// ---- Neeks Avatar ----
function NeeksAvatar({ size = 60, imageIndex = 0, className = '' }) {
  return (
    <div className={`neeks-avatar ${className}`} style={{ width: size, height: size }}>
      <img
        src={NEEKS_IMAGES[imageIndex % NEEKS_IMAGES.length]}
        alt="Neeks"
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
      />
    </div>
  )
}

// ---- Streak indicator ----
function StreakFire({ streak }) {
  if (streak < 3) return null
  return (
    <div className="streak-indicator">
      <span className="streak-fire">🔥</span>
      <span className="streak-count">{streak} streak!</span>
    </div>
  )
}

// ============================================================
// MAIN APP COMPONENT
// ============================================================
export default function App() {
  // ---- Game state ----
  const [screen, setScreen] = useState('start')
  const [mode, setMode] = useState('multiplication')
  const [grade, setGrade] = useState('5th')
  const [difficulty, setDifficulty] = useState('easy')
  const [coins, setCoins] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(1200)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [lastAnswer, setLastAnswer] = useState(null)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [questionsCorrect, setQuestionsCorrect] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [showCoinAnim, setShowCoinAnim] = useState(false)
  const [showKonpeito, setShowKonpeito] = useState(false)
  const [sootMood, setSootMood] = useState('neutral')
  const [neeksImageIdx, setNeeksImageIdx] = useState(0)
  const [shakeFeedback, setShakeFeedback] = useState(false)
  const [hakuFlying, setHakuFlying] = useState(false)
  const [heroImage, setHeroImage] = useState(0)
  const timerRef = useRef(null)

  const HERO_IMAGES = [
    '/chihiro-happy.jpg',
    '/chihiro-poster.jpg',
    '/chihiro-riding-haku.jpg',
    '/haku-bridge-sunset.jpg',
    '/haku-dragon-art.jpg',
    '/chihiro-running-stairs.jpg',
    '/chihiro-window.jpg',
    '/bathhouse-roof.jpg',
    '/kamaji-boilerman.jpg',
    '/noface-soot-haku-pin.jpg',
    '/chihiro-noface-ocean.jpg',
    '/chihiro-lanterns-dark.jpg',
    '/noface-offering.jpg',
    '/yubaba-chihiro.jpg',
    '/noface-zeniba-table.jpg',
  ]

  const TARGET_COINS = 15
  const TOTAL_TIME = 1200 // 20 minutes

  // ---- Timer ----
  useEffect(() => {
    if (screen === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            setScreen('gameover')
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timerRef.current)
    }
  }, [screen])

  // ---- Check win condition ----
  useEffect(() => {
    if (coins >= TARGET_COINS && screen === 'playing') {
      clearInterval(timerRef.current)
      setHakuFlying(true)
      setTimeout(() => setScreen('victory'), 500)
    }
  }, [coins, screen])

  // ---- Format time ----
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // ---- Start game ----
  function startGame() {
    setCoins(0)
    setTimeRemaining(TOTAL_TIME)
    setQuestionsAnswered(0)
    setQuestionsCorrect(0)
    setStreak(0)
    setBestStreak(0)
    setLastAnswer(null)
    setHakuFlying(false)
    setSootMood('neutral')
    setNeeksImageIdx(randInt(0, NEEKS_IMAGES.length - 1))
    setHeroImage(randInt(0, HERO_IMAGES.length - 1))
    const q = generateQuestion(mode, grade, difficulty)
    setCurrentQuestion(q)
    setScreen('playing')
  }

  // ---- Answer a question ----
  function handleAnswer(selected) {
    const isCorrect = String(selected) === String(currentQuestion.correctAnswer)
    setQuestionsAnswered(prev => prev + 1)

    if (isCorrect) {
      setCoins(prev => prev + 1)
      setQuestionsCorrect(prev => prev + 1)
      setStreak(prev => {
        const newStreak = prev + 1
        if (newStreak > bestStreak) setBestStreak(newStreak)
        return newStreak
      })
      setShowCoinAnim(true)
      setShowKonpeito(true)
      setSootMood('happy')
      setTimeout(() => {
        setShowCoinAnim(false)
        setShowKonpeito(false)
      }, 1000)
    } else {
      setStreak(0)
      setSootMood('sad')
      setShakeFeedback(true)
      setTimeout(() => setShakeFeedback(false), 500)
    }

    setLastAnswer({
      wasCorrect: isCorrect,
      selectedAnswer: selected,
      correctAnswer: currentQuestion.correctAnswer,
      explanation: currentQuestion.explanation,
      question: currentQuestion.question,
    })
    setScreen('feedback')
  }

  // ---- Next question ----
  function nextQuestion() {
    setSootMood('neutral')
    setNeeksImageIdx(randInt(0, NEEKS_IMAGES.length - 1))
    setHeroImage(prev => (prev + 1) % HERO_IMAGES.length)
    const q = generateQuestion(mode, grade, difficulty)
    setCurrentQuestion(q)
    setScreen('playing')
  }

  // ---- Exit game ----
  function exitGame() {
    clearInterval(timerRef.current)
    setScreen('start')
  }

  // ---- Urgency (how close No-Face is) ----
  const timeProgress = 1 - (timeRemaining / TOTAL_TIME)
  const coinProgress = coins / TARGET_COINS
  const isUrgent = timeRemaining < 300 // less than 5 min

  // ============================================================
  // RENDER SCREENS
  // ============================================================

  // ---- START SCREEN ----
  if (screen === 'start') {
    return (
      <div className="game-container start-screen">
        <style>{globalStyles}</style>
        <div className="bg-overlay start-bg" />
        <FloatingLanterns count={8} />

        <div className="start-content">
          <div className="start-neeks-hero">
            <img src={NEEKS_IMAGES[0]} alt="Neeks" className="start-neeks-img" />
            <div className="start-neeks-glow" />
          </div>

          <h1 className="game-title">
            <span className="title-kanji">千</span>
            Spirit Math
            <span className="title-kanji">千</span>
          </h1>
          <p className="game-subtitle">A Spirited Away Math Adventure</p>

          <div className="start-tagline">
            <span className="tagline-star">✨</span>
            <span>Collect coins. Catch the train. Get home safe.</span>
            <span className="tagline-star">✨</span>
          </div>

          <div className="start-characters">
            <img src={SPIRITED_IMAGES.chihiroHappy} alt="" className="start-char-img" />
            <img src={SPIRITED_IMAGES.nofaceSootPin} alt="" className="start-char-img round" />
          </div>

          <button className="btn-primary btn-start" onClick={() => setScreen('setup')}>
            START GAME
          </button>

          <div className="soot-row">
            {[0, 1, 2, 3, 4].map(i => (
              <SootSprite key={i} x={`${15 + i * 17}%`} y="0" size={20} delay={i * 0.3} />
            ))}
          </div>
        </div>

        <WaterWaves />
      </div>
    )
  }

  // ---- SETUP SCREEN ----
  if (screen === 'setup') {
    return (
      <div className="game-container setup-screen">
        <style>{globalStyles}</style>
        <div className="bg-overlay setup-bg" />

        <div className="setup-content">
          <button className="btn-back" onClick={() => setScreen('start')}>← Back</button>

          <div className="setup-neeks-small">
            <NeeksAvatar size={70} imageIndex={1} />
            <span className="setup-neeks-label">Neeks' Quest</span>
          </div>

          <h2 className="setup-title">Choose Your Challenge</h2>

          <div className="setup-group">
            <label className="setup-label">Operation</label>
            <div className="setup-buttons">
              <button
                className={`btn-option ${mode === 'multiplication' ? 'active' : ''}`}
                onClick={() => setMode('multiplication')}
              >
                ✕ Multiply
              </button>
              <button
                className={`btn-option ${mode === 'division' ? 'active' : ''}`}
                onClick={() => setMode('division')}
              >
                ÷ Divide
              </button>
              <button
                className={`btn-option ${mode === 'mixed' ? 'active' : ''}`}
                onClick={() => setMode('mixed')}
              >
                🔀 Mixed
              </button>
            </div>
          </div>

          <div className="setup-group">
            <label className="setup-label">Grade Level</label>
            <div className="setup-buttons">
              <button
                className={`btn-option ${grade === '5th' ? 'active' : ''}`}
                onClick={() => setGrade('5th')}
              >
                5th Grade
              </button>
              <button
                className={`btn-option ${grade === '6th' ? 'active' : ''}`}
                onClick={() => setGrade('6th')}
              >
                6th Grade
              </button>
            </div>
          </div>

          <div className="setup-group">
            <label className="setup-label">Difficulty</label>
            <div className="setup-buttons">
              <button
                className={`btn-option ${difficulty === 'easy' ? 'active' : ''}`}
                onClick={() => setDifficulty('easy')}
              >
                🌸 Easy
              </button>
              <button
                className={`btn-option ${difficulty === 'medium' ? 'active' : ''}`}
                onClick={() => setDifficulty('medium')}
              >
                🌊 Medium
              </button>
              <button
                className={`btn-option ${difficulty === 'hard' ? 'active' : ''}`}
                onClick={() => setDifficulty('hard')}
              >
                🐉 Hard
              </button>
            </div>
          </div>

          <button className="btn-primary btn-begin" onClick={startGame}>
            ▶ BEGIN QUEST
          </button>

          <div className="setup-spirited-img">
            <img src={SPIRITED_IMAGES.hakuSunset} alt="" className="setup-scene-img" />
          </div>

          <div className="soot-row">
            {[0, 1, 2].map(i => (
              <SootSprite key={i} x={`${25 + i * 25}%`} y="0" size={18} mood="neutral" delay={i * 0.4} />
            ))}
          </div>
        </div>

        <WaterWaves />
      </div>
    )
  }

  // ---- PLAYING SCREEN ----
  if (screen === 'playing' && currentQuestion) {
    return (
      <div className={`game-container playing-screen ${isUrgent ? 'urgent' : ''}`}>
        <style>{globalStyles}</style>
        <div className={`bg-overlay playing-bg ${isUrgent ? 'urgent-bg' : ''}`} />

        {/* Header bar */}
        <div className="game-header">
          <div className="header-left">
            <button className="btn-exit" onClick={exitGame}>✕</button>
            <NeeksAvatar size={36} imageIndex={neeksImageIdx} className="header-neeks" />
            <div className={`timer ${isUrgent ? 'timer-urgent' : ''}`}>
              ⏱ {formatTime(timeRemaining)}
            </div>
          </div>
          <div className="header-right">
            <div className="coin-counter">
              🪙 {coins}/{TARGET_COINS}
            </div>
            <StreakFire streak={streak} />
          </div>
        </div>

        {/* Coin progress bar */}
        <div className="coin-progress-bar">
          <div className="coin-progress-fill" style={{ width: `${coinProgress * 100}%` }} />
          <div className="coin-progress-markers">
            {Array.from({ length: TARGET_COINS }).map((_, i) => (
              <div key={i} className={`coin-marker ${i < coins ? 'collected' : ''}`}>
                {i < coins ? '🪙' : '○'}
              </div>
            ))}
          </div>
        </div>

        {/* No-Face creeping */}
        <NoFaceCreep urgency={isUrgent ? timeProgress : timeProgress * 0.5} />

        {/* Flying coin animation */}
        <FlyingCoin active={showCoinAnim} />
        <KonpeitoBurst active={showKonpeito} />

        {/* Question card */}
        <div className="question-area">
          <div className="question-hero-img">
            <img src={HERO_IMAGES[heroImage]} alt="" className="hero-img" />
          </div>
          <div className="question-card">
            <div className="question-label">What is...</div>
            <div className="question-text">{currentQuestion.question} = ?</div>
          </div>

          <div className="choices-grid">
            {currentQuestion.choices.map((choice, i) => (
              <button
                key={i}
                className="btn-choice"
                onClick={() => handleAnswer(choice)}
              >
                {String(choice)}
              </button>
            ))}
          </div>
        </div>

        {/* Soot sprites */}
        <div className="soot-row playing-soots">
          {[0, 1, 2, 3].map(i => (
            <SootSprite key={i} x={`${10 + i * 22}%`} y="0" size={16} mood={sootMood} delay={i * 0.2} />
          ))}
        </div>

        {/* Train in distance */}
        <Train progress={coinProgress} />
        <WaterWaves />
      </div>
    )
  }

  // ---- FEEDBACK SCREEN ----
  if (screen === 'feedback' && lastAnswer) {
    const wasCorrect = lastAnswer.wasCorrect
    return (
      <div className={`game-container feedback-screen ${wasCorrect ? 'feedback-correct' : 'feedback-wrong'} ${shakeFeedback ? 'shake' : ''}`}>
        <style>{globalStyles}</style>
        <div className={`bg-overlay ${wasCorrect ? 'correct-bg' : 'wrong-bg'}`} />

        {/* Header still visible */}
        <div className="game-header">
          <div className="header-left">
            <button className="btn-exit" onClick={exitGame}>✕</button>
            <NeeksAvatar size={36} imageIndex={neeksImageIdx} className="header-neeks" />
            <div className={`timer ${isUrgent ? 'timer-urgent' : ''}`}>
              ⏱ {formatTime(timeRemaining)}
            </div>
          </div>
          <div className="header-right">
            <div className="coin-counter">🪙 {coins}/{TARGET_COINS}</div>
          </div>
        </div>

        <div className="feedback-content">
          {wasCorrect ? (
            <>
              <div className="feedback-icon correct-icon">🪙 +1</div>
              <div className="feedback-neeks-celebrate">
                <img src={NEEKS_IMAGES[neeksImageIdx]} alt="Neeks" className="feedback-neeks-img" />
              </div>
              <h2 className="feedback-title correct-title">Amazing, Neeks!</h2>
              {streak >= 3 && (
                <div className="streak-dance">
                  <span>🔥 {streak} in a row! 🔥</span>
                  <div className="dancing-soots">
                    {[0, 1, 2].map(i => (
                      <SootSprite key={i} x={`${25 + i * 25}%`} y="0" size={22} mood="happy" delay={i * 0.15} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="feedback-icon wrong-icon">Not quite!</div>
              <img src={SPIRITED_IMAGES.chihiroWindow} alt="" className="feedback-scene-img" />
              <h2 className="feedback-title wrong-title">Keep going, you've got this!</h2>
              <p className="feedback-correct-was">
                The answer is: <strong>{String(lastAnswer.correctAnswer)}</strong>
              </p>
            </>
          )}

          <div className="feedback-explanation">
            <div className="explanation-label">💡 Here's why:</div>
            <p className="explanation-text">{lastAnswer.explanation}</p>
          </div>

          {wasCorrect ? (
            <div className="feedback-auto-advance">
              <button className="btn-primary btn-next" onClick={nextQuestion}>
                Next Question →
              </button>
            </div>
          ) : (
            <button className="btn-primary btn-next" onClick={nextQuestion}>
              Got it! Next question →
            </button>
          )}
        </div>

        <WaterWaves />
      </div>
    )
  }

  // ---- VICTORY SCREEN ----
  if (screen === 'victory') {
    const accuracy = questionsAnswered > 0 ? Math.round((questionsCorrect / questionsAnswered) * 100) : 0
    const timeTaken = TOTAL_TIME - timeRemaining
    return (
      <div className="game-container victory-screen">
        <style>{globalStyles}</style>
        <div className="bg-overlay victory-bg" />
        <FloatingLanterns count={10} />

        <div className="victory-content">
          {hakuFlying && (
            <div className="haku-flying">
              <img src={SPIRITED_IMAGES.hakuDragonArt} alt="Haku" className="haku-img" />
            </div>
          )}

          <div className="victory-train-scene">
            <img src={SPIRITED_IMAGES.chihiroTrain} alt="" className="victory-train-img" />
          </div>

          <div className="victory-neeks-hero">
            <img src={NEEKS_IMAGES[0]} alt="Neeks" className="victory-neeks-img" />
            <div className="victory-glow" />
          </div>

          <h1 className="victory-title">You Made It Home!</h1>
          <p className="victory-subtitle">Neeks caught the train! 🚂✨</p>

          <div className="stats-card">
            <h3 className="stats-title">Quest Stats</h3>
            <div className="stats-grid">
              <div className="stat">
                <div className="stat-value">🪙 {coins}</div>
                <div className="stat-label">Coins</div>
              </div>
              <div className="stat">
                <div className="stat-value">{accuracy}%</div>
                <div className="stat-label">Accuracy</div>
              </div>
              <div className="stat">
                <div className="stat-value">{formatTime(timeTaken)}</div>
                <div className="stat-label">Time</div>
              </div>
              <div className="stat">
                <div className="stat-value">🔥 {bestStreak}</div>
                <div className="stat-label">Best Streak</div>
              </div>
            </div>
          </div>

          <div className="victory-buttons">
            <button className="btn-primary" onClick={() => setScreen('setup')}>
              Play Again
            </button>
            <button className="btn-secondary" onClick={() => setScreen('start')}>
              Home
            </button>
          </div>
        </div>

        <WaterWaves />
      </div>
    )
  }

  // ---- GAME OVER SCREEN ----
  if (screen === 'gameover') {
    const accuracy = questionsAnswered > 0 ? Math.round((questionsCorrect / questionsAnswered) * 100) : 0
    return (
      <div className="game-container gameover-screen">
        <style>{globalStyles}</style>
        <div className="bg-overlay gameover-bg" />

        <div className="gameover-content">
          <div className="noface-large">
            <img src={SPIRITED_IMAGES.nofaceOffering} alt="No-Face" className="noface-gameover-img" />
          </div>

          <h1 className="gameover-title">No-Face caught you...</h1>
          <p className="gameover-subtitle">You collected {coins}/{TARGET_COINS} coins</p>

          <div className="gameover-neeks">
            <img src={NEEKS_IMAGES[2]} alt="Neeks" className="gameover-neeks-img" />
            <p className="gameover-encourage">Don't worry, Neeks — you'll get on that train next time!</p>
          </div>

          <div className="stats-card dark-stats">
            <div className="stats-grid">
              <div className="stat">
                <div className="stat-value">🪙 {coins}</div>
                <div className="stat-label">Coins</div>
              </div>
              <div className="stat">
                <div className="stat-value">{accuracy}%</div>
                <div className="stat-label">Accuracy</div>
              </div>
              <div className="stat">
                <div className="stat-value">{questionsAnswered}</div>
                <div className="stat-label">Questions</div>
              </div>
            </div>
          </div>

          <button className="btn-primary btn-retry" onClick={() => setScreen('setup')}>
            Try Again
          </button>
          <button className="btn-secondary" onClick={() => setScreen('start')}>
            Home
          </button>
        </div>

        <WaterWaves />
      </div>
    )
  }

  return (
    <div className="game-container">
      <style>{globalStyles}</style>
      <p>Loading...</p>
    </div>
  )
}

// ============================================================
// GLOBAL STYLES
// ============================================================
const globalStyles = `
  /* ---- Reset & Base ---- */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
    font-family: 'M PLUS Rounded 1c', 'Noto Sans JP', sans-serif;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    user-select: none;
  }

  /* ---- Game Container ---- */
  .game-container {
    position: relative;
    width: 100%;
    height: 100dvh;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #faf3e0;
  }

  .bg-overlay {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  .start-bg {
    background: linear-gradient(180deg, #0d0d2b 0%, #1a1a40 30%, #16213e 60%, #1a3a4a 100%);
  }

  .setup-bg {
    background: linear-gradient(180deg, #121230 0%, #1a1a40 40%, #1e3a5f 100%);
  }

  .playing-bg {
    background: linear-gradient(180deg, #0d0d2b 0%, #1a1a40 50%, #16213e 100%);
    transition: background 2s ease;
  }

  .urgent-bg {
    background: linear-gradient(180deg, #1a0a0a 0%, #2d1020 50%, #1a1a40 100%) !important;
  }

  .correct-bg {
    background: linear-gradient(180deg, #0d2b1a 0%, #1a4030 50%, #16213e 100%);
  }

  .wrong-bg {
    background: linear-gradient(180deg, #2b0d0d 0%, #401a1a 50%, #16213e 100%);
  }

  .victory-bg {
    background: linear-gradient(180deg, #1a1a40 0%, #0d3d5c 40%, #2d6a6a 70%, #1a4a6a 100%);
  }

  .gameover-bg {
    background: linear-gradient(180deg, #0a0a0a 0%, #1c0a1a 50%, #0d0d2b 100%);
  }

  /* ---- Typography ---- */
  .game-title {
    font-family: 'Yomogi', cursive;
    font-size: 2.8rem;
    color: #f0c040;
    text-shadow: 0 0 30px rgba(240, 192, 64, 0.5), 0 2px 4px rgba(0,0,0,0.5);
    text-align: center;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: center;
  }

  .title-kanji {
    font-size: 2rem;
    opacity: 0.6;
  }

  .game-subtitle {
    font-family: 'Yomogi', cursive;
    font-size: 1rem;
    color: #b8a87a;
    text-align: center;
    z-index: 2;
    margin-top: 4px;
  }

  /* ---- Start Screen ---- */
  .start-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 20px 120px;
    gap: 16px;
    width: 100%;
    max-width: 500px;
  }

  .start-neeks-hero {
    position: relative;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #f0c040;
    box-shadow: 0 0 40px rgba(240, 192, 64, 0.4);
    margin-top: 20px;
  }

  .start-neeks-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .start-neeks-glow {
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(240,192,64,0.3) 0%, transparent 70%);
    animation: pulse-glow 3s ease-in-out infinite;
  }

  .start-tagline {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.95rem;
    color: #c8b888;
    text-align: center;
    z-index: 2;
  }

  .tagline-star {
    animation: twinkle 2s ease-in-out infinite;
  }

  .start-characters {
    display: flex;
    gap: 12px;
    z-index: 2;
    margin: 8px 0;
  }

  .start-char-img {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border-radius: 12px;
    border: 2px solid rgba(240, 192, 64, 0.3);
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  }

  .start-char-img.round {
    border-radius: 50%;
  }

  /* ---- Buttons ---- */
  .btn-primary {
    background: linear-gradient(135deg, #f0c040, #d4a017);
    color: #1a1a40;
    border: none;
    padding: 16px 48px;
    font-size: 1.2rem;
    font-weight: 800;
    font-family: 'M PLUS Rounded 1c', sans-serif;
    border-radius: 50px;
    cursor: pointer;
    z-index: 2;
    box-shadow: 0 4px 20px rgba(240, 192, 64, 0.4), inset 0 1px 0 rgba(255,255,255,0.3);
    transition: transform 0.15s, box-shadow 0.15s;
    min-height: 54px;
    letter-spacing: 1px;
  }

  .btn-primary:active {
    transform: scale(0.96);
    box-shadow: 0 2px 10px rgba(240, 192, 64, 0.3);
  }

  .btn-secondary {
    background: rgba(255,255,255,0.1);
    color: #faf3e0;
    border: 2px solid rgba(240, 192, 64, 0.3);
    padding: 12px 36px;
    font-size: 1rem;
    font-weight: 700;
    font-family: 'M PLUS Rounded 1c', sans-serif;
    border-radius: 50px;
    cursor: pointer;
    z-index: 2;
    min-height: 48px;
    transition: transform 0.15s;
    margin-top: 8px;
  }

  .btn-secondary:active {
    transform: scale(0.96);
  }

  .btn-back {
    position: absolute;
    top: 12px;
    left: 12px;
    background: rgba(255,255,255,0.1);
    color: #faf3e0;
    border: 1px solid rgba(255,255,255,0.2);
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-family: 'M PLUS Rounded 1c', sans-serif;
    cursor: pointer;
    z-index: 10;
  }

  .btn-exit {
    background: rgba(255,255,255,0.1);
    color: #faf3e0;
    border: 1px solid rgba(255,255,255,0.2);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-size: 0.9rem;
    font-family: 'M PLUS Rounded 1c', sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.15s;
  }

  .btn-exit:active {
    background: rgba(192, 57, 43, 0.3);
  }

  .btn-option {
    background: rgba(255,255,255,0.08);
    color: #c8c0a8;
    border: 2px solid rgba(255,255,255,0.15);
    padding: 12px 16px;
    font-size: 0.95rem;
    font-weight: 600;
    font-family: 'M PLUS Rounded 1c', sans-serif;
    border-radius: 14px;
    cursor: pointer;
    transition: all 0.2s;
    min-height: 48px;
    flex: 1;
    min-width: 90px;
  }

  .btn-option.active {
    background: rgba(240, 192, 64, 0.2);
    color: #f0c040;
    border-color: #f0c040;
    box-shadow: 0 0 15px rgba(240, 192, 64, 0.2);
  }

  .btn-option:active {
    transform: scale(0.96);
  }

  /* ---- Setup Screen ---- */
  .setup-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50px 20px 140px;
    gap: 16px;
    width: 100%;
    max-width: 500px;
  }

  .setup-neeks-small {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .setup-neeks-label {
    font-family: 'Yomogi', cursive;
    font-size: 1.2rem;
    color: #f0c040;
  }

  .setup-title {
    font-family: 'Yomogi', cursive;
    font-size: 1.6rem;
    color: #faf3e0;
    text-align: center;
  }

  .setup-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .setup-label {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #8a8070;
    padding-left: 4px;
  }

  .setup-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .setup-spirited-img {
    margin-top: 12px;
    z-index: 2;
  }

  .setup-scene-img {
    width: 200px;
    height: 80px;
    object-fit: cover;
    border-radius: 12px;
    opacity: 0.6;
    border: 1px solid rgba(240, 192, 64, 0.2);
  }

  .btn-begin {
    margin-top: 8px;
  }

  /* ---- Game Header ---- */
  .game-header {
    position: sticky;
    top: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    z-index: 10;
    background: rgba(13, 13, 43, 0.85);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(240, 192, 64, 0.15);
  }

  .header-left, .header-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .header-neeks {
    border: 2px solid #f0c040;
    box-shadow: 0 0 10px rgba(240, 192, 64, 0.3);
  }

  .timer {
    font-size: 1.1rem;
    font-weight: 700;
    color: #4ecdc4;
    font-variant-numeric: tabular-nums;
  }

  .timer-urgent {
    color: #ff4757;
    animation: pulse-text 1s ease-in-out infinite;
  }

  .coin-counter {
    font-size: 1.1rem;
    font-weight: 700;
    color: #f0c040;
  }

  /* ---- Coin Progress Bar ---- */
  .coin-progress-bar {
    width: calc(100% - 32px);
    max-width: 500px;
    height: 24px;
    background: rgba(255,255,255,0.08);
    border-radius: 12px;
    margin: 8px 16px;
    position: relative;
    z-index: 5;
    overflow: hidden;
  }

  .coin-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #d4a017, #f0c040, #ffe066);
    border-radius: 12px;
    transition: width 0.5s ease;
    box-shadow: 0 0 10px rgba(240, 192, 64, 0.4);
  }

  .coin-progress-markers {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0 4px;
    font-size: 0.6rem;
  }

  .coin-marker {
    opacity: 0.5;
    transition: all 0.3s;
  }

  .coin-marker.collected {
    opacity: 1;
    font-size: 0.75rem;
    animation: coin-pop 0.3s ease;
  }

  /* ---- Question Area ---- */
  .question-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 16px;
    z-index: 5;
    width: 100%;
    max-width: 500px;
    gap: 12px;
  }

  .question-hero-img {
    width: 100%;
    max-width: 280px;
    height: 100px;
    border-radius: 14px;
    overflow: hidden;
    border: 2px solid rgba(240, 192, 64, 0.2);
    box-shadow: 0 4px 16px rgba(0,0,0,0.4);
    animation: fade-in 0.5s ease;
  }

  .hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .question-card {
    background: rgba(255,255,255,0.07);
    border: 2px solid rgba(240, 192, 64, 0.25);
    border-radius: 20px;
    padding: 24px 32px;
    text-align: center;
    width: 100%;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    backdrop-filter: blur(10px);
  }

  .question-label {
    font-size: 0.85rem;
    color: #8a8a9a;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .question-text {
    font-size: 2.2rem;
    font-weight: 800;
    color: #faf3e0;
    text-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }

  .choices-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    width: 100%;
  }

  .btn-choice {
    background: rgba(255,255,255,0.1);
    border: 2px solid rgba(240, 192, 64, 0.2);
    color: #faf3e0;
    padding: 20px 16px;
    font-size: 1.4rem;
    font-weight: 700;
    font-family: 'M PLUS Rounded 1c', sans-serif;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.15s;
    min-height: 64px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }

  .btn-choice:active {
    transform: scale(0.95);
    background: rgba(240, 192, 64, 0.2);
    border-color: #f0c040;
  }

  /* ---- Feedback Screen ---- */
  .feedback-content {
    position: relative;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 20px 120px;
    gap: 12px;
    width: 100%;
    max-width: 500px;
    flex: 1;
    overflow-y: auto;
  }

  .feedback-icon {
    font-size: 2rem;
    font-weight: 800;
    padding: 12px 24px;
    border-radius: 16px;
    margin-top: 8px;
  }

  .correct-icon {
    background: rgba(46, 204, 113, 0.2);
    color: #2ecc71;
    animation: bounce-in 0.4s ease;
  }

  .wrong-icon {
    background: rgba(231, 76, 60, 0.2);
    color: #e74c3c;
    font-size: 1.4rem;
  }

  .feedback-neeks-celebrate {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #2ecc71;
    box-shadow: 0 0 30px rgba(46, 204, 113, 0.3);
    animation: bounce-in 0.5s ease;
  }

  .feedback-neeks-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .feedback-scene-img {
    width: 120px;
    height: 80px;
    object-fit: cover;
    border-radius: 12px;
    opacity: 0.7;
  }

  .feedback-title {
    font-family: 'Yomogi', cursive;
    font-size: 1.5rem;
    text-align: center;
  }

  .correct-title { color: #2ecc71; }
  .wrong-title { color: #e8a87c; }

  .feedback-correct-was {
    font-size: 1.2rem;
    color: #faf3e0;
    text-align: center;
  }

  .feedback-correct-was strong {
    color: #f0c040;
    font-size: 1.4rem;
  }

  .feedback-explanation {
    background: rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 16px 20px;
    width: 100%;
    border-left: 4px solid #f0c040;
  }

  .explanation-label {
    font-size: 0.85rem;
    font-weight: 700;
    color: #f0c040;
    margin-bottom: 6px;
  }

  .explanation-text {
    font-size: 1rem;
    line-height: 1.5;
    color: #d8d0c0;
  }

  .feedback-auto-advance {
    margin-top: 8px;
  }

  .btn-next {
    padding: 14px 40px;
    font-size: 1rem;
  }

  .streak-dance {
    text-align: center;
    font-size: 1.1rem;
    color: #ff9f43;
    font-weight: 700;
  }

  .dancing-soots {
    position: relative;
    height: 30px;
    width: 200px;
    margin: 0 auto;
  }

  /* ---- Victory Screen ---- */
  .victory-content {
    position: relative;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 20px 120px;
    gap: 16px;
    width: 100%;
    max-width: 500px;
  }

  .victory-train-scene {
    width: 100%;
    max-width: 320px;
    border-radius: 16px;
    overflow: hidden;
    border: 2px solid rgba(240, 192, 64, 0.3);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    animation: fade-in 1s ease;
  }

  .victory-train-img {
    width: 100%;
    height: auto;
    display: block;
  }

  .victory-neeks-hero {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #f0c040;
    box-shadow: 0 0 40px rgba(240, 192, 64, 0.5);
    margin-top: -30px;
  }

  .victory-neeks-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .victory-glow {
    position: absolute;
    inset: -20px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(240,192,64,0.3) 0%, transparent 70%);
    animation: pulse-glow 2s ease-in-out infinite;
  }

  .victory-title {
    font-family: 'Yomogi', cursive;
    font-size: 2.2rem;
    color: #f0c040;
    text-shadow: 0 0 30px rgba(240, 192, 64, 0.5);
    text-align: center;
  }

  .victory-subtitle {
    font-size: 1.1rem;
    color: #b8d0d0;
    text-align: center;
  }

  .haku-flying {
    position: fixed;
    top: -50px;
    right: -50px;
    width: 200px;
    z-index: 20;
    animation: haku-fly 3s ease-in-out forwards;
    pointer-events: none;
  }

  .haku-img {
    width: 100%;
    height: auto;
    filter: drop-shadow(0 0 20px rgba(78, 205, 196, 0.5));
  }

  .stats-card {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(240, 192, 64, 0.2);
    border-radius: 20px;
    padding: 20px;
    width: 100%;
    backdrop-filter: blur(10px);
  }

  .dark-stats {
    background: rgba(0,0,0,0.3);
  }

  .stats-title {
    font-family: 'Yomogi', cursive;
    color: #f0c040;
    text-align: center;
    margin-bottom: 12px;
    font-size: 1.1rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .stat {
    text-align: center;
  }

  .stat-value {
    font-size: 1.3rem;
    font-weight: 800;
    color: #faf3e0;
  }

  .stat-label {
    font-size: 0.75rem;
    color: #8a8a9a;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 2px;
  }

  .victory-buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    width: 100%;
  }

  /* ---- Game Over Screen ---- */
  .gameover-content {
    position: relative;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px 120px;
    gap: 16px;
    width: 100%;
    max-width: 500px;
  }

  .noface-large {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    overflow: hidden;
    animation: noface-appear 1.5s ease;
    box-shadow: 0 0 60px rgba(139, 0, 0, 0.4);
    border: 3px solid rgba(139, 0, 0, 0.5);
  }

  .noface-gameover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .gameover-title {
    font-family: 'Yomogi', cursive;
    font-size: 2rem;
    color: #c0392b;
    text-shadow: 0 0 20px rgba(192, 57, 43, 0.4);
    text-align: center;
  }

  .gameover-subtitle {
    font-size: 1.1rem;
    color: #8a7a6a;
  }

  .gameover-neeks {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .gameover-neeks-img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(240, 192, 64, 0.3);
  }

  .gameover-encourage {
    font-size: 0.95rem;
    color: #b8a87a;
    text-align: center;
    font-style: italic;
    max-width: 280px;
  }

  .btn-retry {
    margin-top: 8px;
  }

  /* ---- Soot Sprite ---- */
  .soot-sprite {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #3a3a3a, #1c1c1c);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: soot-bounce 2s ease-in-out infinite;
    z-index: 3;
  }

  .soot-eyes {
    display: flex;
    gap: 4px;
  }

  .soot-eye {
    width: 4px;
    height: 4px;
    background: white;
    border-radius: 50%;
  }

  .soot-happy {
    animation: soot-dance 0.5s ease-in-out infinite !important;
  }

  .soot-sad .soot-eye {
    height: 2px;
    margin-top: 2px;
  }

  .soot-row {
    position: relative;
    width: 100%;
    height: 30px;
    z-index: 3;
  }

  .playing-soots {
    margin-bottom: 8px;
  }

  /* ---- Water Waves ---- */
  .water-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    z-index: 1;
    overflow: hidden;
    pointer-events: none;
  }

  .wave {
    position: absolute;
    bottom: 0;
    left: -10%;
    width: 120%;
    height: 40px;
    border-radius: 50% 50% 0 0 / 100% 100% 0 0;
    animation: wave-move 6s ease-in-out infinite;
  }

  .wave-1 {
    background: rgba(45, 106, 106, 0.4);
    animation-duration: 6s;
    bottom: 0;
    height: 35px;
  }

  .wave-2 {
    background: rgba(78, 205, 196, 0.2);
    animation-duration: 8s;
    animation-delay: -2s;
    bottom: 5px;
    height: 30px;
  }

  .wave-3 {
    background: rgba(45, 106, 106, 0.3);
    animation-duration: 7s;
    animation-delay: -4s;
    bottom: -2px;
    height: 40px;
  }

  /* ---- No-Face Creep ---- */
  .noface-creep {
    position: fixed;
    top: 50%;
    right: -20px;
    transform-origin: center;
    z-index: 2;
    pointer-events: none;
    transition: opacity 2s, transform 2s;
    width: 80px;
  }

  .noface-creep-img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    filter: brightness(0.7) saturate(0.5);
  }

  /* ---- Neeks Avatar ---- */
  .neeks-avatar {
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
  }

  /* ---- Streak ---- */
  .streak-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.8rem;
    color: #ff9f43;
    font-weight: 700;
  }

  .streak-fire {
    animation: fire-pulse 0.5s ease-in-out infinite alternate;
  }

  /* ---- Train ---- */
  .train-track {
    position: fixed;
    bottom: 50px;
    left: 0;
    right: 0;
    height: 30px;
    z-index: 1;
    overflow: hidden;
    pointer-events: none;
  }

  .train {
    font-size: 1.5rem;
    position: absolute;
    left: 0;
    transition: transform 1s ease;
    filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));
  }

  /* ---- Lanterns ---- */
  .lanterns-container {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 1;
  }

  .lantern {
    position: absolute;
    top: -10px;
    font-size: 1.5rem;
    animation: lantern-float 4s ease-in-out infinite;
    opacity: 0.8;
  }

  /* ---- Flying Coin ---- */
  .flying-coin {
    position: fixed;
    top: 50%;
    left: 50%;
    font-size: 2rem;
    z-index: 20;
    animation: coin-fly 0.8s ease-out forwards;
    pointer-events: none;
  }

  /* ---- Konpeito Burst ---- */
  .konpeito-burst {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 20;
    pointer-events: none;
  }

  .konpeito-star {
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--color);
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    animation: konpeito-fly 0.8s ease-out forwards;
  }

  /* ---- Animations ---- */
  @keyframes pulse-glow {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
  }

  @keyframes twinkle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  @keyframes soot-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  @keyframes soot-dance {
    0%, 100% { transform: translateY(0) rotate(-10deg); }
    50% { transform: translateY(-10px) rotate(10deg); }
  }

  @keyframes wave-move {
    0%, 100% { transform: translateX(0) scaleY(1); }
    50% { transform: translateX(-3%) scaleY(1.2); }
  }

  @keyframes coin-fly {
    0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    100% { transform: translate(30vw, -40vh) scale(0.3); opacity: 0; }
  }

  @keyframes coin-pop {
    0% { transform: scale(0.5); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }

  @keyframes konpeito-fly {
    0% { transform: translate(0, 0) scale(1); opacity: 1; }
    100% {
      transform: translate(
        calc(cos(var(--angle)) * var(--distance)),
        calc(sin(var(--angle)) * var(--distance))
      ) scale(0);
      opacity: 0;
    }
  }

  @keyframes bounce-in {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes pulse-text {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes fire-pulse {
    0% { transform: scale(1); }
    100% { transform: scale(1.2); }
  }

  @keyframes lantern-float {
    0% { transform: translateY(-100vh); opacity: 0; }
    10% { opacity: 0.8; }
    90% { opacity: 0.8; }
    100% { transform: translateY(20vh); opacity: 0; }
  }

  @keyframes noface-appear {
    0% { transform: scale(0.5); opacity: 0; filter: blur(10px); }
    100% { transform: scale(1); opacity: 1; filter: blur(0); }
  }

  @keyframes fade-in {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  @keyframes haku-fly {
    0% { top: 120%; right: -100px; transform: rotate(-20deg) scale(0.5); opacity: 0; }
    30% { opacity: 1; }
    100% { top: -50px; right: 50%; transform: rotate(10deg) scale(1); opacity: 0.8; }
  }

  .shake {
    animation: shake 0.4s ease;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    75% { transform: translateX(8px); }
  }

  /* ---- Mobile optimizations ---- */
  @media (max-width: 400px) {
    .game-title { font-size: 2.2rem; }
    .question-text { font-size: 1.8rem; }
    .btn-choice { padding: 16px 12px; font-size: 1.2rem; min-height: 56px; }
    .btn-primary { padding: 14px 36px; font-size: 1.1rem; }
    .start-neeks-hero { width: 110px; height: 110px; }
    .coin-progress-markers { font-size: 0.5rem; }
  }

  @media (max-width: 360px) {
    .game-title { font-size: 1.8rem; }
    .question-text { font-size: 1.5rem; }
    .btn-choice { padding: 14px 10px; font-size: 1.1rem; }
    .setup-buttons { gap: 6px; }
    .btn-option { padding: 10px 12px; font-size: 0.85rem; min-width: 75px; }
  }

  /* Safe area for notched phones */
  @supports (padding: env(safe-area-inset-top)) {
    .game-header {
      padding-top: calc(12px + env(safe-area-inset-top));
    }
    .water-container {
      height: calc(60px + env(safe-area-inset-bottom));
    }
  }
`
