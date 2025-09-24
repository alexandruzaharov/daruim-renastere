import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EnrollDataService } from '@shared/services/enroll-data/enroll-data';
import { combineLatest, take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationSnackbar } from '@shared/components/notification-snackbar/notification-snackbar';
import { NotificationData } from '@shared/components/notification-snackbar/notification-snackbar.data';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-mentors-settings',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './mentors-settings.html',
  styleUrl: './mentors-settings.scss'
})
export class MentorsSettings implements OnInit {
  private fb = inject(FormBuilder);
  private firestore = inject(Firestore);
  private enrollData = inject(EnrollDataService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  public form!: FormGroup;
  public mentors$ = this.enrollData.mentors$;
  public isSaving: boolean = false;

  public months = [
    'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
    'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
  ];

  public ngOnInit(): void {
    combineLatest([this.enrollData.monthlyMentors$, this.mentors$])
    .pipe(take(1))
    .subscribe(([monthlyMentors]) => {
      const controls: any = {};
      for (let i = 1; i <=12; i++) {
        const existing = monthlyMentors.find(m => m.month === i);
        controls[i] = this.fb.control(existing?.mentorId || null);
      }
      this.form = this.fb.group(controls);
      this.cdr.detectChanges();
    })
  }

  public async save() {
    if (!this.form) return;

    this.isSaving = true;
    this.cdr.detectChanges();
    const updatedMonthlyMentors = Object.keys(this.form.value).map(key => ({
      month: +key,
      mentorId: this.form.value[key]
    }));

    const monthlyMentorsDoc = doc(this.firestore, 'monthlyMentors/3jl5AjORuvYN09YZuXAk');
    await updateDoc(monthlyMentorsDoc, { monthlyMentors: updatedMonthlyMentors });

    this.snackBar.openFromComponent(NotificationSnackbar, {
      duration: 3000,
      panelClass: ['notification-snackbar-wrapper'],
      data: {
        message: 'Ordinea îndrumătorilor a fost schimbată!',
        type: 'success'
      } as NotificationData,
    });
    this.isSaving = false;
    this.cdr.detectChanges();
  }
}
