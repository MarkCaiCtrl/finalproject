import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';



function App() {

  const [triviaQuestion, setTriviaQuestion] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [currentPoints, setCurrentPoints] = useState(0);
  const [allPossibleAnswers, setAllPossibleAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  async function combineAllAnswers(incorrectAnswers, correctAnswer) {
    let allAnswers = [];
    incorrectAnswers.map((item) => {
      item.incorrect_answers.map((incorrectAnswer) => {
        allAnswers.push(incorrectAnswer)
      });
    });
    allAnswers.push(correctAnswer);
    allAnswers.sort(() => Math.random() - 0.5);
    setAllPossibleAnswers(allAnswers);
  }

  async function getTriviaData() {

    setLoading(true)
    try {
      const resp = await axios.get("https://opentdb.com/api.php?amount=1");
      setTriviaQuestion(resp.data.results);

    setCorrectAnswer(resp.data.results[0].correct_answer);

    await combineAllAnswers(resp.data.results, resp.data.results[0].correct_answer);
    } catch (error) {
      if (error.response.status === 429) {
        setTimeout(() => {
          getTriviaData();
        }, 3000);
      } else {
        setLoading(true)
      }
    }

    setLoading(false)
  }

  useEffect(() => {
    getTriviaData();
  }, []);

  function verifyAnswer(selectedAnswer) {
    if (selectedAnswer === correctAnswer) {
      setTimeout(() => {
        setTriviaQuestion([]);
        setAllPossibleAnswers([]);
        getTriviaData();
        setCurrentPoints(currentPoints + 1);
        setLoading(true)
      }, 0);
    } else {
      setCurrentPoints(currentPoints - 1);
    }
  }

  function removeCharacters(question) {
    return question.replace(/(&quot\;)/g, "\"").replace(/(&rsquo\;)/g, "\"").replace(/(&#039\;)/g, "\'").replace(/(&amp\;)/g, "\"");
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Trivia Game</h1>
        {loading ? "Trivia Question Loading..." : <div>
          <div className='points'>
            Current Points: {currentPoints}
          </div>
          <br />

          {triviaQuestion.map((triviaData, index) =>
            <div key={index}>
              <div className='question'>
                {removeCharacters(triviaData.question)}
              </div>
              <br />
              <div>
                {
                  allPossibleAnswers.map((answer, index) =>
                    <div key={index}>
                      <button key={index} onClick={() => verifyAnswer(answer)} >
                        {removeCharacters(answer)}
                      </button>
                    </div>
                  )
                }
              </div>
            </div>
          )}
        </div>
        }
      </header>
    </div>
  );
}

export default App;