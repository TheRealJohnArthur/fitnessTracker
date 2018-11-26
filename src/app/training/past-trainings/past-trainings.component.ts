import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['date', 'name', 'calories', 'duration', 'state'];
  dataSource = new MatTableDataSource<Exercise>();
  private exercisesHistorySubscription: Subscription;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {

    this.trainingService.fetchExerciseHistory();
    this.exercisesHistorySubscription = this.trainingService.emitExercisesHistory.subscribe(result => {
      this.dataSource.data = result;
    });
    this.dataSource.paginator = this.paginator;

  }

  ngAfterViewInit() {

    this.dataSource.sort = this.sort;

  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.exercisesHistorySubscription.unsubscribe();
  }
}
