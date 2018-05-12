import { BoggleService, Board } from './boggle';

const board: Board = {
    // rows: [
    //     ['A', 'B', 'C', 'D'],
    //     ['E', 'F', 'G', 'H'],
    //     ['I', 'J', 'K', 'L'],
    //     ['M', 'N', 'O', 'P']
    // ],
    rows: [
        ['A', 'B', 'C'],
        ['F', 'E', 'D'],
        ['G', 'H', 'I']
    ]
    // rows: [
    //     ['A', 'B'],
    //     ['C', 'D']
    // ]
};

const words = new BoggleService().solve(board);
console.log(words);
