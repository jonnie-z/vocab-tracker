type FilterBarProps = {
  languageFilter: string;
  learnedFilter: string;
  languages: string[];
  onLanguageFilterChange: (value: string) => void;
  onLearnedFilterChange: (value: string) => void;
};

function FilterBar({
  languageFilter,
  learnedFilter,
  languages,
  onLanguageFilterChange,
  onLearnedFilterChange,
}: FilterBarProps) {
  return (
    <div>
      <label>
        Language:{' '}
        <select
          value={languageFilter}
          onChange={(e) => onLanguageFilterChange(e.target.value)}
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
          onChange={(e) => onLearnedFilterChange(e.target.value)}
        >
          <option value="all">All</option>
          <option value="learned">Learned</option>
          <option value="unlearned">Learning</option>
        </select>
      </label>
    </div>
  );
}

export default FilterBar;