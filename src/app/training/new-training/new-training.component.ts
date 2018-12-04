import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UIService } from '../../shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  exercises: Exercise[];
  private exerciseSubscription: Subscription;
  loading = false;
  private loadingSubscription: Subscription;

  constructor(
    private trainingService: TrainingService,
    private uiService: UIService
  ) { }

  ngOnInit() {
    this.loadingSubscription = this.uiService.loadingState.subscribe(result => {
      this.loading = result;
    });
    this.fetchExercises();
    this.exerciseSubscription = this.trainingService.emitExercises.pipe().subscribe((e: Exercise[]) => {
      this.exercises = e;
    });
  }

  fetchExercises() {
    this.trainingService.fetchExercises();
  }

  onStartTraining(form: NgForm) {
    console.log(form.value.selectedExercise);
    this.trainingService.startExercise(form.value.selectedExercise);
  }

  ngOnDestroy() {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}
