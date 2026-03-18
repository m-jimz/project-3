import { useState } from 'react';

// list of questions and answers 
const cardsData = [
  { id: 1, question: 'What is React?', answer: 'A JavaScript library for building user interfaces with reusable components', },
  { id: 2, question: 'What is JSX?', answer: 'A syntax extension that allows you to write HTML-like code in JavaScript' },
  { id: 3, question: 'What are React hooks?', answer: 'Functions that let you use state and other React features in functional components' },
  { id: 4, question: 'What does useState do?', answer: 'It allows you to add state to a functional component' },
  { id: 5, question: 'What is the virtual DOM?', answer: 'A lightweight JavaScript representation of the real DOM that React uses to optimize updates' },
  { id: 6, question: 'What is prop drilling?', answer: 'Passing data through multiple levels of components to reach a deeply nested component' },
  { id: 7, question: 'What is the difference between state and props?', answer: 'State is mutable and managed within a component, props are immutable and passed from parent to child' },
  { id: 8, question: 'What is useEffect?', answer: 'A hook that lets you perform side effects in functional components' },
  { id: 9, question: 'What is a component in React?', answer: 'A reusable piece of UI that can be a function or class that returns JSX' },
  { id: 10, question: 'What does the key prop do in React?', answer: 'It helps React identify which items have changed, been added, or removed in a list' },
];

const Flashcards = () => {
  // using useState

  const [cards] = useState(cardsData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentCard = cards[currentIndex];
  const totalCards = cards.length;

  const getRandomCard = () => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * cards.length);
    } while (randomIndex === currentIndex && cards.length > 1);
    setCurrentIndex(randomIndex);
    setShowAnswer(false);
  };

  return (

/* div wrappers/classes to organize styling for App.css*/

    

  <div className="flashcards-page">
    <div className="flashcards-header">
      <h2 className="flashcards-title">React Trivia</h2>
      <p className="flashcards-progress">
        Number of Cards: {totalCards}
      </p>
    </div>

    <div className="flashcards-content">
      <button
        type="button"
        className="flashcards-card"
        onClick={() => setShowAnswer(!showAnswer)}
        aria-label={showAnswer ? 'Show question' : 'Show answer'}
      >
        {showAnswer ? currentCard.answer : currentCard.question}
      </button>

      {currentCard.image && (
        <div className="flashcards-media">
          <img
            className="flashcards-image"
            src={currentCard.image}
            alt={currentCard.question}
          />
        </div>
      )}
    </div>

    <div className="flashcards-actions">
      <button className="flashcards-next-btn" type="button" onClick={getRandomCard}>
        Next
      </button>
    </div>
  </div>



  );
};

export default Flashcards;




// add more cards as needed 
