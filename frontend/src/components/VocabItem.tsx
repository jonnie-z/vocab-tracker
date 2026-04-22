import { useState } from "react";
import type { VocabItem } from "../types";

type VocabItemProps = {
  item: VocabItem;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (item: VocabItem) => void;
};

function VocabItemComponent({ item, onToggle, onDelete, onUpdate }: VocabItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTerm, setEditTerm] = useState(item.term);
  const [editMeaning, setEditMeaning] = useState(item.meaning);
  const [editLanguage, setEditLanguage] = useState(item.language);

  function handleSave() {
    if (!editTerm.trim() || !editMeaning.trim() || !editLanguage.trim()) {
      return;
    }

    onUpdate({
      ...item,
      term: editTerm.trim(),
      meaning: editMeaning.trim(),
      language: editLanguage.trim(),
    });

    setIsEditing(false);
  }

  function handleCancel() {
    setEditTerm(item.term);
    setEditMeaning(item.meaning);
    setEditLanguage(item.language);
    setIsEditing(false);
  }

  return (
    <li>
      {isEditing ? (
        <>
          <input
            value={editTerm}
            onChange={(e) => setEditTerm(e.target.value)}
          />
          <input
            value={editMeaning}
            onChange={(e) => setEditMeaning(e.target.value)}
          />
          <input
            value={editLanguage}
            onChange={(e) => setEditLanguage(e.target.value)}
          />

          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <>
          <b>{item.term}</b> - {item.meaning} ({item.language}){' '}
          {item.learned ? '✅ Learned' : '📘 Learning'} {' '}
          <button onClick={() => setIsEditing(true)}>Edit</button>{' '}
          <button onClick={() => onToggle(item.id)}>Toggle Learned</button>{' '}
          <button onClick={() => onDelete(item.id)}>Delete</button>
        </>
      )}
    </li >
  );
}

export default VocabItemComponent;