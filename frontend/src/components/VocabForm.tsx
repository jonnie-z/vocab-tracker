import { useState } from "react";
import type { NewVocabInput } from "../types";

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

export default VocabForm;