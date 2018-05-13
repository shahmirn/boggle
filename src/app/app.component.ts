import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Board, BoggleService } from '../alg/boggle';
import { take } from 'rxjs/operators';

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

      input9: ['', Validators.required],
      input10: ['', Validators.required],
      input11: ['', Validators.required],
      input12: ['', Validators.required],

      input13: ['', Validators.required],
      input14: ['', Validators.required],
      input15: ['', Validators.required],
      input16: ['', Validators.required]
    });
  }

  solveBoggle() {
    const board: Board = {
      rows: [
        [
          this.formGroup.get('input1').value.toLowerCase(),
          this.formGroup.get('input2').value.toLowerCase(),
          this.formGroup.get('input3').value.toLowerCase(),
          this.formGroup.get('input4').value.toLowerCase()
        ],
        [
          this.formGroup.get('input5').value.toLowerCase(),
          this.formGroup.get('input6').value.toLowerCase(),
          this.formGroup.get('input7').value.toLowerCase(),
          this.formGroup.get('input8').value.toLowerCase()
        ],
        [
          this.formGroup.get('input9').value.toLowerCase(),
          this.formGroup.get('input10').value.toLowerCase(),
          this.formGroup.get('input11').value.toLowerCase(),
          this.formGroup.get('input12').value.toLowerCase()
        ],
        [
          this.formGroup.get('input13').value.toLowerCase(),
          this.formGroup.get('input14').value.toLowerCase(),
          this.formGroup.get('input15').value.toLowerCase(),
          this.formGroup.get('input16').value.toLowerCase()
        ]
      ]
    };

    // based on: https://stackoverflow.com/questions/20069828/how-to-convert-set-to-array
    this.boggleService.solve(board).pipe(
      take(1)
    ).subscribe(words => {
      this.words = Array.from(words).map(word => ({
        word: word,
        score: this.getScore(word)
      }));
      this.changeDetectorRef.markForCheck();
    });
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
