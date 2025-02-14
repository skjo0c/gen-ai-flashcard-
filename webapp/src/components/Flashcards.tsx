import { useState } from 'react';
import { Flashcard } from './domain/FlashCard';

function Flashcards({ flashCardData }: { flashCardData: Flashcard[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentCard = flashCardData[currentIndex];

  const handleNext = () => {
    if (currentIndex < flashCardData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setSelectedAnswers([]);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setSelectedAnswers([]);
      setShowExplanation(false);
    }
  };

  const handleOptionClick = (optionId: string) => {
    if (currentCard.type === 'SCQ') {
      setSelectedAnswers([optionId]);
    } else if (currentCard.type === 'MCQ') {
      setSelectedAnswers(prev => 
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    }
  };

  const isCorrect = () => {
    if (currentCard.type === 'SCQ') {
      return selectedAnswers[0] === currentCard.answer;
    } else if (currentCard.type === 'MCQ') {
      const answer = currentCard.answer as string[];
      return selectedAnswers.length === answer.length &&
        selectedAnswers.every(a => answer.includes(a));
    }
    return false;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Flashcards</h1>
        <div className="text-gray-600">
          Card {currentIndex + 1} of {flashCardData.length}
        </div>
      </div>

      <div 
        className={`perspective-1000 relative h-[400px] w-full cursor-pointer`}
        onClick={() => currentCard.type === 'QA' && setIsFlipped(!isFlipped)}
      >
        <div className={`
          absolute w-full h-full transition-transform duration-500 transform-style-preserve-3d
          ${isFlipped ? 'rotate-y-180' : ''}
        `}>
          {/* Front of card */}
          <div className="absolute w-full h-full backface-hidden">
            <div className="bg-white rounded-xl shadow-lg p-8 h-full">
              <div className="h-full flex flex-col">
                <div className="mb-4">
                  <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                    {currentCard.type}
                  </span>
                </div>
                <p className="text-xl font-medium text-gray-800 mb-6">
                  {currentCard.question}
                </p>
                {(currentCard.type === 'SCQ' || currentCard.type === 'MCQ') && (
                  <div className="space-y-3">
                    {currentCard.options?.map(option => (
                      <button
                        key={option.id}
                        onClick={() => handleOptionClick(option.id)}
                        className={`w-full text-left p-4 rounded-lg border transition-colors ${
                          selectedAnswers.includes(option.id)
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        {option.text}
                      </button>
                    ))}
                    {selectedAnswers.length > 0 && (
                      <button
                        onClick={() => setIsFlipped(true)}
                        className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                      >
                        Check Answer
                      </button>
                    )}
                  </div>
                )}
                {currentCard.type === 'QA' && (
                  <p className="text-gray-600 text-center mt-8">
                    Click to reveal answer
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Back of card */}
          <div className="absolute w-full h-full backface-hidden rotate-y-minus-180">
            <div className="bg-white rounded-xl shadow-lg p-8 h-full">
              <div className="h-full flex flex-col">
                {(currentCard.type === 'SCQ' || currentCard.type === 'MCQ') && (
                  <>
                    <div className={`mb-6 text-center ${
                      isCorrect() ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <p className="text-2xl font-bold">
                        {isCorrect() ? 'Correct!' : 'Incorrect'}
                      </p>
                    </div>
                    <div className="space-y-4">
                      <p className="font-medium text-gray-800">
                        Correct answer{currentCard.type === 'MCQ' ? 's' : ''}:
                      </p>
                      <div className="space-y-2">
                        {currentCard.options?.filter(option => 
                          Array.isArray(currentCard.answer)
                            ? currentCard.answer.includes(option.id)
                            : currentCard.answer === option.id
                        ).map(option => (
                          <p key={option.id} className="text-gray-700">
                            • {option.text}
                          </p>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {currentCard.type === 'QA' && (
                  <div className="text-gray-800">
                    <p className="text-xl font-medium mb-4">Answer:</p>
                    <p>{currentCard.answer}</p>
                  </div>
                )}
                {currentCard.explanation && (
                  <div className="mt-auto">
                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      {showExplanation ? 'Hide' : 'Show'} Explanation
                    </button>
                    {showExplanation && (
                      <p className="mt-2 text-gray-600">
                        {currentCard.explanation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            currentIndex === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          <span className="material-symbols-rounded">chevron_left</span>
          <span>Previous</span>
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === flashCardData.length - 1}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            currentIndex === flashCardData.length - 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          <span>Next</span>
          <span className="material-symbols-rounded">chevron_right</span>
        </button>
      </div>
    </div>
  );
}

export default Flashcards;