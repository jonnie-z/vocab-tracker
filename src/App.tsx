import { useState } from 'react';
import './App.css'

type VocabItem = {
  id: number;
  term: string;
  meaning: string;
  language: string;
  learned: boolean;
};

type VocabItemProps = {
  item: VocabItem;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

function VocabItemComponent({ item, onToggle, onDelete }: VocabItemProps) {
  return (
    <li>
      <b>{item.term}</b> - {item.meaning} ({item.language}){' '}
      {item.learned ? '✅ Learned' : '📘 Learning'}{' '}
      <button onClick={() => onToggle(item.id)}>
        Toggle Learned
      </button>{' '}
      <button onClick={() => onDelete(item.id)}>
        Delete
      </button>
    </li>
  );
}

type NewVocabInput = {
  term: string;
  meaning: string;
  language: string;
};

type VocabFormProps = {
  onAddItem: (input: NewVocabInput) => void;
}

function VocabForm({ onAddItem }: VocabFormProps) {
  const [term, setTerm] = useState('');
  const [meaning, setMeaning] = useState('');
  const [language, setLanguage] = useState('');

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!term.trim() || !meaning.trim() || !language.trim()) {
      return;
    }

    onAddItem({
      term: term.trim(),
      meaning: meaning.trim(),
      language: language.trim(),
    });

    setTerm('');
    setMeaning('');
    setLanguage('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Term"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <input
        placeholder="Meaning"
        value={meaning}
        onChange={(e) => setMeaning(e.target.value)}
      />
      <input
        placeholder="Language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}

function App() {
  const [vocabItems, setVocabItems] = useState<VocabItem[]>([
    { id: 1, term: 'Baum', meaning: 'tree', language: 'German', learned: true },
    { id: 2, term: 'chien', meaning: 'dog', language: 'French', learned: false },
    { id: 3, term: 'casa', meaning: 'house', language: 'Spanish', learned: false },
  ]);
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
    setVocabItems(
      vocabItems.map((item) => item.id === id ? { ...item, learned: !item.learned } : item)
    );
  }

  function deleteItem(id: number) {
    setVocabItems(vocabItems.filter((item) => item.id !== id));
  }

  function addItem(input: NewVocabInput) {
    const newItem: VocabItem = {
      id: Date.now(),
      term: input.term,
      meaning: input.meaning,
      language: input.language,
      learned: false,
    };

    setVocabItems([...vocabItems, newItem]);
  }

  return (
    <main>
      <h1>Vocabulary Tracker</h1>

      <VocabForm onAddItem={addItem} />

      <div>
        <label>
          Language:{' '}
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
          >
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </label>

        <label style={{ marginLeft: '1rem' }}>
          Status:{' '}
          <select
            value={learnedFilter}
            onChange={(e) => setLearnedFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="learned">Learned</option>
            <option value="unlearned">Learning</option>
          </select>
        </label>
      </div>

      {filteredItems.length === 0 ? (
        <p>No matching vocabulary items.</p>
      ) : (
        <ul>
          {filteredItems.map((item) => (
            <VocabItemComponent
              key={item.id}
              item={item}
              onToggle={toggleLearned}
              onDelete={deleteItem}
            />
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;