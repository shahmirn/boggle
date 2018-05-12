import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { publishReplay, refCount, map, take } from 'rxjs/operators';

export interface Board {
    rows: string[][];
}

interface ValidMove {
    row: number;
    col: number;
}

interface Pos extends ValidMove {
    previousMoves: ValidMove[];
}

interface Dictionary {
    [key: string]: boolean;
}

@Injectable()
export class BoggleService {
    private dictionary: Observable<Dictionary>;

    constructor(private http:  HttpClient) {
        // dictionary from https://github.com/dwyl/english-words/blob/master/words_dictionary.json
        this.dictionary = this.http.get<Dictionary>('/assets/words_dictionary.json')
        .pipe(
            publishReplay(),
            refCount()
        );

        // pre-load dictionary
        this.dictionary.pipe(take(1)).subscribe();
    }

    public solve(board: Board): Observable<Set<string>> {
        return this.dictionary.pipe(
            map(dictionary => {
                const rowMax = board.rows[0].length;
                const colMax = board.rows.length;

                const words = new Set();
                const positions: Pos[] = [];

                for (let rowCount = 0; rowCount < rowMax; rowCount++) {
                    for (let colCount = 0; colCount < colMax; colCount++) {
                        positions.push({
                            row: rowCount,
                            col: colCount,
                            previousMoves: []
                        });
                    }
                }

                while (positions.length) {
                    const move = positions.shift();

                    const previousMoves: ValidMove[] = [...move.previousMoves];
                    previousMoves.push({ row: move.row, col: move.col });

                    positions.push(...this.getValidPositions(board, rowMax, colMax, previousMoves, move.row, move.col));

                    let word = '';
                    move.previousMoves.forEach(previousMove => {
                        word += board.rows[previousMove.row][previousMove.col];
                    });
                    word += board.rows[move.row][move.col];

                    if (dictionary[word.toLowerCase()]) {
                        words.add(word);
                    }
                }

                words.forEach(word => {
                    if (word.length < 3) {
                        words.delete(word);
                    }
                });

                return words;
            })
        );
    }

    private getValidPositions(board: Board, rowMax: number, colMax: number, previousMoves: ValidMove[], rowPosition: number,
        colPosition: number): Pos[] {

        const topLeft = { row: rowPosition - 1, col: colPosition - 1 };
        const top = { row: rowPosition, col: colPosition - 1 };
        const topRight = { row: rowPosition + 1, col: colPosition - 1 };

        const left = { row: rowPosition - 1, col: colPosition };
        const right = { row: rowPosition + 1, col: colPosition };

        const bottomLeft = { row: rowPosition - 1, col: colPosition + 1 };
        const bottom = { row: rowPosition, col: colPosition + 1 };
        const bottomRight = { row: rowPosition + 1, col: colPosition + 1 };

        const validPos: Pos[] = [];

        if (topLeft.row > -1 && topLeft.col > -1 && this.isValidMove(board, previousMoves, topLeft)) {
            validPos.push({ ...topLeft, previousMoves });
        }

        if (top.col > -1 && this.isValidMove(board, previousMoves, top)) {
            validPos.push({ ...top, previousMoves });
        }

        if (topRight.row < rowMax && topRight.col > -1 && this.isValidMove(board, previousMoves, topRight)) {
            validPos.push({ ...topRight, previousMoves });
        }

        if (left.row > -1 && this.isValidMove(board, previousMoves, left)) {
            validPos.push({ ...left, previousMoves });
        }

        if (right.row < rowMax && this.isValidMove(board, previousMoves, right)) {
            validPos.push({ ...right, previousMoves });
        }

        if (bottomLeft.row > -1 && bottomLeft.row < rowMax && bottomLeft.col < colMax &&
            this.isValidMove(board, previousMoves, bottomLeft)) {
            validPos.push({ ...bottomLeft, previousMoves });
        }

        if (bottom.col < colMax && this.isValidMove(board, previousMoves, bottom)) {
            validPos.push({ ...bottom, previousMoves });
        }

        if (bottomRight.row < rowMax && bottomRight.col < colMax && this.isValidMove(board, previousMoves, bottomRight)) {
            validPos.push({ ...bottomRight, previousMoves });
        }

        return validPos;
    }

    private isValidMove(board: Board, previousMoves: ValidMove[], move: ValidMove) {
        const previouslyVisited = previousMoves.find(m => m.row === move.row && m.col === move.col);
        if (previouslyVisited) {
            return false;
        } else {
            const letter = board.rows[move.row][move.col];
            const letterAlreadyUsed = previousMoves.find(m => board.rows[m.row][m.col] === letter);

            return !letterAlreadyUsed;
        }
    }
}
