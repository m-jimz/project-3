import { useMemo, useState } from 'react';

const cardsData = [
  { id: 1, question: 'What is React?', answer: 'A JavaScript library for building user interfaces with reusable components' },
  { id: 2, question: 'What is JSX?', answer: 'A syntax extension that allows you to write HTML-like code in JavaScript' },
  { id: 3, question: 'What are React hooks?', answer: 'Functions that let you use state and other React features in functional components' },
  { id: 4, question: 'What does useState do?', answer: 'It allows you to add state to a functional component' },
  { id: 5, question: 'What is the virtual DOM?', answer: 'A lightweight JavaScript representation of the real DOM that React uses to optimize updates' },
  { id: 6, question: 'What is prop drilling?', answer: 'Passing data through multiple levels of components to reach a deeply nested component' },
  { id: 7, question: 'State vs props?', answer: 'State is mutable and local, props are immutable and passed from parent to child' },
  { id: 8, question: 'What is useEffect?', answer: 'A hook for side effects in functional components' },
];

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\\s]/g, '')
    .replace(/\\s+/g, ' ')
    .trim();
}

function isCorrectGuess(guess, answer) {
  const g = normalize(guess);
  const a = normalize(answer);
  if (!g) return false;
  return a.includes(g) || g.includes(a);
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function CardView({ showAnswer, question, answer, onFlip }) {
  return (
    <button type="button" className="flashcards-card" onClick={onFlip}>
      {showAnswer ? answer : question}
    </button>
  );
}

function GuessForm({ guess, onGuessChange, onSubmit, feedback }) {
  return (
    <form className="guess-form" onSubmit={onSubmit}>
      <label htmlFor="guess-input">Your guess</label>
      <input
        id="guess-input"
        value={guess}
        onChange={(e) => onGuessChange(e.target.value)}
        placeholder="Type your answer"
      />
      <button type="submit">Submit</button>
      <p className={"feedback " + feedback}>
        {feedback === 'correct' ? 'Correct' : feedback === 'incorrect' ? 'Try again' : ' '}
      </p>
    </form>
  );
}

function Navigation({ onPrev, onNext, onShuffle, onMaster, prevDisabled, nextDisabled }) {
  return (
    <div className="flashcards-actions">
      <button type="button" onClick={onPrev} disabled={prevDisabled}>Previous</button>
      <button type="button" onClick={onNext} disabled={nextDisabled}>Next</button>
      <button type="button" onClick={onShuffle}>Shuffle</button>
      <button type="button" onClick={onMaster}>Mark Mastered</button>
    </div>
  );
}

function StreakPanel({ currentStreak, longestStreak, remainingCount, masteredCount }) {
  return (
    <div className="streak-panel">
      <p>Current streak: {currentStreak}</p>
      <p>Longest streak: {longestStreak}</p>
      <p>Remaining cards: {remainingCount}</p>
      <p>Mastered cards: {masteredCount}</p>
    </div>
  );
}

export default function Flashcards() {
  const [cards] = useState(cardsData);
  const [order, setOrder] = useState(cardsData.map((c) => c.id));
  const [currentPos, setCurrentPos] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('neutral');
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [masteredIds, setMasteredIds] = useState(new Set());

  const activeIds = useMemo(
    () => order.filter((id) => !masteredIds.has(id)),
    [order, masteredIds]
  );

  const currentId = activeIds[currentPos];
  const currentCard = cards.find((c) => c.id === currentId);

  function resetCardInteraction() {
    setShowAnswer(false);
    setGuess('');
    setFeedback('neutral');
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!currentCard) return;
    const correct = isCorrectGuess(guess, currentCard.answer);
    if (correct) {
      const nextStreak = currentStreak + 1;
      setCurrentStreak(nextStreak);
      setLongestStreak((prev) => Math.max(prev, nextStreak));
      setFeedback('correct');
    } else {
      setCurrentStreak(0);
      setFeedback('incorrect');
    }
  }

  function handlePrev() {
    setCurrentPos((p) => Math.max(0, p - 1));
    resetCardInteraction();
  }

  function handleNext() {
    setCurrentPos((p) => Math.min(activeIds.length - 1, p + 1));
    resetCardInteraction();
  }

  function handleShuffle() {
    setOrder((prev) => shuffleArray(prev));
    setCurrentPos(0);
    resetCardInteraction();
  }

  function handleMaster() {
    if (!currentCard) return;
    setMasteredIds((prev) => {
      const copy = new Set(prev);
      copy.add(currentCard.id);
      return copy;
    });
    setCurrentPos((p) => Math.max(0, Math.min(p, activeIds.length - 2)));
    resetCardInteraction();
  }

  if (!currentCard) {
    return <p>All cards mastered. Great work!</p>;
  }

  return (
    <div className="flashcards-page">
      <h2>React Trivia</h2>

      <StreakPanel
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        remainingCount={activeIds.length}
        masteredCount={masteredIds.size}
      />

      <CardView
        showAnswer={showAnswer}
        question={currentCard.question}
        answer={currentCard.answer}
        onFlip={() => setShowAnswer((s) => !s)}
      />

      <GuessForm
        guess={guess}
        onGuessChange={setGuess}
        onSubmit={handleSubmit}
        feedback={feedback}
      />

      <Navigation
        onPrev={handlePrev}
        onNext={handleNext}
        onShuffle={handleShuffle}
        onMaster={handleMaster}
        prevDisabled={currentPos === 0}
        nextDisabled={currentPos === activeIds.length - 1}
      />
    </div>
  );
}

// add more cards as needed 
