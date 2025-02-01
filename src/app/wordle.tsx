"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const WORD_LENGTH = 5
const MAX_GUESSES = 6
const KEYBOARD_LETTERS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
]

const WORDS = ["REACT", "REDUX", "HOOKS", "STATE", "PROPS"]

export default function Wordle() {
  const [secretWord, setSecretWord] = useState("")
  const [guesses, setGuesses] = useState<string[]>(Array(MAX_GUESSES).fill(""))
  const [currentGuess, setCurrentGuess] = useState("")
  const [guessIndex, setGuessIndex] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [pressedKey, setPressedKey] = useState("")

  useEffect(() => {
    setSecretWord(WORDS[Math.floor(Math.random() * WORDS.length)])
  }, [])

  const handleKeyPress = useCallback(
    (letter: string) => {
      if (gameOver) return
      if (currentGuess.length < WORD_LENGTH) {
        setCurrentGuess((prev) => prev + letter)
        setPressedKey(letter)
        setTimeout(() => setPressedKey(""), 200)
      }
    },
    [currentGuess, gameOver],
  )

  const handleBackspace = useCallback(() => {
    setCurrentGuess((prev) => prev.slice(0, -1))
    setPressedKey("Backspace")
    setTimeout(() => setPressedKey(""), 200)
  }, [])

  const handleEnter = useCallback(() => {
    if (currentGuess.length !== WORD_LENGTH) return

    const newGuesses = [...guesses]
    newGuesses[guessIndex] = currentGuess
    setGuesses(newGuesses)

    if (currentGuess === secretWord) {
      setGameOver(true)
    } else if (guessIndex === MAX_GUESSES - 1) {
      setGameOver(true)
    } else {
      setGuessIndex((prev) => prev + 1)
      setCurrentGuess("")
    }
    setPressedKey("Enter")
    setTimeout(() => setPressedKey(""), 200)
  }, [currentGuess, guessIndex, guesses, secretWord])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Backspace") {
        handleBackspace()
      } else if (event.key === "Enter") {
        handleEnter()
      } else if (/^[A-Za-z]$/.test(event.key)) {
        handleKeyPress(event.key.toUpperCase())
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleBackspace, handleEnter, handleKeyPress])

  const getLetterColor = (letter: string, index: number, guess: string) => {
    if (secretWord[index] === letter) {
      return "bg-white text-black"
    } else if (secretWord.includes(letter)) {
      return "bg-neutral-600 text-white"
    } else {
      return "bg-neutral-900 text-white"
    }
  }

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-black text-white p-4 overflow-hidden">
      <h1 className="text-4xl font-bold mb-4 text-center tracking-tighter">
        WORDLE<span className="text-neutral-600">NEO</span>
      </h1>
      <div className="w-full max-w-sm mx-auto flex-grow flex flex-col justify-center">
        <div className="grid grid-rows-6 gap-1 mb-4">
          {guesses.map((guess, i) => (
            <div key={i} className="grid grid-cols-5 gap-1">
              {Array.from({ length: WORD_LENGTH }).map((_, j) => (
                <motion.div
                  key={j}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`aspect-square flex items-center justify-center text-2xl font-bold border ${
                    guess[j] ? getLetterColor(guess[j], j, guess) : "border-neutral-800"
                  }`}
                >
                  {guess[j] || (i === guessIndex && currentGuess[j]) || ""}
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-sm mx-auto">
        <div className="grid gap-1 mb-4">
          {KEYBOARD_LETTERS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1">
              {row.map((letter) => (
                <motion.div key={letter} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => handleKeyPress(letter)}
                    className={`w-8 h-10 text-sm font-medium ${
                      pressedKey === letter ? "bg-white text-black" : "bg-neutral-800 hover:bg-neutral-700"
                    }`}
                  >
                    {letter}
                  </Button>
                </motion.div>
              ))}
            </div>
          ))}
          <div className="flex justify-center gap-1 mt-1">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleBackspace}
                className={`px-2 h-10 text-sm font-medium ${
                  pressedKey === "Backspace" ? "bg-white text-black" : "bg-neutral-800 hover:bg-neutral-700"
                }`}
              >
                ⌫
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleEnter}
                className={`px-2 h-10 text-sm font-medium ${
                  pressedKey === "Enter" ? "bg-white text-black" : "bg-neutral-800 hover:bg-neutral-700"
                }`}
              >
                Enter
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      {gameOver && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl font-bold text-center mt-4"
        >
          {currentGuess === secretWord ? "You won!" : `Game over! The word was ${secretWord}`}
        </motion.div>
      )}
    </div>
  )
}
