import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Board, BoggleService } from '../alg/boggle';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  formGroup: FormGroup;
  words: { word: string, score: number }[];

  displayedColumns = ['word', 'score'];

  constructor(
    private formBuilder: FormBuilder,
    private boggleService: BoggleService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // from: https://angular.io/guide/reactive-forms
    this.formGroup = this.formBuilder.group({
      input1: ['', Validators.required],
      input2: ['', Validators.required],
      input3: ['', Validators.required],

      input4: ['', Validators.required],
      input5: ['', Validators.required],
      input6: ['', Validators.required],

      input7: ['', Validators.required],
      input8: ['', Validators.required],
      input9: ['', Validators.required]
    });
  }

  solveBoggle() {
    const board: Board = {
      rows: [
        [this.formGroup.get('input1').value, this.formGroup.get('input2').value, this.formGroup.get('input3').value],
        [this.formGroup.get('input4').value, this.formGroup.get('input5').value, this.formGroup.get('input6').value],
        [this.formGroup.get('input7').value, this.formGroup.get('input8').value, this.formGroup.get('input9').value]
      ]
    };

    // based on: https://stackoverflow.com/questions/20069828/how-to-convert-set-to-array
    this.words = Array.from(this.boggleService.solve(board)).map(word => ({
      word: word,
      score: this.getScore(word)
    }));
    this.changeDetectorRef.markForCheck();
  }

  getScore(word: string) {
    if (word.length < 5) {
      return 1;
    } else if (word.length === 5) {
      return 2;
    } else if (word.length === 6) {
      return 3;
    } else if (word.length === 7) {
      return 5;
    } else {
      return 11;
    }
  }
}
