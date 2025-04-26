import { useState, useEffect } from 'react';

let wordList = [];

function matchesConstraints(word, prefix, suffix, contains) {
  if (prefix && !word.startsWith(prefix.toLowerCase())) return false;
  if (suffix && !word.endsWith(suffix.toLowerCase())) return false;
  if (contains && !word.includes(contains.toLowerCase())) return false;
  return true;
}

function findWords(letters, prefix, suffix, contains) {
  const inputLetters = letters.toLowerCase().replace(/\s/g, "?");
  return wordList.filter(word => {
    let tempLetters = inputLetters.split("");
    for (let char of word) {
      const index = tempLetters.findIndex(l => l === char || l === "?");
      if (index === -1) return false;
      tempLetters.splice(index, 1);
    }
    return matchesConstraints(word, prefix, suffix, contains);
  });
}

export default function ScrabbleHelper() {
  const [letters, setLetters] = useState('');
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [contains, setContains] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch('/sowpods.txt')
      .then(response => response.text())
      .then(text => {
        wordList = text.split('\n').map(word => word.trim().toLowerCase());
      });
  }, []);

  const handleSearch = () => {
    const foundWords = findWords(letters, prefix, suffix, contains);
    setResults(foundWords.sort((a, b) => b.length - a.length));
  };

  const handleClear = () => {
    setLetters('');
    setPrefix('');
    setSuffix('');
    setContains('');
    setResults([]);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f2f2f2',
      paddingTop: '40px',
      fontFamily: 'Helvetica, Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{
        fontSize: '3rem',
        color: '#e60012',
        marginBottom: '30px'
      }}>Scrabble Helper</h1>

      <div style={{
        background: '#ffffff',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        width: '90%',
        maxWidth: '460px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <input
          placeholder="Letters (use '?' or SPACE)"
          value={letters}
          onChange={(e) => setLetters(e.target.value)}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '16px',
            borderRadius: '12px',
            border: '1px solid #ccc',
            boxSizing: 'border-box'
          }}
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          width: '100%'
        }}>
          <input
            placeholder="Prefix"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            style={{
              padding: '12px',
              fontSize: '16px',
              borderRadius: '12px',
              border: '1px solid #ccc',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
          <input
            placeholder="Suffix"
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            style={{
              padding: '12px',
              fontSize: '16px',
              borderRadius: '12px',
              border: '1px solid #ccc',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
          <input
            placeholder="Contains"
            value={contains}
            onChange={(e) => setContains(e.target.value)}
            style={{
              padding: '12px',
              fontSize: '16px',
              borderRadius: '12px',
              border: '1px solid #ccc',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{
          display: 'flex',
          gap: '10px',
          width: '100%'
        }}>
          <button
            onClick={handleSearch}
            style={{
              flex: '1',
              backgroundColor: '#e60012',
              color: '#ffffff',
              padding: '14px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.3s',
              boxSizing: 'border-box'
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#cc0010'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#e60012'}
          >
            Find Words
          </button>

          <button
            onClick={handleClear}
            style={{
              flex: '1',
              backgroundColor: '#999999',
              color: '#ffffff',
              padding: '14px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.3s',
              boxSizing: 'border-box'
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#777777'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#999999'}
          >
            Clear
          </button>
        </div>

        <div style={{
          marginTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {results.length > 0 ? (
            results.map((word, index) => (
              <div key={index} style={{
                backgroundColor: '#f7f7f7',
                padding: '10px',
                borderRadius: '10px',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: '500',
                boxSizing: 'border-box'
              }}>
                {word}
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#777', fontSize: '16px' }}>
              No words found yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
