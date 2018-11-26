import { Exercise } from "./exercise.model";
import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from "@angular/fire/firestore";
import { Subscription } from 'rxjs';

@Injectable()
export class TrainingService {
  private availableExercises: Exercise[];
  private runningExercise: Exercise;
  exerciseChanged = new Subject<Exercise>();
  emitExercises = new Subject<Exercise[]>();
  emitExercisesHistory = new Subject<Exercise[]>();
  private firebaseSubscription: Subscription[] = [];

  constructor(
    private db: AngularFirestore
  ) { }

  fetchExercises() {
    this.firebaseSubscription.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              ...doc.payload.doc.data() as Exercise
            };
          });
        })).subscribe((result: Exercise[]) => {
          this.availableExercises = result;
          this.emitExercises.next([...this.availableExercises]);
        }, error => {
          console.log(error);
        }));
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(e => e.id == selectedId);
    console.log('Running Exercise: ', this.runningExercise);
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.addDataToDatabase({ ...this.runningExercise, date: new Date(), state: 'completed' });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: "canceled"
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getCurrentExercise() {
    return { ...this.runningExercise };
  }

  fetchExerciseHistory() {
    this.firebaseSubscription.push(this.db
      .collection('finishedExercises')
      .valueChanges()
      .subscribe((result: Exercise[]) => {
        this.emitExercisesHistory.next(result);
      }, error => {
        console.log(error);
      }));
  }

  cancelSubscriptions() {
    this.firebaseSubscription.forEach(subscription => {
      subscription.unsubscribe();
    })
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}