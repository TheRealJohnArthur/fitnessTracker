import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { StopTrainingComponent } from './stop-training.component';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {

  currentProgress: number = 0;
  timer;

  constructor(
    private dialog: MatDialog,
    private trainingService: TrainingService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.startOrResumeTimer();
  }

  startOrResumeTimer() {
    const step = this.trainingService.getCurrentExercise().duration / 100 * 1000
    this.timer = setInterval(() => {
      this.currentProgress = this.currentProgress + 1;
      if (this.currentProgress >= 100) {
        clearInterval(this.timer);
        this.snackBar.open("You've done it! Progress was saved in your history", 'Ok', {duration: 5000});
        this.trainingService.completeExercise();
      }
    }, step);
  }

  onStopTimer() {
    clearInterval(this.timer);
    const dialogResponse = this.dialog.open(StopTrainingComponent, {data: {
      progress: this.currentProgress
    }});
    dialogResponse.afterClosed().subscribe(result => {
      if(result) {
        this.trainingService.cancelExercise(this.currentProgress);
      } else {
        this.startOrResumeTimer();
      }
    });
  }
}
