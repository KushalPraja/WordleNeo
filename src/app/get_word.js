'use client';

import React, { useState, useEffect } from 'react';

const WordComponent = () => {
  const [word, setWord] = useState(null);

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const response = await fetch('https://random-word-api.herokuapp.com/word?length=6');
        const data = await response.json();
        const fetchedWord = data[0];

        console.log('Word:', fetchedWord);

        // Store the word in localStorage
        localStorage.setItem('word', fetchedWord);

        // Set the word in state
        setWord(fetchedWord);

      } catch (error) {
        console.error('Error fetching word:', error);
      }
    };

    fetchWord();
  }, []);

  return (
    <div>
      {word ? (
        <>
          <div>
            <div>Word: {word}</div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default WordComponent;
