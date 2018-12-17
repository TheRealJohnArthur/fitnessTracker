import { Exercise } from "./exercise.model";
import { Injectable } from "@angular/core";
import { map, take } from 'rxjs/operators';
import { AngularFirestore } from "@angular/fire/firestore";
import { Subscription } from 'rxjs';
import { UIService } from "../shared/ui.service";
import { Store } from '@ngrx/store';
import * as UI from '../shared/ui.actions';
import * as fromTraining from './training.reducer';
import * as Training from './training.actions';

@Injectable()
export class TrainingService {

  private firebaseSubscription: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) { }

  fetchExercises() {
    this.store.dispatch(new UI.StartLoading());
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
          this.store.dispatch(new UI.StopLoading());
          this.store.dispatch(new Training.SetAvailableTrainings(result));
        }, error => {
          this.store.dispatch(new UI.StopLoading());
          this.uiService.showSnackBar(error.message, null, 3000);
        }));
  }

  startExercise(selectedId: string) {
    // console.log('exercise started:', selectedId);
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    this.store.select(fromTraining.getCurrentExercise).pipe(take(1)).subscribe(result => {
      this.addDataToDatabase({ 
        ...result, 
        date: new Date(), 
        state: 'completed' 
      });
      this.store.dispatch(new Training.StopTraining());
    });
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getCurrentExercise).pipe(take(1)).subscribe(result => {
      this.addDataToDatabase({
        ...result,
        duration: result.duration * (progress / 100),
        calories: result.calories * (progress / 100),
        date: new Date(),
        state: "canceled"
      });
      this.store.dispatch(new Training.StopTraining());
    });
  }

  fetchExerciseHistory() {
    this.firebaseSubscription.push(this.db
      .collection('finishedExercises')
      .valueChanges()
      .subscribe((result: Exercise[]) => {
        this.store.dispatch(new Training.SetFinishedTrainings(result));
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