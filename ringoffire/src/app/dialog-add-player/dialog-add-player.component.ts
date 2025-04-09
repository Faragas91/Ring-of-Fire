import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-player',
  templateUrl: './dialog-add-player.component.html',
  styleUrls: ['./dialog-add-player.component.scss']
})
export class DialogAddPlayerComponent {
  name: string = '';
  readonly dialogRef = Inject(MatDialogRef<DialogAddPlayerComponent>);
  constructor() {

  }

  onNoClick(): void {
    console.log('Dialog closed');
  }

}
