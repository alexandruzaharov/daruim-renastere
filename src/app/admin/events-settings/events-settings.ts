import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { addDoc, collection, Firestore, serverTimestamp, Timestamp } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationSnackbar } from '@shared/components/notification-snackbar/notification-snackbar';
import { NotificationData } from '@shared/components/notification-snackbar/notification-snackbar.data';
import pica, { Pica } from 'pica';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';
import { MatTableModule } from '@angular/material/table';
import * as moment from 'moment';
import { EventsDataService } from '@shared/services/events-data/events-data';
import { Observable } from 'rxjs';
import { EventVMData } from '@shared/services/events-data/events-data.model';
import { AsyncPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { EventsSettingsDialogConfirm } from './events-settings-dialog-confirm/events-settings-dialog-confirm';


@Component({
  selector: 'app-events-settings',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule
  ],
  templateUrl: './events-settings.html',
  styleUrl: './events-settings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsSettings implements OnInit {
  private eventsDataService = inject(EventsDataService);
  private fb = inject(FormBuilder);
  private firestore = inject(Firestore);
  private snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  public vm$: Observable<EventVMData[]> = this.eventsDataService.vmEventsGiveRenaissance$;
  public eventForm: FormGroup;
  public selectedFile: File | null = null;
  public imagePreview: string | null = null;
  public isDragOver = false;
  public isSubmitting: boolean = false;
  public isResizing: boolean = false;
  public activeTab = 0;
  public displayedColumns: string[] = ['title', 'hosts', 'date', 'delete'];

  private smallFile?: File;
  private largeFile?: File;

  private pica: Pica;

  constructor() {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      hosts: this.fb.array([this.fb.control('', Validators.required)]),
      startDateTime: ['', Validators.required],
      startTime: ['', Validators.required],
      endDateTime: [''],
      online: [true],
      linkZoom: [''],
      meetingID: [''],
      passcode: [''],
      whatsAppGroup: [''],
      physicalLocation: [''],
    });

    this.pica = pica();
  }

  public ngOnInit(): void {
    this.eventForm.get('online')?.valueChanges.subscribe((isOnline: boolean) => {
      if (isOnline) {
        this.setOnlineValidators();
      } else {
        this.setOfflineValidators();
      }
    });

    const initialOnline = this.eventForm.get('online')?.value;
    if (initialOnline) {
      this.setOnlineValidators();
    } else {
      this.setOfflineValidators();
    }
  }

  public get hosts() {
    return this.eventForm.get('hosts') as FormArray;
  }

  public addHost() {
    this.hosts.push(this.fb.control('', Validators.required));
    this.cdr.detectChanges();
  }

  public removeHost(index: number) {
    this.hosts.removeAt(index);
  }

  public setActiveTab(index: number): void {
    this.activeTab = index;
  }

  public onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  public onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  public onFileDropped(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    if (event.dataTransfer?.files.length) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  public onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFile(input.files[0]);
    }
  }

  public async resizeImage(file: File, maxWidth: number, format: 'webp' | 'jpeg' = 'jpeg',): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scale;

        try {
          const fileBaseName = file.name.replace(/\.[^/.]+$/, '');
          const resultCanvas: HTMLCanvasElement = await this.pica.resize(img, canvas);

          const mimeType = format === 'webp' ? 'image/webp' : 'image/jpeg';
          const extension = format === 'webp' ? 'webp' : 'jpg';

          const blob: Blob = await this.pica.toBlob(resultCanvas, mimeType, 0.9);
          const resizedFile = new File([blob], `${fileBaseName}_${maxWidth}.${extension}`,
            {
              type: mimeType,
            }
          );

          resolve(resizedFile);
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = (e) => reject(e);
      img.src = URL.createObjectURL(file);
    });
  }

  private async handleFile(file: File) {
    this.isResizing = true;
    this.cdr.detectChanges();
    this.selectedFile = file;
    this.imagePreview = URL.createObjectURL(file);
    this.smallFile = await this.resizeImage(file, 400, 'webp');
    this.largeFile = await this.resizeImage(file, 1200);
    this.isResizing = false;
    this.cdr.detectChanges();
  }
  
  public removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.smallFile = undefined;
    this.largeFile = undefined;
  }

  public async saveEvent() {
    this.isSubmitting = true;
    this.cdr.detectChanges();
    if (!this.smallFile || !this.largeFile) {
      alert('Selectează o imagine înainte de a salva');
      return;
    }

    const storage = getStorage();

    const timestamp = Date.now();
    const smallFileBaseName = this.smallFile.name.replace(/\.[^/.]+$/, '');
    const largeFileBaseName = this.largeFile.name.replace(/\.[^/.]+$/, '');

    const smallFileExt = this.smallFile.name.split('.').pop();
    const largeFileExt = this.largeFile.name.split('.').pop();

    const smallFileNameBase = `${timestamp}_${smallFileBaseName}`;
    const largeFileNameBase = `${timestamp}_${largeFileBaseName}`;

    const smallPath = `events/${smallFileNameBase}_small.${smallFileExt}`;
    const largePath = `events/${largeFileNameBase}_large.${largeFileExt}`;

    const smallRef = ref(storage, smallPath);
    const largeRef = ref(storage, largePath);

    await uploadBytes(smallRef, this.smallFile);
    await uploadBytes(largeRef, this.largeFile);

    const smallUrl = await getDownloadURL(smallRef);
    const largeUrl = await getDownloadURL(largeRef);

    const startDate: Date = new Date(this.eventForm.value.startDateTime);
    const startTime: moment.Moment = this.eventForm.value.startTime;
    startDate.setHours(startTime.hours(), startTime.minutes(), 0, 0);

    const eventData = {
      imageSmall: smallUrl,
      imageLarge: largeUrl,
      startDateTime: Timestamp.fromDate(startDate),
      endDateTime: this.eventForm.value.endDateTime 
        ? Timestamp.fromDate(new Date(this.eventForm.value.endDateTime))
        : null,
      title: this.eventForm.value.title,
      hosts: this.eventForm.value.hosts,
      description: this.eventForm.value.description,
      online: this.eventForm.value.online,
      zoom: {
        link: this.eventForm.value.linkZoom,
        meetingID: this.eventForm.value.meetingID,
        passcode: this.eventForm.value.passcode,
      },
      whatsAppGroup: this.eventForm.value.whatsAppGroup,
      physicalLocation: this.eventForm.value.physicalLocation
    }

    try {
      const eventsCollection = collection(this.firestore, 'eventsGiveRenaissance');
      await addDoc(eventsCollection, {
        ...eventData,
        createdAt: serverTimestamp()
      });
      
      this.snackBar.openFromComponent(NotificationSnackbar, {
        duration: 3000,
        panelClass: ['notification-snackbar-wrapper'],
        data: {
          message: 'Eveniment creat cu succes!',
          type: 'success'
        } as NotificationData,
      });

    } catch (err) {
      console.error('Eroare la salvare:', err);
      this.snackBar.openFromComponent(NotificationSnackbar, {
        duration: 5000,
        panelClass: ['notification-snackbar-wrapper'],
        data: {
          message: 'Eroare la salvarea evenimentului. Te rugăm să încerci din nou.',
          type: 'error'
        } as NotificationData,
      });
    }

    this.eventForm.reset();
    this.isSubmitting = false;
    this.selectedFile = null;
    this.imagePreview = null;
    this.smallFile = undefined;
    this.largeFile = undefined;
    this.cdr.detectChanges();
  }

  public async deleteEvent(event: EventVMData) {
    this.dialog.open(EventsSettingsDialogConfirm, {
      data: event
    });
  }

  private setOnlineValidators() {
    this.eventForm.get('linkZoom')?.setValidators([Validators.required]);
    this.eventForm.get('meetingID')?.setValidators([Validators.required]);
    this.eventForm.get('passcode')?.setValidators([Validators.required]);
    this.eventForm.get('whatsAppGroup')?.setValidators([Validators.required]);

    this.eventForm.get('physicalLocation')?.clearValidators();

    this.updateValidation();
  }

  private setOfflineValidators() {
    this.eventForm.get('physicalLocation')?.setValidators([Validators.required]);

    this.eventForm.get('linkZoom')?.clearValidators();
    this.eventForm.get('meetingID')?.clearValidators();
    this.eventForm.get('passcode')?.clearValidators();
    this.eventForm.get('whatsAppGroup')?.clearValidators();

    this.updateValidation();
  }

  private updateValidation() {
    this.eventForm.get('linkZoom')?.updateValueAndValidity();
    this.eventForm.get('meetingID')?.updateValueAndValidity();
    this.eventForm.get('passcode')?.updateValueAndValidity();
    this.eventForm.get('whatsAppGroup')?.updateValueAndValidity();
    this.eventForm.get('physicalLocation')?.updateValueAndValidity();
  }
}
