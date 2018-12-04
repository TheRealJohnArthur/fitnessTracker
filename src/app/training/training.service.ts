import { Exercise } from "./exercise.model";
import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from "@angular/fire/firestore";
import { Subscription } from 'rxjs';
import { UIService } from "../shared/ui.service";

@Injectable()
export class TrainingService {
  private availableExercises: Exercise[];
  private runningExercise: Exercise;
  exerciseChanged = new Subject<Exercise>();
  emitExercises = new Subject<Exercise[]>();
  emitExercisesHistory = new Subject<Exercise[]>();
  private firebaseSubscription: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService
  ) { }

  fetchExercises() {
    this.uiService.loadingState.next(true);
    this.firebaseSubscription.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(
        map(docArray => {
          // throw(new Error('Error getting the list of exercises from server.'));
          return docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              ...doc.payload.doc.data() as Exercise
            };
          });
        })).subscribe((result: Exercise[]) => {
          this.uiService.loadingState.next(false);
          this.availableExercises = result;
          this.emitExercises.next([...this.availableExercises]);
        }, error => {
          this.uiService.loadingState.next(false);
          this.uiService.showSnackBar(error.message, null, 3000);
          this.emitExercises.next(null);
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
        this.uiService.showSnackBar(error.message, null, 3000);
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