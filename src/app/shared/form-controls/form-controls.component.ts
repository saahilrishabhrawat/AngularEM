import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'form-controls',
  templateUrl: './form-controls.component.html',
  styleUrls: ['./form-controls.component.css']
})
export class FormControlsComponent implements OnInit {

  @Input() recordSessionStorageId: string;
  @Input() onCancelRoute: string;
  @Input() showSave: boolean = true;
  @Input() showCancel: boolean = true;
  @Output() onCancel: EventEmitter<any> = new EventEmitter();
  @Output() onSave: EventEmitter<any> = new EventEmitter();

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  private currentRoutePath: string;
  private currentRouteParams: Params;
  private currentRecordIndex: any;

  private storageRecordsIdentifiers: any;
  

  recordsInStorage = false;
  

  ngOnInit() {
    this.currentRoutePath = this.activatedRoute.routeConfig.path;
    this.activatedRoute.params.subscribe(params => {
      this.currentRouteParams = params;
        this.getRecordsFromStorage();
        this.findCurrentRecordIndex();

    });
  }

  onSaveClick() {
    this.onSave.emit();
  }

  onCancelClick() {
    this.onCancel.emit();
  }

  findCurrentRecordIndex() {
    if (
      !this.currentRouteParams 
      || this.currentRouteParams.length === 0 
      || !this.recordsInStorage
      || !this.storageRecordsIdentifiers
    ) {
      this.clearStorage();
      return;
    }

    this.currentRecordIndex = this.storageRecordsIdentifiers.findIndex(record => {
      return (
        record.pid === this.currentRouteParams.pid
        && record.cid === this.currentRouteParams.cid
        && record.aid === this.currentRouteParams.aid
        && record.gid === this.currentRouteParams.gid
      );
    });

    if (this.currentRecordIndex < 0) {
      this.clearStorage();
    }
  }

  redirectTo(uri) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
    this.router.navigate(uri));
  }

  onNextRecordClick() {
    this.redirectTo(this.getNextRecordRoute());
  }

  onPreviousRecordClick() {
    this.redirectTo(this.getPreviousRecordRoute());
  }

  getNextRecordRoute() {
    if (!this.recordsInStorage) {
      return null;
    }
    
    return [
      "../" + this.currentRoutePath,
      this.storageRecordsIdentifiers[this.currentRecordIndex + 1 === this.storageRecordsIdentifiers.length ? 0 : this.currentRecordIndex + 1],
    ];
  }

  getPreviousRecordRoute() {
    if (!this.recordsInStorage) {
      return null;
    }

    return [
      "../" + this.currentRoutePath,
      this.storageRecordsIdentifiers[this.currentRecordIndex - 1 < 0 ? this.storageRecordsIdentifiers.length - 1 : this.currentRecordIndex - 1],
    ];
  }

  getRecordsFromStorage() {
    this.storageRecordsIdentifiers = 
      JSON.parse(sessionStorage.getItem(this.recordSessionStorageId));

    if (this.storageRecordsIdentifiers && this.storageRecordsIdentifiers.length > 1) {
      this.recordsInStorage = true;
    }
  }

  clearStorage() {
    // Only clear specified storage id
    sessionStorage.setItem(this.recordSessionStorageId, null);
    this.recordsInStorage = false;
  }


}