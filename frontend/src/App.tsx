import { useState, useEffect } from 'react';
import './App.css'
import type { NewVocabInput, VocabItem } from './types';
import {
  createVocab,
  deleteVocab as deleteVocabRequest,
  fetchVocab,
  updateVocab as updateVocabRequest
} from './api';
import VocabForm from './components/VocabForm';
import VocabItemComponent from './components/VocabItem';
import FilterBar from './components/FilterBar';

// pimsleur can get wrecked

function App() {
  const [vocabItems, setVocabItems] = useState<VocabItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    const loadVocab = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const data: VocabItem[] = await fetchVocab();
        setVocabItems(data);
      } catch (error) {
        console.error(error);
        setErrorMessage('Could not load vocabulary items.');
      } finally {
        setIsLoading(false);
      }
    };

    loadVocab();
  }, []);

  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuizItem, setCurrentQuizItem] = useState<VocabItem | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  function pickRandomQuizItem(items: VocabItem[]) {
    if (items.length === 0) {
      setCurrentQuizItem(null);
      setShowAnswer(false);
      return;
    }

    const randomIndex = Math.floor(Math.random() * items.length);
    setCurrentQuizItem(items[randomIndex]);
    setShowAnswer(false);
  }

  function enterQuizMode() {
    setIsQuizMode(true);
    pickRandomQuizItem(filteredItems);
  }

  function exitQuizMode() {
    setIsQuizMode(false);
    setCurrentQuizItem(null);
    setShowAnswer(false);
  }

  function nextQuizItem() {
    pickRandomQuizItem(filteredItems);
  }

  const [languageFilter, setLanguageFilter] = useState('All');
  const [learnedFilter, setLearnedFilter] = useState('all');
  const languages = ['All', ...new Set(vocabItems.map((item) => item.language))];

  const filteredItems = vocabItems.filter((item) => {
    const matchesLanguage = languageFilter === 'All' || item.language === languageFilter;

    const matchesLearned =
      learnedFilter === 'all' ||
      (learnedFilter === 'learned' && item.learned) ||
      (learnedFilter === 'unlearned' && !item.learned);

    return matchesLanguage && matchesLearned;
  });

  function toggleLearned(id: number) {
    const item = vocabItems.find((item) => item.id === id);
    if (!item) return;

    updateItem({
      ...item,
      learned: !item.learned,
    });
  }

  async function deleteItem(id: number) {
    try {
      setErrorMessage('');

      await deleteVocabRequest(id);

      setVocabItems((items) => items.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
      setErrorMessage('Could not delete vocabulary item.');
    }
  }

  async function addItem(input: NewVocabInput) {
    try {
      setErrorMessage('');

      const createdItem = await createVocab(input);
      setVocabItems((items) => [...items, createdItem]);
    } catch (error) {
      console.error(error);
      setErrorMessage('Could not create vocabulary item.');
    }
  }

  async function updateItem(updatedItem: VocabItem) {
    try {
      setErrorMessage('');

      const savedItem = await updateVocabRequest(updatedItem);

      setVocabItems((items) =>
        items.map((item) =>
          item.id === savedItem.id ? savedItem : item
        )
      );
    } catch (error) {
      console.error(error);
      setErrorMessage('Could not update vocabulary item.');
    }
  }

  return (
    <main>
      <h1>Vocabulary Tracker</h1>

      <div>
        {isQuizMode ? (
          <button onClick={exitQuizMode}>Back to List</button>
        ) : (
          <button onClick={enterQuizMode}>Start Quiz</button>
        )}
      </div>

      {isQuizMode ? (
        <section>
          {isLoading ? (
            <p>Loading vocabulary items...</p>
          ) : errorMessage ? (
            <p>{errorMessage}</p>
          ) : filteredItems.length === 0 || !currentQuizItem ? (
            <p>No vocabulary items available for quiz mode.</p>
          ) : (
            <>
              <h2>{currentQuizItem.term}</h2>

              {!showAnswer ? (
                <button onClick={() => setShowAnswer(true)}>Show Answer</button>
              ) : (
                <>
                  <p>
                    <strong>Meaning:</strong> {currentQuizItem.meaning}
                  </p>
                  <p>
                    <strong>Language:</strong> {currentQuizItem.language}
                  </p>

                  <button onClick={nextQuizItem}>Got it</button>
                  <button onClick={nextQuizItem}>Missed it</button>
                </>
              )}
            </>
          )}
        </section>
      ) : (
        <>
          <VocabForm onAddItem={addItem} />

          <FilterBar
            languageFilter={languageFilter}
            learnedFilter={learnedFilter}
            languages={languages}
            onLanguageFilterChange={setLanguageFilter}
            onLearnedFilterChange={setLearnedFilter}
          />

          {isLoading && <p>Loading vocabulary items...</p>}
          {errorMessage && <p>{errorMessage}</p>}

          {!isLoading &&
            (filteredItems.length === 0 ? (
              <p>No matching vocabulary items.</p>
            ) : (
              <ul>
                {filteredItems.map((item) => (
                  <VocabItemComponent
                    key={item.id}
                    item={item}
                    onToggle={toggleLearned}
                    onDelete={deleteItem}
                    onUpdate={updateItem}
                  />
                ))}
              </ul>
            ))}
        </>
      )}
    </main>
  );
}

export default App;