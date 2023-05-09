import { useState } from "react";
import { Square } from "./components/Square";
import { TURNS } from "./constants";
import "./App.css";
import { checkWinnerFrom, checkEndGame } from "./logic/board";
import { WinnerModal } from "./components/WinnerModal";
import { Footer } from "./components/Footer";

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromLocalStorage = localStorage.getItem("board");
    return boardFromLocalStorage
      ? JSON.parse(boardFromLocalStorage)
      : Array(9).fill(null);
  });
  const [turn, setTurn] = useState(() => {
    const turnFromLocalStorage = localStorage.getItem("turn");
    return turnFromLocalStorage ?? TURNS.X;
  });
  const [winner, setWinner] = useState(null);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
    localStorage.removeItem("board");
    localStorage.removeItem("turn");
  };

  const updateBoard = (index) => {
    //si ya tiene algo, esto hace q no se pueda modificar
    if (board[index] || winner) return;
    //actualiza el tablero
    const newBoard = [...board]; // se hace una copia del array, nunca sobreescribirlo !
    newBoard[index] = turn;
    setBoard(newBoard);
    //cambia el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);
    //guardar en el localstorage
    localStorage.setItem("board", JSON.stringify(newBoard));
    localStorage.setItem("turn", newTurn);
    //comprueba el ganador
    const newWinner = checkWinnerFrom(newBoard);
    if (newWinner) {
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false); //empate
    }
  };

  return (
    <main className="board">
      <h1>Ta Te Ti</h1>
      <button onClick={resetGame}>Empezar de nuevo</button>
      <section className="game">
        {board.map((_, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {board[index]}
            </Square>
          );
        })}
      </section>
      <section className="turn">
        <Square isSelected={turn === TURNS.X}> {TURNS.X} </Square>
        <Square isSelected={turn === TURNS.O}> {TURNS.O} </Square>
      </section>
      {<WinnerModal resetGame={resetGame} winner={winner} />}
      <Footer></Footer>
    </main>
  );
}
export default App;
