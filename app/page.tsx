"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "scavenger-hunt-progress";

type Location = "craft" | "library";

interface Challenge {
  id: string;
  text: string;
  hint: string;
}

const craftChallenges: Challenge[] = [
  {
    id: "craft-foundation",
    text: "Find a canvas for our next chapter",
    hint: "Poster board, cork board, whatever feels like a fresh start",
  },
  {
    id: "craft-connection",
    text: 'Pick something that says "us"',
    hint: "A color, pattern, or material that feels like our relationship",
  },
  {
    id: "craft-adventure",
    text: "Grab something that screams adventure",
    hint: 'What does "new country, new life" look like to you?',
  },
  {
    id: "craft-friends",
    text: "Find something for the friends we'll make & keep",
    hint: "Old roots, new branches - however you see it",
  },
  {
    id: "craft-messy",
    text: "Choose one gloriously messy thing",
    hint: "Glitter, paint, something imperfect - embrace the chaos",
  },
];

const libraryChallenges: Challenge[] = [
  {
    id: "library-place",
    text: "Find a book about a place you want to explore together",
    hint: "A travel guide, photo book, or novel set somewhere dreamy",
  },
  {
    id: "library-hobby",
    text: "Discover something new you might want to try",
    hint: "A hobby, skill, or wild idea you've never considered before",
  },
  {
    id: "library-beauty",
    text: "Find an image that takes your breath away",
    hint: "Flip through art books, magazines, anything visual",
  },
  {
    id: "library-words",
    text: "Hunt for words that feel like the life you want",
    hint: "A quote, a headline, a phrase - something to clip or copy",
  },
  {
    id: "library-surprise",
    text: "Let a random book choose you",
    hint: "Close your eyes, wander, and grab whatever you touch first",
  },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function Home() {
  const [activeLocation, setActiveLocation] = useState<Location>("craft");
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setProgress(JSON.parse(saved));
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress, mounted]);

  const toggleItem = (id: string) => {
    setProgress((prev) => {
      const newProgress = { ...prev };
      if (newProgress[id]) {
        delete newProgress[id];
      } else {
        newProgress[id] = true;
      }
      return newProgress;
    });

    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const resetProgress = (location: Location) => {
    if (confirm("Start this hunt over?")) {
      setProgress((prev) => {
        const newProgress = { ...prev };
        Object.keys(newProgress).forEach((key) => {
          if (key.startsWith(location + "-")) {
            delete newProgress[key];
          }
        });
        return newProgress;
      });
    }
  };

  const getCompletedCount = (location: Location) => {
    const challenges = location === "craft" ? craftChallenges : libraryChallenges;
    return challenges.filter((c) => progress[c.id]).length;
  };

  const craftCompleted = getCompletedCount("craft");
  const libraryCompleted = getCompletedCount("library");

  if (!mounted) {
    return null;
  }

  return (
    <div className="container">
      <header>
        <h1>Crafternoon Scavenger Hunt</h1>
        <p className="subtitle">Dreaming about our next chapter together</p>
        <span className="vibe-tag">Experimental &amp; Messy</span>
      </header>

      <div className="location-tabs">
        <button
          className={`location-tab ${activeLocation === "craft" ? "active" : ""}`}
          onClick={() => setActiveLocation("craft")}
        >
          <span className="tab-icon">🎨</span>
          Craft Store
          <span className="tab-status">{craftCompleted}/5</span>
        </button>
        <button
          className={`location-tab ${activeLocation === "library" ? "active" : ""}`}
          onClick={() => setActiveLocation("library")}
        >
          <span className="tab-icon">📚</span>
          Library
          <span className="tab-status">{libraryCompleted}/5</span>
        </button>
      </div>

      {/* CRAFT STORE HUNT */}
      <div className={`hunt-section ${activeLocation === "craft" ? "active" : ""}`}>
        <div className={`completion-message ${craftCompleted === 5 ? "show" : ""}`}>
          <h2>Supplies gathered!</h2>
          <p>Time to head to the library for inspiration.</p>
        </div>

        <div className="progress-section">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(craftCompleted / 5) * 100}%` }}
            />
          </div>
          <p className="progress-text">
            {craftCompleted} of 5 found
          </p>
        </div>

        <div className="section">
          <h2 className="section-title">Your Supply Hunt</h2>

          {craftChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`challenge-item ${progress[challenge.id] ? "completed" : ""}`}
              onClick={() => toggleItem(challenge.id)}
            >
              <div className="checkbox">
                <CheckIcon />
              </div>
              <div className="challenge-content">
                <p className="challenge-text">{challenge.text}</p>
                <p className="challenge-hint">{challenge.hint}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="reset-btn" onClick={() => resetProgress("craft")}>
          Start Over
        </button>
      </div>

      {/* LIBRARY HUNT */}
      <div className={`hunt-section ${activeLocation === "library" ? "active" : ""}`}>
        <div className={`completion-message ${libraryCompleted === 5 ? "show" : ""}`}>
          <h2>Inspiration found!</h2>
          <p>Now let&apos;s make a beautiful mess and dream about what&apos;s next.</p>
        </div>

        <div className="progress-section">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(libraryCompleted / 5) * 100}%` }}
            />
          </div>
          <p className="progress-text">
            {libraryCompleted} of 5 found
          </p>
        </div>

        <div className="section">
          <h2 className="section-title">Your Inspiration Hunt</h2>

          {libraryChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`challenge-item ${progress[challenge.id] ? "completed" : ""}`}
              onClick={() => toggleItem(challenge.id)}
            >
              <div className="checkbox">
                <CheckIcon />
              </div>
              <div className="challenge-content">
                <p className="challenge-text">{challenge.text}</p>
                <p className="challenge-hint">{challenge.hint}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="reset-btn" onClick={() => resetProgress("library")}>
          Start Over
        </button>
      </div>

      <footer>
        <span className="heart">&#10084;</span> I can&apos;t wait to spend this day with you.
      </footer>
    </div>
  );
}
