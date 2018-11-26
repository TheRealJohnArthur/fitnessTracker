import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  exercises: Exercise[];
  exerciseSubscription: Subscription;

  constructor(
    private trainingService: TrainingService
  ) { }

  ngOnInit() {
    this.trainingService.fetchExercises();
    this.exerciseSubscription = this.trainingService.emitExercises.pipe().subscribe((e: Exercise[]) => {
      console.log(e);
      this.exercises = e;
    });
  }

  onStartTraining(form: NgForm) {
    console.log(form.value.selectedExercise);
    this.trainingService.startExercise(form.value.selectedExercise);
  }

  ngOnDestroy() {
    this.exerciseSubscription.unsubscribe();
  }
}
