import { useState, type FormEvent } from 'react';

interface EditDisplayNameProps {
  currentName: string;
  onSave: (name: string) => void;
  onCancel: () => void;
}

export function EditDisplayName({ currentName, onSave, onCancel }: EditDisplayNameProps) {
  const [name, setName] = useState(currentName);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) onSave(trimmed);
  };

  return (
    <div className="edit-name card" role="dialog" aria-labelledby="edit-name-title">
      <h2 id="edit-name-title" className="edit-name-title">
        Change display name
      </h2>
      <p className="edit-name-hint">
        Changing your name won&apos;t reset your streak or today&apos;s attempt.
      </p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="edit-display-name" className="guess-label">
          Display name
        </label>
        <input
          id="edit-display-name"
          type="text"
          className="text-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
          autoComplete="nickname"
          autoFocus
        />
        <div className="edit-name-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
