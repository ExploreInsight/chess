import { createInitialBoard, type Board } from "@chess-game/chess";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { ChessBoard } from "./chess-board";

function getSquare(name: string): HTMLElement {
  const container = screen.getByRole("grid");
  const matches = within(container).getAllByLabelText(name);
  if (matches.length === 0) throw new Error(`No square with label "${name}"`);
  return matches[0]!;
}

describe("ChessBoard", () => {
  test("renders 32 pieces in the starting position", () => {
    render(
      <ChessBoard
        board={createInitialBoard()}
        selected={null}
        targets={[]}
        checkedKing={null}
        flipped={false}
        onSquareClick={() => undefined}
      />,
    );
    const cells = screen.getAllByRole("gridcell");
    expect(cells).toHaveLength(64);
    const pieceLabels = cells.filter((cell) => {
      const label = cell.getAttribute("aria-label") ?? "";
      return /(king|queen|rook|bishop|knight|pawn)/.test(label);
    });
    expect(pieceLabels).toHaveLength(32);
  });

  test("uses correct ARIA labels for squares and pieces", () => {
    render(
      <ChessBoard
        board={createInitialBoard()}
        selected={null}
        targets={[]}
        checkedKing={null}
        flipped={false}
        onSquareClick={() => undefined}
      />,
    );
    expect(getSquare("e2, white pawn")).toBeInTheDocument();
    expect(getSquare("e1, white king")).toBeInTheDocument();
    expect(getSquare("a8, black rook")).toBeInTheDocument();
    expect(getSquare("d8, black queen")).toBeInTheDocument();
    expect(getSquare("a4, empty")).toBeInTheDocument();
  });

  test("flips file and rank labels when flipped", () => {
    render(
      <ChessBoard
        board={createInitialBoard()}
        selected={null}
        targets={[]}
        checkedKing={null}
        flipped={true}
        onSquareClick={() => undefined}
      />,
    );
    expect(getSquare("h1, white rook")).toBeInTheDocument();
    expect(getSquare("a1, white rook")).toBeInTheDocument();
  });

  test("selecting a piece marks it aria-selected and clicks on target squares report engine coordinates", async () => {
    const user = userEvent.setup();
    const onSquareClick = vi.fn();

    const { rerender } = render(
      <ChessBoard
        board={createInitialBoard()}
        selected={null}
        targets={[]}
        checkedKing={null}
        flipped={false}
        onSquareClick={onSquareClick}
      />,
    );
    await user.click(getSquare("e2, white pawn"));
    expect(onSquareClick).toHaveBeenCalledWith({ row: 6, col: 4 });

    rerender(
      <ChessBoard
        board={createInitialBoard()}
        selected={{ row: 6, col: 4 }}
        targets={[{ row: 5, col: 4 }, { row: 4, col: 4 }]}
        checkedKing={null}
        flipped={false}
        onSquareClick={onSquareClick}
      />,
    );
    const selected = getSquare("e2, white pawn");
    expect(selected).toHaveAttribute("aria-selected", "true");
    await user.click(getSquare("e4, empty"));
    expect(onSquareClick).toHaveBeenLastCalledWith({ row: 4, col: 4 });
  });

  test("tints a capture destination green like the selected square", () => {
    const board: Board = createInitialBoard();
    board[5][3] = { type: "knight", color: "black", hasMoved: true };

    render(
      <ChessBoard
        board={board}
        selected={{ row: 6, col: 4 }}
        targets={[{ row: 5, col: 4 }, { row: 4, col: 4 }, { row: 5, col: 3 }]}
        checkedKing={null}
        flipped={false}
        onSquareClick={() => undefined}
      />,
    );

    const selected = getSquare("e2, white pawn");
    const capture = getSquare("d3, black knight");
    expect(selected.className).toContain("bg-square-selected");
    expect(capture.className).toContain("bg-square-selected");
  });

  test("renders the gray move dot on empty target squares", () => {
    render(
      <ChessBoard
        board={createInitialBoard()}
        selected={{ row: 6, col: 4 }}
        targets={[{ row: 5, col: 4 }, { row: 4, col: 4 }]}
        checkedKing={null}
        flipped={false}
        onSquareClick={() => undefined}
      />,
    );
    const empty = getSquare("e3, empty");
    const dot = empty.querySelector(".bg-move-indicator");
    expect(dot).not.toBeNull();
  });

  test("highlights a king in check with the check tile color", () => {
    const board: Board = createInitialBoard();
    board[0][4] = { type: "king", color: "black", hasMoved: true };
    board[7][3] = { type: "king", color: "white", hasMoved: true };
    board[3][4] = { type: "queen", color: "white", hasMoved: true };

    render(
      <ChessBoard
        board={board}
        selected={null}
        targets={[]}
        checkedKing={{ row: 0, col: 4 }}
        flipped={false}
        onSquareClick={() => undefined}
      />,
    );
    const king = getSquare("e8, black king");
    expect(king.className).toContain("bg-square-check");
  });
});
