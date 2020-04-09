import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
  const [count, setCount] = useState(0);
  const [showReset, setShowReset] = useState(false);
  const [showCapacityWarning, setShowCapacityWarning] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      const { data } = await axios({
        method: "get",
        url: "https://api.jsonbin.io/b/5e8fa748172eb64389611f6b",
        headers: {
          "secret-key":
            "$2b$10$uQu337FpZHoeD1Ah4SIUGOzxKNhiz2ixQopfnYM2HAWvkOdahQDdS",
        },
      });

      setCount(data.count);
    };

    fetchCount();
  }, []);

  useEffect(() => {
    setShowCapacityWarning(count >= 250 ? true : false);
  }, [count]);

  const updateCount = async () => {
    const { data } = await axios({
      method: "get",
      url: "https://api.jsonbin.io/b/5e8fa748172eb64389611f6b",
      headers: {
        "secret-key":
          "$2b$10$uQu337FpZHoeD1Ah4SIUGOzxKNhiz2ixQopfnYM2HAWvkOdahQDdS",
      },
    });

    return data.count;
  };

  const increaseCount = async () => {
    if (count >= 999) {
      alert(`Can't go any higher!`);
    } else {
      const updatedCount = await updateCount();
      const result = await axios.put(
        "https://api.jsonbin.io/b/5e8fa748172eb64389611f6b",
        { count: updatedCount + 1 },
        {
          headers: {
            "Content-Type": "application/json",
            "secret-key":
              "$2b$10$uQu337FpZHoeD1Ah4SIUGOzxKNhiz2ixQopfnYM2HAWvkOdahQDdS",
            versioning: false,
          },
        }
      );

      setCount(result.data.data.count);
    }
  };

  const decreaseCount = async () => {
    if (count <= 0) {
      alert(`No negative guest counts!`);
    } else {
      const updatedCount = await updateCount();
      const result = await axios.put(
        "https://api.jsonbin.io/b/5e8fa748172eb64389611f6b",
        { count: updatedCount - 1 },
        {
          headers: {
            "Content-Type": "application/json",
            "secret-key":
              "$2b$10$uQu337FpZHoeD1Ah4SIUGOzxKNhiz2ixQopfnYM2HAWvkOdahQDdS",
            versioning: false,
          },
        }
      );

      setCount(result.data.data.count);
    }
  };

  const clearCount = () => {
    setShowReset(true);
  };

  const clearCountForReal = async () => {
    const result = await axios.put(
      "https://api.jsonbin.io/b/5e8fa748172eb64389611f6b",
      { count: 0 },
      {
        headers: {
          "Content-Type": "application/json",
          "secret-key":
            "$2b$10$uQu337FpZHoeD1Ah4SIUGOzxKNhiz2ixQopfnYM2HAWvkOdahQDdS",
          versioning: false,
        },
      }
    );

    setCount(result.data.data.count);
    setShowReset(false);
  };

  const actuallyNeverMind = () => {
    setShowReset(false);
  };

  const manualSetCount = async () => {
    const newValue = prompt("What is the current guest count? (0-999)");

    switch (newValue) {
      case null:
        break;
      default:
        if (isNaN(newValue)) {
          alert(`That's not a number!`);
        } else if (newValue >= 1000) {
          alert("Too big! 999 is the max");
        } else if (newValue <= -1) {
          alert("No negative guest counts. Duh");
        } else {
          const result = await axios.put(
            "https://api.jsonbin.io/b/5e8fa748172eb64389611f6b",
            { count: parseInt(newValue, 10) },
            {
              headers: {
                "Content-Type": "application/json",
                "secret-key":
                  "$2b$10$uQu337FpZHoeD1Ah4SIUGOzxKNhiz2ixQopfnYM2HAWvkOdahQDdS",
                versioning: false,
              },
            }
          );

          setCount(result.data.data.count);
        }
    }
  };

  return (
    <div className="container">
      <h1>Guest Count</h1>
      {showCapacityWarning && (
        <h4>The store is at or past capacity; start limiting entry</h4>
      )}
      <h3>{count}</h3>
      {!showReset && (
        <>
          <div className="plus-and-minus">
            <button className="minus" onClick={decreaseCount}>
              -
            </button>
            <button className="plus" onClick={increaseCount}>
              +
            </button>
          </div>
          <button onClick={clearCount}>Reset</button>
          <button onClick={manualSetCount}>Change current guest count</button>
        </>
      )}
      {showReset && (
        <>
          <h4>Are you sure?</h4>
          <button onClick={clearCountForReal}>I'm sure!</button>
          <button onClick={actuallyNeverMind}>On second thought, nah</button>
        </>
      )}
    </div>
  );
};

export default App;
